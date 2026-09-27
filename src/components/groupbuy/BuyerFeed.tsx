import React from 'react';
import { ShoppingBag } from 'lucide-react';
import type { Buyer, Community, Product } from '../../types';
import { useGroupBuy } from '../../hooks/useGroupBuy';
import { timeAgo, peopleLabel, unitLabel } from '../../lib/groupBuy';
import { cn } from '../../lib/utils';
import { BuyerAvatar } from './BuyerAvatar';

interface BuyerFeedProps {
  product: Product;
  community: Community;
  className?: string;
  limit?: number;
}

interface FeedRowProps {
  buyer: Buyer;
  color: string;
  isLast: boolean;
  now: number;
}

const FeedRow: React.FC<FeedRowProps> = ({ buyer, color, isLast, now }) => (
  <li className="relative pl-8 pb-4 last:pb-0">
    {!isLast && (
      <span
        aria-hidden="true"
        className="absolute left-[11px] top-7 bottom-0 w-px border-l border-dashed border-surface-border"
      />
    )}

    <span
      className={cn('absolute left-0 top-0.5 rounded-full', buyer.isYou && 'ring-2')}
      style={buyer.isYou ? { boxShadow: `0 0 0 2px ${color}` } : undefined}
    >
      <BuyerAvatar name={buyer.name} size="xs" />
    </span>

    <div className="w-full text-left">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-semibold text-text-primary truncate">
          {buyer.name}
          <span className="font-normal text-text-muted"> bought this</span>
        </span>
        <span className="text-[11px] text-text-muted tabular-nums shrink-0">
          {timeAgo(buyer.boughtAt, now)}
        </span>
      </div>

      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-text-muted">
        <ShoppingBag className="h-3 w-3 shrink-0" style={{ color }} />
        <span className="truncate">
          {buyer.units > 1 ? `${buyer.units} units` : '1 unit'}
          {buyer.variant ? ` in ${buyer.variant}` : ''}
        </span>
      </div>
    </div>
  </li>
);

export const BuyerFeed: React.FC<BuyerFeedProps> = ({
  product,
  community,
  className,
  limit = 8,
}) => {
  const groupBuy = useGroupBuy(product);

  if (!groupBuy) return null;

  const feed = groupBuy.feed.slice(0, limit);
  const now = Date.now();
  const isQuiet = groupBuy.people === 1;

  return (
    <section
      className={cn('p-6 rounded-2xl bg-surface border border-surface-border', className)}
      aria-label="Who bought this product"
    >
      <header className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-sm font-bold text-text-primary">Who bought this</h2>
        <span
          className="text-[11px] font-bold px-2 py-1 rounded-full shrink-0"
          style={{ color: community.color, backgroundColor: `${community.color}15` }}
        >
          {peopleLabel(groupBuy.people)} · {unitLabel(groupBuy.units)}
        </span>
      </header>

      {feed.length === 0 ? (
        <p className="text-xs text-text-muted">
          Nobody has claimed this drop yet. Be the first in {community.name}.
        </p>
      ) : (
        <ul>
          {feed.map((buyer, index) => (
            <FeedRow
              key={buyer.id}
              buyer={buyer}
              color={community.color}
              isLast={index === feed.length - 1}
              now={now}
            />
          ))}
        </ul>
      )}

      {isQuiet && groupBuy.unitsToNext > 0 && (
        <p className="mt-4 text-[11px] font-semibold text-text-secondary">
          Be the second, and you help unlock {groupBuy.nextBenefit} for everyone in{' '}
          {community.name}.
        </p>
      )}

      <p className="mt-4 pt-4 border-t border-surface-border text-[11px] text-text-muted">
        {groupBuy.unitsToNext > 0
          ? `${groupBuy.unitsToNext} more ${groupBuy.unitsToNext === 1 ? 'unit' : 'units'} unlocks the next discount step for everyone in ${community.name}.`
          : `${community.name} has unlocked every step on this drop.`}
      </p>
    </section>
  );
};
