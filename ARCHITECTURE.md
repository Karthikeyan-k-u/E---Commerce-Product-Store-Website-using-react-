# Whole Mart — Technical Architecture Documentation

## 1. System Overview

**Whole Mart** is a modern, high-performance e-commerce web application engineered for college project demonstration and static cloud delivery. The application adheres to a clean decoupled architecture combining React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, and Zustand with zero external backend dependencies.

---

## 2. Directory & Component Architecture

```text
src/
├── components/
│   ├── motion/                 # Reusable motion primitives
│   │   ├── FloatingElement.tsx     # Sinusoidal hover bobbing
│   │   ├── ParallaxContainer.tsx   # 3D mouse perspective tracking
│   │   ├── MagneticButton.tsx      # Cursor attraction physics
│   │   ├── FloatingCard.tsx        # 3D tilted card with cursor spotlight
│   │   ├── DepthLayer.tsx          # Multi-plane Z-axis layering
│   │   ├── AnimatedNumber.tsx      # Smooth numeric transitions
│   │   ├── ProductOrbit.tsx        # Cosmic planetary orbital particles
│   │   └── RevealOnScroll.tsx      # Viewport intersection reveals
│   ├── ui/                     # Accessible UI foundation
│   │   ├── Button.tsx              # Polymorphic button with loading states
│   │   ├── Badge.tsx               # Status & discount tags
│   │   ├── Input.tsx               # Floating/standard input fields
│   │   ├── Modal.tsx               # Accessible dialog with blur backdrop
│   │   ├── Drawer.tsx              # Right-hand & bottom-sheet drawers
│   │   ├── Skeleton.tsx            # Shimmer skeleton loader
│   │   ├── Breadcrumb.tsx          # Accessible navigational hierarchy
│   │   ├── EmptyState.tsx          # Floating graphic empty states
│   │   └── Toast.tsx               # Lightweight global notification stack
│   ├── layout/                 # Shell & Chrome
│   │   ├── AnnouncementBar.tsx     # Floating promotional offer banner
│   │   ├── Header.tsx              # Glassmorphic sticky navbar with search
│   │   ├── Footer.tsx              # Links, trust metrics, academic notes
│   │   ├── MobileNav.tsx           # Fixed bottom navigation for mobile
│   │   └── Layout.tsx              # Master layout container with ambient glows
│   ├── product/                # Discovery & Product View
│   │   ├── ProductCard.tsx         # Floating card with quick actions
│   │   ├── ProductGrid.tsx         # Responsive grid with skeletons
│   │   ├── ProductFilters.tsx      # Sticky sidebar & bottom sheet
│   │   ├── ProductGallery.tsx      # Image carousel & zoom lens
│   │   ├── Product360Viewer.tsx    # Interactive mouse/touch 360° spin
│   │   ├── ProductStickyBar.tsx    # Floating purchase bar
│   │   ├── ProductReviews.tsx      # Review breakdown & submission
│   │   └── RelatedProducts.tsx     # "You May Also Like" carousel
│   ├── groupbuy/              # Community Collective Buying
│   │   ├── GroupBuyPanel.tsx        # Ladder panel above the purchase actions
│   │   ├── GroupBuyLadder.tsx       # Discount rail with threshold nodes
│   │   ├── BuyerFeed.tsx            # "Who bought this" recency timeline
│   │   ├── BuyerAvatarCluster.tsx   # Over-image avatar stack on product cards
│   │   └── BuyerAvatar.tsx          # Initials avatar (no photo assets exist)
│   ├── cart/                   # Cart Management
│   │   ├── CartDrawer.tsx          # Slide-out drawer
│   │   ├── CartItemRow.tsx         # Quantity controls & variants
│   │   └── FreeShippingMeter.tsx   # Visual progress towards ₹999
│   ├── checkout/               # 4-Step Checkout Wizard
│   │   ├── CheckoutStepper.tsx     # Animated progress step indicators
│   │   ├── CustomerStep.tsx        # Step 1: Customer details & validation
│   │   ├── ShippingStep.tsx        # Step 2: Indian postal address
│   │   ├── PaymentStep.tsx         # Step 3: Mock UPI & Card gateway
│   │   └── ReviewStep.tsx          # Step 4: Final verification & authorization
│   └── search/
│       └── SearchOverlay.tsx       # Cmd+K predictive instant search
├── data/
│   ├── products.ts             # 24+ rich products in 6 categories (INR ₹)
│   ├── communities.ts          # 6 community circles and their member pricing
│   └── groupBuys.ts            # Per-community discount ladders & seeded buyer feeds
├── store/                      # Zustand state slices
│   ├── cartStore.ts            # Cart items, discounts, shipping calculations
│   ├── wishlistStore.ts        # Wishlist persistence & move-to-cart
│   ├── themeStore.ts           # Dark/Light mode with HTML class sync
│   ├── orderStore.ts           # Order history & timeline tracking
│   ├── recentStore.ts          # Recently viewed product slugs
│   ├── communityStore.ts       # Joined community membership
│   ├── groupBuyStore.ts        # Your claimed units & buyer feed entries
│   └── searchStore.ts          # Search overlay state & query history
├── hooks/
│   ├── useSocialOrder.ts       # Cart-order & product-enquiry links
│   ├── useGroupBuy.ts          # Derives ladder state, price & buyer feed
│   ├── useUnlockedCommunities.ts  # Communities bought from but not yet joined
│   └── useFriendsInCommunity.ts   # Contacts of yours in a community (0-5)
├── types/
│   └── index.ts                # Strict TypeScript interfaces
├── lib/
│   ├── animations.ts           # Centralized Framer Motion presets
│   ├── social.ts               # Cart-order & product-enquiry message builders
│   ├── groupBuy.ts             # Tier resolution, effective price, formatting
│   ├── hash.ts                 # FNV-1a + murmur seed, shared by all generators
│   └── utils.ts                # Currency format (₹), slugify, cn
└── pages/                      # Page routes
    ├── HomePage.tsx            # Hero, categories, trending, spotlight
    ├── ShopPage.tsx            # Catalog with filters, sorting, search
    ├── CategoryPage.tsx        # Category specific catalog
    ├── ProductDetailPage.tsx   # 360 view, zoom lens, sticky purchase
    ├── CartPage.tsx            # Full cart management
    ├── WishlistPage.tsx        # Saved items gallery
    ├── CheckoutPage.tsx        # 4-step wizard
    ├── OrderSuccessPage.tsx    # Confetti celebration & order tracking link
    ├── AccountPage.tsx         # Profile, addresses, project info
    ├── OrderHistoryPage.tsx    # Past orders with status filters
    ├── OrderDetailPage.tsx     # 5-stage tracking timeline
    └── NotFoundPage.tsx        # 404 floating astronaut empty state
```

