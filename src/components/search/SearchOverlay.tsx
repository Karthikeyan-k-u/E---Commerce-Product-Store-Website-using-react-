import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, ArrowRight, Tag } from 'lucide-react';
import { useSearchStore } from '../../store/searchStore';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { formatINR } from '../../lib/utils';
import { modalBackdrop } from '../../lib/animations';

const TRENDING_TAGS = ['Aura Pro', 'Levitation Lamp', 'OLED Monitor', 'Smartwatch', 'Sling Bag', 'Mechanical Keyboard'];

export const SearchOverlay: React.FC = () => {
  const { isOpen, closeSearch, recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useSearchStore.getState().toggleSearch();
      }
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSearch]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = '';
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredProducts = searchTerm.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 5)
    : [];

  const filteredCategories = searchTerm.trim()
    ? CATEGORIES.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleSelectProduct = (slug: string, name: string) => {
    addRecentSearch(name);
    closeSearch();
    navigate(`/product/${slug}`);
  };

  const handleSelectCategory = (slug: string, name: string) => {
    addRecentSearch(name);
    closeSearch();
    navigate(`/category/${slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    addRecentSearch(searchTerm);
    closeSearch();
    navigate(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 sm:pt-20">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={closeSearch}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Search Box Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-2xl bg-surface border border-surface-border rounded-2xl shadow-float-lg overflow-hidden z-10 text-text-primary"
          >
            {/* Input Bar */}
            <form onSubmit={handleSearchSubmit} className="flex items-center px-4 py-3.5 border-b border-surface-border">
              <Search className="w-5 h-5 text-indigo-500 shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, brands, categories... (e.g. Aura, Lamp, 4K)"
                className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm sm:text-base outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-1 text-text-muted hover:text-text-primary mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono text-text-muted bg-slate-100 dark:bg-slate-800 rounded border border-surface-border ml-2">
                ESC
              </kbd>
            </form>

            {/* Results / Suggestions Container */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
              {/* If Searching */}
              {searchTerm.trim() ? (
                <>
                  {filteredCategories.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> Categories
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {filteredCategories.map((cat) => (
                          <button
                            key={cat.slug}
                            onClick={() => handleSelectCategory(cat.slug, cat.name)}
                            className="flex items-center justify-between p-2.5 rounded-xl border border-surface-border hover:bg-indigo-500/10 hover:border-indigo-500/30 text-left transition-colors group"
                          >
                            <span className="text-xs font-medium text-text-primary">{cat.name}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredProducts.length > 0 ? (
                    <div>
                      <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                        Products ({filteredProducts.length})
                      </div>
                      <div className="space-y-1.5">
                        {filteredProducts.map((prod) => (
                          <button
                            key={prod.id}
                            onClick={() => handleSelectProduct(prod.slug, prod.name)}
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-indigo-500/10 transition-colors text-left group"
                          >
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0 group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-text-primary truncate group-hover:text-indigo-500 transition-colors">
                                {prod.name}
                              </div>
                              <div className="text-[11px] text-text-muted flex items-center gap-2 mt-0.5">
                                <span>{prod.brand}</span>
                                <span>•</span>
                                <span className="font-semibold text-text-primary">{formatINR(prod.price)}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-indigo-500 group-hover:translate-x-1 transition-transform" />
                          </button>
                        ))}
                      </div>
                      <div className="pt-2 text-center">
                        <button
                          onClick={handleSearchSubmit}
                          className="text-xs font-medium text-indigo-500 hover:text-indigo-400 underline underline-offset-4"
                        >
                          View all results for "{searchTerm}"
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-text-muted text-sm">
                      No products found matching "<span className="text-text-primary">{searchTerm}</span>". Try searching for "Headphones", "Monitor", or "Watch".
                    </div>
                  )}
                </>
              ) : (
                /* Default view: Recent & Trending */
                <>
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Recent Searches
                        </span>
                        <button
                          onClick={clearRecentSearches}
                          className="text-[10px] text-text-muted hover:text-text-primary lowercase hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term, i) => (
                          <button
                            key={i}
                            onClick={() => setSearchTerm(term)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-500/10 hover:text-indigo-500 border border-surface-border text-xs text-text-secondary transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Trending Searches
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchTerm(tag)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-xs font-medium transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
