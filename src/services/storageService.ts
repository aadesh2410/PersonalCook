// Storage service for managing food items, meal history, user profile, and meal plans
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem, MealHistory, UserProfile, WeeklyPlan } from '../types';
import { INITIAL_FOOD_ITEMS } from '../data/foodItems';

const FOOD_ITEMS_KEY = '@PersonalCook:foodItems';
const MEAL_HISTORY_KEY = '@PersonalCook:mealHistory';
const USER_PROFILE_KEY = '@PersonalCook:userProfile';
const WEEKLY_PLAN_KEY = '@PersonalCook:weeklyPlan';

export class StorageService {
  // ── Food Items ──────────────────────────────────────────────────────────

  static async getFoodItems(): Promise<FoodItem[]> {
    try {
      const data = await AsyncStorage.getItem(FOOD_ITEMS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Initialize with default items if no data exists
      await this.saveFoodItems(INITIAL_FOOD_ITEMS);
      return INITIAL_FOOD_ITEMS;
    } catch (error) {
      console.error('Error getting food items:', error);
      return INITIAL_FOOD_ITEMS;
    }
  }

  static async saveFoodItems(items: FoodItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(FOOD_ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving food items:', error);
      throw error;
    }
  }

  static async addFoodItem(item: FoodItem): Promise<void> {
    try {
      const items = await this.getFoodItems();
      items.push(item);
      await this.saveFoodItems(items);
    } catch (error) {
      console.error('Error adding food item:', error);
      throw error;
    }
  }

  static async updateFoodItem(updatedItem: FoodItem): Promise<void> {
    try {
      const items = await this.getFoodItems();
      const index = items.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        items[index] = updatedItem;
        await this.saveFoodItems(items);
      }
    } catch (error) {
      console.error('Error updating food item:', error);
      throw error;
    }
  }

  static async deleteFoodItem(itemId: string): Promise<void> {
    try {
      const items = await this.getFoodItems();
      const filtered = items.filter((item) => item.id !== itemId);
      await this.saveFoodItems(filtered);
    } catch (error) {
      console.error('Error deleting food item:', error);
      throw error;
    }
  }

  // ── Meal History ─────────────────────────────────────────────────────────

  static async getMealHistory(): Promise<MealHistory[]> {
    try {
      const data = await AsyncStorage.getItem(MEAL_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting meal history:', error);
      return [];
    }
  }

  static async addMealHistory(meal: MealHistory): Promise<void> {
    try {
      const history = await this.getMealHistory();
      history.push(meal);
      await AsyncStorage.setItem(MEAL_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error adding meal history:', error);
      throw error;
    }
  }

  static async deleteMealHistoryItems(ids: Set<string>): Promise<void> {
    try {
      const history = await this.getMealHistory();
      const remaining = history.filter((m) => !ids.has(m.id));
      await AsyncStorage.setItem(MEAL_HISTORY_KEY, JSON.stringify(remaining));
    } catch (error) {
      console.error('Error deleting meal history items:', error);
      throw error;
    }
  }

  // ── User Profile ─────────────────────────────────────────────────────────

  static async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  static async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  // ── Weekly Plan ───────────────────────────────────────────────────────────

  static async getWeeklyPlan(): Promise<WeeklyPlan | null> {
    try {
      const data = await AsyncStorage.getItem(WEEKLY_PLAN_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting weekly plan:', error);
      return null;
    }
  }

  static async saveWeeklyPlan(plan: WeeklyPlan): Promise<void> {
    try {
      await AsyncStorage.setItem(WEEKLY_PLAN_KEY, JSON.stringify(plan));
    } catch (error) {
      console.error('Error saving weekly plan:', error);
      throw error;
    }
  }

  // ── Utility ───────────────────────────────────────────────────────────────

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        FOOD_ITEMS_KEY,
        MEAL_HISTORY_KEY,
        USER_PROFILE_KEY,
        WEEKLY_PLAN_KEY,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}
