# Firebase Deployment Instructions for PersonalCook

## Current Status ✅

Your repository is **already configured** for Firebase deployment! The following is already set up:

- ✅ GitHub Actions workflow (`.github/workflows/firebase-deploy.yml`)
- ✅ EAS Build configuration (`eas.json`)
- ✅ Firebase configuration (`.firebaserc`, `firebase.json`)
- ✅ Proper `.gitignore` to exclude sensitive files
- ✅ Android app configuration (`app.json`)

## What You Need to Do

To complete the deployment, you need to configure **3 GitHub Secrets**. These secrets allow GitHub Actions to build and deploy your app automatically.

### Required Secrets

You need to add the following secrets to your GitHub repository:

1. **EXPO_TOKEN** - Allows EAS to build your app
2. **FIREBASE_APP_ID** - Identifies your Firebase app
3. **FIREBASE_SERVICE_ACCOUNT** - Allows deployment to Firebase

### Step-by-Step Guide

#### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `personalcook-app` (or any name you prefer)
4. Follow the setup wizard
5. Click "Create project"

#### Step 2: Register Android App in Firebase

1. In your Firebase project, click the Android icon (⚙️ > Project Settings > Your apps)
2. Click "Add app" and select Android
3. Enter these details:
   - **Package name**: `com.personalcook.app` (MUST match exactly)
   - **App nickname**: `PersonalCook`
4. Click "Register app"
5. **Download the `google-services.json` file** - Save this for later
6. Click "Continue" and "Continue to console"

#### Step 3: Enable Firebase App Distribution

1. In Firebase Console, navigate to **App Distribution** (in the sidebar)
2. Click "Get started"
3. Create a tester group:
   - Click "Testers & Groups" tab
   - Click "Add group"
   - **Group name**: `testers` (MUST be exactly this name)
   - Add email addresses of people who should receive the app
   - Click "Save"

#### Step 4: Get Firebase App ID

1. In Firebase Console, go to **Project Settings** (⚙️ icon)
2. Scroll down to "Your apps" section
3. Find your Android app (PersonalCook)
4. Copy the **App ID** - it looks like: `1:123456789:android:abcdef123456`
5. **Save this** - you'll need it for the `FIREBASE_APP_ID` secret

#### Step 5: Create Firebase Service Account

1. In Firebase Console, go to **Project Settings** > **Service Accounts**
2. Click "Generate new private key"
3. Click "Generate key" 
4. A JSON file will be downloaded
5. **Keep this file secure!** It contains credentials for deploying to Firebase
6. Open the JSON file in a text editor and **copy the entire contents**

#### Step 6: Create Expo Account and Get Token

