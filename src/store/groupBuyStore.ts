import { create } from 'zustand';
import type { Buyer } from '../types';

export interface PurchaseRecord {
  units: number;
  entries: Buyer[];
}

interface RecordPurchaseInput {
  productId: string;
  communitySlug: string;
  units: number;
  variant?: string;
}

interface GroupBuyState {
  anchorAt: number;
  purchases: Record<string, PurchaseRecord>;
  recordPurchase: (input: RecordPurchaseInput) => PurchaseRecord;
  getRecord: (productId: string) => PurchaseRecord | undefined;
  reset: () => void;
}

const GROUP_BUY_STORAGE_KEY = 'wholemart_groupbuy_v1';

const emptyRecord: PurchaseRecord = { units: 0, entries: [] };

const loadState = (): { anchorAt: number; purchases: Record<string, PurchaseRecord> } => {
  const fallback = { anchorAt: Date.now(), purchases: {} as Record<string, PurchaseRecord> };
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(GROUP_BUY_STORAGE_KEY);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved) as {
      anchorAt?: number;
      purchases?: Record<string, PurchaseRecord>;
    };
    return {
      anchorAt: parsed.anchorAt ?? fallback.anchorAt,
      purchases: parsed.purchases ?? {},
    };
  } catch (error) {
    console.error('Failed to load group buy state', error);
    return fallback;
  }
};

const saveState = (anchorAt: number, purchases: Record<string, PurchaseRecord>) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GROUP_BUY_STORAGE_KEY, JSON.stringify({ anchorAt, purchases }));
  } catch (error) {
    console.error('Failed to save group buy state', error);
  }
};

const initial = loadState();

export const useGroupBuyStore = create<GroupBuyState>((set, get) => ({
  anchorAt: initial.anchorAt,
  purchases: initial.purchases,

  recordPurchase: ({ productId, communitySlug, units, variant }) => {
    const current = get().purchases[productId] ?? emptyRecord;
    const entry: Buyer = {
      id: `${productId}-you-${Date.now()}`,
      name: 'You',
      communitySlug,
      units,
      variant,
      boughtAt: Date.now(),
      isYou: true,
    };
    const record: PurchaseRecord = {
      units: current.units + units,
      entries: [entry, ...current.entries].slice(0, 12),
    };
    const purchases = { ...get().purchases, [productId]: record };
    saveState(get().anchorAt, purchases);
    set({ purchases });
    return record;
  },

  getRecord: (productId) => get().purchases[productId],

  reset: () => {
    saveState(Date.now(), {});
    set({ anchorAt: Date.now(), purchases: {} });
  },
}));
