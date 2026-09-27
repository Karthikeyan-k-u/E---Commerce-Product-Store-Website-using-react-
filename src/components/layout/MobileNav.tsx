import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useSearchStore } from '../../store/searchStore';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const { openCart, getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openSearch } = useSearchStore();

  const cartCount = getItemCount();
  const wishlistCount = wishlistItems.length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-xl border-t border-[#e2e8f0] dark:border-[#334155] px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
            location.pathname === '/' ? 'text-[#4F46E5] font-semibold' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        <Link
          to="/shop"
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
            location.pathname === '/shop' ? 'text-[#4F46E5] font-semibold' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Shop</span>
        </Link>

        <button
          onClick={openSearch}
          className="flex flex-col items-center py-1 px-2.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Search</span>
        </button>

        <Link
          to="/wishlist"
          className={`relative flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
            location.pathname === '/wishlist' ? 'text-[#4F46E5] font-semibold' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Saved</span>
          {wishlistCount > 0 && (
            <span className="absolute top-1 right-2 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#F43F5E] text-white text-[9px] font-bold">
              {wishlistCount}
            </span>
          )}
        </Link>

        <button
          onClick={openCart}
          className="relative flex flex-col items-center py-1 px-2.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors"
        >
          <ShoppingBag className="w-5 h-5 text-[#0F172A] dark:text-[#F8FAFC]" />
          <span className="text-[10px] mt-0.5">Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-2 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#4F46E5] text-white text-[9px] font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
