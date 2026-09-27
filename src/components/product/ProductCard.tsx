import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye, Lock, Users } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useGroupBuy } from '../../hooks/useGroupBuy';
import { useSocialOrder } from '../../hooks/useSocialOrder';
import { useToast } from '../ui/Toast';
import { FloatingCard } from '../motion/FloatingCard';
import { BuyerAvatarCluster } from '../groupbuy/BuyerAvatarCluster';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addToast } = useToast();
  const { askOnWhatsApp } = useSocialOrder();
  const groupBuy = useGroupBuy(product);

  const isLiked = isInWishlist(product.id);

  const effectivePrice = groupBuy?.effectivePrice ?? product.price;
  const isMember = groupBuy?.isMember ?? false;
  const hasDiscount = effectivePrice < product.price;

  const productUrl = `${window.location.origin}/product/${product.slug}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, {
      price: hasDiscount ? effectivePrice : undefined,
      originalPrice: hasDiscount ? product.price : undefined,
      freeShipping: groupBuy?.freeShipping,
    });
    addToast(`Added ${product.name} to your cart`, 'success');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    addToast(
      isLiked ? `Removed ${product.name} from wishlist` : `Added ${product.name} to wishlist`,
      'info'
    );
  };

  const openEnquiry = (friendName?: string) =>
    askOnWhatsApp({
      product,
      productUrl,
      currentPrice: effectivePrice,
      listPrice: product.price,
      groupBuyLine: groupBuy
        ? `${groupBuy.communityName} group buy: ${groupBuy.units} units claimed (${groupBuy.progressPct}%), −${groupBuy.extraPct}% unlocked`
        : undefined,
      friendName,
    });

  return (
    <FloatingCard
      className="group bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] overflow-hidden transition-all duration-300 hover:border-[#4F46E5]/50 hover:shadow-lg rounded-2xl shadow-sm"
      hoverElevation={-6}
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-900/60">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
        />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-20">
          {product.bestseller && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-[#4F46E5] text-white shadow-sm">
              Popular
            </span>
          )}
          {groupBuy && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-md text-white shadow-sm"
              style={{ backgroundColor: groupBuy.communityColor }}
            >
              <Lock className="w-2.5 h-2.5" />
              {isMember ? 'Community Price' : 'Group Buy'}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-xl backdrop-blur-md transition-all duration-200 border ${
            isLiked
              ? 'bg-[#F43F5E] text-white border-[#F43F5E] shadow-sm'
              : 'bg-white/80 dark:bg-slate-900/70 text-[#64748B] dark:text-[#94A3B8] hover:text-[#F43F5E] hover:bg-white border-[#E2E8F0] dark:border-slate-700'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Who bought this — tap an avatar to ask about the product on WhatsApp */}
        {groupBuy && groupBuy.feed.length > 0 && (
          <div className="absolute bottom-2.5 left-2.5 z-20">
            <BuyerAvatarCluster
              buyers={groupBuy.feed}
              totalUnits={groupBuy.units}
              onPickBuyer={(buyer) => openEnquiry(buyer.isYou ? undefined : buyer.name)}
              onAskGeneral={() => openEnquiry()}
            />
          </div>
        )}

        {/* Quick Actions Overlay on Hover — sits above the buyer cluster so neither hides the other */}
        <div className="absolute inset-x-2.5 bottom-12 z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2 px-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm border border-[#4338CA]/30"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/product/${product.slug}`);
            }}
            className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/80 hover:bg-white text-[#0F172A] dark:text-[#F8FAFC] text-xs backdrop-blur-md border border-[#E2E8F0] dark:border-slate-700 transition-colors shrink-0"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 space-y-2">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
          <span className="uppercase tracking-wider font-semibold text-[#64748B] dark:text-[#94A3B8]">{product.brand}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Name */}
        <h4 className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#4F46E5] transition-colors line-clamp-1">
          {product.name}
        </h4>

        {/* Product Description */}
        <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] line-clamp-2 leading-relaxed font-normal">
          {product.description}
        </p>

        {/* Color Swatch Dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 pt-0.5">
            {product.colors.slice(0, 4).map((c, i) => (
              <span
                key={i}
                title={c.name}
                className="w-2.5 h-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
              {formatINR(effectivePrice)}
            </span>
            {hasDiscount ? (
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8] line-through font-normal">
                {formatINR(product.price)}
              </span>
            ) : product.originalPrice > product.price ? (
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8] line-through font-normal">
                {formatINR(product.originalPrice)}
              </span>
            ) : null}
          </div>
          <span className="text-[10px] text-[#10B981] font-semibold">
            In Stock
          </span>
        </div>

        {groupBuy && (
          <p className="text-[10px] text-text-muted flex items-center gap-1">
            <Users className="w-3 h-3 shrink-0" style={{ color: groupBuy.communityColor }} />
            {groupBuy.people === 1
              ? `1 person from ${groupBuy.communityName} bought this`
              : `${groupBuy.people} from ${groupBuy.communityName} · ${groupBuy.units} units claimed`}
          </p>
        )}

        {groupBuy && !isMember && (
          <Link
            to={`/communities/${groupBuy.communitySlug}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
          >
            Join {groupBuy.communityName} to unlock {groupBuy.communityMemberDiscountPct}% off
          </Link>
        )}
      </div>
    </FloatingCard>
  );
};
