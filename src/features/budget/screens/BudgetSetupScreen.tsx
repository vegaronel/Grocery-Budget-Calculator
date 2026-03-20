import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBudgetStore } from '../../../core/store/useBudgetStore';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { theme } from '../../../core/theme/theme';
import { Wallet } from 'lucide-react-native';

export const BudgetSetupScreen = () => {
  const [amount, setAmount] = useState('');
  const setBudget = useBudgetStore((state) => state.setBudget);

  const handleStart = () => {
    const num = parseFloat(amount);
    if (!isNaN(num) && num > 0) {
      setBudget(num);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <Wallet size={48} color={theme.colors.primary} />
            </View>
            <Text style={styles.title}>BudgetCart</Text>
            <Text style={styles.subtitle}>Set your grocery budget to get started</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Budget Amount"
              placeholder="e.g. 150.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              leftIcon={<Text style={styles.currency}>₱</Text>}
            />
            <Button 
              title="Start Shopping" 
              onPress={handleStart} 
              disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  currency: {
    fontSize: theme.typography.sizes.h3,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
});
