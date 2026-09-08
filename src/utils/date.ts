/** Formats a `Date` as a `YYYY-MM-DD` string, matching `<input type="date">`'s value format. */
export function formatDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Today's date as a `YYYY-MM-DD` string. */
export function getTodayDateString(): string {
  return formatDateInputValue(new Date());
}

/** The date `years` years ago from today, as a `YYYY-MM-DD` string. */
export function getDateStringYearsAgo(years: number): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return formatDateInputValue(date);
}
