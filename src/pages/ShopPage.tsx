import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Drawer } from '../components/ui/Drawer';
import { FilterState, SortOption, ProductCategory } from '../types';
import { SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  category: 'All',
  priceRange: [1000, 50000],
  minRating: 0,
  brands: [],
  inStockOnly: false,
  selectedColors: [],
  searchQuery: '',
};

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => {
    const categoryParam = searchParams.get('category') as ProductCategory;
    const queryParam = searchParams.get('q') || '';
    return {
      ...INITIAL_FILTERS,
      category: categoryParam || 'All',
      searchQuery: queryParam,
    };
  });

  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync URL search params
  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category') as ProductCategory;
    if (q !== null) {
      setFilters((f) => ({ ...f, searchQuery: q }));
    }
    if (cat) {
      setFilters((f) => ({ ...f, category: cat }));
    }
  }, [searchParams]);

  // Extract all unique brands
  const allBrands = useMemo(() => {
    return Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();
  }, []);

  // Filter products logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (filters.category && filters.category !== 'All' && p.category !== filters.category) {
        return false;
      }
      // Search query
      if (filters.searchQuery) {
        const term = filters.searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.tags.some((t) => t.toLowerCase().includes(term));
        if (!matches) return false;
      }
      // Price range
      if (p.price > filters.priceRange[1] || p.price < filters.priceRange[0]) {
        return false;
      }
      // Rating
      if (filters.minRating > 0 && p.rating < filters.minRating) {
        return false;
      }
      // Brands
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) {
        return false;
      }
      // Colors
      if (
        filters.selectedColors.length > 0 &&
        !p.colors.some((c) => filters.selectedColors.includes(c.hex))
      ) {
        return false;
      }
      // In stock
      if (filters.inStockOnly && p.stock <= 0) {
        return false;
      }
      return true;
    });
  }, [filters]);

  // Sort products logic
  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];
    switch (sortOption) {
      case 'price-asc':
        return items.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return items.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return items.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return items.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
      case 'featured':
      default:
        return items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredProducts, sortOption]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchParams({});
  };

  const handleRemoveCategory = () => {
    setFilters({ ...filters, category: 'All' });
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const handleRemoveSearch = () => {
    setFilters({ ...filters, searchQuery: '' });
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  const handleRemoveBrand = (brand: string) => {
    setFilters({ ...filters, brands: filters.brands.filter((b) => b !== brand) });
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    Boolean(filters.searchQuery) ||
    filters.priceRange[1] < 50000 ||
    filters.minRating > 0 ||
    filters.brands.length > 0 ||
    filters.selectedColors.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Shop', href: '/shop' }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-display">
              {filters.category && filters.category !== 'All'
                ? `${filters.category} Collection`
                : 'All Products'}
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Showing {sortedProducts.length} of {PRODUCTS.length} curated products
            </p>
          </div>

          {/* Controls: Mobile Filter Button & Sort Selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-surface-border text-xs font-semibold text-text-primary shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#4F46E5]" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
              )}
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-text-muted hidden sm:inline">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="h-10 px-3 bg-surface text-text-primary rounded-xl border border-surface-border text-xs outline-none focus:border-[#4F46E5] transition-colors cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Customer Rating</option>
                <option value="newest">Newest Releases</option>
              </select>
            </div>
          </div>
        </div>

        {/* Removable Active Filter Chips Strip */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
            <span className="text-text-muted text-[11px] font-medium">Active:</span>

            {filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#A5B4FC] border border-[#4F46E5]/20 text-xs font-medium">
                {filters.category}
                <button onClick={handleRemoveCategory}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#A5B4FC] border border-[#4F46E5]/20 text-xs font-medium">
                "{filters.searchQuery}"
                <button onClick={handleRemoveSearch}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.brands.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#A5B4FC] border border-[#4F46E5]/20 text-xs font-medium"
              >
                {b}
                <button onClick={() => handleRemoveBrand(b)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold">
                {filters.minRating}★ & above
                <button onClick={() => setFilters({ ...filters, minRating: 0 })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-[11px] text-text-muted hover:text-rose-500 transition-colors underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Catalog Grid & Desktop Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sticky Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 rounded-2xl bg-surface p-5 border border-surface-border shadow-sm">
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            availableBrands={allBrands}
          />
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          <ProductGrid
            products={sortedProducts}
            isLoading={isLoading}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet Drawer */}
      <Drawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Products"
        position="bottom"
      >
        <ProductFilters
          filters={filters}
          onChange={(newFilters) => {
            setFilters(newFilters);
          }}
          onReset={() => {
            handleResetFilters();
            setMobileFilterOpen(false);
          }}
          availableBrands={allBrands}
        />
        <div className="pt-6 border-t border-surface-border mt-6">
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-glow"
          >
            Apply Filters ({sortedProducts.length} results)
          </button>
        </div>
      </Drawer>
    </div>
  );
};
