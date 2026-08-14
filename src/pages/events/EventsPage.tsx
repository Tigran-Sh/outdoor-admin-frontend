import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import Radio from "@/components/ui/Radio/Radio";
import Table from "@/components/ui/Table/Table";
import type { TableColumn } from "@/components/ui/Table/Table.types";
import Textarea from "@/components/ui/Textarea/Textarea";

import type { EventFormValues } from "./EventForm.schema";
import {
  EVENT_CANCELLATION_REASONS,
  EVENT_CATEGORIES,
  EVENT_GUIDES,
  formatEventDate,
  mockEvents,
  toEventListItem,
  type EventCancellationReason,
  type EventListItem,
} from "./EventsPage.data";

type ConfirmActionType = "cancel" | "delete";

interface ConfirmActionState {
  type: ConfirmActionType;
  event: EventListItem;
}

interface EventsPageLocationState {
  createdEvent?: EventFormValues;
  updatedEvent?: EventFormValues;
  eventId?: string;
}

function EventsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState<EventListItem[]>(() => {
    const state = location.state as EventsPageLocationState | null;

    if (state?.createdEvent) {
      return [
        ...mockEvents,
        {
          id: crypto.randomUUID(),
          ...toEventListItem(state.createdEvent),
          status: "scheduled",
          soldCount: 0,
        },
      ];
    }

    if (state?.updatedEvent && state.eventId) {
      const updatedEvent = state.updatedEvent;
      const eventId = state.eventId;
      return mockEvents.map((event) =>
        event.id === eventId ? { ...event, ...toEventListItem(updatedEvent) } : event,
      );
    }

    return mockEvents;
  });
  const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(
    null,
  );
  const [cancelReason, setCancelReason] = useState<EventCancellationReason | "">("");
  const [cancelReasonOther, setCancelReasonOther] = useState("");

  useEffect(() => {
    if (!location.state) return;
    navigate(location.pathname, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  function closeConfirmAction() {
    setConfirmAction(null);
    setCancelReason("");
    setCancelReasonOther("");
  }

  function handleConfirmAction() {
    if (!confirmAction) return;

    if (confirmAction.type === "delete") {
      setEvents((prev) =>
        prev.filter((event) => event.id !== confirmAction.event.id),
      );
    } else {
      const cancellationReason =
        cancelReason === "other" ? cancelReasonOther.trim() : cancelReason;
      setEvents((prev) =>
        prev.map((event) =>
          event.id === confirmAction.event.id
            ? { ...event, status: "cancelled", cancellationReason: cancellationReason || undefined }
            : event,
        ),
      );
    }

    closeConfirmAction();
  }

  const isCancelReasonMissing =
    confirmAction?.type === "cancel" &&
    (!cancelReason || (cancelReason === "other" && !cancelReasonOther.trim()));

  const columns: TableColumn<EventListItem>[] = [
    {
      key: "name",
      header: t("events.table.name"),
      sortable: true,
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <Link to={`/club/events/${row.id}`}>{row.name}</Link>
          {row.status === "cancelled" && (
            <Badge variant="danger" appearance="subtle">
              {t("events.status.cancelled")}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: t("events.table.category"),
      sortable: true,
      accessor: (row) => t(`activityTypes.${row.category}`),
      render: (row) => {
        const category = EVENT_CATEGORIES.find(
          (item) => item.id === row.category,
        );
        if (!category) return "—";

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
      sortable: true,
      accessor: (row) => t(`regions.${row.region}`),
      render: (row) => t(`regions.${row.region}`),
    },
    {
      key: "date",
      header: t("events.table.date"),
      sortable: true,
      accessor: (row) => `${row.date}T${row.time}`,
      render: (row) => formatEventDate(row.date, row.time),
    },
    {
      key: "guide",
      header: t("events.table.guide"),
      sortable: true,
      accessor: (row) =>
        EVENT_GUIDES.find((guide) => guide.id === row.guideId)?.name ?? "",
      render: (row) =>
        EVENT_GUIDES.find((guide) => guide.id === row.guideId)?.name ?? "—",
    },
    {
      key: "actions",
      header: t("events.table.actions"),
      headerClassName: "text-end",
      className: "text-end",
      render: (row) => (
        <div className="d-flex justify-content-end gap-2">
          <Button
            appearance="soft"
            variant="primary"
            size="sm"
            iconOnly
            aria-label={t("common.edit")}
            disabled={row.status === "cancelled"}
            onClick={() => navigate(`/club/events/${row.id}/edit`)}
          >
            <i className="ri-pencil-fill" aria-hidden="true" />
          </Button>

          <Button
            appearance="soft"
            variant="warning"
            size="sm"
            iconOnly
            aria-label={t("events.cancelEvent")}
            disabled={row.status === "cancelled"}
            onClick={() => setConfirmAction({ type: "cancel", event: row })}
          >
            <i className="ri-close-circle-line" aria-hidden="true" />
          </Button>

          <Button
            appearance="soft"
            variant="danger"
            size="sm"
            iconOnly
            aria-label={t("common.delete")}
            onClick={() => setConfirmAction({ type: "delete", event: row })}
          >
            <i className="ri-delete-bin-5-fill" aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Breadcrumbs title={t("sidebar.events")} />

      <Card>
        <CardHeader
          title={t("sidebar.events")}
          actions={
            <Button
              variant="primary"
              leftIcon={<i className="ri-add-line align-bottom" />}
              onClick={() => navigate("/club/events/create")}
            >
              {t("events.createEvent")}
            </Button>
          }
        />
        <CardBody>
          <Table
            columns={columns}
            data={events}
            getRowKey={(row) => row.id}
            emptyMessage={t("events.empty")}
            searchable
            pageSize={5}
            card
          />
        </CardBody>
      </Card>

      <ConfirmDialog
        isOpen={confirmAction !== null}
        onClose={closeConfirmAction}
        onConfirm={handleConfirmAction}
        confirmDisabled={isCancelReasonMissing}
        icon={
          confirmAction?.type === "delete"
            ? "ri-delete-bin-line"
            : "ri-error-warning-line"
        }
        confirmVariant={confirmAction?.type === "delete" ? "danger" : "warning"}
        title={
          confirmAction?.type === "delete"
            ? t("events.confirmDelete.title")
            : t("events.confirmCancel.title")
        }
        message={
          confirmAction?.type === "delete"
            ? t("events.confirmDelete.message")
            : t("events.confirmCancel.message")
        }
        confirmLabel={
          confirmAction?.type === "delete"
            ? t("events.confirmDelete.confirm")
            : t("events.confirmCancel.confirm")
        }
        cancelLabel={t("common.cancel")}
      >
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
                onChange={(event) => setCancelReasonOther(event.target.value)}
                containerClassName="mb-0"
              />
            )}
          </div>
        )}
      </ConfirmDialog>
    </>
  );
}

export default EventsPage;
