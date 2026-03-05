// History Screen - View meal preparation history
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MealHistory } from '../types';
import { StorageService } from '../services/storageService';

export const HistoryScreen: React.FC = () => {
  const [mealHistory, setMealHistory] = useState<MealHistory[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAllInGroup = (meals: MealHistory[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      meals.forEach((m) => next.add(m.id));
      return next;
    });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    Alert.alert(
      'Clear Selected',
      `Remove ${selectedIds.size} history ${selectedIds.size === 1 ? 'entry' : 'entries'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Get all history, filter out selected, then save back
              const history = await StorageService.getMealHistory();
              const remaining = history.filter((m) => !selectedIds.has(m.id));
              // We need to save remaining history using the internal method
              const AsyncStorage = require('@react-native-async-storage/async-storage').default;
              await AsyncStorage.setItem('@PersonalCook:mealHistory', JSON.stringify(remaining));
              setSelectedIds(new Set());
              setSelectionMode(false);
              await loadHistory();
              Alert.alert('Done', 'Selected entries removed');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove entries');
            }
          },
        },
      ]
    );
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const getMealColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '#FF9800';
      case 'lunch':
        return '#4CAF50';
      case 'dinner':
        return '#5C6BC0';
      default:
        return '#999';
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

  const totalMeals = mealHistory.length;
  const todayMeals = mealHistory.filter(
    (m) => new Date(m.date).toDateString() === new Date().toDateString()
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>🕐 Meal History</Text>
          <Text style={styles.headerSubtitle}>{totalMeals} meals recorded</Text>
        </View>
        {totalMeals > 0 && (
          <TouchableOpacity
            style={[styles.selectBtn, selectionMode && styles.selectBtnActive]}
            onPress={() => {
              setSelectionMode(!selectionMode);
              setSelectedIds(new Set());
            }}
          >
            <Text style={[styles.selectBtnText, selectionMode && styles.selectBtnTextActive]}>
              {selectionMode ? '✕ Cancel' : '☑ Select'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Stats */}
      {totalMeals > 0 && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalMeals}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{todayMeals}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{Object.keys(groupedHistory).length}</Text>
            <Text style={styles.statLabel}>Days</Text>
          </View>
        </View>
      )}

      {/* Bulk Actions */}
      {selectionMode && selectedIds.size > 0 && (
        <View style={styles.bulkActions}>
          <TouchableOpacity style={styles.bulkDeleteBtn} onPress={handleDeleteSelected}>
            <Text style={styles.bulkDeleteText}>🗑 Remove {selectedIds.size} selected</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF6B35']}
            tintColor="#FF6B35"
          />
        }
      >
        {Object.keys(groupedHistory).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyTitle}>No meal history yet</Text>
            <Text style={styles.emptyText}>
              Start marking meals as prepared on the Today tab to build your cooking history!
            </Text>
          </View>
        ) : (
          Object.keys(groupedHistory).map((date) => (
            <View key={date} style={styles.dateSection}>
              <View style={styles.dateHeaderRow}>
                <Text style={styles.dateHeader}>{date}</Text>
                <View style={styles.dateInfo}>
                  <Text style={styles.dateCount}>
                    {groupedHistory[date].length} meal{groupedHistory[date].length !== 1 ? 's' : ''}
                  </Text>
                  {selectionMode && (
                    <TouchableOpacity
                      style={styles.selectGroupBtn}
                      onPress={() => selectAllInGroup(groupedHistory[date])}
                    >
                      <Text style={styles.selectGroupText}>Select all</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              {groupedHistory[date].map((meal) => {
                const mealColor = getMealColor(meal.mealType);
                const isSelected = selectedIds.has(meal.id);
                return (
                  <TouchableOpacity
                    key={meal.id}
                    style={[
                      styles.mealCard,
                      isSelected && styles.mealCardSelected,
                    ]}
                    onPress={() => selectionMode && toggleSelectItem(meal.id)}
                    activeOpacity={selectionMode ? 0.7 : 1}
                    disabled={!selectionMode}
                  >
                    {selectionMode && (
                      <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                        {isSelected && <Text style={styles.checkMark}>✓</Text>}
                      </View>
                    )}
                    <View style={[styles.mealIconContainer, { backgroundColor: mealColor + '18' }]}>
                      <Text style={styles.mealIcon}>
                        {getMealIcon(meal.mealType)}
                      </Text>
                    </View>
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealName}>{meal.foodItemName}</Text>
                      <View style={styles.mealMetaRow}>
                        <View style={[styles.mealTypeBadge, { backgroundColor: mealColor + '18' }]}>
                          <Text style={[styles.mealTypeText, { color: mealColor }]}>
                            {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                          </Text>
                        </View>
                        <Text style={styles.mealTime}>{formatTime(meal.date)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>
    </View>
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
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.85,
  },
  selectBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectBtnActive: {
    backgroundColor: '#fff',
  },
  selectBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  selectBtnTextActive: {
    color: PRIMARY,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  bulkActions: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  bulkDeleteBtn: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  bulkDeleteText: {
    color: '#C62828',
    fontSize: 15,
    fontWeight: '600',
  },
  list: {
    flex: 1,
    marginTop: 8,
  },
  dateSection: {
    marginTop: 16,
  },
  dateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateCount: {
    fontSize: 12,
    color: '#999',
  },
  selectGroupBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
  },
  selectGroupText: {
    fontSize: 11,
    color: '#1565C0',
    fontWeight: '600',
  },
  mealCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  mealCardSelected: {
    borderColor: PRIMARY,
    backgroundColor: '#FFF5F3',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#CCC',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  checkMark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  mealIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealIcon: {
    fontSize: 22,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  mealMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mealTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  mealTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mealTime: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
