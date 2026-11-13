import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { applyRemote, dirtyRows, flushLocal, markClean, setOnDirty, wipeLocal, loadStore } from './store';
import { idb } from './idb';

const URL_ = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const cloudConfigured = !!(URL_ && KEY && !URL_.includes('YOUR-PROJECT'));
export const sb: SupabaseClient | null = cloudConfigured ? createClient(URL_!, KEY!, { auth: { persistSession: true, autoRefreshToken: true } }) : null;

export type SyncState = 'local' | 'idle' | 'syncing' | 'offline' | 'error';
export const syncInfo = { state: 'local' as SyncState, last: 0 as number, error: '' as string, session: null as Session | null };
const listeners = new Set<() => void>();
export const onSyncChange = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const set = (s: Partial<typeof syncInfo>) => { Object.assign(syncInfo, s); listeners.forEach(l => l()); };

const TABLE = 'docs';
const BUCKET = 'photos';
let running: Promise<void> | null = null;
let again = false;
let pushT: ReturnType<typeof setTimeout> | null = null;

async function doSync() {
  const s = syncInfo.session; if (!sb || !s) return;
  if (!navigator.onLine) { set({ state: 'offline' }); return; }
  set({ state: 'syncing' });
  try {
    await flushLocal();
    // push
    const rows = dirtyRows();
    for (let i = 0; i < rows.length; i += 200) {
      const chunk = rows.slice(i, i + 200);
      const { error } = await sb.from(TABLE).upsert(chunk.map(r => ({ user_id: s.user.id, col: r.col, id: r.id, data: r.data, deleted: r.deleted, client_ts: r.ts })), { onConflict: 'user_id,col,id' });
      if (error) throw error;
      markClean(chunk);
    }
    // pull (5 s overlap so rows committed out of order are not missed; applying twice is harmless)
    let cursor = (await idb.getMeta<string>('cursor')) ?? '1970-01-01T00:00:00Z';
    for (;;) {
      const since = new Date(new Date(cursor).getTime() - 5000).toISOString();
      const { data, error } = await sb.from(TABLE).select('col,id,data,deleted,client_ts,updated_at').gt('updated_at', since).order('updated_at').limit(1000);
      if (error) throw error;
      if (!data.length) break;
      applyRemote(data);
      const next = data[data.length - 1].updated_at as string;
      if (next === cursor || data.length < 1000) { cursor = next; break; }
      cursor = next;
    }
    await idb.setMeta('cursor', cursor);
    await flushLocal();
    await uploadPhotos();
    set({ state: 'idle', last: Date.now(), error: '' });
  } catch (e) {
    console.error('sync failed', e);
    set({ state: navigator.onLine ? 'error' : 'offline', error: (e as Error)?.message ?? String(e) });
  }
}
export function syncNow(): Promise<void> {
  if (running) { again = true; return running; }
  running = doSync().finally(() => { running = null; if (again) { again = false; void syncNow(); } });
  return running;
}

/* ---------- photos (Supabase Storage, cached locally) ---------- */
async function uploadPhotos() {
  const s = syncInfo.session; if (!sb || !s) return;
  for (const k of await idb.blobKeys()) {
    const b = await idb.getBlob(String(k));
    if (!b || b.uploaded) continue;
    const { error } = await sb.storage.from(BUCKET).upload(`${s.user.id}/${k}.jpg`, b.blob, { upsert: true, contentType: 'image/jpeg' });
    if (error) throw error;
    await idb.setBlob(String(k), { ...b, uploaded: true });
  }
}
export async function savePhoto(id: string, blob: Blob) {
  await idb.setBlob(id, { blob, uploaded: false });
  urlCache.delete(id);
  schedulePush();
}
export async function deletePhoto(id: string) {
  await idb.delBlob(id); urlCache.delete(id);
  const s = syncInfo.session;
  if (sb && s) await sb.storage.from(BUCKET).remove([`${s.user.id}/${id}.jpg`]).catch(() => {});
}
const urlCache = new Map<string, Promise<string | null>>();
export function photoURL(id: string): Promise<string | null> {
  if (!urlCache.has(id)) urlCache.set(id, (async () => {
    const local = await idb.getBlob(id);
    if (local) return URL.createObjectURL(local.blob);
    const s = syncInfo.session; if (!sb || !s) return null;
    const { data, error } = await sb.storage.from(BUCKET).download(`${s.user.id}/${id}.jpg`);
    if (error || !data) { urlCache.delete(id); return null; }
    await idb.setBlob(id, { blob: data, uploaded: true });
    return URL.createObjectURL(data);
  })());
  return urlCache.get(id)!;
}
export async function photoAsDataURL(id: string): Promise<string | null> {
  const b = (await idb.getBlob(id))?.blob; if (!b) return null;
  return new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(b); });
}

/* ---------- lifecycle ---------- */
export function schedulePush() {
  if (!syncInfo.session) return;
  if (pushT) clearTimeout(pushT);
  pushT = setTimeout(() => void syncNow(), 1500);
}

export async function startSync() {
  setOnDirty(schedulePush);
  if (!sb) { set({ state: 'local' }); return; }
  const { data } = await sb.auth.getSession();
  await adoptSession(data.session);
  sb.auth.onAuthStateChange((_e, session) => { void adoptSession(session); });
  window.addEventListener('online', () => void syncNow());
  window.addEventListener('offline', () => set({ state: 'offline' }));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) void syncNow(); });
  setInterval(() => { if (!document.hidden) void syncNow(); }, 60_000);
}

async function adoptSession(session: Session | null) {
  const prevUser = syncInfo.session?.user.id;
  if (session?.user.id === prevUser && session) { syncInfo.session = session; return; }
  if (!session) { set({ session: null, state: 'local' }); return; }
  // A different account than the one this device last synced with: start from a clean slate.
  const owner = await idb.getMeta<string>('owner');
  if (owner && owner !== session.user.id) { await wipeLocal(); await loadStore(); }
  await idb.setMeta('owner', session.user.id);
  set({ session });
  await syncNow();
}

export async function signIn(email: string, password: string) {
  if (!sb) throw new Error('Cloud sync is not configured');
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
}
export async function signUp(email: string, password: string) {
  if (!sb) throw new Error('Cloud sync is not configured');
  const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.origin + location.pathname } });
  if (error) throw error;
  return !data.session; // true → needs email confirmation
}
export async function signOut() {
  await syncNow().catch(() => {});
  await sb?.auth.signOut();
  await wipeLocal(); await loadStore();
  set({ session: null, state: 'local' });
}
