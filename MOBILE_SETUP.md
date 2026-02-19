# 📱 Get PersonalCook on Your Mobile Device

This guide will help you install and run PersonalCook on your Android or iOS device. Choose the method that works best for you!

---

## 🎯 Quick Overview

There are **3 ways** to get PersonalCook on your mobile:

| Method | Time | Cost | Best For |
|--------|------|------|----------|
| **Expo Go** (Recommended) | 5 minutes | FREE | Testing & personal use |
| **Standalone App** | 30 minutes | FREE | Daily use without Expo Go |
| **App Stores** | 2-7 days | $25-$99 | Public distribution |

---

## ⚡ Method 1: Expo Go (Easiest - Recommended)

**Perfect for:** Quick testing and personal use  
**Requirements:** Computer with the code + WiFi + Expo Go app

### Step-by-Step Instructions

#### A. Install Expo Go on Your Phone

**For Android:**
1. Open Google Play Store
2. Search for "Expo Go"
3. Tap "Install"
4. Wait for installation to complete

**For iPhone:**
1. Open App Store
2. Search for "Expo Go"
3. Tap "Get"
4. Wait for installation to complete

#### B. Start the App on Your Computer

1. Open Terminal (Mac/Linux) or Command Prompt (Windows)
2. Navigate to the PersonalCook folder:
   ```bash
   cd PersonalCook
   ```
3. Install dependencies (first time only):
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. A QR code will appear in the terminal/browser

#### C. Open on Your Phone

**For Android:**
1. Open the Expo Go app
2. Tap "Scan QR code" button
3. Point camera at the QR code in terminal
4. Wait for the app to load (10-30 seconds)
5. Done! The app is now running

**For iPhone:**
1. Open the default Camera app
2. Point at the QR code in terminal
3. Tap the notification banner that appears
4. The app will open in Expo Go
5. Done! The app is now running

### ⚠️ Important Notes

- ✅ Your phone and computer must be on the **same WiFi network**
- ✅ Keep the terminal running while using the app
- ✅ You can close and reopen Expo Go - the app will still be there
- ✅ Each phone has its own independent data storage
- ✅ To update the app, just shake your phone and tap "Reload"

### 🔧 Troubleshooting

**Problem: QR code doesn't scan**
- Make sure your phone camera can focus on the QR code
- Try increasing brightness on your computer screen
- Try running: `npm start -- --tunnel`

**Problem: "Unable to connect to Metro"**
- Verify both devices are on the same WiFi network
- Try restarting: Press `Ctrl+C` then run `npm start -- --clear`
- Disable VPN if you have one running

**Problem: App shows error on load**
- Clear Expo cache: Shake phone > "Reload"
- Restart the development server
- Check terminal for error messages

---

## 🚀 Method 2: Standalone App Build (No Expo Go Needed)

**Perfect for:** Daily use without needing your computer  
**Requirements:** Expo account (free)

### Why Choose This Method?

- ✅ App works independently (no Expo Go needed)
- ✅ No need to run computer server every time
- ✅ Feels like a "real" app
- ✅ Still FREE!

### Step-by-Step Instructions

#### 1. Install EAS CLI

On your computer:
```bash
npm install -g eas-cli
```

#### 2. Login to Expo

```bash
eas login
```

If you don't have an account, create one at https://expo.dev (it's free!)

#### 3. Configure EAS Build (First Time Only)

```bash
cd PersonalCook
eas build:configure
```

Press Enter to accept the defaults.

#### 4. Build for Your Platform

**For Android:**
```bash
eas build --platform android --profile preview
```

**For iPhone:**
```bash
eas build --platform ios --profile preview
```
Note: iOS builds require an Apple Developer account ($99/year). For free iOS testing, stick with Expo Go.

#### 5. Wait for Build

- The build happens on Expo's servers (15-30 minutes)
- You'll receive an email when it's done
- You can close the terminal - the build continues in the cloud

#### 6. Install on Your Phone

**For Android:**
1. You'll receive a download link (via email or terminal)
2. Open the link on your Android phone
3. Download the `.apk` file
4. Tap to install (you may need to allow "Install from unknown sources")
5. Open the app from your app drawer!

**For iPhone:**
1. Install via TestFlight (link provided in email)
2. Or use direct installation (requires paid Apple Developer account)

### 🔧 Troubleshooting

**Problem: Build fails**
- Check your internet connection
- Make sure you're logged in: `eas whoami`
- Clear cache: `npm install`

**Problem: Android won't install APK**
- Go to Settings > Security
- Enable "Unknown sources" or "Install unknown apps"
- Try installing again

