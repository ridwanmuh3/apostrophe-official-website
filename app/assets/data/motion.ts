/**
 * Motion tokens for the Nocturne editorial system.
 * Durations are in seconds; eases are GSAP ease strings.
 */
export const durations = {
  micro: 0.3,
  standard: 0.7,
  slow: 0.9,
  hero: 1.2,
} as const;

export const eases = {
  out: "power3.out",
  expo: "expo.out",
  inOut: "power2.inOut",
} as const;

export const stagger = {
  tight: 0.06,
  base: 0.09,
  loose: 0.12,
} as const;

export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
export const finePointerQuery = "(pointer: fine)";
