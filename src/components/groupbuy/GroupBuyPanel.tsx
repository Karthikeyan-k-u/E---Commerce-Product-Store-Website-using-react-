import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, Crown, Lock, Sparkles, Users } from 'lucide-react';
import type { Product } from '../../types';
import { useGroupBuy, useGroupBuyCountdown, type GroupBuyView } from '../../hooks/useGroupBuy';
import { peopleLabel } from '../../lib/groupBuy';
import { getCommunityBySlug } from '../../data/communities';
import { cn, formatINR, formatNumber } from '../../lib/utils';
import { GroupBuyLadder } from './GroupBuyLadder';
import { SpendTierMeter } from './SpendTierMeter';

interface GroupBuyPanelProps {
  product: Product;
  className?: string;
}

interface PanelBodyProps {
  groupBuy: GroupBuyView;
  className?: string;
}

const PanelBody: React.FC<PanelBodyProps> = ({ groupBuy, className }) => {
  const countdown = useGroupBuyCountdown(groupBuy.closesAt);

  const {
    communityName,
    communityColor,
    communitySlug,
    units,
    progressPct,
    tiers,
    extraPct,
    freeShipping,
    badge,
    unitsToNext,
    nextBenefit,
    nextPrice,
    people,
    basePrice,
    effectivePrice,
    joinPrice,
    joinSaves,
    youSaved,
    isMember,
    isYouIn,
    myCommunityUnits,
    spendTier,
    nextSpendTier,
    spendUnitsToNext,
  } = groupBuy;

  const community = getCommunityBySlug(communitySlug);
  // Buying must never hide the join: buying is what earns it. Previously this
  // required !isYouIn, which meant the one person most ready to join never saw
  // the button.
  const showJoinCta = !isMember;
  const showSpendTier = isMember || isYouIn;

  return (
    <section
      className={cn('p-5 rounded-2xl border bg-surface space-y-4', className)}
      style={{ borderColor: `${communityColor}40` }}
      aria-label={`${communityName} group buy`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
            style={{ backgroundColor: communityColor }}
          >
            <Users className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-text-primary truncate">
              {communityName} group buy
            </h3>
            <p className="text-[11px] text-text-muted">
              {peopleLabel(people)} from {communityName} so far
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-surface-elevated border border-surface-border text-text-secondary tabular-nums shrink-0">
          {countdown}
        </span>
      </header>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-2xl font-black font-display text-text-primary tracking-tight tabular-nums">
            {units}
            <span className="text-sm font-bold text-text-muted">
              {' '}
              {units === 1 ? 'unit' : 'units'} claimed
            </span>
          </span>
          <span
            className="text-sm font-black font-display tabular-nums"
            style={{ color: communityColor }}
          >
            {progressPct}%
          </span>
        </div>

        <div
          className="h-1.5 rounded-full bg-surface-elevated overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Group buy progress"
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              backgroundColor: communityColor,
              boxShadow: `0 0 12px -2px ${communityColor}`,
            }}
          />
        </div>

        <p className="text-[11px] text-text-muted">
          {unitsToNext > 0
            ? `${unitsToNext} more units unlocks the next step`
            : 'Every step is unlocked'}
        </p>
      </div>

      <GroupBuyLadder
        tiers={tiers}
        units={units}
        unitsToNext={unitsToNext}
        basePrice={basePrice}
        color={communityColor}
      />

      <div className="pt-3 border-t border-surface-border space-y-2.5">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="text-text-muted">You pay right now</span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-text-primary tabular-nums">
              {formatINR(effectivePrice)}
            </span>
            {basePrice > effectivePrice && (
              <span className="text-text-muted line-through tabular-nums">
                {formatINR(basePrice)}
              </span>
            )}
          </span>
        </div>

        {youSaved > 0 && (
          <p className="text-[11px] font-semibold text-emerald-500">
            You save {formatINR(youSaved)} on this drop
          </p>
        )}

        <div className="flex items-center gap-1.5 flex-wrap">
          {isYouIn && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Crown className="h-3 w-3" />
              You are in this group buy
            </span>
          )}
          {isMember && !isYouIn && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full"
              style={{ color: communityColor, backgroundColor: `${communityColor}15` }}
            >
              <Crown className="h-3 w-3" />
              Member pricing applied
            </span>
          )}

          {freeShipping && (
            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Free express delivery
            </span>
          )}

          {badge && (
            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/20">
              {badge}
            </span>
          )}
        </div>

        {/* What happens next, in the shopper's own terms */}
        <div
          className="rounded-xl p-2.5 border"
          style={{ borderColor: `${communityColor}33`, backgroundColor: `${communityColor}0A` }}
        >
          <p className="text-[11px] text-text-secondary leading-relaxed">
            {nextBenefit && nextPrice !== null ? (
              <>
                {unitsToNext} more {unitsToNext === 1 ? 'unit' : 'units'} and everyone pays{' '}
                <span className="font-bold tabular-nums">{formatINR(nextPrice)}</span> — unlocks{' '}
                {nextBenefit}.
              </>
            ) : (
              <>
                Every step is unlocked. This is the lowest price {communityName} can offer.
              </>
            )}
          </p>
        </div>
      </div>

      {/* What belonging to the community gets you */}
      {community && (
        <div className="pt-3 border-t border-surface-border space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-bold text-text-primary truncate">
                {isMember ? 'Your community benefits' : `What ${communityName} gives you`}
              </div>
              <div className="text-[11px] text-text-muted">
                {formatNumber(community.memberCount)} members ·{' '}
                {community.memberDiscountPct}% member pricing
              </div>
            </div>
            <span
              className="text-[11px] font-bold px-2 py-1 rounded-full shrink-0"
              style={{ color: communityColor, backgroundColor: `${communityColor}15` }}
            >
              {community.promoCode}
            </span>
          </div>

          <details className="group/perks">
            <summary
              className="flex items-center gap-1 text-[11px] font-semibold text-text-muted cursor-pointer list-none hover:text-text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              {community.perks.length} benefits of joining
              <ChevronDown className="h-3 w-3 transition-transform group-open/perks:rotate-180" />
            </summary>
            <ul className="mt-2 space-y-1.5">
              {community.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-1.5 text-[11px] text-text-secondary">
                  <Check
                    className="h-3 w-3 mt-0.5 shrink-0"
                    style={{ color: communityColor }}
                  />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </details>

          {showSpendTier && (
            <SpendTierMeter
              color={communityColor}
              myUnits={myCommunityUnits}
              spendTier={spendTier}
              nextSpendTier={nextSpendTier}
              unitsToNext={spendUnitsToNext}
            />
          )}

          {showJoinCta && (
            <>
              <p className="text-[11px] text-text-muted">
                {isYouIn ? (
                  <>
                    You bought this, so{' '}
                    <span className="font-semibold text-text-secondary">
                      {communityName} is open to you
                    </span>{' '}
                    now. Member pricing on every {communityName} drop.
                  </>
                ) : (
                  <>
                    Join {communityName} and this drops to{' '}
                    <span className="font-bold text-text-primary tabular-nums">
                      {formatINR(joinPrice)}
                    </span>
                    {joinSaves > 0 && ` — you save ${formatINR(joinSaves)} more`}
                  </>
                )}
              </p>
              <Link
                to={`/communities/${communitySlug}`}
                className="w-full h-11 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 hover:brightness-110 active:scale-[0.98]"
                style={{ color: communityColor, borderColor: `${communityColor}59`, backgroundColor: `${communityColor}0F` }}
              >
                <Lock className="h-3.5 w-3.5 shrink-0" />
                Join {communityName}
              </Link>
            </>
          )}

          {isMember && (
            <p className="flex items-center gap-1.5 text-[11px] text-emerald-500">
              <Sparkles className="h-3 w-3 shrink-0" />
              Code {community.promoCode} is active on every drop
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export const GroupBuyPanel: React.FC<GroupBuyPanelProps> = ({
  product,
  className,
}) => {
  const groupBuy = useGroupBuy(product);
  if (!groupBuy) return null;
  return <PanelBody groupBuy={groupBuy} className={className} />;
};
