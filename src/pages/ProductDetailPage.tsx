import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  Share2,
  Sparkles,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { PRODUCTS, MOCK_REVIEWS } from '../data/products';
import { getCommunityForProduct } from '../data/communities';
import { useGroupBuy } from '../hooks/useGroupBuy';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductStickyBar } from '../components/product/ProductStickyBar';
import { ProductReviews } from '../components/product/ProductReviews';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { GroupBuyPanel } from '../components/groupbuy/GroupBuyPanel';
import { BuyerFeed } from '../components/groupbuy/BuyerFeed';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useRecentStore } from '../store/recentStore';
import { useToast } from '../components/ui/Toast';
import { formatINR } from '../lib/utils';
import { ProductColor } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addRecentSlug } = useRecentStore();
  const { addToast } = useToast();

  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.slug === slug);
  }, [slug]);

  const groupBuy = useGroupBuy(product ?? PRODUCTS[0]);
  const community = product ? getCommunityForProduct(product.id) : undefined;

  const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'shipping'>('description');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [addedRecently, setAddedRecently] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes ? product.sizes[0] : undefined);
      setQuantity(1);
      addRecentSlug(product.slug);
    }
  }, [product, addRecentSlug]);

  // Track scroll position to reveal sticky buy bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-text-muted text-sm">
          The requested product could not be located in our catalog.
        </p>
        <Link to="/shop" className="text-indigo-500 font-semibold underline">
          Browse All Products
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const effectivePrice = groupBuy?.effectivePrice ?? product.price;
  const hasGroupDiscount = Boolean(groupBuy?.extraPct);
  const hasDiscount = effectivePrice < product.price;
  const isMember = groupBuy?.isMember ?? false;
  const priceLabel = hasGroupDiscount
    ? isMember
      ? 'Member + group buy price'
      : 'Group buy price'
    : isMember
      ? 'Member price'
      : 'Special price';

  const addToCart = () =>
    addItem(product, {
      color: selectedColor,
      size: selectedSize,
      quantity,
      price: hasDiscount ? effectivePrice : undefined,
      originalPrice: hasDiscount ? product.price : undefined,
      freeShipping: groupBuy?.freeShipping,
    });

  const handleAddToCart = () => {
    addToCart();
    setAddedRecently(true);
    addToast(`Added ${quantity}x ${product.name} to cart`, 'success');
    setTimeout(() => setAddedRecently(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart();
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Product link copied to clipboard!', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Shop', href: '/shop' },
          { label: product.category, href: `/category/${product.category.toLowerCase()}` },
          { label: product.name },
        ]}
      />

      {/* Main Product Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Gallery & 360 Viewer */}
        <div className="lg:col-span-7 sticky top-24">
          <ProductGallery
            images={product.images}
            productName={product.name}
            threeSixtyFrames={product.threeSixtyFrames}
          />
        </div>

        {/* Right Column: Details, Pricing, Variants & Purchase Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand & Stock */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
              {product.brand}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-surface border border-surface-border text-text-muted hover:text-text-primary transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-2 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'bg-surface border-surface-border text-text-muted hover:text-rose-500'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Product Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-display">
            {product.name}
          </h1>

          {/* Ratings & Reviews summary */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.rating) ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-text-primary">{product.rating}</span>
            <span className="text-text-muted">({product.reviewCount} customer reviews)</span>
          </div>

          {/* Price & Savings Strip */}
          <div
            className={`p-4 rounded-2xl border flex items-baseline justify-between gap-3 ${
              hasGroupDiscount
                ? 'bg-emerald-500/5 border-emerald-500/30'
                : 'bg-surface border-surface-border'
            }`}
          >
            <div className="space-y-0.5">
              <div className="text-xs text-text-muted">{priceLabel}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                  {formatINR(effectivePrice)}
                </span>
                {hasDiscount ? (
                  <span className="text-sm text-text-muted line-through">
                    {formatINR(product.price)}
                  </span>
                ) : product.originalPrice > product.price ? (
                  <span className="text-sm text-text-muted line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                ) : null}
              </div>
            </div>

            {hasGroupDiscount && groupBuy ? (
              <div className="text-right shrink-0">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold border"
                  style={{ color: groupBuy.communityColor, backgroundColor: `${groupBuy.communityColor}15`, borderColor: `${groupBuy.communityColor}30` }}
                >
                  Group −{groupBuy.extraPct}%
                </span>
                <div className="text-[10px] text-emerald-500 dark:text-emerald-400 mt-1">
                  You save {formatINR(product.price - effectivePrice)}
                </div>
              </div>
            ) : isMember && community ? (
              <div className="text-right shrink-0">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold border"
                  style={{ color: community.color, backgroundColor: `${community.color}15`, borderColor: `${community.color}30` }}
                >
                  Member −{community.memberDiscountPct}%
                </span>
                <div className="text-[10px] text-emerald-500 dark:text-emerald-400 mt-1">
                  You save {formatINR(product.price - effectivePrice)}
                </div>
              </div>
            ) : product.discountPercentage > 0 ? (
              <div className="text-right shrink-0">
                <span className="px-2.5 py-1 rounded-full bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/20 text-xs font-bold">
                  Save {product.discountPercentage}%
                </span>
                <div className="text-[10px] text-text-muted mt-1">
                  Save {formatINR(product.originalPrice - product.price)}
                </div>
              </div>
            ) : null}
          </div>

          {/* Product Description */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-surface-border space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Product Description
            </span>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
                Color:{' '}
                <span className="text-text-primary font-bold lowercase">
                  {selectedColor?.name}
                </span>
              </label>
              <div className="flex items-center gap-2.5">
                {product.colors.map((color) => {
                  const isSelected = selectedColor?.name === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`group flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-[#4F46E5] bg-[#4F46E5]/10'
                          : 'border-surface-border hover:border-[#4F46E5]/40'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-lg border border-black/20"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs font-medium text-text-primary pr-1">
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
                Size:{' '}
                <span className="text-text-primary font-bold">{selectedSize}</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm'
                          : 'border-surface-border text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Community Group Buy — the ladder that every purchase moves */}
          <GroupBuyPanel
            product={product}
            className="sticky top-24"
          />

          {/* Quantity Stepper & Main Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-surface-border rounded-xl bg-surface h-12 px-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 text-text-muted hover:text-[#4F46E5] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-bold text-text-primary min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 text-text-muted hover:text-[#4F46E5] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                className="flex-1"
                leftIcon={addedRecently ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              >
                {addedRecently ? 'Added to Cart!' : 'Add to Cart'}
              </Button>
            </div>

            {/* Instant Buy Now Button with Emerald #10B981 */}
            <Button
              variant="buy"
              size="lg"
              onClick={handleBuyNow}
              className="w-full shadow-md"
              leftIcon={<Zap className="w-4 h-4 text-white" />}
            >
              Buy Now with 1-Click
            </Button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-surface-border text-[11px] text-text-muted">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface border border-surface-border">
              <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Free Delivery &gt; ₹999</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface border border-surface-border">
              <RotateCcw className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>7-Day Return</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface border border-surface-border">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>1-Yr Warranty</span>
            </div>
          </div>

        </div>
      </div>

      {/* Who bought this product */}
      {community && <BuyerFeed product={product} community={community} />}

      {/* Tabbed Section: Specs, Reviews, Shipping Policy */}
      <div className="pt-10 border-t border-surface-border space-y-6">
        <div className="flex items-center gap-2 border-b border-surface-border overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'description'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Description & Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors shrink-0 ${
              activeTab === 'specs'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors shrink-0 ${
              activeTab === 'reviews'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Customer Reviews ({product.reviewCount})
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors shrink-0 ${
              activeTab === 'shipping'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Logistics & Returns
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'description' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-5">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Product Story & Details
                </span>
                <h3 className="text-base sm:text-lg font-bold text-text-primary font-display">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pt-1">
                  {product.description}
                </p>
              </div>

              {product.highlights && product.highlights.length > 0 && (
                <div className="pt-4 border-t border-surface-border space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Key Features & Engineering Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-surface-border text-xs text-text-secondary"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="pt-4 border-t border-surface-border flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-text-muted text-[11px] font-medium">Categories & Tags:</span>
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[11px] font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div
                key={key}
                className="p-3.5 rounded-xl bg-surface border border-surface-border flex items-center justify-between text-xs"
              >
                <span className="text-text-muted font-medium">{key}</span>
                <span className="text-text-primary font-semibold">{val}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <ProductReviews
            reviews={MOCK_REVIEWS}
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        )}

        {activeTab === 'shipping' && (
          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4 text-xs text-text-secondary leading-relaxed">
            <h4 className="text-sm font-bold text-text-primary">Express Dispatch Policy</h4>
            <p>
              All orders are packaged in custom anti-static floating air-cushion packaging and dispatched within 24 hours of placement. Metro cities across India receive doorstep delivery within 48 to 72 hours.
            </p>
            <h4 className="text-sm font-bold text-text-primary pt-2">Hassle-Free 7-Day Returns</h4>
            <p>
              If your item does not meet expectations, request a return within 7 days of delivery. Our courier partner will pick up the package from your doorstep with zero return shipping deductions.
            </p>
          </div>
        )}
      </div>

      {/* "You May Also Like" Related Products */}
      <RelatedProducts currentProduct={product} allProducts={PRODUCTS} />

      {/* Sticky Bottom Purchase Bar */}
      <ProductStickyBar
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        quantity={quantity}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={isWishlisted}
        onToggleWishlist={() => toggleWishlist(product)}
        visible={showStickyBar}
        displayPrice={hasDiscount ? effectivePrice : undefined}
        displayOriginalPrice={hasDiscount ? product.price : undefined}
      />
    </div>
  );
};
