import { create } from 'zustand';

interface RecentState {
  recentSlugs: string[];
  addRecentSlug: (slug: string) => void;
  clearRecent: () => void;
}

const RECENT_STORAGE_KEY = 'wholemart_recent_v1';

const loadRecentSlugs = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(RECENT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const useRecentStore = create<RecentState>((set) => ({
  recentSlugs: loadRecentSlugs(),

  addRecentSlug: (slug) => {
    set((state) => {
      const filtered = state.recentSlugs.filter((s) => s !== slug);
      const updated = [slug, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return { recentSlugs: updated };
    });
  },

  clearRecent: () => {
    try {
      localStorage.removeItem(RECENT_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    set({ recentSlugs: [] });
  },
}));
