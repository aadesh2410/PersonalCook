// Storage service for managing food items and meal history
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem, MealHistory } from '../types';
import { INITIAL_FOOD_ITEMS } from '../data/foodItems';

const FOOD_ITEMS_KEY = '@PersonalCook:foodItems';
const MEAL_HISTORY_KEY = '@PersonalCook:mealHistory';

export class StorageService {
  // Food Items Management
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

  // Meal History Management
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

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([FOOD_ITEMS_KEY, MEAL_HISTORY_KEY]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}
