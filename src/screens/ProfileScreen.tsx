// Profile Screen – User preferences and regional setup
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { UserProfile, Region, VegType, SpiceLevel, REGION_LABELS } from '../types';
import { StorageService } from '../services/storageService';

const REGIONS: { value: Region; label: string; emoji: string }[] = [
  { value: 'maharashtra', label: 'Maharashtra', emoji: '🏯' },
  { value: 'gujarat', label: 'Gujarat', emoji: '🦁' },
  { value: 'punjab', label: 'Punjab', emoji: '🌾' },
  { value: 'tamil-nadu', label: 'Tamil Nadu', emoji: '🏛️' },
  { value: 'west-bengal', label: 'West Bengal', emoji: '🐯' },
];

const VEG_OPTIONS: { value: VegType; label: string; emoji: string }[] = [
  { value: 'veg', label: 'Vegetarian', emoji: '🥦' },
  { value: 'eggetarian', label: 'Eggetarian', emoji: '🥚' },
  { value: 'non-veg', label: 'Non-Vegetarian', emoji: '🍗' },
];

const SPICE_OPTIONS: { value: SpiceLevel; label: string; emoji: string }[] = [
  { value: 'low', label: 'Mild', emoji: '🟢' },
  { value: 'medium', label: 'Medium', emoji: '🟡' },
  { value: 'high', label: 'Spicy', emoji: '🔴' },
];

const FAMILY_SIZES = [1, 2, 3, 4, 5, 6, '7+'];

