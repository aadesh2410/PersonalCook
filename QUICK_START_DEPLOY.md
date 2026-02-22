# 🚀 Quick Start: Deploy to Firebase

## ⚡ TL;DR - What You Need to Do

Your app is ready to deploy! Just add 3 secrets to GitHub:

```
1. EXPO_TOKEN           → Get from expo.dev/settings/access-tokens
2. FIREBASE_APP_ID      → Get from Firebase Console > Project Settings
3. FIREBASE_SERVICE_ACCOUNT → Generate in Firebase Console > Service Accounts
```

Then push to main branch or manually trigger the workflow.

---

## 📋 Checklist

### Pre-Setup (One-time, ~20 minutes)

- [ ] Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
  - Project name: `personalcook-app` (or your choice)
  
- [ ] Register Android app in Firebase
  - Package: `com.personalcook.app` (MUST be exact)
  - Download `google-services.json` (save for later)
  
- [ ] Enable Firebase App Distribution
  - Create tester group: `testers`
  - Add tester email addresses
  
- [ ] Get Firebase App ID
  - Firebase Console > Project Settings > Your Apps
  - Copy the App ID (looks like: `1:123456789:android:abc123`)
  
- [ ] Generate Firebase Service Account
  - Firebase Console > Project Settings > Service Accounts
  - Click "Generate new private key"
  - Save the JSON file
  
- [ ] Create Expo account and token
  - Sign up at [expo.dev](https://expo.dev)
  - Go to Settings > Access Tokens
  - Create new token named "GitHub Actions"
  - Copy the token (shown only once!)

### Add GitHub Secrets (~5 minutes)

Go to: https://github.com/aadesh2410/PersonalCook/settings/secrets/actions

- [ ] Add `EXPO_TOKEN`
  - Paste the Expo access token
  
- [ ] Add `FIREBASE_APP_ID`
  - Paste the Firebase App ID
  
- [ ] Add `FIREBASE_SERVICE_ACCOUNT`
  - Paste the **entire JSON file contents** from service account

### Trigger Build (~25 minutes)

**Option A: Automatic**
- [ ] Push any change to `main` branch
- [ ] Build starts automatically

**Option B: Manual**
- [ ] Go to GitHub Actions tab
- [ ] Select "Build and Deploy to Firebase"
- [ ] Click "Run workflow"

### Download APK

**From GitHub:**
- [ ] Go to completed workflow run
- [ ] Download "PersonalCook-APK" artifact
- [ ] Extract and install on Android

**From Firebase:**
- [ ] Firebase Console > App Distribution
- [ ] Download latest release

---

## 🎯 Required Information Summary

| Item | Where to Get It | What It Looks Like |
|------|----------------|-------------------|
| **Firebase Project ID** | Firebase Console | `personalcook-app` |
| **Android Package** | Already set | `com.personalcook.app` |
| **App ID** | Firebase > Project Settings | `1:123456789:android:abc...` |
| **Service Account** | Firebase > Service Accounts | JSON file (500+ lines) |
| **Expo Token** | expo.dev/settings/access-tokens | Long string of characters |

---

## 📚 Documentation Files

- **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)** - Overview and what you need to do
- **[DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md)** - Detailed step-by-step guide
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Original Firebase setup documentation

---

## 🆘 Common Issues

### "No Expo token found"
→ Verify `EXPO_TOKEN` secret is added correctly

### "Invalid credentials"
→ Check `FIREBASE_SERVICE_ACCOUNT` contains complete JSON

### Build timeout
→ Normal for first build, wait up to 30 minutes

### APK won't install
→ Enable "Install from unknown sources" in Android settings

---

## 💰 Cost: $0 (FREE)

- Firebase App Distribution: FREE
- Expo EAS Build: FREE (30 builds/month)
- GitHub Actions: FREE (public repos)

---

## ⏱️ Time Estimates

| Task | Duration |
|------|----------|
| Firebase setup | 15 minutes |
| Expo account | 5 minutes |
| Add GitHub secrets | 5 minutes |
| **First build** | **20-25 minutes** |
| Future builds | 15-20 minutes (automatic!) |

---

## ✅ After Setup

Every push to `main` will:
1. ✅ Automatically build new APK
2. ✅ Deploy to Firebase
3. ✅ Notify testers via email
4. ✅ Upload to GitHub Actions artifacts

**No manual work required!** 🎉

---

## 🔗 Quick Links

- [Firebase Console](https://console.firebase.google.com/)
- [Expo Settings](https://expo.dev/settings/access-tokens)
- [GitHub Secrets](https://github.com/aadesh2410/PersonalCook/settings/secrets/actions)
- [GitHub Actions](https://github.com/aadesh2410/PersonalCook/actions)

---

**Questions?** Check the detailed guides or let me know! 🚀
