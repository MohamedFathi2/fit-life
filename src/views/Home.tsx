import { all, day, get, ids, setDay, settings } from '../store/store';
import { openTerm, setUi, useUi } from '../uiState';
import { cycleIdx, isRest, planDayFor } from '../domain/cycle';
import { resolveDay, totals } from '../domain/nutrition';
import { setsDone, volumeOf } from '../domain/training';
import { weekSummary, checkinDueIn, weights } from '../domain/summary';
import { fmtN, L, locale, t, tSets } from '../lib/i18n';
import { addDays, mmss, parseISO, r1, todayISO } from '../lib/util';
import { fmtD, signed } from '../lib/format';
import { Bar, Icon, Ring, Spark, Track } from '../components/ui';
import { Info, termOfTheDay } from '../components/Glossary';
import { startWorkout } from './Training';
import { BodyQuick } from './Progress';

const greeting = () => { const h = new Date().getHours(); return t(h < 12 ? 'goodMorning' : h < 18 ? 'goodAfternoon' : 'goodEvening'); };

/** Seven days ending today (or the selected day, if it is older); tap to jump to that day. */
function WeekStrip({ date }: { date: string }) {
  const today = todayISO();
  const end = date < addDays(today, -6) ? addDays(date, 3) : today;
  const days = Array.from({ length: 7 }, (_, i) => addDays(end, i - 6));
  const workouts = new Set(all('workouts').map(w => w.date));
  // only flag "missed" training days from the first day anything was logged
  const firstLog = [...workouts, ...ids('days')].sort()[0] ?? today;
  return (
    <div className="week">
      {days.map(d => {
        const rest = isRest(d), trained = workouts.has(d), future = d > today;
        const { target, eaten } = totals(d);
        const ate = target.kcal > 0 && eaten.kcal / target.kcal >= 0.8;
        return (
          <button key={d} className={`wd ${d === date ? 'sel' : ''} ${d === today ? 'today' : ''}`} disabled={future} onClick={() => setUi({ date: d })}>
            <small>{parseISO(d).toLocaleDateString(locale(), { weekday: 'narrow' })}</small>
            <span className={`wdc ${trained ? 'trained' : rest ? 'rest' : d < today && d >= firstLog ? 'missed' : ''}`}>{parseISO(d).getDate()}</span>
            <i className={ate ? 'on' : ''} />
          </button>
        );
      })}
    </div>
  );
}

