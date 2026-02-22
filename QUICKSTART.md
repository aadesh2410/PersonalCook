# Quick Start Guide — iOS with Expo Go

Run PersonalCook on your iPhone in about 5 minutes using the **Expo Go** app — no developer account required!

> 📱 **For all platform options (Android, standalone builds, App Store), see [MOBILE_SETUP.md](MOBILE_SETUP.md)**

---

## What You Need

- An iPhone with **Expo Go** installed ([App Store link](https://apps.apple.com/app/expo-go/id982107779))
- A computer (Mac, Windows, or Linux) with **Node.js 18+** installed ([nodejs.org](https://nodejs.org))
- Both the iPhone and computer on the **same Wi-Fi network** *(recommended — or use tunnel mode if needed, see Troubleshooting below)*

---

## Step 1: Install Expo Go on Your iPhone

1. Open the **App Store** on your iPhone
2. Search for **"Expo Go"**
3. Tap **"Get"** and install it

---

## Step 2: Set Up the App on Your Computer

Open a terminal and run:

```bash
# 1. Clone the repository (skip if you already have the folder)
git clone https://github.com/aadesh2410/PersonalCook.git

# 2. Enter the project folder
cd PersonalCook

# 3. Install dependencies (first time only — takes ~1 minute)
npm install

# 4. Start the Expo development server
npm start
```

After `npm start`, a **QR code** will appear in the terminal (or automatically open in your browser).

---

## Step 3: Open the App on Your iPhone

1. Open the default **Camera** app on your iPhone
2. Point the camera at the **QR code** shown in the terminal or browser
3. A banner will appear at the top — tap it to open in **Expo Go**
4. The app will load in 10–30 seconds

> **Tip:** If the Camera method doesn't work, open Expo Go directly and tap **"Scan QR code"**.

---

## Step 4: Use PersonalCook

| Tab | What it does |
|-----|-------------|
| 🍳 **Recommendations** | See today's suggested meals for breakfast, lunch & dinner |
| 📝 **Manage Foods** | Add or remove food items from your personal list |
| 📅 **History** | View all meals you've prepared, organised by date |

**To mark a meal as prepared:**
1. Tap on a suggested meal on the Home screen
2. Tap **"Mark as Prepared"**
3. The recommendation list will update automatically

---

## Important Notes

- ✅ Keep the **terminal running** while you use the app — closing it will disconnect Expo Go
- ✅ Your iPhone and computer should be on the **same Wi-Fi network** (use `--tunnel` flag if they aren't)
- ✅ All data is stored **locally on your iPhone** — no account or internet needed
- ✅ To reload after a code change: **shake your iPhone** → tap **"Reload"**

---

## Troubleshooting

**QR code won't scan / Camera banner doesn't appear**
```bash
# Use the tunnel mode — works even across different networks
npm start -- --tunnel
```

**"Unable to connect to Metro" error**
- Confirm both devices share the same Wi-Fi
- Try: `npm start -- --clear` (clears the cache)
- Disable VPN if one is running

**App shows an error screen on load**
- Shake your iPhone and tap **"Reload"**
- Check the terminal for error messages

**`npm install` fails**
```bash
rm -rf node_modules
npm install
```

---

## Next Steps

Once you're comfortable with the app:

- **Go standalone** (no Expo Go needed): See [MOBILE_SETUP.md — Method 2](MOBILE_SETUP.md)
- **Publish to App Store**: See [MOBILE_SETUP.md — Method 3](MOBILE_SETUP.md) *(requires $99/year Apple Developer account)*

---

**Happy Cooking! 🍳**
