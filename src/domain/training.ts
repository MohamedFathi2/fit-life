import { EXERCISES } from '../data/exercises';
import { all, settings } from '../store/store';
import { num, repRange } from '../lib/util';
import type { Exercise, LoggedSet, PlanSet, Workout } from '../types';

const byId = new Map(EXERCISES.map(e => [e.id, e]));
export const exById = (id: string): Exercise => byId.get(id) ?? { id, name: { en: id, ar: id }, muscle: 'Core' };
export const isCardio = (id: string) => exById(id).muscle === 'Cardio';
export const alternatives = (id: string) => { const m = exById(id).muscle; return EXERCISES.filter(e => e.muscle === m && e.id !== id); };

export const workoutsSorted = (): Workout[] => all('workouts').sort((a, b) => b.date.localeCompare(a.date) || b.start - a.start);

/** Sets from the most recent finished workout that included this exercise. */
export function lastSets(exId: string, excludeId?: string): LoggedSet[] | null {
  for (const w of workoutsSorted()) {
    if (w.id === excludeId) continue;
    const e = w.exercises.find(x => x.exId === exId && x.sets.some(s => s.done));
    if (e) return e.sets.filter(s => s.done);
  }
  return null;
}

export const e1rm = (w: number, r: number) => w * (1 + r / 30);
export const volumeOf = (w: Workout) => w.exercises.reduce((a, e) => a + (isCardio(e.exId) ? 0 : e.sets.reduce((b, s) => b + (s.done ? num(s.w) * num(s.r) : 0), 0)), 0);
export const setsDone = (w: Workout) => w.exercises.reduce((a, e) => a + e.sets.filter(s => s.done).length, 0);

/**
 * Double progression: if every working set last time reached the top of the rep range
 * (at or above the target RIR when RIR was logged), suggest adding one weight step.
 */
export function suggestion(planSets: PlanSet[], last: LoggedSet[] | null): { kind: 'up' | 'hold' | 'down'; weight: number } | null {
  if (!last?.length) return null;
  const top = Math.max(...last.map(s => num(s.w)));
  if (!top) return null;
  const working = last.filter(s => num(s.w) === top);
  const range = repRange(planSets[0]?.reps ?? '');
  if (!range) return null;
  const [lo, hi] = range;
  const hitTop = working.every((s, i) => {
    const tr = planSets[Math.min(i, planSets.length - 1)];
    const rirOk = s.rir === '' || tr?.rir == null || num(s.rir) >= tr.rir;
    return num(s.r) >= hi && rirOk;
  });
  if (hitTop) return { kind: 'up', weight: top + (settings().plateStep || 2.5) };
  if (working.some(s => num(s.r) < lo)) return { kind: 'down', weight: top };
  return { kind: 'hold', weight: top };
}

/** Turn a demo-video link into an embeddable player URL (YouTube, TikTok, Instagram). */
export function embedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  let m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (m) return `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&modestbranding=1&playsinline=1`;
  m = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
  if (m) return `https://www.tiktok.com/embed/v2/${m[1]}`;
  m = url.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/);
  if (m) return `https://www.instagram.com/reel/${m[1]}/embed`;
  return null;
}
export const isPortrait = (url: string | null | undefined) => !!url && /shorts\/|tiktok|instagram/.test(url);
