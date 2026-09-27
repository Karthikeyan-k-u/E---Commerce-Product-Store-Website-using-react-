import React from 'react';
import { Users } from 'lucide-react';
import { useFriendsInCommunity } from '../../hooks/useFriendsInCommunity';
import { contactsInLabel } from '../../data/friends';
import { avatarColorFrom, initialsOf, peopleLabel, unitLabel } from '../../lib/groupBuy';
import { cn } from '../../lib/utils';

interface FriendsInCommunityProps {
  communitySlug: string;
  communityName: string;
  color: string;
  className?: string;
}

/**
 * "N of your contacts are in <community>". Product detail page only, never the
 * cards: the cards answer who else is buying, this answers who in your own life
 * already made the move. Renders nothing at zero, because "0 contacts" is a
 * real answer and a row of empty space is worse than saying nothing.
 */
export const FriendsInCommunity: React.FC<FriendsInCommunityProps> = ({
  communitySlug,
  communityName,
  color,
  className,
}) => {
  const friends = useFriendsInCommunity(communitySlug);

  if (friends.length === 0) return null;

  return (
    <div
      className={cn('p-4 rounded-2xl bg-surface border border-surface-border', className)}
      aria-label="Your contacts in this community"
    >
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2 shrink-0">
          {friends.map((friend) => (
            <span
              key={friend.id}
              title={`${friend.name} · ${unitLabel(friend.units)}`}
              className="w-7 h-7 rounded-full ring-2 ring-surface flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: avatarColorFrom(friend.id) }}
            >
              {initialsOf(friend.name)}
            </span>
          ))}
        </div>

        <div className="min-w-0">
          <p className="flex items-center gap-1 text-xs font-semibold text-text-primary">
            <Users className="w-3 h-3 shrink-0" style={{ color }} />
            {contactsInLabel(friends.length, communityName)}
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            {peopleLabel(friends.reduce((sum, friend) => sum + friend.units, 0))} bought here before you.
          </p>
        </div>
      </div>
    </div>
  );
};
