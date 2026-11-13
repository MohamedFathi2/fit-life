import type { Meal, Plan, PlanItem } from '../types';
import { defaultTraining } from './exercises';

export const PLAN_VERSION = 1;

let n = 0;
const I = (foodId: string, amount: number, orig?: [string, number]): PlanItem => ({
  uid: `pi${++n}`, foodId, amount, ...(orig ? { orig: { foodId: orig[0], amount: orig[1] } } : {}),
});

/** Coach's plan (Belghamdi portal, Nov 2026): 2321 kcal cut, 5 meals + 7-day split. */
export function defaultPlan(): Plan {
  n = 0;
  const meals: Meal[] = [
    { uid: 'm1', name: { en: 'Breakfast', ar: 'الفطور' }, items: [
      I('brownToast', 30), I('egg', 3), I('chocSpread', 11.9, ['mozzarella', 15]),
    ] },
    { uid: 'm2', name: { en: 'Lunch', ar: 'الغداء' }, items: [
      I('salad', 100), I('oliveOil', 10), I('chicken', 100), I('bakedPotato', 150),
    ] },
    { uid: 'm3', name: { en: 'Pre-workout', ar: 'قبل التمرين' }, trainingOnly: true,
      note: { en: '1.5 hours before training. Skip it on rest days.', ar: 'قبل التمرين بساعة ونصف، ويتم حذفها في أيام الراحة' },
      items: [I('brownToast', 60), I('jam', 50)] },
    { uid: 'm4', name: { en: 'Meal 3', ar: 'الوجبة ٣' },
      note: { en: 'Use the same weight of breadcrumbs as the flour to bread the chicken before microwaving it.', ar: 'خد بنفس وزن الدقيق بقسماط، اعمل بيه بريدينج للفراخ قبل ما تحطها في المايكروويف' },
      items: [I('salad', 100), I('bakedPotato', 200), I('wwFlour', 50), I('oliveOil2', 15), I('chicken', 250)] },
    { uid: 'm5', name: { en: 'Meal 4', ar: 'الوجبة ٤' },
      note: { en: 'Take one magnesium glycinate capsule before bed.', ar: 'خد حباية ماغنيسيوم جلايسينات قبل النوم' },
      items: [I('skimMilk', 200), I('dates', 53.2, ['strawberries', 200]), I('oats', 30), I('cottage', 300), I('chia', 10)] },
  ];
  return { version: PLAN_VERSION, nutrition: { phase: { en: 'Cut', ar: 'تنشيف' }, meals }, training: defaultTraining() };
}
