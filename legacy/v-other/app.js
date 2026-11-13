/* Fit Life Tracker — no-install, bilingual (EN / AR), data in localStorage. */
(() => {
"use strict";
const D = window.PLAN_DATA;
const STORE_KEY = "fitlife.v1";

/* ---------- i18n ---------- */
const T = {
  appTitle: ["Fit Life", "حياة صحية"],
  home: ["Home", "الرئيسية"], nutrition: ["Nutrition", "التغذية"], training: ["Training", "التدريب"],
  progress: ["Progress", "التقدم"], habits: ["Habits", "العادات"], settings: ["Settings", "الإعدادات"],
  today: ["Today", "اليوم"], todaysWorkout: ["Today's workout", "تمرين اليوم"], restDay: ["Rest day", "يوم راحة"],
  startWorkout: ["Open workout", "افتح التمرين"], calories: ["Calories", "السعرات"], kcal: ["kcal", "سعرة"],
  protein: ["Protein", "بروتين"], carbs: ["Carbs", "كربوهيدرات"], fat: ["Fat", "دهون"],
  eaten: ["eaten", "مأكول"], target: ["target", "الهدف"], left: ["left", "متبقي"],
  weight: ["Weight", "الوزن"], kg: ["kg", "كجم"], streak: ["Workout streak", "أيام التمرين المتتالية"],
  workoutsThisWeek: ["Workouts this week", "تمارين هذا الأسبوع"], water: ["Water", "الماء"],
  glasses: ["glasses", "أكواب"], steps: ["Steps", "الخطوات"], sleep: ["Sleep", "النوم"], hours: ["hours", "ساعات"],
  sets: ["Sets", "مجموعات"], set: ["Set", "مجموعة"], reps: ["Reps", "تكرارات"], rir: ["RIR", "RIR"],
  rest: ["Rest", "راحة"], tempo: ["Tempo", "إيقاع"], prev: ["Last", "السابق"], watchVideo: ["▶ Watch video", "▶ مشاهدة الفيديو"],
  finish: ["Finish workout", "إنهاء التمرين"], saved: ["Saved", "تم الحفظ"], workoutSaved: ["Workout saved 💪", "تم حفظ التمرين 💪"],
  restTimer: ["Rest", "راحة"], restDone: ["Rest done — go!", "انتهت الراحة — يلا!"],
  day: ["Day", "اليوم"], nextUp: ["Next in rotation", "التالي في الدورة"], history: ["History", "السجل"],
  noHistory: ["No workouts logged yet.", "لا توجد تمارين مسجلة بعد."], exercises: ["exercises", "تمارين"],
  isTrainingDay: ["Training day (include pre-workout meal)", "يوم تمرين (تشمل وجبة ما قبل التمرين)"],
  swappedFrom: ["Swapped from", "تم الاستبدال من"], nutritionFacts: ["Nutrition facts", "القيم الغذائية"],
  per: ["per", "لكل"], noFacts: ["No data", "لا توجد بيانات"], mealDone: ["Mark whole meal", "تحديد الوجبة كاملة"],
  extraFood: ["Extra food", "أكل إضافي"], add: ["Add", "إضافة"], name: ["Name", "الاسم"],
  foodLibrary: ["Food library", "قائمة الأطعمة"], amount: ["Amount", "الكمية"],
  bodyWeight: ["Body weight", "وزن الجسم"], measurements: ["Measurements (cm)", "القياسات (سم)"],
  waist: ["Waist", "الخصر"], chest: ["Chest", "الصدر"], arm: ["Arm", "الذراع"], thigh: ["Thigh", "الفخذ"],
  hips: ["Hips", "الأرداف"], neck: ["Neck", "الرقبة"], date: ["Date", "التاريخ"], save: ["Save", "حفظ"],
  all: ["All", "الكل"], days30: ["30 days", "30 يوم"], days90: ["90 days", "90 يوم"], months6: ["6 months", "6 أشهر"],
  photos: ["Progress photos", "صور التقدم"], addPhoto: ["Add photo", "إضافة صورة"],
  strength: ["Strength progress", "تقدم القوة"], est1rm: ["Best estimated 1RM", "أفضل تقدير لأقصى وزن"],
  notEnough: ["Log at least 2 entries to see a chart.", "سجّل قيمتين على الأقل لعرض الرسم."],
  entries: ["Entries", "السجلات"], delete: ["Delete", "حذف"],
  dailyHabits: ["Daily habits", "العادات اليومية"], magnesium: ["Magnesium before bed", "ماغنيسيوم قبل النوم"],
  cardio: ["Cardio done", "تم الكارديو"], followedDiet: ["Followed the meal plan", "التزمت بخطة الأكل"],
  stretch: ["Stretching / mobility", "إطالات / مرونة"],
  checkin: ["Weekly check-in", "المتابعة الأسبوعية"], energy: ["Energy", "الطاقة"], hunger: ["Hunger", "الجوع"],
  sleepQuality: ["Sleep quality", "جودة النوم"], stress: ["Stress", "التوتر"], adherence: ["Diet adherence", "الالتزام بالأكل"],
  trainingPerf: ["Training performance", "الأداء في التمرين"], notesForCoach: ["Notes (wins, problems, questions for coach)", "ملاحظات (إنجازات، مشاكل، أسئلة للمدرب)"],
  submitCheckin: ["Save check-in", "حفظ المتابعة"], pastCheckins: ["Past check-ins", "المتابعات السابقة"],
  copySummary: ["Copy summary for coach", "نسخ ملخص للمدرب"], copied: ["Copied", "تم النسخ"],
  language: ["Language", "اللغة"], backup: ["Backup", "النسخ الاحتياطي"],
  backupHint: ["Your logs are saved only in this browser. Export a backup file regularly.", "بياناتك محفوظة في هذا المتصفح فقط. صدّر نسخة احتياطية بانتظام."],
  exportData: ["Export backup (.json)", "تصدير نسخة احتياطية"], importData: ["Import backup", "استيراد نسخة احتياطية"],
  imported: ["Backup imported", "تم الاستيراد"], badFile: ["That file is not a valid backup", "الملف غير صالح"],
  resetAll: ["Erase all my logs", "مسح كل السجلات"], confirmReset: ["Erase all logs on this device? This cannot be undone.", "مسح كل السجلات من هذا الجهاز؟ لا يمكن التراجع."],
  confirmDelete: ["Delete this entry?", "حذف هذا السجل؟"], planInfo: ["Coach plan", "خطة المدرب"],
  planExported: ["Plan copied from the coach portal on", "تم نسخ الخطة من بوابة المدرب بتاريخ"],
  rotationStart: ["Which plan day is today?", "أي يوم في الخطة اليوم؟"],
  sun: ["Sun", "أحد"], mon: ["Mon", "اثنين"], tue: ["Tue", "ثلاثاء"], wed: ["Wed", "أربعاء"], thu: ["Thu", "خميس"], fri: ["Fri", "جمعة"], sat: ["Sat", "سبت"],
  storageFull: ["Storage is full. Export a backup and delete some photos.", "التخزين ممتلئ. صدّر نسخة واحذف بعض الصور."],
  volume: ["Volume", "الحجم"], duration: ["Duration", "المدة"], min: ["min", "دقيقة"],
  editWorkout: ["Workout in progress — saved automatically.", "التمرين جارٍ — يتم الحفظ تلقائياً."],
  completed: ["Completed", "مكتمل"]
};
const S = { lang: "en" };
const t = k => (T[k] ? T[k][S.lang === "ar" ? 1 : 0] : k);
const L = o => (o == null ? "" : typeof o === "string" ? o : (S.lang === "ar" ? (o.ar || o.en) : (o.en || o.ar)));
const num = n => (S.lang === "ar" ? Number(n).toLocaleString("ar-EG") : Number(n).toLocaleString("en-US"));
const r0 = n => Math.round(n);
const r1 = n => Math.round(n * 10) / 10;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- dates ---------- */
const dkey = (d = new Date()) => { const z = new Date(d); z.setMinutes(z.getMinutes() - z.getTimezoneOffset()); return z.toISOString().slice(0, 10); };
const TODAY = () => dkey();
const addDays = (k, n) => { const d = new Date(k + "T12:00:00"); d.setDate(d.getDate() + n); return dkey(d); };
const daysBetween = (a, b) => Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 864e5);
const fmtDate = k => new Date(k + "T12:00:00").toLocaleDateString(S.lang === "ar" ? "ar-EG" : "en-GB", { weekday: "short", day: "numeric", month: "short" });

/* ---------- storage ---------- */
const blank = () => ({
  v: 1, lang: "en",
  rotation: { anchorDate: TODAY(), anchorDay: 0 },   // plan day index on anchorDate
  workouts: {},   // date -> { day, sets: { "exIdx": [{w, r, rir, done}] }, finished, startedAt, finishedAt }
  food: {},       // date -> { eaten: {"m-i": true}, training: bool, extras: [{name,kcal,p,c,f}] }
  body: [],       // [{date, weight, waist, chest, arm, thigh, hips, neck}]
  photos: [],     // [{date, src}]
  habits: {},     // date -> { water, steps, sleep, mag, cardio, diet, stretch }
  checkins: []    // [{date, energy, hunger, sleepQ, stress, adherence, perf, notes}]
});
let DB;
function load() {
  try { DB = Object.assign(blank(), JSON.parse(localStorage.getItem(STORE_KEY) || "{}")); }
  catch { DB = blank(); }
  S.lang = DB.lang || "en";
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(DB)); }
  catch (e) { toast(t("storageFull")); }
}

