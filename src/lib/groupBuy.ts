import type {
  Community,
  GroupBuy,
  GroupBuyTier,
  Product,
  SpendTier,
} from '../types';
import { getCommunityForProduct, getMemberPrice } from '../data/communities';
import { getGroupBuy, SPEND_TIERS } from '../data/groupBuys';
import type { PurchaseRecord } from '../store/groupBuyStore';

export interface ResolvedGroupBuy {
  community: Community;
  groupBuy: GroupBuy;
}

export const resolveGroupBuy = (product: Product): ResolvedGroupBuy | null => {
  const community = getCommunityForProduct(product.id);
  if (!community) return null;
  return { community, groupBuy: getGroupBuy(product, community.slug) };
};

export const getUnlockedTier = (
  tiers: GroupBuyTier[],
  units: number
): GroupBuyTier | undefined => {
  let unlocked: GroupBuyTier | undefined;
  tiers.forEach((tier) => {
    if (units >= tier.units) unlocked = tier;
  });
  return unlocked;
};

export const getNextTier = (tiers: GroupBuyTier[], units: number): GroupBuyTier | undefined =>
  tiers.find((tier) => tier.units > units);

export const getProgressPct = (tiers: GroupBuyTier[], units: number): number => {
  const target = tiers[tiers.length - 1]?.units ?? 0;
  if (target <= 0) return 100;
  return Math.min(100, Math.round((units / target) * 100));
};

export const getUnlockedExtras = (tiers: GroupBuyTier[], units: number) => {
  const unlocked = getUnlockedTier(tiers, units);
  return {
    extraPct: unlocked?.extraPct ?? 0,
    freeShipping: Boolean(unlocked?.freeShipping),
    badge: unlocked?.badge,
  };
};

/** Community member price, or the public price when the visitor has not joined. */
export const getBasePrice = (
  product: Product,
  community: Community | null,
  isMember: boolean
): number => {
  if (!community || !isMember) return product.price;
  return getMemberPrice(community, product.price);
};

/** The group-buy unlock is a community reward, so it lands on top of member pricing. */
export const getEffectivePrice = (
  product: Product,
  community: Community | null,
  isMember: boolean,
  extraPct: number
): number => {
  const base = getBasePrice(product, community, isMember);
  if (extraPct <= 0) return base;
  return Math.round(base * (1 - extraPct / 100));
};

/** What this visitor would pay if the ladder reached `targetUnits`. */
export const projectedPrice = (
  product: Product,
  community: Community | null,
  isMember: boolean,
  tiers: GroupBuyTier[],
  targetUnits: number
): number => getEffectivePrice(product, community, isMember, getUnlockedExtras(tiers, targetUnits).extraPct);

/** Plain-English name for what a step grants, used in the "what happens next" line. */
export const describeTierBenefit = (tier: GroupBuyTier): string => {
  const parts = [`${tier.extraPct}% more off`];
  if (tier.freeShipping) parts.push('free express delivery');
  if (tier.badge) parts.push(`the ${tier.badge} badge`);
  return parts.join(' + ');
};

export const unitLabel = (units: number): string => `${units} ${units === 1 ? 'unit' : 'units'}`;

export const peopleLabel = (people: number): string => `${people} ${people === 1 ? 'person' : 'people'}`;

/**
 * Units the visitor has bought across a whole community, not just this product.
 * Sums `PurchaseRecord.units` rather than counting `entries`, because entries are
 * capped for display while units keep accumulating.
 */
export const sumMyUnitsInCommunity = (
  community: Community,
  purchases: Record<string, PurchaseRecord>
): number =>
  community.dropProductIds.reduce(
    (sum, productId) => sum + (purchases[productId]?.units ?? 0),
    0
  );

export const getSpendTier = (units: number): SpendTier | undefined => {
  let reached: SpendTier | undefined;
  SPEND_TIERS.forEach((tier) => {
    if (units >= tier.units) reached = tier;
  });
  return reached;
};

export const getNextSpendTier = (units: number): SpendTier | undefined =>
  SPEND_TIERS.find((tier) => tier.units > units);

export const getSpendProgressPct = (units: number): number => {
  const target = SPEND_TIERS[SPEND_TIERS.length - 1]?.units ?? 0;
  if (target <= 0) return 100;
  return Math.min(100, Math.round((units / target) * 100));
};

export const formatCountdown = (msRemaining: number): string => {
  if (msRemaining <= 0) return 'Closed';
  const totalMinutes = Math.floor(msRemaining / 60_000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m left`;
  return `${minutes}m left`;
};

export const timeAgo = (from: number, now: number): string => {
  const minutes = Math.max(0, Math.round((now - from) / 60_000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

export const initialsOf = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const AVATAR_COLORS = [
  '#6366f1',
  '#06b6d4',
  '#f43f5e',
  '#10b981',
  '#8b5cf6',
  '#f59e0b',
  '#0ea5e9',
  '#ec4899',
];

export const avatarColorFrom = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};
