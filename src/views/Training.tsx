import { useState } from 'react';
import { all, del, get, note, plan, put, setNote, setPlan, setSettings, update } from '../store/store';
import { setUi, startRest, ui, useUi } from '../uiState';
import { cycleIdx } from '../domain/cycle';
import { alternatives, e1rm, exById, isCardio, lastSets, setsDone, suggestion, volumeOf, workoutsSorted } from '../domain/training';
import { EXERCISES, MUSCLES } from '../data/exercises';
import { fmtN, L, t, tSets } from '../lib/i18n';
import { addDays, mmss, num, r1, uid } from '../lib/util';
import { fmtD } from '../lib/format';
import { Chart, Icon, NoteField, Sheet, confirmAsk, toast } from '../components/ui';
import { VideoSheet } from '../components/VideoSheet';
import { Info } from '../components/Glossary';
import type { LoggedSet, PlanExercise, Workout } from '../types';

export function startWorkout(dayIdx: number) {
  const d = plan().training.days[dayIdx];
  const w: Workout = {
    id: uid(), date: ui.date, dayUid: d.uid, name: d.name, start: Date.now(),
    exercises: d.exercises.map(pe => ({
      uid: uid(), exId: pe.exId, cardio: isCardio(pe.exId),
      sets: pe.sets.map(s => ({ w: '', r: '', rir: '', done: false, tr: s.reps, trir: s.rir, rest: s.rest })),
    })),
  };
  put('active', 'main', w);
  if (location.hash !== '#training') location.hash = '#training';
}

export function Training() {
  const { date } = useUi();
  const active = get('active', 'main');
  const [video, setVideo] = useState<string | null>(null);
  if (active) return <><Active w={active} onVideo={setVideo} /><VideoSheet exId={video} onClose={() => setVideo(null)} /></>;
  return <><PlanView date={date} onVideo={setVideo} /><VideoSheet exId={video} onClose={() => setVideo(null)} /></>;
}