/* ---------- plan helpers ---------- */
const DAYS = D.training.days;
const planDayFor = k => {
  const w = DB.workouts[k];
  if (w && w.day != null) return w.day;
  const n = DAYS.length;
  return (((DB.rotation.anchorDay + daysBetween(DB.rotation.anchorDate, k)) % n) + n) % n;
};
const isRest = i => DAYS[i].ex.length === 0;
const exInfo = id => D.exercises[id];
const ytId = url => { const m = url && url.match(/(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/); return m ? m[1] : null; };
const thumb = url => { const id = ytId(url); return id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : null; };
const videoIcon = url => !url ? "🏃" : /tiktok/.test(url) ? "🎵" : /instagram/.test(url) ? "📸" : "▶";
const foodMacros = (id, amt) => {
  const f = D.foods[id];
  if (!f || f.kcal == null) return { kcal: 0, p: 0, c: 0, f: 0 };
  const k = amt / f.servingSize;
  return { kcal: f.kcal * k, p: f.p * k, c: f.c * k, f: f.f * k };
};
const sumM = arr => arr.reduce((a, m) => ({ kcal: a.kcal + m.kcal, p: a.p + m.p, c: a.c + m.c, f: a.f + m.f }), { kcal: 0, p: 0, c: 0, f: 0 });
const foodDay = k => (DB.food[k] ||= { eaten: {}, training: !isRest(planDayFor(k)), extras: [] });
function dayTargets(k) {
  const fd = foodDay(k);
  const all = [];
  D.nutrition.meals.forEach(m => { if (m.trainingDaysOnly && !fd.training) return; m.items.forEach(([id, a]) => all.push(foodMacros(id, a))); });
  return sumM(all);
}
function dayEaten(k) {
  const fd = foodDay(k);
  const all = [];
  D.nutrition.meals.forEach((m, mi) => {
    if (m.trainingDaysOnly && !fd.training) return;
    m.items.forEach(([id, a], ii) => { if (fd.eaten[`${mi}-${ii}`]) all.push(foodMacros(id, a)); });
  });
  (fd.extras || []).forEach(x => all.push({ kcal: +x.kcal || 0, p: +x.p || 0, c: +x.c || 0, f: +x.f || 0 }));
  return sumM(all);
}
const e1rm = (w, r) => (w > 0 && r > 0 ? w * (1 + r / 30) : 0);
function lastSetsFor(exId, beforeKey) {
  const keys = Object.keys(DB.workouts).filter(k => k < beforeKey).sort().reverse();
  for (const k of keys) {
    const w = DB.workouts[k];
    const day = DAYS[w.day]; if (!day) continue;
    const idx = day.ex.findIndex(e => e[0] === exId);
    const s = idx >= 0 && w.sets[idx];
    if (s && s.some(x => x.done && (x.w || x.r))) return { date: k, sets: s };
  }
  return null;
}
const workoutDone = w => w && Object.values(w.sets || {}).some(s => s.some(x => x.done));

/* ---------- UI shell ---------- */
const view = document.getElementById("view");
const TABS = [["home", "🏠"], ["nutrition", "🥗"], ["training", "🏋️"], ["progress", "📈"], ["habits", "✅"]];
let tab = "home";
const ui = { trainDate: TODAY(), foodDate: TODAY(), habitDate: TODAY(), range: 90, strengthEx: null };

function render() {
  document.documentElement.lang = S.lang;
  document.documentElement.dir = S.lang === "ar" ? "rtl" : "ltr";
  document.getElementById("title").textContent = t("appTitle");
  document.title = t("appTitle");
  document.getElementById("langBtn").textContent = S.lang === "ar" ? "English" : "عربي";
  document.getElementById("tabbar").innerHTML = TABS.map(([k, i]) =>
    `<button class="${tab === k ? "on" : ""}" data-action="go" data-tab="${k}"><span class="ico">${i}</span>${t(k)}</button>`).join("");
  view.innerHTML = ({ home: vHome, nutrition: vNutrition, training: vTraining, progress: vProgress, habits: vHabits, settings: vSettings })[tab]();
  if (tab === "progress") drawCharts();
}
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg; el.classList.remove("hidden");
  clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.add("hidden"), 1800);
}
const dateNav = (which, k) => `
  <div class="row spread card" style="padding:8px 10px">
    <button class="icon-btn" data-action="date" data-which="${which}" data-d="-1">${S.lang === "ar" ? "→" : "←"}</button>
    <div style="text-align:center"><b>${k === TODAY() ? t("today") : fmtDate(k)}</b>${k === TODAY() ? `<div class="small muted">${fmtDate(k)}</div>` : ""}</div>
    <button class="icon-btn" data-action="date" data-which="${which}" data-d="1" ${k >= TODAY() ? "disabled style='opacity:.3'" : ""}>${S.lang === "ar" ? "←" : "→"}</button>
  </div>`;
