import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../core/theme/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export const Button = ({ title, onPress, variant = 'primary', fullWidth, disabled, loading }: ButtonProps) => {
  const getBgColor = () => {
    if (disabled) return theme.colors.border;
    if (variant === 'danger') return theme.colors.danger;
    if (variant === 'ghost') return 'transparent';
    return theme.colors.primary;
  };

  const getTextColor = () => {
    if (variant === 'ghost') return theme.colors.primary;
    if (disabled) return theme.colors.textSecondary;
    return theme.colors.white;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBgColor() },
        fullWidth && styles.fullWidth,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
  },
});
