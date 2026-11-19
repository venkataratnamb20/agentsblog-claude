const WORDS_PER_MINUTE = 220;

/** Estimated reading time in whole minutes (minimum 1). O(n) in text length. */
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
