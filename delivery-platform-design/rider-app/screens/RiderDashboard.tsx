/**
 * RIDER DASHBOARD - Delivery Partner App
 * Main dashboard for delivery drivers/riders
 *
 * Features:
 * - Online/Offline toggle
 * - Real-time earnings tracker
 * - Available and active deliveries
 * - Navigation integration
 * - Earnings breakdown
 * - Performance metrics
 */

import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch } from 'react-native';

export const RiderDashboard = () => {
  const [isOnline, setIsOnline] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Status */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.riderAvatar} />
          <View style={styles.riderInfo}>
            <Text style={styles.greeting}>Hello, John 👋</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, isOnline && styles.statusDotOnline]} />
              <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      {/* Online/Offline Toggle Card */}
      <View style={styles.toggleCard}>
        <View style={styles.toggleContent}>
          <View style={styles.toggleTextContainer}>
            <Text style={styles.toggleTitle}>
              {isOnline ? "You're Online" : "You're Offline"}
            </Text>
            <Text style={styles.toggleSubtitle}>
              {isOnline
                ? 'Ready to accept delivery requests'
                : 'Go online to start earning'
              }
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: '#E5E5E5', true: '#86EFAC' }}
            thumbColor={isOnline ? '#22C55E' : '#F5F5F5'}
            style={styles.toggle}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <Text style={styles.earningsLabel}>Today's Earnings</Text>
            <TouchableOpacity>
              <Text style={styles.viewDetailsLink}>View Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.earningsAmount}>
            <Text style={styles.earningsCurrency}>$</Text>
            <Text style={styles.earningsValue}>248</Text>
            <Text style={styles.earningsCents}>.50</Text>
          </View>

          <View style={styles.earningsStats}>
            <View style={styles.earningsStat}>
              <Text style={styles.earningsStatValue}>12</Text>
              <Text style={styles.earningsStatLabel}>Deliveries</Text>
            </View>
            <View style={styles.earningsStatDivider} />
            <View style={styles.earningsStat}>
              <Text style={styles.earningsStatValue}>4.2h</Text>
              <Text style={styles.earningsStatLabel}>Online Time</Text>
            </View>
            <View style={styles.earningsStatDivider} />
            <View style={styles.earningsStat}>
              <Text style={styles.earningsStatValue}>$59</Text>
              <Text style={styles.earningsStatLabel}>Per Hour</Text>
            </View>
          </View>

          {/* Progress to Goal */}
          <View style={styles.goalSection}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalText}>Daily Goal: $300</Text>
              <Text style={styles.goalPercentage}>83%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '83%' }]} />
            </View>
            <Text style={styles.goalRemaining}>$51.50 to go!</Text>
          </View>

          {/* Cash Out Button */}
          <TouchableOpacity style={styles.cashOutButton}>
            <View style={styles.cashOutIcon} />
            <Text style={styles.cashOutText}>Instant Cash Out</Text>
            <View style={styles.chevronRight} />
          </TouchableOpacity>
        </View>

        {/* Active Delivery */}
        {isOnline && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Delivery</Text>

            <View style={styles.activeDeliveryCard}>
              {/* Delivery Steps */}
              <View style={styles.deliverySteps}>
                {/* Step 1 - Pickup */}
                <View style={styles.deliveryStep}>
                  <View style={styles.stepIndicator}>
                    <View style={[styles.stepDot, styles.stepDotActive]} />
                    <View style={styles.stepLine} />
                  </View>
                  <View style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                      <Text style={styles.stepTitle}>Pickup</Text>
                      <View style={[styles.stepBadge, styles.stepBadgeActive]}>
                        <Text style={styles.stepBadgeText}>CURRENT</Text>
                      </View>
                    </View>
                    <Text style={styles.stepLocation}>The Burger Joint</Text>
                    <Text style={styles.stepAddress}>456 Restaurant Ave</Text>
                    <View style={styles.stepMeta}>
                      <View style={styles.distanceIcon} />
                      <Text style={styles.stepDistance}>0.8 mi • 3 min away</Text>
                    </View>
                  </View>
                </View>

                {/* Step 2 - Dropoff */}
                <View style={styles.deliveryStep}>
                  <View style={styles.stepIndicator}>
                    <View style={styles.stepDot} />
                  </View>
                  <View style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                      <Text style={styles.stepTitle}>Dropoff</Text>
                    </View>
                    <Text style={styles.stepLocation}>Customer: Sarah M.</Text>
                    <Text style={styles.stepAddress}>123 Main St, Apt 4B</Text>
                    <View style={styles.stepMeta}>
                      <View style={styles.distanceIcon} />
                      <Text style={styles.stepDistance}>2.3 mi from pickup</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Order Details */}
              <View style={styles.orderDetails}>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Order #BJ-12346</Text>
                  <Text style={styles.orderDetailValue}>$24.99</Text>
                </View>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Estimated Earning</Text>
                  <Text style={styles.earningHighlight}>$8.50</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.deliveryActions}>
                <TouchableOpacity style={styles.contactButton}>
                  <View style={styles.phoneIcon} />
                  <Text style={styles.contactButtonText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navigateButton}>
                  <View style={styles.navigationIcon} />
                  <Text style={styles.navigateButtonText}>Navigate</Text>
                </TouchableOpacity>
              </View>

              {/* Arrived Button */}
              <TouchableOpacity style={styles.arrivedButton}>
                <Text style={styles.arrivedButtonText}>I've Arrived at Restaurant</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Available Deliveries */}
        {isOnline && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Nearby</Text>
              <View style={styles.availableBadge}>
                <Text style={styles.availableBadgeText}>3 new</Text>
              </View>
            </View>

            {/* Available Delivery Card 1 */}
            <View style={styles.availableCard}>
              <View style={styles.availableHeader}>
                <View style={styles.availableLeft}>
                  <View style={styles.categoryIcon} />
                  <View>
                    <Text style={styles.availableVendor}>The Burger Joint</Text>
                    <Text style={styles.availableOrderNumber}>Order #BJ-12348</Text>
                  </View>
                </View>
                <View style={styles.earningBadge}>
                  <Text style={styles.earningBadgeText}>$9.25</Text>
                </View>
              </View>

              <View style={styles.availableDetails}>
                <View style={styles.availableDetailItem}>
                  <View style={styles.detailIcon} />
                  <Text style={styles.detailText}>1.2 mi total</Text>
                </View>
                <View style={styles.availableDetailItem}>
                  <View style={styles.detailIcon} />
                  <Text style={styles.detailText}>15-20 min</Text>
                </View>
                <View style={styles.availableDetailItem}>
                  <View style={styles.detailIcon} />
                  <Text style={styles.detailText}>2 items</Text>
                </View>
              </View>

              {/* Incentive Badge */}
              <View style={styles.incentiveBadge}>
                <View style={styles.incentiveIcon} />
                <Text style={styles.incentiveText}>+$2.00 Peak Pay</Text>
              </View>

              <View style={styles.availableActions}>
                <TouchableOpacity style={styles.declineButton}>
                  <Text style={styles.declineButtonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptDeliveryButton}>
                  <Text style={styles.acceptDeliveryButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>

              {/* Timer */}
              <View style={styles.acceptTimer}>
                <View style={styles.timerIcon} />
                <Text style={styles.timerText}>Accept within 45 seconds</Text>
              </View>
            </View>

            {/* Available Delivery Card 2 */}
            <View style={styles.availableCard}>
              <View style={styles.availableHeader}>
                <View style={styles.availableLeft}>
                  <View style={[styles.categoryIcon, { backgroundColor: '#22C55E' }]} />
                  <View>
                    <Text style={styles.availableVendor}>Fresh Market</Text>
                    <Text style={styles.availableOrderNumber}>Order #FM-5432</Text>
                  </View>
                </View>
                <View style={styles.earningBadge}>
                  <Text style={styles.earningBadgeText}>$12.50</Text>
                </View>
              </View>

              <View style={styles.availableDetails}>
                <View style={styles.availableDetailItem}>
                  <View style={styles.detailIcon} />
                  <Text style={styles.detailText}>2.8 mi total</Text>
                </View>
                <View style={styles.availableDetailItem}>
                  <View style={styles.detailIcon} />
                  <Text style={styles.detailText}>25-30 min</Text>
                </View>
                <View style={styles.availableDetailItem}>
                  <View style={styles.detailIcon} />
                  <Text style={styles.detailText}>8 items</Text>
                </View>
              </View>

              <View style={styles.availableActions}>
                <TouchableOpacity style={styles.declineButton}>
                  <Text style={styles.declineButtonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptDeliveryButton}>
                  <Text style={styles.acceptDeliveryButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#DCFCE7' }]}>
                <View style={styles.statIcon} />
              </View>
              <Text style={styles.statValue}>$1,248</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <View style={styles.statIcon} />
              </View>
              <Text style={styles.statValue}>68</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <View style={styles.statIcon} />
              </View>
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={[styles.navItem, styles.navItemActive]}>
          <View style={styles.navIcon} />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navText}>Earnings</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navText}>History</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navText}>Account</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F97316',
    marginRight: 12,
  },
  riderInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D4D4D4',
    marginRight: 6,
  },
  statusDotOnline: {
    backgroundColor: '#22C55E',
  },
  statusText: {
    fontSize: 13,
    color: '#737373',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#171717',
  },
  toggleCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  toggleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: '#737373',
  },
  toggle: {},
  scrollView: {
    flex: 1,
  },
  earningsCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  earningsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#737373',
  },
  viewDetailsLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
  },
  earningsAmount: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  earningsCurrency: {
    fontSize: 32,
    fontWeight: '700',
    color: '#22C55E',
    marginTop: 8,
  },
  earningsValue: {
    fontSize: 56,
    fontWeight: '700',
    color: '#22C55E',
    lineHeight: 56,
  },
  earningsCents: {
    fontSize: 32,
    fontWeight: '700',
    color: '#22C55E',
    marginTop: 8,
  },
  earningsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
    marginBottom: 20,
  },
  earningsStat: {
    alignItems: 'center',
  },
  earningsStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 4,
  },
  earningsStatLabel: {
    fontSize: 12,
    color: '#737373',
  },
  earningsStatDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
  },
  goalSection: {
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
  },
  goalPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#22C55E',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  goalRemaining: {
    fontSize: 13,
    color: '#737373',
  },
  cashOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  cashOutIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#22C55E',
    marginRight: 8,
  },
  cashOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171717',
    flex: 1,
  },
  chevronRight: {
    width: 20,
    height: 20,
    backgroundColor: '#A3A3A3',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 16,
  },
  availableBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  activeDeliveryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#F97316',
  },
  deliverySteps: {
    marginBottom: 20,
  },
  deliveryStep: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E5E5',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  stepDotActive: {
    backgroundColor: '#F97316',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 4,
    minHeight: 40,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
    marginRight: 8,
  },
  stepBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stepBadgeActive: {
    backgroundColor: '#FFF7ED',
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F97316',
  },
  stepLocation: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 4,
  },
  stepAddress: {
    fontSize: 14,
    color: '#737373',
    marginBottom: 8,
  },
  stepMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#F97316',
    marginRight: 6,
  },
  stepDistance: {
    fontSize: 13,
    color: '#737373',
  },
  orderDetails: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
    marginBottom: 16,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderDetailLabel: {
    fontSize: 14,
    color: '#737373',
  },
  orderDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
  },
  earningHighlight: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
  },
  deliveryActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  phoneIcon: {
    width: 18,
    height: 18,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171717',
  },
  navigateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
  },
  navigationIcon: {
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  navigateButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  arrivedButton: {
    paddingVertical: 14,
    backgroundColor: '#F97316',
    borderRadius: 10,
    alignItems: 'center',
  },
  arrivedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  availableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  availableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  availableLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F97316',
    marginRight: 12,
  },
  availableVendor: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  availableOrderNumber: {
    fontSize: 13,
    color: '#737373',
  },
  earningBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  earningBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
  },
  availableDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  availableDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#A3A3A3',
    marginRight: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#737373',
  },
  incentiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  incentiveIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#F59E0B',
    marginRight: 6,
  },
  incentiveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  availableActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  declineButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  declineButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#737373',
  },
  acceptDeliveryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F97316',
    alignItems: 'center',
  },
  acceptDeliveryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  acceptTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  timerText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 12,
  },
  statIcon: {
    width: 20,
    height: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#737373',
  },
  bottomSpacing: {
    height: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {},
  navIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#D4D4D4',
    borderRadius: 12,
    marginBottom: 4,
  },
  navText: {
    fontSize: 11,
    color: '#737373',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#F97316',
    fontWeight: '600',
  },
});
