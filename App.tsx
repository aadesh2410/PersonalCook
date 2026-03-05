import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafariBanner } from './src/components/SafariBanner';
import { HomeScreen } from './src/screens/HomeScreen';
import { WeeklyPlannerScreen } from './src/screens/WeeklyPlannerScreen';
import { GroceryListScreen } from './src/screens/GroceryListScreen';
import { ManageScreen } from './src/screens/ManageScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon: React.FC<{ emoji: string; focused: boolean }> = ({ emoji, focused }) => (
  <View style={[tabIconStyles.container, focused && tabIconStyles.focused]}>
    <Text style={[tabIconStyles.icon, focused && tabIconStyles.iconFocused]}>{emoji}</Text>
  </View>
);

const tabIconStyles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focused: {
    backgroundColor: '#FFF0EB',
  },
  icon: {
    fontSize: 20,
  },
  iconFocused: {
    fontSize: 22,
  },
});

export default function App() {
  return (
    <SafariBanner>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#FF6B35',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              paddingBottom: 8,
              paddingTop: 8,
              height: 68,
              backgroundColor: '#fff',
              borderTopWidth: 0,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 10,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              marginTop: 2,
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Today',
              tabBarIcon: ({ focused }) => <TabIcon emoji="🍳" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Weekly"
            component={WeeklyPlannerScreen}
            options={{
              tabBarLabel: 'Weekly Plan',
              tabBarIcon: ({ focused }) => <TabIcon emoji="📅" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Grocery"
            component={GroceryListScreen}
            options={{
              tabBarLabel: 'Grocery',
              tabBarIcon: ({ focused }) => <TabIcon emoji="🛒" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Manage"
            component={ManageScreen}
            options={{
              tabBarLabel: 'Foods',
              tabBarIcon: ({ focused }) => <TabIcon emoji="📝" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="History"
            component={HistoryScreen}
            options={{
              tabBarLabel: 'History',
              tabBarIcon: ({ focused }) => <TabIcon emoji="🕐" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
            }}
          />
        </Tab.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafariBanner>
  );
}
