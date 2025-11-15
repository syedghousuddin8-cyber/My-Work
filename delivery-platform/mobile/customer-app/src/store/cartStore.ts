import { create } from 'zustand';

interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customizations?: any[];
  addons?: any[];
}

interface CartState {
  items: CartItem[];
  vendorId: string | null;
  vendorName: string | null;
  addItem: (item: CartItem, vendorId: string, vendorName: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  vendorId: null,
  vendorName: null,

  addItem: (item, vendorId, vendorName) => {
    const { items, vendorId: currentVendorId } = get();

    // If adding from different vendor, clear cart
    if (currentVendorId && currentVendorId !== vendorId) {
      set({
        items: [item],
        vendorId,
        vendorName,
      });
      return;
    }

    const existingItem = items.find((i) => i.menuItemId === item.menuItemId);

    if (existingItem) {
      set({
        items: items.map((i) =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      });
    } else {
      set({
        items: [...items, item],
        vendorId,
        vendorName,
      });
    }
  },

  removeItem: (menuItemId) => {
    const items = get().items.filter((i) => i.menuItemId !== menuItemId);
    set({
      items,
      vendorId: items.length === 0 ? null : get().vendorId,
      vendorName: items.length === 0 ? null : get().vendorName,
    });
  },

  updateQuantity: (menuItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(menuItemId);
      return;
    }

    set({
      items: get().items.map((i) =>
        i.menuItemId === menuItemId ? { ...i, quantity } : i
      ),
    });
  },

  clearCart: () => {
    set({ items: [], vendorId: null, vendorName: null });
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
