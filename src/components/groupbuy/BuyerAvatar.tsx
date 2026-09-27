import React from 'react';
import { avatarColorFrom, initialsOf } from '../../lib/groupBuy';
import { cn } from '../../lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md';

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-xs',
};

interface BuyerAvatarProps {
  name: string;
  size?: AvatarSize;
  className?: string;
}

/** Initials avatar. No photo assets exist in the project, so identity is derived. */
export const BuyerAvatar: React.FC<BuyerAvatarProps> = ({
  name,
  size = 'sm',
  className,
}) => (
  <span
    className={cn(
      'inline-flex items-center justify-center rounded-full font-bold text-white shrink-0 select-none ring-2 ring-white/85 dark:ring-[#1e293b]',
      SIZE_CLASSES[size],
      className
    )}
    style={{ backgroundColor: avatarColorFrom(name) }}
    title={name}
    aria-hidden="true"
  >
    {initialsOf(name)}
  </span>
);
