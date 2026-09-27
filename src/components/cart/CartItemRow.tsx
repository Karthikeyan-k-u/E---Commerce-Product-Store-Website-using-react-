import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, Truck } from 'lucide-react';
import { CartItem } from '../../types';
import { formatINR } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';

interface CartItemRowProps {
  item: CartItem;
  onCloseDrawer?: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item, onCloseDrawer }) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-3.5 py-4 border-b border-surface-border last:border-b-0 group">
      {/* Thumbnail */}
      <Link
        to={`/product/${item.slug}`}
        onClick={onCloseDrawer}
        className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-surface-border group-hover:border-indigo-500/40 transition-colors"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Item Info & Actions */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/product/${item.slug}`}
              onClick={onCloseDrawer}
              className="text-xs sm:text-sm font-semibold text-text-primary hover:text-indigo-500 transition-colors line-clamp-1"
            >
              {item.name}
            </Link>
            <button
              onClick={() => removeItem(item.id)}
              className="text-text-muted hover:text-rose-500 p-1 rounded transition-colors"
              title="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Variants */}
          <div className="flex items-center gap-2 mt-1 text-[11px] text-text-muted">
            {item.selectedColor && (
              <span className="flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: item.selectedColor.hex }}
                />
                {item.selectedColor.name}
              </span>
            )}
            {item.selectedSize && (
              <span>• Size: {item.selectedSize}</span>
            )}
          </div>

          {item.freeShipping && (
            <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Truck className="h-2.5 w-2.5" />
              Free express delivery unlocked
            </span>
          )}
        </div>

        {/* Pricing & Stepper */}
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center border border-surface-border rounded-lg bg-surface">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 hover:text-indigo-500 text-text-muted transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-xs font-semibold text-text-primary min-w-[20px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 hover:text-indigo-500 text-text-muted transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-xs sm:text-sm font-bold text-text-primary">
              {formatINR(item.price * item.quantity)}
            </span>
            {item.originalPrice > item.price && (
              <span className="text-[10px] text-text-muted line-through ml-1.5 hidden sm:inline">
                {formatINR(item.originalPrice * item.quantity)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
