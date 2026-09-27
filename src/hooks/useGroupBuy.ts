import { useEffect, useMemo, useState } from 'react';
import type { Buyer, GroupBuyTier, Product, SpendTier } from '../types';
import { useCommunityStore } from '../store/communityStore';
import { useGroupBuyStore } from '../store/groupBuyStore';
import {
  describeTierBenefit,
  formatCountdown,
  getBasePrice,
  getEffectivePrice,
  getNextSpendTier,
  getNextTier,
  getProgressPct,
  getSpendProgressPct,
  getSpendTier,
  getUnlockedExtras,
  projectedPrice,
  resolveGroupBuy,
  sumMyUnitsInCommunity,
} from '../lib/groupBuy';
import { buildBuyerFeed } from '../data/groupBuys';

export interface GroupBuyView {
  communityName: string;
  communityColor: string;
  communitySlug: string;
  communityMemberDiscountPct: number;
  units: number;
  seedUnits: number;
  progressPct: number;
  tiers: GroupBuyTier[];
  extraPct: number;
  freeShipping: boolean;
  badge?: string;
  nextTarget?: number;
  nextTier?: GroupBuyTier;
  nextBenefit?: string;
  unitsToNext: number;
  people: number;
  basePrice: number;
  effectivePrice: number;
  /** Price once the next step unlocks, for this same visitor. */
  nextPrice: number | null;
  /** What this visitor pays if they join the community today. */
  joinPrice: number;
  joinSaves: number;
  youSaved: number;
  isMember: boolean;
  isYouIn: boolean;
  /** Units you have bought across this whole community, not just this product. */
  myCommunityUnits: number;
  spendTier?: SpendTier;
  nextSpendTier?: SpendTier;
  spendUnitsToNext: number;
  spendPct: number;
  feed: Buyer[];
  closesAt: number;
}

/**
 * Derives the whole group-buy view for a product. Only stable store slices are
 * selected so this never hands React a freshly built object every render.
 */
export const useGroupBuy = (product: Product): GroupBuyView | null => {
  const record = useGroupBuyStore((state) => state.purchases[product.id]);
  const purchases = useGroupBuyStore((state) => state.purchases);
  const anchorAt = useGroupBuyStore((state) => state.anchorAt);
  const joinedCommunities = useCommunityStore((state) => state.joinedCommunities);

  const resolved = useMemo(() => resolveGroupBuy(product), [product]);
  const community = resolved?.community ?? null;
  const groupBuy = resolved?.groupBuy;

  const isMember = community ? joinedCommunities.includes(community.slug) : false;

  return useMemo(() => {
    if (!community || !groupBuy) return null;

    const { tiers, seedUnits, windowHours } = groupBuy;
    const myUnits = record?.units ?? 0;
    const units = seedUnits + myUnits;
    const extras = getUnlockedExtras(tiers, units);
    const next = getNextTier(tiers, units);
    const basePrice = getBasePrice(product, community, isMember);
    const effectivePrice = getEffectivePrice(product, community, isMember, extras.extraPct);
    const joinPrice = getEffectivePrice(product, community, true, extras.extraPct);
    const myCommunityUnits = sumMyUnitsInCommunity(community, purchases);
    const nextSpend = getNextSpendTier(myCommunityUnits);

    const feed: Buyer[] = [
      ...(record?.entries ?? []),
      ...buildBuyerFeed(product, community.slug, anchorAt),
    ].sort((a, b) => b.boughtAt - a.boughtAt);

    return {
      communityName: community.name,
      communityColor: community.color,
      communitySlug: community.slug,
      communityMemberDiscountPct: community.memberDiscountPct,
      units,
      seedUnits,
      progressPct: getProgressPct(tiers, units),
      tiers,
      extraPct: extras.extraPct,
      freeShipping: extras.freeShipping,
      badge: extras.badge,
      nextTarget: next?.units,
      nextTier: next,
      nextBenefit: next ? describeTierBenefit(next) : undefined,
      unitsToNext: Math.max(0, (next?.units ?? 0) - units),
      people: feed.length,
      basePrice,
      effectivePrice,
      nextPrice: next
        ? projectedPrice(product, community, isMember, tiers, next.units)
        : null,
      joinPrice,
      joinSaves: Math.max(0, effectivePrice - joinPrice),
      youSaved: Math.max(0, product.price - effectivePrice),
      isMember,
      isYouIn: myUnits > 0,
      myCommunityUnits,
      spendTier: getSpendTier(myCommunityUnits),
      nextSpendTier: nextSpend,
      spendUnitsToNext: Math.max(0, (nextSpend?.units ?? 0) - myCommunityUnits),
      spendPct: getSpendProgressPct(myCommunityUnits),
      feed,
      closesAt: anchorAt + windowHours * 3_600_000,
    };
  }, [community, groupBuy, product, record, purchases, anchorAt, isMember]);
};

/** Ticking countdown for the drop window. Kept out of card grids on purpose. */
export const useGroupBuyCountdown = (closesAt: number): string => {
  const [label, setLabel] = useState(() => formatCountdown(closesAt - Date.now()));

  useEffect(() => {
    const update = () => setLabel(formatCountdown(closesAt - Date.now()));
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, [closesAt]);

  return label;
};
