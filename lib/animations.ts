import type { Transition, Variants } from 'motion/react';

/**
 * Spring transition presets for consistent animation feel.
 *
 * - gentle: Most UI transitions (cards, sections, content)
 * - snappy: Buttons, chips, toggles, interactive elements
 * - soft: Panels, sheets, overlays, large surfaces
 */
export const springs = {
  gentle: { type: 'spring', stiffness: 120, damping: 20 } as Transition,
  snappy: { type: 'spring', stiffness: 300, damping: 25 } as Transition,
  soft: { type: 'spring', stiffness: 80, damping: 18 } as Transition,
} as const;

/** Fade up from below -- general content entrance */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
};

/** Simple fade in -- subtle appearance */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: springs.gentle },
};

/** Scale in with slight zoom -- interactive elements */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: springs.snappy },
};

/** Slide up from further below -- panels, sheets */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: springs.soft },
};

/** Common exit animation -- quick upward fade */
export const exitVariant = {
  opacity: 0,
  y: -8,
  transition: springs.snappy,
};

/**
 * Stagger children entrance animation.
 * Wrap parent with this variant and children with any entrance variant.
 *
 * @param staggerMs - Delay between each child in seconds (default: 0.05)
 */
export const staggerChildren = (staggerMs = 0.05): Variants => ({
  visible: { transition: { staggerChildren: staggerMs } },
});
