import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBudgetStore } from '../../../core/store/useBudgetStore';
import { theme } from '../../../core/theme/theme';
import { Plus, Trash2, Check, ClipboardList } from 'lucide-react-native';
import { Card } from '../../../shared/components/Card';
import { PlannedItem } from '../../../shared/types';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabParamList } from '../../../core/navigation/TabNavigator';

type Props = NativeStackScreenProps<BottomTabParamList, 'List'>;

export const ShoppingListScreen = ({ navigation }: Props) => {
  const { plannedItems, previousGroceries, addPlannedItem, removePlannedItem, clearPlannedItems, importPlannedItems } = useBudgetStore();
  const [newItemName, setNewItemName] = useState('');

  const handleImport = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const imports = previousGroceries.map(item => ({
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      name: item.name,
      createdAt: new Date().toISOString()
    }));
    importPlannedItems(imports);
  };

  const handleAdd = () => {
    if (!newItemName.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addPlannedItem(newItemName);
    setNewItemName('');
  };

  const handleMoveToCart = (item: PlannedItem) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    removePlannedItem(item.id);
    navigation.navigate({
      name: 'Cart',
      params: { scannedName: item.name },
      merge: true,
    });
  };

  const handleDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    removePlannedItem(id);
  };

  const renderItem = useCallback(({ item }: { item: PlannedItem }) => (
    <Card style={styles.itemCard}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleMoveToCart(item)}>
          <Check size={20} color={theme.colors.success} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
          <Trash2 size={20} color={theme.colors.danger} />
        </TouchableOpacity>
      </View>
    </Card>
  ), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping List</Text>
        {plannedItems.length > 0 && (
          <TouchableOpacity onPress={() => clearPlannedItems()}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add item to list..."
          placeholderTextColor={theme.colors.textSecondary}
          value={newItemName}
          onChangeText={setNewItemName}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Plus size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={plannedItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ClipboardList size={48} color={theme.colors.border} />
            <Text style={styles.emptyStateText}>Your list is empty</Text>
            <Text style={styles.emptyStateSub}>Plan your groceries here!</Text>
            
            {previousGroceries.length > 0 && (
              <TouchableOpacity style={styles.importButton} onPress={handleImport}>
                <Text style={styles.importButtonText}>🔄 Import Previous List ({previousGroceries.length})</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.lg, paddingBottom: theme.spacing.md },
  headerTitle: { fontSize: theme.typography.sizes.h2, fontWeight: theme.typography.weights.bold, color: theme.colors.text },
  clearText: { color: theme.colors.danger, fontSize: theme.typography.sizes.body, fontWeight: theme.typography.weights.medium },
  inputContainer: { flexDirection: 'row', paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md },
  input: { flex: 1, backgroundColor: theme.colors.card, borderRadius: 12, paddingHorizontal: theme.spacing.md, height: 50, fontSize: theme.typography.sizes.body, color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border, marginRight: theme.spacing.sm },
  addButton: { width: 50, height: 50, backgroundColor: theme.colors.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: theme.spacing.lg, paddingBottom: 20 },
  itemCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.md, marginBottom: theme.spacing.sm },
  itemName: { fontSize: theme.typography.sizes.body, color: theme.colors.text, flex: 1, fontWeight: theme.typography.weights.medium },
  actions: { flexDirection: 'row' },
  actionButton: { padding: theme.spacing.xs, marginLeft: theme.spacing.sm, backgroundColor: theme.colors.background, borderRadius: 8 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyStateText: { fontSize: theme.typography.sizes.h3, fontWeight: theme.typography.weights.semibold, color: theme.colors.textSecondary, marginTop: theme.spacing.md },
  emptyStateSub: { color: theme.colors.textSecondary, marginTop: 4, marginBottom: theme.spacing.xl },
  importButton: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.lg, backgroundColor: theme.colors.primaryLight, borderRadius: 24, borderWidth: 1, borderColor: theme.colors.primary },
  importButtonText: { color: theme.colors.primary, fontWeight: theme.typography.weights.bold, fontSize: theme.typography.sizes.body }
});
