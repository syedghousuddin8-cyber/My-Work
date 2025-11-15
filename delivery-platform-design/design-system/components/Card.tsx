import React from 'react';
import { StyleSheet, View, TouchableOpacity, ViewStyle } from 'react-native';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  onPress,
  style,
  padding = 16,
}) => {
  const cardStyles = [
    styles.base,
    styles[variant],
    { padding },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filled: {
    backgroundColor: '#FAFAFA',
  },
});

// Restaurant/Vendor Card Component
interface VendorCardProps {
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  cuisineTypes?: string[];
  isPromoted?: boolean;
  isFavorite?: boolean;
  onPress?: () => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  name,
  rating,
  deliveryTime,
  deliveryFee,
  cuisineTypes = [],
  isPromoted = false,
  onPress,
}) => {
  return (
    <Card variant="elevated" onPress={onPress} padding={0}>
      <View>
        {/* Image Container - Placeholder */}
        <View style={vendorStyles.imageContainer}>
          {isPromoted && (
            <View style={vendorStyles.promotedBadge}>
              <View style={vendorStyles.badgeContent} />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={vendorStyles.content}>
          <View style={vendorStyles.header}>
            <View style={vendorStyles.titleSection}>
              <View style={vendorStyles.nameContainer} />
              {cuisineTypes.length > 0 && (
                <View style={vendorStyles.cuisineContainer} />
              )}
            </View>
          </View>

          <View style={vendorStyles.metadata}>
            <View style={vendorStyles.metaItem} />
            <View style={vendorStyles.metaDivider} />
            <View style={vendorStyles.metaItem} />
            <View style={vendorStyles.metaDivider} />
            <View style={vendorStyles.metaItem} />
          </View>
        </View>
      </View>
    </Card>
  );
};

const vendorStyles = StyleSheet.create({
  imageContainer: {
    height: 160,
    backgroundColor: '#E5E5E5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
  badgeContent: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleSection: {
    flex: 1,
  },
  nameContainer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 4,
  },
  cuisineContainer: {
    fontSize: 14,
    color: '#737373',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4D4D4',
    marginHorizontal: 8,
  },
});
