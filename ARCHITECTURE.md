# 🏗️ PersonalCook – Architecture & Project Structure

This document describes the structure, architecture, and key design decisions of the **PersonalCook** application to help contributors understand and navigate the codebase.

---

## 📋 Overview

**PersonalCook** is a cross-platform meal recommendation app designed for Indian families. It runs on **iOS**, **Android**, and **Web** using a single codebase built with React Native + Expo.

### Key Characteristics

- **Fully offline** – All data is stored locally using AsyncStorage
- **No backend** – The app runs entirely on the client
- **Region-aware** – Recommends meals based on Indian states
- **PWA-ready** – Works as a Progressive Web App on browsers

---

## 🛠️ Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | React Native 0.81 + Expo 54        |
| Language       | TypeScript 5.9 (strict mode)        |
| Navigation     | React Navigation v7 (Bottom Tabs)   |
| Storage        | AsyncStorage (fully offline)        |
| Web            | React Native Web + React DOM 19     |
| Bundler        | Metro (Expo managed)                |

---

## 📁 Project Structure

```
PersonalCook/
├── App.tsx                           # Root – Bottom tab navigator + SafariBanner wrapper
├── index.ts                          # Entry point + Service Worker registration (PWA)
├── app.json                          # Expo config (iOS, Android, web settings)
├── tsconfig.json                     # TypeScript strict configuration
├── package.json                      # Dependencies & scripts
├── eas.json                          # EAS Build profiles (Android APK, iOS)
│
├── public/
│   └── sw.js                         # Service Worker for offline PWA support
│
├── assets/
│   ├── icon.png                      # App icon
│   ├── adaptive-icon.png             # Android adaptive icon
│   ├── splash-icon.png               # Splash screen asset
│   └── favicon.png                   # Web favicon
│
├── src/
│   ├── components/                   # Reusable UI components
│   │   ├── MealCard.tsx              # Meal suggestion card with selection support
│   │   └── SafariBanner.tsx          # Safari browser detection & warning overlay
│   │
│   ├── screens/                      # Tab screens (one per tab)
│   │   ├── HomeScreen.tsx            # Daily meal recommendations with multi-select
│   │   ├── WeeklyPlannerScreen.tsx   # 7-day meal plan with day selector
│   │   ├── GroceryListScreen.tsx     # Auto-generated ingredient checklist
│   │   ├── ManageScreen.tsx          # Add/edit/delete food items with bulk actions
│   │   ├── HistoryScreen.tsx         # Meal preparation history with multi-select
│   │   └── ProfileScreen.tsx         # User profile & preference setup
│   │
│   ├── services/                     # Business logic & data access
│   │   ├── storageService.ts         # AsyncStorage CRUD wrapper
│   │   └── recommendationService.ts  # Meal recommendation algorithm
│   │
│   ├── data/                         # Static datasets
│   │   ├── regionalDishes.ts         # 60+ regional Indian dishes (5 states)
│   │   └── foodItems.ts              # Legacy fallback food items
│   │
│   └── types/
│       └── index.ts                  # TypeScript interfaces & type definitions
│
├── .github/
│   └── workflows/
│       ├── netlify-deploy.yml        # Auto-deploy web build to Netlify
│       └── firebase-deploy.yml       # Firebase App Distribution
│
├── ARCHITECTURE.md                   # ← You are here
├── DEPLOYMENT.md                     # Deployment strategies
├── MOBILE_SETUP.md                   # Mobile setup guide
├── FIREBASE_SETUP.md                 # Firebase configuration
└── HOW_TO_INSTALL.md                 # APK/Expo Go installation
```

---

## 🧭 Navigation Architecture

The app uses a **flat bottom tab navigation** with 6 tabs:

```
┌──────────────────────────────────────────────────────┐
│                    App.tsx                            │
│  ┌────────────────────────────────────────────────┐  │
│  │           SafariBanner (web only)               │  │
│  │  ┌──────────────────────────────────────────┐  │  │
│  │  │        NavigationContainer                │  │  │
│  │  │  ┌────────────────────────────────────┐  │  │  │
│  │  │  │     Bottom Tab Navigator           │  │  │  │
│  │  │  │                                    │  │  │  │
│  │  │  │  🍳 Today    → HomeScreen          │  │  │  │
│  │  │  │  📅 Weekly   → WeeklyPlannerScreen │  │  │  │
│  │  │  │  🛒 Grocery  → GroceryListScreen   │  │  │  │
│  │  │  │  📝 Foods    → ManageScreen        │  │  │  │
│  │  │  │  🕐 History  → HistoryScreen       │  │  │  │
│  │  │  │  👤 Profile  → ProfileScreen       │  │  │  │
│  │  │  └────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## 💾 Data Flow

```
┌──────────────┐     ┌──────────────────────┐     ┌───────────────────┐
│   Screens    │────▶│  StorageService      │────▶│   AsyncStorage    │
│              │◀────│  (CRUD operations)   │◀────│   (Device-local)  │
└──────────────┘     └──────────────────────┘     └───────────────────┘
       │
       ▼
┌──────────────────────┐     ┌───────────────────┐
│ RecommendationService│────▶│  regionalDishes   │
│  (Scoring & Planning)│     │  (Static dataset)  │
└──────────────────────┘     └───────────────────┘
```

### Storage Keys

| Key                           | Content                    |
| ----------------------------- | -------------------------- |
| `@PersonalCook:foodItems`     | Array of FoodItem objects   |
| `@PersonalCook:mealHistory`   | Array of MealHistory entries|
| `@PersonalCook:userProfile`   | UserProfile object          |
| `@PersonalCook:weeklyPlan`    | WeeklyPlan object           |

---

## 🧠 Recommendation Algorithm

The `RecommendationService` uses a **scoring-based approach**:

1. **Filter** dishes by user's region + diet preference (veg/non-veg)
2. **Score** each dish based on days since last prepared (higher = better)
3. **Avoid repetition** within a 3-day window
4. **Shuffle** the top-scored pool for variety
5. **Return** top 3 recommendations per meal type

### Weekly Plan Generation

- Picks unique dishes for each day/slot using a "used IDs" tracking set
- Falls back to the full regional pool if fresh dishes run out
- Generates 7 days × 3 meals = 21 dish selections

---

## 🔑 Key TypeScript Types

```typescript
FoodItem       // Dish with region, vegType, mealType, ingredients, etc.
UserProfile    // Name, region, diet, spice level, family size, allergies
MealHistory    // Record of a prepared meal with timestamp
WeeklyPlan     // 7-day plan with food item IDs per meal slot
DailyMealPlan  // Single day: breakfast/lunch/dinner food item IDs
```

See `src/types/index.ts` for full definitions.

---

## 🌐 Web (PWA) Architecture

- **Service Worker** (`public/sw.js`) caches static assets for offline use
- **Safari Detection** (`SafariBanner.tsx`) warns users if they open the app in Safari
- **PWA manifest** is configured in `app.json` under the `web` key
- Deployed to **Netlify** via GitHub Actions

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run web        # Web browser
npm run android    # Android emulator/device
npm run ios        # iOS simulator (macOS only)

# Build for web deployment
npm run build:web
```

---

## 📱 Multi-Select Patterns

The app supports multi-select in several screens:

| Screen         | Multi-Select Use Case                             |
| -------------- | ------------------------------------------------- |
| HomeScreen     | Select multiple meals to mark as prepared at once  |
| ManageScreen   | Select multiple food items for bulk deletion       |
| HistoryScreen  | Select multiple history entries for removal        |
| GroceryList    | Check/uncheck items, select all per category       |

---

## 🏗️ Conventions

- **Styling**: All styles are co-located with components using `StyleSheet.create()`
- **State**: Local component state with `useState` (no global state manager)
- **Colors**: Primary `#FF6B35` (orange), Success `#4CAF50` (green)
- **Background**: `#FAFAFA` for screen backgrounds, `#fff` for cards
- **Border Radius**: `14–16px` for cards, `20px` for pills/badges
- **No external UI library** – all components are built with React Native primitives
