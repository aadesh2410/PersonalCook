#!/usr/bin/env node

/**
 * QR Code Generator for PersonalCook
 * 
 * This script generates a QR code that can be scanned to access the PersonalCook app.
 * 
 * Usage:
 *   node generate-qr.js [expo-url]
 * 
 * If no URL is provided, it will use a placeholder.
 * After running 'npm start', copy the Expo URL and run:
 *   node generate-qr.js exp://192.168.1.100:8081
 */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Get URL from command line argument or use placeholder
const expoUrl = process.argv[2] || 'exp://example.expo.dev/@username/personalcook';

// Output paths
const qrImagePath = path.join(__dirname, 'assets', 'qr-code.png');
const qrTextPath = path.join(__dirname, 'QR_CODE.txt');

console.log('🎨 PersonalCook QR Code Generator\n');
console.log('📱 Generating QR code for:', expoUrl);

// Generate QR code as image
QRCode.toFile(qrImagePath, expoUrl, {
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  },
  width: 512,
  margin: 2
}, function (err) {
  if (err) {
    console.error('❌ Error generating QR code image:', err);
    return;
  }
  console.log('✅ QR code image saved to:', qrImagePath);
});

// Generate QR code as ASCII art for terminal
QRCode.toString(expoUrl, { type: 'terminal' }, function (err, qrString) {
  if (err) {
    console.error('❌ Error generating QR code:', err);
    return;
  }
  
  console.log('\n📱 Scan this QR code with your phone:\n');
  console.log(qrString);
  
  // Also save to file
  const output = `PersonalCook QR Code
=====================

Scan this QR code with:
- Android: Expo Go app
- iOS: Camera app (will open in Expo Go)

URL: ${expoUrl}

${qrString}

Instructions:
1. Install Expo Go from App Store/Play Store
2. Scan this QR code
3. Wait for app to load
4. Start cooking! 🍳
`;
  
  fs.writeFileSync(qrTextPath, output);
  console.log('\n✅ QR code also saved to: QR_CODE.txt');
  console.log('\n📝 Share QR_CODE.txt or assets/qr-code.png with others!\n');
});

console.log('\n💡 Tip: After running "npm start", copy the Expo URL and run:');
console.log('   node generate-qr.js exp://YOUR-IP:8081\n');
