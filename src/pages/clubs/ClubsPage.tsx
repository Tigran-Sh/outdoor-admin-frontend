import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Avatar from "@/components/ui/Avatar/Avatar";
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
import { listAdminClubs } from "@/services/clubs.api";
import {
  CLUB_VERIFICATION_BADGE_VARIANT,
  ENTITY_TYPES,
  entityTypeToApi,
  getClubVerificationStatus,
  regionToApi,
  type Club,
  type ClubOrderingField,
} from "@/types/club";

const PAGE_SIZE = 20;

type VerifiedFilter = "" | "true" | "false";

function ClubsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [identityVerifiedFilter, setIdentityVerifiedFilter] = useState<VerifiedFilter>("");
  const [ordering, setOrdering] = useState("-created_at");

  const search = useDebouncedValue(searchInput, 400);

  const filterKey = `${search}|${entityTypeFilter}|${regionFilter}|${identityVerifiedFilter}|${ordering}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const clubsQuery = useQuery({
    queryKey: [
      "admin-clubs",
      { page, search, entityTypeFilter, regionFilter, identityVerifiedFilter, ordering },
    ],
    queryFn: () =>
      listAdminClubs({
        page,
        page_size: PAGE_SIZE,
        search: search || undefined,
        entity_type: entityTypeFilter ? entityTypeToApi(entityTypeFilter) : undefined,
        base_region: regionFilter ? regionToApi(regionFilter) : undefined,
        identity_verified:
          identityVerifiedFilter === "" ? undefined : identityVerifiedFilter === "true",
        ordering,
      }),
  });

  function toggleOrdering(field: ClubOrderingField) {
    setOrdering((prev) => (prev === field ? `-${field}` : field));
  }

  function sortIcon(field: ClubOrderingField) {
    if (ordering === field) return "ri-arrow-up-line";
    if (ordering === `-${field}`) return "ri-arrow-down-line";
    return "ri-expand-up-down-line text-muted";
  }

  function sortableHeader(field: ClubOrderingField, label: string) {
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

  const columns: TableColumn<Club>[] = [
    {
      key: "name",
      header: sortableHeader("name", t("clubs.table.name")),
      render: (row) => (
        <Link
          to={`/admin/clubs/${row.id}`}
          className="d-flex align-items-center gap-2"
        >
          <Avatar src={row.logo ?? undefined} name={row.name} size="xs" />
          <span className="fw-medium">{row.name}</span>
        </Link>
      ),
    },
    {
      key: "activityTypes",
      header: t("clubs.table.activityTypes"),
      render: (row) => (
        <div className="d-flex flex-wrap gap-1">
          {row.activityTypeIds.map((activityTypeId) => {
            const activityType = ACTIVITY_TYPES.find(
              (item) => item.id === activityTypeId,
            );
            if (!activityType) return null;

            return (
              <Badge
                key={activityTypeId}
                variant={activityType.variant}
                appearance="subtle"
                pill
              >
                <i
                  className={`${activityType.icon} align-middle me-1`}
                  aria-hidden="true"
                />
                {t(`activityTypes.${activityTypeId}`)}
              </Badge>
            );
          })}
        </div>
      ),
    },
    {
      key: "baseRegion",
      header: t("clubs.table.baseRegion"),
      render: (row) => (row.baseRegion ? t(`regions.${row.baseRegion}`) : "–"),
    },
    { key: "email", header: t("clubs.table.email"), render: (row) => row.email || "–" },
    {
      key: "status",
      header: t("clubs.table.status"),
      render: (row) => {
        const status = getClubVerificationStatus(row);
        return (
          <Badge
            variant={CLUB_VERIFICATION_BADGE_VARIANT[status]}
            appearance="subtle"
            pill
          >
            {t(`clubs.status.${status}`)}
          </Badge>
        );
      },
    },
  ];

  const clubs = clubsQuery.data?.results ?? [];
  const totalCount = clubsQuery.data?.count ?? 0;

  return (
    <>
      <Breadcrumbs title={t("sidebar.clubs")} />

      <Card>
        <CardHeader
          title={t("sidebar.clubs")}
          actions={
            <Button
              variant="primary"
              leftIcon={<i className="ri-add-line align-bottom" />}
              onClick={() => navigate("/admin/clubs/create")}
            >
              {t("clubs.createClub")}
            </Button>
          }
        />

        <CardBody>
          <div className="d-flex flex-wrap align-items-start gap-2 mb-4">
            <div className="search-box" style={{ maxWidth: 260 }}>
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={t("clubs.filters.searchPlaceholder")}
                aria-label={t("clubs.filters.searchPlaceholder")}
                containerClassName="mb-0"
              />
              <i className="ri-search-line search-icon" aria-hidden="true" />
            </div>

            <Select
              value={entityTypeFilter}
              onChange={(event) => setEntityTypeFilter(event.target.value)}
              containerClassName="mb-0"
              style={{ maxWidth: 200 }}
              aria-label={t("clubs.filters.allEntityTypes")}
            >
              <option value="">{t("clubs.filters.allEntityTypes")}</option>
              {ENTITY_TYPES.map((entityType) => (
                <option key={entityType} value={entityType}>
                  {t(`clubs.entityTypes.${entityType}`)}
                </option>
              ))}
            </Select>

            <Select
              value={regionFilter}
              onChange={(event) => setRegionFilter(event.target.value)}
              containerClassName="mb-0"
              style={{ maxWidth: 200 }}
              aria-label={t("clubs.filters.allRegions")}
            >
              <option value="">{t("clubs.filters.allRegions")}</option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {t(`regions.${region}`)}
                </option>
              ))}
            </Select>

            <Select
              value={identityVerifiedFilter}
              onChange={(event) =>
                setIdentityVerifiedFilter(event.target.value as VerifiedFilter)
              }
              containerClassName="mb-0"
              style={{ maxWidth: 200 }}
              aria-label={t("clubs.filters.allVerification")}
            >
              <option value="">{t("clubs.filters.allVerification")}</option>
              <option value="true">{t("clubs.status.identityVerified")}</option>
              <option value="false">{t("clubs.status.pending")}</option>
            </Select>
          </div>

          {clubsQuery.isError ? (
            <div className="alert alert-danger d-flex align-items-center justify-content-between">
              <span>{t("common.loadError")}</span>
              <Button
                variant="danger"
                appearance="outline"
                size="sm"
                onClick={() => clubsQuery.refetch()}
              >
                {t("common.retry")}
              </Button>
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={clubs}
                getRowKey={(row) => row.id}
                emptyMessage={t("clubs.empty")}
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

export default ClubsPage;
