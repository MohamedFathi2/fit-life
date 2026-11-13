import { plan, settings } from '../store/store';
import { foodById, macrosOf, resolveDay } from './nutrition';
import { weights } from './summary';
import { avg, r1, todayISO, diffDays } from '../lib/util';
import { getLang } from '../lib/i18n';
import type { MINE_KEYS } from '../data/glossary';

const both = (en: string, ar: string) => (getLang() === 'ar' ? ar : en);

/** One line connecting a glossary term to the user's own plan and logs. */
export function mineLine(key: keyof typeof MINE_KEYS): string | null {
  const p = plan(), s = settings();
  const meals = p.nutrition.meals;
  const sum = (rest: boolean) => meals.filter(m => !(rest && m.trainingOnly)).flatMap(m => m.items).reduce((a, i) => {
    const m = macrosOf(foodById(i.foodId), i.amount); a.kcal += m.kcal; a.p += m.p; a.c += m.c; a.f += m.f; return a;
  }, { kcal: 0, p: 0, c: 0, f: 0 });
  const train = sum(false), rest = sum(true);
  const ws = weights(), w = ws.length ? avg(ws.slice(-7).map(e => e.weight)) : null;
  const allSets = p.training.days.flatMap(d => d.exercises.flatMap(e => e.sets));
  switch (key) {
    case 'kcal': return both(`Your plan: ${Math.round(train.kcal)} kcal on training days, ${Math.round(rest.kcal)} on rest days.`, `خطتك: ${Math.round(train.kcal)} سعرة في أيام التمرين و${Math.round(rest.kcal)} في أيام الراحة.`);
    case 'protein': return both(`Your plan: ${Math.round(train.p)} g a day${w ? ` ≈ ${r1(train.p / w)} g per kg of your current weight` : ''}.`, `خطتك: ${Math.round(train.p)} جم يوميًا${w ? ` ≈ ${r1(train.p / w)} جم لكل كيلو من وزنك الحالي` : ''}.`);
    case 'carbs': return both(`Your plan: ${Math.round(train.c)} g on training days, ${Math.round(rest.c)} g on rest days.`, `خطتك: ${Math.round(train.c)} جم في أيام التمرين و${Math.round(rest.c)} جم في أيام الراحة.`);
    case 'fat': return both(`Your plan: ${Math.round(train.f)} g a day${w ? ` ≈ ${r1(train.f / w)} g per kg` : ''}.`, `خطتك: ${Math.round(train.f)} جم يوميًا${w ? ` ≈ ${r1(train.f / w)} جم لكل كيلو` : ''}.`);
    case 'pre': {
      const m = meals.find(x => x.trainingOnly); if (!m) return null;
      const t = m.items.reduce((a, i) => { const x = macrosOf(foodById(i.foodId), i.amount); a.k += x.kcal; a.c += x.c; return a; }, { k: 0, c: 0 });
      return both(`Your pre-workout meal: ${Math.round(t.k)} kcal, ${Math.round(t.c)} g carbs, skipped on rest days.`, `وجبة ما قبل التمرين عندك: ${Math.round(t.k)} سعرة و${Math.round(t.c)} جم كربوهيدرات، وتُحذف في أيام الراحة.`);
    }
    case 'rir': {
      const c: Record<string, number> = {}; allSets.forEach(x => { if (x.rir != null) c[x.rir] = (c[x.rir] ?? 0) + 1; });
      const parts = Object.keys(c).sort().map(k => `RIR ${k}: ${c[k]}`);
      return both(`Your week: ${parts.join(' · ')} sets.`, `أسبوعك: ${parts.join(' · ')} مجموعة.`);
    }
    case 'rest': {
      const r = allSets.map(x => x.rest).filter(Boolean); if (!r.length) return null;
      return both(`Your plan: ${Math.min(...r) / 60}–${Math.max(...r) / 60} min depending on the exercise.`, `خطتك: ${Math.min(...r) / 60}–${Math.max(...r) / 60} دقيقة حسب التمرين.`);
    }
    case 'tempo': return both('In your plan: the last set of leg press and hip thrust is marked 0-0-0-0.', 'في خطتك: آخر مجموعة في مكبس الأرجل ودفع الورك مكتوب لها 0-0-0-0.');
    case 'split': {
      const hard = allSets.filter(x => x.rir != null).length;
      return both(`Your split: ${p.training.days.map(d => d.name.en).join(' → ')} · about ${hard} working sets a week.`, `تقسيمك: ${p.training.days.map(d => d.name.ar).join(' ← ')} · حوالي ${hard} مجموعة أساسية في الأسبوع.`);
    }
    case 'trend': {
      if (ws.length < 2) return both('Log your weight each morning to see your trend here.', 'سجّل وزنك كل صباح عشان تشوف متوسطك هنا.');
      const last = avg(ws.slice(-7).map(e => e.weight))!, prev = ws.filter(e => diffDays(e.date, todayISO()) >= 7).slice(-7);
      const pa = avg(prev.map(e => e.weight));
      const rate = pa != null ? ((last - pa) / pa) * 100 : null;
      return both(`Your 7-day average: ${r1(last)} kg${rate != null ? ` (${rate > 0 ? '+' : ''}${r1(rate)}% vs. the week before)` : ''}.`, `متوسط ٧ أيام عندك: ${r1(last)} كجم${rate != null ? ` (${rate > 0 ? '+' : ''}${r1(rate)}٪ عن الأسبوع اللي قبله)` : ''}.`);
    }
    case 'chicken': {
      const items = resolveDay(todayISO()).flatMap(m => m.items).filter(i => i.food?.cookedFactor);
      if (!items.length) return null;
      const i = items.sort((a, b) => b.amount - a.amount)[0];
      return both(`Your plan: ${i.amount} g raw ≈ ${Math.round(i.amount * i.food!.cookedFactor!)} g cooked.`, `خطتك: ${i.amount} جم نيء ≈ ${Math.round(i.amount * i.food!.cookedFactor!)} جم مطبوخ.`);
    }
    case 'magnesium': return both('Coach’s note on Meal 4: one capsule before bed.', 'ملاحظة المدرب على الوجبة ٤: كبسولة قبل النوم.');
    case 'steps': return both(`Your target: ${s.steps.toLocaleString()} steps a day.`, `هدفك: ${s.steps.toLocaleString()} خطوة يوميًا.`);
    case 'sleep': return both(`Your target: ${s.sleep} hours a night.`, `هدفك: ${s.sleep} ساعات في الليلة.`);
    case 'water': return both(`Your target: ${s.water} ml a day.`, `هدفك: ${s.water} مل يوميًا.`);
  }
}