function UpNext({ date }: { date: string }) {
  const rec = day(date);
  const next = resolveDay(date).find(m => !m.skipped && m.items.length && !m.items.every(i => rec?.eaten?.[i.item.uid]));
  if (!next) return <div className="card row"><Icon n="check" s={18} className="good" /><span className="small">{t('allMealsDone')}</span></div>;
  return (
    <div className="card">
      <div className="row" style={{ marginBottom: 6 }}>
        <span className="eyebrow sp">{t('upNext')}</span>
        <span className="muted small">{fmtN(next.total.kcal)} {t('kcal')} · P {Math.round(next.total.p)}</span>
      </div>
      <div className="row top">
        <div className="sp">
          <b style={{ fontSize: 17 }}>{L(next.meal.name)}</b>
          <div className="muted small" style={{ marginTop: 2 }}>{next.items.map(i => (i.food ? L(i.food.name) : '?')).join(' · ')}</div>
        </div>
        <button className="btn primary sm" onClick={() => setDay(date, d => { next.items.forEach(i => { d.eaten[i.item.uid] = true; }); })}><Icon n="check" s={14} />{t('ateIt')}</button>
      </div>
    </div>
  );
}

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
  const term = termOfTheDay(date);
  const isToday = date === todayISO();

  let train;
  if (active) {
    train = (
      <div className="row">
        <div className="sp"><span className="chip accent">{t('inProgress')}</span><div className="big">{L(active.name)}</div><div className="muted small" data-elapsed={active.start}>{mmss((Date.now() - active.start) / 1000)}</div></div>
        <a className="btn primary" href="#training"><Icon n="play" s={14} />{t('continueWorkout')}</a>
      </div>
    );
  } else if (doneW.length) {
    train = doneW.map(w => (
      <div className="row" key={w.id}><span className="chip good"><Icon n="check" s={14} />{t('done')}</span><b className="sp">{L(w.name)}</b><span className="muted small">{w.end ? mmss((w.end - w.start) / 1000) : ''} · {fmtN(volumeOf(w))} kg · {tSets(setsDone(w))}</span></div>
    ));
  } else if (rest) {
    train = <div className="row"><div className="sp"><div className="big">{t('restDay')}</div><div className="muted small">{t('restDayMsg')}</div></div><a className="btn sm" href="#training">{t('trainAnyway')}</a></div>;
  } else {
    train = (
      <div className="row">
        <div className="sp">
          <div className="muted small">{t('dayN', idx + 1)} · {t('exercisesN', pd.exercises.length)}</div>
          <div className="big">{L(pd.name)}</div>
        </div>
        <button className="btn primary" onClick={() => startWorkout(idx)}><Icon n="play" s={14} />{t('startWorkout')}</button>
      </div>
    );
  }
  const water = rec?.water ?? 0;
  const left = target.kcal - eaten.kcal;
  return (
    <>
      <div className="hero">
        <div className="muted small">{isToday ? greeting() : fmtD(date, { weekday: 'long' })}</div>
        <h1>{fmtD(date, { weekday: isToday ? 'long' : undefined, day: 'numeric', month: 'long' })}</h1>
      </div>
      <WeekStrip date={date} />
      {due && <a href="#habits" className="card accent row" style={{ textDecoration: 'none' }}><Icon n="flag" /><b className="sp">{t('checkinBanner')}</b><Icon n="right" s={18} className="flip" /></a>}
      <div className="home-grid">
        <div>
          <div className="card"><div className="eyebrow" style={{ marginBottom: 8 }}><Icon n="dumbbell" s={14} />{t('training')}</div>{train}</div>
          <a className="card row" href="#nutrition" style={{ textDecoration: 'none', gap: 16 }}>
            <Ring val={eaten.kcal} max={target.kcal} label={fmtN(eaten.kcal)} sub={left >= 0 ? t('left', fmtN(left)) : t('over', fmtN(-left))} />
            <div className="sp">
              <Bar label={t('protein')} val={eaten.p} max={target.p} color="var(--p)" />
              <Bar label={t('carbs')} val={eaten.c} max={target.c} color="var(--c)" />
              <Bar label={t('fat')} val={eaten.f} max={target.f} color="var(--f)" />
            </div>
          </a>
          <UpNext date={date} />
        </div>
        <div>
          <div className="grid2">
            <div className="card tile">
              <div className="eyebrow"><Icon n="drop" s={14} />{t('water')}</div>
              <div><b className="num">{fmtN(water / 1000, 1)}</b><span className="muted small"> / {fmtN(s.water / 1000, 1)} L</span></div>
              <Track pct={(water / s.water) * 100} color="var(--c)" />
              <button className="btn sm block" onClick={() => setDay(date, d => { d.water += s.glass; })}>{t('glassAdd')}</button>
            </div>
            <div className="card tile">
              <div className="eyebrow"><Icon n="chart" s={14} />{t('weight')}<Info id="trend" s={13} /></div>
              <div><b className="num">{lastW?.weight != null ? r1(lastW.weight) : t('noData')}</b><span className="muted small"> kg</span></div>
              {lastW?.weight != null && prior?.weight != null
                ? <div className="small" style={{ color: lastW.weight <= prior.weight ? 'var(--good)' : 'var(--warn)' }}>{signed(lastW.weight - prior.weight)} kg · 7d</div>
                : <Spark vals={ws.filter(e => e.date > addDays(date, -30) && e.date <= date).map(e => e.weight)} />}
              <BodyQuick compact />
            </div>
          </div>
          <a className="card row" href="#habits" style={{ textDecoration: 'none' }}>
            <div className="stat sp"><small>{t('steps')}</small><b>{rec?.steps != null ? fmtN(rec.steps) : t('noData')}</b></div>
            <div className="stat sp"><small>{t('sleep')}</small><b>{rec?.sleep != null ? r1(rec.sleep) + t('hoursShort') : t('noData')}</b></div>
            <div className="stat sp"><small>{t('dailyHabits')}</small><b>{s.habits.filter(h => rec?.habits?.[h.id]).length}/{s.habits.length}</b></div>
          </a>
          <div className="card">
            <div className="eyebrow" style={{ marginBottom: 8 }}>{t('thisWeek')}</div>
            <div className="grid3">
              <div className="stat"><small>{t('workouts')}</small><b>{sum.workouts}/{sum.planned}</b></div>
              <div className="stat"><small>{t('planFollowed')}</small><b>{sum.adherence != null ? Math.round(sum.adherence) + '%' : t('noData')}</b></div>
              <div className="stat"><small>{t('avgWeight')}</small><b>{sum.avgWeight != null ? r1(sum.avgWeight) : t('noData')}</b></div>
            </div>
          </div>
          <div className="card learn">
            <div className="eyebrow" style={{ marginBottom: 6 }}><Icon n="book" s={14} />{t('learnToday')}</div>
            <b>{L(term.title)}</b>
            <p className="small muted clamp3">{L(term.body)}</p>
            <div className="row"><button className="btn sm" onClick={() => openTerm(term.id)}>{t('readMore')}</button><a className="btn sm ghost" href="#learn">{t('glossary')}</a></div>
          </div>
        </div>
      </div>
    </>
  );
}
