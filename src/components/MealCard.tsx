// Meal Card Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FoodItem } from '../types';

interface MealCardProps {
  foodItem: FoodItem;
  onSelect: (item: FoodItem) => void;
  selected?: boolean;
}

const VEG_DOT: Record<string, { emoji: string; label: string; color: string }> = {
  veg: { emoji: '🟢', label: 'Veg', color: '#4CAF50' },
  eggetarian: { emoji: '🟡', label: 'Egg', color: '#FFC107' },
  'non-veg': { emoji: '🔴', label: 'Non-Veg', color: '#F44336' },
};

const DIFFICULTY_LABEL: Record<string, { text: string; color: string }> = {
  easy: { text: 'Easy', color: '#4CAF50' },
  medium: { text: 'Medium', color: '#FF9800' },
  hard: { text: 'Hard', color: '#F44336' },
};

export const MealCard: React.FC<MealCardProps> = ({ foodItem, onSelect, selected }) => {
  const vegInfo = VEG_DOT[foodItem.vegType];

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={() => onSelect(foodItem)}
      activeOpacity={0.7}
    >
      {/* Selection indicator */}
      <View style={[styles.selectionIndicator, selected && styles.selectionIndicatorActive]}>
        {selected && <Text style={styles.checkMark}>✓</Text>}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.topRow}>
          <Text style={[styles.name, selected && styles.nameSelected]}>{foodItem.name}</Text>
          {vegInfo && (
            <View style={[styles.vegBadge, { backgroundColor: vegInfo.color + '18' }]}>
              <Text style={styles.vegEmoji}>{vegInfo.emoji}</Text>
              <Text style={[styles.vegLabel, { color: vegInfo.color }]}>{vegInfo.label}</Text>
            </View>
          )}
        </View>

        <View style={styles.metaRow}>
          {foodItem.preparationTime != null && (
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>⏱️ {foodItem.preparationTime} min</Text>
            </View>
          )}
          {foodItem.spiceLevel && (
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>
                {foodItem.spiceLevel === 'low' ? '🟢 Mild' : foodItem.spiceLevel === 'medium' ? '🟡 Medium' : '🔴 Spicy'}
              </Text>
            </View>
          )}
          {foodItem.difficulty && (
            <View style={[styles.metaChip, { borderColor: DIFFICULTY_LABEL[foodItem.difficulty].color + '40' }]}>
              <Text style={[styles.metaChipText, { color: DIFFICULTY_LABEL[foodItem.difficulty].color }]}>
                {DIFFICULTY_LABEL[foodItem.difficulty].text}
              </Text>
            </View>
          )}
        </View>

        {foodItem.festivalTag && (
          <View style={styles.festivalRow}>
            <Text style={styles.festivalTag}>🎉 {foodItem.festivalTag}</Text>
          </View>
        )}

        <View style={styles.bottomRow}>
          <Text style={styles.category}>{foodItem.category}</Text>
          {foodItem.isCustom && (
            <View style={styles.customBadge}>
              <Text style={styles.customBadgeText}>✨ Custom</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PRIMARY = '#FF6B35';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 0,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: PRIMARY,
    backgroundColor: '#FFF5F3',
    shadowColor: PRIMARY,
    shadowOpacity: 0.15,
  },
  selectionIndicator: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  selectionIndicatorActive: {
    backgroundColor: PRIMARY,
  },
  checkMark: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  nameSelected: {
    color: PRIMARY,
  },
  vegBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    gap: 4,
  },
  vegEmoji: {
    fontSize: 12,
  },
  vegLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  metaChip: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  metaChipText: {
    fontSize: 11,
    color: '#555',
    fontWeight: '500',
  },
  festivalRow: {
    marginBottom: 6,
  },
  festivalTag: {
    fontSize: 12,
    color: '#E91E63',
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
  customBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  customBadgeText: {
    color: '#2E7D32',
    fontSize: 11,
    fontWeight: '700',
  },
});
