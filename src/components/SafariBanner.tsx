import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

const DISMISSED_KEY = 'safari_banner_dismissed';

export function detectSafari(userAgent: string): boolean {
  return (
    /Safari/.test(userAgent) &&
    !/Chrome/.test(userAgent) &&
    !/Chromium/.test(userAgent) &&
    !/CriOS/.test(userAgent) &&
    !/Edg/.test(userAgent) &&
    !/OPR/.test(userAgent)
  );
}

export const SafariBanner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSafari, setIsSafari] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      setIsSafari(detectSafari(navigator.userAgent));

      try {
        if (localStorage.getItem(DISMISSED_KEY) === 'true') {
          setDismissed(true);
        }
      } catch {
        // localStorage may be unavailable in some contexts
      }
    }
  }, []);

  if (Platform.OS !== 'web' || !isSafari || dismissed) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {children}
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={styles.title}>Safari Not Supported</Text>
          <Text style={styles.description}>
            For the best experience, please open this app in{' '}
            <Text style={styles.bold}>Google Chrome</Text> or{' '}
            <Text style={styles.bold}>Mozilla Firefox</Text>. Some features may not work correctly
            in Safari.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setDismissed(true);
              try {
                localStorage.setItem(DISMISSED_KEY, 'true');
              } catch {
                // localStorage may be unavailable
              }
            }}
          >
            <Text style={styles.buttonText}>Continue Anyway</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    marginHorizontal: 24,
    maxWidth: 420,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  bold: {
    fontWeight: '700',
    color: '#333',
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
