import { useSyncExternalStore } from 'react';
import { idb, type DocRow } from './idb';
import { clone, todayISO } from '../lib/util';
import { defaultPlan } from '../data/plan';
import type { BodyEntry, Checkin, DayLog, Food, Plan, Settings, Workout } from '../types';

/**
 * Local-first document store. Every piece of data is a document `{col, id}`.
 * Changes are written to IndexedDB immediately and marked dirty; sync.ts pushes them to Supabase.
 * Last write wins per document, using the client timestamp `ts`.
 */
export interface Collections {
  settings: Settings;
  plan: Plan;
  foods: Food;
  days: DayLog;
  workouts: Workout;
  active: Workout;
  body: BodyEntry;
  checkins: Checkin;
  notes: { text: string };
}
export type Col = keyof Collections;

type Meta = { ts: number; deleted: boolean; dirty: boolean };
const data = new Map<string, unknown>();
const meta = new Map<string, Meta>();
const key = (col: string, id: string) => `${col}/${id}`;

let version = 0;
const listeners = new Set<() => void>();
const emit = () => { version++; listeners.forEach(l => l()); };
export const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
/** Re-render when anything in the store changes. */
export const useStoreVersion = () => useSyncExternalStore(subscribe, () => version);

let onDirty: () => void = () => {};
export const setOnDirty = (fn: () => void) => { onDirty = fn; };

const pending = new Map<string, DocRow>();
let flushT: ReturnType<typeof setTimeout> | null = null;
const queue = (row: DocRow) => {
  pending.set(row.k, row);
  if (flushT) clearTimeout(flushT);
  flushT = setTimeout(flushLocal, 120);
};
export async function flushLocal() {
  if (flushT) { clearTimeout(flushT); flushT = null; }
  const rows = [...pending.values()]; pending.clear();
  await idb.putDocs(rows);
}

export function get<C extends Col>(col: C, id: string): Collections[C] | undefined {
  const k = key(col, id);
  return meta.get(k)?.deleted ? undefined : (data.get(k) as Collections[C] | undefined);
}
export function all<C extends Col>(col: C): Collections[C][] {
  const out: Collections[C][] = []; const p = col + '/';
  for (const [k, v] of data) if (k.startsWith(p) && !meta.get(k)?.deleted) out.push(v as Collections[C]);
  return out;
}
export function ids(col: Col): string[] {
  const out: string[] = []; const p = col + '/';
  for (const k of data.keys()) if (k.startsWith(p) && !meta.get(k)?.deleted) out.push(k.slice(p.length));
  return out;
}

export function put<C extends Col>(col: C, id: string, value: Collections[C]) {
  const k = key(col, id), ts = Math.max(Date.now(), (meta.get(k)?.ts ?? 0) + 1);
  data.set(k, value); meta.set(k, { ts, deleted: false, dirty: true });
  queue({ k, col, id, data: value, ts, deleted: false, dirty: true });
  emit(); onDirty();
}
export function del(col: Col, id: string) {
  const k = key(col, id); if (!data.has(k)) return;
  const ts = Math.max(Date.now(), (meta.get(k)?.ts ?? 0) + 1);
  data.set(k, null); meta.set(k, { ts, deleted: true, dirty: true });
  queue({ k, col, id, data: null, ts, deleted: true, dirty: true });
  emit(); onDirty();
}
/** Copy-on-write update: fn receives a draft clone (or the fallback) and mutates it. */
export function update<C extends Col>(col: C, id: string, fallback: () => Collections[C], fn: (draft: Collections[C]) => void) {
  const cur = get(col, id);
  const draft = cur ? clone(cur) : fallback();
  fn(draft);
  put(col, id, draft);
}

