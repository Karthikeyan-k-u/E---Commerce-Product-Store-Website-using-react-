import { Community } from '../types';

export const COMMUNITIES: Community[] = [
  {
    id: 'com-aura',
    slug: 'aura-circle',
    name: 'Aura Circle',
    tagline: 'Signal-first audio & display collective',
    description:
      'Early access to precision electronics before public release. Members watch flagship headphones, spatial monitors, and sound systems land 48 hours ahead of the shop floor.',
    category: 'Electronics',
    color: '#6366f1',
    memberCount: 12840,
    perks: [
      '48-hour early access to electronics drops',
      'Round-the-block member pricing',
      'Launch-day priority stock reservation',
      'Private hardware teardown briefings',
    ],
    promoCode: 'AURACIRCLE10',
    memberDiscountPct: 10,
    dropProductIds: ['prod-1', 'prod-2', 'prod-3', 'prod-4'],
  },
  {
    id: 'com-orbit',
    slug: 'orbit-prime',
    name: 'Orbit Prime',
    tagline: 'Wearables guild for the always-mobile',
    description:
      'A guild built for wrist-and-body tech. Orbit Prime members secure smartwatches, fitness rings, and earbuds the moment they calibrate out of the lab.',
    category: 'Wearables',
    color: '#06b6d4',
    memberCount: 9630,
    perks: [
      'First firmware beta access on wearables',
      'Exclusive band & finish colorways',
      'Early drop notifications 24 hours prior',
      'Priority repair & exchange lane',
    ],
    promoCode: 'ORBITPRIME10',
    memberDiscountPct: 10,
    dropProductIds: ['prod-5', 'prod-6', 'prod-7', 'prod-8'],
  },
  {
    id: 'com-velocity',
    slug: 'velocity-guild',
    name: 'Velocity Guild',
    tagline: 'Aerospace-inspired fashion inner circle',
    description:
      'Technical apparel and footwear for people moving faster than the street. Velocity Guild members catch capsule collections before they hit the runway.',
    category: 'Fashion',
    color: '#f43f5e',
    memberCount: 7520,
    perks: [
      'Capsule collection pre-releases',
      'Members-only aerospace fabric lines',
      'Complimentary sizing adjustments',
      'First claim on limited color drops',
    ],
    promoCode: 'VELOCITY10',
    memberDiscountPct: 10,
    dropProductIds: ['prod-9', 'prod-10', 'prod-11', 'prod-12'],
  },
  {
    id: 'com-terra',
    slug: 'terra-atelier',
    name: 'Terra Atelier',
    tagline: 'Spatial home & living studio',
    description:
      'Levitation lamps, smart diffusers, and ergonomic fixtures for modern rooms. Terra members preview home-tech launches and reserve sculptural limited editions.',
    category: 'Home',
    color: '#10b981',
    memberCount: 5310,
    perks: [
      'Early release of smart home fixtures',
      'Limited-edition material finishes',
      'Interior stylist virtual consultations',
      'Bundled fixture installation guides',
    ],
    promoCode: 'TERRAATEL10',
    memberDiscountPct: 10,
    dropProductIds: ['prod-13', 'prod-14', 'prod-15', 'prod-16'],
  },
  {
    id: 'com-nova',
    slug: 'nova-nook',
    name: 'Nova Nook',
    tagline: 'Accessories lab for everyday carry',
    description:
      'Floating desk mounts, GaN chargers, and daily-carry essentials. Nova members grab new accessories first and unlock member-only multi-buy packs.',
    category: 'Accessories',
    color: '#8b5cf6',
    memberCount: 4120,
    perks: [
      '24-hour head start on accessory drops',
      'Member-only multi-buy bundles',
      'Early access to prototyping runs',
      'EDC loadout consultations',
    ],
    promoCode: 'NOVANOOK5',
    memberDiscountPct: 5,
    dropProductIds: ['prod-17', 'prod-18', 'prod-19', 'prod-20'],
  },
  {
    id: 'com-zen',
    slug: 'zen-studio',
    name: 'Zen Studio',
    tagline: 'Tactile focus & wellness circle',
    description:
      'Timers, purifiers, and desktop wellness for deep-work rituals. Zen Studio members get first pick of productivity instruments and calm-space launches.',
    category: 'Lifestyle',
    color: '#f59e0b',
    memberCount: 3890,
    perks: [
      'Pre-sale access to focus instruments',
      'Desk ritual setup guides',
      'Members-only wellness kits',
      'Priority support during drops',
    ],
    promoCode: 'ZENSTUDIO5',
    memberDiscountPct: 5,
    dropProductIds: ['prod-21', 'prod-22', 'prod-23', 'prod-24'],
  },
];

export const getCommunityBySlug = (slug: string): Community | undefined =>
  COMMUNITIES.find((c) => c.slug === slug);

export const getCommunityForProduct = (productId: string): Community | undefined =>
  COMMUNITIES.find((c) => c.dropProductIds.includes(productId));

export const getMemberPrice = (community: Community, price: number): number =>
  Math.round(price * (1 - community.memberDiscountPct / 100));