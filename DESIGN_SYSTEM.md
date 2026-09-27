# Whole Mart — Design System & Spatial Visual Theme

## 1. Design Philosophy: The Floating Elevation Principle

> **“The interface should feel like it has no weight, but every interaction should feel intentional.”**

Whole Mart is built on a signature **Floating Spatial** visual theme. Products and UI elements appear to hover in physical space with subtle depth layers, soft luminous atmospheric glows, and tactile spring-based physics. The experience remains elegant, minimal, and modern—avoiding garish gaming aesthetics in favor of a senior UI/UX digital flagship feel.

---

## 2. Color System & Design Tokens

The color system is defined via CSS custom variables and Tailwind CSS tokens, supporting seamless light and dark modes with system preference detection and LocalStorage persistence.

### Dark Mode (Primary Default)
* **Background Canvas**: `#07090e` (Deep midnight void)
* **Elevated Canvas**: `#0b0f19` (Layered depth surface)
* **Card Surface**: `#0f1422` (Floating midnight obsidian)
* **Elevated Surface**: `#161c2e` (Secondary spatial elevation)
* **Glass Surface**: `rgba(15, 20, 34, 0.75)` with `backdrop-filter: blur(16px)`
* **Borders**: `rgba(255, 255, 255, 0.08)`
* **Specular Glow Borders**: `rgba(99, 102, 241, 0.35)`
* **Primary Text**: `#f8fafc` (Pure crisp white)
* **Secondary Text**: `#94a3b8` (Cool atmospheric slate)
* **Muted Text**: `#64748b` (Subtle low-contrast slate)

### Light Mode
* **Background Canvas**: `#f8fafc` (Crisp aerodynamic mist)
* **Elevated Canvas**: `#f1f5f9` (Soft frosted surface)
* **Card Surface**: `#ffffff` (Floating pristine white)
* **Glass Surface**: `rgba(255, 255, 255, 0.82)` with `backdrop-filter: blur(16px)`
* **Borders**: `rgba(15, 23, 42, 0.08)`
* **Primary Text**: `#0f172a` (Deep slate obsidian)
* **Secondary Text**: `#475569` (Mid-tone neutral)
* **Muted Text**: `#94a3b8` (Muted caption)

### Accent & Atmospheric Spectrum
* **Indigo Primary**: `#6366f1` (Core brand energy)
* **Violet Secondary**: `#8b5cf6` (Dimensional depth)
* **Cyan Highlight**: `#06b6d4` (Luminous spatial orbital accent)
* **Emerald Success**: `#10b981` (Discounts, order confirmation)
* **Rose Attention**: `#f43f5e` (Savings badge, wishlist active)

---

## 3. Typography Scale

* **Display Family**: `Outfit`, sans-serif (High visual impact for headlines and prices)
* **Body Family**: `Inter`, `Plus Jakarta Sans`, system-ui (Maximum legibility and crisp geometry)

| Token | Size | Weight | Line Height | Tracking | Usage |
|---|---|---|---|---|---|
| **Display** | 3rem – 3.75rem | 800 (Extrabold) | 1.1 | -0.025em | Hero headlines |
| **H1** | 2rem – 2.5rem | 800 (Extrabold) | 1.2 | -0.02em | Section titles, Product name |
| **H2** | 1.5rem – 1.875rem | 700 (Bold) | 1.25 | -0.015em | Category headings, Card titles |
| **H3** | 1.125rem – 1.25rem | 600 (Semibold) | 1.35 | -0.01em | Subsections, Drawer titles |
| **Body Large**| 1rem | 400 – 500 | 1.5 | normal | Feature descriptions |
| **Body** | 0.875rem (14px) | 400 – 500 | 1.5 | normal | Standard copy, specifications |
| **Small** | 0.75rem (12px) | 500 – 600 | 1.4 | +0.01em | Badges, card subtitles |
| **Caption** | 0.6875rem (11px)| 500 – 600 | 1.3 | +0.02em | Metadata, timestamps, tags |

---

## 4. Spacing System (8px Baseline)

