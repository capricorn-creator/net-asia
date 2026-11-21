/** Deterministic (UTC, en-US) so server and client render the same text. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso));
}