# Deployment Guide for PersonalCook

This guide will help you deploy the PersonalCook app so both you and your wife can use it on your phones (iOS and Android).

> 📱 **For a comprehensive, user-friendly mobile setup guide, see [MOBILE_SETUP.md](MOBILE_SETUP.md)**  
> This guide contains the same information with more detailed explanations and troubleshooting.

## Quick Start (Easiest Method)

### Using Expo Go App

This is the fastest way to get started - **no app store submission needed!**

#### For Android Users (Your Wife):

1. **Install Expo Go**
   - Open Google Play Store
   - Search for "Expo Go"
   - Install the app

2. **Run the PersonalCook app**
   - On your computer, navigate to the PersonalCook folder
   - Run: `npm start`
   - A QR code will appear in the terminal
   - Open Expo Go app on the phone
   - Tap "Scan QR code"
   - Scan the QR code from the terminal
   - The app will load and run!

#### For iOS Users (You):

1. **Install Expo Go**
   - Open App Store
   - Search for "Expo Go"
   - Install the app

2. **Run the PersonalCook app**
   - Follow the same steps as Android
   - Or: Open the Camera app and scan the QR code directly
   - Tap the notification that appears
   - The app will open in Expo Go

### Important Notes:
- You need to keep `npm start` running on your computer
- Both phones need to be on the same WiFi network as your computer
- The app will work even when you close and reopen Expo Go
- To update the app, just refresh in Expo Go

## Method 2: Development Build (Recommended for Daily Use)

This creates a standalone app that doesn't require Expo Go.

### Prerequisites:
```bash
npm install -g eas-cli
eas login  # Create an Expo account if you don't have one
```

### Build for Android:
```bash
# Configure EAS (first time only)
eas build:configure

# Create Android build
eas build --platform android --profile preview

# Download and install the .apk file on the Android phone
```

### Build for iOS:
```bash
# Create iOS build (requires Apple Developer account - $99/year)
eas build --platform ios --profile preview

# Install using TestFlight or direct installation
```

## Method 3: App Store Distribution (Advanced)

### For Play Store (Android):

1. **Create Google Play Developer Account**
   - Cost: $25 (one-time fee)
   - Visit: https://play.google.com/console

2. **Build Production APK**
   ```bash
   eas build --platform android --profile production
   ```

3. **Upload to Play Store**
   ```bash
   eas submit --platform android
   ```

4. **Publish**
   - Complete the store listing
   - Set up pricing (free)
   - Publish the app

### For App Store (iOS):

1. **Create Apple Developer Account**
   - Cost: $99/year
   - Visit: https://developer.apple.com

2. **Build Production IPA**
   ```bash
   eas build --platform ios --profile production
   ```

3. **Upload to App Store**
   ```bash
   eas submit --platform ios
   ```

4. **Publish**
   - Complete the store listing in App Store Connect
   - Submit for review
   - Publish once approved

## Local Network Setup (Free Alternative)

If you want to use the app without Expo Go on your local network:

### 1. Start the Expo server:
```bash
npm start
```

### 2. Access via LAN:
- Make note of the local IP address shown in the terminal
- Share this with your wife's phone
- Open in Expo Go or a browser

## Troubleshooting

### "Can't connect to Metro"
- Make sure your phone and computer are on the same WiFi
- Try restarting the Expo server: `npm start -- --clear`

### "Build failed"
- Check your internet connection
- Make sure all dependencies are installed: `npm install`
- Try clearing cache: `rm -rf node_modules && npm install`

### "App crashes on startup"
- Clear the app data from phone settings
- Reinstall the app
- Check the logs in Expo Go

## Updating the App

After making changes to the code:

### For Expo Go:
- Just refresh the app in Expo Go (shake the phone > Reload)

### For Development Build:
- Create a new build and redistribute

### For App Store/Play Store:
- Increment version in `app.json`
- Create new build
- Submit update

## Cost Summary

| Method | Cost | Time | Complexity |
|--------|------|------|------------|
| Expo Go | Free | 5 min | Easy |
| Development Build | Free | 30 min | Medium |
| Play Store | $25 one-time | 2-3 days | Medium |
| App Store | $99/year | 3-7 days | Hard |

## Recommendation

For personal use by just you and your wife:
1. Start with **Expo Go** (free, instant)
2. If you like it, upgrade to **Development Build** (free, no Expo Go needed)
3. Only go to app stores if you want to share with others

## Support

If you run into issues:
1. Check the Expo documentation: https://docs.expo.dev
2. Visit Expo forums: https://forums.expo.dev
3. Check GitHub issues in the repository

---

**Need help? Open an issue on GitHub!**
