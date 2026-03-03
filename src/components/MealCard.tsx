// Meal Card Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FoodItem } from '../types';

interface MealCardProps {
  foodItem: FoodItem;
  onSelect: (item: FoodItem) => void;
  selected?: boolean;
}

const VEG_DOT: Record<string, string> = {
  veg: '🟢',
  eggetarian: '🟡',
  'non-veg': '🔴',
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '⭐ Easy',
  medium: '⭐⭐ Medium',
  hard: '⭐⭐⭐ Hard',
};

export const MealCard: React.FC<MealCardProps> = ({ foodItem, onSelect, selected }) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={() => onSelect(foodItem)}
    >
      <View style={styles.topRow}>
        <Text style={styles.name}>{foodItem.name}</Text>
        {foodItem.vegType && (
          <Text style={styles.vegDot}>{VEG_DOT[foodItem.vegType] ?? ''}</Text>
        )}
      </View>
      <View style={styles.metaRow}>
        {foodItem.preparationTime && (
          <Text style={styles.metaChip}>⏱️ {foodItem.preparationTime} min</Text>
        )}
        {foodItem.spiceLevel && (
          <Text style={styles.metaChip}>
            {foodItem.spiceLevel === 'low' ? '🟢 Mild' : foodItem.spiceLevel === 'medium' ? '🟡 Medium' : '🔴 Spicy'}
          </Text>
        )}
        {foodItem.difficulty && (
          <Text style={styles.metaChip}>{DIFFICULTY_LABEL[foodItem.difficulty]}</Text>
        )}
      </View>
      {foodItem.festivalTag && (
        <Text style={styles.festivalTag}>🎉 {foodItem.festivalTag}</Text>
      )}
      <Text style={styles.category}>{foodItem.category}</Text>
      {foodItem.isCustom && <Text style={styles.customBadge}>Custom</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F3',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  vegDot: {
    fontSize: 16,
    marginLeft: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  metaChip: {
    fontSize: 12,
    color: '#555',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  festivalTag: {
    fontSize: 12,
    color: '#E91E63',
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
  customBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: 'bold',
  },
});