---

## 3. State Management & LocalStorage Persistence

Zustand stores maintain reactive application state across navigation events with instant LocalStorage synchronization:

| Store | Storage Key | Description |
|---|---|---|
| `cartStore` | `wholemart_cart_v1` | Items, selected color/size variants, quantity, coupons (`WLMART10`, `WLMART100`, `STUDENT`), free shipping threshold (₹999). |
| `wishlistStore` | `wholemart_wishlist_v1` | Saved products list, toggle action, batch move to cart. |
| `themeStore` | `wholemart_theme_v1` | Active theme (`dark` / `light`), synchronizing `dark` class on `document.documentElement`. |
| `orderStore` | `wholemart_orders_v1` | Pre-seeded demo orders and checkout submissions with live order timeline statuses. |
| `recentStore` | `wholemart_recent_v1` | Deduplicated list of up to 8 recently viewed product slugs. |
| `searchStore` | `wholemart_search_history_v1` | Recent search queries, predictive search state, `Cmd+K` keyboard shortcut listener. |
| `groupBuyStore` | `wholemart_groupbuy_v1` | Units you have claimed per product, your own buyer feed entries, and the drop window anchor so countdowns stay stable across reloads. |

---

## 3.1 Community Group Buy

Every product belongs to exactly one community, so every product runs a **group buy**: a discount ladder that any purchase advances for everybody.

