import type { ReactNode } from "react";

export interface TableColumn<T> {
  /** Unique key for the column, also used as the React key for its cells. */
  key: string;
  /** Column header content. */
  header: ReactNode;
  /** Renders a cell's content. Falls back to `String(row[key])` when omitted. */
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  /** Enables click-to-sort on this column's header. */
  sortable?: boolean;
  /**
   * Returns the raw value used for sorting and searching. Defaults to `row[key]`.
   * Required whenever `key` isn't a direct property of `T`, or `render` displays
   * something other than the raw value (e.g. a badge, a formatted date).
   */
  accessor?: (row: T) => string | number | null | undefined;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  /** Returns a stable, unique key for a row. */
  getRowKey: (row: T, index: number) => string | number;
  /** Content shown in place of rows when `data` is empty. */
  emptyMessage?: ReactNode;
  /** Wraps the table in a horizontally-scrollable `.table-responsive` container. Defaults to `true`. */
  responsive?: boolean;
  /** Adds `.table-card` spacing so the table bleeds to the edges of a surrounding `Card`. */
  card?: boolean;
  /** Shows a global search box above the table, matching against every column's value. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Enables client-side pagination with this many rows per page. Omit to disable pagination. */
  pageSize?: number;
  className?: string;
}
