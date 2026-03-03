import React from 'react';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './src/screens/HomeScreen';
import { WeeklyPlannerScreen } from './src/screens/WeeklyPlannerScreen';
import { GroceryListScreen } from './src/screens/GroceryListScreen';
import { ManageScreen } from './src/screens/ManageScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Today',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>🍳</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Weekly"
          component={WeeklyPlannerScreen}
          options={{
            tabBarLabel: 'Weekly Plan',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>📅</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Grocery"
          component={GroceryListScreen}
          options={{
            tabBarLabel: 'Grocery',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>🛒</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Manage"
          component={ManageScreen}
          options={{
            tabBarLabel: 'Foods',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>📝</Text>
            ),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            tabBarLabel: 'History',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>🕐</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>👤</Text>
            ),
          }}
        />
      </Tab.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