1. Go to [expo.dev](https://expo.dev) and sign up/log in
2. In your browser, go to: [Expo Access Tokens](https://expo.dev/settings/access-tokens)
   - Or navigate: Account Settings > Access Tokens
3. Click "Create Token"
4. Name: `GitHub Actions` (or any name)
5. **Copy the token** (you'll only see it once!)

#### Step 7: Add GitHub Secrets

1. Go to your GitHub repository: `https://github.com/aadesh2410/PersonalCook`
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **"New repository secret"** and add each secret:

##### Secret 1: EXPO_TOKEN
- **Name**: `EXPO_TOKEN`
- **Value**: Paste the Expo access token from Step 6

##### Secret 2: FIREBASE_APP_ID
- **Name**: `FIREBASE_APP_ID`
- **Value**: Paste the Firebase App ID from Step 4
  - Example: `1:123456789:android:abcdef123456`

##### Secret 3: FIREBASE_SERVICE_ACCOUNT
- **Name**: `FIREBASE_SERVICE_ACCOUNT`
- **Value**: Paste the **entire contents** of the service account JSON file from Step 5
  - Should start with `{` and end with `}`
  - Include all the JSON content

#### Step 8: Add google-services.json (Optional but Recommended)

If you want to use Firebase features in your app (Analytics, Crashlytics, etc.):

1. Take the `google-services.json` file you downloaded in Step 2
2. Place it in the root of your project directory
3. Commit and push it to your repository:
   ```bash
   git add google-services.json
   git commit -m "Add Firebase configuration"
   git push
   ```

**Note:** The file is already in `.gitignore`, so it won't be committed by default. You can either:
- Remove it from `.gitignore` and commit it (safe for public Firebase config)
- Or keep it local and upload it manually when needed

For this deployment, **you don't need to commit it** - the workflow will work without it.

#### Step 9: Trigger the Build

Once you've added all three secrets, you can trigger a build in two ways:

**Option A: Automatic (Recommended)**
1. Make any small change to your repository (e.g., update README.md)
2. Commit and push to the `main` branch
3. GitHub Actions will automatically start building

**Option B: Manual Trigger**
1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **"Build and Deploy to Firebase"** workflow
4. Click **"Run workflow"** button
5. Select `main` branch
6. Click **"Run workflow"**

#### Step 10: Monitor the Build

1. Go to the **Actions** tab in your GitHub repository
2. Click on the running workflow
3. Watch the build progress:
   - ⏳ **Build Android APK** - Takes 15-25 minutes
   - ⏳ **Deploy to Firebase App Distribution** - Takes 1-2 minutes
4. If successful, you'll see ✅ green checkmarks

#### Step 11: Download the APK

Once the build completes successfully:

**Method 1: From GitHub Actions (Easiest)**
1. Go to the completed workflow run in GitHub Actions
2. Scroll down to "Artifacts" section
3. Download **"PersonalCook-APK"**
4. Extract the ZIP file to get the APK
5. Transfer to your Android phone and install

**Method 2: From Firebase App Distribution**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Open your project
3. Navigate to **App Distribution**
4. Click on the latest release
5. Click **"Download"** to get the APK
6. Or click **"Copy link"** and share with testers

**Method 3: Email Notification (If you're a tester)**
1. Check your email (including spam folder)
2. Open the email from Firebase App Distribution
3. Click "Download the latest build"
4. Install on your Android device

## Troubleshooting

### Build Fails with "No Expo token found"
- Verify you added the `EXPO_TOKEN` secret correctly
- Make sure there are no extra spaces
- Try creating a new token on Expo

### Build Fails with "Invalid credentials"
- Check that `FIREBASE_SERVICE_ACCOUNT` contains valid JSON
- Ensure you copied the entire JSON file content
- Verify there are no extra spaces or characters

### APK Installation Fails on Android
- Enable "Install from unknown sources" in Android Settings
- Check if you have enough storage space
- Try downloading the APK again

### Workflow Doesn't Start
- Make sure you're pushing to the `main` branch
- Check that the workflow file exists in `.github/workflows/`
- Verify you have proper permissions on the repository

### Build Takes Too Long or Times Out
- EAS builds can take 15-30 minutes
- The workflow has a 30-minute timeout
- Check the EAS Build dashboard for status: https://expo.dev/accounts/[your-account]/builds

## Next Steps After Successful Deployment

Once your APK is built and deployed:

1. **Install on Your Device**
   - Download the APK
   - Enable "Install from unknown sources"
   - Install and test the app

2. **Add More Testers**
   - Go to Firebase App Distribution
   - Add more emails to the "testers" group
   - They'll receive notifications for new builds

3. **Automatic Updates**
   - Every push to `main` branch will trigger a new build
   - Testers will automatically receive notifications
   - No manual intervention needed!

## Cost Breakdown

| Service | Cost |
|---------|------|
| Firebase App Distribution | FREE ✨ |
| Expo EAS Build (Free tier) | FREE ✨ (30 builds/month) |
| GitHub Actions (Public repo) | FREE ✨ |
| **Total Monthly Cost** | **$0** 🎉 |

## Security Reminders

- ✅ Never commit sensitive files to the repository
- ✅ Keep your service account JSON file secure
- ✅ Rotate access tokens periodically
- ✅ Only add trusted testers to Firebase App Distribution

## Support

If you need help:
1. Check the [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed documentation
2. Review GitHub Actions logs for error details
3. Check Firebase Console for deployment status
4. Review Expo EAS Build logs: https://expo.dev

---

**Ready to deploy?** Follow Steps 1-9 above, then trigger the build! 🚀
