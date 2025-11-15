/**
 * ORDER TRACKING SCREEN - Customer App
 * Real-time order tracking with live GPS, ETA, and status updates
 *
 * Features:
 * - Live map with driver location
 * - Order status timeline
 * - ETA with real-time updates
 * - Driver info with contact options
 * - Order summary
 * - Delivery instructions
 */

import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

export const OrderTrackingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <View style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <TouchableOpacity style={styles.helpButton}>
          <View style={styles.helpIcon} />
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        {/* Map Placeholder */}
        <View style={styles.map}>
          {/* Vendor Marker */}
          <View style={[styles.marker, styles.vendorMarker]}>
            <View style={styles.markerIcon} />
          </View>

          {/* Customer Marker */}
          <View style={[styles.marker, styles.customerMarker]}>
            <View style={styles.markerIcon} />
          </View>

          {/* Driver Marker (Animated) */}
          <View style={[styles.marker, styles.driverMarker]}>
            <View style={styles.driverMarkerIcon} />
          </View>

          {/* Route Line Placeholder */}
          <View style={styles.routeLine} />
        </View>

        {/* ETA Card (Floating on Map) */}
        <View style={styles.etaCard}>
          <View style={styles.etaContent}>
            <View style={styles.etaIcon} />
            <View style={styles.etaTextContainer}>
              <Text style={styles.etaTime}>Arriving in 12 min</Text>
              <Text style={styles.etaSubtext}>Order is on the way</Text>
            </View>
            <View style={styles.pulseIndicator} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
        {/* Status Timeline */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Order Status</Text>

          {/* Timeline Item 1 - Completed */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineIndicator}>
              <View style={[styles.timelineDot, styles.timelineDotCompleted]} />
              <View style={[styles.timelineLine, styles.timelineLineCompleted]} />
            </View>
            <View style={styles.timelineContent}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineTitle}>Order Confirmed</Text>
                <Text style={styles.timelineTime}>2:15 PM</Text>
              </View>
              <Text style={styles.timelineDescription}>
                The Burger Joint confirmed your order
              </Text>
            </View>
          </View>

          {/* Timeline Item 2 - Completed */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineIndicator}>
              <View style={[styles.timelineDot, styles.timelineDotCompleted]} />
              <View style={[styles.timelineLine, styles.timelineLineCompleted]} />
            </View>
            <View style={styles.timelineContent}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineTitle}>Preparing</Text>
                <Text style={styles.timelineTime}>2:20 PM</Text>
              </View>
              <Text style={styles.timelineDescription}>
                Your food is being prepared
              </Text>
            </View>
          </View>

          {/* Timeline Item 3 - Active */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineIndicator}>
              <View style={[styles.timelineDot, styles.timelineDotActive]}>
                <View style={styles.timelineDotPulse} />
              </View>
              <View style={styles.timelineLine} />
            </View>
            <View style={styles.timelineContent}>
              <View style={styles.timelineHeader}>
                <Text style={[styles.timelineTitle, styles.timelineTitleActive]}>
                  Out for Delivery
                </Text>
                <Text style={[styles.timelineTime, styles.timelineTimeActive]}>2:35 PM</Text>
              </View>
              <Text style={styles.timelineDescription}>
                Your order is on the way
              </Text>
            </View>
          </View>

          {/* Timeline Item 4 - Pending */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineIndicator}>
              <View style={styles.timelineDot} />
            </View>
            <View style={styles.timelineContent}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineTitle}>Delivered</Text>
                <Text style={styles.timelineTime}>ETA 2:47 PM</Text>
              </View>
              <Text style={styles.timelineDescription}>
                Order will be delivered soon
              </Text>
            </View>
          </View>
        </View>

        {/* Driver Info */}
        <View style={styles.driverSection}>
          <Text style={styles.sectionTitle}>Your Delivery Partner</Text>

          <View style={styles.driverCard}>
            <View style={styles.driverInfo}>
              <View style={styles.driverAvatar} />
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>John Smith</Text>
                <View style={styles.driverRating}>
                  <View style={styles.starIcon} />
                  <Text style={styles.ratingText}>4.9</Text>
                  <Text style={styles.ratingCount}>(1,234 deliveries)</Text>
                </View>
                <View style={styles.driverVehicle}>
                  <View style={styles.vehicleIcon} />
                  <Text style={styles.vehicleText}>Honda Civic • ABC 123</Text>
                </View>
              </View>
            </View>

            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.contactButton}>
                <View style={styles.phoneIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <View style={styles.chatIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Delivery Instructions */}
        <View style={styles.instructionsSection}>
          <View style={styles.instructionsHeader}>
            <View style={styles.instructionsIcon} />
            <View style={styles.instructionsTextContainer}>
              <Text style={styles.instructionsTitle}>Delivery Instructions</Text>
              <Text style={styles.instructionsText}>
                Leave at door, ring doorbell
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.orderSection}>
          <Text style={styles.sectionTitle}>Order Details</Text>

          <View style={styles.orderCard}>
            {/* Restaurant Info */}
            <View style={styles.restaurantInfo}>
              <View style={styles.restaurantLogo} />
              <View style={styles.restaurantDetails}>
                <Text style={styles.restaurantName}>The Burger Joint</Text>
                <Text style={styles.orderNumber}>Order #BJ-12345</Text>
              </View>
            </View>

            {/* Order Items */}
            <View style={styles.orderItems}>
              <View style={styles.orderItem}>
                <View style={styles.itemQuantity}>
                  <Text style={styles.quantityText}>2x</Text>
                </View>
                <Text style={styles.itemName}>Classic Cheeseburger</Text>
                <Text style={styles.itemPrice}>$25.98</Text>
              </View>

              <View style={styles.orderItem}>
                <View style={styles.itemQuantity}>
                  <Text style={styles.quantityText}>1x</Text>
                </View>
                <Text style={styles.itemName}>Double Bacon Burger</Text>
                <Text style={styles.itemPrice}>$15.99</Text>
              </View>

              <View style={styles.orderItem}>
                <View style={styles.itemQuantity}>
                  <Text style={styles.quantityText}>2x</Text>
                </View>
                <Text style={styles.itemName}>French Fries</Text>
                <Text style={styles.itemPrice}>$7.98</Text>
              </View>
            </View>

            {/* Price Summary */}
            <View style={styles.priceSummary}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>$49.95</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery Fee</Text>
                <Text style={styles.priceValue}>$2.99</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Tax</Text>
                <Text style={styles.priceValue}>$4.24</Text>
              </View>
              <View style={[styles.priceRow, styles.priceRowTotal]}>
                <Text style={styles.priceLabelTotal}>Total</Text>
                <Text style={styles.priceValueTotal}>$57.18</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Support Button */}
        <TouchableOpacity style={styles.supportButton}>
          <View style={styles.supportIcon} />
          <Text style={styles.supportText}>Need Help?</Text>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#171717',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#F97316',
  },
  mapContainer: {
    height: 300,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E5E5',
    position: 'relative',
  },
  marker: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorMarker: {
    top: 60,
    left: 80,
  },
  customerMarker: {
    bottom: 80,
    right: 60,
  },
  driverMarker: {
    top: 140,
    left: 180,
  },
  markerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F97316',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  driverMarkerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#22C55E',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  routeLine: {
    position: 'absolute',
    top: 80,
    left: 100,
    width: 150,
    height: 2,
    backgroundColor: '#F97316',
    opacity: 0.5,
  },
  etaCard: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  etaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  etaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    marginRight: 12,
  },
  etaTextContainer: {
    flex: 1,
  },
  etaTime: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  etaSubtext: {
    fontSize: 14,
    color: '#737373',
  },
  pulseIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
  },
  detailsContainer: {
    flex: 1,
  },
  timelineSection: {
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 1,
  },
  timelineDotCompleted: {
    backgroundColor: '#22C55E',
  },
  timelineDotActive: {
    backgroundColor: '#F97316',
    position: 'relative',
  },
  timelineDotPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F97316',
    opacity: 0.3,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: '#22C55E',
  },
  timelineContent: {
    flex: 1,
    paddingTop: -2,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
  },
  timelineTitleActive: {
    color: '#F97316',
  },
  timelineTime: {
    fontSize: 13,
    color: '#737373',
  },
  timelineTimeActive: {
    color: '#F97316',
    fontWeight: '600',
  },
  timelineDescription: {
    fontSize: 14,
    color: '#737373',
    lineHeight: 20,
  },
  driverSection: {
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  driverCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E5E5',
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 4,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#F59E0B',
    borderRadius: 7,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 13,
    color: '#737373',
  },
  driverVehicle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#737373',
    marginRight: 4,
  },
  vehicleText: {
    fontSize: 13,
    color: '#737373',
  },
  driverActions: {
    flexDirection: 'row',
  },
  contactButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  phoneIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#22C55E',
  },
  chatIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#3B82F6',
  },
  instructionsSection: {
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF7ED',
    marginRight: 12,
  },
  instructionsTextContainer: {
    flex: 1,
  },
  instructionsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 2,
  },
  instructionsText: {
    fontSize: 14,
    color: '#737373',
  },
  editLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
  },
  orderSection: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  restaurantLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E5E5',
    marginRight: 12,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 2,
  },
  orderNumber: {
    fontSize: 13,
    color: '#737373',
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemQuantity: {
    width: 32,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quantityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171717',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#171717',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
  },
  priceSummary: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceRowTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  priceLabel: {
    fontSize: 14,
    color: '#737373',
  },
  priceValue: {
    fontSize: 14,
    color: '#171717',
  },
  priceLabelTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
  },
  priceValueTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F97316',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  supportIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#F97316',
    marginRight: 8,
  },
  supportText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
  },
  bottomSpacing: {
    height: 20,
  },
});
