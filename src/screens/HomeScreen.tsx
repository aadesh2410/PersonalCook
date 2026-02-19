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
import { FoodItem, MealHistory, MealType } from '../types';
import { StorageService } from '../services/storageService';
import { RecommendationService } from '../services/recommendationService';

export const HomeScreen: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [mealHistory, setMealHistory] = useState<MealHistory[]>([]);
  const [recommendations, setRecommendations] = useState({
    breakfast: [] as FoodItem[],
    lunch: [] as FoodItem[],
    dinner: [] as FoodItem[],
  });
  const [selectedItems, setSelectedItems] = useState({
    breakfast: null as FoodItem | null,
    lunch: null as FoodItem | null,
    dinner: null as FoodItem | null,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const items = await StorageService.getFoodItems();
      const history = await StorageService.getMealHistory();
      setFoodItems(items);
      setMealHistory(history);
      
      // Get recommendations
      const recs = RecommendationService.getAllRecommendations(items, history);
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

  const handleSelectMeal = (item: FoodItem, mealType: MealType) => {
    setSelectedItems({
      ...selectedItems,
      [mealType]: selectedItems[mealType]?.id === item.id ? null : item,
    });
  };

  const handleConfirmMeal = async (mealType: MealType) => {
    const selectedItem = selectedItems[mealType];
    if (!selectedItem) {
      Alert.alert('Please select a meal first');
      return;
    }

    try {
      const newHistory: MealHistory = {
        id: `history-${Date.now()}`,
        foodItemId: selectedItem.id,
        foodItemName: selectedItem.name,
        mealType,
        date: new Date().toISOString(),
      };

      await StorageService.addMealHistory(newHistory);
      Alert.alert('Success', `${selectedItem.name} marked as prepared!`);
      
      // Clear selection and refresh
      setSelectedItems({
        ...selectedItems,
        [mealType]: null,
      });
      await loadData();
    } catch (error) {
      console.error('Error confirming meal:', error);
      Alert.alert('Error', 'Failed to save meal');
    }
  };

  const renderMealSection = (
    title: string,
    mealType: MealType,
    items: FoodItem[]
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item) => (
        <MealCard
          key={item.id}
          foodItem={item}
          onSelect={(item) => handleSelectMeal(item, mealType)}
          selected={selectedItems[mealType]?.id === item.id}
        />
      ))}
      {selectedItems[mealType] && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => handleConfirmMeal(mealType)}
        >
          <Text style={styles.confirmButtonText}>
            ✓ Mark "{selectedItems[mealType]?.name}" as Prepared
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Recommendations</Text>
        <Text style={styles.headerSubtitle}>
          Select and mark what you prepare
        </Text>
      </View>

      {renderMealSection('🌅 Breakfast', 'breakfast', recommendations.breakfast)}
      {renderMealSection('☀️ Lunch', 'lunch', recommendations.lunch)}
      {renderMealSection('🌙 Dinner', 'dinner', recommendations.dinner)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF6B35',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
    marginBottom: 12,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
