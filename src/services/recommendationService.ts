// Recommendation algorithm for suggesting meals
import { FoodItem, MealType, MealHistory } from '../types';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export class RecommendationService {
  /**
   * Get recommendations for a specific meal type
   * Algorithm prioritizes items not prepared recently
   */
  static getRecommendations(
    foodItems: FoodItem[],
    mealHistory: MealHistory[],
    mealType: MealType,
    count: number = 1
  ): FoodItem[] {
    // Filter items suitable for the meal type
    const suitableItems = foodItems.filter((item) =>
      item.mealType.includes(mealType)
    );

    // Calculate scores for each item based on when it was last prepared
    const scoredItems = suitableItems.map((item) => {
      const lastPrepared = this.getLastPreparedDate(item.id, mealHistory);
      const daysSinceLastPrepared = lastPrepared
        ? this.getDaysDifference(lastPrepared, new Date())
        : 999; // High score if never prepared

      return {
        item,
        score: daysSinceLastPrepared,
      };
    });

    // Sort by score (descending) and return top items
    scoredItems.sort((a, b) => b.score - a.score);

    // Add some randomization to avoid being too predictable
    // Take top 50% and randomly select from them
    const topHalf = Math.ceil(scoredItems.length / 2);
    const candidates = scoredItems.slice(0, Math.max(topHalf, count * 2));
    
    // Shuffle candidates
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    return candidates.slice(0, count).map((scored) => scored.item);
  }

  /**
   * Get the last date when a food item was prepared
   */
  private static getLastPreparedDate(
    foodItemId: string,
    mealHistory: MealHistory[]
  ): Date | null {
    const relevantHistory = mealHistory
      .filter((meal) => meal.foodItemId === foodItemId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return relevantHistory.length > 0
      ? new Date(relevantHistory[0].date)
      : null;
  }

  /**
   * Calculate the number of days between two dates
   */
  private static getDaysDifference(date1: Date, date2: Date): number {
    return Math.floor(Math.abs((date1.getTime() - date2.getTime()) / MILLISECONDS_PER_DAY));
  }

  /**
   * Get all recommendations for all meal types
   */
  static getAllRecommendations(
    foodItems: FoodItem[],
    mealHistory: MealHistory[]
  ) {
    return {
      breakfast: this.getRecommendations(foodItems, mealHistory, 'breakfast', 1),
      lunch: this.getRecommendations(foodItems, mealHistory, 'lunch', 1),
      dinner: this.getRecommendations(foodItems, mealHistory, 'dinner', 1),
    };
  }
}
