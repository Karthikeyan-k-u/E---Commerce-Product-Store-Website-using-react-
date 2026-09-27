import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Copy,
  Check,
  ChevronRight,
  Users,
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, MOCK_REVIEWS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { FloatingElement } from '../components/motion/FloatingElement';
import { ParallaxContainer } from '../components/motion/ParallaxContainer';
import { DepthLayer } from '../components/motion/DepthLayer';
import { ProductOrbit } from '../components/motion/ProductOrbit';
import { RevealOnScroll } from '../components/motion/RevealOnScroll';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { formatINR, formatNumber } from '../lib/utils';
import { ProductCategory } from '../types';
import { COMMUNITIES } from '../data/communities';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('All');
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Hero products
  const heroPrimary = PRODUCTS[0]; // Aura Pro Headphones
  const heroSecondary = PRODUCTS[4]; // Apex Smartwatch
  const heroTertiary = PRODUCTS[12]; // Lumina Levitation Lamp

  const trendingProducts = PRODUCTS.filter((p) => {
    if (selectedCategoryTab === 'All') return p.bestseller || p.featured;
    return p.category === selectedCategoryTab;
  }).slice(0, 8);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('WLMART10');
    setCopiedCoupon(true);
    addToast('Coupon code "WLMART10" copied to clipboard!', 'success');
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    addToast('Thank you for subscribing to Whole Mart Store updates!', 'success');
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-24 sm:space-y-32 overflow-hidden pb-12">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Ambient Spatial Background Lights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-[radial-gradient(circle,rgba(99,102,241,0.22)_0%,rgba(139,92,246,0.15)_40%,transparent_70%)] blur-[130px] pointer-events-none -z-10" />
        <div className="absolute -top-12 right-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Calls to Action */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-6xl font-black tracking-tight font-display text-[#0F172A] dark:text-[#F8FAFC] leading-[1.08]"
            >
              Everything You Need.
            </motion.h1>

            {/* Concrete Stat Line */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              24 curated products across 6 disciplines — shipped across India in 48 hours.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate('/shop')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/category/electronics')}
                className="w-full sm:w-auto"
              >
                Explore Collections
              </Button>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-surface-border dark:border-white/[0.08] max-w-md mx-auto lg:mx-0"
            >
              <div className="p-2.5 rounded-xl bg-surface-elevated/50 dark:bg-white/[0.02] border border-surface-border dark:border-white/[0.06]">
                <div className="text-xl sm:text-2xl font-black text-text-primary">48 Hrs</div>
                <div className="text-[11px] text-text-muted">Express Delivery</div>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-elevated/50 dark:bg-white/[0.02] border border-surface-border dark:border-white/[0.06]">
                <div className="text-xl sm:text-2xl font-black text-indigo-500 dark:text-indigo-400">100%</div>
                <div className="text-[11px] text-text-muted">Authentic Gear</div>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-elevated/50 dark:bg-white/[0.02] border border-surface-border dark:border-white/[0.06]">
                <div className="text-xl sm:text-2xl font-black text-text-primary">4.9/5</div>
                <div className="text-[11px] text-text-muted">Customer Rating</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Multi-Depth Floating Showcase */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-6 sm:py-8 overflow-visible">
            <ParallaxContainer intensity={14} className="w-full max-w-[340px] sm:max-w-md lg:max-w-lg aspect-square flex items-center justify-center overflow-visible">
              <ProductOrbit radius={195}>
                {/* Background Floating Element (Levitation Lamp) - Top Left Orbital Wing */}
                <DepthLayer depth="background" className="absolute -top-3 -left-3 sm:-top-8 sm:-left-10 lg:-left-14 z-10">
                  <FloatingElement duration={7} distance={10} delay={1}>
                    <Link
                      to={`/product/${heroTertiary.slug}`}
                      className="block p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#182132] border border-slate-200 dark:border-slate-700/80 shadow-xl hover:border-indigo-500/50 hover:shadow-2xl transition-all group w-28 sm:w-36"
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/80">
                        <img
                          src={heroTertiary.images[0]}
                          alt={heroTertiary.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="mt-2 text-center px-1">
                        <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                          {heroTertiary.name}
                        </div>
                        <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-extrabold mt-0.5">
                          {formatINR(heroTertiary.price)}
                        </div>
                      </div>
                    </Link>
                  </FloatingElement>
                </DepthLayer>

                {/* Middle Floating Element (Smartwatch) - Bottom Right Orbital Wing */}
                <DepthLayer depth="middle" className="absolute -bottom-3 -right-3 sm:-bottom-8 sm:-right-10 lg:-right-14 z-10">
                  <FloatingElement duration={8} distance={12} delay={0.5} direction="down">
                    <Link
                      to={`/product/${heroSecondary.slug}`}
                      className="block p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#182132] border border-slate-200 dark:border-slate-700/80 shadow-xl hover:border-indigo-500/50 hover:shadow-2xl transition-all group w-28 sm:w-36"
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/80">
                        <img
                          src={heroSecondary.images[0]}
                          alt={heroSecondary.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="mt-2 text-center px-1">
                        <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                          {heroSecondary.name}
                        </div>
                        <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-extrabold mt-0.5">
                          {formatINR(heroSecondary.price)}
                        </div>
                      </div>
                    </Link>
                  </FloatingElement>
                </DepthLayer>

                {/* Foreground Hero Centerpiece (Aura Pro Spatial Headphones) */}
                <DepthLayer depth="foreground" className="relative z-30">
                  <FloatingElement duration={6} distance={10}>
                    <Link
                      to={`/product/${heroPrimary.slug}`}
                      className="block p-3.5 sm:p-5 rounded-3xl bg-white dark:bg-[#141b2d] border border-slate-200 dark:border-slate-700/80 shadow-2xl hover:border-indigo-500 hover:shadow-glow-sm transition-all group"
                    >
                      <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/80">
                        <img
                          src={heroPrimary.images[0]}
                          alt={heroPrimary.name}
                          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] sm:text-[11px] font-bold shadow-md tracking-wide">
                          Flagship 2026
                        </div>
                      </div>
                      <div className="mt-3.5 sm:mt-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            {heroPrimary.brand}
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                            {heroPrimary.name}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                            {formatINR(heroPrimary.price)}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 line-through">
                            {formatINR(heroPrimary.originalPrice)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </FloatingElement>
                </DepthLayer>
              </ProductOrbit>
            </ParallaxContainer>
          </div>
        </div>
      </section>

      {/* ================= FEATURED CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 text-center sm:text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-display">
                Featured Spheres
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                Explore curated disciplines built for modern spatial workflows and lifestyles.
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group"
            >
              Browse All Products{' '}
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat, idx) => (
            <RevealOnScroll key={cat.slug} variant="fade-up" delay={idx * 0.06}>
              <Link
                to={`/category/${cat.slug}`}
                className="group relative flex flex-col justify-between p-4 rounded-2xl bg-surface border border-surface-border hover:border-indigo-500/50 shadow-sm hover:shadow-float transition-all duration-300 h-full overflow-hidden"
              >
                {/* Category Image with Zoom */}
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-text-muted mt-0.5 block">
                    {cat.itemCount} items
                  </span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ================= TRENDING PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Curated Selections
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-display mt-1">
                Trending Now
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-[#E2E8F0] dark:border-[#334155] overflow-x-auto max-w-full">
              {['All', 'Electronics', 'Wearables', 'Fashion', 'Home'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedCategoryTab(tab)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 shrink-0 ${
                    selectedCategoryTab === tab
                      ? 'bg-[#4F46E5] text-white shadow-sm border border-[#4F46E5]'
                      : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-200/60 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/shop')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Complete Catalog
          </Button>
        </div>
      </section>

      {/* ================= SPATIAL SPOTLIGHT SHOWCASE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll variant="scale-up">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#060812] via-[#0d1228] to-[#080a14] text-white border border-indigo-500/30 p-8 sm:p-14 overflow-hidden shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(99,102,241,0.25)]">
            {/* Background Accent Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Innovation Spotlight
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
                  Aura Pro Wireless Headphones.
                  <span className="block text-indigo-400">Sound without weight.</span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Crafted with titanium headband arcs and dynamic head-tracking spatial acoustic field. Hear instruments hover around you in true 3D spatial space.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="text-lg font-bold text-cyan-400">-45 dB</div>
                    <div className="text-[11px] text-slate-400">Hybrid ANC</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="text-lg font-bold text-white">48 Hours</div>
                    <div className="text-[11px] text-slate-400">Battery Runtime</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm col-span-2 sm:col-span-1">
                    <div className="text-lg font-bold text-indigo-300">248 Grams</div>
                    <div className="text-[11px] text-slate-400">Aerospace Build</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/product/aura-pro-wireless-headphones')}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="shadow-glow"
                  >
                    Experience Aura Pro ({formatINR(14999)})
                  </Button>
                </div>
              </div>

              {/* Right: Floating Product Preview with Interactive Hotspot */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <FloatingElement duration={7} distance={15}>
                  <div className="relative aspect-square w-64 sm:w-80 rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-4 shadow-float">
                    <img
                      src={heroPrimary.images[0]}
                      alt="Aura Pro Spotlight"
                      className="w-full h-full object-contain"
                    />
                    {/* Hotspot Pin 1 */}
                    <div className="absolute top-1/4 right-8 flex items-center gap-2 animate-pulse-glow">
                      <span className="w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-cyan-400/20" />
                      <span className="px-2 py-0.5 rounded bg-black/70 text-[10px] font-semibold text-white backdrop-blur-md">
                        Titanium Drivers
                      </span>
                    </div>
                    {/* Hotspot Pin 2 */}
                    <div className="absolute bottom-1/4 left-6 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20" />
                      <span className="px-2 py-0.5 rounded bg-black/70 text-[10px] font-semibold text-white backdrop-blur-md">
                        Memory Cushion
                      </span>
                    </div>
                  </div>
                </FloatingElement>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ================= PROMO COUPON BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll variant="fade-up">
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-surface via-surface-elevated to-indigo-950/20 dark:from-[#0f121e] dark:via-[#131828] dark:to-[#0f121e] border border-indigo-500/30 shadow-pro-card flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-1 text-center md:text-left relative z-10">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Special Semester Launch Promotion
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                Unlock 10% Off Your Entire Order
              </h3>
              <p className="text-xs text-text-muted max-w-md">
                Experience modern futuristic shopping with our introductory discount code.
              </p>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-2xl bg-surface-elevated/90 dark:bg-black/50 border border-indigo-400/30 shadow-inner relative z-10">
              <span className="font-mono text-sm font-black text-indigo-600 dark:text-indigo-300 tracking-wider px-3">
                WLMART10
              </span>
              <Button
                size="sm"
                variant="primary"
                onClick={handleCopyCoupon}
                leftIcon={copiedCoupon ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedCoupon ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ================= COMMUNITIES PROMO BAND ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll variant="scale-up">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b0f19] via-[#141c3a] to-[#0b0f19] text-white border border-indigo-500/30 p-8 sm:p-12 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(99,102,241,0.25)]">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Membership Circles
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
                  Join a Circle.
                  <span className="block text-indigo-400">Get there first.</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Six communities, one per discipline. Members unlock early access, member-only
                  pricing, and first offers 24–48 hours before the public — free to join.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-400" />
                    {formatNumber(COMMUNITIES.reduce((sum, c) => sum + c.memberCount, 0))} members
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {COMMUNITIES.length} circles
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-stretch gap-2.5">
                <div className="flex flex-wrap gap-2">
                  {COMMUNITIES.map((c) => (
                    <Link
                      key={c.id}
                      to={`/communities/${c.slug}`}
                      className="text-[11px] font-semibold text-slate-200 hover:text-white px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => navigate('/communities')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="shadow-glow mt-2"
                >
                  Explore All Communities
                </Button>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll variant="fade-up">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-display">
              Endorsed by Discerning Creators
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1.5">
              Read authentic feedback from early adopters who have elevated their spaces and gear.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_REVIEWS.slice(0, 3).map((rev, idx) => (
            <RevealOnScroll key={rev.id} variant="fade-up" delay={idx * 0.1}>
              <div className="p-6 rounded-2xl bg-surface border border-surface-border hover:border-indigo-500/40 shadow-sm transition-all h-full flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                  <span className="font-bold text-text-primary">{rev.userName}</span>
                  <span className="text-[11px] text-emerald-500 font-medium">Verified Buyer</span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <RevealOnScroll variant="fade-up">
          <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-surface-border shadow-float">
            <h3 className="text-2xl font-bold font-display text-text-primary mb-2">
              Stay in Orbit
            </h3>
            <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto mb-6">
              Subscribe for exclusive release drops, technological updates, and secret seasonal discounts.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 h-11 px-4 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-surface-border outline-none focus:border-indigo-500 transition-colors"
              />
              <Button type="submit" variant="primary" size="md">
                Subscribe
              </Button>
            </form>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  );
};