/* ---------- sync helpers (used by sync.ts) ---------- */
export function dirtyRows(): DocRow[] {
  const out: DocRow[] = [];
  for (const [k, m] of meta) if (m.dirty) { const [col, ...rest] = k.split('/'); out.push({ k, col, id: rest.join('/'), data: data.get(k) ?? null, ts: m.ts, deleted: m.deleted, dirty: true }); }
  return out;
}
export function markClean(rows: DocRow[]) {
  const changed: DocRow[] = [];
  for (const r of rows) { const m = meta.get(r.k); if (m && m.ts === r.ts && m.dirty) { m.dirty = false; changed.push({ ...r, dirty: false }); } }
  changed.forEach(queue);
}
/** Apply a remote document if it is newer than the local copy (or the local copy is an unsaved seed). */
export function applyRemote(rows: { col: string; id: string; data: unknown; deleted: boolean; client_ts: number }[]) {
  let n = 0;
  for (const r of rows) {
    const k = key(r.col, r.id), m = meta.get(k);
    if (m && m.ts > r.client_ts) continue; // local is newer (and will be pushed)
    data.set(k, r.deleted ? null : r.data); meta.set(k, { ts: r.client_ts, deleted: r.deleted, dirty: false });
    queue({ k, col: r.col, id: r.id, data: r.deleted ? null : r.data, ts: r.client_ts, deleted: r.deleted, dirty: false });
    n++;
  }
  if (n) emit();
  return n;
}

/* ---------- boot ---------- */
/** Seeds are written with ts 0 and not dirty, so any copy from the account wins over them. */
function seed<C extends Col>(col: C, id: string, value: Collections[C]) {
  const k = key(col, id); if (meta.has(k)) return;
  data.set(k, value); meta.set(k, { ts: 0, deleted: false, dirty: false });
  queue({ k, col, id, data: value, ts: 0, deleted: false, dirty: false });
}
export const defaultSettings = (): Settings => ({
  lang: navigator.language?.startsWith('ar') ? 'ar' : 'en', theme: 'auto', cycleStart: todayISO(),
  water: 3000, glass: 250, steps: 10000, sleep: 8, swapMode: 'auto', plateStep: 2.5,
  habits: [{ id: 'mag', name: 'Magnesium glycinate before bed' }],
});

export async function loadStore() {
  const rows = await idb.allDocs();
  data.clear(); meta.clear();
  for (const r of rows) { data.set(r.k, r.data); meta.set(r.k, { ts: r.ts, deleted: r.deleted, dirty: r.dirty }); }
  seed('settings', 'main', defaultSettings());
  seed('plan', 'main', defaultPlan());
  emit();
}
export async function wipeLocal() {
  data.clear(); meta.clear(); pending.clear();
  await idb.clearDocs(); await idb.clearMeta(); await idb.clearBlobs();
}
/** Raw dump for backups. */
export function dumpAll() {
  const out: { col: string; id: string; data: unknown; ts: number }[] = [];
  for (const [k, m] of meta) if (!m.deleted) { const [col, ...rest] = k.split('/'); out.push({ col, id: rest.join('/'), data: data.get(k), ts: m.ts }); }
  return out;
}
export function importAll(rows: { col: string; id: string; data: unknown }[]) {
  for (const r of rows) put(r.col as Col, r.id, r.data as never);
}

/* ---------- typed convenience ---------- */
export const settings = () => get('settings', 'main') ?? defaultSettings();
export const setSettings = (fn: (s: Settings) => void) => update('settings', 'main', defaultSettings, fn);
export const plan = () => get('plan', 'main') ?? defaultPlan();
export const setPlan = (fn: (p: Plan) => void) => update('plan', 'main', defaultPlan, fn);
export const emptyDay = (): DayLog => ({ eaten: {}, swaps: {}, extras: [], water: 0, steps: null, sleep: null, habits: {} });
export const day = (date: string) => get('days', date);
export const setDay = (date: string, fn: (d: DayLog) => void) => update('days', date, emptyDay, fn);
export const note = (k: string) => get('notes', k)?.text ?? '';
export const setNote = (k: string, text: string) => (text.trim() ? put('notes', k, { text }) : del('notes', k));
