import { useTranslation } from "react-i18next";

import type { PaginationProps } from "./Pagination.types";

function joinClassNames(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function Pagination({ page, pageSize, totalCount, onPageChange, className }: PaginationProps) {
  const { t } = useTranslation();

  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  if (pageCount <= 1) return null;

  const fromRow = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const toRow = Math.min(page * pageSize, totalCount);
  const pageOptions = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div
      className={joinClassNames(
        "d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 mt-3",
        className,
      )}
    >
      <div className="text-muted">
        {t("common.table.showing", { from: fromRow, to: toRow, total: totalCount })}
      </div>

      <ul className="pagination pagination-separated mb-0">
        <li className={joinClassNames("page-item", page <= 1 && "disabled")}>
          <button
            type="button"
            className="page-link"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            {t("common.table.previous")}
          </button>
        </li>

        {pageOptions.map((option) => (
          <li key={option} className={joinClassNames("page-item", page === option && "active")}>
            <button type="button" className="page-link" onClick={() => onPageChange(option)}>
              {option}
            </button>
          </li>
        ))}

        <li className={joinClassNames("page-item", page >= pageCount && "disabled")}>
          <button
            type="button"
            className="page-link"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            {t("common.table.next")}
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Pagination;
