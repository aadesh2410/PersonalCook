# PersonalCook 🍳

[![Deploy to Netlify](https://github.com/aadesh2410/PersonalCook/actions/workflows/netlify-deploy.yml/badge.svg)](https://github.com/aadesh2410/PersonalCook/actions/workflows/netlify-deploy.yml)

A mobile application that acts as your personal daily cook by suggesting region-specific Indian meals every day. Set up your profile once and get personalised Breakfast / Lunch / Dinner recommendations based on your **state**, diet preference, and spice level.

## 🌐 Access the App

| Method | Time | Cost | Notes |
|--------|------|------|-------|
| **Web (Netlify)** ✅ | 10 min | FREE | Works on all devices, no install needed |
| **Expo Go** | 5 min | FREE | Scan QR code with phone |
| **App Stores** | 2–7 days | $25–$99 | Public distribution |

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment instructions.

## ✨ Features

### 👤 User Profile
Set up your personal profile with:
- **Name & Region** – choose from 5 Indian states (Maharashtra, Gujarat, Punjab, Tamil Nadu, West Bengal)
- **City** (optional)
- **Diet preference** – Veg / Eggetarian / Non-Veg
- **Spice level** – Mild / Medium / Spicy
- **Family members** count
- **Allergies / items to avoid**

### 🗺️ Region-Based Recommendations
Dishes are tailored to your selected state:

| State | Breakfast | Lunch | Dinner |
|-------|-----------|-------|--------|
| Maharashtra | Poha, Thalipeeth, Sabudana Khichdi | Pithla Bhakri, Varan Bhaat, Bharli Vangi | Zunka Bhakri, Tomato Saar, Matki Usal |
| Gujarat | Dhokla, Thepla | Dal Dhokli, Undhiyu, Khichdi Kadhi | Sev Tameta Nu Shaak |
| Punjab | Aloo Paratha, Chole Bhature | Dal Makhani, Sarson da Saag, Rajma Chawal | Butter Chicken |
| Tamil Nadu | Idli Sambar, Masala Dosa, Pongal | Sambar Rice, Rasam Rice, Kootu | Chettinad Chicken |
| West Bengal | Luchi Aloo Dum | Shorshe Ilish, Aloo Posto, Cholar Dal | Kosha Mangsho |

### 📅 Weekly Meal Planner
- Auto-generate a **7-day meal plan** personalised to your region & diet
- **Shuffle All** – regenerate the entire week
- **Shuffle individual meal** – replace a single dish with 🔄
- **Save plan** to device storage
- **No-repetition logic** – avoids suggesting the same dish twice in the same week

### 🛒 Grocery Auto-List
- Automatically generates an ingredient list from your weekly plan
- Ingredients grouped by category: Vegetables, Grains, Spices, Dairy, Lentils & Legumes, Non-Veg, Other
- **Check off items** as you shop with a progress bar
- Refresh anytime to regenerate from the latest saved plan

### 🍽️ Meal Types Supported
- Breakfast · Lunch · Dinner · Snacks · Festival special · Fasting (Upwas)

### 📝 Custom Food Management
- Add your own dishes to the database
- Edit or delete existing items

### 🕐 Meal History
- Track every meal you've prepared and when
- History grouped by date (Today / Yesterday / date)

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Bottom Tabs)
- **Storage**: AsyncStorage (fully offline, no backend needed)
- **UI**: Native React Native components

## Installation & Setup

```bash
# 1. Clone
git clone https://github.com/aadesh2410/PersonalCook.git
cd PersonalCook

# 2. Install dependencies
npm install

# 3. Start dev server
npm start

# 4. Open on device
#   iOS:     scan QR with Camera app
#   Android: scan QR with Expo Go
#   Web:     press w in terminal
```

Full guides: [HOW_TO_INSTALL.md](HOW_TO_INSTALL.md) · [MOBILE_SETUP.md](MOBILE_SETUP.md)

## How to Use

1. **Set up your Profile** → tap the 👤 Profile tab → fill in region, diet, spice level → Save
2. **View Today's Meals** → Home tab shows 3 personalised suggestions per meal
3. **Mark meals as prepared** → tap a card, then tap the green confirm button
4. **Plan your week** → Weekly Plan tab → Shuffle / lock meals → Save
5. **Build grocery list** → Grocery tab → check off items as you shop
6. **Add custom dishes** → Foods tab → tap + Add New

## Project Structure

```
PersonalCook/
├── src/
│   ├── components/
│   │   └── MealCard.tsx              # Dish card with veg dot, spice, difficulty
│   ├── screens/
│   │   ├── HomeScreen.tsx            # Today's personalised recommendations
│   │   ├── WeeklyPlannerScreen.tsx   # 7-day planner with shuffle & save
│   │   ├── GroceryListScreen.tsx     # Auto-generated ingredient list
│   │   ├── ManageScreen.tsx          # Add / edit / delete food items
│   │   ├── HistoryScreen.tsx         # Preparation history by date
│   │   └── ProfileScreen.tsx         # User profile & preferences
│   ├── services/
│   │   ├── storageService.ts         # AsyncStorage wrapper
│   │   └── recommendationService.ts  # Region-aware recommendation engine
│   ├── data/
│   │   ├── regionalDishes.ts         # 60+ dishes across 5 states
│   │   └── foodItems.ts              # Legacy default items
│   └── types/
│       └── index.ts                  # TypeScript types
├── App.tsx                           # Navigation setup (6 tabs)
└── package.json
```

## Recommendation Algorithm

1. **Region filter** – only dishes from the user's selected state (+ diet filter)
2. **Recency score** – items not prepared recently score higher
3. **Top-half pool + shuffle** – variety without being too predictable
4. **No-repeat window** – same dish not suggested within 3 days

## Data Storage

All data is stored locally on the device using AsyncStorage – no internet required, data persists between sessions.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment guides (Netlify, Firebase, EAS Build).

---

**Made with ❤️ for Indian families who struggle with the daily "what should we cook?" question!**

