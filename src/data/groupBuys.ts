import type { Buyer, GroupBuy, GroupBuyTier, Product, SpendTier } from '../types';
import { hashCode } from '../lib/hash';

export const GROUP_BUY_WINDOW_HOURS = 72;

/**
 * Your own ladder inside a community, counted in units you have actually bought
 * there. Thresholds are deliberately low so the first order already lands on
 * Bronze and the next two keep moving it. Every perk here is non-monetary on
 * purpose: the group ladder already owns the discount maths, and a second
 * percentage would stack with member pricing into a silly final number.
 */
export const SPEND_TIERS: SpendTier[] = [
  { id: 'bronze', name: 'Bronze', units: 1, perk: 'Early access to this community’s drops' },
  { id: 'silver', name: 'Silver', units: 3, perk: 'Free express delivery on this community’s products' },
  { id: 'gold', name: 'Gold', units: 6, perk: 'Insider label and first pick of new drops' },
];

interface CommunityLadder {
  tiers: GroupBuyTier[];
}

const COMMUNITY_LADDERS: Record<string, CommunityLadder> = {
  'aura-circle': {
    tiers: [
      { units: 2, extraPct: 3 },
      { units: 5, extraPct: 6 },
      { units: 8, extraPct: 9 },
      { units: 11, extraPct: 12, freeShipping: true },
      { units: 14, extraPct: 15, badge: 'Community Favourite' },
    ],
  },
  'orbit-prime': {
    tiers: [
      { units: 2, extraPct: 4 },
      { units: 5, extraPct: 7 },
      { units: 8, extraPct: 10 },
      { units: 12, extraPct: 13, freeShipping: true },
      { units: 15, extraPct: 16, badge: 'Community Favourite' },
    ],
  },
  'velocity-guild': {
    tiers: [
      { units: 2, extraPct: 3 },
      { units: 6, extraPct: 7 },
      { units: 9, extraPct: 10 },
      { units: 12, extraPct: 13, freeShipping: true },
      { units: 15, extraPct: 16, badge: 'Community Favourite' },
    ],
  },
  'terra-atelier': {
    tiers: [
      { units: 3, extraPct: 4 },
      { units: 5, extraPct: 7 },
      { units: 8, extraPct: 11 },
      { units: 11, extraPct: 14, freeShipping: true },
      { units: 14, extraPct: 17, badge: 'Community Favourite' },
    ],
  },
  'nova-nook': {
    tiers: [
      { units: 3, extraPct: 3 },
      { units: 6, extraPct: 6 },
      { units: 9, extraPct: 9 },
      { units: 12, extraPct: 12, freeShipping: true },
      { units: 15, extraPct: 15, badge: 'Community Favourite' },
    ],
  },
  'zen-studio': {
    tiers: [
      { units: 2, extraPct: 3 },
      { units: 5, extraPct: 6 },
      { units: 8, extraPct: 10 },
      { units: 11, extraPct: 13, freeShipping: true },
      { units: 14, extraPct: 16, badge: 'Community Favourite' },
    ],
  },
};

const FALLBACK_LADDER: CommunityLadder = COMMUNITY_LADDERS['aura-circle'];

export const getCommunityLadder = (communitySlug: string): CommunityLadder =>
  COMMUNITY_LADDERS[communitySlug] ?? FALLBACK_LADDER;

export interface SeedPlan {
  count: number;
  unitsPerBuyer: number[];
  totalUnits: number;
}

/**
 * The one deterministic source for how many people already bought this drop and
 * how many units each took. Deliberately anchor-free, because the claimed total
 * has to be the sum of the buyers we are about to render. Hashing the total
 * separately is what let "97 units claimed" sit next to four people holding 7.
 */
export const buildSeedPlan = (product: Product): SeedPlan => {
  const seed = hashCode(product.id);
  const count = 1 + (seed % 7);
  const unitsPerBuyer = Array.from(
    { length: count },
    (_, index) => 1 + (hashCode(`${product.id}-u-${index}`) % 3)
  );

  return {
    count,
    unitsPerBuyer,
    totalUnits: unitsPerBuyer.reduce((sum, units) => sum + units, 0),
  };
};

export const getGroupBuy = (product: Product, communitySlug: string): GroupBuy => {
  const ladder = getCommunityLadder(communitySlug);
  return {
    productId: product.id,
    communitySlug,
    seedUnits: buildSeedPlan(product).totalUnits,
    tiers: ladder.tiers,
    windowHours: GROUP_BUY_WINDOW_HOURS,
  };
};

const BUYER_POOL = [
  'Aarav Sharma',
  'Priya Sundaram',
  'Rohan Mehta',
  'Ananya Deshmukh',
  'Karthik Raman',
  'Divya Nair',
  'Vikram Iyer',
  'Meera Krishnan',
  'Aditya Bose',
  'Sneha Kulkarni',
  'Rajesh Pillai',
  'Nisha Verma',
  'Sanjay Gupta',
  'Lakshmi Rao',
  'Imran Shaikh',
  'Kavya Menon',
  'Nikhil Chawla',
  'Pooja Reddy',
  'Arjun Malhotra',
  'Ishita Sen',
  'Farhan Qureshi',
  'Riya Chatterjee',
  'Harshvardhan Patil',
  'Trisha Balaji',
];

const pickVariant = (product: Product, index: number): string | undefined => {
  const color = product.colors[index % Math.max(product.colors.length, 1)];
  if (!color) return undefined;
  const size = product.sizes?.[index % Math.max(product.sizes.length, 1)];
  return size ? `${color.name} · ${size}` : color.name;
};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** Walking the pool by a stride coprime to its length guarantees no repeat names. */
const pickNames = (seed: number, count: number): string[] => {
  const size = BUYER_POOL.length;
  const start = seed % size;
  let stride = 1 + (seed % (size - 1));
  while (gcd(stride, size) !== 1) stride += 1;
  return Array.from({ length: count }, (_, index) => BUYER_POOL[(start + stride * index) % size]);
};

/**
 * Builds a stable, realistic feed of who bought this product from its community.
 * Deterministic per product id so the names and timings never shuffle between renders.
 * The count and unit split come from {@link buildSeedPlan}, so the headline claim
 * is always exactly the sum of the people listed here.
 */
export const buildBuyerFeed = (
  product: Product,
  communitySlug: string,
  anchorAt: number
): Buyer[] => {
  const seed = hashCode(product.id);
  const { count, unitsPerBuyer } = buildSeedPlan(product);
  const names = pickNames(seed, count);
  const feed: Buyer[] = [];
  let elapsedMinutes = 2 + (seed % 4);

  for (let index = 0; index < count; index += 1) {
    elapsedMinutes += 3 + (hashCode(`${product.id}-${index}`) % 47);
    feed.push({
      id: `${product.id}-seed-${index}`,
      name: names[index],
      communitySlug,
      units: unitsPerBuyer[index],
      boughtAt: anchorAt - elapsedMinutes * 60_000,
      variant: pickVariant(product, index),
    });
  }

  return feed;
};
