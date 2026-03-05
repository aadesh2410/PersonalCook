// Weekly Meal Planner Screen
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FoodItem, UserProfile, WeeklyPlan, DailyMealPlan } from '../types';
import { StorageService } from '../services/storageService';
import { RecommendationService } from '../services/recommendationService';
import { getDishesByRegion } from '../data/regionalDishes';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_FULL_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type MealSlot = 'breakfast' | 'lunch' | 'dinner';

interface PlanDay {
  date: string;
  breakfast: FoodItem;
  lunch: FoodItem;
  dinner: FoodItem;
}

export const WeeklyPlannerScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [planDays, setPlanDays] = useState<PlanDay[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const p = await StorageService.getUserProfile();
    setProfile(p);
    if (p?.isSetupComplete) {
      const savedPlan = await StorageService.getWeeklyPlan();
      if (savedPlan && savedPlan.days.length === 7) {
        const pool = getDishesByRegion(p.region, p.vegType);
        const days: PlanDay[] = savedPlan.days.map((d) => ({
          date: d.date,
          breakfast: pool.find((f) => f.id === d.breakfast) ?? pool[0],
          lunch: pool.find((f) => f.id === d.lunch) ?? pool[0],
          dinner: pool.find((f) => f.id === d.dinner) ?? pool[0],
        }));
        setPlanDays(days);
      } else {
        generatePlan(p);
      }
    }
  };

  const generatePlan = useCallback((p: UserProfile) => {
    const days = RecommendationService.generateWeeklyPlan(p);
    setPlanDays(days);
  }, []);

  const handleShuffle = () => {
    if (!profile) return;
    generatePlan(profile);
  };

  const handleShuffleMeal = (dayIndex: number, slot: MealSlot) => {
    if (!profile) return;
    const pool = getDishesByRegion(profile.region, profile.vegType).filter((d) =>
      d.mealType.includes(slot)
    );
    if (pool.length === 0) return;

    const usedIds = new Set(
      planDays.flatMap((d) => [d.breakfast.id, d.lunch.id, d.dinner.id])
    );
    const fresh = pool.filter((d) => !usedIds.has(d.id));
    const source = fresh.length > 0 ? fresh : pool;
    const pick = source[Math.floor(Math.random() * source.length)];

    const updated = [...planDays];
    updated[dayIndex] = { ...updated[dayIndex], [slot]: pick };
    setPlanDays(updated);
  };

  const handleSave = async () => {
    if (planDays.length === 0) return;
    setSaving(true);
    try {
      const plan: WeeklyPlan = {
        id: `plan-${Date.now()}`,
        weekStartDate: planDays[0].date,
        days: planDays.map<DailyMealPlan>((d) => ({
          date: d.date,
          breakfast: d.breakfast.id,
          lunch: d.lunch.id,
          dinner: d.dinner.id,
        })),
      };
      await StorageService.saveWeeklyPlan(plan);
      Alert.alert('Saved! ✅', 'Weekly meal plan saved successfully.');
    } catch {
      Alert.alert('Error', 'Failed to save plan.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  if (!profile?.isSetupComplete) {
    return (
      <View style={styles.noProfile}>
        <Text style={styles.noProfileEmoji}>📅</Text>
        <Text style={styles.noProfileTitle}>Profile not set up</Text>
        <Text style={styles.noProfileText}>
          Please go to the Profile tab and save your details to generate a personalised weekly meal plan.
        </Text>
      </View>
    );
  }

  const SLOT_CONFIG: { slot: MealSlot; icon: string; label: string; color: string }[] = [
    { slot: 'breakfast', icon: '🌅', label: 'Breakfast', color: '#FF9800' },
    { slot: 'lunch', icon: '☀️', label: 'Lunch', color: '#4CAF50' },
    { slot: 'dinner', icon: '🌙', label: 'Dinner', color: '#5C6BC0' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>📅 Weekly Plan</Text>
          <Text style={styles.headerSubtitle}>
            7-day meals for {profile.name}
          </Text>
        </View>
        <TouchableOpacity style={styles.shuffleAllBtn} onPress={handleShuffle}>
          <Text style={styles.shuffleAllBtnText}>🔀 New Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Day Selector */}
      <View style={styles.daySelectorContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daySelector}
        >
          {planDays.map((day, idx) => {
            const isActive = selectedDay === idx;
            const isToday = day.date === new Date().toISOString().split('T')[0];
            return (
              <TouchableOpacity
                key={day.date}
                style={[
                  styles.dayTab,
                  isActive && styles.dayTabActive,
                  isToday && !isActive && styles.dayTabToday,
                ]}
                onPress={() => setSelectedDay(idx)}
              >
                <Text style={[styles.dayTabName, isActive && styles.dayTabNameActive]}>
                  {DAY_NAMES[idx]}
                </Text>
                <Text style={[styles.dayTabDate, isActive && styles.dayTabDateActive]}>
                  {formatDate(day.date)}
                </Text>
                {isToday && (
                  <View style={[styles.todayDot, isActive && styles.todayDotActive]} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Selected Day Detail */}
        {planDays.length > 0 && (
          <View style={styles.dayDetail}>
            <Text style={styles.dayDetailTitle}>
              {DAY_FULL_NAMES[selectedDay]} · {formatDate(planDays[selectedDay].date)}
            </Text>

            {SLOT_CONFIG.map(({ slot, icon, label, color }) => {
              const dish = planDays[selectedDay][slot];
              return (
                <View key={slot} style={styles.mealCard}>
                  <View style={[styles.mealCardAccent, { backgroundColor: color }]} />
                  <View style={styles.mealCardContent}>
                    <View style={styles.mealCardHeader}>
                      <View style={[styles.mealIconContainer, { backgroundColor: color + '18' }]}>
                        <Text style={styles.mealIcon}>{icon}</Text>
                      </View>
                      <View style={styles.mealHeaderInfo}>
                        <Text style={[styles.mealSlotLabel, { color }]}>{label}</Text>
                        <Text style={styles.mealName}>{dish.name}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.shuffleBtn}
                        onPress={() => handleShuffleMeal(selectedDay, slot)}
                      >
                        <Text style={styles.shuffleBtnText}>🔄</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.mealMeta}>
                      {dish.preparationTime != null && (
                        <View style={styles.mealMetaChip}>
                          <Text style={styles.mealMetaText}>⏱️ {dish.preparationTime} min</Text>
                        </View>
                      )}
                      {dish.spiceLevel && (
                        <View style={styles.mealMetaChip}>
                          <Text style={styles.mealMetaText}>
                            {dish.spiceLevel === 'low' ? '🟢 Mild' : dish.spiceLevel === 'medium' ? '🟡 Medium' : '🔴 Spicy'}
                          </Text>
                        </View>
                      )}
                      {dish.difficulty && (
                        <View style={styles.mealMetaChip}>
                          <Text style={styles.mealMetaText}>
                            {dish.difficulty.charAt(0).toUpperCase() + dish.difficulty.slice(1)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Overview of all days */}
        <Text style={styles.overviewTitle}>📋 Week Overview</Text>
        {planDays.map((day, idx) => (
          <TouchableOpacity
            key={day.date}
            style={[styles.overviewCard, selectedDay === idx && styles.overviewCardActive]}
            onPress={() => setSelectedDay(idx)}
            activeOpacity={0.7}
          >
            <View style={styles.overviewLeft}>
              <Text style={[styles.overviewDay, selectedDay === idx && styles.overviewDayActive]}>
                {DAY_NAMES[idx]}
              </Text>
              <Text style={styles.overviewDate}>{formatDate(day.date)}</Text>
            </View>
            <View style={styles.overviewMeals}>
              <Text style={styles.overviewMealText} numberOfLines={1}>
                {day.breakfast.name}
              </Text>
              <Text style={styles.overviewDivider}>·</Text>
              <Text style={styles.overviewMealText} numberOfLines={1}>
                {day.lunch.name}
              </Text>
              <Text style={styles.overviewDivider}>·</Text>
              <Text style={styles.overviewMealText} numberOfLines={1}>
                {day.dinner.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>
            {saving ? 'Saving…' : '💾 Save Weekly Plan'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  shuffleAllBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shuffleAllBtnText: { color: PRIMARY, fontWeight: '700', fontSize: 13 },
  daySelectorContainer: {
    marginTop: 16,
    marginBottom: 4,
  },
  daySelector: {
    paddingHorizontal: 12,
    gap: 8,
  },
  dayTab: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    minWidth: 64,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  dayTabActive: {
    backgroundColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
    elevation: 4,
  },
  dayTabToday: {
    borderWidth: 2,
    borderColor: PRIMARY,
  },
  dayTabName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  dayTabNameActive: {
    color: '#fff',
  },
  dayTabDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  dayTabDateActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PRIMARY,
    marginTop: 4,
  },
  todayDotActive: {
    backgroundColor: '#fff',
  },
  list: { flex: 1 },
  dayDetail: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  dayDetailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  mealCardAccent: {
    width: 5,
  },
  mealCardContent: {
    flex: 1,
    padding: 14,
  },
  mealCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealIcon: { fontSize: 20 },
  mealHeaderInfo: {
    flex: 1,
  },
  mealSlotLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mealName: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 2 },
  shuffleBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  shuffleBtnText: { fontSize: 18 },
  mealMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  mealMetaChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  mealMetaText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  overviewCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  overviewCardActive: {
    borderColor: PRIMARY,
    backgroundColor: '#FFF5F3',
  },
  overviewLeft: {
    width: 60,
    alignItems: 'center',
  },
  overviewDay: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  overviewDayActive: {
    color: PRIMARY,
  },
  overviewDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 1,
  },
  overviewMeals: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    gap: 4,
  },
  overviewMealText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  overviewDivider: {
    color: '#CCC',
    fontSize: 12,
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
    margin: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
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
