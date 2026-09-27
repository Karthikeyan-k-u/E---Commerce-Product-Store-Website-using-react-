import { useMemo } from 'react';
import type { Community, SpendTier } from '../types';
import { COMMUNITIES } from '../data/communities';
import { useCommunityStore } from '../store/communityStore';
import { useGroupBuyStore } from '../store/groupBuyStore';
import { getSpendTier, sumMyUnitsInCommunity } from '../lib/groupBuy';

export interface UnlockedCommunity {
  community: Community;
  /** Units the visitor has bought in this community, which is what unlocked it. */
  myUnits: number;
  spendTier?: SpendTier;
}

/**
 * Communities the visitor has bought from but not yet joined. This is the
 * purchase-is-the-invitation rule: you cannot join before you have bought, and
 * we only nag once per community.
 */
export const useUnlockedCommunities = (): UnlockedCommunity[] => {
  const purchases = useGroupBuyStore((state) => state.purchases);
  const joinedCommunities = useCommunityStore((state) => state.joinedCommunities);
  const dismissedUnlocks = useCommunityStore((state) => state.dismissedUnlocks);

  return useMemo(
    () =>
      COMMUNITIES.filter(
        (community) =>
          !joinedCommunities.includes(community.slug) &&
          !dismissedUnlocks.includes(community.slug) &&
          sumMyUnitsInCommunity(community, purchases) > 0
      ).map((community) => {
        const myUnits = sumMyUnitsInCommunity(community, purchases);
        return {
          community,
          myUnits,
          spendTier: getSpendTier(myUnits),
        };
      }),
    [purchases, joinedCommunities, dismissedUnlocks]
  );
};
