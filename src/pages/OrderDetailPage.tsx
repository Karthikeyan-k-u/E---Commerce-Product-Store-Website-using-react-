import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { formatINR } from '../lib/utils';
import { CheckCircle2, Circle, Truck, Package, Clock, ArrowLeft, ShieldCheck } from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById } = useOrderStore();
  const { user } = useAuthStore();

  const order = id && user ? getOrderById(id, user.uid) : undefined;

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <p className="text-xs text-text-muted">No record found for order ID "{id}".</p>
        <Link to="/account/orders" className="text-indigo-500 font-semibold underline text-xs">
          Return to Order History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Breadcrumb & Navigation */}
      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: 'Account', href: '/account' },
            { label: 'Orders', href: '/account/orders' },
            { label: order.id },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary font-display tracking-tight font-mono">
                {order.id}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1">Placed on {order.date}</p>
          </div>
          <Link
            to="/account/orders"
            className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all orders
          </Link>
        </div>
      </div>

      {/* Interactive 4-Stage Tracking Timeline */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          Package Tracking Timeline
        </h3>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {order.timeline.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Timeline marker icon */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                  step.completed
                    ? 'bg-indigo-600 text-white shadow-glow-sm ring-4 ring-surface'
                    : 'bg-surface text-text-muted border-2 border-slate-300 dark:border-slate-700 ring-4 ring-surface'
                }`}
              >
                {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-2.5 h-2.5" />}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4
                    className={`text-xs sm:text-sm font-bold ${
                      step.completed ? 'text-text-primary' : 'text-text-muted'
                    }`}
                  >
                    {step.status}
                  </h4>
                  <span className="text-[11px] text-text-muted">({step.date})</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Items & Financial Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Ordered items */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Items in Order ({order.items.length})
          </h3>
          <div className="divide-y divide-surface-border">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
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

        {/* Shipping & Payment Summary */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-surface border border-surface-border space-y-4 text-xs">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Delivery & Payment
          </h3>

          <div className="space-y-1">
            <div className="text-text-muted font-medium">Delivered to:</div>
            <div className="font-bold text-text-primary">{order.customer.fullName}</div>
            <div className="text-text-secondary leading-relaxed">
              {order.shippingAddress.street}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </div>
          </div>

          <div className="pt-3 border-t border-surface-border space-y-1.5">
            <div className="flex justify-between text-text-muted">
              <span>Subtotal</span>
              <span className="text-text-primary font-semibold">{formatINR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-500 font-semibold">
                <span>Discount</span>
                <span>-{formatINR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-text-muted">
              <span>Shipping</span>
              <span className="text-text-primary font-semibold">
                {order.shipping === 0 ? <span className="text-emerald-500">FREE</span> : formatINR(order.shipping)}
              </span>
            </div>
            <div className="pt-2 border-t border-surface-border flex justify-between text-sm font-bold text-text-primary">
              <span>Total Paid</span>
              <span className="text-indigo-500">{formatINR(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
