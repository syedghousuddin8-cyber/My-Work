import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { orderAPI } from '../../api/order';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const { items, vendorId, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [address, setAddress] = useState('123 Main St, Apt 4B');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const subtotal = getTotal();
  const deliveryFee = 5;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const orderData = {
        vendorId: vendorId!,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.price,
        })),
        deliveryAddress: {
          street: address,
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          latitude: 40.7128,
          longitude: -74.0060,
        },
        paymentMethod,
        deliveryInstructions: notes,
      };

      const response = await orderAPI.createOrder(orderData);

      clearCart();
      Alert.alert('Success', 'Order placed successfully!', [
        {
          text: 'Track Order',
          onPress: () => navigation.navigate('OrderTracking' as never, { orderId: response.id } as never),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="location" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter delivery address"
            multiline
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="card" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <Icon name="card-outline" size={24} color={colors.textPrimary} />
            <Text style={styles.paymentText}>Credit/Debit Card</Text>
            {paymentMethod === 'card' && (
              <Icon name="checkmark-circle" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cash' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('cash')}
          >
            <Icon name="cash-outline" size={24} color={colors.textPrimary} />
            <Text style={styles.paymentText}>Cash on Delivery</Text>
            {paymentMethod === 'cash' && (
              <Icon name="checkmark-circle" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Delivery Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="document-text" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Delivery Instructions</Text>
          </View>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add delivery instructions (optional)"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Bill Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Tax</Text>
            <Text style={styles.billValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <TouchableOpacity
        style={[styles.placeOrderButton, loading && styles.buttonDisabled]}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        <Text style={styles.placeOrderText}>
          {loading ? 'Placing Order...' : `Place Order • $${total.toFixed(2)}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  section: {
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    color: colors.textPrimary,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  paymentText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  billValue: {
    ...typography.body,
    color: colors.textPrimary,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.h4,
    color: colors.primary,
  },
  placeOrderButton: {
    backgroundColor: colors.primary,
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  placeOrderText: {
    ...typography.button,
    color: colors.textInverse,
  },
});