/* ---------- plan ---------- */
function PlanView({ date, onVideo }: { date: string; onVideo: (id: string) => void }) {
  const p = plan(), days = p.training.days, td = cycleIdx(date);
  const [sel, setSel] = useState<number | null>(null);
  const [edit, setEdit] = useState(false);
  const [exEdit, setExEdit] = useState<{ di: number; ei: number | null } | null>(null);
  const [notesOpen, setNotesOpen] = useState<string | null>(null);
  const di = sel ?? td, d = days[di];
  return (
    <>
      <div className="row" style={{ marginBottom: 10 }}>
        <div className="sp"><div className="muted small">{t('program')} <Info id="split" s={13} /></div><b>{p.training.name}</b></div>
        <button className={`btn sm ${edit ? 'primary' : ''}`} onClick={() => setEdit(!edit)}><Icon n="edit" s={14} />{edit ? t('doneEditing') : t('editPlan')}</button>
      </div>
      <div className="days">
        {days.map((x, i) => (
          <button key={x.uid} className={`${i === di ? 'sel' : ''} ${i === td ? 'today' : ''} ${x.rest ? 'rest' : ''}`} onClick={() => setSel(i)}>
            <small>{i === td ? t('today') : t('dayN', i + 1)}</small><b>{L(x.name)}</b>
          </button>
        ))}
      </div>
      <div className="card">
        <div className="row" style={{ marginBottom: 6 }}>
          <h2 className="sp" style={{ margin: 0 }}>{L(d.name)}</h2>
          {di !== td && <button className="btn sm ghost" onClick={() => { setSettings(s => { s.cycleStart = addDays(date, -di); }); setSel(null); }}>{t('makeToday')}</button>}
        </div>
        {d.rest && !d.exercises.length && <div className="empty">{t('restDayMsg')}</div>}
        {d.exercises.map((pe, ei) => {
          const ex = exById(pe.exId), last = lastSets(pe.exId), sug = isCardio(pe.exId) ? null : suggestion(pe.sets, last);
          const rirs = pe.sets.map(s => s.rir).filter(x => x != null);
          const my = note('ex:' + pe.exId);
          return (
            <div className="ex" key={pe.uid}>
              <div className="exh">
                <b className="sp">{L(ex.name)}</b>
                <span className="chip">{L(MUSCLES[ex.muscle] ?? ex.muscle)}</span>
                {ex.video && <button className="ib" title={t('video')} onClick={() => onVideo(ex.id)}><Icon n="video" s={18} /></button>}
                <button className={`ib ${my ? 'on' : ''}`} title={t('myNote')} onClick={() => setNotesOpen(notesOpen === pe.uid ? null : pe.uid)}><Icon n="note" s={18} /></button>
                {edit && <>
                  <button className="ib" onClick={() => setPlan(pp => { const ex2 = pp.training.days[di].exercises; if (ei > 0) [ex2[ei - 1], ex2[ei]] = [ex2[ei], ex2[ei - 1]]; })}><Icon n="up" s={16} /></button>
                  <button className="ib" onClick={() => setExEdit({ di, ei })}><Icon n="edit" s={16} /></button>
                </>}
              </div>
              <div className="exsub">
                {isCardio(pe.exId) ? `${pe.sets[0]?.reps} ${t('minCol')}` : `${tSets(pe.sets.length)} × ${pe.sets[0]?.reps}${rirs.length ? ` · RIR ${rirs.join(', ')}` : ''} · ${t('restTimer')} ${mmss(pe.sets[0]?.rest ?? 0)}`}
              </div>
              {pe.note && <div className="exsub"><Icon n="bulb" s={13} className="" /> {L(pe.note)}</div>}
              {last && <div className="hint hold">{t('lastTime')}: {last.map(s => isCardio(pe.exId) ? `${s.r} ${t('minCol')}` : `${s.w || 0}×${s.r || 0}`).join(', ')}</div>}
              {sug && <div className={`hint ${sug.kind}`}><Icon n="trend" s={13} />{t(sug.kind === 'up' ? 'suggestUp' : sug.kind === 'hold' ? 'suggestHold' : 'suggestDown', r1(sug.weight))}<Info id="double" s={12} /></div>}
              {(notesOpen === pe.uid) ? <div style={{ marginTop: 6 }}><NoteField value={my} onSave={v => setNote('ex:' + pe.exId, v)} /></div>
                : my ? <div className="exsub" style={{ color: 'var(--text)', whiteSpace: 'pre-wrap' }}>📝 {my}</div> : null}
            </div>
          );
        })}
        {edit && <button className="btn sm" style={{ marginTop: 8 }} onClick={() => setExEdit({ di, ei: null })}><Icon n="plus" s={14} />{t('addExercise')}</button>}
        <div style={{ marginTop: 14 }}><button className="btn primary block" onClick={() => startWorkout(di)}><Icon n="play" s={14} />{d.rest ? t('trainAnyway') : t('startWorkout')}</button></div>
      </div>
      <Strength />
      <History />
      {exEdit && <ExerciseEditSheet di={exEdit.di} ei={exEdit.ei} onClose={() => setExEdit(null)} />}
    </>
  );
}

