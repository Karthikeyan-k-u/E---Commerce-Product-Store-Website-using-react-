import React, { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle, Package, ArrowRight, Home, Calendar, Truck, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { UnlockedCommunityPrompt } from '../components/community/UnlockedCommunityPrompt';
import { formatINR } from '../lib/utils';
import { FloatingElement } from '../components/motion/FloatingElement';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const { getOrderById, orders } = useOrderStore();
  const { user } = useAuthStore();

  const order = user
    ? orderId
      ? getOrderById(orderId, user.uid)
      : orders.find((candidate) => candidate.userId === user.uid)
    : undefined;

  useEffect(() => {
    // Trigger celebratory confetti on page mount
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#ffffff'],
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Order Received</h2>
        <p className="text-text-muted text-xs">Your order could not be found in this account.</p>
        <Button variant="primary" onClick={() => navigate('/shop')}>
          Back to Store
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 pb-24">
      {/* Floating Success Celebration Visual */}
      <div className="text-center space-y-3">
        <FloatingElement duration={5} distance={8} className="inline-block">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-glow mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
        </FloatingElement>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary font-display tracking-tight">
          Order Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
          Thank you for choosing Whole Mart. Your weightless items are being prepared for rapid express dispatch.
        </p>
      </div>

      {/* Main Order Details Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-float-lg space-y-6">
        {/* Order Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-surface-border">
          <div>
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Order Reference
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {order.id}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Estimated Doorstep Arrival
            </div>
            <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center sm:justify-end gap-1 mt-0.5">
              <Truck className="w-4 h-4" /> {order.estimatedDelivery}
            </div>
          </div>
        </div>

        {/* Ordered Items Preview */}
        <div className="space-y-3">
          <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Items in This Shipment ({order.items.length})
          </div>
          <div className="divide-y divide-surface-border border-y border-surface-border">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-surface-border"
                  />
                  <div>
                    <h4 className="font-semibold text-text-primary">{item.name}</h4>
                    <p className="text-[11px] text-text-muted">
                      Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor.name}` : ''}
                    </p>
                  </div>
                </div>
                <div className="font-bold text-text-primary">
                  {formatINR(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Summary Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-surface-elevated border border-surface-border text-xs space-y-1">
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Delivery Address
            </div>
            <div className="font-bold text-text-primary">{order.customer.fullName}</div>
            <div className="text-text-secondary leading-relaxed">
              {order.shippingAddress.street}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-elevated border border-surface-border text-xs space-y-1">
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Payment Summary
            </div>
            <div className="font-bold text-text-primary capitalize">
              {order.paymentMethod === 'upi' ? 'UPI Instant Pay' : order.paymentMethod}
            </div>
            <div className="flex justify-between text-text-muted pt-1">
              <span>Grand Total:</span>
              <span className="text-text-primary font-bold">{formatINR(order.total)}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Order Authenticated
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-surface-border">
          <Link to={`/account/orders/${order.id}`} className="w-full sm:w-1/2">
            <Button variant="primary" size="lg" className="w-full shadow-glow" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Live Track Order
            </Button>
          </Link>
          <Link to="/shop" className="w-full sm:w-1/2">
            <Button variant="outline" size="lg" className="w-full" leftIcon={<ShoppingBag className="w-4 h-4" />}>
              Continue Exploring
            </Button>
          </Link>
        </div>
      </div>

      {/* Buying is what earns the join */}
      <UnlockedCommunityPrompt />
    </div>
  );
};
