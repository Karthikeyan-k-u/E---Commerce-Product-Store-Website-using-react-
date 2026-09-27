export type ProductCategory =
  | 'Electronics'
  | 'Fashion'
  | 'Home'
  | 'Accessories'
  | 'Lifestyle'
  | 'Wearables';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductColor[];
  sizes?: string[];
  stock: number;
  tags: string[];
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  specifications: Record<string, string>;
  highlights: string[];
  threeSixtyFrames?: string[];
}

export interface CartItem {
  id: string; // Unique cart item ID (combines product id, selected color, selected size)
  productId: string;
  name: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  image: string;
  selectedColor?: ProductColor;
  selectedSize?: string;
  quantity: number;
  freeShipping?: boolean; // Granted by a fully unlocked community group-buy tier
}

export type GroupBuyTierState = 'unlocked' | 'next' | 'locked';

export interface GroupBuyTier {
  units: number; // Cumulative units that must be claimed to unlock this step
  extraPct: number; // Extra discount unlocked, applied on top of member pricing
  freeShipping?: boolean;
  badge?: string; // Only the final step carries a badge unlock
}

export interface GroupBuy {
  productId: string;
  communitySlug: string;
  seedUnits: number; // Units claimed by the seeded community buyers, summed from the buyer feed
  tiers: GroupBuyTier[];
  windowHours: number; // How long this drop stays open from your first visit
}

/**
 * Personal loyalty ladder inside one community, driven by the units the
 * visitor has bought there. Kept separate from GroupBuyTier on purpose: the
 * group ladder is shared and social, this one is yours and grows as you buy.
 */
export interface SpendTier {
  id: string;
  name: string;
  units: number; // Cumulative units you must buy in this community to reach it
  perk: string;
}

export interface Buyer {
  id: string;
  name: string;
  communitySlug: string;
  units: number;
  boughtAt: number; // epoch ms
  variant?: string;
  isYou?: boolean;
}

export type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'cod';

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderTimelineStep {
  status: OrderStatus;
  date: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: CartItem[];
  customer: CustomerInfo;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  estimatedDelivery: string;
  timeline: OrderTimelineStep[];
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  color: string;
  memberCount: number;
  perks: string[];
  promoCode: string;
  memberDiscountPct: number;
  dropProductIds: string[];
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest';

export interface FilterState {
  category?: ProductCategory | 'All';
  priceRange: [number, number];
  minRating: number;
  brands: string[];
  inStockOnly: boolean;
  selectedColors: string[];
  searchQuery?: string;
}