function ExerciseEditSheet({ di, ei, onClose }: { di: number; ei: number | null; onClose: () => void }) {
  const cur: PlanExercise | undefined = ei != null ? plan().training.days[di].exercises[ei] : undefined;
  const [exId, setExId] = useState(cur?.exId ?? EXERCISES[0].id);
  const [n, setN] = useState(String(cur?.sets.length ?? 2));
  const [reps, setReps] = useState(cur?.sets[0]?.reps ?? '8-12');
  const [rest, setRest] = useState(String(cur?.sets[0]?.rest ?? 120));
  const [rir, setRir] = useState(cur ? cur.sets.map(s => s.rir ?? '').join(',') : '1,0');
  const save = () => {
    const count = Math.max(1, Math.min(10, Math.round(num(n)) || 1)), rirs = rir.split(/[,،\s]+/).filter(Boolean);
    const sets = Array.from({ length: count }, (_, i) => ({ reps, rest: num(rest), rir: rirs.length ? num(rirs[Math.min(i, rirs.length - 1)]) : null, tempo: null }));
    setPlan(p => {
      const list = p.training.days[di].exercises;
      if (ei == null) list.push({ uid: uid(), exId, sets, note: null });
      else list[ei] = { ...list[ei], exId, sets };
      p.training.days[di].rest = list.length === 0;
    });
    onClose();
  };
  return (
    <Sheet open onClose={onClose} title={ei == null ? t('addExercise') : t('edit')}
      footer={<>{ei != null && <button className="btn bad" onClick={() => { if (!confirmAsk(t('confirmDelete'))) return; setPlan(p => { p.training.days[di].exercises.splice(ei, 1); p.training.days[di].rest = p.training.days[di].exercises.length === 0; }); onClose(); }}><Icon n="trash" s={14} />{t('del')}</button>}<span className="sp" /><button className="btn primary" onClick={save}>{t('save')}</button></>}>
      <label className="f"><span>{t('exercise')}</span><select value={exId} onChange={e => setExId(e.target.value)}>
        {Object.keys(MUSCLES).map(m => { const xs = EXERCISES.filter(x => x.muscle === m); return xs.length ? <optgroup key={m} label={L(MUSCLES[m])}>{xs.map(x => <option key={x.id} value={x.id}>{L(x.name)}</option>)}</optgroup> : null; })}
      </select></label>
      <div className="grid2">
        <label className="f"><span>{t('setsWord')}</span><input type="number" value={n} onChange={e => setN(e.target.value)} /></label>
        <label className="f"><span>{t('reps')}</span><input type="text" value={reps} onChange={e => setReps(e.target.value)} /></label>
        <label className="f"><span>{t('restSec')}</span><input type="number" value={rest} onChange={e => setRest(e.target.value)} /></label>
        <label className="f"><span>{t('rirTarget')}</span><input type="text" value={rir} onChange={e => setRir(e.target.value)} /></label>
      </div>
    </Sheet>
  );
}

