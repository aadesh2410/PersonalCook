# 📱 Get PersonalCook Without Node.js

**Don't have Node.js installed? No problem!** This guide shows you how to get PersonalCook on your phone without installing Node.js on your computer.

---

## 🎯 Best Option: Use Pre-Published QR Code

### What You Need:
- A smartphone (Android or iOS)
- Expo Go app (free)
- Internet connection

### Step-by-Step Instructions:

#### 1. Install Expo Go App

**For Android:**
1. Open Google Play Store on your phone
2. Search for "Expo Go"
3. Tap "Install"
4. Wait for installation to complete

**For iPhone:**
1. Open App Store on your phone
2. Search for "Expo Go"
3. Tap "Get"
4. Wait for installation to complete

#### 2. Scan the QR Code Below

<div align="center">

### 📱 PersonalCook App QR Code

**Coming Soon!**

Currently, to use PersonalCook, someone needs to publish the app first. Here's how:

</div>

---

## 🚀 Alternative: Ask Someone to Publish It For You

If you know someone with Node.js installed, they can publish the app and share the QR code with you:

### For the Person Publishing (needs Node.js):

```bash
# 1. Navigate to the PersonalCook folder
cd PersonalCook

# 2. Install dependencies
npm install

# 3. Install Expo CLI globally
npm install -g expo-cli

# 4. Start the development server
npm start
```

After running `npm start`, a QR code will appear in the terminal. Share this QR code with the person who wants to use the app!

**Important Notes:**
- The computer running `npm start` needs to stay on and connected
- Both the computer and phone must be on the same WiFi network
- This is perfect for family/personal use

---

## 🌐 Alternative: Use Expo's EAS Update (Permanent Link)

For a permanent solution that doesn't require keeping a computer running:

### Requirements:
- Someone with Node.js (one-time setup)
- Free Expo account

### Steps (for the person with Node.js):

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo (create free account at expo.dev)
eas login

# 3. Configure the project
cd PersonalCook
eas build:configure

# 4. Create an update
eas update --branch production --message "PersonalCook release"
```

This creates a permanent link and QR code that anyone can use without needing the development server running!

---

## 🎁 Easiest Solution: Pre-Built APK (Android Only)

For Android users, the easiest option is to use a pre-built APK file:

### For the Person Building (needs Node.js, one-time):

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Build Android APK
cd PersonalCook
eas build --platform android --profile preview
```

This creates an APK file that can be downloaded and installed directly on Android phones, no Expo Go needed!

### For the Person Installing:

1. Download the APK file (link provided after build)
2. Tap the file to install
3. Enable "Install from unknown sources" if prompted
4. Open the app!

---

## 📞 Need Help?

### Option 1: Ask the Repository Owner
Open an issue on GitHub requesting a published version:
- Go to: https://github.com/aadesh2410/PersonalCook/issues
- Click "New Issue"
- Ask for a published QR code or APK file

### Option 2: Find Someone with Node.js
Ask a friend, family member, or colleague who has Node.js to help you:
- They can publish it once
- Share the QR code or APK with you
- Takes them about 10 minutes

### Option 3: Install Node.js (Recommended Long-Term)
If you plan to customize or maintain the app:
1. Visit: https://nodejs.org
2. Download the LTS (Long Term Support) version
3. Install it on your computer
4. Follow the regular setup in [README.md](README.md)

---

## 🤔 Why Do I Need Node.js?

PersonalCook is built with React Native and Expo, which are JavaScript technologies that require Node.js to run the development server. However, once the app is published or built, end users don't need Node.js - they just need:
- Expo Go app (for published versions), OR
- The APK/IPA file (for standalone builds)

---

## ✅ Quick Comparison

| Method | Need Node.js? | Setup Time | Best For |
|--------|--------------|------------|----------|
| **Published QR Code** | No | 2 minutes | Quick testing |
| **APK File (Android)** | No | 5 minutes | Daily use |
| **Development Server** | Yes | 10 minutes | Development |
| **App Store/Play Store** | No | 2-7 days | Public release |

---

## 🎉 Summary

**If you don't have Node.js:**
1. ✅ Ask someone to publish the app for you (10 minutes, one-time)
2. ✅ Request a pre-built APK for Android (easiest)
3. ✅ Ask the repo owner to provide a published version
4. ✅ Or install Node.js yourself (recommended if you want to customize)

**Once published, you can:**
- Scan a QR code with Expo Go
- Install directly on your phone
- Share with friends and family
- Use without any computer setup

---

**Ready to get started? Check [MOBILE_SETUP.md](MOBILE_SETUP.md) for more detailed instructions!** 🍳
