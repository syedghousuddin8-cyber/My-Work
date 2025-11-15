import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [isOnline, setIsOnline] = useState(false);

  const todayStats = {
    earnings: 125.50,
    deliveries: 8,
    hours: 4.5,
  };

  const availableOrders = [
    { id: '1', restaurant: 'Pizza Palace', pickup: '123 Main St', delivery: '456 Oak Ave', distance: 2.3, earnings: 12.50 },
    { id: '2', restaurant: 'Burger Joint', pickup: '789 Elm St', delivery: '321 Pine St', distance: 1.8, earnings: 10.00 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, Rider!</Text>
          <Text style={styles.subtitle}>Ready to deliver?</Text>
        </View>
        <View style={styles.statusToggle}>
          <Text style={styles.statusText}>Online</Text>
          <Switch value={isOnline} onValueChange={setIsOnline} trackColor={{ true: colors.success }} />
        </View>
      </View>

      <ScrollView>
        {/* Today's Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="cash-outline" size={24} color={colors.success} />
            <Text style={styles.statValue}>${todayStats.earnings.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Today's Earnings</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="bicycle-outline" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{todayStats.deliveries}</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="time-outline" size={24} color={colors.info} />
            <Text style={styles.statValue}>{todayStats.hours}h</Text>
            <Text style={styles.statLabel}>Online Time</Text>
          </View>
        </View>

        {/* Available Orders */}
        <Text style={styles.sectionTitle}>Available Orders</Text>
        {isOnline ? (
          availableOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => navigation.navigate('OrderDetail' as never, { orderId: order.id } as never)}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.restaurant}>{order.restaurant}</Text>
                <View style={styles.earningsBox}>
                  <Text style={styles.earnings}>${order.earnings.toFixed(2)}</Text>
                </View>
              </View>
              <View style={styles.locationRow}>
                <Icon name="location-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.locationText} numberOfLines={1}>{order.pickup}</Text>
              </View>
              <View style={styles.locationRow}>
                <Icon name="navigate-outline" size={16} color={colors.primary} />
                <Text style={styles.locationText} numberOfLines={1}>{order.delivery}</Text>
              </View>
              <View style={styles.orderFooter}>
                <Text style={styles.distance}>{order.distance} km</Text>
                <TouchableOpacity style={styles.acceptBtn}>
                  <Text style={styles.acceptBtnText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.offlineMessage}>
            <Icon name="power-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.offlineText}>Go online to see available orders</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 48, backgroundColor: colors.surface },
  greeting: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  statusToggle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  statsContainer: { flexDirection: 'row', padding: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: colors.surface, padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  statValue: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginTop: 8 },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary, paddingHorizontal: 16, marginBottom: 12 },
  orderCard: { backgroundColor: colors.surface, padding: 16, marginHorizontal: 16, marginBottom: 12, borderRadius: 12, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  restaurant: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  earningsBox: { backgroundColor: colors.success + '20', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  earnings: { fontSize: 14, fontWeight: '700', color: colors.success },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  locationText: { flex: 1, fontSize: 14, color: colors.textSecondary },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  distance: { fontSize: 14, color: colors.textSecondary },
  acceptBtn: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 8 },
  acceptBtnText: { fontSize: 14, fontWeight: '600', color: colors.textInverse },
  offlineMessage: { alignItems: 'center', paddingVertical: 48 },
  offlineText: { fontSize: 14, color: colors.textTertiary, marginTop: 16 },
});
