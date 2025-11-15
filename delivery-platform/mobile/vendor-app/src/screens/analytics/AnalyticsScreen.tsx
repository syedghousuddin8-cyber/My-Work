import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function AnalyticsScreen() {
  const stats = {
    thisWeek: { revenue: 5240.50, orders: 87 },
    lastWeek: { revenue: 4980.20, orders: 82 },
  };

  const revenueChange = ((stats.thisWeek.revenue - stats.lastWeek.revenue) / stats.lastWeek.revenue * 100).toFixed(1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
      </View>

      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${stats.thisWeek.revenue.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
              <Text style={[styles.change, parseFloat(revenueChange) > 0 ? styles.changePositive : styles.changeNegative]}>
                {parseFloat(revenueChange) > 0 ? '+' : ''}{revenueChange}%
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.thisWeek.orders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Popular Items</Text>
          {['Burger Combo', 'Pizza Margherita', 'Caesar Salad'].map((item, i) => (
            <View key={i} style={styles.popularItem}>
              <Text style={styles.rank}>{i + 1}</Text>
              <Text style={styles.itemName}>{item}</Text>
              <Text style={styles.itemOrders}>{45 - i * 8} orders</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 16, paddingTop: 48, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  card: { backgroundColor: colors.surface, padding: 16, marginHorizontal: 16, marginTop: 16, borderRadius: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  change: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  changePositive: { color: colors.success },
  changeNegative: { color: colors.error },
  popularItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  rank: { fontSize: 18, fontWeight: '700', color: colors.primary, width: 32 },
  itemName: { flex: 1, fontSize: 14, color: colors.textPrimary },
  itemOrders: { fontSize: 14, color: colors.textSecondary },
});
