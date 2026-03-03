// Recommendation algorithm for suggesting meals
import { FoodItem, MealType, MealHistory, UserProfile } from '../types';
import { REGIONAL_DISHES, getDishesByRegion } from '../data/regionalDishes';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
// Don't suggest the same dish within this many days
const REPETITION_WINDOW_DAYS = 3;

export class RecommendationService {
  /**
   * Get region-aware recommendations for a specific meal type.
   * Falls back to legacy food items when no regional dishes match.
   */
  static getRecommendations(
    foodItems: FoodItem[],
    mealHistory: MealHistory[],
    mealType: MealType,
    count: number = 3,
    profile?: UserProfile | null
  ): FoodItem[] {
    // Build the candidate pool: regional dishes first, then legacy items
    let candidates: FoodItem[] = [];

    if (profile?.isSetupComplete) {
      // Primary: dishes matching the user's region and veg preference
      const regional = getDishesByRegion(profile.region, profile.vegType).filter(
        (d) => d.mealType.includes(mealType)
      );
      candidates = [...regional];

      // Pad with legacy items of matching vegType if we don't have enough
      if (candidates.length < count * 2) {
        const legacy = foodItems.filter(
          (item) =>
            item.mealType.includes(mealType) &&
            (item.region === profile.region || item.region === 'all') &&
            this.vegTypeMatches(item.vegType, profile.vegType)
        );
        candidates = [...candidates, ...legacy];
      }
    } else {
      // No profile – use all legacy items for this meal type
      candidates = foodItems.filter((item) => item.mealType.includes(mealType));
    }

    if (candidates.length === 0) {
      return [];
    }

    // Score each candidate based on days-since-last-prepared (higher = better)
    const scored = candidates.map((item) => {
      const lastPrepared = this.getLastPreparedDate(item.id, mealHistory);
      const daysSince = lastPrepared
        ? this.getDaysDifference(lastPrepared, new Date())
        : 999;
      return { item, score: daysSince };
    });

    // Prefer dishes not repeated within REPETITION_WINDOW_DAYS
    scored.sort((a, b) => b.score - a.score);

    // Take the top half as candidates (for variety) and shuffle
    const topCount = Math.max(Math.ceil(scored.length / 2), count * 2);
    const pool = scored.slice(0, topCount);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool.slice(0, count).map((s) => s.item);
  }

  /**
   * Generate a 7-day weekly meal plan with no-repetition logic.
   */
  static generateWeeklyPlan(
    profile: UserProfile,
    existingHistory: MealHistory[] = []
  ): { date: string; breakfast: FoodItem; lunch: FoodItem; dinner: FoodItem }[] {
    const pool = getDishesByRegion(profile.region, profile.vegType);
    const breakfastPool = pool.filter((d) => d.mealType.includes('breakfast'));
    const lunchPool = pool.filter((d) => d.mealType.includes('lunch'));
    const dinnerPool = pool.filter((d) => d.mealType.includes('dinner'));

    const today = new Date();
    const plan: { date: string; breakfast: FoodItem; lunch: FoodItem; dinner: FoodItem }[] = [];
    const usedIds = new Set<string>();

    const pickDish = (dishPool: FoodItem[], fallback: FoodItem[]): FoodItem => {
      const fresh = dishPool.filter((d) => !usedIds.has(d.id));
      const source = fresh.length > 0 ? fresh : (dishPool.length > 0 ? dishPool : fallback);
      const pick = source[Math.floor(Math.random() * source.length)];
      if (pick) usedIds.add(pick.id);
      return pick ?? dishPool[0] ?? fallback[0];
    };

    // Fallback pools in case regional pool is small
    const allBreakfast = [
      ...breakfastPool,
      ...REGIONAL_DISHES.filter((d) => d.mealType.includes('breakfast')),
    ];
    const allLunch = [
      ...lunchPool,
      ...REGIONAL_DISHES.filter((d) => d.mealType.includes('lunch')),
    ];
    const allDinner = [
      ...dinnerPool,
      ...REGIONAL_DISHES.filter((d) => d.mealType.includes('dinner')),
    ];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      plan.push({
        date: dateStr,
        breakfast: pickDish(breakfastPool, allBreakfast),
        lunch: pickDish(lunchPool, allLunch),
        dinner: pickDish(dinnerPool, allDinner),
      });
    }

