import { create } from 'zustand';
import { Order } from '../types';

interface OrderState {
  userId: string | null;
  orders: Order[];
  setActiveUser: (userId: string | null) => void;
  addOrder: (order: Order) => void;
  getOrderById: (id: string, userId: string) => Order | undefined;
}

const ORDERS_STORAGE_PREFIX = 'wholemart_orders_v2_';
const LEGACY_ORDERS_STORAGE_KEY = 'wholemart_orders_v1';

const getOrdersStorageKey = (userId: string) =>
  `${ORDERS_STORAGE_PREFIX}${encodeURIComponent(userId)}`;

const isOrderForUser = (value: unknown, userId: string): value is Order => {
  if (!value || typeof value !== 'object') return false;
  const order = value as Record<string, unknown>;
  return (
    order.userId === userId &&
    typeof order.id === 'string' &&
    typeof order.date === 'string' &&
    Array.isArray(order.items)
  );
};

const loadOrders = (userId: string): Order[] => {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem(getOrdersStorageKey(userId));
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter((order) => isOrderForUser(order, userId)) : [];
  } catch {
    return [];
  }
};

const saveOrders = (userId: string, orders: Order[]) => {
  localStorage.setItem(getOrdersStorageKey(userId), JSON.stringify(orders));
};

if (typeof window !== 'undefined') {
  localStorage.removeItem(LEGACY_ORDERS_STORAGE_KEY);
}

export const useOrderStore = create<OrderState>((set, get) => ({
  userId: null,
  orders: [],

  setActiveUser: (userId) => {
    if (userId === get().userId) return;
    set({
      userId,
      orders: userId ? loadOrders(userId) : [],
    });
  },

  addOrder: (order) => {
    const { userId } = get();
    if (!userId || order.userId !== userId) return;

    set((state) => {
      const updated = [order, ...state.orders];
      saveOrders(userId, updated);
      return { orders: updated };
    });
  },

  getOrderById: (id, userId) => {
    const state = get();
    if (state.userId !== userId) return undefined;
    return state.orders.find((order) => order.id === id && order.userId === userId);
  },
}));
