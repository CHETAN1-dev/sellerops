import type { Variants } from "framer-motion";

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1], // ✅ easeOut-like curve
    },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
};

export const screenVariants: Variants = {
  initial: {
    opacity: 0,
    x: 40,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1],
    },
  },
};
