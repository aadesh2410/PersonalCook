// History Screen - View meal preparation history
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { MealHistory } from '../types';
import { StorageService } from '../services/storageService';

export const HistoryScreen: React.FC = () => {
  const [mealHistory, setMealHistory] = useState<MealHistory[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await StorageService.getMealHistory();
      // Sort by date (most recent first)
      const sorted = history.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setMealHistory(sorted);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '☀️';
      case 'dinner':
        return '🌙';
      default:
        return '🍽️';
    }
  };

  // Group history by date
  const groupedHistory = mealHistory.reduce((groups, meal) => {
    const date = formatDate(meal.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(meal);
    return groups;
  }, {} as Record<string, MealHistory[]>);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meal History</Text>
        <Text style={styles.headerSubtitle}>
          {mealHistory.length} meals recorded
        </Text>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {Object.keys(groupedHistory).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No meal history yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start marking meals as prepared to see them here
            </Text>
          </View>
        ) : (
          Object.keys(groupedHistory).map((date) => (
            <View key={date} style={styles.dateSection}>
              <Text style={styles.dateHeader}>{date}</Text>
              {groupedHistory[date].map((meal) => (
                <View key={meal.id} style={styles.mealCard}>
                  <Text style={styles.mealIcon}>
                    {getMealIcon(meal.mealType)}
                  </Text>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{meal.foodItemName}</Text>
                    <Text style={styles.mealType}>
                      {meal.mealType.charAt(0).toUpperCase() +
                        meal.mealType.slice(1)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
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
  list: {
    flex: 1,
  },
  dateSection: {
    marginTop: 16,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 16,
    marginBottom: 8,
  },
  mealCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  mealType: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
