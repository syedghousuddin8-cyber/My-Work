import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';

export default function NavigationScreen() {
  const pickupLocation = { latitude: 40.7128, longitude: -74.0060 };
  const deliveryLocation = { latitude: 40.7580, longitude: -73.9855 };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...pickupLocation,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker coordinate={pickupLocation} title="Pickup" pinColor={colors.primary} />
        <Marker coordinate={deliveryLocation} title="Delivery" pinColor={colors.success} />
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.infoCard}>
          <Text style={styles.distance}>2.3 km • 8 min</Text>
          <Text style={styles.address}>456 Oak Ave, Apt 4B</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.callBtn}>
            <Icon name="call" size={24} color={colors.textInverse} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.completeBtn}>
            <Text style={styles.completeBtnText}>Mark as Delivered</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  infoCard: { backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 12, elevation: 4 },
  distance: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  address: { fontSize: 14, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: 12 },
  callBtn: { width: 56, height: 56, backgroundColor: colors.primary, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  completeBtn: { flex: 1, backgroundColor: colors.success, padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  completeBtnText: { fontSize: 16, fontWeight: '600', color: colors.textInverse },
});
