import { useState } from 'react';
import { all, day, del, put, setDay, settings } from '../store/store';
import { useUi } from '../uiState';
import { isRest } from '../domain/cycle';
import { totals } from '../domain/nutrition';
import { checkinDueIn, checkinText, weekSummary } from '../domain/summary';
import { fmtN, locale, t } from '../lib/i18n';
import { addDays, numOrNull, parseISO, r1, uid } from '../lib/util';
import { fmtD } from '../lib/format';
import { Icon, NoteField, NumField, Sheet, Track, confirmAsk, toast } from '../components/ui';
import { Info } from '../components/Glossary';
import type { Checkin } from '../types';

function streak(test: (d: string) => boolean, from: string) {
  let n = 0, d = from;
  if (!test(d)) d = addDays(d, -1);
  while (test(d) && n < 3650) { n++; d = addDays(d, -1); }
  return n;
}

async function copyCheckin(c: Checkin) {
  const text = checkinText(c);
  try { await navigator.clipboard.writeText(text); toast(t('copied')); }
  catch { if (navigator.share) await navigator.share({ text }).catch(() => {}); }
}

export function Habits() {
  const { date } = useUi();
  const s = settings(), rec = day(date);
  const [ck, setCk] = useState(false);
  const water = rec?.water ?? 0;
  const days = Array.from({ length: 7 }, (_, i) => addDays(date, i - 6));
  const rows: [string, (d: string) => number][] = [
    ...s.habits.map(h => [h.name, (d: string) => (day(d)?.habits?.[h.id] ? 1 : 0)] as [string, (d: string) => number]),
    [t('water'), d => { const v = day(d)?.water ?? 0; return v >= s.water ? 1 : v >= s.water / 2 ? 0.5 : 0; }],
    [t('steps'), d => { const v = day(d)?.steps ?? 0; return v >= s.steps ? 1 : v >= s.steps / 2 ? 0.5 : 0; }],
    [t('sleep'), d => { const v = day(d)?.sleep ?? 0; return v >= s.sleep ? 1 : v >= s.sleep - 1.5 ? 0.5 : 0; }],
    [t('workout'), d => (all('workouts').some(w => w.date === d) ? 1 : isRest(d) ? 0.5 : 0)],
    [t('followedPlan'), d => { const { target, eaten } = totals(d); return target.kcal && eaten.kcal / target.kcal >= 0.8 ? 1 : eaten.kcal > 0 ? 0.5 : 0; }],
  ];
  const dueIn = checkinDueIn(date);
  const cs = all('checkins').sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <div className={`card ${dueIn === 0 ? 'accent' : ''}`}>
        <h2><Icon n="flag" s={18} />{t('checkin')}<Info id="checkin" s={14} /></h2>
        <div className="row"><span className="sp">{dueIn === 0 ? t('checkinDue') : <span className="muted">{t('checkinIn', dueIn)}</span>}</span><button className={`btn ${dueIn === 0 ? 'primary' : 'sm'}`} onClick={() => setCk(true)}>{t('startCheckin')}</button></div>
      </div>

      <div className="card">
        <h2><Icon n="drop" s={18} />{t('water')}<span className="sp" /><b>{fmtN(water)}</b><span className="muted small">/ {fmtN(s.water)} ml</span></h2>
        <Track pct={(water / s.water) * 100} color="var(--c)" h={12} />
        <div className="row wrap" style={{ marginTop: 12 }}>
          <button className="btn sm" onClick={() => setDay(date, d => { d.water = Math.max(0, d.water - s.glass); })}>−{s.glass}</button>
          <button className="btn sm primary" onClick={() => setDay(date, d => { d.water += s.glass; })}>+{s.glass} ml</button>
          <button className="btn sm" onClick={() => setDay(date, d => { d.water += 500; })}>+500</button>
          <button className="btn sm" onClick={() => setDay(date, d => { d.water += 1000; })}>+1000</button>
        </div>
      </div>

      <div className="grid2" style={{ marginBottom: 12 }}>
        <div className="card" style={{ margin: 0 }}>
          <h2>{t('steps')}<Info id="steps" s={14} /></h2>
          <NumField value={rec?.steps ?? null} placeholder={fmtN(s.steps)} step="1" onCommit={v => setDay(date, d => { d.steps = numOrNull(v); })} />
          <div style={{ marginTop: 10 }}><Track pct={((rec?.steps ?? 0) / s.steps) * 100} color="var(--good)" /></div>
        </div>
        <div className="card" style={{ margin: 0 }}>
          <h2>{t('sleep')} ({t('hoursShort')})<Info id="sleep" s={14} /></h2>
          <NumField value={rec?.sleep ?? null} placeholder={String(s.sleep)} step="0.25" onCommit={v => setDay(date, d => { d.sleep = numOrNull(v); })} />
          <div style={{ marginTop: 10 }}><Track pct={((rec?.sleep ?? 0) / s.sleep) * 100} color="var(--accent)" /></div>
        </div>
      </div>

      <div className="card">
        <h2><Icon n="habits" s={18} />{t('dailyHabits')}<span className="sp" /><a className="ib" href="#settings"><Icon n="edit" s={16} /></a></h2>
        {s.habits.length ? s.habits.map(h => {
          const on = !!rec?.habits?.[h.id], sk = streak(d => !!day(d)?.habits?.[h.id], date);
          return (
            <div className="habit" key={h.id}>
              <button className={`chk ${on ? 'on' : ''}`} onClick={() => setDay(date, d => { d.habits[h.id] = !d.habits[h.id]; })}>{on && <Icon n="check" s={16} />}</button>
              <span className="sp">{h.name}</span>{sk > 0 && <span className="chip good">🔥 {t('streak', sk)}</span>}
            </div>
          );
        }) : <div className="empty">{t('noHabits')}</div>}
      </div>

      <div className="card">
        <h2><Icon n="note" s={18} />{t('journal')} · <span className="muted">{fmtD(date)}</span></h2>
        <NoteField value={rec?.journal ?? ''} placeholder={t('journalHint')} rows={3} onSave={v => setDay(date, d => { d.journal = v; })} />
      </div>

      <div className="card">
        <h2>{t('last7')}</h2>
        <table className="wk">
          <thead><tr><th />{days.map(d => <th key={d}>{parseISO(d).toLocaleDateString(locale(), { weekday: 'narrow' })}</th>)}</tr></thead>
          <tbody>{rows.map(([n, f]) => <tr key={n}><td title={n}>{n}</td>{days.map(d => { const v = f(d); return <td key={d}><span className={`dot ${v === 1 ? 'on' : v ? 'half' : ''}`} /></td>; })}</tr>)}</tbody>
        </table>
      </div>

      <details className="card">
        <summary>{t('pastCheckins')} ({cs.length})</summary>
        <div style={{ marginTop: 8 }}>
          {cs.length ? cs.map(c => (
            <details key={c.id} style={{ borderTop: '1px solid var(--line)', padding: '9px 0' }}>
              <summary className="small">{fmtD(c.date, { day: 'numeric', month: 'long', year: 'numeric' })}{c.summary?.avgWeight != null ? ` · ${r1(c.summary.avgWeight)} kg` : ''}</summary>
              <pre className="small" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: '8px 0' }}>{checkinText(c)}</pre>
              <div className="row"><button className="btn sm" onClick={() => void copyCheckin(c)}><Icon n="copy" s={14} />{t('copyForCoach')}</button><span className="sp" />
                <button className="btn sm bad" onClick={() => { if (confirmAsk(t('confirmDelete'))) del('checkins', c.id); }}><Icon n="trash" s={14} />{t('del')}</button></div>
            </details>
          )) : <div className="empty">{t('noCheckins')}</div>}
        </div>
      </details>

      {ck && <CheckinSheet date={date} onClose={() => setCk(false)} />}
    </>
  );
}

