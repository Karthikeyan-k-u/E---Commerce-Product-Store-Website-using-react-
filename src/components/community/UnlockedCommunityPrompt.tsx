import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import { useUnlockedCommunities } from '../../hooks/useUnlockedCommunities';
import { useCommunityStore } from '../../store/communityStore';
import { unitLabel } from '../../lib/groupBuy';

interface UnlockedCommunityPromptProps {
  className?: string;
}

/**
 * Buying is what earns the join. Shown after checkout, one row per community the
 * visitor has bought from but not joined, with a dismiss so it stops repeating
 * on later visits.
 */
export const UnlockedCommunityPrompt: React.FC<UnlockedCommunityPromptProps> = ({ className }) => {
  const unlocked = useUnlockedCommunities();
  const { join, dismissUnlock } = useCommunityStore();
  const navigate = useNavigate();

  if (unlocked.length === 0) return null;

  const handleJoin = (slug: string) => {
    join(slug);
    navigate(`/communities/${slug}`);
  };

  return (
    <section className={className} aria-label="Communities you unlocked">
      <h2 className="text-sm font-bold text-text-primary mb-3">
        Buying here unlocked {unlocked.length === 1 ? 'a community' : 'communities'}
      </h2>

      <ul className="space-y-3">
        {unlocked.map(({ community, myUnits, spendTier }) => (
          <li
            key={community.slug}
            className="p-4 rounded-2xl bg-surface border flex flex-col sm:flex-row sm:items-center gap-4"
            style={{ borderColor: `${community.color}33` }}
          >
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: community.color }}
              aria-hidden="true"
            >
              {initials(community.name)}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-text-primary">{community.name}</span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ color: community.color, backgroundColor: `${community.color}15` }}
                >
                  {community.category}
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                You bought {unitLabel(myUnits)} here
                {spendTier ? ` · already ${spendTier.name}` : ''}. Joining adds{' '}
                {community.perks.length} benefits and unlocks {community.memberDiscountPct}% member
                pricing on all {community.dropProductIds.length} drops.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => dismissUnlock(community.slug)}
                aria-label={`Dismiss ${community.name} invitation`}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleJoin(community.slug)}
                className="h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 text-white transition-all hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                style={{ backgroundColor: community.color }}
              >
                <Check className="w-3.5 h-3.5" />
                Join {community.name}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

const initials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.slice(0, 2);
};
