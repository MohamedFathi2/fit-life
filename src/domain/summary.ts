import { all, day } from '../store/store';
import { addDays, avg, clamp, diffDays } from '../lib/util';
import { isRest } from './cycle';
import { totals } from './nutrition';
import { fmtD } from '../lib/format';
import { t } from '../lib/i18n';
import type { BodyEntry, Checkin } from '../types';

export const weights = (): (BodyEntry & { weight: number })[] =>
  all('body').filter((e): e is BodyEntry & { weight: number } => e.weight != null).sort((a, b) => a.date.localeCompare(b.date));

export const lastCheckin = (): Checkin | undefined => all('checkins').sort((a, b) => b.date.localeCompare(a.date))[0];
export function checkinDueIn(date: string) {
  const lc = lastCheckin();
  return lc ? Math.max(0, 7 - diffDays(lc.date, date)) : 0;
}

export function weekSummary(end: string) {
  const start = addDays(end, -6), inR = (d: string) => d >= start && d <= end;
  const ws = weights();
  const aw = avg(ws.filter(e => inR(e.date)).map(e => e.weight));
  const awp = avg(ws.filter(e => e.date >= addDays(start, -7) && e.date < start).map(e => e.weight));
  const workouts = all('workouts').filter(w => inR(w.date)).length;
  let planned = 0;
  const kc: number[] = [], adh: number[] = [], water: number[] = [], sleep: number[] = [], steps: number[] = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i);
    if (!isRest(d)) planned++;
    const r = day(d); if (!r) continue;
    const { target, eaten } = totals(d);
    if (eaten.kcal > 0) { kc.push(eaten.kcal); adh.push(clamp(eaten.kcal / (target.kcal || 1), 0, 1)); }
    if (r.water) water.push(r.water);
    if (r.sleep != null) sleep.push(r.sleep);
    if (r.steps != null) steps.push(r.steps);
  }
  const a = avg(adh);
  return {
    start, end, avgWeight: aw, weightChange: aw != null && awp != null ? aw - awp : null, workouts, planned,
    avgKcal: avg(kc), adherence: a != null ? a * 100 : null, avgWater: avg(water), avgSleep: avg(sleep), avgSteps: avg(steps),
  };
}

/** Plain-text check-in to paste into the coach's chat. */
export function checkinText(c: Checkin) {
  const s = c.summary ?? {};
  const n = (v: number | null | undefined, d = 1) => (v == null ? '—' : String(Math.round(v * 10 ** d) / 10 ** d));
  const lines = [
    `${t('checkin')} — ${fmtD(c.date, { day: 'numeric', month: 'long', year: 'numeric' })}`,
    '',
    `${t('avgWeight')}: ${n(s.avgWeight)} kg${s.weightChange != null ? ` (${s.weightChange > 0 ? '+' : ''}${n(s.weightChange)})` : ''}`,
    `${t('workouts')}: ${s.workouts ?? '—'}/${s.planned ?? '—'}`,
    `${t('planFollowed')}: ${n(s.adherence, 0)}%  ·  ${t('avgKcal')}: ${n(s.avgKcal, 0)}`,
    `${t('avgWater')}: ${n(s.avgWater, 0)} ml  ·  ${t('avgSleep')}: ${n(s.avgSleep)} h  ·  ${t('avgSteps')}: ${n(s.avgSteps, 0)}`,
    '',
    (['energy', 'hunger', 'sleepQ', 'stress', 'digestion'] as const).map(k => `${t(k)} ${c[k]}/5`).join(' · '),
  ];
  if (c.dietAdh) lines.push(`${t('dietAdh')}: ${c.dietAdh}`);
  for (const k of ['wins', 'struggles', 'questions'] as const) if (c[k]) lines.push('', `${t(k)}:`, c[k]!);
  return lines.join('\n');
}
