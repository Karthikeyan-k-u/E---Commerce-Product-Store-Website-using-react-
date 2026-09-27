# Whole Mart — Everything You Need. Effortlessly.

> A senior UI/UX caliber e-commerce web application featuring a futuristic spatial visual design theme, built for a semester-3 college demonstration project and deployed on **Cloudflare Pages**.

**🌐 Live site: [https://whole-mart.pages.dev](https://whole-mart.pages.dev)**

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

**Live site: [https://whole-mart.pages.dev](https://whole-mart.pages.dev)**

This project is deployed to Cloudflare Pages using **Direct Upload**, which is free and needs no backend configuration. The production branch is `main`.

### 1. Authenticate Wrangler
```bash
wrangler login
```
This opens a browser and stores an OAuth token in your OS credential store. Run it once; later deploys reuse the cached session.

### 2. Build
```bash
npm run build
```
This runs `tsc -b && vite build` and emits optimized static assets into `dist/`.

### 3. Deploy
```bash
wrangler pages deploy ./dist --project-name whole-mart
```

The `whole-mart` project already exists, so you only need step 3 for subsequent deploys. To create it from scratch instead:
```bash
wrangler pages project create whole-mart --production-branch main
```

> There is no `build` config to set here. Because the repository root *is* the app folder, `package.json` lives at the top level and `dist/` is the only output directory.

### Redeploying after a change
Cloudflare Pages does **not** build this repository for you, so pushing to `main` does not publish anything. To ship a change:
```bash
npm run build
wrangler pages deploy ./dist --project-name whole-mart
```
Check what is live at any time with `wrangler pages deployment list --project-name whole-mart`, and roll back with **Deployments** in the Cloudflare dashboard.

### Deep links
Cloudflare Pages automatically honors the `public/_redirects` file (`/* /index.html 200`), so all client-side routes — `/shop`, `/product/:slug`, `/checkout`, `/account/orders`, `/communities` — serve the app shell instead of a 404. Never remove that file.

> **Note:** This project was created with Direct Upload, which Cloudflare treats as a permanent choice — it cannot later be switched to Git integration. If push-to-deploy is ever wanted, a **new** Pages project must be created through the dashboard's **Connect to Git** flow and this one retired.


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
