import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';

export default function OrderDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params as { orderId: string };

  const order = {
    orderNumber: '1001',
    customerName: 'John Doe',
    items: [
      { name: 'Burger Combo', quantity: 2, price: 15.99 },
      { name: 'French Fries', quantity: 1, price: 4.99 },
    ],
    subtotal: 36.97,
    deliveryFee: 5.00,
    total: 41.97,
    deliveryAddress: '123 Main St, Apt 4B',
    instructions: 'Please ring the doorbell',
    status: 'new',
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Order #{order.orderNumber}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <Text style={styles.customerName}>{order.customerName}</Text>
          <Text style={styles.address}>{order.deliveryAddress}</Text>
          {order.instructions && (
            <View style={styles.instructions}>
              <Icon name="information-circle-outline" size={16} color={colors.info} />
              <Text style={styles.instructionsText}>{order.instructions}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemQuantity}>{item.quantity}x</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>${order.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>${order.deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerBtn, styles.rejectBtn]}>
          <Text style={styles.footerBtnText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerBtn, styles.acceptBtn]}>
          <Text style={styles.footerBtnText}>Accept Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 48, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  section: { backgroundColor: colors.surface, padding: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
  customerName: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  address: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  instructions: { flexDirection: 'row', gap: 8, backgroundColor: colors.info + '20', padding: 12, borderRadius: 8 },
  instructionsText: { flex: 1, fontSize: 14, color: colors.textPrimary },
  itemRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  itemQuantity: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, width: 40 },
  itemName: { flex: 1, fontSize: 14, color: colors.textPrimary },
  itemPrice: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billLabel: { fontSize: 14, color: colors.textSecondary },
  billValue: { fontSize: 14, color: colors.textPrimary },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  totalValue: { fontSize: 16, fontWeight: '700', color: colors.primary },
  footer: { flexDirection: 'row', padding: 16, gap: 12, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  footerBtn: { flex: 1, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rejectBtn: { backgroundColor: colors.error },
  acceptBtn: { backgroundColor: colors.success },
  footerBtnText: { fontSize: 16, fontWeight: '600', color: colors.textInverse },
});