* **Ladder** — each community has its own five-step ladder in `data/groupBuys.ts`. Steps unlock cumulatively by units claimed: deeper discount, then free express delivery on the penultimate step, then a *Community Favourite* badge. Thresholds sit between 2 and 15 units so a handful of real buyers can actually move the ladder.
* **Honest counts** — `buildSeedPlan()` is the single deterministic source for buyer count (1-7 people, 1-3 units each). The headline claim is the *sum of those buyers*, never a separately hashed number, so "13 units claimed" always equals the people listed under it. `getGroupBuy()` takes the product and sets `seedUnits` from that plan.
* **Pricing** — `getEffectivePrice()` applies the unlocked step on top of community member pricing. A non-member still benefits, because the unlock is a community reward rather than a membership perk. The resolved price is written onto the cart item, so cart totals and checkout always agree.
* **Personal framing** — the panel speaks to the visitor: your current price, what you save, the price everyone pays once the next step unlocks (`projectedPrice()`), and what joining the community would drop it to (`joinPrice` / `joinSaves`). A fully unlocked ladder says so instead of projecting.
* **Membership benefits** — all four `community.perks`, the member count, the member discount and the promo code live in the panel's membership block behind a disclosure, so the shopper sees what belonging gets them without a second competing call to action.
* **Buying is what earns the join** — the panel shows its join CTA to every non-member, including people who already bought this product, and the copy changes to say so: *"You bought this, so Aura Circle is open to you now."* `UnlockedCommunityPrompt` then appears after checkout listing each community you have bought from but not joined, with the units that unlocked it. `useUnlockedCommunities` filters out anything already joined or dismissed, and `communityStore` persists `dismissedUnlocks` alongside memberships. The v1 storage key held a bare array, so the loader still parses that shape.
* **Personal spend tiers** — `SPEND_TIERS` is a separate three-rung ladder (Bronze 1 / Silver 3 / Gold 6) counted in the units *you* have bought in that community, not the crowd's. `sumMyUnitsInCommunity()` sums `PurchaseRecord.units` over the community's `dropProductIds`; it deliberately does not count `entries`, which are capped for display while units keep accumulating. Every perk is non-monetary, because the group ladder already owns the discount maths and a second percentage would stack with member pricing into a silly final number. `SpendTierMeter` renders as one row plus three dots inside the sticky panel.
* **Social proof** — `buildBuyerFeed()` generates a deterministic, realistic buyer list per product id (name, community, units, variant, time). Product ids are sequential, so the hash uses FNV-1a with a murmur finalizer, shared via `lib/hash.ts`, to keep neighbouring products from landing on neighbouring values. Counts vary from 1 to 7 people, and the card cluster, the feed header and the 1-buyer case each have their own copy. The card avatar stack stays tappable and opens a WhatsApp enquiry naming the buyer; the detail-page feed is a read-only timeline.
* **Your own contacts** — `buildFriendsInCommunity()` returns 0-5 contacts per community from the same hash. `FriendsInCommunity` renders it on the product detail page only and returns `null` at zero, because "0 contacts" is a real answer and a row of empty space is worse than saying nothing. It lives in its own hook specifically so it cannot be pulled into a product card by accident: cards answer who else is buying, this answers who in your own life already made the move.
* **Counting purchases** — units are claimed on a placed checkout order, never on *add to cart*. Browsing does not move the ladder.
* **Free shipping** — a fully unlocked `freeShipping` step sets `CartItem.freeShipping`, which waives delivery on the whole basket.

---

## 4. Routing Architecture

Routing is managed with `react-router-dom` using HTML5 History API:

* `/`: Homepage with Interactive Hero, Categories, Trending, Spotlight
* `/shop`: Catalog with multi-faceted filtering, price slider, and sorting
* `/category/:slug`: Filtered category view with custom banner
* `/product/:slug`: Product detail page with 360° spin viewer, hover zoom lens, specifications, reviews
* `/cart`: Full shopping cart review
* `/wishlist`: Saved products grid
* `/checkout`: 4-Step checkout wizard
* `/order/success`: Order confirmed celebration with confetti
* `/account`: User profile, saved addresses, project info
* `/account/orders`: Order history with status filters
* `/account/orders/:id`: 5-Stage order tracking timeline
* `*`: 404 Gravity-defying error screen

---

## 5. Cloudflare Pages Deployment Strategy

* **Build Output Directory**: `dist/`
* **Build Command**: `npm run build`
* **SPA Routing Fallback**: `public/_redirects` contains `/* /index.html 200`. During Vite build, this file is automatically copied to `dist/_redirects`, instructing Cloudflare's edge CDN to rewrite all route paths to `index.html` with status 200, enabling clean client-side routing without server rendering.
