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

const REGIONS: { value: Region; label: string; emoji: string; desc: string }[] = [
  { value: 'maharashtra', label: 'Maharashtra', emoji: '🏯', desc: 'Pav Bhaji, Vada Pav' },
  { value: 'gujarat', label: 'Gujarat', emoji: '🦁', desc: 'Dhokla, Thepla' },
  { value: 'punjab', label: 'Punjab', emoji: '🌾', desc: 'Butter Chicken, Paratha' },
  { value: 'tamil-nadu', label: 'Tamil Nadu', emoji: '🏛️', desc: 'Dosa, Sambar' },
  { value: 'west-bengal', label: 'West Bengal', emoji: '🐯', desc: 'Fish Curry, Rasgulla' },
];

const VEG_OPTIONS: { value: VegType; label: string; emoji: string; desc: string }[] = [
  { value: 'veg', label: 'Vegetarian', emoji: '🥦', desc: 'No meat or eggs' },
  { value: 'eggetarian', label: 'Eggetarian', emoji: '🥚', desc: 'Includes eggs' },
  { value: 'non-veg', label: 'Non-Veg', emoji: '🍗', desc: 'All foods' },
];

const SPICE_OPTIONS: { value: SpiceLevel; label: string; emoji: string; desc: string }[] = [
  { value: 'low', label: 'Mild', emoji: '🟢', desc: 'Easy on spice' },
  { value: 'medium', label: 'Medium', emoji: '🟡', desc: 'Balanced heat' },
  { value: 'high', label: 'Spicy', emoji: '🔴', desc: 'Bring the fire!' },
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

  const handleReset = () => {
    Alert.alert(
      'Reset Profile',
      'This will clear all your preferences. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearAllData();
              setProfile({
                name: '',
                region: 'maharashtra',
                city: '',
                vegType: 'veg',
                spiceLevel: 'medium',
                familyMembers: 4,
                allergies: [],
                isSetupComplete: false,
              });
              setSaved(false);
              Alert.alert('Done', 'Profile has been reset.');
            } catch {
              Alert.alert('Error', 'Failed to reset profile.');
            }
          },
        },
      ]
    );
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

  const completionSteps = [
    { done: !!profile.name.trim(), label: 'Name' },
    { done: !!profile.region, label: 'Region' },
    { done: !!profile.vegType, label: 'Diet' },
    { done: !!profile.spiceLevel, label: 'Spice' },
  ];
  const completedCount = completionSteps.filter((s) => s.done).length;

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
          <Text style={styles.savedEmoji}>✅</Text>
          <View style={styles.savedContent}>
            <Text style={styles.savedTitle}>Profile Active</Text>
            <Text style={styles.savedText}>
              Recommendations personalised for {REGION_LABELS[profile.region]}
            </Text>
          </View>
        </View>
      )}

      {/* Progress indicator */}
      {!saved && (
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Setup Progress</Text>
          <View style={styles.progressSteps}>
            {completionSteps.map((step) => (
              <View key={step.label} style={styles.progressStep}>
                <View style={[styles.progressDot, step.done && styles.progressDotDone]}>
                  {step.done && <Text style={styles.progressCheck}>✓</Text>}
                </View>
                <Text style={[styles.progressLabel, step.done && styles.progressLabelDone]}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(completedCount / 4) * 100}%` }]} />
          </View>
        </View>
      )}

      {/* Name */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>👋 Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Priya"
          value={profile.name}
          onChangeText={(t) => setProfile({ ...profile, name: t })}
          placeholderTextColor="#BBB"
        />
      </View>

      {/* Region */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>🗺️ Your Region</Text>
        <Text style={styles.sectionHint}>Select your state for regional dishes</Text>
        <View style={styles.chipGrid}>
          {REGIONS.map((r) => (
            <TouchableOpacity
              key={r.value}
              style={[styles.regionChip, profile.region === r.value && styles.regionChipSelected]}
              onPress={() => setProfile({ ...profile, region: r.value })}
              activeOpacity={0.7}
            >
              <Text style={styles.regionEmoji}>{r.emoji}</Text>
              <View style={styles.regionInfo}>
                <Text
                  style={[
                    styles.regionName,
                    profile.region === r.value && styles.regionNameSelected,
                  ]}
                >
                  {r.label}
                </Text>
                <Text style={styles.regionDesc}>{r.desc}</Text>
              </View>
              {profile.region === r.value && (
                <Text style={styles.selectedMark}>✓</Text>
              )}
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
          placeholderTextColor="#BBB"
        />
      </View>

      {/* Veg preference */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>🥗 Diet Preference</Text>
        <View style={styles.optionGrid}>
          {VEG_OPTIONS.map((v) => (
            <TouchableOpacity
              key={v.value}
              style={[styles.optionCard, profile.vegType === v.value && styles.optionCardSelected]}
              onPress={() => setProfile({ ...profile, vegType: v.value })}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>{v.emoji}</Text>
              <Text
                style={[
                  styles.optionName,
                  profile.vegType === v.value && styles.optionNameSelected,
                ]}
              >
                {v.label}
              </Text>
              <Text style={styles.optionDesc}>{v.desc}</Text>
              {profile.vegType === v.value && (
                <View style={styles.optionCheck}>
                  <Text style={styles.optionCheckText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Spice level */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>🌶️ Spice Preference</Text>
        <View style={styles.optionGrid}>
          {SPICE_OPTIONS.map((s) => (
            <TouchableOpacity
              key={s.value}
              style={[styles.optionCard, profile.spiceLevel === s.value && styles.optionCardSelected]}
              onPress={() => setProfile({ ...profile, spiceLevel: s.value })}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>{s.emoji}</Text>
              <Text
                style={[
                  styles.optionName,
                  profile.spiceLevel === s.value && styles.optionNameSelected,
                ]}
              >
                {s.label}
              </Text>
              <Text style={styles.optionDesc}>{s.desc}</Text>
              {profile.spiceLevel === s.value && (
                <View style={styles.optionCheck}>
                  <Text style={styles.optionCheckText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Family size */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>👨‍👩‍👧‍👦 Family Members</Text>
        <View style={styles.sizeRow}>
          {FAMILY_SIZES.map((n) => {
            const isSelected = profile.familyMembers === n || (n === '7+' && profile.familyMembers >= 7);
            return (
              <TouchableOpacity
                key={String(n)}
                style={[styles.sizeBtn, isSelected && styles.sizeBtnSelected]}
                onPress={() =>
                  setProfile({ ...profile, familyMembers: n === '7+' ? 7 : (n as number) })
                }
              >
                <Text style={[styles.sizeBtnText, isSelected && styles.sizeBtnTextSelected]}>
                  {n}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Allergies */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>⚠️ Allergies / Avoid</Text>
        <Text style={styles.sectionHint}>Add ingredients you want to avoid</Text>
        <View style={styles.allergyRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="e.g. peanuts, dairy"
            value={allergyInput}
            onChangeText={setAllergyInput}
            onSubmitEditing={addAllergy}
            placeholderTextColor="#BBB"
          />
          <TouchableOpacity style={styles.addBtn} onPress={addAllergy}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
        {profile.allergies.length > 0 && (
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
        )}
      </View>

      {/* Save */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
        <Text style={styles.saveButtonText}>
          {saved ? '💾 Update Profile' : '🚀 Save & Get Started'}
        </Text>
      </TouchableOpacity>

      {saved && (
        <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.8}>
          <Text style={styles.resetButtonText}>🔄 Reset All Data</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const PRIMARY = '#FF6B35';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: PRIMARY,
    padding: 20,
    paddingTop: 48,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#fff', opacity: 0.85 },
  savedBanner: {
    backgroundColor: '#E8F5E9',
    margin: 16,
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savedEmoji: { fontSize: 24 },
  savedContent: { flex: 1 },
  savedTitle: { fontSize: 15, fontWeight: '700', color: '#2E7D32' },
  savedText: { color: '#2E7D32', fontSize: 13, marginTop: 2 },
  progressCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressStep: {
    alignItems: 'center',
    gap: 6,
  },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotDone: {
    backgroundColor: '#4CAF50',
  },
  progressCheck: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 11,
    color: '#999',
  },
  progressLabelDone: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 4 },
  sectionHint: { fontSize: 13, color: '#999', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 4,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  chipGrid: { gap: 8, marginTop: 8 },
  regionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  regionChipSelected: { borderColor: PRIMARY, backgroundColor: '#FFF5F3' },
  regionEmoji: { fontSize: 28 },
  regionInfo: { flex: 1 },
  regionName: { fontSize: 15, fontWeight: '600', color: '#333' },
  regionNameSelected: { color: PRIMARY, fontWeight: '700' },
  regionDesc: { fontSize: 12, color: '#999', marginTop: 2 },
  selectedMark: { fontSize: 18, color: PRIMARY, fontWeight: 'bold' },
  optionGrid: { flexDirection: 'row', gap: 10, marginTop: 8 },
  optionCard: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  optionCardSelected: { borderColor: PRIMARY, backgroundColor: '#FFF5F3' },
  optionEmoji: { fontSize: 28, marginBottom: 8 },
  optionName: { fontSize: 13, fontWeight: '600', color: '#555', textAlign: 'center' },
  optionNameSelected: { color: PRIMARY, fontWeight: '700' },
  optionDesc: { fontSize: 10, color: '#999', textAlign: 'center', marginTop: 4 },
  optionCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCheckText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  sizeRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  sizeBtn: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingVertical: 14,
  },
  sizeBtnSelected: { borderColor: PRIMARY, backgroundColor: '#FFF5F3' },
  sizeBtnText: { fontSize: 16, color: '#555', fontWeight: '600' },
  sizeBtnTextSelected: { color: PRIMARY, fontWeight: '700' },
  allergyRow: { flexDirection: 'row', gap: 8, marginBottom: 8, marginTop: 8 },
  addBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  allergyTag: {
    backgroundColor: '#FFEBEE',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  allergyTagText: { color: '#C62828', fontSize: 13, fontWeight: '500' },
  saveButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    marginTop: 24,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resetButton: {
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
  },
  resetButtonText: { color: '#C62828', fontSize: 15, fontWeight: '600' },
});
