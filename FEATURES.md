# App Screenshots & Features

## Screen 1: Home - Daily Recommendations

**What you'll see:**
```
┌─────────────────────────────────────┐
│  Today's Recommendations            │
│  Select and mark what you prepare   │
└─────────────────────────────────────┘

🌅 Breakfast
┌─────────────────────────────────────┐
│ Poha                        [Custom]│
│ ⏱️ 20 min                           │
│ rice-based                          │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Misal Pav                           │
│ ⏱️ 30 min                           │
│ sprouts-based                       │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Idli Sambar                         │
│ ⏱️ 20 min                           │
│ south-indian                        │
└─────────────────────────────────────┘

☀️ Lunch
┌─────────────────────────────────────┐
│ Masale Bhaat                        │
│ ⏱️ 40 min                           │
│ rice-based                          │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Chapati + Sabzi                     │
│ ⏱️ 35 min                           │
│ bread                               │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Pithla Bhakri                       │
│ ⏱️ 40 min                           │
│ special                             │
└─────────────────────────────────────┘

🌙 Dinner
┌─────────────────────────────────────┐
│ Khichdi                             │
│ ⏱️ 30 min                           │
│ rice-based                          │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Varan Bhaat                         │
│ ⏱️ 40 min                           │
│ rice-based                          │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Dahi Rice                           │
│ ⏱️ 15 min                           │
│ rice-based                          │
└─────────────────────────────────────┘

[When you tap a meal, it highlights]
┌─────────────────────────────────────┐
│ ✓ Mark "Poha" as Prepared          │
│   (Green button appears)            │
└─────────────────────────────────────┘
```

**Features:**
- Pull down to refresh recommendations
- Tap to select a meal
- Tap button to mark as prepared
- Algorithm updates based on your history

---

## Screen 2: Manage Foods

**What you'll see:**
```
┌─────────────────────────────────────┐
│  Manage Food Items      [+ Add New] │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Poha                                │
│ breakfast                           │
│ rice-based                          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Misal Pav                           │
│ breakfast                           │
│ sprouts-based                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Pav Bhaji                  [Delete] │
│ dinner                     (Custom) │
│ snack                               │
└─────────────────────────────────────┘

[When you tap + Add New, modal appears]
┌─────────────────────────────────────┐
│  Add New Food Item                  │
│                                     │
│  Food name:                         │
│  [Pav Bhaji____________]            │
│                                     │
│  Category:                          │
│  [snack_________________]           │
│                                     │
│  Select meal types:                 │
│  [Breakfast] [Lunch] [✓ Dinner]    │
│                                     │
│  [Cancel]           [Add]           │
└─────────────────────────────────────┘
```

**Features:**
- View all food items (default + custom)
- Add new food items with modal form
- Select multiple meal types
- Delete custom items (default items protected)
- Categories for organization

---

## Screen 3: History

**What you'll see:**
```
┌─────────────────────────────────────┐
│  Meal History                       │
│  23 meals recorded                  │
└─────────────────────────────────────┘

Today
┌─────────────────────────────────────┐
│ 🌅  Poha                            │
│     Breakfast                       │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ ☀️  Masale Bhaat                    │
│     Lunch                           │
└─────────────────────────────────────┘

Yesterday
┌─────────────────────────────────────┐
│ 🌅  Upma                            │
│     Breakfast                       │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ ☀️  Plain Rice + Dal + Sabzi        │
│     Lunch                           │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 🌙  Khichdi                         │
│     Dinner                          │
└─────────────────────────────────────┘

15 Feb 2026
┌─────────────────────────────────────┐
│ 🌅  Sabudana Khichdi                │
│     Breakfast                       │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ ☀️  Pulao                           │
│     Lunch                           │
└─────────────────────────────────────┘
```

**Features:**
- Pull down to refresh
- Organized by date (Today, Yesterday, Date)
- Shows all prepared meals with timestamps
- Icons indicate meal type
- Helps track variety over time

---

## Bottom Navigation

```
┌─────────────────────────────────────┐
│                                     │
│         (Content Area)              │
│                                     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  🍳          📝           📅        │
│  Recommendations  Manage   History  │
│  (Active: Orange highlight)         │
└─────────────────────────────────────┘
```

**Navigation:**
- Three main tabs always visible
- Active tab highlighted in orange (#FF6B35)
- Tap to switch between screens
- Smooth transitions

---

## Color Scheme

- **Primary Color**: Orange (#FF6B35) - Headers, active states
- **Success Color**: Green (#4CAF50) - Confirm buttons
- **Background**: Light Gray (#f5f5f5) - App background
- **Cards**: White with shadows
- **Text**: Dark Gray (#333) for primary, lighter for secondary

---

## Interaction Patterns

### Selecting a Meal
1. Tap on a meal card
2. Card highlights with orange border
3. "Mark as Prepared" button appears
4. Tap button to confirm
5. Success message appears
6. Recommendations refresh

### Adding a Food Item
1. Tap "+ Add New" button
2. Modal slides up from bottom
3. Fill in form fields
4. Select meal types (multiple allowed)
5. Tap "Add"
6. Modal closes
7. List refreshes with new item

### Viewing History
1. Navigate to History tab
2. Scroll through timeline
3. Pull down to refresh
4. See grouped by date

---

## Pre-loaded Food Items (25+)

**Breakfast (10 items):**
- Poha
- Upma
- Misal Pav
- Sabudana Khichdi
- Thalipeeth
- Sheera
- Idli Sambar
- Dosa
- Paratha
- Sandwich

**Lunch/Dinner (15 items):**
- Plain Rice + Dal + Sabzi
- Varan Bhaat
- Pulao
- Masale Bhaat
- Biryani
- Chapati + Sabzi
- Chapati + Bhaji
- Bhakri + Pitla
- Pithla Bhakri
- Koshimbir + Chapati
- Zunka Bhakri
- Paneer Bhurji + Roti
- Mixed Vegetable + Rice
- Khichdi
- Dahi Rice

All items include:
- Preparation time estimates
- Category classification
- Meal type assignments

---

## How the Recommendation Algorithm Works

1. **You mark meals as prepared** → App records date & time
2. **Algorithm calculates** → Days since each food was last made
3. **Scoring system:**
   - Never made = Score 999 (highest priority)
   - Made 1 day ago = Score 1
   - Made 7 days ago = Score 7
   - Made 30 days ago = Score 30
4. **Selection process:**
   - Filter by meal type
   - Take top 50% highest scores
   - Shuffle for variety
   - Pick 3 items
5. **Result:** Fresh recommendations avoiding recent meals!

---

## Tips for Best Experience

✨ **Daily Routine:**
- Morning: Check breakfast recommendations
- Mark what you actually prepared
- Noon: Check lunch suggestions
- Evening: Plan dinner

📝 **Customize:**
- Add your family's favorite dishes
- Include fusion items (Indo-Chinese, etc.)
- Add special occasion foods

📊 **Track Patterns:**
- Use History to see variety
- Notice gaps in diet
- Plan balanced meals

🔄 **Keep Fresh:**
- Pull to refresh for new suggestions
- Mark meals consistently
- The more you use it, the better it gets!

---

**The app learns from your cooking habits and helps you maintain variety! 🍳**
