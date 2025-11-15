/**
 * RESTAURANT DETAIL SCREEN - Customer App
 * Detailed view of a restaurant with menu, info, and reviews
 *
 * Features:
 * - Restaurant header with image, name, rating
 * - Delivery info (time, fee, minimum order)
 * - Menu categories with sticky navigation
 * - Search within menu
 * - Item customization
 * - Add to cart functionality
 * - Reviews and ratings
 */

import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

export const RestaurantDetailScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <View style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.shareButton}>
            <View style={styles.shareIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <View style={styles.favoriteIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Restaurant Hero Image */}
        <View style={styles.heroImage}>
          <View style={styles.imagePlaceholder} />
        </View>

        {/* Restaurant Info */}
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>The Burger Joint</Text>
          <Text style={styles.restaurantCuisine}>American • Burgers • Fast Food</Text>

          {/* Rating and Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.starIcon} />
              <Text style={styles.statText}>4.5</Text>
              <Text style={styles.statSubtext}>(1,234)</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statText}>25-35 min</Text>
              <Text style={styles.statSubtext}>Delivery</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statText}>$2.99</Text>
              <Text style={styles.statSubtext}>Fee</Text>
            </View>
          </View>

          {/* Promotion Banner */}
          <View style={styles.promoBanner}>
            <View style={styles.promoIcon} />
            <Text style={styles.promoText}>Free delivery on orders over $15</Text>
          </View>
        </View>

        {/* Delivery Info Card */}
        <View style={styles.deliveryInfoCard}>
          <View style={styles.deliveryInfoRow}>
            <View style={styles.deliveryIconContainer}>
              <View style={styles.deliveryIcon} />
            </View>
            <View style={styles.deliveryTextContainer}>
              <Text style={styles.deliveryTitle}>Delivery to 123 Main St</Text>
              <Text style={styles.deliverySubtitle}>Change address</Text>
            </View>
            <View style={styles.chevronRight} />
          </View>
        </View>

        {/* Menu Categories Tabs - Sticky */}
        <View style={styles.menuTabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={[styles.menuTab, styles.menuTabActive]}>
              <Text style={[styles.menuTabText, styles.menuTabTextActive]}>Popular</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuTab}>
              <Text style={styles.menuTabText}>Burgers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuTab}>
              <Text style={styles.menuTabText}>Sides</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuTab}>
              <Text style={styles.menuTabText}>Drinks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuTab}>
              <Text style={styles.menuTabText}>Desserts</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Search in Menu */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search menu items...</Text>
        </View>

        {/* Menu Section - Popular Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Popular Items</Text>

          {/* Menu Item 1 */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemInfo}>
                <View style={styles.menuItemBadges}>
                  <View style={styles.bestsellerBadge}>
                    <Text style={styles.badgeText}>BESTSELLER</Text>
                  </View>
                </View>
                <Text style={styles.menuItemName}>Classic Cheeseburger</Text>
                <Text style={styles.menuItemDescription}>
                  Angus beef patty, cheddar cheese, lettuce, tomato, onion, pickles, special sauce
                </Text>
                <View style={styles.menuItemMeta}>
                  <View style={styles.starIcon} />
                  <Text style={styles.ratingText}>4.8</Text>
                  <Text style={styles.reviewCount}>(234)</Text>
                </View>
                <Text style={styles.menuItemPrice}>$12.99</Text>
              </View>
              <View style={styles.menuItemImageContainer}>
                <View style={styles.menuItemImage} />
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          {/* Menu Item 2 */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>Double Bacon Burger</Text>
                <Text style={styles.menuItemDescription}>
                  Two beef patties, crispy bacon, cheddar, BBQ sauce
                </Text>
                <View style={styles.menuItemMeta}>
                  <View style={styles.starIcon} />
                  <Text style={styles.ratingText}>4.6</Text>
                  <Text style={styles.reviewCount}>(189)</Text>
                </View>
                <Text style={styles.menuItemPrice}>$15.99</Text>
              </View>
              <View style={styles.menuItemImageContainer}>
                <View style={styles.menuItemImage} />
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          {/* Menu Item 3 - Out of Stock */}
          <TouchableOpacity style={[styles.menuItem, styles.menuItemDisabled]}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemInfo}>
                <Text style={[styles.menuItemName, styles.menuItemNameDisabled]}>
                  Veggie Burger
                </Text>
                <Text style={styles.menuItemDescription}>
                  Plant-based patty, avocado, sprouts, tahini sauce
                </Text>
                <Text style={[styles.menuItemPrice, styles.menuItemPriceDisabled]}>$13.99</Text>
                <View style={styles.outOfStockBadge}>
                  <Text style={styles.outOfStockText}>Currently Unavailable</Text>
                </View>
              </View>
              <View style={styles.menuItemImageContainer}>
                <View style={[styles.menuItemImage, styles.menuItemImageDisabled]} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Restaurant Info</Text>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Hours</Text>
              <Text style={styles.infoValue}>11:00 AM - 10:00 PM • Open now</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>456 Restaurant Ave, City, State 12345</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing for Cart FAB */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Cart Button */}
      <View style={styles.cartFab}>
        <TouchableOpacity style={styles.cartButton}>
          <View style={styles.cartButtonContent}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>3</Text>
            </View>
            <Text style={styles.cartButtonText}>View Cart</Text>
            <Text style={styles.cartButtonPrice}>$42.97</Text>
          </View>
        </TouchableOpacity>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#171717',
  },
  headerActions: {
    flexDirection: 'row',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  shareIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#171717',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#EF4444',
  },
  heroImage: {
    height: 280,
    backgroundColor: '#E5E5E5',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D4D4D4',
  },
  restaurantInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  restaurantName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 6,
  },
  restaurantCuisine: {
    fontSize: 15,
    color: '#737373',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
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
  statText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
    marginRight: 4,
  },
  statSubtext: {
    fontSize: 14,
    color: '#737373',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 8,
  },
  promoIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#22C55E',
    borderRadius: 10,
    marginRight: 8,
  },
  promoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#15803D',
    flex: 1,
  },
  deliveryInfoCard: {
    margin: 20,
    marginBottom: 0,
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  deliveryInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deliveryIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
  },
  deliveryTextContainer: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 2,
  },
  deliverySubtitle: {
    fontSize: 13,
    color: '#F97316',
  },
  chevronRight: {
    width: 20,
    height: 20,
    backgroundColor: '#A3A3A3',
  },
  menuTabs: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  menuTab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  menuTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#F97316',
  },
  menuTabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#737373',
  },
  menuTabTextActive: {
    color: '#F97316',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#A3A3A3',
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#A3A3A3',
  },
  menuSection: {
    paddingHorizontal: 20,
  },
  menuSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 16,
  },
  menuItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemDisabled: {
    opacity: 0.6,
  },
  menuItemContent: {
    flexDirection: 'row',
  },
  menuItemInfo: {
    flex: 1,
    paddingRight: 16,
  },
  menuItemBadges: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bestsellerBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  menuItemName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 6,
  },
  menuItemNameDisabled: {
    color: '#A3A3A3',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#737373',
    lineHeight: 20,
    marginBottom: 8,
  },
  menuItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#737373',
  },
  menuItemPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F97316',
  },
  menuItemPriceDisabled: {
    color: '#A3A3A3',
  },
  menuItemImageContainer: {
    position: 'relative',
  },
  menuItemImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#E5E5E5',
  },
  menuItemImageDisabled: {
    opacity: 0.5,
  },
  addButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  outOfStockBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  outOfStockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  infoSection: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: '#F5F5F5',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#F97316',
    borderRadius: 12,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#737373',
  },
  bottomSpacing: {
    height: 100,
  },
  cartFab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'transparent',
  },
  cartButton: {
    backgroundColor: '#F97316',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  cartBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F97316',
  },
  cartButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 12,
  },
  cartButtonPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
