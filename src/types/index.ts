// Type definitions for the PersonalCook app

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface FoodItem {
  id: string;
  name: string;
  mealType: MealType[];
  lastPrepared?: string; // ISO date string
  category: string; // e.g., 'rice', 'curry', 'snack', 'bread', etc.
  preparationTime?: number; // in minutes
  isCustom: boolean; // true if added by user
}

export interface MealHistory {
  id: string;
  foodItemId: string;
  foodItemName: string;
  mealType: MealType;
  date: string; // ISO date string
}

export interface DailyRecommendation {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
}
