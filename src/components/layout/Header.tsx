import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Sun, Moon, Menu, X, ChevronDown, User, Sparkles, Crown } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useThemeStore } from '../../store/themeStore';
import { useSearchStore } from '../../store/searchStore';
import { useCommunityStore } from '../../store/communityStore';
import { CATEGORIES } from '../../data/products';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from '../ui/Logo';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const location = useLocation();
  const { openCart, getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { theme, toggleTheme } = useThemeStore();
  const { openSearch } = useSearchStore();
  const { joinedCommunities } = useCommunityStore();

  const cartCount = getItemCount();
  const wishlistCount = wishlistItems.length;
  const joinedCount = joinedCommunities.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-xl border-b border-[#e2e8f0] dark:border-[#334155] shadow-sm py-3'
          : 'bg-white dark:bg-[#0b0f19] border-b border-[#e2e8f0] dark:border-[#334155] py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="group select-none">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
          <Link
            to="/"
            className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all ${
              location.pathname === '/'
                ? 'text-[#4F46E5] font-semibold bg-[#4F46E5]/10 border border-[#4F46E5]/20'
                : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#4F46E5] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all ${
              location.pathname === '/shop'
                ? 'text-[#4F46E5] font-semibold bg-[#4F46E5]/10 border border-[#4F46E5]/20'
                : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#4F46E5] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Shop
          </Link>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="px-3.5 py-2 text-sm font-medium rounded-xl transition-all flex items-center gap-1.5 text-[#334155] dark:text-[#CBD5E1] hover:text-[#4F46E5] hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Categories
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  categoriesOpen ? 'rotate-180 text-[#4F46E5]' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {categoriesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 mt-2 w-72 p-2 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xl backdrop-blur-2xl z-50"
                >
                  <div className="grid gap-1">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/category/${cat.slug}`}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#4F46E5]/10 transition-colors group"
                      >
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-9 h-9 rounded-lg object-cover group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <div className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#4F46E5] transition-colors">
                            {cat.name}
                          </div>
                          <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] line-clamp-1">
                            {cat.itemCount} products
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/communities"
            className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all flex items-center gap-1.5 ${
              location.pathname.startsWith('/communities')
                ? 'text-[#4F46E5] font-semibold bg-[#4F46E5]/10 border border-[#4F46E5]/20'
                : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#4F46E5] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Communities
            {joinedCount > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#10B981] text-white text-[10px] font-bold shadow-sm">
                {joinedCount}
              </span>
            )}
          </Link>

          <Link
            to="/account/orders"
            className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all ${
              location.pathname.startsWith('/account')
                ? 'text-[#4F46E5] font-semibold bg-[#4F46E5]/10 border border-[#4F46E5]/20'
                : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#4F46E5] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Orders
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Smart Search Trigger */}
          <button
            onClick={openSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-slate-100/70 dark:bg-slate-800/60 hover:border-[#4F46E5]/50 hover:bg-slate-100 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-all text-xs group"
            title="Search products (Cmd+K)"
          >
            <Search className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#4F46E5] transition-colors" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] bg-white dark:bg-slate-700 rounded border border-[#E2E8F0] dark:border-[#334155]">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#334155] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] dark:hover:border-[#334155] bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Moon className="w-5 h-5 text-[#4F46E5] hover:-rotate-45 transition-transform duration-300" />
            )}
          </button>

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            className="relative p-2 rounded-xl text-[#334155] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] dark:hover:border-[#334155] bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#F43F5E] text-white text-[10px] font-bold shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Account Icon */}
          <Link
            to="/account"
            className="relative hidden sm:inline-flex p-2 rounded-xl text-[#334155] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] dark:hover:border-[#334155] bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Account"
          >
            <User className="w-5 h-5" />
            {joinedCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white text-[10px] font-bold shadow-sm"
                title={`${joinedCount} communities joined`}
              >
                <Crown className="w-2.5 h-2.5" />
                {joinedCount}
              </span>
            )}
          </Link>

          {/* Cart Button with Cart Icon #0F172A (dark #F8FAFC) */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0F172A] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] transition-all duration-200 active:scale-95 shadow-sm"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#0F172A] dark:text-[#F8FAFC]" />
            <span className="hidden sm:inline text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Cart</span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#4F46E5] text-white text-[10px] font-bold shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#334155] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#0F172A] dark:text-[#F8FAFC]" /> : <Menu className="w-6 h-6 text-[#0F172A] dark:text-[#F8FAFC]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155] px-5 py-4 space-y-3"
          >
            <nav className="flex flex-col space-y-1">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] rounded-xl"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="px-3 py-2 text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] rounded-xl"
              >
                All Products
              </Link>
              <div className="pt-2 pb-1 border-t border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider px-3">
                Categories
              </div>
              <div className="grid grid-cols-2 gap-1 px-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="px-2.5 py-1.5 text-xs text-[#334155] dark:text-[#CBD5E1] hover:text-[#4F46E5] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <Link
                to="/communities"
                className="px-3 py-2 text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] rounded-xl flex items-center gap-2"
              >
                Communities
                {joinedCount > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#10B981] text-white text-[10px] font-bold">
                    {joinedCount}
                  </span>
                )}
              </Link>
              <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
                <Link
                  to="/account/orders"
                  className="px-3 py-2 text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] rounded-xl block"
                >
                  My Orders & Tracking
                </Link>
                <Link
                  to="/account"
                  className="px-3 py-2 text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] rounded-xl block"
                >
                  Account Profile
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
