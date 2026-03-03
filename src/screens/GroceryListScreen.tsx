// Grocery List Screen – auto-generated from the weekly plan
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FoodItem, UserProfile, WeeklyPlan } from '../types';
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
        // Build dish list from the saved weekly plan
        const pool = getDishesByRegion(p.region, p.vegType);
        const ids = plan.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner]);
        dishes = ids
          .map((id) => pool.find((f) => f.id === id))
          .filter((f): f is FoodItem => f !== undefined);
      } else {
        // Generate a fresh plan if none is saved
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

  const handleClearChecked = () => {
    setCheckedItems(new Set());
  };

  const totalItems = Object.values(groceryList).reduce((s, arr) => s + arr.length, 0);
  const checkedCount = checkedItems.size;

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

      {/* Progress bar */}
      {totalItems > 0 && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {checkedCount} / {totalItems} items collected
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(checkedCount / totalItems) * 100}%` },
              ]}
            />
          </View>
          {checkedCount > 0 && (
            <TouchableOpacity onPress={handleClearChecked}>
              <Text style={styles.clearText}>Clear checks</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <Text style={styles.loadingText}>Building your grocery list…</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 32 }}>
          {Object.entries(groceryList).map(([category, items]) => (
            <View key={category} style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>
                {CATEGORY_ICONS[category] ?? '🛒'} {category}
              </Text>
              {items.map((item) => {
                const key = `${category}:${item}`;
                const checked = checkedItems.has(key);
                return (
                  <TouchableOpacity
                    key={item}
                    style={styles.itemRow}
                    onPress={() => toggleItem(key)}
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
          ))}

          {totalItems === 0 && (
            <View style={styles.center}>
              <Text style={styles.emptyText}>
                No ingredients found. Save a weekly plan first.
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: PRIMARY,
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  headerSubtitle: { fontSize: 13, color: '#fff', opacity: 0.9 },
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
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  progressText: { fontSize: 14, color: '#333', fontWeight: '600', marginBottom: 8 },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 4 },
  clearText: { fontSize: 13, color: PRIMARY, textDecorationLine: 'underline' },
  list: { flex: 1 },
  categoryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
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
  loadingText: { fontSize: 16, color: '#888' },
  emptyText: { fontSize: 15, color: '#999', textAlign: 'center', lineHeight: 22 },
  noProfile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f5f5f5',
  },
  noProfileEmoji: { fontSize: 64, marginBottom: 16 },
  noProfileTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  noProfileText: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22 },
});