const bar = (val, max, color) => `<div class="bar"><i style="width:${Math.min(100, max ? (val / max) * 100 : 0)}%;background:${color}"></i></div>`;
const ring = (val, max) => {
  const p = Math.min(1, max ? val / max : 0), R = 52, C = 2 * Math.PI * R;
  const over = val > max * 1.05;
  return `<svg class="ring" viewBox="0 0 120 120"><circle cx="60" cy="60" r="${R}" fill="none" stroke="var(--line)" stroke-width="10"/>
    <circle cx="60" cy="60" r="${R}" fill="none" stroke="${over ? "var(--bad)" : "var(--accent)"}" stroke-width="10" stroke-linecap="round"
      stroke-dasharray="${C * p} ${C}" transform="rotate(-90 60 60)"/>
    <text x="60" y="58" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text)">${num(r0(val))}</text>
    <text x="60" y="76" text-anchor="middle" font-size="11" fill="var(--muted)">/ ${num(r0(max))} ${t("kcal")}</text></svg>`;
};
function macroBlock(e, g) {
  return `<div class="row" style="gap:16px;align-items:center">
    ${ring(e.kcal, g.kcal)}
    <div class="macro-bars grow">
      ${[["protein", "p", "var(--p)"], ["carbs", "c", "var(--c)"], ["fat", "f", "var(--f)"]].map(([n, k, col]) => `
        <div><div class="row spread small"><span>${t(n)}</span><span>${num(r0(e[k]))} / ${num(r0(g[k]))}g</span></div>${bar(e[k], g[k], col)}</div>`).join("")}
    </div></div>`;
}

/* ---------- Home ---------- */
function vHome() {
  const k = TODAY(), di = planDayFor(k), day = DAYS[di], w = DB.workouts[k];
  const e = dayEaten(k), g = dayTargets(k);
  const h = DB.habits[k] || {};
  const weights = DB.body.filter(b => b.weight).sort((a, b) => a.date.localeCompare(b.date));
  const lastW = weights.at(-1), firstW = weights[0];
  // streak: consecutive plan days (rest days don't break it) with a workout logged
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const kk = addDays(k, -i), d = planDayFor(kk);
    if (isRest(d)) continue;
    if (workoutDone(DB.workouts[kk])) streak++; else if (i > 0) break;
  }
  const weekStart = addDays(k, -6);
  const thisWeek = Object.keys(DB.workouts).filter(x => x >= weekStart && x <= k && workoutDone(DB.workouts[x])).length;
  return `
  <h2>${t("today")} · <span class="muted" style="font-weight:400">${fmtDate(k)}</span></h2>
  <div class="card">
    <div class="row spread"><h3>${t("todaysWorkout")}</h3><span class="badge">${t("day")} ${num(di + 1)}/${num(DAYS.length)}</span></div>
    ${isRest(di) ? `<p>😴 ${t("restDay")}</p>` : `
      <p style="margin:0 0 10px"><b>${L(day)}</b> · ${num(day.ex.length)} ${t("exercises")} ${workoutDone(w) ? `· <span style="color:var(--good)">✓ ${t("completed")}</span>` : ""}</p>
      <button class="btn primary" data-action="go" data-tab="training">${t("startWorkout")}</button>`}
  </div>
  <div class="card"><div class="row spread"><h3>${t("nutrition")}</h3><button class="chip" data-action="go" data-tab="nutrition">${S.lang === "ar" ? "←" : "→"}</button></div>${macroBlock(e, g)}</div>
  <div class="grid4">
    <div class="stat"><b>${lastW ? num(lastW.weight) : "—"}</b><span>${t("weight")} (${t("kg")})${lastW && firstW !== lastW ? `<br>${lastW.weight - firstW.weight > 0 ? "+" : ""}${num(r1(lastW.weight - firstW.weight))}` : ""}</span></div>
    <div class="stat"><b>${num(streak)}</b><span>${t("streak")}</span></div>
    <div class="stat"><b>${num(thisWeek)}</b><span>${t("workoutsThisWeek")}</span></div>
    <div class="stat"><b>${num(h.water || 0)}</b><span>${t("water")} (${t("glasses")})</span></div>
  </div>`;
}

