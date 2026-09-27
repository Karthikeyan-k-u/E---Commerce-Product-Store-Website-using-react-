import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { ProductCard } from '../components/product/ProductCard';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearWishlist, moveAllToCart } = useWishlistStore();
  const { addToast } = useToast();

  const handleMoveAll = () => {
    moveAllToCart();
    addToast('All wishlist items moved to your cart!', 'success');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={<Heart className="w-10 h-10" />}
          title="Your Wishlist is Empty"
          description="Save floating items you love while browsing our store, and revisit them anytime."
          actionLabel="Explore Trending Gear"
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      <div className="space-y-3">
        <Breadcrumb items={[{ label: 'Wishlist' }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary font-display tracking-tight">
              My Saved Wishlist ({items.length})
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Items saved for future acquisition. Automatically synced with your local space.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMoveAll}
              leftIcon={<ShoppingBag className="w-4 h-4" />}
            >
              Move All to Cart
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearWishlist}
              leftIcon={<Trash2 className="w-4 h-4 text-rose-500" />}
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
