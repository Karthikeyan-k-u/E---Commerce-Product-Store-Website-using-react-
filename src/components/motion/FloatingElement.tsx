import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface FloatingElementProps {
  children: React.ReactNode;
  duration?: number;
  distance?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  rotate?: number;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  duration = 6,
  distance = 14,
  delay = 0,
  direction = 'up',
  className = '',
  rotate = 0,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getAnimateValues = () => {
    switch (direction) {
      case 'up':
        return {
          y: [0, -distance, 0],
          rotate: rotate !== 0 ? [0, rotate, 0] : undefined,
        };
      case 'down':
        return {
          y: [0, distance, 0],
          rotate: rotate !== 0 ? [0, -rotate, 0] : undefined,
        };
      case 'left':
        return {
          x: [0, -distance, 0],
        };
      case 'right':
        return {
          x: [0, distance, 0],
        };
    }
  };

  return (
    <motion.div
      className={className}
      animate={getAnimateValues()}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};
