import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BudgetSetupScreen } from '../../features/budget/screens/BudgetSetupScreen';
import { MainDashboardScreen } from '../../features/items/screens/MainDashboardScreen';
import { ScannerScreen } from '../../features/items/screens/ScannerScreen';
import { useBudgetStore } from '../store/useBudgetStore';

export type RootStackParamList = {
  BudgetSetup: undefined;
  MainDashboard: { scannedName?: string };
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
            <Stack.Screen name="MainDashboard" component={MainDashboardScreen} />
            <Stack.Screen name="Scanner" component={ScannerScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
