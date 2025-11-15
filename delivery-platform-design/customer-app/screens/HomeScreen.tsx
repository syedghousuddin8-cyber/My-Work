/**
 * HOME SCREEN - Customer App
 * Main landing screen with category selection and personalized recommendations
 *
 * Features:
 * - Location selector at top
 * - Category grid (Food, Grocery, Pharmacy, Meat/Seafood, Retail)
 * - Promotional banners
 * - Personalized recommendations
 * - Quick reorder section
 * - Search bar
 */

import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Location */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <View style={styles.locationIcon} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.deliverToText}>Deliver to</Text>
            <View style={styles.addressContainer}>
              <Text style={styles.addressText}>123 Main Street, Apt 4B</Text>
              <View style={styles.chevronIcon} />
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <View style={styles.favoriteButton} />
          <View style={styles.notificationButton}>
            <View style={styles.notificationBadge} />
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for food, groceries, medicines..."
          placeholderTextColor="#A3A3A3"
        />
        <View style={styles.filterButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What would you like to order?</Text>

          <View style={styles.categoriesGrid}>
            {/* Food Delivery */}
            <View style={[styles.categoryCard, { backgroundColor: '#FFEDD5' }]}>
              <View style={styles.categoryIconContainer}>
                <View style={[styles.categoryIcon, { backgroundColor: '#F97316' }]} />
              </View>
              <Text style={styles.categoryTitle}>Food{'\n'}Delivery</Text>
              <Text style={styles.categorySubtitle}>Order from restaurants</Text>
            </View>

            {/* Grocery */}
            <View style={[styles.categoryCard, { backgroundColor: '#DCFCE7' }]}>
              <View style={styles.categoryIconContainer}>
                <View style={[styles.categoryIcon, { backgroundColor: '#22C55E' }]} />
              </View>
              <Text style={styles.categoryTitle}>Grocery</Text>
              <Text style={styles.categorySubtitle}>Fresh & essentials</Text>
            </View>

            {/* Pharmacy */}
            <View style={[styles.categoryCard, { backgroundColor: '#FEE2E2' }]}>
              <View style={styles.categoryIconContainer}>
                <View style={[styles.categoryIcon, { backgroundColor: '#EF4444' }]} />
              </View>
              <Text style={styles.categoryTitle}>Pharmacy</Text>
              <Text style={styles.categorySubtitle}>Medicines & health</Text>
              <View style={styles.rxBadge}>
                <Text style={styles.rxBadgeText}>Rx</Text>
              </View>
            </View>

            {/* Meat & Seafood */}
            <View style={[styles.categoryCard, { backgroundColor: '#FEE2E2' }]}>
              <View style={styles.categoryIconContainer}>
                <View style={[styles.categoryIcon, { backgroundColor: '#DC2626' }]} />
              </View>
              <Text style={styles.categoryTitle}>Meat &{'\n'}Seafood</Text>
              <Text style={styles.categorySubtitle}>Premium quality</Text>
            </View>

            {/* Retail */}
            <View style={[styles.categoryCard, { backgroundColor: '#EDE9FE' }]}>
              <View style={styles.categoryIconContainer}>
                <View style={[styles.categoryIcon, { backgroundColor: '#8B5CF6' }]} />
              </View>
              <Text style={styles.categoryTitle}>Retail &{'\n'}More</Text>
              <Text style={styles.categorySubtitle}>Everything else</Text>
            </View>

            {/* More Categories Placeholder */}
            <View style={[styles.categoryCard, styles.categoryCardMore]}>
              <View style={styles.categoryIconContainer}>
                <View style={styles.moreIcon} />
              </View>
              <Text style={styles.categoryTitle}>More</Text>
              <Text style={styles.categorySubtitle}>View all categories</Text>
            </View>
          </View>
        </View>

        {/* Promotional Banner */}
        <View style={styles.section}>
          <View style={styles.promoBanner}>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Get 50% OFF</Text>
              <Text style={styles.promoSubtitle}>On your first 3 orders</Text>
              <View style={styles.promoButton}>
                <Text style={styles.promoButtonText}>Order Now</Text>
              </View>
            </View>
            <View style={styles.promoImage} />
          </View>
        </View>

        {/* Quick Reorder */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Reorder</Text>
            <Text style={styles.sectionLink}>View All</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={styles.reorderCard}>
                <View style={styles.reorderImage} />
                <Text style={styles.reorderName}>Pizza Margherita</Text>
                <Text style={styles.reorderVendor}>Joe's Pizza</Text>
                <View style={styles.reorderButton}>
                  <Text style={styles.reorderButtonText}>Reorder</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recommended for You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <Text style={styles.sectionLink}>View All</Text>
          </View>

          {/* Vendor Cards */}
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.vendorCard}>
              <View style={styles.vendorImage}>
                <View style={styles.promotedBadge}>
                  <Text style={styles.promotedText}>PROMOTED</Text>
                </View>
              </View>

              <View style={styles.vendorContent}>
                <View style={styles.vendorHeader}>
                  <Text style={styles.vendorName}>The Burger Joint</Text>
                  <View style={styles.favoriteIcon} />
                </View>

                <Text style={styles.vendorCuisine}>American • Burgers • Fast Food</Text>

                <View style={styles.vendorMeta}>
                  <View style={styles.metaItem}>
                    <View style={styles.starIcon} />
                    <Text style={styles.metaText}>4.5</Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <Text style={styles.metaText}>25-35 min</Text>
                  <View style={styles.metaDivider} />
                  <Text style={styles.metaText}>$2.99 delivery</Text>
                </View>

                {/* Promotional Tag */}
                <View style={styles.promoTag}>
                  <Text style={styles.promoTagText}>🎉 Free delivery on orders over $15</Text>
                </View>
              </View>
            </View>
          ))}
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
          <Text style={styles.navText}>Search</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navText}>Orders</Text>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F97316',
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  deliverToText: {
    fontSize: 12,
    color: '#737373',
    marginBottom: 2,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
    marginRight: 4,
  },
  chevronIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#D4D4D4',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
  },
  searchIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#A3A3A3',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#171717',
    height: 40,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F97316',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginHorizontal: -6,
  },
  categoryCard: {
    width: '47%',
    marginHorizontal: '1.5%',
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
  },
  categoryCardMore: {
    backgroundColor: '#FAFAFA',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
  },
  categoryIconContainer: {
    marginBottom: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 12,
    color: '#737373',
  },
  rxBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rxBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  moreIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E5E5',
  },
  promoBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#C2410C',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#9A3412',
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  promoImage: {
    width: 120,
    height: 120,
    backgroundColor: '#FED7AA',
    borderRadius: 12,
    marginLeft: 16,
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  reorderCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  reorderImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#E5E5E5',
  },
  reorderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
    padding: 12,
    paddingBottom: 4,
  },
  reorderVendor: {
    fontSize: 12,
    color: '#737373',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  reorderButton: {
    backgroundColor: '#F97316',
    paddingVertical: 8,
    alignItems: 'center',
  },
  reorderButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  vendorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  vendorImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E5E5E5',
    position: 'relative',
  },
  promotedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#F97316',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  promotedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  vendorContent: {
    padding: 16,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    flex: 1,
  },
  favoriteIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  vendorCuisine: {
    fontSize: 14,
    color: '#737373',
    marginBottom: 12,
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    marginRight: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#525252',
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4D4D4',
    marginHorizontal: 8,
  },
  promoTag: {
    marginTop: 12,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  promoTagText: {
    fontSize: 13,
    color: '#15803D',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 24,
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
  navItemActive: {
    // Active state
  },
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
