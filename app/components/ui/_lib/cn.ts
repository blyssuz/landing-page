/**
 * Merge class names, filtering out falsy values.
 * Simple utility -- no tailwind-merge needed for this project's component complexity.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
