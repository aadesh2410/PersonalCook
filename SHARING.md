# 🚀 Share PersonalCook with Friends & Family

This guide helps you share the PersonalCook app with others who want to use it.

---

## 📋 Quick Summary

PersonalCook needs to be **published or hosted** before others can access it via QR code. Here's how to do it:

---

## ✅ Option 1: Share via Development Server (Free, Temporary)

**Best for:** Testing with family on the same WiFi network

### Steps:

1. **Start the server on your computer:**
   ```bash
   cd PersonalCook
   npm start
   ```

2. **A QR code will appear in the terminal**

3. **Share the QR code:**
   - Take a screenshot
   - Or use the QR code generator:
     ```bash
     npm run generate-qr exp://YOUR-IP:8081
     ```
   - This creates `assets/qr-code.png` you can share

4. **Tell others to:**
   - Install Expo Go from App Store/Play Store
   - Scan the QR code
   - Use the app!

**Limitations:**
- ❌ Your computer must stay running
- ❌ Both devices must be on the same WiFi network
- ❌ QR code only works while server is running

---

## ✅ Option 2: Publish to Expo (Free, Permanent)

**Best for:** Permanent access without running your computer

### Steps:

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo (create free account at expo.dev):**
   ```bash
   eas login
   ```

3. **Configure the project (first time only):**
   ```bash
   cd PersonalCook
   eas build:configure
   ```

4. **Create an update/publish:**
   ```bash
   eas update --branch production --message "PersonalCook Release"
   ```

5. **You'll get a permanent URL like:**
   ```
   exp://u.expo.dev/update/abc123...
   ```

6. **Generate a QR code for this URL:**
   ```bash
   npm run generate-qr "exp://u.expo.dev/update/YOUR-PROJECT-ID"
   ```

7. **Share `assets/qr-code.png` with others!**

**Benefits:**
- ✅ Works permanently
- ✅ No need to keep computer running
- ✅ Anyone can access from anywhere
- ✅ Easy to update

---

## ✅ Option 3: Build APK for Android (Free, Standalone)

**Best for:** Android users who want a standalone app

### Steps:

1. **Install EAS CLI and login (if not done already):**
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Build Android APK:**
   ```bash
   cd PersonalCook
   eas build --platform android --profile preview
   ```

3. **Wait 15-30 minutes for build to complete**

4. **Download the APK file** (link provided in terminal/email)

5. **Share the APK file** with others via:
   - Email
   - Cloud storage (Google Drive, Dropbox, etc.)
   - Messaging apps

6. **Tell them to:**
   - Download the APK on their Android phone
   - Tap to install (may need to enable "Install from unknown sources")
   - Use the app!

**Benefits:**
- ✅ No Expo Go needed
- ✅ Works offline
- ✅ Feels like a real app
- ✅ One-time installation

---

## 🎁 What to Share with Users

### If using QR Code (Options 1 or 2):

Share these files/info:
- ✅ The QR code image (`assets/qr-code.png`)
- ✅ Instructions from [QR_CODE_README.md](QR_CODE_README.md)

**What they need:**
1. Expo Go app installed
2. Scan the QR code
3. Start using!

### If using APK (Option 3):

Share these files/info:
- ✅ The APK file
- ✅ Installation instructions:
  1. Download the APK
  2. Enable "Install from unknown sources" in Settings > Security
  3. Tap the APK to install
  4. Open the app

---

## 📱 Instructions for Recipients

Copy this message to send to users:

```
Hey! I want to share PersonalCook with you - it's a smart meal planner app.

To get it:
1. Install "Expo Go" from your App Store/Play Store
2. Open Expo Go
3. Scan this QR code (attached)
4. Wait for the app to load
5. Enjoy!

The app helps you decide what to cook every day based on what you haven't made recently. Perfect for planning meals!

Note: 
- For Android: Use Expo Go app to scan
- For iPhone: Use Camera app to scan (opens in Expo Go)
```

---

## 🔧 Updating the App

After making changes:

**If using Development Server:**
- Users just need to shake their phone in Expo Go
- Tap "Reload"

**If using Published Version:**
```bash
eas update --branch production --message "Update description"
```
Users will get the update next time they open the app

**If using APK:**
- Build a new APK
- Share the new version with users
- They need to install the new version

---

## 💡 Tips for Sharing

1. **Test first**: Make sure the app works for you before sharing
2. **Choose the right method**: 
   - Development server for quick testing
   - Published version for long-term use
   - APK for best Android experience
3. **Provide support**: Share the documentation links
4. **Gather feedback**: Users may find bugs or want features

---

## 📚 Additional Resources

For users who want more details:
- **No Node.js Setup**: [NO_NODE_SETUP.md](NO_NODE_SETUP.md)
- **QR Code Guide**: [QR_CODE_README.md](QR_CODE_README.md)
- **Full Mobile Setup**: [MOBILE_SETUP.md](MOBILE_SETUP.md)
- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)
- **Main README**: [README.md](README.md)

---

**Happy Sharing! 🍳**

If you run into issues, open a GitHub issue or check the documentation files listed above.
