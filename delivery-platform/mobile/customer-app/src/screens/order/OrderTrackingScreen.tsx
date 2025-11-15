import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { io, Socket } from 'socket.io-client';
import { orderAPI } from '../../api/order';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const ORDER_STATUSES = [
  { key: 'pending', label: 'Order Placed', icon: 'checkmark-circle' },
  { key: 'confirmed', label: 'Confirmed', icon: 'restaurant' },
  { key: 'preparing', label: 'Preparing', icon: 'flame' },
  { key: 'ready_for_pickup', label: 'Ready', icon: 'cube' },
  { key: 'picked_up', label: 'Picked Up', icon: 'bicycle' },
  { key: 'in_transit', label: 'On the Way', icon: 'navigate' },
  { key: 'delivered', label: 'Delivered', icon: 'gift' },
];

export default function OrderTrackingScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params as { orderId: string };

  const [order, setOrder] = useState<any>(null);
  const [driverLocation, setDriverLocation] = useState<any>(null);
  const [eta, setEta] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    loadOrder();
    initializeWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const orderData = await orderAPI.getOrder(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Load order error:', error);
    }
  };

  const initializeWebSocket = () => {
    const socket = io(process.env.EXPO_PUBLIC_TRACKING_WS_URL || 'http://localhost:3006', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to tracking service');
      socket.emit('join:order', orderId);
    });

    socket.on('driver:location', (data: any) => {
      setDriverLocation(data.location);
      setEta(data.eta);
    });

    socket.on('order:status', (data: any) => {
      setOrder((prev: any) => ({ ...prev, status: data.status }));
    });

    socketRef.current = socket;
  };

  const getCurrentStatusIndex = () => {
    return ORDER_STATUSES.findIndex((s) => s.key === order?.status);
  };

  const renderStatusBar = () => {
    const currentIndex = getCurrentStatusIndex();

    return (
      <View style={styles.statusBar}>
        {ORDER_STATUSES.filter(s => s.key !== 'preparing' && s.key !== 'in_transit').map((status, index) => {
          const isActive = index <= currentIndex;
          const isCurrentStep = ORDER_STATUSES[currentIndex]?.key === status.key;

          return (
            <View key={status.key} style={styles.statusStep}>
              <View
                style={[
                  styles.statusIcon,
                  isActive && styles.statusIconActive,
                  isCurrentStep && styles.statusIconCurrent,
                ]}
              >
                <Icon
                  name={status.icon}
                  size={20}
                  color={isActive ? colors.textInverse : colors.textTertiary}
                />
              </View>
              <Text
                style={[
                  styles.statusLabel,
                  isActive && styles.statusLabelActive,
                ]}
              >
                {status.label}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const deliveryLocation = {
    latitude: parseFloat(order.delivery_latitude) || 40.7128,
    longitude: parseFloat(order.delivery_longitude) || -74.0060,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <TouchableOpacity onPress={() => {}}>
          <Icon name="help-circle-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...deliveryLocation,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* Delivery Location */}
        <Marker coordinate={deliveryLocation} title="Delivery Address">
          <Icon name="home" size={32} color={colors.error} />
        </Marker>

        {/* Driver Location */}
        {driverLocation && (
          <Marker
            coordinate={{
              latitude: driverLocation.latitude,
              longitude: driverLocation.longitude,
            }}
            title="Driver"
          >
            <Icon name="bicycle" size={32} color={colors.primary} />
          </Marker>
        )}
      </MapView>

      {/* Order Details */}
      <ScrollView style={styles.details}>
        {/* ETA */}
        {eta && (
          <View style={styles.etaCard}>
            <Icon name="time-outline" size={24} color={colors.primary} />
            <View>
              <Text style={styles.etaLabel}>Estimated Arrival</Text>
              <Text style={styles.etaTime}>{Math.round(eta / 60)} minutes</Text>
            </View>
          </View>
        )}

        {/* Status Progress */}
        {renderStatusBar()}

        {/* Order Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order #{order.order_number}</Text>
          <View style={styles.orderRow}>
            <Text style={styles.label}>From:</Text>
            <Text style={styles.value}>{order.vendor?.business_name}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.label}>Items:</Text>
            <Text style={styles.value}>{order.items?.length || 0} items</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.label}>Total:</Text>
            <Text style={styles.valueHighlight}>${order.total_amount}</Text>
          </View>
        </View>

        {/* Driver Info */}
        {order.driver && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Delivery Partner</Text>
            <View style={styles.driverInfo}>
              <View style={styles.driverAvatar}>
                <Icon name="person" size={24} color={colors.textInverse} />
              </View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{order.driver.name}</Text>
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={14} color={colors.warning} />
                  <Text style={styles.rating}>{order.driver.rating || '4.8'}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.callButton}>
                <Icon name="call" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
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
    zIndex: 10,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  map: {
    height: 300,
  },
  details: {
    flex: 1,
  },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.primary + '10',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  etaLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  etaTime: {
    ...typography.h3,
    color: colors.primary,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.surface,
    marginBottom: 8,
  },
  statusStep: {
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusIconActive: {
    backgroundColor: colors.primary,
  },
  statusIconCurrent: {
    transform: [{ scale: 1.2 }],
  },
  statusLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  statusLabelActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 8,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
  },
  valueHighlight: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverDetails: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
