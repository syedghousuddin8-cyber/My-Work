/**
 * VENDOR DASHBOARD - Vendor/Merchant App
 * Main dashboard for restaurant/vendor to manage their business
 *
 * Features:
 * - Online/Offline toggle
 * - Real-time order notifications
 * - Daily earnings and stats
 * - Active orders overview
 * - Performance metrics
 * - Quick actions (manage menu, view analytics)
 */

import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch } from 'react-native';

export const VendorDashboard = () => {
  const [isOnline, setIsOnline] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.storeLogo} />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>The Burger Joint</Text>
            <Text style={styles.storeCategory}>Restaurant • American</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <View style={styles.notificationIcon} />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Online/Offline Status Card */}
        <View style={styles.section}>
          <View style={[styles.statusCard, isOnline ? styles.statusCardOnline : styles.statusCardOffline]}>
            <View style={styles.statusContent}>
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTitle}>
                  {isOnline ? 'You are Online' : 'You are Offline'}
                </Text>
                <Text style={styles.statusSubtitle}>
                  {isOnline
                    ? 'Ready to accept orders'
                    : 'Turn on to start receiving orders'
                  }
                </Text>
              </View>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: '#E5E5E5', true: '#86EFAC' }}
                thumbColor={isOnline ? '#22C55E' : '#F5F5F5'}
              />
            </View>
          </View>
        </View>

        {/* Today's Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Summary</Text>
            <Text style={styles.dateText}>Dec 15, 2024</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#DCFCE7' }]}>
                <View style={styles.statIcon} />
              </View>
              <Text style={styles.statValue}>$1,248</Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
              <View style={styles.statChange}>
                <View style={styles.arrowUp} />
                <Text style={styles.statChangeText}>+12%</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFF7ED' }]}>
                <View style={styles.statIcon} />
              </View>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Orders</Text>
              <View style={styles.statChange}>
                <View style={styles.arrowUp} />
                <Text style={styles.statChangeText}>+8%</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <View style={styles.statIcon} />
              </View>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
              <View style={styles.statChange}>
                <View style={styles.arrowUp} />
                <Text style={styles.statChangeText}>+0.2</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FEE2E2' }]}>
                <View style={styles.statIcon} />
              </View>
              <Text style={styles.statValue}>18m</Text>
              <Text style={styles.statLabel}>Avg Prep Time</Text>
              <View style={[styles.statChange, styles.statChangeNegative]}>
                <View style={styles.arrowDown} />
                <Text style={[styles.statChangeText, styles.statChangeTextNegative]}>-2m</Text>
              </View>
            </View>
          </View>
        </View>

        {/* New Orders Alert */}
        {isOnline && (
          <View style={styles.section}>
            <View style={styles.newOrderAlert}>
              <View style={styles.alertContent}>
                <View style={styles.alertIcon} />
                <View style={styles.alertTextContainer}>
                  <Text style={styles.alertTitle}>New Order Received!</Text>
                  <Text style={styles.alertSubtitle}>Order #BJ-12348 • $32.50</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.alertButton}>
                <Text style={styles.alertButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Active Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Orders</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Order Card 1 - New Order */}
          <View style={[styles.orderCard, styles.orderCardNew]}>
            <View style={styles.orderHeader}>
              <View style={styles.orderLeft}>
                <Text style={styles.orderNumber}>Order #BJ-12347</Text>
                <View style={[styles.statusBadge, styles.statusBadgeNew]}>
                  <Text style={styles.statusBadgeText}>NEW</Text>
                </View>
              </View>
              <Text style={styles.orderTime}>2 min ago</Text>
            </View>

            <View style={styles.orderItems}>
              <Text style={styles.orderItemText}>2x Classic Cheeseburger</Text>
              <Text style={styles.orderItemText}>1x French Fries</Text>
              <Text style={styles.orderItemText}>1x Coke</Text>
            </View>

            <View style={styles.orderFooter}>
              <View style={styles.orderMeta}>
                <View style={styles.customerInfo}>
                  <View style={styles.customerIcon} />
                  <Text style={styles.customerName}>John D.</Text>
                </View>
                <Text style={styles.orderTotal}>$28.50</Text>
              </View>
              <View style={styles.orderActions}>
                <TouchableOpacity style={styles.rejectButton}>
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton}>
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Order Card 2 - Preparing */}
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderLeft}>
                <Text style={styles.orderNumber}>Order #BJ-12346</Text>
                <View style={[styles.statusBadge, styles.statusBadgePreparing]}>
                  <Text style={styles.statusBadgeText}>PREPARING</Text>
                </View>
              </View>
              <Text style={styles.orderTime}>12 min ago</Text>
            </View>

            <View style={styles.orderItems}>
              <Text style={styles.orderItemText}>1x Double Bacon Burger</Text>
              <Text style={styles.orderItemText}>2x Onion Rings</Text>
            </View>

            <View style={styles.orderFooter}>
              <View style={styles.orderMeta}>
                <View style={styles.customerInfo}>
                  <View style={styles.customerIcon} />
                  <Text style={styles.customerName}>Sarah M.</Text>
                </View>
                <Text style={styles.orderTotal}>$24.99</Text>
              </View>
              <View style={styles.orderActions}>
                <TouchableOpacity style={styles.markReadyButton}>
                  <View style={styles.checkIcon} />
                  <Text style={styles.markReadyButtonText}>Mark Ready</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Prep Timer */}
            <View style={styles.prepTimer}>
              <View style={styles.timerBar}>
                <View style={[styles.timerProgress, { width: '60%' }]} />
              </View>
              <Text style={styles.timerText}>Est. 8 min remaining</Text>
            </View>
          </View>

          {/* Order Card 3 - Ready for Pickup */}
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderLeft}>
                <Text style={styles.orderNumber}>Order #BJ-12345</Text>
                <View style={[styles.statusBadge, styles.statusBadgeReady]}>
                  <Text style={styles.statusBadgeText}>READY</Text>
                </View>
              </View>
              <Text style={styles.orderTime}>18 min ago</Text>
            </View>

            <View style={styles.orderItems}>
              <Text style={styles.orderItemText}>3x Classic Cheeseburger</Text>
              <Text style={styles.orderItemText}>2x French Fries</Text>
            </View>

            <View style={styles.orderFooter}>
              <View style={styles.orderMeta}>
                <View style={styles.driverInfo}>
                  <View style={styles.driverAvatar} />
                  <View>
                    <Text style={styles.driverLabel}>Driver</Text>
                    <Text style={styles.driverName}>Mike Johnson</Text>
                  </View>
                </View>
                <Text style={styles.orderTotal}>$42.97</Text>
              </View>
            </View>

            <View style={styles.driverArriving}>
              <View style={styles.driverArrivingIcon} />
              <Text style={styles.driverArrivingText}>Driver arriving in 2 min</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFF7ED' }]} />
              <Text style={styles.quickActionText}>Manage Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#DBEAFE' }]} />
              <Text style={styles.quickActionText}>Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#DCFCE7' }]} />
              <Text style={styles.quickActionText}>Earnings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEE2E2' }]} />
              <Text style={styles.quickActionText}>Promotions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Performance Chart Placeholder */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllLink}>View Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartPlaceholder}>
              {/* Bar chart visualization would go here */}
              <View style={styles.chartBarsContainer}>
                {[40, 70, 50, 90, 60, 80, 65].map((height, index) => (
                  <View key={index} style={styles.chartBar}>
                    <View style={[styles.chartBarFill, { height: `${height}%` }]} />
                    <Text style={styles.chartLabel}>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </Text>
                  </View>
                ))}
              </View>
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
          <Text style={styles.navText}>Orders</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navText}>Menu</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navText}>More</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storeLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F97316',
    marginRight: 12,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  storeCategory: {
    fontSize: 13,
    color: '#737373',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#171717',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
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
  },
  dateText: {
    fontSize: 14,
    color: '#737373',
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
  },
  statusCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
  },
  statusCardOnline: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  statusCardOffline: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#525252',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statCard: {
    width: '48%',
    marginHorizontal: '1%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#737373',
    marginBottom: 8,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChangeNegative: {},
  arrowUp: {
    width: 12,
    height: 12,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  arrowDown: {
    width: 12,
    height: 12,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  statChangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },
  statChangeTextNegative: {
    color: '#EF4444',
  },
  newOrderAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F97316',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F97316',
    marginRight: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: 14,
    color: '#9A3412',
  },
  alertButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  alertButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  orderCardNew: {
    borderColor: '#F97316',
    borderWidth: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
    marginRight: 8,
  },
  orderTime: {
    fontSize: 13,
    color: '#737373',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeNew: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgePreparing: {
    backgroundColor: '#DBEAFE',
  },
  statusBadgeReady: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#171717',
  },
  orderItems: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  orderItemText: {
    fontSize: 14,
    color: '#525252',
    marginBottom: 4,
  },
  orderFooter: {
    gap: 12,
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E5E5',
    marginRight: 8,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#171717',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F97316',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F97316',
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  markReadyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#22C55E',
  },
  checkIcon: {
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  markReadyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  prepTimer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  timerBar: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  timerText: {
    fontSize: 12,
    color: '#737373',
    textAlign: 'center',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5E5',
    marginRight: 8,
  },
  driverLabel: {
    fontSize: 11,
    color: '#737373',
  },
  driverName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
  },
  driverArriving: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 10,
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
  },
  driverArrivingIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#22C55E',
    marginRight: 8,
  },
  driverArrivingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  quickActionCard: {
    width: '48%',
    marginHorizontal: '1%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  chartPlaceholder: {
    height: 200,
  },
  chartBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 4,
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: '#F97316',
    borderRadius: 4,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 11,
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