export const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    region: 'maharashtra',
    city: '',
    vegType: 'veg',
    spiceLevel: 'medium',
    familyMembers: 4,
    allergies: [],
    isSetupComplete: false,
  });
  const [allergyInput, setAllergyInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const stored = await StorageService.getUserProfile();
    if (stored) {
      setProfile(stored);
      setSaved(true);
    }
  };

  const handleSave = async () => {
    if (!profile.name.trim()) {
      Alert.alert('Validation', 'Please enter your name.');
      return;
    }
    const updated: UserProfile = { ...profile, isSetupComplete: true };
    try {
      await StorageService.saveUserProfile(updated);
      setProfile(updated);
      setSaved(true);
      Alert.alert('Saved! 🎉', 'Your profile has been saved. Recommendations are now personalised for you.');
    } catch {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const addAllergy = () => {
    const trimmed = allergyInput.trim();
    if (!trimmed) return;
    if (!profile.allergies.includes(trimmed)) {
      setProfile({ ...profile, allergies: [...profile.allergies, trimmed] });
    }
    setAllergyInput('');
  };

  const removeAllergy = (item: string) => {
    setProfile({
      ...profile,
      allergies: profile.allergies.filter((a) => a !== item),
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👤 My Profile</Text>
        <Text style={styles.headerSubtitle}>
          Personalise your meal recommendations
        </Text>
      </View>

      {saved && (
        <View style={styles.savedBanner}>
          <Text style={styles.savedText}>
            ✅ Profile saved – recommendations are personalised for {REGION_LABELS[profile.region]}
          </Text>
        </View>
      )}

      {/* Name */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Priya"
          value={profile.name}
          onChangeText={(t) => setProfile({ ...profile, name: t })}
        />
      </View>

      {/* Region */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>🗺️ Your Region (State)</Text>
        <View style={styles.chipGrid}>
          {REGIONS.map((r) => (
            <TouchableOpacity
              key={r.value}
              style={[styles.chip, profile.region === r.value && styles.chipSelected]}
              onPress={() => setProfile({ ...profile, region: r.value })}
            >
              <Text style={styles.chipEmoji}>{r.emoji}</Text>
              <Text
                style={[
                  styles.chipText,
                  profile.region === r.value && styles.chipTextSelected,
                ]}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* City */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>🏙️ City (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Pune"
          value={profile.city ?? ''}
          onChangeText={(t) => setProfile({ ...profile, city: t })}
        />
      </View>

      {/* Veg preference */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>🥗 Diet Preference</Text>
        <View style={styles.row}>
          {VEG_OPTIONS.map((v) => (
            <TouchableOpacity
              key={v.value}
              style={[styles.optionBtn, profile.vegType === v.value && styles.optionBtnSelected]}
              onPress={() => setProfile({ ...profile, vegType: v.value })}
            >
              <Text style={styles.optionEmoji}>{v.emoji}</Text>
              <Text
                style={[
                  styles.optionText,
                  profile.vegType === v.value && styles.optionTextSelected,
                ]}
              >
                {v.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Spice level */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>🌶️ Spice Preference</Text>
        <View style={styles.row}>
          {SPICE_OPTIONS.map((s) => (
            <TouchableOpacity
              key={s.value}
              style={[styles.optionBtn, profile.spiceLevel === s.value && styles.optionBtnSelected]}
              onPress={() => setProfile({ ...profile, spiceLevel: s.value })}
            >
              <Text style={styles.optionEmoji}>{s.emoji}</Text>
              <Text
                style={[
                  styles.optionText,
                  profile.spiceLevel === s.value && styles.optionTextSelected,
                ]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Family size */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>👨‍👩‍👧‍👦 Family Members</Text>
        <View style={styles.row}>
          {FAMILY_SIZES.map((n) => (
            <TouchableOpacity
              key={String(n)}
              style={[
                styles.sizeBtn,
                (profile.familyMembers === n || (n === '7+' && profile.familyMembers >= 7)) &&
                  styles.sizeBtnSelected,
              ]}
              onPress={() =>
                setProfile({ ...profile, familyMembers: n === '7+' ? 7 : (n as number) })
              }
            >
              <Text
                style={[
                  styles.sizeBtnText,
                  (profile.familyMembers === n || (n === '7+' && profile.familyMembers >= 7)) &&
                    styles.sizeBtnTextSelected,
                ]}
              >
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Allergies */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>⚠️ Allergies / Avoid</Text>
        <View style={styles.allergyRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="e.g. peanuts, dairy"
            value={allergyInput}
            onChangeText={setAllergyInput}
            onSubmitEditing={addAllergy}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addAllergy}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tagRow}>
          {profile.allergies.map((a) => (
            <TouchableOpacity
              key={a}
              style={styles.allergyTag}
              onPress={() => removeAllergy(a)}
            >
              <Text style={styles.allergyTagText}>{a} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Save */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>💾 Save Profile</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const PRIMARY = '#FF6B35';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: PRIMARY,
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#fff', opacity: 0.9 },
  savedBanner: {
    backgroundColor: '#E8F5E9',
    margin: 16,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  savedText: { color: '#2E7D32', fontSize: 14 },
  card: {
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
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 4,
    color: '#333',
  },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  chipSelected: { borderColor: PRIMARY, backgroundColor: '#FFF5F3' },
  chipEmoji: { fontSize: 16 },
  chipText: { fontSize: 14, color: '#555' },
  chipTextSelected: { color: PRIMARY, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8 },
  optionBtn: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
  },
  optionBtnSelected: { borderColor: PRIMARY, backgroundColor: '#FFF5F3' },
  optionEmoji: { fontSize: 22, marginBottom: 4 },
  optionText: { fontSize: 12, color: '#555', textAlign: 'center' },
  optionTextSelected: { color: PRIMARY, fontWeight: '700' },
  sizeBtn: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 2,
  },
  sizeBtnSelected: { borderColor: PRIMARY, backgroundColor: '#FFF5F3' },
  sizeBtnText: { fontSize: 15, color: '#555', fontWeight: '600' },
  sizeBtnTextSelected: { color: PRIMARY },
  allergyRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  addBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  allergyTag: {
    backgroundColor: '#FFEBEE',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  allergyTagText: { color: '#C62828', fontSize: 13 },
  saveButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
