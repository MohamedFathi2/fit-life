import { day, plan, settings } from '../store/store';
import { diffDays } from '../lib/util';

/** Index of the training-plan day that falls on `date`. */
export function cycleIdx(date: string) {
  const n = plan().training.days.length || 7;
  return ((diffDays(settings().cycleStart, date) % n) + n) % n;
}
export const planDayFor = (date: string) => plan().training.days[cycleIdx(date)];
export function isRest(date: string) {
  const o = day(date)?.dayType;
  if (o) return o === 'rest';
  return !!planDayFor(date)?.rest;
}
