import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'outline' | 'glow';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
    accent: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    outline: 'bg-transparent text-text-secondary border-slate-300 dark:border-slate-700',
    glow: 'bg-indigo-600/15 text-indigo-400 border-indigo-500/30 shadow-glow-sm',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] font-medium rounded-full',
    md: 'px-2.5 py-1 text-xs font-medium rounded-full',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center border transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
