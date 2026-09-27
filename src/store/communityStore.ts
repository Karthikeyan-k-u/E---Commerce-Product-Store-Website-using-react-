import { create } from 'zustand';

interface CommunityState {
  joinedCommunities: string[];
  /** Purchase-unlock prompts the visitor has already closed, so they stop nagging. */
  dismissedUnlocks: string[];
  join: (slug: string) => void;
  leave: (slug: string) => void;
  dismissUnlock: (slug: string) => void;
  isMember: (slug: string) => boolean;
}

const COMMUNITY_STORAGE_KEY = 'wholemart_communities_v1';

interface StoredCommunities {
  joined?: string[];
  dismissedUnlocks?: string[];
}

const loadState = (): { joined: string[]; dismissedUnlocks: string[] } => {
  const fallback = { joined: [] as string[], dismissedUnlocks: [] as string[] };
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(COMMUNITY_STORAGE_KEY);
    if (!saved) return fallback;
    // v1 stored a bare string array, so the array form still has to parse.
    const parsed = JSON.parse(saved) as string[] | StoredCommunities;
    if (Array.isArray(parsed)) return { joined: parsed, dismissedUnlocks: [] };
    return {
      joined: parsed.joined ?? [],
      dismissedUnlocks: parsed.dismissedUnlocks ?? [],
    };
  } catch (e) {
    console.error(e);
    return fallback;
  }
};

const saveState = (joined: string[], dismissedUnlocks: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      COMMUNITY_STORAGE_KEY,
      JSON.stringify({ joined, dismissedUnlocks } satisfies StoredCommunities)
    );
  } catch (e) {
    console.error(e);
  }
};

export const useCommunityStore = create<CommunityState>((set, get) => {
  const initial = loadState();
  const persist = (joined: string[], dismissedUnlocks: string[]) => {
    saveState(joined, dismissedUnlocks);
    set({ joinedCommunities: joined, dismissedUnlocks });
  };

  return {
    joinedCommunities: initial.joined,
    dismissedUnlocks: initial.dismissedUnlocks,

    join: (slug) => {
      if (get().joinedCommunities.includes(slug)) return;
      persist([...get().joinedCommunities, slug], get().dismissedUnlocks);
    },

    leave: (slug) => {
      persist(
        get().joinedCommunities.filter((s) => s !== slug),
        get().dismissedUnlocks
      );
    },

    dismissUnlock: (slug) => {
      if (get().dismissedUnlocks.includes(slug)) return;
      persist(get().joinedCommunities, [...get().dismissedUnlocks, slug]);
    },

    isMember: (slug) => get().joinedCommunities.includes(slug),
  };
});