/* ---------- Training ---------- */
function vTraining() {
  const k = ui.trainDate, di = planDayFor(k), day = DAYS[di];
  const w = DB.workouts[k];
  const chips = DAYS.map((d, i) => `<button class="chip ${i === di ? "on" : ""}" data-action="pick-day" data-i="${i}">${i + 1}. ${L(d)}</button>`).join("");
  let body;
  if (isRest(di)) body = `<div class="card" style="text-align:center;padding:30px">😴<h3>${t("restDay")}</h3><p class="muted small">${L(D.nutrition.meals[2].note)}</p></div>`;
  else body = day.ex.map(([id, sets, noteKey], xi) => {
    const ex = exInfo(id), m = D.muscles[ex.muscle];
    const logged = (w && w.sets[xi]) || [];
    const prev = lastSetsFor(id, k);
    const th = thumb(ex.video);
    const isCardio = id === "treadmill";
    return `<div class="card ex">
      <div class="ex-head">
        ${th ? `<a href="${esc(ex.video)}" target="_blank" rel="noopener"><img class="ex-thumb" src="${th}" alt="" loading="lazy"></a>`
             : `<div class="ex-thumb ph">${videoIcon(ex.video)}</div>`}
        <div class="grow">
          <div class="ex-name">${xi + 1}. ${esc(L(ex))}</div>
          <div class="ex-sub">${esc(L(m))} · ${sets.length} ${t("sets")}${sets[0][1] ? ` · ${t("rest")} ${fmtSec(sets[0][1])}` : ""}</div>
          ${S.lang === "ar" ? `<div class="ex-sub">${esc(ex.en)}</div>` : `<div class="ex-sub" dir="rtl" style="text-align:start">${esc(ex.ar)}</div>`}
          ${ex.video ? `<a class="small" href="${esc(ex.video)}" target="_blank" rel="noopener">${t("watchVideo")} ${/tiktok/.test(ex.video) ? "(TikTok)" : /instagram/.test(ex.video) ? "(Instagram)" : ""}</a>` : ""}
        </div>
      </div>
      ${noteKey ? `<div class="note">${esc(L(D.notes[noteKey]))}</div>` : ""}
      <table class="sets"><thead><tr><th>${t("set")}</th><th>${t("prev")}</th><th>${isCardio ? t("min") : t("kg")}</th><th>${isCardio ? "km" : t("reps")}</th><th>${t("rir")}</th><th></th></tr></thead><tbody>
      ${sets.map(([reps, rest, tempo, rir], si) => {
        const s = logged[si] || {}, p = prev && prev.sets[si];
        return `<tr class="${s.done ? "done" : ""}">
          <td>${si + 1}</td>
          <td class="prev">${p && p.done ? `${p.w ?? "–"}×${p.r ?? "–"}` : "—"}</td>
          <td><input type="number" inputmode="decimal" step="0.5" min="0" placeholder="${p && p.w ? p.w : ""}" value="${s.w ?? ""}" data-action="set-in" data-x="${xi}" data-s="${si}" data-f="w"></td>
          <td><input type="number" inputmode="numeric" min="0" placeholder="${esc(reps)}" value="${s.r ?? ""}" data-action="set-in" data-x="${xi}" data-s="${si}" data-f="r"></td>
          <td><input type="number" inputmode="numeric" min="0" max="10" placeholder="${rir ?? ""}" value="${s.rir ?? ""}" data-action="set-in" data-x="${xi}" data-s="${si}" data-f="rir"></td>
          <td><button class="check" data-action="set-done" data-x="${xi}" data-s="${si}" data-rest="${rest}">✓</button></td></tr>
          ${tempo && tempo !== "-" ? `<tr><td></td><td colspan="5" class="small muted" style="text-align:start">${t("tempo")}: ${esc(tempo)}</td></tr>` : ""}`;
      }).join("")}
      </tbody></table></div>`;
  }).join("") + `<button class="btn primary" style="width:100%" data-action="finish">${t("finish")}</button>`;
  return `${dateNav("trainDate", k)}
    <div class="chips">${chips}</div>
    ${w && !w.finished && workoutDone(w) ? `<p class="small muted">${t("editWorkout")}</p>` : ""}
    ${body}
    <h3 style="margin-top:20px">${t("history")}</h3>${historyList()}`;
}
const fmtSec = s => (s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : `${s}s`);
function historyList() {
  const keys = Object.keys(DB.workouts).filter(k => workoutDone(DB.workouts[k])).sort().reverse().slice(0, 15);
  if (!keys.length) return `<p class="muted small">${t("noHistory")}</p>`;
  return `<div class="card">${keys.map(k => {
    const w = DB.workouts[k], day = DAYS[w.day];
    let sets = 0, vol = 0;
    Object.values(w.sets).forEach(a => a.forEach(s => { if (s.done) { sets++; vol += (+s.w || 0) * (+s.r || 0); } }));
    return `<div class="list-row"><a href="#" data-action="open-workout" data-k="${k}">${fmtDate(k)} · ${esc(L(day))}</a>
      <span class="muted">${num(sets)} ${t("sets")} · ${num(r0(vol))} ${t("kg")}</span></div>`;
  }).join("")}</div>`;
}
const curWorkout = () => (DB.workouts[ui.trainDate] ||= { day: planDayFor(ui.trainDate), sets: {}, startedAt: Date.now() });

