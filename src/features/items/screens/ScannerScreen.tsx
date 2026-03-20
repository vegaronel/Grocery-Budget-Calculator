import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { theme } from '../../../core/theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../core/navigation/AppNavigator';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'Scanner'>;

export const ScannerScreen = ({ navigation }: Props) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      // Fetch product info from Open Food Facts
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${data}.json`);
      const result = await response.json();

      let productName = '';
      if (result.status === 1 && result.product?.product_name) {
        productName = result.product.product_name;
      } else {
        // If not found in Open Food Facts, we can prompt them or just fail gracefully.
        Alert.alert('Item Not Found', 'This item was not found in the public database. Please enter it manually.', [
          { text: 'OK' }
        ]);
        setScanned(false);
        setLoading(false);
        return;
      }

      // Navigate back with the scanned name to the specific tab
      navigation.navigate('MainTabs', {
        screen: 'Cart',
        params: { scannedName: productName },
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      Alert.alert('Network Error', 'Could not reach the product database.');
      setScanned(false);
    } finally {
      if (scanned) {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <X color={theme.colors.white} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Barcode</Text>
        <View style={{ width: 28 }} />
      </View>
      
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr"],
          }}
        />
        
        <View style={styles.overlay}>
          <View style={styles.scanTarget} />
          <Text style={styles.scanHint}>Position barcode inside the box</Text>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Fetching product info...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: '#000',
  },
  headerTitle: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  scanTarget: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 16,
    backgroundColor: 'transparent',
    marginBottom: theme.spacing.lg,
  },
  scanHint: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
  },
  text: {
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 8,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: theme.colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.white,
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.body,
  }
});
