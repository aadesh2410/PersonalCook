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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const p = await StorageService.getUserProfile();
    setProfile(p);
    if (p?.isSetupComplete) {
      const savedPlan = await StorageService.getWeeklyPlan();
      if (savedPlan && savedPlan.days.length === 7) {
        // Reconstruct PlanDay objects from saved IDs
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

    // Avoid already used dishes in the plan
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
        <Text style={styles.noProfileEmoji}>👤</Text>
        <Text style={styles.noProfileTitle}>Profile not set up</Text>
        <Text style={styles.noProfileText}>
          Please go to the Profile tab and save your details to generate a personalised weekly meal plan.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>📅 Weekly Plan</Text>
          <Text style={styles.headerSubtitle}>
            7-day meals for {profile.name} · {profile.region.charAt(0).toUpperCase() + profile.region.slice(1).replace('-', ' ')}
          </Text>
        </View>
        <TouchableOpacity style={styles.shuffleAllBtn} onPress={handleShuffle}>
          <Text style={styles.shuffleAllBtnText}>🔀 Shuffle All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 32 }}>
        {planDays.map((day, idx) => (
          <View key={day.date} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayName}>{DAY_NAMES[idx]}</Text>
              <Text style={styles.dayDate}>{formatDate(day.date)}</Text>
            </View>

            {(['breakfast', 'lunch', 'dinner'] as MealSlot[]).map((slot) => {
              const SLOT_ICONS: Record<MealSlot, string> = {
                breakfast: '🌅',
                lunch: '☀️',
                dinner: '🌙',
              };
              const dish = day[slot];
              return (
                <View key={slot} style={styles.mealRow}>
                  <Text style={styles.mealIcon}>{SLOT_ICONS[slot]}</Text>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{dish.name}</Text>
                    {dish.preparationTime && (
                      <Text style={styles.mealMeta}>⏱️ {dish.preparationTime} min</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.shuffleBtn}
                    onPress={() => handleShuffleMeal(idx, slot)}
                  >
                    <Text style={styles.shuffleBtnText}>🔄</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
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
  shuffleAllBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shuffleAllBtnText: { color: PRIMARY, fontWeight: '700', fontSize: 13 },
  list: { flex: 1 },
  dayCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    backgroundColor: '#FFF5F3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0D6',
  },
  dayName: { fontSize: 16, fontWeight: 'bold', color: PRIMARY },
  dayDate: { fontSize: 13, color: '#888' },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  mealIcon: { fontSize: 22, marginRight: 12 },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 15, fontWeight: '600', color: '#333' },
  mealMeta: { fontSize: 12, color: '#999', marginTop: 2 },
  shuffleBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  shuffleBtnText: { fontSize: 18 },
  saveBtn: {
    backgroundColor: '#4CAF50',
    margin: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
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
