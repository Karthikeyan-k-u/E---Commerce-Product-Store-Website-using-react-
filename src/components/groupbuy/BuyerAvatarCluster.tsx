import React from 'react';
import { MessageCircle } from 'lucide-react';
import type { Buyer } from '../../types';
import { BuyerAvatar } from './BuyerAvatar';
import { cn } from '../../lib/utils';

interface BuyerAvatarClusterProps {
  buyers: Buyer[];
  totalUnits: number;
  onPickBuyer: (buyer: Buyer) => void;
  onAskGeneral: () => void;
  className?: string;
}

const MAX_VISIBLE = 3;

/**
 * Overlaid on the product image. Each avatar opens WhatsApp with that buyer's
 * name attached; the overflow bubble opens a plain enquiry.
 */
export const BuyerAvatarCluster: React.FC<BuyerAvatarClusterProps> = ({
  buyers,
  totalUnits,
  onPickBuyer,
  onAskGeneral,
  className,
}) => {
  if (buyers.length === 0) return null;

  const visible = buyers.slice(0, MAX_VISIBLE);
  const overflow = buyers.length - visible.length;

  return (
    <div className={cn('flex items-center', className)}>
      {visible.map((buyer, index) => (
        <button
          key={buyer.id}
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onPickBuyer(buyer);
          }}
          title={`${buyer.name} bought this — ask about it on WhatsApp`}
          aria-label={`Ask on WhatsApp about this product, as ${buyer.name} bought it`}
          className={cn(
            'rounded-full transition-transform duration-200 hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
            index > 0 && '-ml-2'
          )}
        >
          <BuyerAvatar name={buyer.name} size="xs" />
        </button>
      ))}

      {overflow > 0 && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onAskGeneral();
          }}
          title={`${overflow} more people from this community bought this`}
          aria-label={`${totalUnits} units claimed. Ask about this product on WhatsApp`}
          className="-ml-2 h-6 px-1.5 rounded-full text-[9px] font-bold text-white bg-slate-900/85 backdrop-blur-md ring-2 ring-white/85 dark:ring-[#1e293b] transition-transform duration-200 hover:scale-105 focus-visible:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] inline-flex items-center gap-0.5"
        >
          <MessageCircle className="h-2.5 w-2.5 text-[#25D366]" />
          +{overflow}
        </button>
      )}
    </div>
  );
};
