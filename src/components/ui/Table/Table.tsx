import { useMemo, useState } from "react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import type { TableColumn, TableProps } from "./Table.types";

function joinClassNames(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function getColumnValue<T>(
  column: TableColumn<T>,
  row: T,
): string | number | null | undefined {
  if (column.accessor) return column.accessor(row);
  return (row as Record<string, unknown>)[column.key] as
    string | number | null | undefined;
}

function Table<T>({
  columns,
  data,
  getRowKey,
  emptyMessage,
  responsive = true,
  card = false,
  searchable = false,
  searchPlaceholder,
  pageSize,
  className,
}: TableProps<T>) {
  const { t } = useTranslation();
  const [globalSearch, setGlobalSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    if (!searchable || !globalSearch.trim()) return data;

    const query = globalSearch.trim().toLowerCase();
    return data.filter((row) =>
      columns.some((column) => {
        const value = getColumnValue(column, row);
        return value != null && String(value).toLowerCase().includes(query);
      }),
    );
  }, [data, columns, searchable, globalSearch]);

  const columnDefs = useMemo<ColumnDef<T, unknown>[]>(
    () =>
      columns.map((column) => ({
        id: column.key,
        header: () => column.header,
        accessorFn: (row: T) => getColumnValue(column, row),
        cell: (info) =>
          column.render
            ? column.render(info.row.original, info.row.index)
            : String(info.getValue() ?? ""),
        enableSorting: Boolean(column.sortable),
      })),
    [columns],
  );

  const table = useReactTable<T>({
    data: filteredData,
    columns: columnDefs,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: pageSize ?? Number.MAX_SAFE_INTEGER },
    },
  });

  const rows = table.getRowModel().rows;
  const columnByKey = new Map(columns.map((column) => [column.key, column]));

  const tableElement = (
    <table
      className={joinClassNames(
        "table align-middle table-nowrap mb-0",
        className,
      )}
    >
      <thead className="table-light text-muted text-uppercase">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const column = columnByKey.get(header.column.id);
              const canSort = header.column.getCanSort();
              const sortDirection = header.column.getIsSorted();

              return (
                <th
                  key={header.id}
                  scope="col"
                  className={column?.headerClassName}
                  style={canSort ? { cursor: "pointer" } : undefined}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <span className="d-inline-flex align-items-center gap-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {canSort && (
                      <i
                        className={
                          sortDirection === "asc"
                            ? "ri-arrow-up-line"
                            : sortDirection === "desc"
                              ? "ri-arrow-down-line"
                              : "ri-expand-up-down-line text-muted"
                        }
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>

      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="text-center text-muted py-4"
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={getRowKey(row.original, row.index)}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={columnByKey.get(cell.column.id)?.className}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  const pageCount = table.getPageCount();
  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination;
  const fromRow = rows.length === 0 ? 0 : pageIndex * currentPageSize + 1;
  const toRow = Math.min(
    (pageIndex + 1) * currentPageSize,
    filteredData.length,
  );

  return (
    <div>
      {searchable && (
        <div
          className="search-box"
          style={{ maxWidth: 300, marginBottom: "32px" }}
        >
          <input
            type="search"
            className="form-control"
            value={globalSearch}
            placeholder={
              searchPlaceholder ?? t("common.table.searchPlaceholder")
            }
            aria-label={
              searchPlaceholder ?? t("common.table.searchPlaceholder")
            }
            onChange={(event) => {
              setGlobalSearch(event.target.value);
              table.setPageIndex(0);
            }}
          />
          <i className="ri-search-line search-icon" aria-hidden="true" />
        </div>
      )}

      {responsive ? (
        <div
          className={joinClassNames("table-responsive", card && "table-card")}
        >
          {tableElement}
        </div>
      ) : (
        tableElement
      )}

      {pageSize !== undefined && pageCount > 1 && (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 mt-3">
          <div className="text-muted">
            {t("common.table.showing", {
              from: fromRow,
              to: toRow,
              total: filteredData.length,
            })}
          </div>

          <ul className="pagination pagination-separated mb-0">
            <li
              className={joinClassNames(
                "page-item",
                !table.getCanPreviousPage() && "disabled",
              )}
            >
              <button
                type="button"
                className="page-link"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                {t("common.table.previous")}
              </button>
            </li>

            {table.getPageOptions().map((option) => (
              <li
                key={option}
                className={joinClassNames(
                  "page-item",
                  pageIndex === option && "active",
                )}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() => table.setPageIndex(option)}
                >
                  {option + 1}
                </button>
              </li>
            ))}

            <li
              className={joinClassNames(
                "page-item",
                !table.getCanNextPage() && "disabled",
              )}
            >
              <button
                type="button"
                className="page-link"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                {t("common.table.next")}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Table;
