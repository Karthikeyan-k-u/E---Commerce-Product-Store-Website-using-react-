import React from 'react';
import { BadgeCheck, Truck } from 'lucide-react';
import type { GroupBuyTier, GroupBuyTierState } from '../../types';
import { cn, formatINR } from '../../lib/utils';

interface GroupBuyLadderProps {
  tiers: GroupBuyTier[];
  units: number;
  unitsToNext: number;
  basePrice: number;
  color: string;
}

const stateLabel = (state: GroupBuyTierState, unitsToNext: number) => {
  if (state === 'unlocked') return 'Unlocked';
  if (state === 'next') return `${unitsToNext} more to unlock`;
  return 'Locked';
};

export const GroupBuyLadder: React.FC<GroupBuyLadderProps> = ({
  tiers,
  units,
  unitsToNext,
  basePrice,
  color,
}) => {
  const nextTier = tiers.find((tier) => tier.units > units);

  return (
    <ol>
      {tiers.map((tier, index) => {
        const state: GroupBuyTierState =
          units >= tier.units ? 'unlocked' : nextTier?.units === tier.units ? 'next' : 'locked';
        const isLast = index === tiers.length - 1;

        return (
          <li key={tier.units} className="relative pl-7 pb-3 last:pb-0">
            {/* Rail segment down to the next node */}
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute left-[7px] top-4 bottom-0 w-px',
                  state === 'unlocked' ? '' : 'border-l border-dashed border-surface-border'
                )}
                style={state === 'unlocked' ? { backgroundColor: `${color}66` } : undefined}
              />
            )}

            {/* Node */}
            <span
              aria-hidden="true"
              className={cn(
                'absolute left-0 top-0.5 h-4 w-4 rounded-full flex items-center justify-center',
                state === 'locked' && 'border border-surface-border bg-surface'
              )}
              style={
                state === 'unlocked'
                  ? {
                      backgroundColor: color,
                      boxShadow: `0 0 0 3px ${color}22, 0 0 14px -2px ${color}80`,
                    }
                  : state === 'next'
                    ? { border: `2px solid ${color}`, boxShadow: `0 0 0 3px ${color}1a` }
                    : undefined
              }
            >
              {state === 'unlocked' && <span className="h-1.5 w-1.5 rounded-full bg-white/90" />}
              {state === 'next' && (
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: color }}
                />
              )}
            </span>

            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-semibold text-text-primary tabular-nums">
                {tier.units} units
              </span>
              <span
                className="text-xs font-bold tabular-nums"
                style={{ color: state === 'locked' ? 'var(--color-text-muted)' : color }}
              >
                −{tier.extraPct}% off
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-0.5">
              <span
                className={cn(
                  'text-[11px]',
                  state === 'unlocked'
                    ? 'text-emerald-500 font-semibold'
                    : 'text-text-muted'
                )}
              >
                {stateLabel(state, unitsToNext)}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                {tier.badge && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/20">
                    <BadgeCheck className="h-2.5 w-2.5" />
                    {tier.badge}
                  </span>
                )}

                {tier.freeShipping && !tier.badge && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Truck className="h-2.5 w-2.5" />
                    Free shipping
                  </span>
                )}

                {state === 'unlocked' && !tier.badge && (
                  <span className="text-[11px] text-text-muted tabular-nums">
                    saves {formatINR(Math.round((basePrice * tier.extraPct) / 100))}
                  </span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
};
