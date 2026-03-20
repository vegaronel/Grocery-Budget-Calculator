import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Vibration, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBudgetStore } from '../../../core/store/useBudgetStore';
import { theme } from '../../../core/theme/theme';
import { Plus, Trash2, RotateCcw, Settings, Zap, ScanBarcode } from 'lucide-react-native';
import { Card } from '../../../shared/components/Card';
import { AddItemModal } from '../components/AddItemModal';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import { Item } from '../../../shared/types';
import { getIconForItem } from '../../../shared/utils/icons';
import * as Haptics from 'expo-haptics';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabParamList } from '../../../core/navigation/TabNavigator';
import { RootStackParamList } from '../../../core/navigation/AppNavigator';

const isFuzzyMatch = (plannedStr: string, scannedStr: string) => {
  if (!plannedStr || !scannedStr) return false;
  const pWords = plannedStr.toLowerCase().split(/[\s,.-]+/);
  // Remove common generic words they might type
  const filterWords = ['a', 'an', 'the', 'pack', 'kg', 'g', 'ml', 'pcs'];
  const validPWords = pWords.filter(w => w.length > 1 && !filterWords.includes(w));
  
  if (validPWords.length === 0) return false;

  const sStrLower = scannedStr.toLowerCase();
  
  // Count how many significant planned words exist natively inside the scanned barcode result
  let matchCount = 0;
  for (const pWord of validPWords) {
    if (sStrLower.includes(pWord)) {
      matchCount++;
    }
  }
  
  // If at least 50% of the significant words they typed match the scanned name, it's a match
  return (matchCount / validPWords.length) >= 0.5;
};

