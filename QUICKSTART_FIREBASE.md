# Quick Start: Firebase Deployment

This is a condensed version of the Firebase setup. For complete details, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

## Prerequisites
- Firebase account (free)
- Expo account (free)
- GitHub repository admin access

## Setup (One-Time, ~15 minutes)

### 1. Create Firebase Project
```
1. Go to https://console.firebase.google.com/
2. Create project: "personalcook-app"
3. Add Android app with package: com.personalcook.app
4. Download google-services.json
5. Enable Firebase App Distribution
6. Create tester group: "testers"
7. Add tester emails
```

### 2. Get Firebase Credentials
```
1. Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Save the JSON file
```

### 3. Get Expo Token
```bash
npm install -g eas-cli
eas login
# Create token at: https://expo.dev/accounts/[your-account]/settings/access-tokens
```

### 4. Configure GitHub Secrets
Go to GitHub repo → Settings → Secrets and variables → Actions

Add these three secrets:

| Secret Name | Value |
|------------|--------|
| `EXPO_TOKEN` | Your Expo access token |
| `FIREBASE_APP_ID` | From Firebase Console (e.g., 1:123:android:abc) |
| `FIREBASE_SERVICE_ACCOUNT` | Entire content of service account JSON |

### 5. Add google-services.json
```bash
# Place the downloaded google-services.json in project root
cp ~/Downloads/google-services.json /path/to/PersonalCook/
```

### 6. Deploy!

Push to main branch:
```bash
git add .
git commit -m "Enable Firebase deployment"
git push origin main
```

Or manually trigger in GitHub Actions tab.

## That's It! 🎉

- GitHub Actions builds the APK (15-20 min)
- Deploys to Firebase App Distribution automatically
- Testers receive email with download link
- Future pushes to `main` trigger automatic deployments

## User Installation

Users just need to:
1. Check email from Firebase
2. Click download link
3. Install APK on Android
4. Use the app!

See [HOW_TO_INSTALL.md](HOW_TO_INSTALL.md) for user instructions.

## Troubleshooting

**Build fails?**
- Check GitHub Actions logs
- Verify all secrets are set correctly
- Ensure Expo token is valid

**APK not deploying?**
- Check Firebase App ID is correct
- Verify service account JSON is complete
- Check testers group exists

**Need help?**
See full guide: [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
