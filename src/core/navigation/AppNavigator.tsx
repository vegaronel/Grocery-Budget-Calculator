import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BudgetSetupScreen } from '../../features/budget/screens/BudgetSetupScreen';
import { ScannerScreen } from '../../features/items/screens/ScannerScreen';
import { TabNavigator } from './TabNavigator';
import { useBudgetStore } from '../store/useBudgetStore';

export type RootStackParamList = {
  BudgetSetup: undefined;
  MainTabs: { screen: string; params?: any };
  Scanner: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const session = useBudgetStore((state) => state.session);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          <Stack.Screen name="BudgetSetup" component={BudgetSetupScreen} />
        ) : (
          <Stack.Group>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="Scanner" component={ScannerScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
