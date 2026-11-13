import { useState, useSyncExternalStore } from 'react';
import { dumpAll, importAll, loadStore, put, setSettings, settings, wipeLocal, flushLocal } from '../store/store';
import { cloudConfigured, onSyncChange, photoAsDataURL, savePhoto, signOut, syncInfo, syncNow } from '../store/sync';
import { idb } from '../store/idb';
import { defaultPlan } from '../data/plan';
import { t } from '../lib/i18n';
import { todayISO, uid } from '../lib/util';
import { Icon, NumField, Seg, confirmAsk, toast } from '../components/ui';
import type { Settings as S } from '../types';

export const useSync = () => { useSyncExternalStore(onSyncChange, () => `${syncInfo.state}|${syncInfo.last}|${syncInfo.session?.user.id ?? ''}`); return syncInfo; };

export function Settings({ onShowAuth }: { onShowAuth: () => void }) {
  const s = settings();
  const sync = useSync();
  const [habit, setHabit] = useState('');
  const num = (k: keyof S, label: Parameters<typeof t>[0]) => (
    <label className="f"><span>{t(label)}</span><NumField value={s[k] as number} onCommit={v => { const n = parseFloat(v); if (n > 0) setSettings(x => { (x as unknown as Record<string, number>)[k] = n; }); }} /></label>
  );

  const exportData = async () => {
    await flushLocal();
    const docs = dumpAll();
    const photos: Record<string, string> = {};
    for (const k of await idb.blobKeys()) { const d = await photoAsDataURL(String(k)); if (d) photos[String(k)] = d; }
    const blob = new Blob([JSON.stringify({ app: 'fitlife', v: 2, exported: new Date().toISOString(), docs, photos })], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `fitlife-backup-${todayISO()}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  };
  const importData = async (f: File | undefined) => {
    if (!f) return;
    try {
      const d = JSON.parse(await f.text());
      if (d.app !== 'fitlife' || !Array.isArray(d.docs)) throw new Error('bad');
      if (!confirmAsk(t('confirmImport'))) return;
      importAll(d.docs);
      for (const [k, url] of Object.entries(d.photos ?? {})) await savePhoto(k, await (await fetch(url as string)).blob());
      toast(t('imported'));
    } catch { toast(t('badFile')); }
  };

  return (
    <>
      <div className="row" style={{ marginBottom: 12 }}><a className="btn sm" href="#home"><Icon n="left" s={14} className="flip" />{t('back')}</a><h1 style={{ margin: 0 }}>{t('settings')}</h1></div>

      <div className="card">
        <h2><Icon n="cloud" s={18} />{t('account')}</h2>
        {!cloudConfigured ? <div className="muted small">{t('notConfigured')}</div>
          : sync.session ? <>
            <div className="small" style={{ marginBottom: 6 }}>{t('signedInAs', sync.session.user.email ?? '')}</div>
            <div className="muted small" style={{ marginBottom: 10 }}>
              {sync.state === 'syncing' ? t('syncing') : sync.state === 'offline' ? t('syncOffline') : sync.state === 'error' ? `${t('syncError')}: ${sync.error}` : sync.last ? t('lastSync', new Date(sync.last).toLocaleTimeString()) : ''}
            </div>
            <div className="row wrap"><button className="btn sm" onClick={() => void syncNow()}>{t('syncNow')}</button><button className="btn sm bad" onClick={() => void signOut()}>{t('signOut')}</button></div>
          </> : <>
            <div className="muted small" style={{ marginBottom: 10 }}>{t('localOnly')}</div>
            <button className="btn primary sm" onClick={onShowAuth}>{t('signIn')}</button>
          </>}
      </div>

      <div className="card">
        <label className="f"><span>{t('lang')}</span><Seg value={s.lang} onChange={v => setSettings(x => { x.lang = v; })} options={[['en', 'English'], ['ar', 'العربية']]} /></label>
        <label className="f" style={{ margin: 0 }}><span>{t('theme')}</span><Seg value={s.theme} onChange={v => setSettings(x => { x.theme = v; })} options={[['auto', t('auto')], ['light', t('light')], ['dark', t('dark')]]} /></label>
      </div>

      <div className="card">
        <h2>{t('targets')}</h2>
        <div className="grid2" style={{ gap: '0 12px' }}>
          {num('water', 'waterTarget')}{num('glass', 'glass')}{num('steps', 'stepsTarget')}{num('sleep', 'sleepTarget')}{num('plateStep', 'plateStep')}
        </div>
        <div className="muted tiny">{t('macrosFromPlan')}</div>
      </div>

      <div className="card">
        <h2>{t('habitsEdit')}</h2>
        {s.habits.map(h => (
          <div className="row" key={h.id} style={{ padding: '4px 0' }}>
            <input type="text" defaultValue={h.name} onBlur={e => { const v = e.target.value.trim(); if (v && v !== h.name) setSettings(x => { const hh = x.habits.find(y => y.id === h.id); if (hh) hh.name = v; }); }} />
            <button className="ib" onClick={() => { if (confirmAsk(t('confirmDelete'))) setSettings(x => { x.habits = x.habits.filter(y => y.id !== h.id); }); }}><Icon n="trash" s={16} /></button>
          </div>
        ))}
        <form className="row" style={{ paddingTop: 4 }} onSubmit={e => { e.preventDefault(); const v = habit.trim(); if (!v) return; setSettings(x => { x.habits.push({ id: uid(), name: v }); }); setHabit(''); }}>
          <input type="text" placeholder={t('newHabit')} value={habit} onChange={e => setHabit(e.target.value)} />
          <button className="btn sm primary" type="submit"><Icon n="plus" s={14} /></button>
        </form>
      </div>

      <div className="card">
        <h2>{t('cycle')}</h2>
        <label className="f" style={{ margin: 0 }}><span>{t('cycleStart')}</span><input type="date" value={s.cycleStart} onChange={e => e.target.value && setSettings(x => { x.cycleStart = e.target.value; })} /></label>
      </div>

      <div className="card">
        <h2>{t('data')}</h2>
        <div className="row wrap">
          <button className="btn primary sm" onClick={() => void exportData()}>{t('exportBtn')}</button>
          <label className="btn sm">{t('importBtn')}<input type="file" accept="application/json,.json" hidden onChange={e => void importData(e.target.files?.[0])} /></label>
        </div>
        <hr />
        <div className="row wrap">
          <button className="btn sm" onClick={() => { if (confirmAsk(t('confirmResetPlan'))) put('plan', 'main', defaultPlan()); }}>{t('resetPlan')}</button>
          <button className="btn sm bad" onClick={async () => { if (!confirmAsk(t('confirmErase'))) return; if (sync.session) await signOut(); else { await wipeLocal(); await loadStore(); } location.hash = '#home'; }}>{t('eraseAll')}</button>
        </div>
      </div>
      <div className="muted tiny" style={{ textAlign: 'center' }}>FitLife · v{__APP_VERSION__}</div>
    </>
  );
}
