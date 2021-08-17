export type FilterEntries = Record<string, { text: string }>;

export function getFilters(entries: FilterEntries) {
  return Object.entries(entries).map((value) => ({
    text: value[1].text,
    value: value[0]
  }));
}
