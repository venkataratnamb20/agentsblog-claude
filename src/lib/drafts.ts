export interface DraftAware {
  data: { draft: boolean };
}

/** Published entries only, unless previewing drafts. */
export function filterVisible<T extends DraftAware>(
  entries: readonly T[],
  includeDrafts: boolean,
): T[] {
  return entries.filter((entry) => includeDrafts || !entry.data.draft);
}