/* ---------- Nutrition ---------- */
function vNutrition() {
  const k = ui.foodDate, fd = foodDay(k), e = dayEaten(k), g = dayTargets(k);
  const meals = D.nutrition.meals.map((m, mi) => {
    if (m.trainingDaysOnly && !fd.training) return "";
    const mm = sumM(m.items.map(([id, a]) => foodMacros(id, a)));
    const allOn = m.items.every((_, ii) => fd.eaten[`${mi}-${ii}`]);
    return `<div class="card">
      <div class="row spread"><h3 style="margin:0">${esc(L(m))}</h3>
        <label class="small row" style="gap:4px"><input type="checkbox" data-action="meal-all" data-m="${mi}" ${allOn ? "checked" : ""}>${t("mealDone")}</label></div>
      <div class="small muted">${num(r0(mm.kcal))} ${t("kcal")} · <span class="kp">${t("protein")[0]} ${num(r0(mm.p))}g</span> · <span class="kc">${t("carbs")[0]} ${num(r0(mm.c))}g</span> · <span class="kf">${t("fat")[0]} ${num(r0(mm.f))}g</span></div>
      ${m.note ? `<div class="note">${esc(L(m.note))}</div>` : ""}
      <div style="margin-top:6px">
      ${m.items.map(([id, a, from], ii) => {
        const f = D.foods[id], x = foodMacros(id, a), orig = from && D.foods[from];
        return `<div class="food">
          <input type="checkbox" data-action="eat" data-key="${mi}-${ii}" ${fd.eaten[`${mi}-${ii}`] ? "checked" : ""}>
          <div class="nm">
            <div>${esc(L(f))} <span class="muted small">· ${num(a)} ${unitName(f.unit, a)}</span></div>
            <div class="alt">${esc(S.lang === "ar" ? f.en : f.ar)}</div>
            ${orig ? `<div class="alt">↺ ${t("swappedFrom")}: ${esc(L(orig))}</div>` : ""}
            <details><summary>${t("nutritionFacts")}</summary>${factBox(f)}</details>
          </div>
          <div class="facts"><b>${num(r0(x.kcal))}</b> ${t("kcal")}<br><span class="kp">${num(r0(x.p))}</span>/<span class="kc">${num(r0(x.c))}</span>/<span class="kf">${num(r0(x.f))}</span></div>
        </div>`;
      }).join("")}</div></div>`;
  }).join("");
  const extras = (fd.extras || []).map((x, i) => `<div class="list-row"><span>${esc(x.name)}</span><span class="muted">${num(+x.kcal || 0)} ${t("kcal")} <button class="chip" data-action="del-extra" data-i="${i}">✕</button></span></div>`).join("");
  return `${dateNav("foodDate", k)}
  <div class="card">${macroBlock(e, g)}
    <label class="row small" style="margin-top:10px"><input type="checkbox" data-action="training-day" ${fd.training ? "checked" : ""}> ${t("isTrainingDay")}</label></div>
  ${meals}
  <div class="card"><h3>${t("extraFood")}</h3>${extras}
    <div class="grid4" style="margin-top:8px">
      <input type="text" id="xName" placeholder="${t("name")}" style="grid-column:1/-1">
      <input type="number" id="xKcal" placeholder="${t("kcal")}"><input type="number" id="xP" placeholder="${t("protein")} g">
      <input type="number" id="xC" placeholder="${t("carbs")} g"><input type="number" id="xF" placeholder="${t("fat")} g">
    </div><button class="btn" style="margin-top:8px" data-action="add-extra">${t("add")}</button></div>
  <details class="card"><summary><b>${t("foodLibrary")}</b> · ${t("nutritionFacts")}</summary>
    ${Object.entries(D.foods).filter(([id], i, arr) => arr.findIndex(([, f]) => f.en === D.foods[id].en && f.kcal === D.foods[id].kcal) === i).map(([, f]) => `
      <div style="padding:8px 0;border-top:1px solid var(--line)"><b>${esc(f.en)}</b> · <span dir="rtl">${esc(f.ar)}</span>
      <div class="small muted">${esc(L(f.cat))}</div>${factBox(f)}</div>`).join("")}
  </details>`;
}
const unitName = (u, a) => (u === "large" ? (S.lang === "ar" ? "حبة كبيرة" : a === 1 ? "large" : "large") : (S.lang === "ar" ? "جم" : "g"));
const factBox = f => f.kcal == null ? `<div class="small muted">${t("noFacts")}</div>` :
  `<div class="small muted" style="margin-top:4px">${t("per")} ${num(f.servingSize)} ${unitName(f.unit, f.servingSize)}</div>
   <div class="factbox"><div><b>${num(f.kcal)}</b><br>${t("kcal")}</div><div class="kp"><b>${num(r1(f.p))}g</b><br>${t("protein")}</div>
   <div class="kc"><b>${num(r1(f.c))}g</b><br>${t("carbs")}</div><div class="kf"><b>${num(r1(f.f))}g</b><br>${t("fat")}</div></div>`;

