import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function EarningsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings</Text>
      </View>

      <ScrollView>
        <View style={styles.totalCard}>
          <Text style={styles.label}>Total Earnings (This Week)</Text>
          <Text style={styles.total}>$425.50</Text>
          <Text style={styles.subtitle}>23 deliveries completed</Text>
        </View>

        <Text style={styles.sectionTitle}>Recent Earnings</Text>
        {[
          { date: 'Today', amount: 125.50, deliveries: 8 },
          { date: 'Yesterday', amount: 145.00, deliveries: 9 },
          { date: 'Jan 13', amount: 95.00, deliveries: 6 },
        ].map((day, i) => (
          <View key={i} style={styles.earningCard}>
            <View>
              <Text style={styles.date}>{day.date}</Text>
              <Text style={styles.deliveries}>{day.deliveries} deliveries</Text>
            </View>
            <Text style={styles.amount}>${day.amount.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 16, paddingTop: 48, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  totalCard: { backgroundColor: colors.primary, padding: 24, margin: 16, borderRadius: 12, alignItems: 'center' },
  label: { fontSize: 14, color: colors.textInverse, opacity: 0.9 },
  total: { fontSize: 48, fontWeight: '700', color: colors.textInverse, marginVertical: 8 },
  subtitle: { fontSize: 14, color: colors.textInverse, opacity: 0.9 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary, paddingHorizontal: 16, marginBottom: 12 },
  earningCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surface, padding: 16, marginHorizontal: 16, marginBottom: 8, borderRadius: 12 },
  date: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  deliveries: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  amount: { fontSize: 20, fontWeight: '700', color: colors.success },
});
