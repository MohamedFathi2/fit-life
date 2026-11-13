export type Lang = 'en' | 'ar';
export type L10n = { en: string; ar: string };

/* ---------- library ---------- */
export interface Exercise {
  id: string;
  name: L10n;
  muscle: string; // key into MUSCLES
  video?: string | null;
  custom?: boolean;
}

export interface Food {
  id: string;
  name: L10n;
  cat: string; // key into FOOD_CATS
  unit: string; // g | ml | large | slice | caps …
  per: number; // values below are per `per` units (100 for g/ml, 1 for pieces)
  kcal: number;
  p: number;
  c: number;
  f: number;
  /** cooked weight = raw weight × cookedFactor (display helper for meal prep) */
  cookedFactor?: number;
  custom?: boolean;
}

/* ---------- plan ---------- */
export interface PlanSet { reps: string; rest: number; rir: number | null; tempo?: string | null }
export interface PlanExercise { uid: string; exId: string; sets: PlanSet[]; note?: L10n | null }
export interface TrainingDay { uid: string; name: L10n; rest: boolean; exercises: PlanExercise[] }

export interface PlanItem {
  uid: string;
  foodId: string;
  amount: number;
  /** what the coach originally prescribed, kept so a swap can be undone */
  orig?: { foodId: string; amount: number };
}
export interface Meal { uid: string; name: L10n; note?: L10n | null; trainingOnly?: boolean; items: PlanItem[] }

export interface Plan {
  version: number;
  nutrition: { phase: L10n; meals: Meal[] };
  training: { name: string; days: TrainingDay[] };
}

/* ---------- logs ---------- */
export interface Macros { kcal: number; p: number; c: number; f: number }

export interface DayLog {
  /** plan item uid → eaten */
  eaten: Record<string, boolean>;
  /** plan item uid → replacement for this day only */
  swaps: Record<string, { foodId: string; amount: number }>;
  extras: { uid: string; foodId?: string; name?: string; amount: number; unit?: string; macros?: Macros }[];
  water: number;
  steps: number | null;
  sleep: number | null;
  habits: Record<string, boolean>;
  dayType?: 'train' | 'rest';
  journal?: string;
}

export interface LoggedSet { w: string; r: string; rir: string; done: boolean; tr?: string; trir?: number | null; rest?: number }
export interface LoggedExercise { uid: string; exId: string; cardio?: boolean; sets: LoggedSet[]; note?: string; swappedFrom?: string }
export interface Workout {
  id: string;
  date: string;
  dayUid?: string;
  name: L10n;
  start: number;
  end?: number;
  exercises: LoggedExercise[];
  note?: string;
}

export interface BodyEntry {
  date: string; // also the id
  weight?: number | null;
  waist?: number | null;
  chest?: number | null;
  arm?: number | null;
  thigh?: number | null;
  hips?: number | null;
  neck?: number | null;
  bf?: number | null;
  photo?: string | null; // photo id
}

export interface Checkin {
  id: string;
  date: string;
  energy: number; hunger: number; sleepQ: number; stress: number; digestion: number;
  dietAdh?: string;
  wins?: string; struggles?: string; questions?: string;
  summary?: Record<string, number | null>;
}

export interface Habit { id: string; name: string }

export interface Settings {
  lang: Lang;
  theme: 'auto' | 'light' | 'dark';
  cycleStart: string;
  water: number;
  glass: number;
  steps: number;
  sleep: number;
  habits: Habit[];
  swapMode: 'auto' | 'kcal' | 'p' | 'c' | 'f';
  plateStep: number;
}