All layout intervals follow an intentional 4px/8px modular rhythm:
* `p-2` / `gap-2`: 8px (Tight controls, inline tags)
* `p-3` / `gap-3`: 12px (Form elements, compact items)
* `p-4` / `gap-4`: 16px (Standard card padding, grid gutters)
* `p-6` / `gap-6`: 24px (Large cards, section spacers)
* `p-8` / `gap-8`: 32px (Desktop container insets)
* `py-16` / `py-24`: 64px – 96px (Major homepage sections)

---

## 5. Elevation & Spatial Shadows

* **Shadow Float (`shadow-float`)**: `0 20px 35px -10px rgba(0, 0, 0, 0.35)`
* **Shadow Float Large (`shadow-float-lg`)**: `0 30px 60px -15px rgba(0, 0, 0, 0.5), 0 15px 25px -10px rgba(99, 102, 241, 0.15)`
* **Shadow Glow (`shadow-glow`)**: `0 0 25px -5px rgba(99, 102, 241, 0.3)`
* **Cyan Glow (`shadow-glow-cyan`)**: `0 0 30px -5px rgba(6, 182, 212, 0.3)`

---

## 6. Dynamic Motion System

Animations are orchestrated through `framer-motion` using customized spring constants:

```typescript
// Tactile spring for buttons and toggles
export const springGentle = { type: 'spring', stiffness: 260, damping: 24 };

// Snappy feedback for cards and modal dialogues
export const springSnappy = { type: 'spring', stiffness: 400, damping: 30 };

// Floating bobbing physics
export const floatMotion = { duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' };
```

### Core Primitives
1. `FloatingElement`: Weightless sinusoidal levitation along the Y-axis.
2. `ParallaxContainer`: 3D perspective wrapper calculating real-time cursor offsets.
3. `MagneticButton`: Smooth cursor attraction utilizing spring physics on hover.
4. `FloatingCard`: 3D tilt response with dynamic specular cursor spotlight.
5. `ProductOrbit`: Cosmic rotating planetary rings with pulsing orbital satellites.
6. `RevealOnScroll`: Intersection-observer scroll reveal with zero layout shift.

---

## 6.1 The Ladder — Collective Group Buy Language

The group buy is the one place in the interface where the rail *is* the information. Each product belongs to a community, and every purchase advances a five-step discount ladder for everybody. The rail encodes the threshold being crossed, so it carries the data rather than decorating the panel.

**Node states**
* **Unlocked** — solid node in the community colour with a soft outer glow, a filled rail segment below it, emerald *Unlocked* label, and the rupee amount saved at that step.
* **Next** — hollow node with a 2px community-coloured ring and a pulsing core, labelled with the exact units still needed. This is the row the shopper is meant to act on.
* **Locked** — hollow node on `surface-border` with a dashed rail segment. Never alarming: neutral, not red.

**Colour rules**
* Community colour drives the rail, progress bar, and the unlocked price. Nothing else competes with it inside the panel.
* `#10b981` emerald is reserved for *unlocked*, *free express delivery*, and savings.
* `#f43f5e` rose appears only once the *Community Favourite* badge is actually earned.
* `#25d366` WhatsApp green is reserved exclusively for WhatsApp affordances, so a green surface always means "this opens a chat".

**Type**: the two numbers that carry the panel — units claimed and percentage — use `font-display` (Outfit) at `800–900` with `tabular-nums` so the figure does not jitter as it counts. Ladder rows are body-size, with the state label in `text-[11px]`.

**Motion**: continuous animation is limited to the *next* node's pulse, because that is the only element the shopper is being asked to move. Steps do not animate on entry; the ladder is a static statement of position.

**Restraint**: the buyer feed and the avatar cluster reuse the same rail metaphor at a smaller scale, so the two read as one system. Neither introduces a new colour, radius, or shadow.

---

## 7. Accessibility & Reduced Motion Compliance

* **WCAG 2.1 AA** color contrast maintained across all typography tokens.
* Full keyboard navigation supported (`Tab`, `Shift+Tab`, `Escape`, `Cmd+K` / `Ctrl+K`).
* **`prefers-reduced-motion`**: Whenever enabled in OS settings, all continuous floating, 3D tilts, orbital rotations, and transform animations are gracefully eliminated or converted into subtle fades.
