// Coach plan data, exported from belghamdi.fitforce.app on 2026-11-13.
// Bilingual (en / ar). Names marked "coach" are the coach's originals; other
// translations were added for this tracker.
// Loaded as a plain script so the app works from file:// with no server.

window.PLAN_DATA = {
  exportedAt: "2026-11-13",

  muscles: {
    Core:        { en: "Core",       ar: "الجذع" },
    Abs:         { en: "Abs",        ar: "البطن" },
    Chest:       { en: "Chest",      ar: "الصدر" },
    Back:        { en: "Back",       ar: "الظهر" },
    Shoulders:   { en: "Shoulders",  ar: "الأكتاف" },
    Triceps:     { en: "Triceps",    ar: "الترايسبس" },
    Arms:        { en: "Arms",       ar: "الذراعين" },
    Forearms:    { en: "Forearms",   ar: "الساعد" },
    Legs:        { en: "Legs",       ar: "الأرجل" },
    Glutes:      { en: "Glutes",     ar: "الأرداف" },
    Calves:      { en: "Calves",     ar: "السمانة" },
    "Full Body": { en: "Full Body",  ar: "الجسم كامل" }
  },

  // Exercise library: id -> names, muscle, video link
  exercises: {
    cableCrunch:     { en: "Lengthened Cable Crunches",      ar: "كرنش الكابل بمدى ممتد",            muscle: "Core",      video: "https://www.youtube.com/shorts/hC35L2es1bs" },
    smithIncline:    { en: "Low Incline Smith Chest Press",  ar: "ضغط صدر سميث بميل منخفض",          muscle: "Chest",     video: "https://www.youtube.com/shorts/pXnB5KhUxsQ" },
    butterfly:       { en: "Butterfly Machine",              ar: "جهاز الفراشة",                      muscle: "Chest",     video: "https://youtu.be/KRsCUdcX0Fs" },
    tBarRow:         { en: "T-Bar Row",                      ar: "تجديف تي بار",                      muscle: "Back",      video: "https://www.youtube.com/watch?v=ZC_e4XNBtoI" },
    reverseFly:      { en: "Reverse Butterfly",              ar: "فراشة عكسي",                        muscle: "Shoulders", video: "https://www.youtube.com/watch?v=p7PBTzvja4w" },
    smithOhShrug:    { en: "Overhead Shrugs (Smith Machine)",ar: "ترابيس فوق الرأس على السميث",       muscle: "Back",      video: "https://www.youtube.com/shorts/9CJyxZ6UFuU" },
    ropePushdown:    { en: "Double Rope Pushdown",           ar: "بوش داون بحبلين",                   muscle: "Triceps",   video: "https://www.youtube.com/watch?v=qMen5GVP5fo" },
    noCheatCurl:     { en: "Assisted No-Cheat Curl",         ar: "بايسبس بدون غش (مدعوم)",            muscle: "Arms",      video: "https://www.tiktok.com/@belghamdi.coaching/video/7358142284233264389" },
    reverseCurl:     { en: "Cable Reverse Curls",            ar: "بايسبس عكسي بالكابل",               muscle: "Forearms",  video: "https://www.youtube.com/watch?v=DhRUGDH2NRw" },
    scapPush:        { en: "Scapular SA Cable Push",         ar: "دفع الكتف بالكابل بذراع واحدة",     muscle: "Core",      video: "https://www.youtube.com/shorts/j_vNs3gw9UU" },
    widePulldown:    { en: "Wide Grip Lat Pulldown",         ar: "سحب أمامي بقبضة واسعة",             muscle: "Back",      video: "https://www.youtube.com/watch?v=EZyiohrj6AQ" },
    treadmill:       { en: "Treadmill Cardio",               ar: "مشاية",                             muscle: "Full Body", video: null, coachAr: true },
    plank:           { en: "Plank (Phase 1)",                ar: "بلانك (المرحلة ١)",                 muscle: "Core",      video: "https://www.instagram.com/reel/C4-8Ye8I7tk/" },
    dbLateral:       { en: "DB Lateral Raises",              ar: "رفرفة جانبي بالدمبل",               muscle: "Shoulders", video: "https://www.youtube.com/watch?v=AMK2ju7Q68c" },
    hipFlexion:      { en: "Cable Hip Flexion",              ar: "ثني الورك بالكابل",                 muscle: "Legs",      video: "https://www.youtube.com/shorts/ONCg73p8WgE" },
    calfRaise:       { en: "Calf Raises",                    ar: "رفع السمانة",                       muscle: "Calves",    video: "https://www.youtube.com/watch?v=wfFMMCjSDDg" },
    legPress:        { en: "Leg Press",                      ar: "مكبس الأرجل",                       muscle: "Legs",      video: "https://www.youtube.com/watch?v=G5SNv5uM84Q" },
    hipThrust:       { en: "Hip Thrust",                     ar: "دفع الورك",                         muscle: "Glutes",    video: "https://www.youtube.com/watch?v=WQGSajC_-tY" },
    legCurl:         { en: "Leg Curl",                       ar: "رجل خلفي",                          muscle: "Legs",      video: "https://www.youtube.com/watch?v=j1nMlG_e79c" },
    legExt:          { en: "Leg Extension",                  ar: "رجل أمامي",                         muscle: "Legs",      video: "https://www.youtube.com/watch?v=feQt2tJe_ks" },
    adductors:       { en: "Adductors",                      ar: "جهاز الضامة (الفخذ الداخلي)",       muscle: "Legs",      video: "https://www.youtube.com/watch?v=qfiyJLkQC3s" },
    pulldownCrunch:  { en: "Lat Pulldown Crunches",          ar: "كرنش على جهاز السحب",               muscle: "Abs",       video: "https://www.youtube.com/watch?v=PoJb1yOd6Y4" },
    pallof:          { en: "Pallof Rotation",                ar: "دوران بالوف",                       muscle: "Abs",       video: "https://www.youtube.com/watch?v=nbbkibIUTSc" },
    wristExt:        { en: "Wrist Extension",                ar: "مد الرسغ",                          muscle: "Arms",      video: "https://www.youtube.com/shorts/xENVg7RX_O8" },
    plateRow:        { en: "Plate Loaded Row Machine",       ar: "جهاز تجديف بالأوزان",               muscle: "Back",      video: "https://www.youtube.com/shorts/Dic11ZQvYNQ" },
    cableLateral:    { en: "Cable Lateral Raises",           ar: "رفرفة جانبي بالكابل",               muscle: "Shoulders", video: "https://www.youtube.com/watch?v=WF9oZyEHnU4" },
    saOhExt:         { en: "SA Overhead Triceps Extension",  ar: "تمرين ترايسبس اوفرهيد",            muscle: "Arms",      video: "https://www.youtube.com/watch?v=0sNnjugunwo", coachAr: true },
    saPulldown:      { en: "SA Lat Pulldown (Neutral Grip)", ar: "سحب أمامي بذراع واحدة (قبضة محايدة)",muscle: "Back",     video: "https://www.youtube.com/watch?v=fy2vAukc0YQ" },
    shoulderPress:   { en: "Shoulder Press Machine",         ar: "جهاز ضغط الأكتاف",                  muscle: "Shoulders", video: "https://www.youtube.com/watch?v=EXci6B3lhg0" },
    cableShrug:      { en: "Cable Shrugs",                   ar: "ترابيس بالكابل",                    muscle: "Back",      video: "https://www.youtube.com/shorts/S9OXkqZB_uc" },
    wideSeatedRow:   { en: "Wide Grip Seated Row",           ar: "تجديف جالس بقبضة واسعة",            muscle: "Back",      video: "https://www.youtube.com/watch?v=iXGHN-MWFfY" },
    saPullover:      { en: "SA Pullover",                    ar: "بول أوفر بذراع واحدة",              muscle: "Back",      video: "https://www.youtube.com/shorts/K77FHm3-8xU" },
    wristCurl:       { en: "Wrist Curls",                    ar: "ثني الرسغ",                         muscle: "Forearms",  video: "https://www.youtube.com/watch?v=2jGS_GuSA90" }
  },

  notes: {
    cardio40: { en: "40 mins, moderate intensity", ar: "٤٠ دقيقة بشدة متوسطة" },
    cardio20: { en: "20 mins, moderate intensity", ar: "٢٠ دقيقة بشدة متوسطة" },
    saOhExt:  { en: "💡 Rest between arms, and start with the weaker one", ar: "💡 الراحة بين كل دراع و ابدء ب الاضعف" }
  },

  // Training plan. Each set: [reps, restSeconds, tempo, RIR]
  training: {
    name: "ULRURFR \"shoulders, chest, abs\"",
    days: [
      { en: "Upper", ar: "علوي", ex: [
        ["cableCrunch",   [["8-12",60,null,2],["8-12",60,null,2],["8-12",60,null,2]]],
        ["smithIncline",  [["4-10",180,null,1],["4-10",180,null,1]]],
        ["butterfly",     [["5-12",120,null,1],["5-12",120,null,0]]],
        ["tBarRow",       [["5-12",180,null,1],["5-12",180,null,0]]],
        ["reverseFly",    [["5-12",150,null,0]]],
        ["smithOhShrug",  [["5-12",120,null,0],["5-12",120,null,0]]],
        ["ropePushdown",  [["8-12",150,null,0]]],
        ["noCheatCurl",   [["5-12",150,null,1],["5-12",150,null,1]]],
        ["reverseCurl",   [["5-12",120,null,0],["5-12",120,null,0]]],
        ["scapPush",      [["5-12",120,null,0],["5-12",120,null,0]]],
        ["widePulldown",  [["6-10",120,null,0],["6-10",120,null,0]]],
        ["treadmill",     [["40 min",0,null,null]], "cardio40"],
        ["plank",         [["5-12",120,null,0],["5-12",120,null,0]]]
      ]},
      { en: "Lower", ar: "سفلي", ex: [
        ["dbLateral",     [["5-12",120,null,0],["5-12",120,null,0],["5-12",120,null,0]]],
        ["hipFlexion",    [["5-12",120,null,0],["5-12",120,null,0]]],
        ["calfRaise",     [["4-10",150,null,1],["4-10",150,null,0]]],
        ["legPress",      [["5-12",240,null,1],["5-12",240,"0-0-0-0",0]]],
        ["hipThrust",     [["6-12",180,null,1],["6-12",180,"0-0-0-0",1]]],
        ["legCurl",       [["5-12",150,null,0]]],
        ["legExt",        [["8-12",150,null,1],["8-12",150,null,0]]],
        ["adductors",     [["6-10",150,null,1],["6-10",150,null,0]]],
        ["pulldownCrunch",[["5-12",120,null,0],["5-12",120,null,0],["5-12",120,null,0]]],
        ["pallof",        [["5-12",120,null,0],["5-12",120,null,0]]],
        ["wristExt",      [["5-12",120,null,0],["5-12",120,null,0]]],
        ["treadmill",     [["20 min",0,null,null]], "cardio20"]
      ]},
      { en: "Rest", ar: "راحة", ex: [] },
      { en: "Upper", ar: "علوي", ex: [
        ["hipFlexion",    [["5-12",120,null,0],["5-12",120,null,0]]],
        ["smithIncline",  [["5-12",180,null,1],["5-12",180,null,0]]],
        ["plateRow",      [["5-12",180,null,0],["5-12",180,null,0]]],
        ["cableLateral",  [["5-12",150,null,0],["5-12",150,null,0]]],
        ["butterfly",     [["5-12",120,null,0],["5-12",120,null,0]]],
        ["pulldownCrunch",[["5-12",120,null,0],["5-12",120,null,0]]],
        ["saOhExt",       [["8-12",60,null,1],["8-12",60,null,1]], "saOhExt"],
        ["saPulldown",    [["4-10",180,null,0],["4-10",180,null,0]]],
        ["shoulderPress", [["5-12",180,null,0]]],
        ["cableShrug",    [["5-12",150,null,0],["5-12",150,null,0]]],
        ["noCheatCurl",   [["8-12",150,null,1],["8-12",150,null,1]]],
        ["reverseFly",    [["5-12",120,null,0]]],
        ["treadmill",     [["40 min",0,null,null]], "cardio40"]
      ]},
      { en: "Rest", ar: "راحة", ex: [] },
      { en: "Full Body", ar: "جسم كامل", ex: [
        ["hipFlexion",    [["5-12",120,null,0],["5-12",120,null,0]]],
        ["smithIncline",  [["5-12",120,null,0],["5-12",120,null,0]]],
        ["calfRaise",     [["8-12",150,null,0],["8-12",150,null,0]]],
        ["butterfly",     [["5-12",180,null,0]]],
        ["dbLateral",     [["5-12",120,null,0],["5-12",120,null,0]]],
        ["wideSeatedRow", [["5-12",180,null,0],["5-12",180,null,0]]],
        ["saPullover",    [["5-12",150,null,0],["5-12",150,null,0]]],
        ["saOhExt",       [["5-12",60,null,1],["5-12",60,null,0]], "saOhExt"],
        ["cableShrug",    [["5-12",150,null,0],["5-12",150,null,0]]],
        ["wristCurl",     [["5-12",120,null,0],["5-12",120,null,0]]],
        ["legExt",        [["8-12",150,null,0],["8-12",150,null,0]]],
        ["legCurl",       [["6-10",150,null,0],["6-10",150,null,0]]]
      ]},
      { en: "Rest", ar: "راحة", ex: [] }
    ]
  },

  // Food library: nutrition facts per serving (servingSize in `unit`).
  // kcal, protein (p), carbs (c), fat (f) in grams.
  foods: {
    brownToast:   { en: "Brown Toast Bread",                       ar: "خبز محمص بني",                         unit: "g",     servingSize: 30,  kcal: 80,  p: 3.3,   c: 14.7,  f: 0.9,   cat: { en: "Baked Products", ar: "مخبوزات" } },
    egg:          { en: "Egg",                                     ar: "بيضة",                                 unit: "large", servingSize: 1,   kcal: 78,  p: 6.29,  c: 0.56,  f: 5.31,  cat: { en: "Dairy & Eggs", ar: "ألبان وبيض" } },
    chocSpread:   { en: "Healthy Chocolate Spread",                ar: "شوكولاتة دايت للدهن",                  unit: "g",     servingSize: 15,  kcal: 60,  p: 1,     c: 7,     f: 3.6,   cat: { en: "Other", ar: "أخرى" } },
    mozzarella:   { en: "Mozzarella, Whole Milk",                  ar: "جبن موتزاريلا كامل الدسم",             unit: "g",     servingSize: 100, kcal: null, p: null, c: null,  f: null,  cat: { en: "Dairy & Eggs", ar: "ألبان وبيض" } },
    salad:        { en: "Salad",                                   ar: "سلطة",                                 unit: "g",     servingSize: 100, kcal: 14,  p: 0.7,   c: 2.1,   f: 0.1,   cat: { en: "Vegetables", ar: "خضروات" } },
    oliveOil:     { en: "Olive Oil",                               ar: "زيت الزيتون",                          unit: "g",     servingSize: 100, kcal: 884, p: 0,     c: 0,     f: 100,   cat: { en: "Fats & Oils", ar: "دهون وزيوت" } },
    chicken:      { en: "Chicken Breast, Boneless, Skinless, Raw", ar: "صدور دجاج، منزوعة العظم والجلد، نيئة", unit: "g",     servingSize: 100, kcal: 120, p: 22.5,  c: 0,     f: 2.62,  cat: { en: "Poultry", ar: "دواجن" } },
    bakedPotato:  { en: "Potatoes, Baked",                         ar: "بطاطس مشوية",                          unit: "g",     servingSize: 100, kcal: 93,  p: 2.5,   c: 18.9,  f: 0.1,   cat: { en: "Carbs", ar: "كربوهيدرات" } },
    jam:          { en: "Vitrac Strawberry Jam",                   ar: "مربى فراولة فيتراك",                   unit: "g",     servingSize: 100, kcal: 240, p: 0,     c: 60,    f: 0,     cat: { en: "Carbs", ar: "كربوهيدرات" } },
    wwFlour:      { en: "White Whole Wheat Flour",                 ar: "دقيق القمح الكامل الأبيض",             unit: "g",     servingSize: 100, kcal: 346, p: 15.1,  c: 71.2,  f: 2.73,  cat: { en: "Grains & Pasta", ar: "حبوب ومعكرونة" } },
    oliveOil2:    { en: "Olive Oil",                               ar: "زيت الزيتون",                          unit: "g",     servingSize: 100, kcal: 900, p: 0,     c: 0,     f: 100,   cat: { en: "Fats & Oils", ar: "دهون وزيوت" } },
    skimMilk:     { en: "Milk, Skim, Fat Free",                    ar: "حليب خالي الدسم",                      unit: "g",     servingSize: 100, kcal: 34,  p: 3.43,  c: 4.92,  f: 0.08,  cat: { en: "Dairy & Eggs", ar: "ألبان وبيض" } },
    dates:        { en: "Dates, Fresh",                            ar: "تمر طازج",                             unit: "g",     servingSize: 100, kcal: 124, p: 1.5,   c: 33.1,  f: 0.1,   cat: { en: "Fruits", ar: "فواكه" } },
    strawberries: { en: "Strawberries, Raw",                       ar: "الفراولة نيئ",                          unit: "g",     servingSize: 100, kcal: null, p: null, c: null,  f: null,  cat: { en: "Fruits", ar: "فواكه" } },
    oats:         { en: "Whole Oats",                              ar: "الشوفان الكامل",                       unit: "g",     servingSize: 100, kcal: 370, p: 12,    c: 68.5,  f: 7,     cat: { en: "Grains & Pasta", ar: "حبوب ومعكرونة" } },
    cottage:      { en: "Cottage Cheese, Nonfat",                  ar: "جبن قريش خالي الدسم",                  unit: "g",     servingSize: 100, kcal: 72,  p: 10.34, c: 6.66,  f: 0.29,  cat: { en: "Dairy & Eggs", ar: "ألبان وبيض" } },
    chia:         { en: "Chia Seeds",                              ar: "بذور الشيا",                           unit: "g",     servingSize: 100, kcal: 486, p: 16.54, c: 42.12, f: 30.74, cat: { en: "Nuts & Seeds", ar: "مكسرات وبذور" } }
  },

  // Nutrition plan: each item [foodId, amount, swappedFromFoodId?]
  nutrition: {
    name: { en: "Cut", ar: "تنشيف" },
    targets: { kcal: 2321, p: 170, c: 259, f: 64 },
    meals: [
      { en: "Breakfast", ar: "الفطور", items: [["brownToast",30],["egg",3],["chocSpread",11.9,"mozzarella"]] },
      { en: "Lunch",     ar: "الغداء", items: [["salad",100],["oliveOil",10],["chicken",100],["bakedPotato",150]] },
      { en: "Pre-workout", ar: "قبل التمرين", trainingDaysOnly: true,
        note: { en: "1.5 hours before training. Skip it on rest days.", ar: "قبل التمرين بساعة ونصف, ويتم حذفها في ايام الراحة" },
        items: [["brownToast",60],["jam",50]] },
      { en: "Meal 3", ar: "الوجبة ٣",
        note: { en: "Use the same weight of breadcrumbs as the flour to bread the chicken before putting it in the microwave.", ar: "خد بنفس وزن الدقيق بقسماط, ,اعمل بيه بريدينج للفراخ قبل ما تحطها في المايكروويف" },
        items: [["salad",100],["bakedPotato",200],["wwFlour",50],["oliveOil2",15],["chicken",250]] },
      { en: "Meal 4", ar: "الوجبة ٤",
        note: { en: "Take one magnesium glycinate capsule before bed.", ar: "خد حباية ماغنيسيوم جالايسنيت قبل النوم" },
        items: [["skimMilk",200],["dates",53.2,"strawberries"],["oats",30],["cottage",300],["chia",10]] }
    ]
  }
};
