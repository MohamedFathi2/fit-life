import { BUILTIN_FOODS } from '../data/foods';
import { all, day, plan } from '../store/store';
import { isRest } from './cycle';
import type { Food, Macros, Meal, PlanItem } from '../types';

const builtinById = new Map(BUILTIN_FOODS.map(f => [f.id, f]));
export const allFoods = (): Food[] => [...BUILTIN_FOODS, ...all('foods')];
export const foodById = (id: string): Food | undefined => builtinById.get(id) ?? all('foods').find(f => f.id === id);

export const Z = (): Macros => ({ kcal: 0, p: 0, c: 0, f: 0 });
export const add = (a: Macros, b: Macros) => { a.kcal += b.kcal; a.p += b.p; a.c += b.c; a.f += b.f; return a; };
export function macrosOf(food: Food | undefined, amount: number): Macros {
  if (!food) return Z();
  const k = amount / food.per;
  return { kcal: food.kcal * k, p: food.p * k, c: food.c * k, f: food.f * k };
}

export interface ResolvedItem { item: PlanItem; food: Food | undefined; amount: number; macros: Macros; todaySwap: boolean }
export interface ResolvedMeal { meal: Meal; skipped: boolean; items: ResolvedItem[]; total: Macros }

/** The plan for one date: rest-day meals marked skipped, today-only swaps applied. */
export function resolveDay(date: string): ResolvedMeal[] {
  const rest = isRest(date), d = day(date);
  return plan().nutrition.meals.map(meal => {
    const items = meal.items.map(item => {
      const sw = d?.swaps?.[item.uid];
      const foodId = sw?.foodId ?? item.foodId, amount = sw?.amount ?? item.amount;
      const food = foodById(foodId);
      return { item, food, amount, macros: macrosOf(food, amount), todaySwap: !!sw };
    });
    return { meal, skipped: !!meal.trainingOnly && rest, items, total: items.reduce((a, i) => add(a, i.macros), Z()) };
  });
}

export function extraMacros(x: { foodId?: string; amount: number; macros?: Macros }): Macros {
  return x.macros ?? macrosOf(x.foodId ? foodById(x.foodId) : undefined, x.amount);
}

export function totals(date: string) {
  const d = day(date), target = Z(), eaten = Z();
  for (const m of resolveDay(date)) {
    if (m.skipped) continue;
    for (const i of m.items) { add(target, i.macros); if (d?.eaten?.[i.item.uid]) add(eaten, i.macros); }
  }
  for (const x of d?.extras ?? []) add(eaten, extraMacros(x));
  return { target, eaten };
}

/* ---------- swaps ---------- */
export type Metric = 'kcal' | 'p' | 'c' | 'f';
/** Which macro makes up most of a food's calories (protein foods match protein, etc.). */
export function dominant(food: Food): Metric {
  const e = { p: food.p * 4, c: food.c * 4, f: food.f * 9 };
  const top = (Object.keys(e) as ('p' | 'c' | 'f')[]).sort((a, b) => e[b] - e[a])[0];
  return e[top] / Math.max(1, e.p + e.c + e.f) >= 0.55 ? top : 'kcal';
}
export function roundAmount(amount: number, unit: string) {
  if (unit === 'g' || unit === 'ml') return amount >= 20 ? Math.round(amount) : Math.round(amount * 2) / 2;
  return Math.max(0.5, Math.round(amount * 2) / 2);
}
export interface SwapOption { food: Food; amount: number; macros: Macros; diff: Macros; score: number; metric: Metric }
export function swapOptions(from: Food, fromAmount: number, mode: 'auto' | Metric, scope: 'group' | 'all', query: string): SwapOption[] {
  const target = macrosOf(from, fromAmount);
  const q = query.trim().toLowerCase();
  const pool = allFoods().filter(f => f.id !== from.id && (q ? (f.name.en + ' ' + f.name.ar).toLowerCase().includes(q) : scope === 'all' || f.cat === from.cat || (f.custom && f.cat === from.cat)));
  const want: Metric = mode === 'auto' ? dominant(from) : mode;
  const out: SwapOption[] = [];
  for (const f of pool) {
    let metric = want;
    if (f[metric] <= 0.01 || target[metric] <= 0.01) metric = 'kcal';
    if (f[metric] <= 0.01 || target[metric] <= 0.01) continue;
    const amount = roundAmount((target[metric] / f[metric]) * f.per, f.unit);
    const m = macrosOf(f, amount);
    const diff = { kcal: m.kcal - target.kcal, p: m.p - target.p, c: m.c - target.c, f: m.f - target.f };
    const score = Math.abs(diff.kcal) / 40 + Math.abs(diff.p) / 4 + Math.abs(diff.c) / 8 + Math.abs(diff.f) / 4;
    out.push({ food: f, amount, macros: m, diff, score, metric });
  }
  return out.sort((a, b) => a.score - b.score).slice(0, q ? 60 : 40);
}

/* ---------- shopping list ---------- */
export function shoppingList(days: number) {
  const p = plan(), tdays = p.training.days, frac = tdays.length ? tdays.filter(d => !d.rest).length / tdays.length : 1;
  const agg = new Map<string, { food: Food; amount: number }>();
  for (const m of p.nutrition.meals) {
    const mult = m.trainingOnly ? Math.ceil(days * frac) : days;
    for (const i of m.items) {
      const f = foodById(i.foodId); if (!f) continue;
      const cur = agg.get(f.id) ?? { food: f, amount: 0 };
      cur.amount += i.amount * mult; agg.set(f.id, cur);
    }
  }
  return [...agg.values()];
}

