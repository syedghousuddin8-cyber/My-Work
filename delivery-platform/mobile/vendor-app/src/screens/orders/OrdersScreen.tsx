import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';

const TABS = ['New', 'Preparing', 'Ready', 'Completed'];

export default function OrdersScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('New');

  const mockOrders = [
    { id: '1', orderNumber: '1001', items: 3, total: 45.50, time: '2 min ago', status: 'new' },
    { id: '2', orderNumber: '1002', items: 2, total: 28.00, time: '5 min ago', status: 'new' },
    { id: '3', orderNumber: '1003', items: 4, total: 62.75, time: '8 min ago', status: 'preparing' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Orders List */}
      <ScrollView style={styles.ordersList}>
        {mockOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetail' as never, { orderId: order.id } as never)}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
              <Text style={styles.orderTime}>{order.time}</Text>
            </View>
            <Text style={styles.orderItems}>{order.items} items</Text>
            <View style={styles.orderFooter}>
              <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
              <View style={styles.orderActions}>
                <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]}>
                  <Icon name="checkmark" size={20} color={colors.textInverse} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]}>
                  <Icon name="close" size={20} color={colors.textInverse} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 16, paddingTop: 48, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  tabs: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { paddingHorizontal: 20, paddingVertical: 12 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { fontSize: 14, color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '600' },
  ordersList: { flex: 1 },
  orderCard: { backgroundColor: colors.surface, padding: 16, marginHorizontal: 16, marginTop: 12, borderRadius: 12, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderNumber: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  orderTime: { fontSize: 12, color: colors.textTertiary },
  orderItems: { fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTotal: { fontSize: 18, fontWeight: '700', color: colors.primary },
  orderActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  acceptBtn: { backgroundColor: colors.success },
  rejectBtn: { backgroundColor: colors.error },
});
