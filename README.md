# Whole Mart — Everything You Need. Effortlessly.

> A senior UI/UX caliber e-commerce web application featuring a futuristic spatial visual design theme, built for a semester-3 college demonstration project and ready for static deployment on **Cloudflare Pages**.

---

## 🚀 Live Demo & Presentation Features

* **Spatial Visual Language**: Floating product cards, depth layers, 3D mouse-reactive perspective tilt, specular border glow, and gentle orbital animations.
* **Responsive Multi-Viewport Layout**: Purpose-built responsiveness from mobile smartphones (320px – 414px) up to ultra-wide 4K desktop displays.
* **Interactive 360-Degree Product Spin**: Simulated mouse-drag and touch-swipe 360° product rotation with degree readout, inertia, and reset controls.
* **Optical Hover Zoom Lens**: High-definition zoom inspection on desktop and tap-to-expand lightbox modals on mobile.
* **Smart Search Overlay (`Cmd + K` / `Ctrl + K`)**: Predictive instant search as you type, recent searches history, and trending keyword chips.
* **Multi-Faceted Product Filtering**: Live category filtering, dynamic price range sliders, rating filters, brand checkboxes, and color swatches with removable chips.
* **Multi-Step Demo Checkout Wizard**:
  1. Recipient Information with validation
  2. Doorstep Shipping with realistic Indian addresses
  3. Demo Payment Gateway (Instant UPI / QR Code, Interactive Credit Card with live card preview, Net Banking, Cash on Delivery)
  4. Final Order Review & Verification
* **Floating Confetti Celebration & Live Order Tracking**: Animated celebratory order confirmation, generated Order ID (`WMT-2026-XXXX`), and 5-stage package tracking timeline.
* **Dual Color Modes**: Deep midnight space dark mode & clean aerodynamic light mode with system preference auto-detection and persistence.
* **Robust Frontend State**: Cart, Wishlist, Theme, Recently Viewed, and Order History synchronized with `localStorage`.

---

## 🛠️ Technology Stack

* **Core Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite 6](https://vitejs.dev/) (Sub-second HMR, optimized production rollup)
* **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with custom spatial design tokens
* **Motion & Physics**: [Framer Motion 12](https://www.framer.com/motion/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Routing**: [React Router 7](https://reactrouter.com/) (HTML5 History client-side routing)
* **State Management**: [Zustand 5](https://github.com/pmndrs/zustand) with LocalStorage persistence
* **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
* **Hosting Target**: [Cloudflare Pages](https://pages.cloudflare.com/) (Zero-server static distribution)

---

## 📦 Installation & Setup

### Prerequisites
* Node.js v18+ or v20+ (tested on Node v24)
* npm v9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the store.

### 3. Production Build
```bash
npm run build
```
Emits optimized static production assets into the `dist/` folder.

### 4. Preview Production Build Locally
```bash
npm run preview
```

---

## ☁️ Cloudflare Pages Deployment Guide

Deploying Whole Mart to Cloudflare Pages is completely free and requires zero backend server configuration:

1. Push this project repository to **GitHub** or **GitLab**.
2. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Authorize the Cloudflare GitHub app for the account that owns the repository.
4. Select your repository and configure the following build settings:
   * **Project name**: `whole-mart` (serves from `https://whole-mart.pages.dev`)
   * **Framework preset**: `Vite`
   * **Build command**: `npm run build`
   * **Build output directory**: `dist`
   * **Root directory**: leave **empty** — this repository's root *is* the app folder, so the build runs from `package.json` at the top level.
5. Optionally add the environment variable `NODE_VERSION` = `22` to pin the build image's Node version.
6. Click **Save and Deploy**. Every subsequent push to the production branch (`main`) automatically rebuilds and redeploys.
7. Cloudflare Pages automatically honors the `public/_redirects` file (`/* /index.html 200`), allowing all deep links (`/shop`, `/product/:slug`, `/checkout`, `/account/orders`) to route properly without 404 errors.

> **Note:** Git integration is a one-way choice. A project created this way cannot later be switched to Direct Upload, and Direct Upload projects cannot be switched *to* Git integration.

---

## 📂 Project Architecture

```text
project5ecom/
├── public/
│   ├── _redirects              # Cloudflare Pages SPA client-side routing rule
│   └── favicon.svg             # Floating Whole Mart brand icon
├── src/
│   ├── components/
│   │   ├── motion/             # 8 dynamic animation primitives
│   │   ├── ui/                 # Accessible buttons, inputs, modals, drawers, toasts
│   │   ├── layout/             # Header, AnnouncementBar, Footer, MobileNav, Layout
│   │   ├── product/            # ProductCard, Grid, Filters, Gallery, 360Viewer, StickyBar
│   │   ├── cart/               # CartDrawer, CartItemRow, FreeShippingMeter
│   │   ├── checkout/           # Stepper & 4-step wizard forms
│   │   └── search/             # Cmd+K predictive search overlay
│   ├── data/
│   │   └── products.ts         # 24+ realistic mock products in 6 categories (INR ₹)
│   ├── store/                  # Zustand stores (Cart, Wishlist, Theme, Orders, Recent)
│   ├── types/                  # TypeScript interfaces
│   ├── lib/                    # Framer Motion presets & currency formatters
│   ├── pages/                  # 12 application page views
│   ├── styles/                 # Tailwind CSS & design token variables
│   ├── App.tsx                 # Master route definitions
│   └── main.tsx                # React 19 root mount
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Custom design tokens & animations
├── tsconfig.json               # TypeScript configuration
├── DESIGN_SYSTEM.md            # Comprehensive design system & tokens guide
└── ARCHITECTURE.md             # Technical architecture & Cloudflare documentation
```

---

## 🎨 Spatial Design System Highlights

* **Typography**: Outlined using `Outfit` for geometric headlines and `Inter` for crisp body copy.
* **Palette**: Deep space `#07090e`, midnight card surfaces `#0f1422`, indigo `#6366f1`, violet `#8b5cf6`, and cyan `#06b6d4`.
* **Motion Physics**: Spring-based interactions (`stiffness: 260`, `damping: 24`) for realistic weightless feedback.
* **Full Reduced Motion Support**: Honors `prefers-reduced-motion` across all components to ensure accessibility.

---

## 🔮 Future Improvements (Post-College Demo)

* Real payment gateway integration (Stripe / Razorpay webhooks)
* User authentication with Firebase Auth or Supabase
* PostgreSQL database with Prisma ORM
* Admin inventory management dashboard
* Order status push notifications via Webhooks
