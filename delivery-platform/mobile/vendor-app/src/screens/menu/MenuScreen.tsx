import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';

export default function MenuScreen() {
  const menuItems = [
    { id: '1', name: 'Burger Combo', price: 15.99, category: 'Main Course', available: true, image: 'https://via.placeholder.com/80' },
    { id: '2', name: 'French Fries', price: 4.99, category: 'Sides', available: true, image: 'https://via.placeholder.com/80' },
    { id: '3', name: 'Caesar Salad', price: 8.99, category: 'Salads', available: false, image: 'https://via.placeholder.com/80' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Icon name="add" size={24} color={colors.textInverse} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {menuItems.map((item) => (
          <View key={item.id} style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity>
                <Icon name="create-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
              <View style={styles.availabilityToggle}>
                <Icon
                  name={item.available ? 'checkmark-circle' : 'close-circle'}
                  size={24}
                  color={item.available ? colors.success : colors.error}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 48, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  addBtn: { width: 40, height: 40, backgroundColor: colors.primary, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  menuItem: { flexDirection: 'row', backgroundColor: colors.surface, padding: 12, marginHorizontal: 16, marginTop: 12, borderRadius: 12, alignItems: 'center' },
  itemImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: colors.backgroundSecondary },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  itemCategory: { fontSize: 12, color: colors.textTertiary, marginBottom: 4 },
  itemPrice: { fontSize: 14, fontWeight: '600', color: colors.primary },
  itemActions: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  availabilityToggle: {},
});
