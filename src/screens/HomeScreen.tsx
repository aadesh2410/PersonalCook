// Home Screen - Meal Recommendations
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { MealCard } from '../components/MealCard';
import { FoodItem, MealHistory, UserProfile, REGION_LABELS } from '../types';

type MainMealType = 'breakfast' | 'lunch' | 'dinner';
import { StorageService } from '../services/storageService';
import { RecommendationService } from '../services/recommendationService';

const getGreeting = (): { text: string; emoji: string; mealHint: string } => {
  const hour = new Date().getHours();
  if (hour < 6) return { text: 'Good Night', emoji: '🌙', mealHint: 'Plan tomorrow\'s meals' };
  if (hour < 12) return { text: 'Good Morning', emoji: '🌅', mealHint: 'Time for a delicious breakfast!' };
  if (hour < 17) return { text: 'Good Afternoon', emoji: '☀️', mealHint: 'What\'s cooking for lunch?' };
  if (hour < 21) return { text: 'Good Evening', emoji: '🌆', mealHint: 'Let\'s plan dinner!' };
  return { text: 'Good Night', emoji: '🌙', mealHint: 'Plan tomorrow\'s meals' };
};

export const HomeScreen: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [mealHistory, setMealHistory] = useState<MealHistory[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState({
    breakfast: [] as FoodItem[],
    lunch: [] as FoodItem[],
    dinner: [] as FoodItem[],
  });
  const [selectedItems, setSelectedItems] = useState<Record<MainMealType, Set<string>>>({
    breakfast: new Set(),
    lunch: new Set(),
    dinner: new Set(),
  });
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<MainMealType>>(
    new Set(['breakfast', 'lunch', 'dinner'])
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [items, history, userProfile] = await Promise.all([
        StorageService.getFoodItems(),
        StorageService.getMealHistory(),
        StorageService.getUserProfile(),
      ]);
      setFoodItems(items);
      setMealHistory(history);
      setProfile(userProfile);

      const recs = RecommendationService.getAllRecommendations(items, history, userProfile);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSelectMeal = (item: FoodItem, mealType: MainMealType) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      const set = new Set(updated[mealType]);
      if (set.has(item.id)) {
        set.delete(item.id);
      } else {
        set.add(item.id);
      }
      updated[mealType] = set;
      return updated;
    });
  };

  const handleConfirmMeals = async (mealType: MainMealType) => {
    const selectedIds = selectedItems[mealType];
    if (selectedIds.size === 0) {
      Alert.alert('Please select at least one meal first');
      return;
    }

    const mealTypeItems = recommendations[mealType];
    const selected = mealTypeItems.filter((item) => selectedIds.has(item.id));

    try {
      for (const selectedItem of selected) {
        const newHistory: MealHistory = {
          id: `history-${Date.now()}-${selectedItem.id}`,
          foodItemId: selectedItem.id,
          foodItemName: selectedItem.name,
          mealType,
          date: new Date().toISOString(),
        };
        await StorageService.addMealHistory(newHistory);
      }

      const names = selected.map((s) => s.name).join(', ');
      Alert.alert('Success! 🎉', `${names} marked as prepared!`);

      setSelectedItems((prev) => ({
        ...prev,
        [mealType]: new Set(),
      }));
      await loadData();
    } catch (error) {
      console.error('Error confirming meals:', error);
      Alert.alert('Error', 'Failed to save meals');
    }
  };

  const toggleSection = (mealType: MainMealType) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(mealType)) {
        next.delete(mealType);
      } else {
        next.add(mealType);
      }
      return next;
    });
  };

  const renderMealSection = (
    title: string,
    emoji: string,
    mealType: MainMealType,
    items: FoodItem[]
  ) => {
    const isExpanded = expandedSections.has(mealType);
    const selectedCount = selectedItems[mealType].size;

    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(mealType)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionEmoji}>{emoji}</Text>
            <Text style={styles.sectionTitle}>{title}</Text>
            {selectedCount > 0 && (
              <View style={styles.selectionBadge}>
                <Text style={styles.selectionBadgeText}>{selectedCount} selected</Text>
              </View>
            )}
          </View>
          <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {isExpanded && (
          <>
            {items.length === 0 ? (
              <View style={styles.emptySection}>
                <Text style={styles.emptySectionEmoji}>🍽️</Text>
                <Text style={styles.emptySectionText}>No recommendations yet</Text>
                <Text style={styles.emptySectionHint}>Set up your profile to get started!</Text>
              </View>
            ) : (
              <>
                <Text style={styles.multiSelectHint}>
                  Tap to select • Multi-select supported
                </Text>
                {items.map((item) => (
                  <MealCard
                    key={item.id}
                    foodItem={item}
                    onSelect={(i) => handleSelectMeal(i, mealType)}
                    selected={selectedItems[mealType].has(item.id)}
                  />
                ))}
              </>
            )}
            {selectedCount > 0 && (
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleConfirmMeals(mealType)}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmButtonText}>
                  ✓ Mark {selectedCount} {selectedCount === 1 ? 'meal' : 'meals'} as Prepared
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    );
  };

  const greeting = getGreeting();
  const userName = profile?.isSetupComplete ? profile.name : '';
  const regionLabel = profile?.isSetupComplete
    ? REGION_LABELS[profile.region]
    : '';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#FF6B35']}
          tintColor="#FF6B35"
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerGreeting}>
            <Text style={styles.greetingEmoji}>{greeting.emoji}</Text>
            <View>
              <Text style={styles.greetingText}>
                {greeting.text}{userName ? `, ${userName}` : ''}!
              </Text>
              <Text style={styles.greetingHint}>{greeting.mealHint}</Text>
            </View>
          </View>
        </View>
        {profile?.isSetupComplete && (
          <View style={styles.headerBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {profile.vegType === 'veg' ? '🥦 Veg' : profile.vegType === 'eggetarian' ? '🥚 Eggetarian' : '🍗 Non-Veg'}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>📍 {regionLabel}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🌶️ {profile.spiceLevel}</Text>
            </View>
          </View>
        )}
      </View>

      {!profile?.isSetupComplete && (
        <View style={styles.profileBanner}>
          <Text style={styles.profileBannerEmoji}>👋</Text>
          <View style={styles.profileBannerContent}>
            <Text style={styles.profileBannerTitle}>Welcome to PersonalCook!</Text>
            <Text style={styles.profileBannerText}>
              Set up your profile to get personalised regional meal recommendations.
            </Text>
          </View>
        </View>
      )}

      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{recommendations.breakfast.length}</Text>
          <Text style={styles.statLabel}>Breakfast</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{recommendations.lunch.length}</Text>
          <Text style={styles.statLabel}>Lunch</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{recommendations.dinner.length}</Text>
          <Text style={styles.statLabel}>Dinner</Text>
        </View>
      </View>

      {renderMealSection('Breakfast', '🌅', 'breakfast', recommendations.breakfast)}
      {renderMealSection('Lunch', '☀️', 'lunch', recommendations.lunch)}
      {renderMealSection('Dinner', '🌙', 'dinner', recommendations.dinner)}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

const PRIMARY = '#FF6B35';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: PRIMARY,
    padding: 20,
    paddingTop: 48,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerGreeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greetingEmoji: {
    fontSize: 36,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  greetingHint: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.85,
    marginTop: 2,
  },
  headerBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  profileBanner: {
    backgroundColor: '#FFF3E0',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileBannerEmoji: {
    fontSize: 32,
  },
  profileBannerContent: {
    flex: 1,
  },
  profileBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E65100',
    marginBottom: 4,
  },
  profileBannerText: {
    color: '#E65100',
    fontSize: 13,
    lineHeight: 18,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E0E0E0',
  },
  section: {
    marginTop: 20,
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sectionEmoji: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  selectionBadge: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  selectionBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  expandIcon: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
  multiSelectHint: {
    fontSize: 12,
    color: '#999',
    marginLeft: 20,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  emptySection: {
    marginHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
  },
  emptySectionEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptySectionText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySectionHint: {
    color: '#999',
    fontSize: 13,
    marginTop: 4,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
