import type { Food, L10n } from '../types';

export const FOOD_CATS: Record<string, L10n> = {
  bakery: { en: 'Bread & bakery', ar: 'مخبوزات' },
  dairy: { en: 'Dairy & eggs', ar: 'ألبان وبيض' },
  poultry: { en: 'Poultry & meat', ar: 'دواجن ولحوم' },
  carb: { en: 'Carbs', ar: 'كربوهيدرات' },
  grains: { en: 'Grains & pasta', ar: 'حبوب ومعكرونة' },
  fruits: { en: 'Fruits', ar: 'فواكه' },
  nuts: { en: 'Nuts & seeds', ar: 'مكسرات وبذور' },
  salads: { en: 'Salads & dressings', ar: 'سلطات' },
  other: { en: 'Other', ar: 'أخرى' },
  custom: { en: 'My foods', ar: 'أطعمتي' },
};

// [id, en, ar, cat, unit, per, kcal, protein, carbs, fat, cookedFactor?]
type Row = [string, string, string, string, string, number, number, number, number, number, number?];

/**
 * Food library. Values come from the coach's portal (its swap lists), converted to
 * per-100 g (or per piece). The swap screen offers foods from the same category.
 */
const ROWS: Row[] = [
  // ---- foods in the coach's plan ----
  ['brownToast', 'Brown toast bread', 'خبز محمص بني', 'bakery', 'g', 100, 266.7, 11, 49, 3],
  ['egg', 'Egg', 'بيضة', 'dairy', 'large', 1, 78, 6.33, 0.56, 5.33],
  ['chocSpread', 'Healthy chocolate spread', 'شوكولاتة دايت للدهن', 'other', 'g', 100, 400, 5.71, 45.71, 22.86],
  ['mozzarella', 'Mozzarella, whole milk', 'جبن موتزاريلا كامل الدسم', 'other', 'g', 100, 318, 21.33, 2.67, 24.67],
  ['salad', 'Salad', 'سلطة خضراء', 'other', 'g', 100, 14, 0.71, 2.09, 0.09],
  ['oliveOil', 'Olive oil', 'زيت زيتون', 'other', 'g', 100, 883.3, 0, 0, 100],
  ['chicken', 'Chicken breast, skinless, raw', 'صدور دجاج، منزوعة العظم والجلد، نيئة', 'poultry', 'g', 100, 120, 22.5, 0, 2.62, 0.694],
  ['bakedPotato', 'Baked potato', 'بطاطس مشوية', 'carb', 'g', 100, 93, 2.48, 18.91, 0.08],
  ['jam', 'Vitrac strawberry jam', 'مربى فراولة فيتراك', 'carb', 'g', 100, 240, 0, 60, 0],
  ['wwFlour', 'White whole wheat flour', 'دقيق القمح الكامل الأبيض', 'grains', 'g', 100, 346.1, 14.95, 71.34, 2.8],
  ['oliveOil2', 'Olive oil (dressing)', 'زيت الزيتون', 'salads', 'g', 100, 900, 0, 0, 100],
  ['skimMilk', 'Skim milk', 'حليب خالي الدسم', 'dairy', 'g', 100, 34, 3.43, 4.93, 0.09],
  ['dates', 'Fresh dates', 'تمر طازج', 'fruits', 'g', 100, 124, 1.5, 33.1, 0.1],
  ['strawberries', 'Strawberries, raw', 'الفراولة نيئ', 'fruits', 'g', 100, 33, 0.65, 7.95, 0.2],
  ['oats', 'Whole oats', 'الشوفان الكامل', 'grains', 'g', 100, 370.1, 11.97, 68.59, 7.05],
  ['cottage', 'Cottage cheese, fat-free', 'جبن قريش خالي الدسم', 'dairy', 'g', 100, 72, 10.34, 6.65, 0.28],
  ['chia', 'Chia seeds', 'بذور الشيا', 'nuts', 'g', 100, 486, 16.54, 42.12, 30.74],

  // ---- bakery ----
  ['baladiBread', 'Baladi / white pita bread', 'خبز بلدي، بيتا أبيض', 'bakery', 'g', 100, 260.1, 8.12, 55.84, 0.65],
  ['toastSlice', 'Toast', 'توست', 'bakery', 'slice', 1, 97, 3.38, 19.62, 1.13],
  ['tortillaRoll', 'Tortilla wrap', 'لفائف التورتيلا', 'bakery', 'g', 100, 204.1, 5.1, 32.65, 5.87],

  // ---- dairy & eggs ----
  ['creamCheeseLight', 'Cream cheese, light', 'جبنة كريمية، خفيفة أو قليلة الدسم', 'dairy', 'g', 100, 208, 7.82, 6.76, 16.71],
  ['evapMilk', 'Evaporated milk, whole', 'حليب مبخر كامل الدسم', 'dairy', 'g', 100, 134, 6.82, 10.02, 7.56],
  ['yogurtWhole', 'Yogurt, whole milk', 'زبادي طازج كامل الدسم', 'dairy', 'g', 100, 71, 4.1, 6.71, 3.09],
  ['greek5', 'Greek yogurt 5%', 'زبادي يوناني ٥٪', 'dairy', 'g', 100, 94, 8.32, 4.02, 4.98],
  ['greek0', 'Greek yogurt 0%', 'زبادي يوناني ٠٪', 'dairy', 'g', 100, 56, 10, 4, 0],
  ['wholeMilk', 'Whole milk', 'الحليب كامل الدسم', 'dairy', 'g', 100, 60, 3.28, 4.64, 3.21],
  ['nadecFeta', 'Nadec feta, low fat', 'نادك، جبنة فيتا قليلة الدسم', 'dairy', 'ml', 100, 204, 15, 8.98, 12.03],
  ['cheddarLight', 'Cheddar slices, light', 'شرائح جبن شيدر خفيف', 'dairy', 'g', 100, 206, 16.99, 8.8, 11.27],
  ['phillyLight', 'Philadelphia cream cheese, light', 'فيلادلفيا، جبنة كريمية خفيفة', 'dairy', 'g', 100, 200, 6.67, 6.67, 13.33],
  ['eggWhite', 'Egg white, raw', 'بياض بيض نيء', 'dairy', 'g', 100, 55, 10.69, 2.35, 0.07],
  ['skimPowder', 'Skim milk powder', 'مسحوق حليب خالي الدسم', 'dairy', 'g', 100, 360, 36, 52, 0],
  ['yogurtPlain', 'Plain yogurt, whole milk', 'زبادي عادي كامل الدسم', 'dairy', 'g', 100, 77, 3.82, 5.56, 4.48],

  // ---- poultry ----
  ['chickenCooked', 'Chicken breast, cooked', 'صدور دجاج مطبوخة', 'poultry', 'g', 100, 173, 30.98, 0, 4.47],
  ['chickenThigh', 'Chicken thigh, skinless', 'فخذ دجاج منزوع الجلد', 'poultry', 'g', 100, 173, 27.67, 0, 6.05],
  ['turkeySlices', 'Turkey slices', 'شرائح الديك الرومي', 'poultry', 'g', 100, 96, 16.24, 3.52, 1.76],
  ['turkeyBreast', 'Turkey breast, raw', 'صدر ديك رومي نيء', 'poultry', 'g', 100, 147, 30.15, 0, 2.08, 0.75],

  // ---- carbs ----
  ['banana', 'Banana', 'موز', 'carb', 'g', 100, 88, 0.69, 21.32, 0.32],
  ['blackLentils', 'Black lentils (dry)', 'عدس أسود', 'carb', 'g', 100, 375, 26.08, 59.95, 1.08],
  ['sukkariDates', 'Sukkari dates', 'تمر سكري', 'carb', 'g', 100, 277, 1.79, 68.25, 0.2],
  ['foul', 'Foul medammes', 'فول مدمس', 'carb', 'g', 100, 74, 5.31, 5.99, 0.69],
  ['heroJam', 'Hero light jam, berries', 'مربى هيرو لايت توت', 'carb', 'g', 100, 37, 0.29, 2.81, 0.21],
  ['reweWraps', 'High-protein wraps (Rewe)', 'رقائق تورتيلا عالية البروتين', 'carb', 'g', 100, 123, 7.23, 15.17, 3.17],
  ['peasCarrots', 'Peas & carrots', 'خضار مشكل بسلة وجزر', 'carb', 'g', 100, 48, 3.1, 6.92, 0.41],
  ['nestleFitness', 'Nestlé Fitness cereal', 'حبوب نستله فيتنس', 'carb', 'g', 100, 367.1, 9.21, 74.74, 1.58],
  ['seriousMass', 'ON Serious Mass', 'سيريس ماس', 'carb', 'g', 100, 374, 15.01, 73.99, 1.34],
  ['potato', 'Potato', 'بطاطس', 'carb', 'g', 100, 77, 2.1, 15.4, 0.11],
  ['riceCake', 'Rice cake', 'كيك الأرز', 'carb', 'g', 100, 386.9, 8.33, 77.22, 2.78],
  ['breadwayTortilla', 'Breadway tortilla', 'تورتيلا بريدواي', 'carb', 'g', 100, 300, 7.96, 58.06, 4.95],
  ['pastaDry', 'Pasta, uncooked', 'معكرونة غير مطبوخة', 'carb', 'g', 100, 352.9, 11.9, 72.91, 1.52],
  ['riceFlour', 'Rice flour', 'دقيق رز', 'carb', 'g', 100, 369, 6.88, 79.37, 1.32],
  ['belila', 'Belila (wheat berries)', 'بليلة', 'carb', 'g', 100, 345.9, 14.89, 60.55, 2.73],
  ['cerelac', 'Cerelac', 'سيريلاك', 'carb', 'g', 100, 418, 14.97, 67.96, 8.98],

  // ---- grains ----
  ['barleyFlour', 'Barley flour', 'دقيق الشعير', 'grains', 'g', 100, 356.9, 8.66, 77.32, 2.47],
  ['brownRiceCooked', 'Brown rice, cooked', 'أرز بني مطبوخ', 'grains', 'g', 100, 123, 2.77, 25.59, 1],
  ['bulgur', 'Bulgur, dry', 'برغل جاف', 'grains', 'g', 100, 342.1, 12.25, 75.89, 1.38],
  ['riceCooked', 'Long-grain rice, cooked', 'أرز طويل الحبة مطبوخ', 'grains', 'g', 100, 130, 2.7, 28.17, 0.3],
  ['oatPasta', 'Oat pasta', 'معكرونة الشوفان', 'grains', 'g', 100, 361, 11.9, 69.94, 2.92],
  ['wwPastaCooked', 'Whole wheat pasta, cooked', 'معكرونة قمح كامل مطبوخة', 'grains', 'g', 100, 149, 6.03, 30.06, 1.72],
  ['basmatiRaw', 'Basmati rice, raw', 'أرز بسمتي خام', 'grains', 'g', 100, 356, 8.85, 77.78, 0, 2.74],
  ['quinoaCooked', 'Quinoa, cooked', 'كينوا مطبوخة', 'grains', 'g', 100, 120, 4.37, 21.29, 1.94],
  ['whiteRiceRaw', 'White rice, raw', 'أرز أبيض خام', 'grains', 'g', 100, 365, 7.17, 79.96, 0.63, 2.81],
  ['wgPasta', 'Whole grain pasta', 'معكرونة الحبوب الكاملة', 'grains', 'g', 100, 376.1, 13.91, 78.04, 2.39],

  // ---- salads ----
  ['dressedSalad', 'Salad with dressing', 'سلطة بالصوص', 'salads', 'g', 100, 143, 2.65, 9.85, 8.16],

  // ---- fruits ----
  ['apple', 'Apple (with skin)', 'تفاح مع القشرة', 'fruits', 'g', 100, 52, 0.24, 13.79, 0.16],
  ['apricotDried', 'Dried apricots', 'مشمش مجفف', 'fruits', 'g', 100, 240.9, 3.28, 62.77, 0.36],
  ['apricot', 'Apricot', 'مشمش', 'fruits', 'g', 100, 48, 1.38, 11.14, 0.36],
  ['avocado', 'Avocado', 'أفوكادو', 'fruits', 'g', 100, 120, 2.18, 7.82, 10],
  ['bananaFruit', 'Banana', 'موز', 'fruits', 'g', 100, 88, 0.8, 23.07, 0.27],
  ['blackberries', 'Blackberries', 'توت أسود', 'fruits', 'g', 100, 43, 1.37, 9.58, 0.52],
  ['blueberries', 'Blueberries', 'توت أزرق', 'fruits', 'g', 100, 57, 0.69, 14.61, 0.35],
  ['cantaloupe', 'Cantaloupe', 'شمام', 'fruits', 'g', 100, 34, 0.82, 8.14, 0.21],
  ['cherries', 'Sweet cherries', 'كرز حلو', 'fruits', 'g', 100, 63, 1.05, 16.14, 0.19],
  ['clementine', 'Clementine', 'كليمنتينا', 'fruits', 'g', 100, 47, 0.85, 12.04, 0.14],
  ['dragonfruit', 'Dragon fruit', 'فاكهة التنين', 'fruits', 'g', 100, 43, 1.04, 7.63, 0.13],
  ['fig', 'Fig', 'تين', 'fruits', 'g', 100, 74, 0.79, 19.19, 0.34],
  ['figDried', 'Dried figs', 'تين مجفف', 'fruits', 'g', 100, 249, 3.4, 63.77, 0.75],
  ['grapefruitPink', 'Pink grapefruit', 'جريب فروت وردي', 'fruits', 'g', 100, 42, 0.76, 10.63, 0.13],
  ['grapes', 'Grapes', 'عنب', 'fruits', 'g', 100, 69, 0.73, 18.1, 0.21],
  ['guava', 'Guava', 'جوافة', 'fruits', 'g', 100, 68, 2.58, 14.33, 0.93],
  ['kiwi', 'Kiwi', 'كيوي', 'fruits', 'g', 100, 61, 1.11, 14.62, 0.56],
  ['lemon', 'Lemon', 'ليمون', 'fruits', 'g', 100, 29, 1.1, 9.32, 0.31],
  ['mango', 'Mango', 'مانجو', 'fruits', 'g', 100, 60, 0.82, 15.01, 0.36],
  ['nectarine', 'Red peach / nectarine', 'خوخ أحمر', 'fruits', 'g', 100, 44, 1.07, 10.54, 0.33],
  ['orange', 'Orange', 'برتقال', 'fruits', 'g', 100, 47, 0.93, 11.75, 0.14],
  ['papaya', 'Papaya', 'بابايا', 'fruits', 'g', 100, 43, 0.46, 10.82, 0.26],
  ['peach', 'Peach', 'خوخ', 'fruits', 'g', 100, 39, 0.89, 9.52, 0.24],
  ['pear', 'Pear', 'كمثرى', 'fruits', 'g', 100, 57, 0.35, 15.21, 0.17],
  ['pineapple', 'Pineapple', 'أناناس', 'fruits', 'g', 100, 54, 0.49, 14.08, 0.25],
  ['plum', 'Plum', 'برقوق', 'fruits', 'g', 100, 46, 0.7, 11.44, 0.28],
  ['pomegranate', 'Pomegranate', 'رمان', 'fruits', 'g', 100, 83, 1.64, 18.74, 1.13],
  ['grapefruit', 'Grapefruit', 'جريب فروت', 'fruits', 'g', 100, 38, 0.75, 9.62, 0.06],
  ['raisins', 'Raisins', 'زبيب', 'fruits', 'g', 100, 299.1, 3.17, 79.19, 0.45],
  ['tangerine', 'Tangerine', 'يوسفي', 'fruits', 'g', 100, 53, 0.8, 13.33, 0.32],
  ['watermelon', 'Watermelon', 'بطيخ', 'fruits', 'g', 100, 30, 0.59, 7.55, 0.14],

  // ---- nuts ----
  ['almonds', 'Almonds', 'لوز', 'nuts', 'g', 100, 584.3, 21.69, 20.48, 50.6],
  ['cashews', 'Cashews', 'كاجو', 'nuts', 'g', 100, 533, 17.58, 36.26, 38.46],
  ['peanutsNut', 'Peanuts', 'فول سوداني', 'nuts', 'g', 100, 551.1, 22.73, 26.14, 43.18],
  ['pistachios', 'Pistachios', 'فستق', 'nuts', 'g', 100, 560.9, 20.69, 27.59, 44.83],
  ['sesame', 'Sesame seeds', 'بذور السمسم', 'nuts', 'g', 100, 572.9, 17.65, 23.53, 49.41],
  ['walnuts', 'Walnuts', 'جوز', 'nuts', 'g', 100, 679.2, 13.89, 11.11, 69.44],

  // ---- other (coach's mixed list) ----
  ['abuAufBar', 'Abu Auf protein bar, peanut butter', 'بار بروتين أبو عوف زبدة فول سوداني', 'other', 'g', 100, 357.1, 28.57, 30.08, 11.28],
  ['arabicGum', 'Arabic gum', 'صمغ عربي', 'other', 'g', 100, 175.9, 1.11, 84.07, 0],
  ['bbq', 'BBQ sauce', 'صوص باربكيو', 'other', 'g', 100, 171.8, 1.08, 40.07, 1.08],
  ['carbPowder', 'Carb powder', 'مسحوق كربوهيدرات', 'other', 'g', 100, 380, 0, 94.4, 0],
  ['chickpeas', 'Chickpeas, boiled', 'حمص مسلوق', 'other', 'g', 100, 164.1, 8.97, 19.66, 2.76],
  ['cornflakes', 'Cornflakes', 'كورن فليكس', 'other', 'g', 100, 376.4, 7.09, 81.89, 2.36],
  ['areesh', 'Cottage cheese (areesh)', 'جبنة قريش', 'other', 'g', 100, 105.1, 11.7, 4.64, 4.19],
  ['granola', 'Granola', 'جرانولا', 'other', 'g', 100, 425, 9.82, 48.21, 20.54],
  ['groundBeef', 'Ground beef / lamb', 'لحم مفروم', 'other', 'g', 100, 276.2, 22.67, 0, 19.77],
  ['veganProtein', 'Limitless vegan protein', 'بروتين نباتي ليمتلس', 'other', 'g', 100, 371.1, 71.09, 8.59, 5.47],
  ['whiteCheese', 'White cheese, full cream, low salt', 'جبنة بيضاء كاملة الدسم قليلة الملح', 'other', 'g', 100, 240.9, 10.1, 4.55, 20.71],
  ['milkChoc', 'Milk chocolate bar', 'شوكولاتة بالحليب', 'other', 'g', 100, 534.8, 7.87, 56.18, 29.21],
  ['fishOil', 'Omega-3 fish oil capsule', 'كبسولة أوميجا ٣', 'other', 'caps', 1, 9, 0, 0, 1],
  ['pastrami', 'Pastrami (basterma)', 'بسطرمة', 'other', 'g', 100, 146, 21.78, 0.31, 5.83],
  ['tahini', 'Tahini, raw', 'طحينة خام', 'other', 'g', 100, 573.5, 18.07, 12.05, 49.4],
  ['roumy', 'Roumy cheese', 'جبنة رومي', 'other', 'g', 100, 374, 25.2, 0.79, 29.92],
  ['tang', 'Tang', 'تانج', 'other', 'g', 100, 387, 0, 93.5, 0],
  ['ulker', 'Ülker biscuits', 'بسكويت أولكر', 'other', 'g', 100, 450, 6.6, 72.64, 14.15],
  ['balance', 'Balance bar', 'بار بالانس', 'other', 'g', 100, 400, 21.85, 67.23, 4.2],
  ['cheddar', 'Cheddar, full fat', 'جبنة شيدر كاملة الدسم', 'other', 'g', 100, 400, 22.69, 3.36, 33.61],
  ['darkChoc', 'Dark chocolate 70–85%', 'شوكولاتة داكنة ٧٠–٨٥٪', 'other', 'g', 100, 597.5, 7.5, 35, 42.5],
  ['kayyOats', 'Kayy protein oats', 'شوفان كاي', 'other', 'g', 100, 384.7, 25, 59.68, 2.42],
  ['juhaynaLight', 'Juhayna light yogurt', 'زبادي جهينة لايت', 'other', 'g', 100, 53, 3.45, 5.35, 1.56],
  ['popcorn', 'Popcorn kernels, unpopped', 'ذرة فشار', 'other', 'g', 100, 374.8, 11.02, 60.63, 3.94],
  ['oatsPlain', 'Oats', 'الشوفان', 'other', 'g', 100, 379.4, 13.49, 67.46, 6.35],
  ['appleOther', 'Apple', 'تفاح', 'other', 'g', 100, 52, 0.33, 13.77, 0.22],
  ['tuna', 'Tuna in water, drained', 'تونة في الماء مصفاة', 'other', 'g', 100, 86.1, 19.35, 0, 1.08],
  ['yogurtOther', 'Yogurt', 'زبادي', 'other', 'g', 100, 61, 3.46, 4.74, 3.33],
  ['juhaynaLow', 'Juhayna low-fat yogurt', 'زبادي جهينة قليل الدسم', 'other', 'g', 100, 51, 3.22, 5.04, 1.5],
  ['redPepper', 'Red bell pepper', 'فلفل أحمر', 'other', 'g', 100, 26, 0.98, 6.01, 0.27],
  ['peanuts', 'Peanuts', 'فول سوداني', 'other', 'g', 100, 566.7, 26.19, 16.67, 48.81],
];

export const BUILTIN_FOODS: Food[] = ROWS.map(([id, en, ar, cat, unit, per, kcal, p, c, f, cookedFactor]) => ({
  id, name: { en, ar }, cat, unit, per, kcal, p, c, f, ...(cookedFactor ? { cookedFactor } : {}),
}));
