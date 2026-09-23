export type FoodDatabaseEntry = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
};

// Small built-in reference list so search works before a real nutrition API
// is wired in. Swap FOOD_DATABASE for an API call later without touching
// the search UI.
export const FOOD_DATABASE: FoodDatabaseEntry[] = [
  { name: "Chicken breast (100g)", calories: 165, protein: 31, carbs: 0 },
  {
    name: "White rice, cooked (1 cup)",
    calories: 205,
    protein: 4.3,
    carbs: 45,
  },
  { name: "Egg (1 large)", calories: 78, protein: 6, carbs: 0.6 },
  { name: "Banana (1 medium)", calories: 105, protein: 1.3, carbs: 27 },
  { name: "Apple (1 medium)", calories: 95, protein: 0.5, carbs: 25 },
  { name: "Oatmeal, cooked (1 cup)", calories: 166, protein: 5.9, carbs: 28 },
  { name: "Greek yogurt (170g)", calories: 100, protein: 17, carbs: 6 },
  { name: "Salmon (100g)", calories: 208, protein: 20, carbs: 0 },
  { name: "Broccoli, cooked (1 cup)", calories: 55, protein: 3.7, carbs: 11 },
  { name: "Peanut butter (2 tbsp)", calories: 190, protein: 8, carbs: 6 },
  { name: "Bread, whole wheat (1 slice)", calories: 81, protein: 4, carbs: 14 },
  { name: "Almonds (1 oz / 28g)", calories: 164, protein: 6, carbs: 6 },
  { name: "Avocado (1 medium)", calories: 240, protein: 3, carbs: 12 },
  { name: "Sweet potato (1 medium)", calories: 103, protein: 2, carbs: 24 },
  {
    name: "Ground beef, 90% lean (100g)",
    calories: 176,
    protein: 20,
    carbs: 0,
  },
  { name: "Milk, whole (1 cup)", calories: 149, protein: 8, carbs: 12 },
  { name: "Pasta, cooked (1 cup)", calories: 221, protein: 8, carbs: 43 },
  { name: "Tofu (100g)", calories: 76, protein: 8, carbs: 1.9 },
  { name: "Orange (1 medium)", calories: 62, protein: 1.2, carbs: 15 },
  { name: "Quinoa, cooked (1 cup)", calories: 222, protein: 8, carbs: 39 },
];
