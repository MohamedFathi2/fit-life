import { all, day, get, setDay, settings } from '../store/store';
import { useUi } from '../uiState';
import { cycleIdx, isRest, planDayFor } from '../domain/cycle';
import { totals } from '../domain/nutrition';
import { setsDone, volumeOf } from '../domain/training';
import { weekSummary, checkinDueIn, weights } from '../domain/summary';
import { fmtN, L, t, tSets } from '../lib/i18n';
import { addDays, mmss, r1 } from '../lib/util';
import { signed } from '../lib/format';
import { Bar, Icon, Ring, Spark, Track } from '../components/ui';
import { startWorkout } from './Training';
import { BodyQuick } from './Progress';

export function Home() {
  const { date } = useUi();
  const s = settings();
  const idx = cycleIdx(date), pd = planDayFor(date), rest = isRest(date);
  const active = get('active', 'main');
  const doneW = all('workouts').filter(w => w.date === date);
  const { target, eaten } = totals(date);
  const rec = day(date);
  const ws = weights(), lastW = ws.filter(e => e.date <= date).at(-1);
  const prior = ws.filter(e => e.date <= addDays(date, -7)).at(-1);
  const sum = weekSummary(date);
  const due = checkinDueIn(date) === 0;
  const muscles = [...new Set(pd?.exercises.map(e => e.exId) ?? [])].length;

  let train;
  if (active) {
    train = (
      <div className="row">
        <div className="sp"><span className="chip accent">{t('inProgress')}</span><div style={{ fontWeight: 700, fontSize: 17, marginTop: 6 }}>{L(active.name)}</div><div className="muted small" data-elapsed={active.start}>{mmss((Date.now() - active.start) / 1000)}</div></div>
        <a className="btn primary" href="#training"><Icon n="play" s={14} />{t('continueWorkout')}</a>
      </div>
    );
  } else if (doneW.length) {
    train = doneW.map(w => (
      <div className="row" key={w.id}><span className="chip good"><Icon n="check" s={14} />{t('done')}</span><b className="sp">{L(w.name)}</b><span className="muted small">{w.end ? mmss((w.end - w.start) / 1000) : ''} · {fmtN(volumeOf(w))} kg · {tSets(setsDone(w))}</span></div>
    ));
  } else if (rest) {
    train = <div className="row"><div className="sp"><b style={{ fontSize: 17 }}>{t('restDay')}</b><div className="muted small">{t('restDayMsg')}</div></div><a className="btn sm" href="#training">{t('trainAnyway')}</a></div>;
  } else {
    train = (
      <div className="row top">
        <div className="sp">
          <div className="muted small">{t('dayN', idx + 1)} · {t('exercisesN', muscles)}</div>
          <div style={{ fontWeight: 800, fontSize: 21, margin: '2px 0 4px' }}>{L(pd.name)}</div>
        </div>
        <button className="btn primary" onClick={() => startWorkout(idx)}><Icon n="play" s={14} />{t('startWorkout')}</button>
      </div>
    );
  }
  const water = rec?.water ?? 0;
  return (
    <>
      {due && <a href="#habits" className="card accent row" style={{ textDecoration: 'none' }}><Icon n="flag" /><b className="sp">{t('checkinBanner')}</b><Icon n="right" s={18} className="flip" /></a>}
      <div className="card"><h2><Icon n="dumbbell" s={18} />{t('training')}</h2>{train}</div>
      <a className="card row" href="#nutrition" style={{ textDecoration: 'none', gap: 16 }}>
        <Ring val={eaten.kcal} max={target.kcal} label={fmtN(eaten.kcal)} sub={t('ofTarget', fmtN(target.kcal))} />
        <div className="sp">
          <Bar label={t('protein')} val={eaten.p} max={target.p} color="var(--p)" />
          <Bar label={t('carbs')} val={eaten.c} max={target.c} color="var(--c)" />
          <Bar label={t('fat')} val={eaten.f} max={target.f} color="var(--f)" />
        </div>
      </a>
      <div className="grid2 stack">
        <div className="card" style={{ margin: 0 }}>
          <h2><Icon n="drop" s={18} />{t('water')}<span className="sp" /><button className="btn sm" onClick={() => setDay(date, d => { d.water += s.glass; })}>{t('glassAdd')}</button></h2>
          <div className="row" style={{ alignItems: 'baseline', gap: 6 }}><b style={{ fontSize: 22 }}>{fmtN(water)}</b><span className="muted small">/ {fmtN(s.water)} ml</span></div>
          <div style={{ margin: '8px 0 12px' }}><Track pct={(water / s.water) * 100} color="var(--c)" /></div>
          <div className="grid2" style={{ gap: 8 }}>
            <div className="stat"><small>{t('steps')}</small><b>{rec?.steps != null ? fmtN(rec.steps) : t('noData')}</b></div>
            <div className="stat"><small>{t('sleep')}</small><b>{rec?.sleep != null ? r1(rec.sleep) + t('hoursShort') : t('noData')}</b></div>
          </div>
          {s.habits.length > 0 && <a href="#habits" className="muted small" style={{ display: 'block', marginTop: 10, textDecoration: 'none' }}>{t('dailyHabits')}: <b style={{ color: 'var(--text)' }}>{s.habits.filter(h => rec?.habits?.[h.id]).length}/{s.habits.length}</b></a>}
        </div>
        <div className="card" style={{ margin: 0 }}>
          <h2><Icon n="chart" s={18} />{t('weight')}</h2>
          <div className="row" style={{ alignItems: 'flex-end' }}>
            <div className="sp"><b style={{ fontSize: 24 }}>{lastW?.weight != null ? r1(lastW.weight) : t('noData')}</b> <span className="muted small">kg</span>
              {lastW?.weight != null && prior?.weight != null && <div className="small" style={{ color: lastW.weight <= prior.weight ? 'var(--good)' : 'var(--warn)' }}>{signed(lastW.weight - prior.weight)} kg · 7d</div>}
            </div>
            <Spark vals={ws.filter(e => e.date > addDays(date, -30) && e.date <= date).map(e => e.weight!)} />
          </div>
          <div style={{ marginTop: 12 }}><BodyQuick /></div>
        </div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h2>{t('thisWeek')}</h2>
        <div className="grid3">
          <div className="stat"><small>{t('workouts')}</small><b>{sum.workouts}/{sum.planned}</b></div>
          <div className="stat"><small>{t('planFollowed')}</small><b>{sum.adherence != null ? Math.round(sum.adherence) + '%' : t('noData')}</b></div>
          <div className="stat"><small>{t('avgWeight')}</small><b>{sum.avgWeight != null ? r1(sum.avgWeight) : t('noData')}</b></div>
        </div>
      </div>
    </>
  );
}
