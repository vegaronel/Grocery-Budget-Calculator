import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { theme } from '../../core/theme/theme';

export const ProgressBar = ({ progress, isExceeded }: { progress: number, isExceeded: boolean }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: Math.min(Math.max(progress, 0), 100),
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[
        styles.fill, 
        { width: widthInterpolation }, 
        isExceeded ? styles.fillExceeded : null
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: theme.spacing.lg,
  },
  fill: {
    height: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  fillExceeded: {
    backgroundColor: theme.colors.danger,
  }
});
