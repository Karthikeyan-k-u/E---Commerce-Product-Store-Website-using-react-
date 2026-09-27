import React from 'react';
import { ShoppingBag, Zap } from 'lucide-react';
import { Product, ProductColor } from '../../types';
import { formatINR } from '../../lib/utils';
import { Button } from '../ui/Button';

interface ProductStickyBarProps {
  product: Product;
  selectedColor?: ProductColor;
  selectedSize?: string;
  quantity: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  visible: boolean;
  displayPrice?: number;
  displayOriginalPrice?: number;
}

export const ProductStickyBar: React.FC<ProductStickyBarProps> = ({
  product,
  selectedColor,
  selectedSize,
  quantity,
  onAddToCart,
  onBuyNow,
  displayPrice,
  displayOriginalPrice,
  visible,
}) => {
  if (!visible) return null;

  const price = displayPrice ?? product.price;
  const originalPrice = displayOriginalPrice ?? product.originalPrice;

  return (
    <div className="fixed bottom-14 md:bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-2xl border-t border-[#e2e8f0] dark:border-[#334155] shadow-lg py-3 px-4 sm:px-8 transition-transform duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left item preview */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-11 h-11 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-surface-border"
          />
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-semibold text-text-primary truncate">
              {product.name}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              {selectedColor && <span>{selectedColor.name}</span>}
              {selectedSize && <span>• {selectedSize}</span>}
            </div>
          </div>
        </div>

        {/* Price & CTAs */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="text-right hidden xs:block">
            <div className="text-sm sm:text-base font-extrabold text-text-primary">
              {formatINR(price)}
            </div>
            {price < originalPrice && (
              <div className="text-[10px] text-text-muted line-through">
                {formatINR(originalPrice)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onAddToCart}
              className="hidden sm:inline-flex"
              leftIcon={<ShoppingBag className="w-4 h-4" />}
            >
              Add to Cart
            </Button>
            <Button
              variant="buy"
              size="sm"
              onClick={onBuyNow}
              leftIcon={<Zap className="w-4 h-4" />}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
