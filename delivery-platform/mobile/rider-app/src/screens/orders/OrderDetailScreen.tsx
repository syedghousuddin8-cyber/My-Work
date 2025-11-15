import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';

export default function OrderDetailScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Restaurant</Text>
        <Text style={styles.value}>Pizza Palace</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>Pickup Address</Text>
        <Text style={styles.value}>123 Main St</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>Delivery Address</Text>
        <Text style={styles.value}>456 Oak Ave, Apt 4B</Text>

        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>You'll Earn</Text>
          <Text style={styles.earningsValue}>$12.50</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startBtn} onPress={() => navigation.navigate('Navigation' as never)}>
        <Text style={styles.startBtnText}>Start Delivery</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 48, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  content: { flex: 1, padding: 16 },
  label: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  value: { fontSize: 16, color: colors.textPrimary },
  earningsCard: { backgroundColor: colors.success + '20', padding: 16, borderRadius: 12, marginTop: 24, alignItems: 'center' },
  earningsLabel: { fontSize: 14, color: colors.textSecondary },
  earningsValue: { fontSize: 32, fontWeight: '700', color: colors.success, marginTop: 4 },
  startBtn: { backgroundColor: colors.primary, padding: 16, margin: 16, borderRadius: 12, alignItems: 'center' },
  startBtnText: { fontSize: 16, fontWeight: '600', color: colors.textInverse },
});
