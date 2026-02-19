# PersonalCook 🍳

A mobile application that acts as your personal daily cook by suggesting what to prepare every day. Designed for Indian families (Maharashtrian cuisine), this app helps you decide on breakfast, lunch, and dinner with intelligent recommendations.

## Features

✨ **Smart Recommendations**
- AI-powered recommendation algorithm that suggests meals based on when they were last prepared
- Prevents meal repetition by tracking preparation history
- Separate recommendations for breakfast, lunch, and dinner

🍛 **Maharashtrian Cuisine Database**
- Pre-loaded with 25+ authentic Maharashtrian food items
- Includes popular dishes like Poha, Misal Pav, Thalipeeth, Masale Bhaat, and more
- Categorized by meal type and preparation style

📝 **Custom Food Management**
- Add your own food items to the database
- Specify meal types (breakfast, lunch, dinner)
- Delete custom items as needed

📅 **Meal History Tracking**
- Track what you've prepared and when
- View complete meal history organized by date
- Mark meals as prepared with a single tap

📱 **Cross-Platform**
- Single codebase for both iOS and Android
- Built with React Native and Expo
- Works on both platforms seamlessly

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Bottom Tabs)
- **Storage**: AsyncStorage (local data persistence)
- **UI**: Native React Native components

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo Go app on your phone (for testing)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/aadesh2410/PersonalCook.git
   cd PersonalCook
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - **iOS**: Scan the QR code with Camera app
   - **Android**: Scan the QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## How to Use

### 1. View Recommendations
- Open the app to see today's meal recommendations
- Recommendations are shown for breakfast, lunch, and dinner
- Each meal shows 3 suggestions

### 2. Mark Meals as Prepared
- Tap on a recommended meal to select it
- Tap the "Mark as Prepared" button to record it
- The app will update recommendations based on this

### 3. Manage Food Items
- Navigate to the "Manage Foods" tab
- Tap "+ Add New" to add custom food items
- Specify the name, category, and meal types
- Delete custom items by tapping "Delete"

### 4. View History
- Navigate to the "History" tab
- See all meals you've prepared organized by date
- Track your meal variety over time

## Deployment

### For Personal Use (Recommended)

**Option 1: Expo Go App (Easiest)**
- Both users install Expo Go from App Store/Play Store
- Share the app link or QR code from `npm start`
- Scan and use the app directly

**Option 2: Development Build**
```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android
```

**Option 3: Expo Application Services (EAS)**
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for both platforms
eas build --platform all
```

### For App Store/Play Store (Advanced)

1. **iOS (App Store)**
   - Requires Apple Developer account ($99/year)
   - Build with EAS: `eas build --platform ios`
   - Submit: `eas submit --platform ios`

2. **Android (Play Store)**
   - Requires Google Play Developer account ($25 one-time)
   - Build with EAS: `eas build --platform android`
   - Submit: `eas submit --platform android`

## Project Structure

```
PersonalCook/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── MealCard.tsx
│   ├── screens/          # Main screens
│   │   ├── HomeScreen.tsx
│   │   ├── ManageScreen.tsx
│   │   └── HistoryScreen.tsx
│   ├── services/         # Business logic
│   │   ├── storageService.ts
│   │   └── recommendationService.ts
│   ├── data/            # Initial data
│   │   └── foodItems.ts
│   └── types/           # TypeScript types
│       └── index.ts
├── App.tsx              # Main app component
├── package.json         # Dependencies
└── README.md           # This file
```

## Recommendation Algorithm

The app uses a smart algorithm to suggest meals:

1. **Recency Score**: Calculates days since each food item was last prepared
2. **Prioritization**: Items not prepared recently get higher scores
3. **Randomization**: Adds variety by randomly selecting from top candidates
4. **Meal Type Filtering**: Only shows items appropriate for the meal type

## Data Storage

- All data is stored locally on the device using AsyncStorage
- No internet connection required
- Data persists between app sessions
- Includes:
  - Food items (default + custom)
  - Meal preparation history

## Customization

### Adding More Default Food Items

Edit `src/data/foodItems.ts` to add more items to the initial database.

### Changing Colors

Update the color scheme in the screen StyleSheet objects:
- Primary color: `#FF6B35` (orange)
- Success color: `#4CAF50` (green)
- Background: `#f5f5f5` (light gray)

### Modifying Recommendations

Edit `src/services/recommendationService.ts` to change:
- Number of recommendations per meal
- Scoring algorithm
- Randomization logic

## Troubleshooting

### App won't start
```bash
# Clear cache and restart
npm start -- --clear
```

### Build errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Storage issues
- Clear app data from device settings
- Reinstall the app

## Future Enhancements

- [ ] Cloud sync between devices
- [ ] Grocery list generation
- [ ] Recipe instructions
- [ ] Nutritional information
- [ ] Multi-user support
- [ ] Meal planning calendar
- [ ] Regional cuisine options (North Indian, South Indian, etc.)

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT License - Feel free to use and modify for your personal use.

## Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ for Indian families who struggle with the daily "what should we cook?" question!**
