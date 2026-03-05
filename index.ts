import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// Register the service worker on web so the app works offline (PWA).
if (Platform.OS === 'web' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('[SW] Registration failed:', error);
    });
  });
}
