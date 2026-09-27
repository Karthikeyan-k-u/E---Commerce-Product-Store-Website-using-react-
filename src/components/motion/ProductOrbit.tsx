import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ProductOrbitProps {
  children?: React.ReactNode;
  radius?: number;
  duration?: number;
  showRings?: boolean;
  className?: string;
}

export const ProductOrbit: React.FC<ProductOrbitProps> = ({
  children,
  radius = 180,
  duration = 24,
  showRings = true,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Orbital Glowing Rings */}
      {showRings && (
        <>
          <div
            style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
            className="absolute rounded-full border border-indigo-500/20 dark:border-indigo-400/15 pointer-events-none"
          />
          <div
            style={{ width: `${radius * 2.6}px`, height: `${radius * 2.6}px` }}
            className="absolute rounded-full border border-cyan-500/15 dark:border-cyan-400/10 pointer-events-none border-dashed"
          />
        </>
      )}

      {/* Orbiting Satellite Particle 1 */}
      {!shouldReduceMotion && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration, repeat: Infinity, ease: 'linear' }}
          style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
          className="absolute pointer-events-none flex items-start justify-center"
        >
          <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-glow-sm -mt-1.5 animate-pulse-glow" />
        </motion.div>
      )}

      {/* Orbiting Satellite Particle 2 (Reverse) */}
      {!shouldReduceMotion && (
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: duration * 1.4, repeat: Infinity, ease: 'linear' }}
          style={{ width: `${radius * 2.6}px`, height: `${radius * 2.6}px` }}
          className="absolute pointer-events-none flex items-end justify-center"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow-cyan -mb-1.5 opacity-80" />
        </motion.div>
      )}

      {children}
    </div>
  );
};
