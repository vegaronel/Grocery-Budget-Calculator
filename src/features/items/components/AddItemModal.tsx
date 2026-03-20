import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { useBudgetStore } from '../../../core/store/useBudgetStore';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { theme } from '../../../core/theme/theme';
import { X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  initialName?: string;
  initialPrice?: string;
}

export const AddItemModal = ({ visible, onClose, initialName = '', initialPrice = '' }: AddItemModalProps) => {
  const [name, setName] = useState(initialName);
  const [price, setPrice] = useState(initialPrice);
  const [quantity, setQuantity] = useState('1');

  React.useEffect(() => {
    if (visible) {
      setName(initialName);
      setPrice(initialPrice);
      setQuantity('1');
    }
  }, [visible, initialName, initialPrice]);
  
  const addItem = useBudgetStore((state) => state.addItem);

  const handleAdd = () => {
    const p = parseFloat(price);
    const q = parseInt(quantity, 10);
    
    if (!isNaN(p) && p > 0 && !isNaN(q) && q > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addItem({
        name: name.trim() || 'Unnamed Item',
        price: p,
        quantity: q,
      });
      setName('');
      setPrice('');
      setQuantity('1');
      onClose();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <BlurView intensity={30} tint="dark" style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.content}>
                <View style={styles.header}>
                  <Text style={styles.title}>Add Item</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <X color={theme.colors.textSecondary} size={24} />
                  </TouchableOpacity>
                </View>

                <Input
                  label="Item Name (Optional)"
                  placeholder="e.g. Milk"
                  value={name}
                  onChangeText={setName}
                  autoFocus
                />

                <View style={styles.row}>
                  <View style={[styles.field, { marginRight: theme.spacing.sm }]}>
                    <Input
                      label="Price"
                      placeholder="0.00"
                      keyboardType="numeric"
                      value={price}
                      onChangeText={setPrice}
                      leftIcon={<Text style={styles.currency}>₱</Text>}
                    />
                  </View>
                  <View style={styles.field}>
                    <Input
                      label="Qty"
                      placeholder="1"
                      keyboardType="numeric"
                      value={quantity}
                      onChangeText={setQuantity}
                    />
                  </View>
                </View>

                <Button 
                  title="Add to Cart" 
                  onPress={handleAdd}
                  disabled={!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0}
                />
              </View>
            </TouchableWithoutFeedback>
          </BlurView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  field: {
    flex: 1,
  },
  currency: {
    fontSize: theme.typography.sizes.h3,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
});
