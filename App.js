import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';

/**
 * Status bar synced with app theme
 */
function ThemedStatusBar() {
  const { themeMode } = useApp();
  return <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />;
}

/**
 * Root Application Component
 * 1. SafeAreaProvider: Handles screen insets (notches, home bars)
 * 2. AppProvider: Provides global state (Profile, Theme, Activities, AsyncStorage)
 * 3. AppNavigator: Native Stack Navigation for the 5 screens
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ThemedStatusBar />
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
