import type { Exercise, L10n, PlanSet, TrainingDay } from '../types';

export const MUSCLES: Record<string, L10n> = {
  Core: { en: 'Core', ar: 'الجذع' },
  Abs: { en: 'Abs', ar: 'البطن' },
  Chest: { en: 'Chest', ar: 'الصدر' },
  Back: { en: 'Back', ar: 'الظهر' },
  Shoulders: { en: 'Shoulders', ar: 'الأكتاف' },
  Triceps: { en: 'Triceps', ar: 'الترايسبس' },
  Biceps: { en: 'Biceps', ar: 'البايسبس' },
  Arms: { en: 'Arms', ar: 'الذراعين' },
  Forearms: { en: 'Forearms', ar: 'الساعد' },
  Legs: { en: 'Legs', ar: 'الأرجل' },
  Glutes: { en: 'Glutes', ar: 'الأرداف' },
  Calves: { en: 'Calves', ar: 'السمانة' },
  Cardio: { en: 'Cardio', ar: 'كارديو' },
};

const X = (id: string, en: string, ar: string, muscle: string, video: string | null): Exercise => ({ id, name: { en, ar }, muscle, video });

/** Coach's exercise library (names, muscle group, demo video), from the Belghamdi portal. */
export const EXERCISES: Exercise[] = [
  X('cableCrunch', 'Lengthened Cable Crunches', 'كرنش الكابل بمدى ممتد', 'Core', 'https://www.youtube.com/shorts/hC35L2es1bs'),
  X('smithIncline', 'Low Incline Smith Chest Press', 'ضغط صدر سميث بميل منخفض', 'Chest', 'https://www.youtube.com/shorts/pXnB5KhUxsQ'),
  X('butterfly', 'Butterfly Machine', 'جهاز الفراشة', 'Chest', 'https://youtu.be/KRsCUdcX0Fs'),
  X('tBarRow', 'T-Bar Row', 'تجديف تي بار', 'Back', 'https://www.youtube.com/watch?v=ZC_e4XNBtoI'),
  X('reverseFly', 'Reverse Butterfly', 'فراشة عكسي', 'Shoulders', 'https://www.youtube.com/watch?v=p7PBTzvja4w'),
  X('smithOhShrug', 'Overhead Shrugs (Smith Machine)', 'ترابيس فوق الرأس على السميث', 'Back', 'https://www.youtube.com/shorts/9CJyxZ6UFuU'),
  X('ropePushdown', 'Double Rope Pushdown', 'بوش داون بحبلين', 'Triceps', 'https://www.youtube.com/watch?v=qMen5GVP5fo'),
  X('noCheatCurl', 'Assisted No-Cheat Curl', 'بايسبس بدون غش (مدعوم)', 'Arms', 'https://www.tiktok.com/@belghamdi.coaching/video/7358142284233264389'),
  X('reverseCurl', 'Cable Reverse Curls', 'بايسبس عكسي بالكابل', 'Forearms', 'https://www.youtube.com/watch?v=DhRUGDH2NRw'),
  X('scapPush', 'Scapular SA Cable Push', 'دفع الكتف بالكابل بذراع واحدة', 'Core', 'https://www.youtube.com/shorts/j_vNs3gw9UU'),
  X('widePulldown', 'Wide Grip Lat Pulldown', 'سحب أمامي بقبضة واسعة', 'Back', 'https://www.youtube.com/watch?v=EZyiohrj6AQ'),
  X('treadmill', 'Treadmill Walk', 'مشاية', 'Cardio', null),
  X('plank', 'Plank (Phase 1)', 'بلانك (المرحلة ١)', 'Core', 'https://www.instagram.com/reel/C4-8Ye8I7tk/'),
  X('dbLateral', 'DB Lateral Raises', 'رفرفة جانبي بالدمبل', 'Shoulders', 'https://www.youtube.com/watch?v=AMK2ju7Q68c'),
  X('hipFlexion', 'Cable Hip Flexion', 'ثني الورك بالكابل', 'Legs', 'https://www.youtube.com/shorts/ONCg73p8WgE'),
  X('calfRaise', 'Calf Raises', 'رفع السمانة', 'Calves', 'https://www.youtube.com/watch?v=wfFMMCjSDDg'),
  X('legPress', 'Leg Press', 'مكبس الأرجل', 'Legs', 'https://www.youtube.com/watch?v=G5SNv5uM84Q'),
  X('hipThrust', 'Hip Thrust', 'دفع الورك', 'Glutes', 'https://www.youtube.com/watch?v=WQGSajC_-tY'),
  X('legCurl', 'Leg Curl', 'رجل خلفي', 'Legs', 'https://www.youtube.com/watch?v=j1nMlG_e79c'),
  X('legExt', 'Leg Extension', 'رجل أمامي', 'Legs', 'https://www.youtube.com/watch?v=feQt2tJe_ks'),
  X('adductors', 'Adductors', 'جهاز الضامة (الفخذ الداخلي)', 'Legs', 'https://www.youtube.com/watch?v=qfiyJLkQC3s'),
  X('pulldownCrunch', 'Lat Pulldown Crunches', 'كرنش على جهاز السحب', 'Abs', 'https://www.youtube.com/watch?v=PoJb1yOd6Y4'),
  X('pallof', 'Pallof Rotation', 'دوران بالوف', 'Abs', 'https://www.youtube.com/watch?v=nbbkibIUTSc'),
  X('wristExt', 'Wrist Extension', 'مد الرسغ', 'Forearms', 'https://www.youtube.com/shorts/xENVg7RX_O8'),
  X('plateRow', 'Plate Loaded Row Machine', 'جهاز تجديف بالأوزان', 'Back', 'https://www.youtube.com/shorts/Dic11ZQvYNQ'),
  X('cableLateral', 'Cable Lateral Raises', 'رفرفة جانبي بالكابل', 'Shoulders', 'https://www.youtube.com/watch?v=WF9oZyEHnU4'),
  X('saOhExt', 'SA Overhead Triceps Extension', 'تمرين ترايسبس اوفرهيد', 'Triceps', 'https://www.youtube.com/watch?v=0sNnjugunwo'),
  X('saPulldown', 'SA Lat Pulldown (Neutral Grip)', 'سحب أمامي بذراع واحدة (قبضة محايدة)', 'Back', 'https://www.youtube.com/watch?v=fy2vAukc0YQ'),
  X('shoulderPress', 'Shoulder Press Machine', 'جهاز ضغط الأكتاف', 'Shoulders', 'https://www.youtube.com/watch?v=EXci6B3lhg0'),
  X('cableShrug', 'Cable Shrugs', 'ترابيس بالكابل', 'Back', 'https://www.youtube.com/shorts/S9OXkqZB_uc'),
  X('wideSeatedRow', 'Wide Grip Seated Row', 'تجديف جالس بقبضة واسعة', 'Back', 'https://www.youtube.com/watch?v=iXGHN-MWFfY'),
  X('saPullover', 'SA Pullover', 'بول أوفر بذراع واحدة', 'Back', 'https://www.youtube.com/shorts/K77FHm3-8xU'),
  X('wristCurl', 'Wrist Curls', 'ثني الرسغ', 'Forearms', 'https://www.youtube.com/watch?v=2jGS_GuSA90'),
];

