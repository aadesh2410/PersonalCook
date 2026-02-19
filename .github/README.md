# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the PersonalCook app.

## Workflows

### firebase-deploy.yml

**Purpose:** Automatically builds and deploys the Android APK to Firebase App Distribution.

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**What it does:**
1. Builds Android APK using Expo EAS
2. Waits for build completion
3. Downloads the built APK
4. Deploys to Firebase App Distribution
5. Notifies testers about new version

**Required Secrets:**
- `EXPO_TOKEN` - Expo authentication token
- `FIREBASE_APP_ID` - Firebase app identifier
- `FIREBASE_SERVICE_ACCOUNT` - Firebase service account credentials (JSON)

**Setup:** See [FIREBASE_SETUP.md](../FIREBASE_SETUP.md) for complete setup instructions.

## Monitoring Builds

To check build status:
1. Go to the "Actions" tab in GitHub
2. Select the workflow run
3. View logs for each step

## Troubleshooting

If builds fail:
1. Check the workflow logs for error messages
2. Verify all secrets are configured correctly
3. Ensure Expo and Firebase credentials are valid
4. See [FIREBASE_SETUP.md](../FIREBASE_SETUP.md) troubleshooting section

## Manual Trigger

To manually trigger a build:
1. Go to Actions tab
2. Select "Build and Deploy to Firebase"
3. Click "Run workflow"
4. Select `main` branch
5. Click "Run workflow" button
