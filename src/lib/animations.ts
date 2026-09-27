import { Variants, Transition } from 'framer-motion';

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
};

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 18,
};

export const easeOutSmooth: Transition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1],
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: easeOutSmooth },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: springGentle },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

export const fadeDown: Variants = {
  initial: { opacity: 0, y: -24 },
  animate: { opacity: 1, y: 0, transition: springGentle },
  exit: { opacity: 0, y: 16, transition: { duration: 0.2 } },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: springSnappy },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0.05): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const drawerSlideRight: Variants = {
  initial: { x: '100%' },
  animate: { x: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } },
  exit: { x: '100%', transition: { ease: 'easeInOut', duration: 0.25 } },
};

export const drawerSlideBottom: Variants = {
  initial: { y: '100%' },
  animate: { y: 0, transition: { type: 'spring', damping: 28, stiffness: 280 } },
  exit: { y: '100%', transition: { ease: 'easeInOut', duration: 0.25 } },
};

export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.94, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0, transition: springGentle },
  exit: { opacity: 0, scale: 0.96, y: 12, transition: { duration: 0.18 } },
};
