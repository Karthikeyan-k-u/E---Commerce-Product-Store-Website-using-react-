import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../lib/utils';

interface FreeShippingMeterProps {
  subtotal: number;
}

const FREE_SHIPPING_THRESHOLD = 999;

export const FreeShippingMeter: React.FC<FreeShippingMeterProps> = ({ subtotal }) => {
  const isUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const percentage = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-surface-border space-y-2">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="flex items-center gap-1.5 text-text-primary">
          {isUnlocked ? (
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          ) : (
            <Truck className="w-4 h-4 text-[#4F46E5]" />
          )}
          {isUnlocked ? (
            <strong className="text-[#10B981] font-semibold">You've unlocked Free Express Delivery!</strong>
          ) : (
            <span>
              Add <strong className="text-[#4F46E5] font-semibold">{formatINR(remaining)}</strong> more for Free Delivery
            </span>
          )}
        </span>
        <span className="text-[11px] text-text-muted">{percentage}%</span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full rounded-full transition-all duration-500 ${
            isUnlocked
              ? 'bg-[#10B981]'
              : 'bg-[#4F46E5]'
          }`}
        />
      </div>
    </div>
  );
};
