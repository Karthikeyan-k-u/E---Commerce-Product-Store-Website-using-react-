import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Tag, X, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { CartItemRow } from '../components/cart/CartItemRow';
import { FreeShippingMeter } from '../components/cart/FreeShippingMeter';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { formatINR } from '../lib/utils';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    getSubtotal,
    getDiscount,
    getShippingFee,
    getTotal,
    couponCode,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShippingFee();
  const total = getTotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) setCouponInput('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={<ShoppingBag className="w-10 h-10" />}
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added anything to your cart yet. Discover cutting-edge floating audio, wearables and gear."
          actionLabel="Start Shopping"
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Breadcrumb & Title */}
      <div className="space-y-3">
        <Breadcrumb items={[{ label: 'Cart' }]} />
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary font-display tracking-tight">
            Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-text-muted hover:text-rose-500 transition-colors"
          >
            Empty Cart
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items List & Free Delivery Meter */}
        <div className="lg:col-span-8 space-y-6">
          <FreeShippingMeter subtotal={subtotal} />

          <div className="p-6 rounded-2xl bg-surface border border-surface-border divide-y divide-surface-border">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout CTA */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="p-6 rounded-2xl bg-surface border border-surface-border shadow-float space-y-5">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Order Summary
            </h3>

            {/* Coupon input */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Coupon <strong>{couponCode}</strong> applied</span>
                  </div>
                  <button onClick={removeCoupon} className="hover:text-rose-500 p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponFeedback(null);
                      }}
                      placeholder="Discount Code"
                      className="flex-1 h-10 px-3 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-surface-border outline-none focus:border-indigo-500"
                    />
                    <Button type="submit" size="sm" variant="outline">
                      Apply
                    </Button>
                  </div>
                  {couponFeedback && (
                    <p
                      className={`text-[11px] ${
                        couponFeedback.success ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-rose-500'
                      }`}
                    >
                      {couponFeedback.message}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Price breakdown */}
            <div className="space-y-2.5 text-xs border-t border-surface-border pt-4">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span className="text-text-primary font-semibold">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-text-muted">
                <span>Estimated Express Shipping</span>
                <span className="text-text-primary font-semibold">
                  {shipping === 0 ? <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span> : formatINR(shipping)}
                </span>
              </div>
              <div className="pt-3 border-t border-surface-border flex justify-between text-base font-extrabold text-text-primary">
                <span>Total Amount</span>
                <span className="text-[#4F46E5]">{formatINR(total)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate('/checkout')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Checkout
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Safe & Secure 256-Bit SSL Demo Gateway</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
