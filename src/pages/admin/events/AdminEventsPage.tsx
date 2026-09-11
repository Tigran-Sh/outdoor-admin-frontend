import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card/Card";
import Input from "@/components/ui/Input/Input";
import Pagination from "@/components/ui/Pagination/Pagination";
import Select from "@/components/ui/Select/Select";
import Table from "@/components/ui/Table/Table";
import type { TableColumn } from "@/components/ui/Table/Table.types";

import { ACTIVITY_TYPES } from "@/constants/activityTypes";
import { REGIONS } from "@/constants/regions";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { listEvents } from "@/services/events.api";
import { regionToApi } from "@/types/club";
import {
  EVENT_STATUSES,
  EVENT_STATUS_BADGE_VARIANT,
  type AdminEventOrderingField,
  type Event,
} from "@/types/event";

const PAGE_SIZE = 20;

function formatPrice(row: Event, t: (key: string) => string): string {
  if (!row.priceType) return "–";
  if (row.priceType === "free") return t("events.priceTypes.free");
  if (!row.price) return "–";
  return `${Number(row.price).toLocaleString()} ֏`;
}

function AdminEventsPage() {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [clubNameInput, setClubNameInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [ordering, setOrdering] = useState("-start_at");

  const clubName = useDebouncedValue(clubNameInput, 400);
  const search = useDebouncedValue(searchInput, 400);

  const hasActiveFilters = Boolean(clubName || search || statusFilter || regionFilter);

  const filterKey = `${clubName}|${search}|${statusFilter}|${regionFilter}|${ordering}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  function clearFilters() {
    setClubNameInput("");
    setSearchInput("");
    setStatusFilter("");
    setRegionFilter("");
  }

  const eventsQuery = useQuery({
    queryKey: [
      "admin-events",
      { page, clubName, search, statusFilter, regionFilter, ordering },
    ],
    queryFn: () =>
      listEvents({
        page,
        page_size: PAGE_SIZE,
        club_name: clubName || undefined,
        search: search || undefined,
        status: statusFilter || undefined,
        region: regionFilter ? regionToApi(regionFilter) : undefined,
        ordering,
      }),
  });

  function toggleOrdering(field: AdminEventOrderingField) {
    setOrdering((prev) => (prev === field ? `-${field}` : field));
  }

  function sortIcon(field: AdminEventOrderingField) {
    if (ordering === field) return "ri-arrow-up-line";
    if (ordering === `-${field}`) return "ri-arrow-down-line";
    return "ri-expand-up-down-line text-muted";
  }

  function sortableHeader(field: AdminEventOrderingField, label: string) {
    return (
      <button
        type="button"
        className="btn btn-link p-0 text-reset text-decoration-none d-inline-flex align-items-center gap-1"
        onClick={() => toggleOrdering(field)}
      >
        {label}
        <i className={sortIcon(field)} aria-hidden="true" />
      </button>
    );
  }

  const columns: TableColumn<Event>[] = [
    {
      key: "coverImage",
      header: "",
      render: (row) =>
        row.coverImage ? (
          <img
            src={row.coverImage}
            alt=""
            className="rounded"
            style={{ width: 44, height: 44, objectFit: "cover" }}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center rounded bg-light text-muted"
            style={{ width: 44, height: 44 }}
          >
            <i className="ri-image-line" aria-hidden="true" />
          </div>
        ),
    },
    {
      key: "title",
      header: sortableHeader("title", t("events.table.name")),
      render: (row) => (
        <Link to={`/admin/events/${row.id}`} className="fw-medium">
          {row.title || t("events.view.notSpecified")}
        </Link>
      ),
    },
    {
      key: "clubName",
      header: sortableHeader("club__name", t("events.table.club")),
      render: (row) => row.clubName || "–",
    },
    {
      key: "status",
      header: t("events.table.status"),
      render: (row) => (
        <Badge variant={EVENT_STATUS_BADGE_VARIANT[row.status]} appearance="subtle">
          {t(`events.status.${row.status}`)}
        </Badge>
      ),
    },
    {
      key: "category",
      header: t("events.table.category"),
      render: (row) => {
        const category = ACTIVITY_TYPES.find((item) => item.id === row.category);
        if (!category) return "–";

        return (
          <Badge variant={category.variant} appearance="subtle">
            {t(`activityTypes.${row.category}`)}
          </Badge>
        );
      },
    },
    {
      key: "date",
      header: sortableHeader("start_at", t("events.table.date")),
      render: (row) =>
        row.startAt
          ? new Date(row.startAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "–",
    },
    {
      key: "difficulty",
      header: t("events.table.difficulty"),
      render: (row) =>
        row.difficulty ? (
          <Badge variant="warning" appearance="subtle">
            {t(`events.difficulties.${row.difficulty}`)}
          </Badge>
        ) : (
          "–"
        ),
    },
    {
      key: "guide",
      header: t("events.table.guide"),
      render: (row) => row.guideName || "–",
    },
    {
      key: "price",
      header: t("events.table.price"),
      render: (row) => formatPrice(row, t),
    },
  ];

  const events = eventsQuery.data?.results ?? [];
  const totalCount = eventsQuery.data?.count ?? 0;

  return (
    <>
      <Breadcrumbs title={t("sidebar.eventsModeration")} />

      <Card>
        <CardHeader title={t("sidebar.eventsModeration")} />

        <CardBody>
          <div className="d-flex flex-wrap align-items-start gap-2 mb-4">
            <div className="search-box" style={{ maxWidth: 220 }}>
              <Input
                value={clubNameInput}
                onChange={(event) => setClubNameInput(event.target.value)}
                placeholder={t("events.admin.filters.clubNamePlaceholder")}
                aria-label={t("events.admin.filters.clubNamePlaceholder")}
                containerClassName="mb-0"
              />
              <i className="ri-building-line search-icon" aria-hidden="true" />
            </div>

            <div className="search-box" style={{ maxWidth: 260 }}>
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={t("events.admin.filters.searchPlaceholder")}
                aria-label={t("events.admin.filters.searchPlaceholder")}
                containerClassName="mb-0"
              />
              <i className="ri-search-line search-icon" aria-hidden="true" />
            </div>

            <Select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              containerClassName="mb-0"
              style={{ maxWidth: 180 }}
              aria-label={t("events.filters.allStatuses")}
            >
              <option value="">{t("events.filters.allStatuses")}</option>
              {EVENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {t(`events.status.${status}`)}
                </option>
              ))}
            </Select>

            <Select
              value={regionFilter}
              onChange={(event) => setRegionFilter(event.target.value)}
              containerClassName="mb-0"
              style={{ maxWidth: 180 }}
              aria-label={t("events.filters.allRegions")}
            >
              <option value="">{t("events.filters.allRegions")}</option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {t(`regions.${region}`)}
                </option>
              ))}
            </Select>

            {hasActiveFilters && (
              <Button variant="secondary" appearance="ghost" size="sm" onClick={clearFilters}>
                {t("events.admin.clearFilters")}
              </Button>
            )}
          </div>

          {eventsQuery.isError ? (
            <div className="alert alert-danger d-flex align-items-center justify-content-between">
              <span>{t("common.loadError")}</span>
              <Button
                variant="danger"
                appearance="outline"
                size="sm"
                onClick={() => eventsQuery.refetch()}
              >
                {t("common.retry")}
              </Button>
            </div>
          ) : totalCount === 0 && !eventsQuery.isLoading ? (
            <div className="text-center text-muted py-5">
              <p className="mb-3">
                {hasActiveFilters ? t("events.admin.emptyFiltered") : t("events.admin.empty")}
              </p>
              {hasActiveFilters && (
                <Button variant="primary" appearance="outline" size="sm" onClick={clearFilters}>
                  {t("events.admin.clearFilters")}
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={events}
                getRowKey={(row) => row.id}
                emptyMessage={t("events.admin.empty")}
                card
                className="bg-light"
              />

              <Pagination
                page={page}
                pageSize={PAGE_SIZE}
                totalCount={totalCount}
                onPageChange={setPage}
              />
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default AdminEventsPage;
