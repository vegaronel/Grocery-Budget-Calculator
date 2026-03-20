import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainDashboardScreen } from '../../features/items/screens/MainDashboardScreen';
import { ShoppingListScreen } from '../../features/planning/screens/ShoppingListScreen';
import { ShoppingCart, ClipboardList } from 'lucide-react-native';
import { theme } from '../theme/theme';

export type BottomTabParamList = {
  Cart: { scannedName?: string };
  List: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen 
        name="Cart" 
        component={MainDashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <ShoppingCart color={color} size={size} />,
          title: 'Budget Cart'
        }}
      />
      <Tab.Screen 
        name="List" 
        component={ShoppingListScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
          title: 'Planner'
        }}
      />
    </Tab.Navigator>
  );
};
