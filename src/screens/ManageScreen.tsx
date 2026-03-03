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

  const mealCounts = {
    breakfast: foodItems.filter((item) => item.mealType.includes('breakfast')).length,
    lunch: foodItems.filter((item) => item.mealType.includes('lunch')).length,
    dinner: foodItems.filter((item) => item.mealType.includes('dinner')).length,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Food Items</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTotal}>Total: {foodItems.length} items</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsBadge}>🌅 Breakfast: {mealCounts.breakfast}</Text>
          <Text style={styles.statsBadge}>☀️ Lunch: {mealCounts.lunch}</Text>
          <Text style={styles.statsBadge}>🌙 Dinner: {mealCounts.dinner}</Text>
        </View>
      </View>

      <ScrollView style={styles.list}>
        {foodItems.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMealTypes}>
                {item.mealType.join(', ')}
              </Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleOpenEdit(item)}
                accessibilityLabel={`Edit ${item.name}`}
                accessibilityHint="Opens a dialog to edit this food item"
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteItem(item.id, item.name)}
                accessibilityLabel={`Delete ${item.name}`}
                accessibilityHint="Asks for confirmation before deleting this food item"
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
            <Text style={styles.modalTitle}>Add New Food Item</Text>

            <TextInput
              style={styles.input}
              placeholder="Food name (e.g., Pav Bhaji)"
              value={newItemName}
              onChangeText={setNewItemName}
            />

            <TextInput
              style={styles.input}
              placeholder="Category (e.g., snack)"
              value={category}
              onChangeText={setCategory}
            />

            <Text style={styles.label}>Select meal types:</Text>
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
                  <Text
                    style={[
                      styles.mealTypeButtonText,
                      selectedMealTypes.includes(type) &&
                        styles.mealTypeButtonTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
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
                <Text style={styles.saveButtonText}>Add</Text>
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
            <Text style={styles.modalTitle}>Edit Food Item</Text>

            <TextInput
              style={styles.input}
              placeholder="Food name"
              value={editName}
              onChangeText={setEditName}
            />

            <TextInput
              style={styles.input}
              placeholder="Category (e.g., snack)"
              value={editCategory}
              onChangeText={setEditCategory}
            />

            <Text style={styles.label}>Select meal types:</Text>
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
                  <Text
                    style={[
                      styles.mealTypeButtonText,
                      editMealTypes.includes(type) &&
                        styles.mealTypeButtonTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
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
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statsBadge: {
    fontSize: 13,
    color: '#555',
    backgroundColor: '#FFF5F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD5C8',
  },
  list: {
    flex: 1,
    marginTop: 8,
  },
  itemCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemMealTypes: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: '#999',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  mealTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  mealTypeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  mealTypeButtonSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F3',
  },
  mealTypeButtonText: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  mealTypeButtonTextSelected: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
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
