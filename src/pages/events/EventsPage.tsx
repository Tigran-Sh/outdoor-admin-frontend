import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import Input from "@/components/ui/Input/Input";
import Pagination from "@/components/ui/Pagination/Pagination";
import Radio from "@/components/ui/Radio/Radio";
import RowActionsMenu from "@/components/ui/RowActionsMenu/RowActionsMenu";
import Select from "@/components/ui/Select/Select";
import Table from "@/components/ui/Table/Table";
import type { TableColumn } from "@/components/ui/Table/Table.types";
import Textarea from "@/components/ui/Textarea/Textarea";

import { useAuth } from "@/app/providers/useAuth";
import { ACTIVITY_TYPES } from "@/constants/activityTypes";
import { REGIONS } from "@/constants/regions";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cancelEvent, deleteEvent, listEvents, publishEvent } from "@/services/events.api";
import { ApiError } from "@/types/apiError";
import { activityTypeToApi, regionToApi } from "@/types/club";
import {
  CANCEL_REASON_OTHER_MAX_LENGTH,
  EVENT_CANCELLATION_REASONS,
  EVENT_DIFFICULTIES,
  EVENT_STATUSES,
  EVENT_STATUS_BADGE_VARIANT,
  cancellationReasonToApi,
  type Event,
  type EventCancellationReason,
  type EventOrderingField,
} from "@/types/event";

const PAGE_SIZE = 20;

type ConfirmActionType = "publish" | "cancel" | "delete";

interface ConfirmActionState {
  type: ConfirmActionType;
  event: Event;
}

function EventsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [ordering, setOrdering] = useState("-start_at");

  const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(null);
  const [cancelReason, setCancelReason] = useState<EventCancellationReason | "">("");
  const [cancelReasonOther, setCancelReasonOther] = useState("");
  const [actionError, setActionError] = useState<string>();

  const search = useDebouncedValue(searchInput, 400);

  const filterKey = `${search}|${statusFilter}|${categoryFilter}|${regionFilter}|${difficultyFilter}|${ordering}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const capabilities = user?.capabilities ?? [];
  const isGuide = user?.role === "guide";
  const canCreate = capabilities.includes("create_event");
  const canEdit = capabilities.includes("edit_event");
  const canPublish = capabilities.includes("publish_event");
  const canCancel = capabilities.includes("cancel_event");
  const canViewTeam = capabilities.includes("view_team_members");

  const eventsQuery = useQuery({
    queryKey: [
      "events",
      { page, search, statusFilter, categoryFilter, regionFilter, difficultyFilter, ordering },
    ],
    queryFn: () =>
      listEvents({
        page,
        page_size: PAGE_SIZE,
        search: search || undefined,
        status: statusFilter || undefined,
        category: categoryFilter ? activityTypeToApi(categoryFilter) : undefined,
        region: regionFilter ? regionToApi(regionFilter) : undefined,
        difficulty: difficultyFilter || undefined,
        ordering,
      }),
  });

  const publishMutation = useMutation({ mutationFn: (id: string) => publishEvent(id) });
  const cancelMutation = useMutation({
    mutationFn: (id: string) =>
      cancelEvent(id, cancellationReasonToApi(cancelReason), cancelReasonOther),
  });
  const deleteMutation = useMutation({ mutationFn: (id: string) => deleteEvent(id) });

  function closeConfirmAction() {
    setConfirmAction(null);
    setCancelReason("");
    setCancelReasonOther("");
    setActionError(undefined);
  }

  async function handleConfirmAction() {
    if (!confirmAction) return;
    setActionError(undefined);
    try {
      if (confirmAction.type === "delete") {
        await deleteMutation.mutateAsync(confirmAction.event.id);
      } else if (confirmAction.type === "publish") {
        await publishMutation.mutateAsync(confirmAction.event.id);
      } else {
        await cancelMutation.mutateAsync(confirmAction.event.id);
      }
      queryClient.invalidateQueries({ queryKey: ["events"] });
      closeConfirmAction();
    } catch (error) {
      setActionError(error instanceof ApiError ? error.generalMessage() : t("events.form.saveError"));
    }
  }

  const isCancelReasonMissing =
    confirmAction?.type === "cancel" &&
    (!cancelReason || (cancelReason === "other" && !cancelReasonOther.trim()));
  const isPublishBlocked =
    confirmAction?.type === "publish" && confirmAction.event.missingToPublish.length > 0;
  const isConfirmDisabled = isCancelReasonMissing || isPublishBlocked;

  function toggleOrdering(field: EventOrderingField) {
    setOrdering((prev) => (prev === field ? `-${field}` : field));
  }

  function sortIcon(field: EventOrderingField) {
    if (ordering === field) return "ri-arrow-up-line";
    if (ordering === `-${field}`) return "ri-arrow-down-line";
    return "ri-expand-up-down-line text-muted";
  }

  function sortableHeader(field: EventOrderingField, label: string) {
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
      key: "title",
      header: sortableHeader("title", t("events.table.name")),
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <Link to={`/club/events/${row.id}`}>{row.title}</Link>
          <Badge variant={EVENT_STATUS_BADGE_VARIANT[row.status]} appearance="subtle">
            {t(`events.status.${row.status}`)}
          </Badge>
        </div>
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
      key: "region",
      header: t("events.table.region"),
      render: (row) => (row.region ? t(`regions.${row.region}`) : "–"),
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
      key: "guide",
      header: t("events.table.guide"),
      render: (row) =>
        row.guide && row.guideName && canViewTeam ? (
          <Link to={`/club/team/${row.guide}`}>{row.guideName}</Link>
        ) : (
          row.guideName || "–"
        ),
    },
  ];

  if (!isGuide) {
    columns.push({
      key: "actions",
      header: t("events.table.actions"),
      headerClassName: "text-end",
      className: "text-end",
      render: (row) => (
        <RowActionsMenu
          ariaLabel={t("events.table.actions")}
          actions={[
            {
              key: "edit",
              label: t("common.edit"),
              icon: "ri-pencil-fill",
              onClick: () => navigate(`/club/events/${row.id}/edit`),
              hidden: !canEdit || row.status === "cancelled",
            },
            {
              key: "publish",
              label: t("events.publishEvent"),
              icon: "ri-send-plane-fill",
              onClick: () => setConfirmAction({ type: "publish", event: row }),
              hidden: !canPublish || row.status !== "draft",
            },
            {
              key: "cancel",
              label: t("events.cancelEvent"),
              icon: "ri-close-circle-line",
              onClick: () => setConfirmAction({ type: "cancel", event: row }),
              hidden: !canCancel || row.status !== "published",
            },
            {
              key: "delete",
              label: t("common.delete"),
              icon: "ri-delete-bin-5-fill",
              variant: "danger",
              onClick: () => setConfirmAction({ type: "delete", event: row }),
              hidden: !canEdit || row.status !== "draft",
            },
          ]}
        />
      ),
    });
  }

  const events = eventsQuery.data?.results ?? [];
  const totalCount = eventsQuery.data?.count ?? 0;

  return (
    <>
      <Breadcrumbs title={t("sidebar.events")} />

      <Card>
        <CardHeader
          title={t("sidebar.events")}
          actions={
            !isGuide &&
            canCreate && (
              <Button
                variant="primary"
                leftIcon={<i className="ri-add-line align-bottom" />}
                onClick={() => navigate("/club/events/create")}
              >
                {t("events.createEvent")}
              </Button>
            )
          }
        />
        <CardBody>
          {isGuide && <p className="text-muted mb-3">{t("events.myEventsNotice")}</p>}

          <div className="d-flex flex-wrap align-items-start gap-2 mb-4">
            <div className="search-box" style={{ maxWidth: 240 }}>
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={t("events.filters.searchPlaceholder")}
                aria-label={t("events.filters.searchPlaceholder")}
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
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              containerClassName="mb-0"
              style={{ maxWidth: 200 }}
              aria-label={t("events.filters.allCategories")}
            >
              <option value="">{t("events.filters.allCategories")}</option>
              {ACTIVITY_TYPES.map((category) => (
                <option key={category.id} value={category.id}>
                  {t(`activityTypes.${category.id}`)}
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

            <Select
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value)}
              containerClassName="mb-0"
              style={{ maxWidth: 180 }}
              aria-label={t("events.filters.allDifficulties")}
            >
              <option value="">{t("events.filters.allDifficulties")}</option>
              {EVENT_DIFFICULTIES.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {t(`events.difficulties.${difficulty}`)}
                </option>
              ))}
            </Select>
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
          ) : (
            <>
              <Table
                columns={columns}
                data={events}
                getRowKey={(row) => row.id}
                emptyMessage={t("events.empty")}
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

      <ConfirmDialog
        isOpen={confirmAction !== null}
        onClose={closeConfirmAction}
        onConfirm={handleConfirmAction}
        loading={publishMutation.isPending || cancelMutation.isPending || deleteMutation.isPending}
        confirmDisabled={isConfirmDisabled}
        icon={
          confirmAction?.type === "delete"
            ? "ri-delete-bin-line"
            : confirmAction?.type === "publish"
              ? "ri-send-plane-line"
              : "ri-error-warning-line"
        }
        confirmVariant={
          confirmAction?.type === "delete"
            ? "danger"
            : confirmAction?.type === "publish"
              ? "success"
              : "warning"
        }
        title={
          confirmAction?.type === "delete"
            ? t("events.confirmDelete.title")
            : confirmAction?.type === "publish"
              ? t("events.confirmPublish.title")
              : t("events.confirmCancel.title")
        }
        message={
          confirmAction?.type === "delete"
            ? t("events.confirmDelete.message")
            : confirmAction?.type === "publish"
              ? t("events.confirmPublish.message")
              : t("events.confirmCancel.message")
        }
        confirmLabel={
          confirmAction?.type === "delete"
            ? t("events.confirmDelete.confirm")
            : confirmAction?.type === "publish"
              ? t("events.confirmPublish.confirm")
              : t("events.confirmCancel.confirm")
        }
        cancelLabel={t("common.cancel")}
      >
        {isPublishBlocked && confirmAction && (
          <div className="alert alert-warning mb-0">
            {t("events.view.missingToPublish", {
              fields: confirmAction.event.missingToPublish
                .map((field) => t(`events.missingFields.${field}`, field))
                .join(", "),
            })}
          </div>
        )}

        {confirmAction?.type === "cancel" && (
          <div>
            <span className="form-label d-block">
              {t("events.confirmCancel.reasonLabel")}
            </span>

            <div className="d-flex flex-column gap-2 mb-3">
              {EVENT_CANCELLATION_REASONS.map((reason) => (
                <Radio
                  key={reason}
                  name="cancellation-reason"
                  label={t(`events.confirmCancel.reasons.${reason}`)}
                  checked={cancelReason === reason}
                  onChange={() => setCancelReason(reason)}
                />
              ))}
            </div>

            {cancelReason === "other" && (
              <Textarea
                label={t("events.confirmCancel.reasonOtherLabel")}
                placeholder={t("events.confirmCancel.reasonOtherPlaceholder")}
                value={cancelReasonOther}
                onChange={(event) =>
                  setCancelReasonOther(
                    event.target.value.slice(0, CANCEL_REASON_OTHER_MAX_LENGTH),
                  )
                }
                maxLength={CANCEL_REASON_OTHER_MAX_LENGTH}
                helperText={`${cancelReasonOther.length}/${CANCEL_REASON_OTHER_MAX_LENGTH}`}
                containerClassName="mb-0"
              />
            )}
          </div>
        )}

        {actionError && <div className="text-danger fs-13 mt-2">{actionError}</div>}
      </ConfirmDialog>
    </>
  );
}

export default EventsPage;
