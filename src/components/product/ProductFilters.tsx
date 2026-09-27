import React from 'react';
import { FilterState, ProductCategory } from '../../types';
import { CATEGORIES } from '../../data/products';
import { formatINR } from '../../lib/utils';
import { X, SlidersHorizontal, RotateCcw, Check, Star } from 'lucide-react';
import { Button } from '../ui/Button';

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  availableBrands: string[];
  maxPriceLimit?: number;
  className?: string;
}

const COMMON_COLORS = [
  { name: 'Black', hex: '#0f172a' },
  { name: 'Silver', hex: '#cbd5e1' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'White', hex: '#ffffff' },
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
  availableBrands,
  maxPriceLimit = 50000,
  className = '',
}) => {
  const handleCategoryChange = (cat: ProductCategory | 'All') => {
    onChange({ ...filters, category: cat });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onChange({ ...filters, priceRange: [filters.priceRange[0], val] });
  };

  const handleRatingChange = (rating: number) => {
    onChange({ ...filters, minRating: filters.minRating === rating ? 0 : rating });
  };

  const handleBrandToggle = (brand: string) => {
    const exists = filters.brands.includes(brand);
    const updated = exists
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: updated });
  };

  const handleColorToggle = (colorHex: string) => {
    const exists = filters.selectedColors.includes(colorHex);
    const updated = exists
      ? filters.selectedColors.filter((c) => c !== colorHex)
      : [...filters.selectedColors, colorHex];
    onChange({ ...filters, selectedColors: updated });
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.priceRange[1] < maxPriceLimit ||
    filters.minRating > 0 ||
    filters.brands.length > 0 ||
    filters.selectedColors.length > 0 ||
    filters.inStockOnly;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header & Clear All */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <SlidersHorizontal className="w-4 h-4 text-[#4F46E5]" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#F43F5E] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Category
        </h4>
        <div className="space-y-1 text-xs">
          <button
            onClick={() => handleCategoryChange('All')}
            className={`w-full text-left px-3 py-1.5 rounded-xl transition-all flex items-center justify-between ${
              filters.category === 'All' || !filters.category
                ? 'bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#A5B4FC] font-semibold border border-[#4F46E5]/30'
                : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>All Categories</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryChange(cat.name)}
              className={`w-full text-left px-3 py-1.5 rounded-xl transition-all flex items-center justify-between ${
                filters.category === cat.name
                  ? 'bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#A5B4FC] font-semibold border border-[#4F46E5]/30'
                  : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] text-text-muted">{cat.itemCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-2.5 pt-2 border-t border-surface-border">
        <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider">
          <span>Max Price</span>
          <span className="text-text-primary font-bold lowercase">
            up to {formatINR(filters.priceRange[1])}
          </span>
        </div>
        <input
          type="range"
          min={1000}
          max={maxPriceLimit}
          step={500}
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
        />
        <div className="flex justify-between text-[11px] text-text-muted">
          <span>₹1,000</span>
          <span>{formatINR(maxPriceLimit)}</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-2.5 pt-2 border-t border-surface-border">
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Rating
        </h4>
        <div className="flex gap-2">
          {[4, 3].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingChange(star)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                filters.minRating === star
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-700 dark:text-amber-400 shadow-sm font-bold'
                  : 'border-surface-border text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{star}★ & up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-surface-border">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Brand
          </h4>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {availableBrands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2.5 text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="rounded border-surface-border text-[#4F46E5] focus:ring-[#4F46E5]/30 w-3.5 h-3.5 accent-[#4F46E5]"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Color Swatches */}
      <div className="space-y-2.5 pt-2 border-t border-surface-border">
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Color Accent
        </h4>
        <div className="flex flex-wrap gap-2">
          {COMMON_COLORS.map((c) => {
            const isSelected = filters.selectedColors.includes(c.hex);
            return (
              <button
                key={c.name}
                onClick={() => handleColorToggle(c.hex)}
                title={c.name}
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-transform ${
                  isSelected
                    ? 'ring-2 ring-[#4F46E5] scale-110'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-3 h-3 ${
                      c.name === 'White' || c.name === 'Silver' ? 'text-black' : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
