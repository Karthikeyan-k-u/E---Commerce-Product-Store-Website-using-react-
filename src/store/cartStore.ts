import { create } from 'zustand';
import { CartItem, Product, ProductColor } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  discountRate: number; // e.g. 0.10 for 10%
  fixedDiscount: number; // e.g. 100 for ₹100 off
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    product: Product,
    options?: {
      color?: ProductColor;
      size?: string;
      quantity?: number;
      price?: number;
      originalPrice?: number;
      freeShipping?: boolean;
    }
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const CART_STORAGE_KEY = 'wholemart_cart_v1';
const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;

const loadInitialCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to load cart from storage', e);
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cart to storage', e);
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: loadInitialCart(),
  isOpen: false,
  couponCode: '',
  discountRate: 0,
  fixedDiscount: 0,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  addItem: (product, options) => {
    const color = options?.color || product.colors[0];
    const size = options?.size || (product.sizes ? product.sizes[0] : undefined);
    const qty = options?.quantity || 1;

    const uniqueId = `${product.id}-${color?.name || 'default'}-${size || 'default'}`;

    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.id === uniqueId);
      let updatedItems: CartItem[];

      if (existingIndex > -1) {
        updatedItems = state.items.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        const newItem: CartItem = {
          id: uniqueId,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          category: product.category,
          price: options?.price ?? product.price,
          originalPrice: options?.originalPrice ?? product.originalPrice,
          image: color?.image || product.images[0],
          selectedColor: color,
          selectedSize: size,
          quantity: qty,
          freeShipping: options?.freeShipping,
        };
        updatedItems = [...state.items, newItem];
      }

      saveCart(updatedItems);
      return { items: updatedItems, isOpen: true };
    });
  },

  removeItem: (itemId) => {
    set((state) => {
      const updated = state.items.filter((item) => item.id !== itemId);
      saveCart(updated);
      return { items: updated };
    });
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => {
      const updated = state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      saveCart(updated);
      return { items: updated };
    });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [], couponCode: '', discountRate: 0, fixedDiscount: 0 });
  },

  applyCoupon: (code: string) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'WLMART10') {
      set({ couponCode: 'WLMART10', discountRate: 0.1, fixedDiscount: 0 });
      return { success: true, message: 'WLMART10 applied: 10% off entire order!' };
    }
    if (upper === 'WLMART100') {
      set({ couponCode: 'WLMART100', discountRate: 0, fixedDiscount: 100 });
      return { success: true, message: 'WLMART100 applied: ₹100 discount added!' };
    }
    if (upper === 'STUDENT') {
      set({ couponCode: 'STUDENT', discountRate: 0.15, fixedDiscount: 0 });
      return { success: true, message: 'STUDENT applied: 15% college discount!' };
    }
    return { success: false, message: 'Invalid coupon code. Try WLMART10 or WLMART100.' };
  },

  removeCoupon: () => {
    set({ couponCode: '', discountRate: 0, fixedDiscount: 0 });
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getDiscount: () => {
    const subtotal = get().getSubtotal();
    const { discountRate, fixedDiscount } = get();
    let discount = subtotal * discountRate;
    if (fixedDiscount > 0) {
      discount += fixedDiscount;
    }
    return Math.min(discount, subtotal);
  },

  getShippingFee: () => {
    const { items } = get();
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    // A fully unlocked group-buy tier waives delivery on the whole basket.
    if (items.some((item) => item.freeShipping)) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    const discount = get().getDiscount();
    const shipping = get().getShippingFee();
    return Math.max(0, subtotal - discount + shipping);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
