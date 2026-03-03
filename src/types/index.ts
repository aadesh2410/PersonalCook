// Type definitions for the PersonalCook app

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'festival' | 'fasting';

export type VegType = 'veg' | 'non-veg' | 'eggetarian';

export type SpiceLevel = 'low' | 'medium' | 'high';

export type Region =
  | 'maharashtra'
  | 'gujarat'
  | 'punjab'
  | 'tamil-nadu'
  | 'west-bengal';

export const REGION_LABELS: Record<Region, string> = {
  maharashtra: 'Maharashtra',
  gujarat: 'Gujarat',
  punjab: 'Punjab',
  'tamil-nadu': 'Tamil Nadu',
  'west-bengal': 'West Bengal',
};

export interface FoodItem {
  id: string;
  name: string;
  mealType: MealType[];
  region: Region | 'all';
  vegType: VegType;
  spiceLevel?: SpiceLevel;
  ingredients?: string[];
  category: string; // e.g., 'rice', 'curry', 'snack', 'bread', etc.
  preparationTime?: number; // in minutes
  isCustom: boolean; // true if added by user
  season?: 'summer' | 'monsoon' | 'winter' | 'all';
  festivalTag?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface UserProfile {
  name: string;
  region: Region;
  city?: string;
  vegType: VegType;
  spiceLevel: SpiceLevel;
  familyMembers: number;
  allergies: string[];
  isSetupComplete: boolean;
}

export interface MealHistory {
  id: string;
  foodItemId: string;
  foodItemName: string;
  mealType: MealType;
  date: string; // ISO date string
}

export interface DailyMealPlan {
  date: string; // ISO date string (day only YYYY-MM-DD)
  breakfast: string; // food item id
  lunch: string; // food item id
  dinner: string; // food item id
}

export interface WeeklyPlan {
  id: string;
  weekStartDate: string; // ISO date string
  days: DailyMealPlan[];
}

export interface DailyRecommendation {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
}
