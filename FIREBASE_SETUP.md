# Firebase Deployment Setup Guide

This guide will help you set up automated deployment of the PersonalCook app to Firebase App Distribution, allowing users to download and install the app directly on their Android devices without using Expo Go.

## Overview

The deployment process uses:
- **Expo Application Services (EAS)** - To build standalone Android APK
- **GitHub Actions** - To automate the build process
- **Firebase App Distribution** - To distribute the APK to users

Once set up, every push to the `main` branch will automatically:
1. Build a new Android APK
2. Deploy it to Firebase App Distribution
3. Notify users about the new version

## Prerequisites

Before setting up, you need:
- A Firebase account (free)
- An Expo account (free)
- Access to the GitHub repository settings

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `personalcook-app`
4. Follow the setup wizard (you can disable Google Analytics if not needed)
5. Click "Create project"

## Step 2: Register Android App in Firebase

1. In your Firebase project, click the Android icon to add an Android app
2. Enter the package name: `com.personalcook.app`
   - This must match the package name in `app.json`
3. App nickname: `PersonalCook`
4. Click "Register app"
5. Download the `google-services.json` file (we'll need this later)
6. Click "Continue" through the remaining steps

## Step 3: Enable Firebase App Distribution

1. In Firebase Console, navigate to **App Distribution** (in the sidebar under "Release & Monitor")
2. Click "Get started"
3. You'll see your registered Android app
4. Create a tester group:
   - Click "Testers & Groups" tab
   - Click "Add group"
   - Group name: `testers`
   - Add email addresses of people who should receive the app
   - Click "Save"

## Step 4: Create Firebase Service Account

1. Go to Firebase Project Settings > Service Accounts
2. Click "Generate new private key"
3. Click "Generate key" - a JSON file will be downloaded
4. **Keep this file secure!** It contains credentials for deploying to Firebase

## Step 5: Create Expo Account and Get Token

1. Go to [expo.dev](https://expo.dev) and sign up/log in
2. In your terminal, run:
   ```bash
   npm install -g eas-cli
   eas login
   ```
3. Create an access token:
   ```bash
   eas credentials
   ```
   Or get it from: https://expo.dev/accounts/[your-account]/settings/access-tokens
4. Click "Create Token"
5. Name: `GitHub Actions`
6. Copy the token (you'll only see it once!)

## Step 6: Configure GitHub Repository Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click "New repository secret" and add each of these:

### Secret 1: EXPO_TOKEN
- Name: `EXPO_TOKEN`
- Value: The Expo access token from Step 5

### Secret 2: FIREBASE_APP_ID
- Name: `FIREBASE_APP_ID`
- Value: Your Firebase app ID
  - Find it in Firebase Console > Project Settings > Your Apps
  - Should look like: `1:123456789:android:abcdef123456`

### Secret 3: FIREBASE_SERVICE_ACCOUNT
- Name: `FIREBASE_SERVICE_ACCOUNT`
- Value: The entire contents of the service account JSON file from Step 4
  - Open the JSON file in a text editor
  - Copy all the content (including the curly braces)
  - Paste it as the secret value

## Step 7: Configure EAS Build

The repository already includes `eas.json` configuration. To complete the setup:

1. In your terminal, navigate to the project directory:
   ```bash
   cd PersonalCook
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure EAS build:
   ```bash
   eas build:configure
   ```
   - Select "All" when asked which platforms
   - Accept the default configuration

4. Add the `google-services.json` file (from Step 2) to your project root

## Step 8: Update .gitignore

Add the following to `.gitignore` to prevent committing sensitive files:

```
# Firebase
google-services.json
firebase-debug.log
.firebase/

# EAS
.eas/
```

## Step 9: Trigger Your First Build

You have two options to trigger a build:

### Option A: Automatic (on every push to main)
Just push any change to the main branch:
```bash
git add .
git commit -m "Enable Firebase deployment"
git push origin main
```

### Option B: Manual Trigger
1. Go to GitHub repository > Actions
2. Select "Build and Deploy to Firebase" workflow
3. Click "Run workflow"
4. Select the `main` branch
5. Click "Run workflow"

## Step 10: Monitor the Build

1. Go to GitHub Actions tab in your repository
2. Click on the running workflow
3. Watch the build progress:
   - ✅ Build Android APK (15-20 minutes)
   - ✅ Deploy to Firebase App Distribution (1-2 minutes)

## Step 11: Download and Install the App

Once the deployment is complete:

### For Testers:
1. You'll receive an email from Firebase App Distribution
2. Open the email on your Android phone
3. Click "Download the latest build"
4. Install the APK
   - You may need to enable "Install from unknown sources" in Settings
5. Open the app!

### Alternative: Direct Download
1. Go to Firebase Console > App Distribution
2. Click on the latest release
3. Copy the download link
4. Share this link with users
5. Users can download and install directly

## Updating the App

Every time you push changes to the `main` branch:
1. GitHub Actions automatically builds a new APK
2. The APK is deployed to Firebase App Distribution
3. Testers receive a notification about the new version
4. Users can download and install the update

## Troubleshooting

### Build fails with "No Expo token found"
- Make sure you added the `EXPO_TOKEN` secret correctly
- Verify the token hasn't expired
- Try creating a new token

### Build fails with "Invalid credentials"
- Check that `FIREBASE_SERVICE_ACCOUNT` secret contains valid JSON
- Verify you copied the entire JSON file content
- Ensure there are no extra spaces or characters

### APK installation fails on Android
- Enable "Install from unknown sources" in Android Settings
- Check if you have enough storage space
- Try downloading the APK again

### Users don't receive notifications
- Verify they were added to the "testers" group in Firebase
- Check their email (including spam folder)
- Share the direct download link as an alternative

## Advanced Configuration

### Building for iOS

To also build for iOS:

1. Get an Apple Developer account ($99/year)
2. Update the workflow file to include iOS builds
3. Add iOS app to Firebase
4. Configure iOS credentials in EAS

### Custom Release Notes

Edit the workflow file (`.github/workflows/firebase-deploy.yml`) to customize release notes:

```yaml
releaseNotes: |
  Your custom release notes here
  Version: 1.0.0
  Changes:
  - Feature 1
  - Bug fix 2
```

### Different Distribution Groups

To distribute to multiple groups:

```yaml
groups: testers,beta-testers,internal
```

## Cost Summary

| Service | Cost |
|---------|------|
| Firebase App Distribution | FREE |
| Expo EAS Build (Free tier) | FREE (30 builds/month) |
| GitHub Actions (Public repo) | FREE |
| **Total** | **FREE** ✨ |

**Note:** For private repositories, GitHub Actions may have usage limits. For more than 30 builds/month, consider [EAS Build pricing](https://expo.dev/pricing).

## Security Best Practices

1. ✅ Never commit `google-services.json` to the repository
2. ✅ Keep your Firebase service account credentials secure
3. ✅ Rotate access tokens periodically
4. ✅ Only add trusted testers to Firebase App Distribution
5. ✅ Review build logs for any exposed secrets

## Next Steps

Once your app is deployed:

1. **Monitor usage**: Check Firebase Analytics
2. **Gather feedback**: Ask testers for feedback
3. **Iterate**: Make improvements based on feedback
4. **Scale**: Add more testers as needed

## Support

If you encounter any issues:
- Check the GitHub Actions logs for error details
- Review Firebase App Distribution documentation
- Check Expo EAS Build documentation
- Open an issue on GitHub

---

**Congratulations! Your app is now set up for automated deployment!** 🎉

Every push to `main` will automatically build and distribute your app to testers without any manual intervention.
