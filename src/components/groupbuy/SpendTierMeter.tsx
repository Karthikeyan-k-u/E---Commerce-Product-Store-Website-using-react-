import React from 'react';
import { Award, ChevronRight } from 'lucide-react';
import type { SpendTier } from '../../types';
import { SPEND_TIERS } from '../../data/groupBuys';
import { unitLabel } from '../../lib/groupBuy';
import { cn } from '../../lib/utils';

interface SpendTierMeterProps {
  color: string;
  /** Units you have bought in this community. */
  myUnits: number;
  spendTier?: SpendTier;
  nextSpendTier?: SpendTier;
  unitsToNext: number;
  className?: string;
}

/**
 * Your personal ladder inside a community. Compact on purpose: it lives inside
 * the sticky panel, so this is one row plus three dots rather than a full card.
 */
export const SpendTierMeter: React.FC<SpendTierMeterProps> = ({
  color,
  myUnits,
  spendTier,
  nextSpendTier,
  unitsToNext,
  className,
}) => {
  return (
    <div className={cn('pt-2.5 mt-2.5 border-t border-surface-border space-y-2', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-text-primary">
          <Award className="h-3 w-3 shrink-0" style={{ color }} />
          {spendTier ? `${spendTier.name} member` : 'Spend tier'}
        </span>
        <span className="text-[10px] text-text-muted tabular-nums">{unitLabel(myUnits)}</span>
      </div>

      <div className="flex items-center gap-1" role="img" aria-label={progressLabel(myUnits, nextSpendTier)}>
        {SPEND_TIERS.map((tier) => {
          const reached = myUnits >= tier.units;
          return (
            <div
              key={tier.id}
              title={`${tier.name} · ${tier.units} ${tier.units === 1 ? 'unit' : 'units'}`}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{ backgroundColor: reached ? color : 'var(--color-surface-border)' }}
            />
          );
        })}
      </div>

      <p className="flex items-start gap-1 text-[11px] text-text-muted leading-relaxed">
        {nextSpendTier ? (
          <>
            <ChevronRight className="h-3 w-3 mt-0.5 shrink-0" style={{ color }} />
            <span>
              {unitLabel(unitsToNext)} more buys you{' '}
              <span className="font-semibold text-text-secondary">{nextSpendTier.name}</span> —{' '}
              {nextSpendTier.perk.toLowerCase()}
            </span>
          </>
        ) : (
          <span>
            You have reached the top of this ladder.{' '}
            {spendTier?.perk} is yours on every drop.
          </span>
        )}
      </p>
    </div>
  );
};

const progressLabel = (myUnits: number, next?: SpendTier): string => {
  if (!next) return `Spend tier complete, ${myUnits} units bought`;
  return `${myUnits} units bought, ${next.units - myUnits} to ${next.name}`;
};
