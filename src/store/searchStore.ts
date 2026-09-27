import { create } from 'zustand';

interface SearchState {
  isOpen: boolean;
  query: string;
  recentSearches: string[];
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setQuery: (q: string) => void;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
}

const SEARCH_HISTORY_KEY = 'wholemart_search_history_v1';

const loadRecentSearches = (): string[] => {
  if (typeof window === 'undefined') return ['Aura Headphones', 'OLED Monitor', 'Levitation Lamp', 'Smartwatch'];
  try {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
    return saved ? JSON.parse(saved) : ['Aura Headphones', 'OLED Monitor', 'Levitation Lamp', 'Smartwatch'];
  } catch (e) {
    return ['Aura Headphones', 'OLED Monitor', 'Levitation Lamp', 'Smartwatch'];
  }
};

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  query: '',
  recentSearches: loadRecentSearches(),

  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false, query: '' }),
  toggleSearch: () => set((s) => ({ isOpen: !s.isOpen, query: '' })),
  setQuery: (query) => set({ query }),

  addRecentSearch: (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    set((state) => {
      const filtered = state.recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return { recentSearches: updated };
    });
  },

  clearRecentSearches: () => {
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (e) {
      console.error(e);
    }
    set({ recentSearches: [] });
  },
}));
