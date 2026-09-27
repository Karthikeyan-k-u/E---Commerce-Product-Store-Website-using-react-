import { useCallback, useMemo } from 'react';
import type { Community, SpendTier } from '../types';
import { getCommunityBySlug, COMMUNITIES } from '../data/communities';
import { useCommunityStore } from '../store/communityStore';
import { useGroupBuyStore } from '../store/groupBuyStore';
import {
  canJoinCommunity,
  getNextSpendTier,
  getSpendProgressPct,
  getSpendTier,
  sumMyUnitsInCommunity,
} from '../lib/groupBuy';

export interface CommunityUnlock {
  community?: Community;
  isMember: boolean;
  /** Units the visitor has bought in this community, across all its drops. */
  myUnits: number;
  /** Membership is earned, not given: a purchase is the only way in. */
  canJoin: boolean;
  spendTier?: SpendTier;
  nextSpendTier?: SpendTier;
  spendPct: number;
  /** No-ops when the visitor has not bought in this community yet. */
  requestJoin: () => boolean;
}

/**
 * The single definition of who may join a community. Every join surface reads
 * `canJoin` for its locked state and routes its click through `requestJoin`, so
 * the rule cannot be bypassed by a surface that forgets to check.
 */
export const useCommunityUnlock = (communitySlug: string): CommunityUnlock => {
  const purchases = useGroupBuyStore((state) => state.purchases);
  const joinedCommunities = useCommunityStore((state) => state.joinedCommunities);
  const join = useCommunityStore((state) => state.join);

  const community = getCommunityBySlug(communitySlug);

  const myUnits = useMemo(
    () => (community ? sumMyUnitsInCommunity(community, purchases) : 0),
    [community, purchases]
  );

  const isMember = joinedCommunities.includes(communitySlug);
  const canJoin = canJoinCommunity(myUnits);

  const requestJoin = useCallback(() => {
    if (!canJoin || isMember) return false;
    join(communitySlug);
    return true;
  }, [canJoin, isMember, join, communitySlug]);

  return {
    community,
    isMember,
    myUnits,
    canJoin,
    spendTier: getSpendTier(myUnits),
    nextSpendTier: getNextSpendTier(myUnits),
    spendPct: getSpendProgressPct(myUnits),
    requestJoin,
  };
};

export interface CommunityGate {
  myUnits: number;
  canJoin: boolean;
  isMember: boolean;
}

/**
 * The same gate for every community at once, for pages that render a list. Hooks
 * inside a `.map()` would be order-dependent, so the page subscribes once and
 * looks the answer up.
 */
export const useCommunityGates = (): Record<string, CommunityGate> => {
  const purchases = useGroupBuyStore((state) => state.purchases);
  const joinedCommunities = useCommunityStore((state) => state.joinedCommunities);

  return useMemo(() => {
    const gates: Record<string, CommunityGate> = {};
    COMMUNITIES.forEach((community) => {
      const myUnits = sumMyUnitsInCommunity(community, purchases);
      gates[community.slug] = {
        myUnits,
        canJoin: canJoinCommunity(myUnits),
        isMember: joinedCommunities.includes(community.slug),
      };
    });
    return gates;
  }, [purchases, joinedCommunities]);
};
