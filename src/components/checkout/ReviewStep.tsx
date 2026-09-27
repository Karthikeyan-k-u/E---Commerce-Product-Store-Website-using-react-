import React, { useState } from 'react';
import { CustomerInfo, ShippingAddress, PaymentMethodType, CartItem } from '../../types';
import { formatINR } from '../../lib/utils';
import { Button } from '../ui/Button';
import { ArrowLeft, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

interface ReviewStepProps {
  customer: CustomerInfo;
  address: ShippingAddress;
  paymentMethod: PaymentMethodType;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  onPlaceOrder: () => void;
  onBack: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  customer,
  address,
  paymentMethod,
  items,
  subtotal,
  discount,
  shipping,
  total,
  onPlaceOrder,
  onBack,
}) => {
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceOrderClick = () => {
    setIsPlacing(true);
    setTimeout(() => {
      onPlaceOrder();
    }, 1000);
  };

  const getPaymentLabel = () => {
    switch (paymentMethod) {
      case 'upi':
        return 'Instant UPI / QR';
      case 'card':
        return 'Credit / Debit Card (Demo)';
      case 'netbanking':
        return 'Net Banking';
      case 'cod':
        return 'Pay on Delivery';
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-6">
      <div className="border-b border-surface-border pb-3">
        <h3 className="text-base font-bold text-text-primary">4. Order Summary & Final Review</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Please verify your shipping information and items before confirming your order.
        </p>
      </div>

      {/* Customer & Address Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-1">
          <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Recipient Details
          </div>
          <div className="text-xs font-bold text-text-primary">{customer.fullName}</div>
          <div className="text-xs text-text-secondary">{customer.email}</div>
          <div className="text-xs text-text-secondary">{customer.phone}</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-1">
          <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Shipping To
          </div>
          <div className="text-xs text-text-secondary leading-relaxed">
            {address.street}
            {address.landmark && `, ${address.landmark}`}
            <br />
            {address.city}, {address.state} — {address.pincode}
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium pt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Express Air Delivery (2-3 Days)
          </div>
        </div>
      </div>

      {/* Payment Method Selected */}
      <div className="p-3.5 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Payment Method
          </div>
          <div className="text-xs font-bold text-text-primary mt-0.5">{getPaymentLabel()}</div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" /> Secure Sandbox
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
          Items Ordered ({items.length})
        </div>
        <div className="divide-y divide-surface-border border-y border-surface-border">
          {items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-text-primary truncate">{item.name}</div>
                  <div className="text-[11px] text-text-muted">
                    Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor.name}` : ''}
                  </div>
                </div>
              </div>
              <div className="font-bold text-text-primary shrink-0">
                {formatINR(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-2 text-xs">
        <div className="flex justify-between text-text-muted">
          <span>Subtotal</span>
          <span className="text-text-primary font-semibold">{formatINR(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-500 font-semibold">
            <span>Special Promotional Discount</span>
            <span>-{formatINR(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-text-muted">
          <span>Shipping Charges</span>
          <span className="text-text-primary font-semibold">
            {shipping === 0 ? <span className="text-emerald-500">FREE</span> : formatINR(shipping)}
          </span>
        </div>
        <div className="pt-2 border-t border-surface-border flex justify-between text-base font-extrabold text-text-primary">
          <span>Grand Total</span>
          <span className="text-indigo-500">{formatINR(total)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isPlacing}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Payment
        </Button>
        <Button
          type="button"
          variant="buy"
          size="lg"
          isLoading={isPlacing}
          onClick={handlePlaceOrderClick}
          className="shadow-md"
          leftIcon={<Lock className="w-4 h-4" />}
        >
          Place Demo Order ({formatINR(total)})
        </Button>
      </div>
    </div>
  );
};
