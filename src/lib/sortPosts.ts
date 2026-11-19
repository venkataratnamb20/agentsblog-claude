export interface DatedPost {
  date: Date;
}

/** Return a new array ordered newest first. Stable for equal dates. O(n log n). */
export function sortPostsByDateDesc<T extends DatedPost>(posts: readonly T[]): T[] {
  return [...posts].sort((a, b) => b.date.getTime() - a.date.getTime());
}