const QUICK_ADD_ITEMS = [
  { name: 'Milk', price: 95 },
  { name: 'Bread', price: 65 },
  { name: 'Eggs (Dozen)', price: 120 },
  { name: 'Rice (1kg)', price: 55 },
  { name: 'Water', price: 40 },
];

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Cart'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const MainDashboardScreen = ({ route, navigation }: Props) => {
  const { session, items, addItem, deleteItem, clearAll, undoDelete, lastDeletedItem, clearSession, removePlannedItem } = useBudgetStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [hasVibrated, setHasVibrated] = useState(false);
  const [selectedQuickAdd, setSelectedQuickAdd] = useState<{ name: string, price: string } | null>(null);

  const budget = session?.budgetAmount || 0;
  const spent = session?.totalSpent || 0;
  const remaining = budget - spent;
  const isExceeded = remaining < 0;
  const progressPercent = budget > 0 ? (spent / budget) * 100 : 0;

  useEffect(() => {
    if (!modalVisible) {
      setSelectedQuickAdd(null);
    }
  }, [modalVisible]);

  useEffect(() => {
    if (isExceeded && !hasVibrated) {
      Vibration.vibrate();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setHasVibrated(true);
    } else if (!isExceeded && hasVibrated) {
      setHasVibrated(false);
    }
  }, [isExceeded, hasVibrated]);

  // Handle incoming scanned items from ScannerScreen
  useEffect(() => {
    if (route.params?.scannedName) {
      const scannedName = route.params.scannedName;
      
      // Auto-clear logic: Try to find a matching item in the planner
      let matchedItem = null;
      const plannedList = useBudgetStore.getState().plannedItems;
      
      for (const item of plannedList) {
        if (isFuzzyMatch(item.name, scannedName)) {
            matchedItem = item;
            break;
        }
      }

      if (matchedItem) {
        removePlannedItem(matchedItem.id);
        Alert.alert('Smart Match! ✨', `Automatically checked off '${matchedItem.name}' from your planner!`);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setSelectedQuickAdd({ name: scannedName, price: '' });
      setModalVisible(true);
      navigation.setParams({ scannedName: undefined });
    }
  }, [route.params?.scannedName]);

  const handleClearAll = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to clear all items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        clearAll();
      }}
    ]);
  };

  const handleEndSession = () => {
    Alert.alert('End Session', 'This will delete your current budget and start over. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End Session', style: 'destructive', onPress: clearSession }
    ]);
  };

  const handleDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    deleteItem(id);
  };

  const handleUndo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    undoDelete();
  };

  const handleQuickAdd = (item: { name: string, price: number }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedQuickAdd({ name: item.name, price: item.price.toString() });
    setModalVisible(true);
  };

  const renderItem = useCallback(({ item }: { item: Item }) => (
    <Card style={styles.itemCard}>
      <View style={styles.itemIconContainer}>
        <Text style={styles.itemIcon}>{getIconForItem(item.name)}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemPriceQty}>₱{item.price.toFixed(2)} x {item.quantity}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemTotal}>₱{item.total.toFixed(2)}</Text>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDelete(item.id)}
        >
          <Trash2 size={20} color={theme.colors.danger} />
        </TouchableOpacity>
      </View>
    </Card>
  ), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BudgetCart</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Scanner')} style={styles.iconButton}>
            <ScanBarcode size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          {lastDeletedItem && (
            <TouchableOpacity onPress={handleUndo} style={styles.iconButton}>
              <RotateCcw size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleEndSession} style={styles.iconButton}>
            <Settings size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.budgetCard, isExceeded ? styles.budgetCardExceeded : null]}>
        <Text style={[styles.budgetLabel, isExceeded ? styles.textExceeded : null]}>Remaining Budget</Text>
        <Text style={[styles.budgetValue, isExceeded ? styles.textExceeded : null]}>
          ₱{remaining.toFixed(2)}
        </Text>
        
        <View style={styles.budgetRow}>
          <Text style={[styles.budgetSubLabel, isExceeded ? styles.textExceeded : null]}>Budget: ₱{budget.toFixed(2)}</Text>
          <Text style={[styles.budgetSubLabel, isExceeded ? styles.textExceeded : null]}>Spent: ₱{spent.toFixed(2)}</Text>
        </View>
        
        <ProgressBar progress={progressPercent} isExceeded={isExceeded} />
      </View>

      <View style={styles.quickAddContainer}>
        <View style={styles.quickAddHeader}>
          <Zap size={16} color={theme.colors.primary} />
          <Text style={styles.quickAddTitle}>Quick Add</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickAddScroll}>
          {QUICK_ADD_ITEMS.map((qItem, idx) => (
            <TouchableOpacity key={idx} style={styles.quickAddPill} onPress={() => handleQuickAdd(qItem)}>
              <Text style={styles.quickAddEmoji}>{getIconForItem(qItem.name)}</Text>
              <Text style={styles.quickAddText}>{qItem.name}</Text>
              <Text style={styles.quickAddPrice}>₱{qItem.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Items ({items.length})</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Your cart is empty.</Text>
            <Text style={styles.emptyStateSubtext}>Add items or tap Scan to track spending.</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={[styles.fab, isExceeded ? { backgroundColor: theme.colors.danger } : null]} 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setModalVisible(true);
        }}
        activeOpacity={0.8}
      >
        <Plus size={32} color={theme.colors.white} />
      </TouchableOpacity>

      <AddItemModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        initialName={selectedQuickAdd?.name}
        initialPrice={selectedQuickAdd?.price}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.sm },
  headerTitle: { fontSize: theme.typography.sizes.h2, fontWeight: theme.typography.weights.bold, color: theme.colors.text },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: theme.spacing.md, padding: theme.spacing.xs },
  budgetCard: { marginHorizontal: theme.spacing.lg, marginVertical: theme.spacing.md, padding: theme.spacing.lg, backgroundColor: theme.colors.primary, borderRadius: 24, elevation: 8, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 },
  budgetCardExceeded: { backgroundColor: theme.colors.dangerLight, borderWidth: 2, borderColor: theme.colors.danger, elevation: 0 },
  textExceeded: { color: theme.colors.danger },
  budgetLabel: { fontSize: theme.typography.sizes.body, color: 'rgba(255,255,255,0.8)', fontWeight: theme.typography.weights.medium },
  budgetValue: { fontSize: theme.typography.sizes.giant, fontWeight: theme.typography.weights.bold, color: theme.colors.white, marginTop: theme.spacing.xs, marginBottom: theme.spacing.md },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between' },
  budgetSubLabel: { fontSize: theme.typography.sizes.small, color: 'rgba(255,255,255,0.8)' },
  quickAddContainer: { marginBottom: theme.spacing.md },
  quickAddHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.sm },
  quickAddTitle: { fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.bold, color: theme.colors.textSecondary, marginLeft: 4, textTransform: 'uppercase' },
  quickAddScroll: { paddingHorizontal: theme.spacing.lg, gap: theme.spacing.sm },
  quickAddPill: { backgroundColor: theme.colors.card, paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md, borderRadius: 20, flexDirection: 'row', alignItems: 'center', elevation: 2, borderWidth: 1, borderColor: theme.colors.border },
  quickAddEmoji: { fontSize: 16, marginRight: 6 },
  quickAddText: { fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.medium, color: theme.colors.text, marginRight: 6 },
  quickAddPrice: { fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.bold, color: theme.colors.primary },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md },
  listTitle: { fontSize: theme.typography.sizes.h3, fontWeight: theme.typography.weights.bold, color: theme.colors.text },
  clearAllText: { fontSize: theme.typography.sizes.body, color: theme.colors.danger, fontWeight: theme.typography.weights.medium },
  listContent: { paddingHorizontal: theme.spacing.lg, paddingBottom: 100 },
  itemCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.md },
  itemIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  itemIcon: { fontSize: 20 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: theme.typography.sizes.body, fontWeight: theme.typography.weights.semibold, color: theme.colors.text, marginBottom: 4 },
  itemPriceQty: { fontSize: theme.typography.sizes.small, color: theme.colors.textSecondary },
  itemRight: { flexDirection: 'row', alignItems: 'center' },
  itemTotal: { fontSize: theme.typography.sizes.body, fontWeight: theme.typography.weights.bold, color: theme.colors.text, marginRight: theme.spacing.md },
  deleteButton: { padding: theme.spacing.sm, backgroundColor: theme.colors.dangerLight, borderRadius: 8 },
  fab: { position: 'absolute', bottom: theme.spacing.xl, right: theme.spacing.xl, width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyStateText: { fontSize: theme.typography.sizes.h3, fontWeight: theme.typography.weights.semibold, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs },
  emptyStateSubtext: { fontSize: theme.typography.sizes.body, color: theme.colors.textSecondary },
});
