// Food Items Management Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { FoodItem, MealType } from '../types';
import { StorageService } from '../services/storageService';

export const ManageScreen: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);
  const [category, setCategory] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editMealTypes, setEditMealTypes] = useState<MealType[]>([]);
  const [editCategory, setEditCategory] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<'all' | MealType>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const items = await StorageService.getFoodItems();
      setFoodItems(items);
    } catch (error) {
      console.error('Error loading food items:', error);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      Alert.alert('Error', 'Please enter a food name');
      return;
    }
    if (selectedMealTypes.length === 0) {
      Alert.alert('Error', 'Please select at least one meal type');
      return;
    }

    try {
      const newItem: FoodItem = {
        id: `custom-${Date.now()}`,
        name: newItemName.trim(),
        mealType: selectedMealTypes,
        region: 'all',
        vegType: 'veg',
        category: category.trim() || 'custom',
        isCustom: true,
      };

      await StorageService.addFoodItem(newItem);
      Alert.alert('Success', 'Food item added successfully!');
      
      // Reset form
      setNewItemName('');
      setSelectedMealTypes([]);
      setCategory('');
      setShowAddModal(false);
      
      await loadData();
    } catch (error) {
      console.error('Error adding food item:', error);
      Alert.alert('Error', 'Failed to add food item');
    }
  };

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${itemName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deleteFoodItem(itemId);
              await loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    Alert.alert(
      'Delete Selected',
      `Are you sure you want to delete ${selectedIds.size} item${selectedIds.size > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              for (const id of selectedIds) {
                await StorageService.deleteFoodItem(id);
              }
              setSelectedIds(new Set());
              setSelectionMode(false);
              await loadData();
              Alert.alert('Done', 'Selected items deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete some items');
            }
          },
        },
      ]
    );
  };

  const handleOpenEdit = (item: FoodItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditMealTypes([...item.mealType]);
    setEditCategory(item.category);
    setShowEditModal(true);
  };

  const handleEditItem = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Please enter a food name');
      return;
    }
    if (editMealTypes.length === 0) {
      Alert.alert('Error', 'Please select at least one meal type');
      return;
    }
    if (!editingItem) return;

    try {
      const updatedItem: FoodItem = {
        ...editingItem,
        name: editName.trim(),
        mealType: editMealTypes,
        category: editCategory.trim() || editingItem.category,
      };

      await StorageService.updateFoodItem(updatedItem);
      Alert.alert('Success', 'Food item updated successfully!');

      setShowEditModal(false);
      setEditingItem(null);
      await loadData();
    } catch (error) {
      console.error('Error updating food item:', error);
      Alert.alert('Error', 'Failed to update food item');
    }
  };

  const toggleMealType = (mealType: MealType) => {
    setSelectedMealTypes((prev) =>
      prev.includes(mealType)
        ? prev.filter((t) => t !== mealType)
        : [...prev, mealType]
    );
  };

  const toggleEditMealType = (mealType: MealType) => {
    setEditMealTypes((prev) =>
      prev.includes(mealType)
        ? prev.filter((t) => t !== mealType)
        : [...prev, mealType]
    );
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(filteredItems.map((item) => item.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const filteredItems = filterType === 'all'
    ? foodItems
    : foodItems.filter((item) => item.mealType.includes(filterType));

  const mealCounts = {
    breakfast: foodItems.filter((item) => item.mealType.includes('breakfast')).length,
    lunch: foodItems.filter((item) => item.mealType.includes('lunch')).length,
    dinner: foodItems.filter((item) => item.mealType.includes('dinner')).length,
  };

  const FILTER_OPTIONS: { value: 'all' | MealType; label: string; emoji: string }[] = [
    { value: 'all', label: 'All', emoji: '📋' },
    { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { value: 'lunch', label: 'Lunch', emoji: '☀️' },
    { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>📝 Manage Foods</Text>
          <Text style={styles.headerSubtitle}>{foodItems.length} items total</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerBtn, selectionMode && styles.headerBtnActive]}
            onPress={() => {
              setSelectionMode(!selectionMode);
              setSelectedIds(new Set());
            }}
          >
            <Text style={[styles.headerBtnText, selectionMode && styles.headerBtnTextActive]}>
              {selectionMode ? '✕ Cancel' : '☑ Select'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>+ Add New</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statEmoji}>🌅</Text>
            <Text style={styles.statText}>{mealCounts.breakfast}</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statEmoji}>☀️</Text>
            <Text style={styles.statText}>{mealCounts.lunch}</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statEmoji}>🌙</Text>
            <Text style={styles.statText}>{mealCounts.dinner}</Text>
          </View>
        </View>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        {FILTER_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.filterChip, filterType === opt.value && styles.filterChipActive]}
            onPress={() => setFilterType(opt.value)}
          >
            <Text style={styles.filterEmoji}>{opt.emoji}</Text>
            <Text style={[styles.filterText, filterType === opt.value && styles.filterTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bulk Actions */}
      {selectionMode && (
        <View style={styles.bulkActions}>
          <TouchableOpacity style={styles.bulkBtn} onPress={selectAll}>
            <Text style={styles.bulkBtnText}>Select All ({filteredItems.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bulkBtn} onPress={deselectAll}>
            <Text style={styles.bulkBtnText}>Deselect All</Text>
          </TouchableOpacity>
          {selectedIds.size > 0 && (
            <TouchableOpacity style={styles.bulkDeleteBtn} onPress={handleBulkDelete}>
              <Text style={styles.bulkDeleteBtnText}>🗑 Delete ({selectedIds.size})</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 24 }}>
        {filteredItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.itemCard,
              selectionMode && selectedIds.has(item.id) && styles.itemCardSelected,
            ]}
            onPress={() => selectionMode ? toggleSelectItem(item.id) : handleOpenEdit(item)}
            activeOpacity={0.7}
          >
            {selectionMode && (
              <View style={[styles.checkbox, selectedIds.has(item.id) && styles.checkboxChecked]}>
                {selectedIds.has(item.id) && <Text style={styles.checkMark}>✓</Text>}
              </View>
            )}
            <View style={styles.itemInfo}>
              <View style={styles.itemNameRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.isCustom && (
                  <View style={styles.customTag}>
                    <Text style={styles.customTagText}>Custom</Text>
                  </View>
                )}
              </View>
              <Text style={styles.itemMealTypes}>
                {item.mealType.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(' · ')}
              </Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            {!selectionMode && (
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleOpenEdit(item)}
                  accessibilityLabel={`Edit ${item.name}`}
                  accessibilityHint="Opens a dialog to edit this food item"
                >
                  <Text style={styles.editButtonText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteItem(item.id, item.name)}
                  accessibilityLabel={`Delete ${item.name}`}
                  accessibilityHint="Asks for confirmation before deleting this food item"
                >
                  <Text style={styles.deleteButtonText}>🗑</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}
        {filteredItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptyHint}>Try a different filter or add new items</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setNewItemName('');
          setSelectedMealTypes([]);
          setCategory('');
          setShowAddModal(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>➕ Add New Food Item</Text>

            <Text style={styles.modalLabel}>Food Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Pav Bhaji"
              value={newItemName}
              onChangeText={setNewItemName}
            />

            <Text style={styles.modalLabel}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., snack, curry, bread"
              value={category}
              onChangeText={setCategory}
            />

            <Text style={styles.modalLabel}>Meal Types (multi-select)</Text>
            <View style={styles.mealTypeButtons}>
              {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.mealTypeButton,
                    selectedMealTypes.includes(type) && styles.mealTypeButtonSelected,
                  ]}
                  onPress={() => toggleMealType(type)}
                >
                  <Text style={styles.mealTypeEmoji}>
                    {type === 'breakfast' ? '🌅' : type === 'lunch' ? '☀️' : '🌙'}
                  </Text>
                  <Text
                    style={[
                      styles.mealTypeButtonText,
                      selectedMealTypes.includes(type) &&
                        styles.mealTypeButtonTextSelected,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                  {selectedMealTypes.includes(type) && (
                    <Text style={styles.mealTypeCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setNewItemName('');
                  setSelectedMealTypes([]);
                  setCategory('');
                  setShowAddModal(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddItem}
              >
                <Text style={styles.saveButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowEditModal(false);
          setEditingItem(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✏️ Edit Food Item</Text>

            <Text style={styles.modalLabel}>Food Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Food name"
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={styles.modalLabel}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., snack, curry, bread"
              value={editCategory}
              onChangeText={setEditCategory}
            />

            <Text style={styles.modalLabel}>Meal Types (multi-select)</Text>
            <View style={styles.mealTypeButtons}>
              {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.mealTypeButton,
                    editMealTypes.includes(type) && styles.mealTypeButtonSelected,
                  ]}
                  onPress={() => toggleEditMealType(type)}
                >
                  <Text style={styles.mealTypeEmoji}>
                    {type === 'breakfast' ? '🌅' : type === 'lunch' ? '☀️' : '🌙'}
                  </Text>
                  <Text
                    style={[
                      styles.mealTypeButtonText,
                      editMealTypes.includes(type) &&
                        styles.mealTypeButtonTextSelected,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                  {editMealTypes.includes(type) && (
                    <Text style={styles.mealTypeCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleEditItem}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.85,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  headerBtnActive: {
    backgroundColor: '#fff',
  },
  headerBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  headerBtnTextActive: {
    color: PRIMARY,
  },
  addButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: PRIMARY,
    fontWeight: 'bold',
    fontSize: 13,
  },
  statsContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statEmoji: {
    fontSize: 18,
  },
  statText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filterBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  filterChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    gap: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterChipActive: {
    borderColor: PRIMARY,
    backgroundColor: '#FFF5F3',
  },
  filterEmoji: {
    fontSize: 14,
  },
  filterText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
    color: PRIMARY,
  },
  bulkActions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  bulkBtn: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bulkBtnText: {
    color: '#1565C0',
    fontSize: 13,
    fontWeight: '600',
  },
  bulkDeleteBtn: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bulkDeleteBtnText: {
    color: '#C62828',
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    flex: 1,
    marginTop: 8,
  },
  itemCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 5,
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemCardSelected: {
    borderColor: PRIMARY,
    backgroundColor: '#FFF5F3',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CCC',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemInfo: {
    flex: 1,
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  customTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  customTagText: {
    color: '#2E7D32',
    fontSize: 10,
    fontWeight: '700',
  },
  itemMealTypes: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 420,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
  },
  mealTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  mealTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    gap: 4,
  },
  mealTypeButtonSelected: {
    borderColor: PRIMARY,
    backgroundColor: '#FFF5F3',
  },
  mealTypeEmoji: {
    fontSize: 18,
  },
  mealTypeButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  mealTypeButtonTextSelected: {
    color: PRIMARY,
    fontWeight: 'bold',
  },
  mealTypeCheck: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
