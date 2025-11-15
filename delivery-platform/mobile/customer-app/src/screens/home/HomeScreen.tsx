import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { vendorAPI } from '../../api/vendor';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const CATEGORIES = [
  { id: 'food', name: 'Food', icon: 'restaurant' },
  { id: 'grocery', name: 'Grocery', icon: 'cart' },
  { id: 'pharmacy', name: 'Pharmacy', icon: 'medical' },
  { id: 'flowers', name: 'Flowers', icon: 'flower' },
  { id: 'pet', name: 'Pet Care', icon: 'paw' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('food');

  useEffect(() => {
    loadVendors();
  }, [selectedCategory]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorAPI.search({
        category: selectedCategory,
        // Add user location when available
      });
      setVendors(response.vendors || []);
    } catch (error) {
      console.error('Load vendors error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderVendorCard = (vendor: any) => (
    <TouchableOpacity
      key={vendor.id}
      style={styles.vendorCard}
      onPress={() =>
        navigation.navigate('VendorDetail' as never, { vendorId: vendor.id } as never)
      }
    >
      <Image
        source={{ uri: vendor.banner_url || 'https://via.placeholder.com/400x200' }}
        style={styles.vendorImage}
      />
      <View style={styles.vendorInfo}>
        <Text style={styles.vendorName}>{vendor.business_name}</Text>
        <View style={styles.vendorMeta}>
          <Icon name="star" size={16} color={colors.warning} />
          <Text style={styles.rating}>{vendor.average_rating || '4.5'}</Text>
          <Text style={styles.metaSeparator}>•</Text>
          <Text style={styles.metaText}>{vendor.average_delivery_time || 30} min</Text>
          <Text style={styles.metaSeparator}>•</Text>
          <Text style={styles.metaText}>{vendor.price_range || '$$'}</Text>
        </View>
        {vendor.cuisines && vendor.cuisines.length > 0 && (
          <Text style={styles.cuisines}>{vendor.cuisines.join(', ')}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Day!</Text>
          <View style={styles.locationContainer}>
            <Icon name="location" size={16} color={colors.primary} />
            <Text style={styles.location}>123 Main St, New York</Text>
            <Icon name="chevron-down" size={16} color={colors.textSecondary} />
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="notifications-outline" size={24} color={colors.textPrimary} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for restaurants, groceries..."
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Icon
                name={category.icon}
                size={20}
                color={
                  selectedCategory === category.id
                    ? colors.textInverse
                    : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Vendors List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {CATEGORIES.find((c) => c.id === selectedCategory)?.name} near you
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
          ) : vendors.length > 0 ? (
            vendors.map(renderVendorCard)
          ) : (
            <Text style={styles.emptyText}>No vendors found</Text>
          )}
        </View>
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
  },
  greeting: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  location: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  notificationButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    ...typography.caption,
    color: colors.textInverse,
    fontSize: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.textInverse,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  vendorCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  vendorImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.backgroundSecondary,
  },
  vendorInfo: {
    padding: 12,
  },
  vendorName: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  rating: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  metaSeparator: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginHorizontal: 4,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  cuisines: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 32,
  },
});