function CheckinSheet({ date, onClose }: { date: string; onClose: () => void }) {
  const sum = weekSummary(date);
  const [v, setV] = useState({ energy: 3, hunger: 3, sleepQ: 3, stress: 3, digestion: 3, dietAdh: sum.adherence != null ? String(Math.round(sum.adherence)) : '', wins: '', struggles: '', questions: '' });
  const Scale = ({ k }: { k: 'energy' | 'hunger' | 'sleepQ' | 'stress' | 'digestion' }) => (
    <label className="f"><span>{t(k)} <span className="muted">(1 {t('low')} – 5 {t('high')})</span></span>
      <div className="scale">{[1, 2, 3, 4, 5].map(n => <button type="button" key={n} className={v[k] === n ? 'on' : ''} onClick={() => setV({ ...v, [k]: n })}>{n}</button>)}</div></label>
  );
  const St = ({ l, val }: { l: Parameters<typeof t>[0]; val: string }) => <div className="stat"><small>{t(l)}</small><b>{val}</b></div>;
  const save = (copy: boolean) => {
    const c: Checkin = { id: uid(), date, ...v, summary: { ...sum, start: null, end: null } as unknown as Record<string, number | null> };
    put('checkins', c.id, c);
    if (copy) void copyCheckin(c); else toast(t('saved'));
    onClose();
  };
  return (
    <Sheet open onClose={onClose} title={`${t('checkin')} · ${fmtD(date)}`}
      footer={<><span className="sp" /><button className="btn" onClick={() => save(false)}>{t('save')}</button><button className="btn primary" onClick={() => save(true)}><Icon n="copy" s={14} />{t('save')} + {t('copyForCoach')}</button></>}>
      <div className="muted small" style={{ marginBottom: 6 }}>{t('weekSummary')}</div>
      <div className="grid3" style={{ marginBottom: 14 }}>
        <St l="avgWeight" val={sum.avgWeight != null ? `${r1(sum.avgWeight)}${sum.weightChange != null ? ` (${sum.weightChange > 0 ? '+' : ''}${r1(sum.weightChange)})` : ''}` : '—'} />
        <St l="workouts" val={`${sum.workouts}/${sum.planned}`} />
        <St l="planFollowed" val={sum.adherence != null ? Math.round(sum.adherence) + '%' : '—'} />
        <St l="avgKcal" val={sum.avgKcal != null ? fmtN(sum.avgKcal) : '—'} />
        <St l="avgWater" val={sum.avgWater != null ? fmtN(sum.avgWater) : '—'} />
        <St l="avgSleep" val={sum.avgSleep != null ? r1(sum.avgSleep) + t('hoursShort') : '—'} />
      </div>
      <Scale k="energy" /><Scale k="hunger" /><Scale k="sleepQ" /><Scale k="stress" /><Scale k="digestion" />
      <label className="f"><span>{t('dietAdh')}</span><input type="number" value={v.dietAdh} onChange={e => setV({ ...v, dietAdh: e.target.value })} /></label>
      {(['wins', 'struggles', 'questions'] as const).map(k => <label className="f" key={k}><span>{t(k)}</span><textarea value={v[k]} onChange={e => setV({ ...v, [k]: e.target.value })} /></label>)}
    </Sheet>
  );
}