/* ---------- Progress ---------- */
const MEAS = ["waist", "chest", "arm", "thigh", "hips", "neck"];
function vProgress() {
  const today = TODAY(), cur = DB.body.find(b => b.date === today) || {};
  const exIds = [...new Set(DAYS.flatMap(d => d.ex.map(e => e[0])))].filter(id => id !== "treadmill");
  ui.strengthEx ||= "smithIncline";
  const ranges = [[30, "days30"], [90, "days90"], [180, "months6"], [0, "all"]];
  return `<h2>${t("progress")}</h2>
  <div class="card"><h3>${t("bodyWeight")} & ${t("measurements")}</h3>
    <div class="grid2">
      <label class="field"><span>${t("date")}</span><input type="date" id="bDate" value="${today}" max="${today}"></label>
      <label class="field"><span>${t("weight")} (${t("kg")})</span><input type="number" step="0.1" id="b_weight" value="${cur.weight ?? ""}"></label>
    </div>
    <div class="grid4">${MEAS.map(m => `<label class="field"><span>${t(m)}</span><input type="number" step="0.1" id="b_${m}" value="${cur[m] ?? ""}"></label>`).join("")}</div>
    <button class="btn primary" data-action="save-body">${t("save")}</button></div>
  <div class="chips">${ranges.map(([d, l]) => `<button class="chip ${ui.range === d ? "on" : ""}" data-action="range" data-d="${d}">${t(l)}</button>`).join("")}</div>
  <div class="card"><h3>${t("weight")} (${t("kg")})</h3><svg class="chart" id="chWeight"></svg></div>
  <div class="card"><h3>${t("waist")} (cm)</h3><svg class="chart" id="chWaist"></svg></div>
  <div class="card"><div class="row spread"><h3>${t("strength")}</h3></div>
    <select data-action="strength-ex">${exIds.map(id => `<option value="${id}" ${id === ui.strengthEx ? "selected" : ""}>${esc(L(exInfo(id)))}</option>`).join("")}</select>
    <p class="small muted" style="margin:6px 0 0">${t("est1rm")} (${t("kg")})</p><svg class="chart" id="chStrength"></svg></div>
  <div class="card"><div class="row spread"><h3>${t("photos")}</h3>
    <label class="btn">${t("addPhoto")}<input type="file" accept="image/*" data-action="photo" hidden></label></div>
    <div class="photos">${DB.photos.slice().reverse().map((p, i) => `<figure><img src="${p.src}" alt=""><figcaption>${fmtDate(p.date)} <a href="#" data-action="del-photo" data-i="${DB.photos.length - 1 - i}">✕</a></figcaption></figure>`).join("")}</div></div>
  <div class="card"><h3>${t("entries")}</h3>${DB.body.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30).map(b =>
    `<div class="list-row"><span>${fmtDate(b.date)}</span><span class="muted">${b.weight ? num(b.weight) + " " + t("kg") : ""} ${MEAS.filter(m => b[m]).map(m => `${t(m)} ${num(b[m])}`).join(" · ")}
      <a href="#" data-action="del-body" data-date="${b.date}">✕</a></span></div>`).join("") || `<p class="muted small">—</p>`}</div>`;
}
function series(fn) {
  const from = ui.range ? addDays(TODAY(), -ui.range) : "0000";
  return fn().filter(p => p[0] >= from && p[1] > 0).sort((a, b) => a[0].localeCompare(b[0]));
}
function lineChart(id, pts, color = "var(--accent)") {
  const el = document.getElementById(id); if (!el) return;
  const W = el.clientWidth || 600, H = 180, P = { l: 34, r: 10, t: 10, b: 22 };
  el.setAttribute("viewBox", `0 0 ${W} ${H}`);
  if (pts.length < 2) { el.innerHTML = `<text x="${W / 2}" y="${H / 2}" text-anchor="middle">${t("notEnough")}</text>`; return; }
  const xs = pts.map(p => new Date(p[0]).getTime()), ys = pts.map(p => p[1]);
  let y0 = Math.min(...ys), y1 = Math.max(...ys); const pad = (y1 - y0) * 0.15 || 1; y0 -= pad; y1 += pad;
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const X = x => P.l + ((x - x0) / (x1 - x0 || 1)) * (W - P.l - P.r);
  const Y = y => H - P.b - ((y - y0) / (y1 - y0)) * (H - P.t - P.b);
  const grid = [0, 0.5, 1].map(f => { const v = y0 + (y1 - y0) * f; return `<line x1="${P.l}" x2="${W - P.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${P.l - 4}" y="${Y(v) + 3}" text-anchor="end">${r1(v)}</text>`; }).join("");
  const d = pts.map((p, i) => `${i ? "L" : "M"}${X(xs[i]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join("");
  el.innerHTML = `${grid}<path d="${d}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>
    ${pts.map((p, i) => `<circle cx="${X(xs[i])}" cy="${Y(p[1])}" r="3" fill="${color}"><title>${p[0]}: ${p[1]}</title></circle>`).join("")}
    <text x="${P.l}" y="${H - 6}">${fmtDate(pts[0][0])}</text><text x="${W - P.r}" y="${H - 6}" text-anchor="end">${fmtDate(pts.at(-1)[0])}</text>`;
  if (S.lang === "ar") el.style.direction = "ltr";
}
function drawCharts() {
  lineChart("chWeight", series(() => DB.body.map(b => [b.date, +b.weight])));
  lineChart("chWaist", series(() => DB.body.map(b => [b.date, +b.waist])), "var(--f)");
  lineChart("chStrength", series(() => Object.entries(DB.workouts).map(([k, w]) => {
    const day = DAYS[w.day]; let best = 0;
    day && day.ex.forEach(([id], xi) => { if (id === ui.strengthEx) (w.sets[xi] || []).forEach(s => { if (s.done) best = Math.max(best, e1rm(+s.w, +s.r)); }); });
    return [k, r1(best)];
  })), "var(--good)");
}

/* ---------- Habits & check-ins ---------- */
function vHabits() {
  const k = ui.habitDate, h = DB.habits[k] || {};
  const counter = (f, step, unit) => `<div class="row spread" style="padding:8px 0"><span>${t(f)} <span class="muted small">(${t(unit)})</span></span>
    <div class="counter"><button data-action="hab-step" data-f="${f}" data-d="${-step}">−</button><b>${num(h[f] || 0)}</b><button data-action="hab-step" data-f="${f}" data-d="${step}">+</button></div></div>`;
  const toggles = [["mag", "magnesium"], ["cardio", "cardio"], ["diet", "followedDiet"], ["stretch", "stretch"]];
  const draft = ui.checkin ||= { energy: 0, hunger: 0, sleepQ: 0, stress: 0, adherence: 0, perf: 0, notes: "" };
  const scale = f => `<div class="scale">${[1, 2, 3, 4, 5].map(n => `<button class="${draft[f] === n ? "on" : ""}" data-action="ci-scale" data-f="${f}" data-n="${n}">${num(n)}</button>`).join("")}</div>`;
  return `${dateNav("habitDate", k)}
  <div class="card"><h3>${t("dailyHabits")}</h3>
    ${counter("water", 1, "glasses")}
    <div class="row spread" style="padding:8px 0"><span>${t("steps")}</span><input type="number" style="max-width:140px" data-action="hab-in" data-f="steps" value="${h.steps ?? ""}" placeholder="8000"></div>
    <div class="row spread" style="padding:8px 0"><span>${t("sleep")} <span class="muted small">(${t("hours")})</span></span><input type="number" step="0.5" style="max-width:140px" data-action="hab-in" data-f="sleep" value="${h.sleep ?? ""}" placeholder="7.5"></div>
    ${toggles.map(([f, l]) => `<label class="toggle"><span>${t(l)}</span><input type="checkbox" data-action="hab-toggle" data-f="${f}" ${h[f] ? "checked" : ""}></label>`).join("")}
  </div>
  <div class="card"><h3>${t("checkin")}</h3>
    ${[["energy", "energy"], ["hunger", "hunger"], ["sleepQ", "sleepQuality"], ["stress", "stress"], ["adherence", "adherence"], ["perf", "trainingPerf"]].map(([f, l]) =>
      `<label class="field"><span>${t(l)} (1–5)</span>${scale(f)}</label>`).join("")}
    <label class="field"><span>${t("notesForCoach")}</span><textarea data-action="ci-notes">${esc(draft.notes)}</textarea></label>
    <button class="btn primary" data-action="ci-save">${t("submitCheckin")}</button>
  </div>
  <div class="card"><h3>${t("pastCheckins")}</h3>${DB.checkins.slice().reverse().map((c, i) => `
    <div class="list-row" style="display:block"><div class="row spread"><b>${fmtDate(c.date)}</b>
      <span><button class="chip" data-action="ci-copy" data-i="${DB.checkins.length - 1 - i}">${t("copySummary")}</button>
      <button class="chip" data-action="ci-del" data-i="${DB.checkins.length - 1 - i}">✕</button></span></div>
      <div class="small muted">${t("energy")} ${c.energy} · ${t("hunger")} ${c.hunger} · ${t("sleepQuality")} ${c.sleepQ} · ${t("stress")} ${c.stress} · ${t("adherence")} ${c.adherence} · ${t("trainingPerf")} ${c.perf}</div>
      ${c.notes ? `<div class="small">${esc(c.notes)}</div>` : ""}</div>`).join("") || `<p class="muted small">—</p>`}</div>`;
}
function checkinSummary(c) {
  const end = c.date, start = addDays(end, -6);
  const inRange = k => k >= start && k <= end;
  const ws = DB.body.filter(b => b.weight && inRange(b.date)).sort((a, b) => a.date.localeCompare(b.date));
  const nWork = Object.keys(DB.workouts).filter(k => inRange(k) && workoutDone(DB.workouts[k])).length;
  const days = [...Array(7)].map((_, i) => addDays(start, i));
  const avg = a => (a.length ? r1(a.reduce((x, y) => x + y, 0) / a.length) : "—");
  const kcals = days.filter(k => DB.food[k]).map(k => dayEaten(k).kcal).filter(x => x > 0);
  const sleeps = days.map(k => +(DB.habits[k] || {}).sleep).filter(x => x > 0);
  const steps = days.map(k => +(DB.habits[k] || {}).steps).filter(x => x > 0);
  return [
    `${t("checkin")} — ${fmtDate(start)} → ${fmtDate(end)}`,
    `${t("weight")}: ${ws.length ? `${ws[0].weight} → ${ws.at(-1).weight} ${t("kg")}` : "—"}`,
    `${t("training")}: ${nWork}`,
    `${t("calories")} (avg): ${avg(kcals) === "—" ? "—" : r0(avg(kcals))} / ${r0(D.nutrition.targets.kcal)}`,
    `${t("sleep")} (avg): ${avg(sleeps)} · ${t("steps")} (avg): ${avg(steps) === "—" ? "—" : r0(avg(steps))}`,
    `${t("energy")} ${c.energy}/5 · ${t("hunger")} ${c.hunger}/5 · ${t("sleepQuality")} ${c.sleepQ}/5 · ${t("stress")} ${c.stress}/5 · ${t("adherence")} ${c.adherence}/5 · ${t("trainingPerf")} ${c.perf}/5`,
    c.notes ? `${c.notes}` : ""
  ].filter(Boolean).join("\n");
}

/* ---------- Settings ---------- */
function vSettings() {
  return `<h2>${t("settings")}</h2>
  <div class="card"><h3>${t("language")}</h3><div class="row">
    <button class="chip ${S.lang === "en" ? "on" : ""}" data-action="set-lang" data-l="en">English</button>
    <button class="chip ${S.lang === "ar" ? "on" : ""}" data-action="set-lang" data-l="ar">العربية</button></div></div>
  <div class="card"><h3>${t("rotationStart")}</h3>
    <select data-action="rotation">${DAYS.map((d, i) => `<option value="${i}" ${planDayFor(TODAY()) === i ? "selected" : ""}>${i + 1}. ${esc(L(d))}</option>`).join("")}</select></div>
  <div class="card"><h3>${t("backup")}</h3><p class="small muted">${t("backupHint")}</p>
    <div class="row"><button class="btn primary" data-action="export">${t("exportData")}</button>
    <label class="btn">${t("importData")}<input type="file" accept="application/json,.json" data-action="import" hidden></label></div></div>
  <div class="card"><h3>${t("planInfo")}</h3><p class="small muted">${t("planExported")} ${D.exportedAt}</p>
    <p class="small">🏋️ ${esc(D.training.name)}<br>🥗 ${esc(L(D.nutrition.name))} · ${num(D.nutrition.targets.kcal)} ${t("kcal")} · P ${D.nutrition.targets.p}g · C ${D.nutrition.targets.c}g · F ${D.nutrition.targets.f}g</p></div>
  <div class="card"><button class="btn danger" data-action="reset">${t("resetAll")}</button></div>`;
}

/* ---------- rest timer ---------- */
const timer = { end: 0, h: 0 };
function startTimer(sec) {
  if (!sec) return;
  timer.end = Date.now() + sec * 1000;
  document.getElementById("timer").classList.remove("hidden", "over");
  clearInterval(timer.h); timer.h = setInterval(tick, 250); tick();
}
function tick() {
  const left = Math.ceil((timer.end - Date.now()) / 1000);
  const el = document.getElementById("timer");
  document.getElementById("timerLabel").textContent = left > 0 ? t("restTimer") : t("restDone");
  document.getElementById("timerTime").textContent = fmtSec(Math.max(0, left)).replace(/s$/, "") ;
  if (left <= 0 && !el.classList.contains("over")) {
    el.classList.add("over");
    try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch {}
    beep();
  }
  if (left < -20) stopTimer();
}
function stopTimer() { clearInterval(timer.h); document.getElementById("timer").classList.add("hidden"); }
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination); o.frequency.value = 880; g.gain.value = 0.15;
    o.start(); o.stop(ctx.currentTime + 0.35);
  } catch {}
}

/* ---------- events ---------- */
document.addEventListener("click", ev => {
  const el = ev.target.closest("[data-action]"); if (!el) return;
  const a = el.dataset.action;
  if (["set-in", "hab-in", "ci-notes", "strength-ex", "rotation", "photo", "import", "eat", "meal-all", "training-day", "hab-toggle"].includes(a)) return;
  if (el.tagName === "A") ev.preventDefault();
  const act = actions[a]; if (act) act(el);
});
document.addEventListener("change", ev => {
  const el = ev.target.closest("[data-action]"); if (!el) return;
  const act = actions[el.dataset.action]; if (act) act(el, ev);
});
document.addEventListener("input", ev => {
  const el = ev.target;
  if (el.dataset.action === "ci-notes") ui.checkin.notes = el.value;
});

const actions = {
  "go": el => { tab = el.dataset.tab; if (tab === "training") ui.trainDate = ui.trainDate || TODAY(); render(); scrollTo(0, 0); },
  "toggle-lang": () => { S.lang = DB.lang = S.lang === "ar" ? "en" : "ar"; save(); render(); },
  "set-lang": el => { S.lang = DB.lang = el.dataset.l; save(); render(); },
  "date": el => { const w = el.dataset.which; const n = addDays(ui[w], +el.dataset.d); if (n <= TODAY()) { ui[w] = n; render(); } },

  "pick-day": el => {
    const w = DB.workouts[ui.trainDate];
    if (w) { if (workoutDone(w) && w.day !== +el.dataset.i) { w.day = +el.dataset.i; w.sets = {}; } else w.day = +el.dataset.i; }
    else DB.workouts[ui.trainDate] = { day: +el.dataset.i, sets: {} };
    if (ui.trainDate === TODAY()) { DB.rotation = { anchorDate: TODAY(), anchorDay: +el.dataset.i }; }
    save(); render();
  },
  "set-in": el => {
    const w = curWorkout(), x = el.dataset.x, s = +el.dataset.s;
    const arr = (w.sets[x] ||= []); arr[s] = arr[s] || {};
    arr[s][el.dataset.f] = el.value === "" ? null : +el.value;
    save();
  },
  "set-done": el => {
    const w = curWorkout(), x = el.dataset.x, s = +el.dataset.s;
    const arr = (w.sets[x] ||= []); const set = (arr[s] ||= {});
    const row = el.closest("tr");
    // fill blanks from placeholders (last time / plan) so one tap logs a repeat
    row.querySelectorAll("input").forEach(inp => { if (inp.value === "" && inp.placeholder && /^[\d.]+$/.test(inp.placeholder)) { set[inp.dataset.f] = +inp.placeholder; } });
    set.done = !set.done;
    save(); render();
    if (set.done) startTimer(+el.dataset.rest);
  },
  "finish": () => { const w = curWorkout(); w.finished = true; w.finishedAt = Date.now(); save(); stopTimer(); toast(t("workoutSaved")); render(); },
  "open-workout": el => { ui.trainDate = el.dataset.k; render(); scrollTo(0, 0); },
  "timer-add": () => { timer.end += 30000; document.getElementById("timer").classList.remove("over"); },
  "timer-stop": stopTimer,

  "eat": el => { const fd = foodDay(ui.foodDate); if (el.checked) fd.eaten[el.dataset.key] = true; else delete fd.eaten[el.dataset.key]; save(); render(); },
  "meal-all": el => { const fd = foodDay(ui.foodDate), mi = el.dataset.m; D.nutrition.meals[mi].items.forEach((_, ii) => { if (el.checked) fd.eaten[`${mi}-${ii}`] = true; else delete fd.eaten[`${mi}-${ii}`]; }); save(); render(); },
  "training-day": el => { foodDay(ui.foodDate).training = el.checked; save(); render(); },
  "add-extra": () => {
    const v = id => document.getElementById(id).value;
    if (!v("xName") && !v("xKcal")) return;
    foodDay(ui.foodDate).extras.push({ name: v("xName") || t("extraFood"), kcal: +v("xKcal") || 0, p: +v("xP") || 0, c: +v("xC") || 0, f: +v("xF") || 0 });
    save(); render();
  },
  "del-extra": el => { foodDay(ui.foodDate).extras.splice(+el.dataset.i, 1); save(); render(); },

  "save-body": () => {
    const date = document.getElementById("bDate").value || TODAY();
    const rec = { date };
    ["weight", ...MEAS].forEach(m => { const v = document.getElementById("b_" + m).value; if (v !== "") rec[m] = +v; });
    if (Object.keys(rec).length === 1) return;
    const i = DB.body.findIndex(b => b.date === date);
    if (i >= 0) DB.body[i] = Object.assign(DB.body[i], rec); else DB.body.push(rec);
    save(); toast(t("saved")); render();
  },
  "del-body": el => { if (confirm(t("confirmDelete"))) { DB.body = DB.body.filter(b => b.date !== el.dataset.date); save(); render(); } },
  "range": el => { ui.range = +el.dataset.d; render(); },
  "strength-ex": el => { ui.strengthEx = el.value; drawCharts(); },
  "photo": (el) => {
    const file = el.files && el.files[0]; if (!file) return;
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, 480 / Math.max(img.width, img.height));
      const c = document.createElement("canvas"); c.width = img.width * s; c.height = img.height * s;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      DB.photos.push({ date: TODAY(), src: c.toDataURL("image/jpeg", 0.7) });
      URL.revokeObjectURL(url); save(); render();
    };
    img.src = url;
  },
  "del-photo": el => { if (confirm(t("confirmDelete"))) { DB.photos.splice(+el.dataset.i, 1); save(); render(); } },

  "hab-step": el => { const h = (DB.habits[ui.habitDate] ||= {}); h[el.dataset.f] = Math.max(0, (h[el.dataset.f] || 0) + +el.dataset.d); save(); render(); },
  "hab-in": el => { const h = (DB.habits[ui.habitDate] ||= {}); h[el.dataset.f] = el.value === "" ? null : +el.value; save(); },
  "hab-toggle": el => { const h = (DB.habits[ui.habitDate] ||= {}); h[el.dataset.f] = el.checked; save(); },
  "ci-scale": el => { ui.checkin[el.dataset.f] = +el.dataset.n; render(); },
  "ci-save": () => { DB.checkins.push(Object.assign({ date: TODAY() }, ui.checkin)); ui.checkin = null; save(); toast(t("saved")); render(); },
  "ci-del": el => { if (confirm(t("confirmDelete"))) { DB.checkins.splice(+el.dataset.i, 1); save(); render(); } },
  "ci-copy": async el => {
    const txt = checkinSummary(DB.checkins[+el.dataset.i]);
    try { await navigator.clipboard.writeText(txt); toast(t("copied")); } catch { prompt("", txt); }
  },

  "rotation": el => { DB.rotation = { anchorDate: TODAY(), anchorDay: +el.value }; save(); toast(t("saved")); },
  "export": () => {
    const blob = new Blob([JSON.stringify(DB, null, 1)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `fitlife-backup-${TODAY()}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },
  "import": el => {
    const file = el.files && el.files[0]; if (!file) return;
    file.text().then(txt => {
      const d = JSON.parse(txt);
      if (!d || d.v !== 1 || typeof d.workouts !== "object") throw 0;
      DB = Object.assign(blank(), d); S.lang = DB.lang || S.lang; save(); toast(t("imported")); render();
    }).catch(() => toast(t("badFile")));
  },
  "reset": () => { if (confirm(t("confirmReset"))) { const lang = S.lang; DB = blank(); DB.lang = lang; save(); render(); } }
};

load();
render();
window.addEventListener("resize", () => { if (tab === "progress") drawCharts(); });
})();
