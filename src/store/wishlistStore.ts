import { create } from 'zustand';
import { Product } from '../types';
import { useCartStore } from './cartStore';

interface WishlistState {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  moveToCart: (product: Product) => void;
  moveAllToCart: () => void;
  clearWishlist: () => void;
}

const WISHLIST_STORAGE_KEY = 'wholemart_wishlist_v1';

const loadInitialWishlist = (): Product[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to load wishlist from storage', e);
    return [];
  }
};

const saveWishlist = (items: Product[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save wishlist to storage', e);
  }
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: loadInitialWishlist(),

  toggleWishlist: (product) => {
    set((state) => {
      const exists = state.items.some((item) => item.id === product.id);
      let updated: Product[];
      if (exists) {
        updated = state.items.filter((item) => item.id !== product.id);
      } else {
        updated = [product, ...state.items];
      }
      saveWishlist(updated);
      return { items: updated };
    });
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item.id === productId);
  },

  removeItem: (productId) => {
    set((state) => {
      const updated = state.items.filter((item) => item.id !== productId);
      saveWishlist(updated);
      return { items: updated };
    });
  },

  moveToCart: (product) => {
    useCartStore.getState().addItem(product);
    get().removeItem(product.id);
  },

  moveAllToCart: () => {
    const items = get().items;
    items.forEach((item) => {
      useCartStore.getState().addItem(item);
    });
    get().clearWishlist();
  },

  clearWishlist: () => {
    saveWishlist([]);
    set({ items: [] });
  },
}));
