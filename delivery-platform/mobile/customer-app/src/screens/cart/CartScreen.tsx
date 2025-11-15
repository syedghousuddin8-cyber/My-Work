import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCartStore } from '../../store/cartStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function CartScreen() {
  const navigation = useNavigation();
  const { items, vendorName, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();

  const subtotal = getTotal();
  const deliveryFee = subtotal > 0 ? 5 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="cart-outline" size={80} color={colors.textTertiary} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add items to get started</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Browse Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Vendor Name */}
        <View style={styles.vendorHeader}>
          <Text style={styles.vendorName}>{vendorName}</Text>
        </View>

        {/* Cart Items */}
        {items.map((item) => (
          <View key={item.menuItemId} style={styles.cartItem}>
            <Image
              source={{ uri: item.image || 'https://via.placeholder.com/80' }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.menuItemId, item.quantity - 1)}
              >
                <Icon name="remove" size={16} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.menuItemId, item.quantity + 1)}
              >
                <Icon name="add" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Bill Details */}
        <View style={styles.billSection}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
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

      {/* Checkout Button */}
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => navigation.navigate('Checkout' as never)}
      >
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        <Text style={styles.checkoutTotal}>${total.toFixed(2)}</Text>
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
  clearText: {
    ...typography.body,
    color: colors.error,
  },
  vendorHeader: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  vendorName: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemPrice: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  billSection: {
    padding: 16,
    marginTop: 8,
    backgroundColor: colors.surface,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 12,
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
  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  checkoutText: {
    ...typography.button,
    color: colors.textInverse,
  },
  checkoutTotal: {
    ...typography.button,
    color: colors.textInverse,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    ...typography.button,
    color: colors.textInverse,
  },
});
