# Quick Start Guide

Get PersonalCook running on your phones in 5 minutes!

## Step 1: Install Expo Go

### On Android (Your Wife's Phone):
1. Open Google Play Store
2. Search for "Expo Go"
3. Install the app

### On iOS (Your Phone):
1. Open App Store
2. Search for "Expo Go"
3. Install the app

## Step 2: Start the Development Server

On your computer:

```bash
cd PersonalCook
npm install  # First time only
npm start
```

A QR code will appear in the terminal.

## Step 3: Open on Your Phones

### Android:
1. Open the Expo Go app
2. Tap "Scan QR code"
3. Scan the QR code from terminal
4. App will load!

### iOS:
1. Open the Camera app
2. Point at the QR code
3. Tap the notification that appears
4. App will open in Expo Go!

## Important Notes

✅ **Both phones must be on the same WiFi network as your computer**

✅ **Keep the terminal running** - Don't close it while using the app

✅ **The app saves data locally** - Each phone has its own data

## Using the App

### 1. View Today's Recommendations
- The home screen shows 3 suggestions each for breakfast, lunch, and dinner
- Tap on a meal to select it
- Tap "Mark as Prepared" to record it

### 2. Add Your Own Food Items
- Go to "Manage Foods" tab
- Tap "+ Add New"
- Enter food name, category, and meal types
- Tap "Add"

### 3. View History
- Go to "History" tab
- See all meals you've prepared
- Organized by date

## Troubleshooting

**Can't see the QR code?**
- Try running: `npm start -- --tunnel`

**App won't connect?**
- Make sure you're on the same WiFi
- Restart the server: `npm start -- --clear`

**App crashes?**
- Shake your phone
- Tap "Reload"

## Next Steps

Once you're happy with the app, check out [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Creating a standalone app (no Expo Go needed)
- Publishing to App Store/Play Store
- Offline usage

---

**Enjoy your PersonalCook! 🍳**