---

## 🏪 Method 3: Publish to App Stores (Advanced)

**Perfect for:** Sharing with others or public distribution  
**Requirements:** Developer accounts + fees

### Google Play Store (Android)

**Cost:** $25 (one-time fee)  
**Time:** 2-3 days for review

#### Steps:

1. **Create Google Play Developer Account**
   - Visit: https://play.google.com/console
   - Pay the $25 registration fee
   - Complete your developer profile

2. **Build Production APK**
   ```bash
   eas build --platform android --profile production
   ```

3. **Submit to Play Store**
   ```bash
   eas submit --platform android
   ```

4. **Complete Store Listing**
   - Add app description, screenshots, category
   - Set pricing (usually free)
   - Submit for review

5. **Wait for Approval**
   - Usually takes 1-3 days
   - You'll receive email when approved
   - App goes live automatically!

### Apple App Store (iOS)

**Cost:** $99/year  
**Time:** 3-7 days for review

#### Steps:

1. **Create Apple Developer Account**
   - Visit: https://developer.apple.com
   - Enroll in the developer program ($99/year)
   - Complete verification (can take 1-2 days)

2. **Build Production IPA**
   ```bash
   eas build --platform ios --profile production
   ```

3. **Submit to App Store**
   ```bash
   eas submit --platform ios
   ```

4. **Complete Store Listing**
   - Use App Store Connect
   - Add screenshots, description, keywords
   - Set pricing and availability

5. **Wait for Review**
   - Usually takes 2-7 days
   - Apple may request changes
   - Once approved, you can publish!

---

## 📊 Comparison: Which Method Should You Choose?

### Choose Expo Go if:
- ✅ You want to try the app quickly
- ✅ You're OK keeping your computer running
- ✅ It's just for you or a few family members
- ✅ You want to make changes easily

### Choose Standalone Build if:
- ✅ You want the app to work without Expo Go
- ✅ You want it to feel like a real app
- ✅ You don't want to run your computer every time
- ✅ It's still just for personal use

### Choose App Stores if:
- ✅ You want to share with many people
- ✅ You want the app to be easily discoverable
- ✅ You're willing to pay the fees
- ✅ You can wait for the review process

---

## 💡 Recommended Path for Personal Use

For most users, we recommend this progression:

1. **Start with Expo Go** (5 minutes)
   - Test the app and make sure you like it
   - Make any customizations you want

2. **Upgrade to Standalone Build** (30 minutes)
   - Once you're happy with the app
   - For daily use without Expo Go

3. **Consider App Stores** (optional)
   - Only if you want to share publicly
   - Or if you want automatic updates

---

## 🆘 Common Issues & Solutions

### "App is slow to load"
- This is normal for first load (downloads JavaScript bundle)
- Subsequent loads will be much faster
- Standalone builds load faster than Expo Go

### "Data is not syncing between phones"
- This is expected! Each phone has independent data
- The app stores data locally on each device
- Future versions may add cloud sync

### "App crashes on startup"
- Clear app data: Long press app icon > App info > Clear data
- Reinstall the app
- Check if you're on the latest version

### "Can't scan QR code through Expo Go"
- Make sure Expo Go has camera permissions
- Try increasing screen brightness
- Use manual connection: Type the URL shown in terminal

### "Changes I made aren't showing up"
- For Expo Go: Shake phone > Reload
- For Standalone: Build and install new version
- Clear cache if needed

---

## 📞 Need More Help?

1. **Check detailed guides:**
   - [QUICKSTART.md](QUICKSTART.md) - Quick 5-minute setup
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment options
   - [README.md](README.md) - Full app documentation

2. **Common Resources:**
   - Expo Documentation: https://docs.expo.dev
   - Expo Forums: https://forums.expo.dev
   - GitHub Issues: https://github.com/aadesh2410/PersonalCook/issues

3. **Still stuck?**
   - Open an issue on GitHub with:
     - What method you're trying
     - What step you're stuck on
     - Any error messages you see
     - Your phone type (Android/iOS)

---

## ✅ Quick Checklist

Before you start, make sure you have:

- [ ] Node.js installed on your computer
- [ ] PersonalCook code downloaded/cloned
- [ ] WiFi connection (same network for phone and computer)
- [ ] Expo Go app installed (Method 1)
- [ ] OR Expo account created (Method 2)
- [ ] OR Developer account + fees paid (Method 3)

---

**Ready to get started? Follow Method 1 above for the fastest way to get PersonalCook on your phone!** 🎉

**Happy Cooking! 🍳**
