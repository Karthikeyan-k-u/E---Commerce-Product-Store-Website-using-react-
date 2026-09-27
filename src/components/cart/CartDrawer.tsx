import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles, Tag, Check, X } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { CartItemRow } from './CartItemRow';
import { FreeShippingMeter } from './FreeShippingMeter';
import { useCartStore } from '../../store/cartStore';
import { formatINR } from '../../lib/utils';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    getSubtotal,
    getDiscount,
    getShippingFee,
    getTotal,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShippingFee();
  const total = getTotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeCart}
      title={`Shopping Cart (${items.length})`}
      description="Review your selected items and proceed to checkout"
      position="right"
      className="max-w-md"
    >
      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8" />}
          title="Your Cart is Weightless"
          description="You haven't added any products to your floating cart yet. Explore our curated collections."
          actionLabel="Start Shopping"
          onAction={() => {
            closeCart();
            navigate('/shop');
          }}
          className="py-12"
        />
      ) : (
        <div className="flex flex-col h-full justify-between -mx-5 -my-5">
          {/* Scrollable Items Container */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            <FreeShippingMeter subtotal={subtotal} />

            <div className="divide-y divide-surface-border">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} onCloseDrawer={closeCart} />
              ))}
            </div>

            {/* Promo Code Accordion/Form */}
            <div className="pt-2">
              {couponCode ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Coupon <strong>{couponCode}</strong> applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 hover:text-rose-500 text-text-muted transition-colors"
                  >
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
                      placeholder="Coupon (e.g. WLMART10)"
                      className="flex-1 h-9 px-3 text-xs bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-surface-border outline-none focus:border-indigo-500"
                    />
                    <Button type="submit" size="sm" variant="outline">
                      Apply
                    </Button>
                  </div>
                  {couponFeedback && (
                    <p
                      className={`text-[11px] ${
                        couponFeedback.success ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {couponFeedback.message}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Fixed Footer Summary */}
          <div className="p-5 border-t border-surface-border bg-surface-elevated/70 backdrop-blur-md space-y-3 shrink-0">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span className="text-text-primary font-medium">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-text-muted">
                <span>Estimated Shipping</span>
                <span className="text-text-primary font-medium">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
                  ) : (
                    formatINR(shipping)
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-surface-border flex justify-between text-sm font-bold text-text-primary">
                <span>Total</span>
                <span className="text-base text-[#4F46E5]">{formatINR(total)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleCheckout}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Checkout
            </Button>

            <button
              onClick={() => {
                closeCart();
                navigate('/cart');
              }}
              className="w-full text-center text-xs text-text-muted hover:text-text-primary hover:underline transition-colors pt-1"
            >
              View Full Cart Details
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
};