const N = {
  cardio40: { en: '40 min, moderate intensity', ar: '٤٠ دقيقة بشدة متوسطة' },
  cardio20: { en: '20 min, moderate intensity', ar: '٢٠ دقيقة بشدة متوسطة' },
  saOhExt: { en: 'Rest between arms, and start with the weaker one', ar: 'الراحة بين كل دراع و ابدء ب الاضعف' },
};

// [reps, restSeconds, RIR, tempo?]
type S = [string, number, number | null, string?];
let n = 0;
const E = (exId: string, sets: S[], note?: L10n) => ({
  uid: `pe${++n}`,
  exId,
  sets: sets.map(([reps, rest, rir, tempo]): PlanSet => ({ reps, rest, rir, tempo: tempo ?? null })),
  note: note ?? null,
});
const D = (uid: string, en: string, ar: string, exercises: ReturnType<typeof E>[] = []): TrainingDay => ({ uid, name: { en, ar }, rest: exercises.length === 0, exercises });

/** Coach's 7-day ULRURFR split. */
export function defaultTraining() {
  n = 0;
  return {
    name: 'ULRURFR "shoulders, chest, abs"',
    days: [
      D('d1', 'Upper', 'علوي', [
        E('cableCrunch', [['8-12', 60, 2], ['8-12', 60, 2], ['8-12', 60, 2]]),
        E('smithIncline', [['4-10', 180, 1], ['4-10', 180, 1]]),
        E('butterfly', [['5-12', 120, 1], ['5-12', 120, 0]]),
        E('tBarRow', [['5-12', 180, 1], ['5-12', 180, 0]]),
        E('reverseFly', [['5-12', 150, 0]]),
        E('smithOhShrug', [['5-12', 120, 0], ['5-12', 120, 0]]),
        E('ropePushdown', [['8-12', 150, 0]]),
        E('noCheatCurl', [['5-12', 150, 1], ['5-12', 150, 1]]),
        E('reverseCurl', [['5-12', 120, 0], ['5-12', 120, 0]]),
        E('scapPush', [['5-12', 120, 0], ['5-12', 120, 0]]),
        E('widePulldown', [['6-10', 120, 0], ['6-10', 120, 0]]),
        E('treadmill', [['40', 0, null]], N.cardio40),
        E('plank', [['5-12', 120, 0], ['5-12', 120, 0]]),
      ]),
      D('d2', 'Lower', 'سفلي', [
        E('dbLateral', [['5-12', 120, 0], ['5-12', 120, 0], ['5-12', 120, 0]]),
        E('hipFlexion', [['5-12', 120, 0], ['5-12', 120, 0]]),
        E('calfRaise', [['4-10', 150, 1], ['4-10', 150, 0]]),
        E('legPress', [['5-12', 240, 1], ['5-12', 240, 0, '0-0-0-0']]),
        E('hipThrust', [['6-12', 180, 1], ['6-12', 180, 1, '0-0-0-0']]),
        E('legCurl', [['5-12', 150, 0]]),
        E('legExt', [['8-12', 150, 1], ['8-12', 150, 0]]),
        E('adductors', [['6-10', 150, 1], ['6-10', 150, 0]]),
        E('pulldownCrunch', [['5-12', 120, 0], ['5-12', 120, 0], ['5-12', 120, 0]]),
        E('pallof', [['5-12', 120, 0], ['5-12', 120, 0]]),
        E('wristExt', [['5-12', 120, 0], ['5-12', 120, 0]]),
        E('treadmill', [['20', 0, null]], N.cardio20),
      ]),
      D('d3', 'Rest', 'راحة'),
      D('d4', 'Upper', 'علوي', [
        E('hipFlexion', [['5-12', 120, 0], ['5-12', 120, 0]]),
        E('smithIncline', [['5-12', 180, 1], ['5-12', 180, 0]]),
        E('plateRow', [['5-12', 180, 0], ['5-12', 180, 0]]),
        E('cableLateral', [['5-12', 150, 0], ['5-12', 150, 0]]),
        E('butterfly', [['5-12', 120, 0], ['5-12', 120, 0]]),
        E('pulldownCrunch', [['5-12', 120, 0], ['5-12', 120, 0]]),
        E('saOhExt', [['8-12', 60, 1], ['8-12', 60, 1]], N.saOhExt),
        E('saPulldown', [['4-10', 180, 0], ['4-10', 180, 0]]),
        E('shoulderPress', [['5-12', 180, 0]]),
        E('cableShrug', [['5-12', 150, 0], ['5-12', 150, 0]]),
        E('noCheatCurl', [['8-12', 150, 1], ['8-12', 150, 1]]),
        E('reverseFly', [['5-12', 120, 0]]),
        E('treadmill', [['40', 0, null]], N.cardio40),
      ]),
      D('d5', 'Rest', 'راحة'),
      D('d6', 'Full Body', 'جسم كامل', [
        E('hipFlexion', [['5-12', 120, 0], ['5-12', 120, 0]]),
        E('smithIncline', [['5-12', 120, 0], ['5-12', 120, 0]]),
        E('calfRaise', [['8-12', 150, 0], ['8-12', 150, 0]]),
        E('butterfly', [['5-12', 180, 0]]),
        E('dbLateral', [['5-12', 120, 0], ['5-12', 120, 0]]),
        E('wideSeatedRow', [['5-12', 180, 0], ['5-12', 180, 0]]),
        E('saPullover', [['5-12', 150, 0], ['5-12', 150, 0]]),
        E('saOhExt', [['5-12', 60, 1], ['5-12', 60, 0]], N.saOhExt),
        E('cableShrug', [['5-12', 150, 0], ['5-12', 150, 0]]),
        E('wristCurl', [['5-12', 120, 0], ['5-12', 120, 0]]),
        E('legExt', [['8-12', 150, 0], ['8-12', 150, 0]]),
        E('legCurl', [['6-10', 150, 0], ['6-10', 150, 0]]),
      ]),
      D('d7', 'Rest', 'راحة'),
    ],
  };
}
