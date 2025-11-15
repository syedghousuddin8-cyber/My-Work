import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { vendorAPI } from '../../api/vendor';
import { useCartStore } from '../../store/cartStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function VendorDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { vendorId } = route.params as { vendorId: string };
  const { addItem, getItemCount } = useCartStore();

  const [vendor, setVendor] = useState<any>(null);
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    loadVendorData();
  }, [vendorId]);

  const loadVendorData = async () => {
    try {
      setLoading(true);
      const [vendorData, menuData] = await Promise.all([
        vendorAPI.getVendor(vendorId),
        vendorAPI.getMenu(vendorId),
      ]);

      setVendor(vendorData);
      setMenu(menuData);

      if (menuData.categories && menuData.categories.length > 0) {
        setSelectedCategory(menuData.categories[0].name);
      }
    } catch (error) {
      console.error('Load vendor error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: any) => {
    addItem(
      {
        id: item.id,
        menuItemId: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: 1,
        image: item.image_urls?.[0] || '',
      },
      vendorId,
      vendor.business_name
    );
  };

  const renderMenuItem = (item: any) => (
    <View key={item.id} style={styles.menuItem}>
      <Image
        source={{ uri: item.image_urls?.[0] || 'https://via.placeholder.com/100' }}
        style={styles.menuItemImage}
      />
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.menuItemFooter}>
          <Text style={styles.menuItemPrice}>${parseFloat(item.price).toFixed(2)}</Text>
          {item.is_available ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(item)}
            >
              <Icon name="add" size={20} color={colors.textInverse} />
            </TouchableOpacity>
          ) : (
            <Text style={styles.unavailableText}>Unavailable</Text>
          )}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!vendor || !menu) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Vendor not found</Text>
      </View>
    );
  }

  const cartCount = getItemCount();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Banner */}
        <Image
          source={{ uri: vendor.banner_url || 'https://via.placeholder.com/400x200' }}
          style={styles.banner}
        />

        {/* Vendor Info */}
        <View style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{vendor.business_name}</Text>
          <Text style={styles.description}>{vendor.description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon name="star" size={16} color={colors.warning} />
              <Text style={styles.metaText}>
                {vendor.average_rating || '4.5'} ({vendor.total_orders || 0}+ ratings)
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{vendor.average_delivery_time || 30} min</Text>
            </View>
          </View>
        </View>

        {/* Category Tabs */}
        {menu.categories && menu.categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryTabs}
            contentContainerStyle={styles.categoryTabsContent}
          >
            {menu.categories.map((category: any) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryTab,
                  selectedCategory === category.name && styles.categoryTabActive,
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    selectedCategory === category.name && styles.categoryTabTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menu.categories
            ?.find((c: any) => c.name === selectedCategory)
            ?.items.map(renderMenuItem)}
        </View>
      </ScrollView>

      {/* Cart Button */}
      {cartCount > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart' as never)}
        >
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
          <Text style={styles.cartButtonText}>View Cart</Text>
          <Icon name="arrow-forward" size={20} color={colors.textInverse} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 200,
    backgroundColor: colors.backgroundSecondary,
  },
  vendorInfo: {
    padding: 16,
    backgroundColor: colors.surface,
  },
  vendorName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  categoryTabs: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 12,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
  },
  categoryTabActive: {
    backgroundColor: colors.primary,
  },
  categoryTabText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  categoryTabTextActive: {
    color: colors.textInverse,
  },
  menuSection: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItemImage: {
    width: 100,
    height: 100,
    backgroundColor: colors.backgroundSecondary,
  },
  menuItemInfo: {
    flex: 1,
    padding: 12,
  },
  menuItemName: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  menuItemDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    ...typography.h4,
    color: colors.primary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.primary,
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  cartBadge: {
    backgroundColor: colors.textInverse,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  cartButtonText: {
    ...typography.button,
    color: colors.textInverse,
  },
});
