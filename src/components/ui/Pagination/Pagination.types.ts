export interface PaginationProps {
  /** 1-indexed current page. */
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}
