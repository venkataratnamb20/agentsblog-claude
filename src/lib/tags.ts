/** Normalise post tags: trim, lowercase, hyphenate inner spaces, drop empties and duplicates. */
export function normalizeTags(tags: readonly string[]): string[] {
  const seen = new Set<string>();
  for (const tag of tags) {
    const clean = tag.trim().toLowerCase().replace(/\s+/g, '-');
    if (clean) seen.add(clean);
  }
  return [...seen];
}
