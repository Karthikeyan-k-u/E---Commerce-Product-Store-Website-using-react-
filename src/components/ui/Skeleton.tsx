import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-slate-200/70 dark:bg-slate-800/70',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite]',
        'after:bg-gradient-to-r after:from-transparent after:via-white/20 dark:after:via-white/5 after:to-transparent',
        className
      )}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-surface-border p-4 bg-surface space-y-3">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-3 w-1/3 rounded-md" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
