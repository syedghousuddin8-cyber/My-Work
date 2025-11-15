import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';

export default function DashboardScreen() {
  const { vendorId } = useAuthStore();
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState({
    newOrders: 5,
    todayOrders: 23,
    todayRevenue: 1250.50,
    avgRating: 4.7,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Day!</Text>
          <Text style={styles.subtitle}>Manage your restaurant</Text>
        </View>
        <View style={styles.statusToggle}>
          <Text style={styles.statusText}>Online</Text>
          <Switch value={isOnline} onValueChange={setIsOnline} trackColor={{ true: colors.success }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* New Orders Alert */}
        {stats.newOrders > 0 && (
          <View style={styles.alertCard}>
            <Icon name="notifications" size={24} color={colors.warning} />
            <Text style={styles.alertText}>{stats.newOrders} new orders waiting!</Text>
            <TouchableOpacity style={styles.alertButton}>
              <Text style={styles.alertButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Icon name="receipt-outline" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{stats.todayOrders}</Text>
            <Text style={styles.statLabel}>Today's Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="cash-outline" size={24} color={colors.success} />
            <Text style={styles.statValue}>${stats.todayRevenue.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Today's Revenue</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="star-outline" size={24} color={colors.warning} />
            <Text style={styles.statValue}>{stats.avgRating}</Text>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="time-outline" size={24} color={colors.info} />
            <Text style={styles.statValue}>25 min</Text>
            <Text style={styles.statLabel}>Avg Prep Time</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Icon name="add-circle-outline" size={32} color={colors.primary} />
            <Text style={styles.actionText}>Add Menu Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Icon name="cube-outline" size={32} color={colors.primary} />
            <Text style={styles.actionText}>Manage Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Icon name="pricetag-outline" size={32} color={colors.primary} />
            <Text style={styles.actionText}>Create Offer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Icon name="stats-chart-outline" size={32} color={colors.primary} />
            <Text style={styles.actionText}>View Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Orders */}
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderNumber}>Order #{1000 + i}</Text>
              <View style={[styles.badge, styles.badgeNew]}>
                <Text style={styles.badgeText}>New</Text>
              </View>
            </View>
            <Text style={styles.orderItems}>2 items • $25.50</Text>
            <Text style={styles.orderTime}>2 minutes ago</Text>
          </View>
        ))}
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
  alertCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.warning + '20', padding: 16, margin: 16, borderRadius: 12, gap: 12 },
  alertText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  alertButton: { backgroundColor: colors.warning, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  alertButtonText: { fontSize: 14, fontWeight: '600', color: colors.textInverse },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: colors.surface, padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  statValue: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginTop: 8 },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary, paddingHorizontal: 16, marginTop: 8, marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, marginBottom: 16 },
  actionCard: { flex: 1, minWidth: '45%', backgroundColor: colors.surface, padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  actionText: { fontSize: 12, color: colors.textPrimary, marginTop: 8, textAlign: 'center' },
  orderCard: { backgroundColor: colors.surface, padding: 16, marginHorizontal: 16, marginBottom: 8, borderRadius: 12 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderNumber: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeNew: { backgroundColor: colors.success },
  badgeText: { fontSize: 12, fontWeight: '600', color: colors.textInverse },
  orderItems: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  orderTime: { fontSize: 12, color: colors.textTertiary },
});
