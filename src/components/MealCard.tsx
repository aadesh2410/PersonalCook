// Meal Card Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FoodItem } from '../types';

interface MealCardProps {
  foodItem: FoodItem;
  onSelect: (item: FoodItem) => void;
  selected?: boolean;
}

export const MealCard: React.FC<MealCardProps> = ({ foodItem, onSelect, selected }) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={() => onSelect(foodItem)}
    >
      <Text style={styles.name}>{foodItem.name}</Text>
      {foodItem.preparationTime && (
        <Text style={styles.time}>⏱️ {foodItem.preparationTime} min</Text>
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#666',
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
