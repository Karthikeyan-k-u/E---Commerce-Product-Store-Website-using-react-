import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, MessageCircle } from 'lucide-react';
import { CATEGORIES } from '../../data/products';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_BUSINESS_NUMBER, WHATSAPP_DISPLAY_NUMBER } from '../../lib/social';
import { useCartStore } from '../../store/cartStore';
import { useSocialOrder } from '../../hooks/useSocialOrder';
import { Logo } from '../ui/Logo';
import { SocialConnect } from '../ui/SocialConnect';
import { InstagramGlyph } from '../ui/SocialGlyphs';

export const Footer: React.FC = () => {
  const { items, getSubtotal, getDiscount, getShippingFee, getTotal } = useCartStore();
  const { orderCartOnWhatsApp } = useSocialOrder();

  const handleOrderOnWhatsApp = () => {
    orderCartOnWhatsApp(items, {
      subtotal: getSubtotal(),
      discount: getDiscount(),
      shipping: getShippingFee(),
      total: getTotal(),
    });
  };

  return (
    <footer className="relative border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#050609] text-text-secondary pt-16 pb-12 overflow-hidden transition-colors duration-300">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-12 border-b border-slate-200 dark:border-white/[0.08]">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-primary">Express Dispatch</h4>
              <p className="text-[11px] text-text-muted">Free delivery over ₹999</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-primary">100% Authentic</h4>
              <p className="text-[11px] text-text-muted">Direct verified hardware</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-primary">7-Day Return</h4>
              <p className="text-[11px] text-text-muted">Instant doorstep pickup</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-primary">24/7 Dedicated Support</h4>
              <p className="text-[11px] text-text-muted">Always ready to assist</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block group select-none">
              <Logo size="md" />
            </Link>
            <p className="text-xs text-text-muted max-w-sm leading-relaxed">
              Everything You Need. Effortlessly. Experience futuristic shopping crafted with weightless spatial precision, fluid interactions, and curated modern tech.
            </p>
            <div className="pt-2">
              <SocialConnect variant="icons" />
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/category/${cat.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  All Catalog
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/account/orders" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Account Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Contact & Social
            </h4>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-xs hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <InstagramGlyph className="w-4 h-4 text-[#DD2A7B] shrink-0" />
              <span>@{INSTAGRAM_HANDLE}</span>
            </a>

            <a
              href={`tel:+${WHATSAPP_BUSINESS_NUMBER}`}
              className="flex items-center gap-2.5 text-xs hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>{WHATSAPP_DISPLAY_NUMBER}</span>
            </a>

            <button
              type="button"
              onClick={handleOrderOnWhatsApp}
              className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1eb955] active:scale-95 text-white text-xs font-bold transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              {items.length > 0 ? 'Order Cart on WhatsApp' : 'Order on WhatsApp'}
            </button>

            <p className="text-[10px] text-text-muted leading-relaxed">
              Send us your order on WhatsApp or Instagram DM. We reply within a few hours.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-4">
          <p>© {new Date().getFullYear()} Whole Mart Store. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/shop" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Catalog</Link>
            <Link to="/account/orders" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Track Order</Link>
            <Link to="/cart" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">My Cart</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