/* ---------- active workout ---------- */
function Active({ w, onVideo }: { w: Workout; onVideo: (id: string) => void }) {
  const [swapFor, setSwapFor] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [openDone, setOpenDone] = useState<Set<string>>(new Set());
  const total = w.exercises.reduce((a, e) => a + e.sets.length, 0), doneN = setsDone(w);
  const nextEx = w.exercises.findIndex(e => e.sets.some(s => !s.done));
  const mut = (fn: (d: Workout) => void) => update('active', 'main', () => w, fn);
  const setField = (ei: number, si: number, k: keyof LoggedSet, v: string) => mut(d => { (d.exercises[ei].sets[si] as unknown as Record<string, unknown>)[k] = v; });
  const finish = () => {
    const n = setsDone(w);
    if (!n) { if (confirmAsk(t('noSetsDone'))) { del('active', 'main'); setUi({ restEnd: 0 }); } return; }
    const done: Workout = { ...w, end: Date.now(), exercises: w.exercises.map(e => ({ ...e, sets: e.sets.filter(s => s.done) })).filter(e => e.sets.length) };
    put('workouts', done.id, done); del('active', 'main'); setUi({ restEnd: 0 }); toast(t('workoutSaved'));
  };
  return (
    <>
      <div className="livebar">
        <Icon n="timer" s={20} />
        <div className="sp"><b>{L(w.name)}</b><div className="small"><span data-elapsed={w.start}>{mmss((Date.now() - w.start) / 1000)}</span> · {t('setsProgress', doneN, total)}</div>
          <div className="liveprog"><i style={{ width: `${total ? (doneN / total) * 100 : 0}%` }} /></div></div>
        <button className="btn sm" onClick={() => { if (confirmAsk(t('confirmDiscard'))) { del('active', 'main'); setUi({ restEnd: 0 }); } }}>{t('discard')}</button>
        <button className="btn sm fin" onClick={finish}><Icon n="check" s={14} />{t('finish')}</button>
      </div>
      {w.exercises.map((e, ei) => {
        const ex = exById(e.exId), prev = lastSets(e.exId, w.id) ?? [], cardio = isCardio(e.exId);
        const planEx = plan().training.days.find(d => d.uid === w.dayUid)?.exercises.find(x => x.exId === e.exId);
        const sug = !cardio && planEx ? suggestion(planEx.sets, lastSets(e.exId, w.id)) : null;
        const my = note('ex:' + e.exId);
        const allDone = e.sets.length > 0 && e.sets.every(s => s.done);
        if (allDone && !openDone.has(e.uid)) return (
          <button className="card meal-done" key={e.uid} onClick={() => setOpenDone(s => new Set(s).add(e.uid))}>
            <span className="chk on"><Icon n="check" s={16} /></span>
            <b className="sp">{L(ex.name)}</b>
            <span className="muted small">{cardio ? `${e.sets[0]?.r} ${t('minCol')}` : e.sets.map(s => `${s.w || 0}×${s.r || 0}`).join(', ')}</span>
          </button>
        );
        const firstOpen = e.sets.findIndex(s => !s.done);
        return (
          <div className={`card ${ei === nextEx ? 'current' : ''}`} key={e.uid} id={'ex-' + e.uid}>
            <div className="exh">
              <b className="sp">{L(ex.name)}</b>
              {ex.video && <button className="ib" onClick={() => onVideo(ex.id)} title={t('video')}><Icon n="video" s={18} /></button>}
              <button className="ib" onClick={() => setSwapFor(ei)} title={t('swapExercise')}><Icon n="swap" s={18} /></button>
              <button className="ib" onClick={() => { if (confirmAsk(t('confirmDelete'))) mut(d => { d.exercises.splice(ei, 1); }); }}><Icon n="x" s={16} /></button>
            </div>
            {e.swappedFrom && <div className="exsub">{t('swappedFrom', L(exById(e.swappedFrom).name))}</div>}
            {planEx?.note && <div className="exsub"><Icon n="bulb" s={13} className="" /> {L(planEx.note)}</div>}
            {sug && <div className={`hint ${sug.kind}`}><Icon n="trend" s={13} />{t(sug.kind === 'up' ? 'suggestUp' : sug.kind === 'hold' ? 'suggestHold' : 'suggestDown', r1(sug.weight))}</div>}
            <details style={{ marginTop: 6 }} open={!!my}>
              <summary className="tiny muted"><Icon n="note" s={13} />{my ? my.split('\n')[0].slice(0, 60) : t('myNote')}</summary>
              <div style={{ marginTop: 6 }}><NoteField value={my} onSave={v => setNote('ex:' + e.exId, v)} /></div>
            </details>
            <table className="sets">
              <thead><tr><th>{t('set')}</th><th>{t('prev')}</th>{cardio ? <th>{t('minCol')}</th> : <><th>{t('kgCol')}</th><th>{t('repsCol')}</th><th><span className="row" style={{ gap: 2, justifyContent: 'center' }}>{t('rirCol')}<Info id="rir" s={12} /></span></th></>}<th /></tr></thead>
              <tbody>
                {e.sets.map((s, si) => {
                  const p = prev[si] ?? prev[prev.length - 1];
                  return (
                    <tr key={si} className={s.done ? 'done' : ei === nextEx && si === firstOpen ? 'next' : ''}>
                      <td className="n">{si + 1}</td>
                      <td className="prev">{p ? (cardio ? p.r : `${p.w || 0}×${p.r || 0}`) : '—'}</td>
                      {cardio
                        ? <td><input type="number" inputMode="decimal" value={s.r} placeholder={p?.r || s.tr} onChange={ev => setField(ei, si, 'r', ev.target.value)} /></td>
                        : <>
                          <td><input type="number" step="any" inputMode="decimal" value={s.w} placeholder={p?.w || ''} onChange={ev => setField(ei, si, 'w', ev.target.value)} /></td>
                          <td><input type="number" inputMode="numeric" value={s.r} placeholder={s.tr || p?.r || ''} onChange={ev => setField(ei, si, 'r', ev.target.value)} /></td>
                          <td style={{ width: 52 }}><input type="number" inputMode="numeric" value={s.rir} placeholder={s.trir != null ? String(s.trir) : ''} onChange={ev => setField(ei, si, 'rir', ev.target.value)} /></td>
                        </>}
                      <td style={{ width: 38 }}>
                        <button className={`chk ${s.done ? 'on' : ''}`} onClick={() => {
                          const nowDone = !s.done;
                          mut(d => {
                            const x = d.exercises[ei].sets[si]; x.done = nowDone;
                            if (nowDone) {
                              if (x.w === '' && p?.w) x.w = p.w;
                              if (x.r === '') x.r = p?.r || (cardio ? String(x.tr ?? '') : '');
                              if (x.rir === '' && x.trir != null && !cardio) x.rir = String(x.trir);
                            }
                          });
                          if (nowDone && !cardio) startRest(s.rest || 120);
                          if (nowDone && e.sets.every((x, i) => i === si || x.done)) {
                            const nx = w.exercises.slice(ei + 1).find(x => x.sets.some(y => !y.done));
                            if (nx) setTimeout(() => document.getElementById('ex-' + nx.uid)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
                          }
                        }}>{s.done && <Icon n="check" s={16} />}</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="row" style={{ marginTop: 6 }}>
              <button className="btn sm" onClick={() => mut(d => { const l = d.exercises[ei].sets.at(-1); d.exercises[ei].sets.push({ w: '', r: '', rir: '', done: false, tr: l?.tr, trir: l?.trir, rest: l?.rest }); })}><Icon n="plus" s={14} />{t('addSet')}</button>
              {e.sets.length > 1 && <button className="btn sm ghost" onClick={() => mut(d => { d.exercises[ei].sets.pop(); })}>{t('removeSet')}</button>}
            </div>
          </div>
        );
      })}
      <button className="btn block" onClick={() => setAdding(true)}><Icon n="plus" s={16} />{t('addExercise')}</button>
      <div className="card" style={{ marginTop: 12 }}>
        <h2><Icon n="note" s={18} />{t('sessionNote')}</h2>
        <NoteField value={w.note ?? ''} onSave={v => mut(d => { d.note = v; })} rows={3} />
      </div>
      {swapFor != null && <ExercisePicker title={t('swapExercise')} hint={t('swapExHint')} options={alternatives(w.exercises[swapFor].exId)} onClose={() => setSwapFor(null)}
        onPick={id => { mut(d => { const e = d.exercises[swapFor]; e.swappedFrom ??= e.exId; e.exId = id; e.cardio = isCardio(id); }); setSwapFor(null); }} />}
      {adding && <ExercisePicker title={t('addExercise')} options={EXERCISES} onClose={() => setAdding(false)}
        onPick={id => { mut(d => { d.exercises.push({ uid: uid(), exId: id, cardio: isCardio(id), sets: [0, 1].map(() => ({ w: '', r: '', rir: '', done: false, tr: '8-12', trir: 1, rest: 120 })) }); }); setAdding(false); }} />}
    </>
  );
}

function ExercisePicker({ title, hint, options, onPick, onClose }: { title: string; hint?: string; options: typeof EXERCISES; onPick: (id: string) => void; onClose: () => void }) {
  return (
    <Sheet open onClose={onClose} title={title}>
      {hint && <div className="muted small" style={{ marginBottom: 10 }}>{hint}</div>}
      {options.length === 0 && <div className="empty">{t('noMatches')}</div>}
      {options.map(x => (
        <button key={x.id} className="opt" onClick={() => onPick(x.id)}>
          <div className="sp"><div className="fname">{L(x.name)}</div><div className="fsub">{L(MUSCLES[x.muscle] ?? x.muscle)}</div></div>
          {x.video && <Icon n="video" s={16} className="muted" />}
        </button>
      ))}
    </Sheet>
  );
}

/* ---------- progress & history ---------- */
function Strength() {
  const ws = all('workouts');
  const ids = [...new Set(ws.flatMap(w => w.exercises.filter(e => !isCardio(e.exId) && e.sets.some(s => s.done && num(s.w) > 0)).map(e => e.exId)))];
  const [pick, setPick] = useState('');
  if (!ids.length) return null;
  const cur = ids.includes(pick) ? pick : ids[0];
  const best: { x: string; y: number }[] = [], top: { x: string; y: number }[] = [];
  for (const w of ws) for (const e of w.exercises) if (e.exId === cur) {
    const ds = e.sets.filter(s => s.done && num(s.w) > 0); if (!ds.length) continue;
    best.push({ x: w.date, y: r1(Math.max(...ds.map(s => e1rm(num(s.w), num(s.r))))) });
    top.push({ x: w.date, y: Math.max(...ds.map(s => num(s.w))) });
  }
  return (
    <div className="card">
      <h2><Icon n="trend" s={18} />{t('strength')}</h2>
      <select value={cur} onChange={e => setPick(e.target.value)} style={{ marginBottom: 10 }}>{ids.map(id => <option key={id} value={id}>{L(exById(id).name)}</option>)}</select>
      <Chart series={[{ pts: best, color: 'var(--accent)', dots: 3.5 }, { pts: top, color: 'var(--p)', dots: 3, dash: true, width: 2 }]} />
      <div className="legend"><span><i style={{ background: 'var(--accent)' }} />{t('e1rm')}<Info id="e1rm" s={12} /></span><span><i style={{ background: 'var(--p)' }} />{t('topSet')}</span></div>
    </div>
  );
}

function History() {
  const ws = workoutsSorted();
  const [open, setOpen] = useState<Workout | null>(null);
  return (
    <div className="card">
      <h2>{t('history')}</h2>
      {ws.length ? ws.slice(0, 50).map(w => (
        <button key={w.id} className="hist" onClick={() => setOpen(w)}>
          <div className="sp"><b>{L(w.name)}</b><div className="muted small">{fmtD(w.date, { weekday: 'short', day: 'numeric', month: 'short' })} · {tSets(setsDone(w))}</div></div>
          <div className="small muted" style={{ textAlign: 'end' }}>{w.end ? mmss((w.end - w.start) / 1000) : ''}<br />{fmtN(volumeOf(w))} kg</div>
        </button>
      )) : <div className="empty">{t('noHistory')}</div>}
      {open && (
        <Sheet open onClose={() => setOpen(null)} title={`${L(open.name)} · ${fmtD(open.date, { weekday: 'short', day: 'numeric', month: 'short' })}`}
          footer={<><button className="btn bad" onClick={() => { if (confirmAsk(t('confirmDelete'))) { del('workouts', open.id); setOpen(null); } }}><Icon n="trash" s={14} />{t('del')}</button><span className="sp" /></>}>
          <div className="grid3" style={{ marginBottom: 10 }}>
            <div className="stat"><small>{t('duration')}</small><b>{open.end ? mmss((open.end - open.start) / 1000) : '—'}</b></div>
            <div className="stat"><small>{t('volume')}</small><b>{fmtN(volumeOf(open))}</b></div>
            <div className="stat"><small>{t('set')}</small><b>{setsDone(open)}</b></div>
          </div>
          {open.exercises.map(e => (
            <div key={e.uid} className="entry"><span className="sp"><b>{L(exById(e.exId).name)}</b></span>
              <span className="small muted" style={{ textAlign: 'end' }}>{e.sets.map(s => isCardio(e.exId) ? `${s.r} ${t('minCol')}` : `${s.w || 0}×${s.r || 0}${s.rir !== '' ? ` @${s.rir}` : ''}`).join(', ')}</span></div>
          ))}
          {open.note && <div className="notebox mine" style={{ marginTop: 10, borderRadius: 10, whiteSpace: 'pre-wrap' }}>{open.note}</div>}
        </Sheet>
      )}
    </div>
  );
}
