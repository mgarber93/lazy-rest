

export function newestToOldest(a: string, b: string) {
  const aDate = new Date(a);
  const bDate = new Date(b);
  return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
}