    return plan;
  }

  /**
   * Auto-generate a grocery ingredient list from a weekly plan.
   * Returns ingredients grouped by category.
   */
  static generateGroceryList(
    dishes: FoodItem[]
  ): Record<string, string[]> {
    const categoryMap: Record<string, Set<string>> = {
      Vegetables: new Set(),
      Grains: new Set(),
      Spices: new Set(),
      Dairy: new Set(),
      'Lentils & Legumes': new Set(),
      'Non-Veg': new Set(),
      Other: new Set(),
    };

    const VEGETABLES = new Set([
      'onion', 'tomato', 'potato', 'brinjal', 'mixed vegetables', 'mustard greens',
      'spinach', 'raw banana', 'bitter gourd',
    ]);
    const GRAINS = new Set([
      'rice', 'wheat flour', 'maida', 'semolina', 'jowar flour', 'maize flour',
      'poha', 'sabudana', 'puffed rice', 'idli rice', 'rice flour',
    ]);
    const SPICES = new Set([
      'turmeric', 'red chilli', 'green chilli', 'cumin', 'mustard seeds', 'curry leaves',
      'coriander', 'garam masala', 'kala masala', 'goda masala', 'sambar powder',
      'chole masala', 'kolhapuri masala', 'chettinad masala', 'kashmiri chilli',
      'cardamom', 'pepper', 'bay leaf', 'cinnamon', 'tamarind', 'kalpasi',
    ]);
    const DAIRY = new Set([
      'milk', 'yogurt', 'ghee', 'butter', 'cream', 'hung curd',
      'chenna', 'buttermilk', 'shrikhand',
    ]);
    const LEGUMES = new Set([
      'toor dal', 'moong dal', 'chana dal', 'urad dal', 'besan', 'rajma',
      'chickpeas', 'moth beans', 'sprouted moth beans', 'black urad dal',
    ]);
    const NON_VEG = new Set([
      'chicken', 'mutton', 'hilsa fish',
    ]);

    for (const dish of dishes) {
      for (const ing of (dish.ingredients ?? [])) {
        const lower = ing.toLowerCase();
        if (VEGETABLES.has(lower)) {
          categoryMap.Vegetables.add(ing);
        } else if (GRAINS.has(lower)) {
          categoryMap.Grains.add(ing);
        } else if (SPICES.has(lower)) {
          categoryMap.Spices.add(ing);
        } else if (DAIRY.has(lower)) {
          categoryMap.Dairy.add(ing);
        } else if (LEGUMES.has(lower)) {
          categoryMap['Lentils & Legumes'].add(ing);
        } else if (NON_VEG.has(lower)) {
          categoryMap['Non-Veg'].add(ing);
        } else {
          categoryMap.Other.add(ing);
        }
      }
    }

    // Convert sets to sorted arrays, drop empty categories
    const result: Record<string, string[]> = {};
    for (const [cat, items] of Object.entries(categoryMap)) {
      if (items.size > 0) {
        result[cat] = Array.from(items).sort();
      }
    }
    return result;
  }

  /**
   * Get all recommendations for all three main meal types.
   */
  static getAllRecommendations(
    foodItems: FoodItem[],
    mealHistory: MealHistory[],
    profile?: UserProfile | null
  ) {
    return {
      breakfast: this.getRecommendations(foodItems, mealHistory, 'breakfast', 3, profile),
      lunch: this.getRecommendations(foodItems, mealHistory, 'lunch', 3, profile),
      dinner: this.getRecommendations(foodItems, mealHistory, 'dinner', 3, profile),
    };
  }

  // ── Private helpers ────────────────────────────────────────────────────

  private static vegTypeMatches(
    dishVeg: string | undefined,
    profileVeg: string
  ): boolean {
    if (!dishVeg) return true;
    if (profileVeg === 'veg') return dishVeg === 'veg';
    if (profileVeg === 'eggetarian') return dishVeg !== 'non-veg';
    return true; // non-veg: all dishes allowed
  }

  private static getLastPreparedDate(
    foodItemId: string,
    mealHistory: MealHistory[]
  ): Date | null {
    const relevant = mealHistory
      .filter((meal) => meal.foodItemId === foodItemId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return relevant.length > 0 ? new Date(relevant[0].date) : null;
  }

  private static getDaysDifference(date1: Date, date2: Date): number {
    return Math.floor(
      Math.abs((date1.getTime() - date2.getTime()) / MILLISECONDS_PER_DAY)
    );
  }
}
