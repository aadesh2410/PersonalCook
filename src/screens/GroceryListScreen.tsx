// Grocery List Screen – auto-generated from the weekly plan
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { FoodItem, UserProfile } from '../types';
import { StorageService } from '../services/storageService';
import { RecommendationService } from '../services/recommendationService';
import { getDishesByRegion } from '../data/regionalDishes';

const CATEGORY_ICONS: Record<string, string> = {
  Vegetables: '🥦',
  Grains: '🌾',
  Spices: '🌶️',
  Dairy: '🥛',
  'Lentils & Legumes': '🫘',
  'Non-Veg': '🍗',
  Other: '🛒',
};

export const GroceryListScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [groceryList, setGroceryList] = useState<Record<string, string[]>>({});
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const p = await StorageService.getUserProfile();
      setProfile(p);

      if (!p?.isSetupComplete) {
        setLoading(false);
        return;
      }

      const plan = await StorageService.getWeeklyPlan();
      let dishes: FoodItem[] = [];

      if (plan && plan.days.length > 0) {
        const pool = getDishesByRegion(p.region, p.vegType);
        const ids = plan.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner]);
        dishes = ids
          .map((id) => pool.find((f) => f.id === id))
          .filter((f): f is FoodItem => f !== undefined);
      } else {
        const generated = RecommendationService.generateWeeklyPlan(p);
        dishes = generated.flatMap((d) => [d.breakfast, d.lunch, d.dinner]);
      }

      const list = RecommendationService.generateGroceryList(dishes);
      setGroceryList(list);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (key: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleAllInCategory = (category: string, items: string[]) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      const keys = items.map((item) => `${category}:${item}`);
      const allChecked = keys.every((k) => next.has(k));
      if (allChecked) {
        keys.forEach((k) => next.delete(k));
      } else {
        keys.forEach((k) => next.add(k));
      }
      return next;
    });
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleClearChecked = () => {
    setCheckedItems(new Set());
  };

  const handleCheckAll = () => {
    const allKeys = Object.entries(groceryList).flatMap(([category, items]) =>
      items.map((item) => `${category}:${item}`)
    );
    setCheckedItems(new Set(allKeys));
  };

  const totalItems = Object.values(groceryList).reduce((s, arr) => s + arr.length, 0);
  const checkedCount = checkedItems.size;
  const progressPercent = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  if (!profile?.isSetupComplete) {
    return (
      <View style={styles.noProfile}>
        <Text style={styles.noProfileEmoji}>🛒</Text>
        <Text style={styles.noProfileTitle}>No profile set up</Text>
        <Text style={styles.noProfileText}>
          Set up your profile and generate a weekly plan to see your personalised grocery list.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🛒 Grocery List</Text>
          <Text style={styles.headerSubtitle}>
            Based on your weekly meal plan
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadData}>
          <Text style={styles.refreshBtnText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Progress card */}
      {totalItems > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>Shopping Progress</Text>
              <Text style={styles.progressText}>
                {checkedCount} of {totalItems} items collected
              </Text>
            </View>
            <View style={styles.progressPercentContainer}>
              <Text style={styles.progressPercent}>{progressPercent}%</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercent}%` },
                progressPercent === 100 && styles.progressComplete,
              ]}
            />
          </View>
          <View style={styles.progressActions}>
            {checkedCount > 0 && checkedCount < totalItems && (
              <TouchableOpacity onPress={handleClearChecked}>
                <Text style={styles.clearText}>Clear all</Text>
              </TouchableOpacity>
            )}
            {checkedCount < totalItems && (
              <TouchableOpacity onPress={handleCheckAll}>
                <Text style={styles.checkAllText}>Check all</Text>
              </TouchableOpacity>
            )}
            {progressPercent === 100 && (
              <Text style={styles.completeText}>✅ All done!</Text>
            )}
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <Text style={styles.loadingEmoji}>🔄</Text>
          <Text style={styles.loadingText}>Building your grocery list…</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 32 }}>
          {Object.entries(groceryList).map(([category, items]) => {
            const isCollapsed = collapsedCategories.has(category);
            const categoryKeys = items.map((item) => `${category}:${item}`);
            const categoryChecked = categoryKeys.filter((k) => checkedItems.has(k)).length;
            const allCategoryChecked = categoryChecked === items.length;

            return (
              <View key={category} style={styles.categoryCard}>
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category)}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryLeft}>
                    <Text style={styles.categoryIcon}>
                      {CATEGORY_ICONS[category] ?? '🛒'}
                    </Text>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    <View style={[styles.categoryBadge, allCategoryChecked && styles.categoryBadgeComplete]}>
                      <Text style={[styles.categoryBadgeText, allCategoryChecked && styles.categoryBadgeTextComplete]}>
                        {categoryChecked}/{items.length}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.categoryActions}>
                    <TouchableOpacity
                      style={styles.selectAllBtn}
                      onPress={() => toggleAllInCategory(category, items)}
                    >
                      <Text style={styles.selectAllText}>
                        {allCategoryChecked ? 'Uncheck' : 'All'}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.expandIcon}>{isCollapsed ? '▼' : '▲'}</Text>
                  </View>
                </TouchableOpacity>
                {!isCollapsed && items.map((item) => {
                  const key = `${category}:${item}`;
                  const checked = checkedItems.has(key);
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[styles.itemRow, checked && styles.itemRowChecked]}
                      onPress={() => toggleItem(key)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                        {checked && <Text style={styles.checkMark}>✓</Text>}
                      </View>
                      <Text
                        style={[
                          styles.itemText,
                          checked && styles.itemTextChecked,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}

          {totalItems === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyTitle}>No ingredients found</Text>
              <Text style={styles.emptyText}>
                Save a weekly plan first to auto-generate your grocery list.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const PRIMARY = '#FF6B35';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    backgroundColor: PRIMARY,
    padding: 20,
    paddingTop: 48,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  headerSubtitle: { fontSize: 13, color: '#fff', opacity: 0.85 },
  refreshBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  refreshBtnText: { color: PRIMARY, fontWeight: '700', fontSize: 13 },
  progressContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  progressText: { fontSize: 13, color: '#666', marginTop: 2 },
  progressPercentContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E8E8E8',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  progressComplete: {
    backgroundColor: '#2E7D32',
  },
  progressActions: {
    flexDirection: 'row',
    gap: 16,
  },
  clearText: { fontSize: 13, color: '#F44336', fontWeight: '600' },
  checkAllText: { fontSize: 13, color: PRIMARY, fontWeight: '600' },
  completeText: { fontSize: 13, color: '#2E7D32', fontWeight: '600' },
  list: { flex: 1, marginTop: 8 },
  categoryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  categoryBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryBadgeComplete: {
    backgroundColor: '#E8F5E9',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
  },
  categoryBadgeTextComplete: {
    color: '#2E7D32',
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
  },
  selectAllText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1565C0',
  },
  expandIcon: {
    fontSize: 12,
    color: '#999',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemRowChecked: {
    backgroundColor: '#FAFFFE',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#CCC',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  checkMark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  itemText: { fontSize: 15, color: '#333', textTransform: 'capitalize' },
  itemTextChecked: { textDecorationLine: 'line-through', color: '#AAA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  loadingEmoji: { fontSize: 36, marginBottom: 12 },
  loadingText: { fontSize: 16, color: '#888' },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#555' },
  emptyText: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 20, marginTop: 4 },
  noProfile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FAFAFA',
  },
  noProfileEmoji: { fontSize: 64, marginBottom: 16 },
  noProfileTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  noProfileText: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22 },
});
