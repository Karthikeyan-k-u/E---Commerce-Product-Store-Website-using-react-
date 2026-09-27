import React from 'react';
import { FloatingElement } from '../motion/FloatingElement';
import { Button } from './Button';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 ${className}`}>
      <FloatingElement distance={10} duration={5} className="mb-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-glow">
          {icon || <Sparkles className="w-9 h-9" />}
        </div>
      </FloatingElement>
      <h3 className="text-xl font-bold text-text-primary mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
