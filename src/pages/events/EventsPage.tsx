import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import Table from "@/components/ui/Table/Table";
import type { TableColumn } from "@/components/ui/Table/Table.types";

import EventFormModal from "./components/EventFormModal";
import type { EventFormValues } from "./EventForm.schema";
import {
  EVENT_CATEGORIES,
  EVENT_DURATION_TYPES,
  EVENT_GUIDES,
  EVENT_PRICE_TYPES,
  EVENT_REGIONS,
  formatEventDate,
  mockEvents,
  type EventDifficulty,
  type EventDurationType,
  type EventLanguage,
  type EventListItem,
  type EventPriceType,
  type EventRegion,
} from "./EventsPage.data";

type ConfirmActionType = "cancel" | "delete";

interface ConfirmActionState {
  type: ConfirmActionType;
  event: EventListItem;
}

interface EventsPageLocationState {
  createdEvent?: EventFormValues;
}

function toEventFormValues(event: EventListItem): EventFormValues {
  return {
    name: event.name,
    category: event.category,
    region: event.region,
    description: event.description,
    date: event.date,
    time: event.time,
    durationType: event.durationType,
    endDate: event.endDate,
    guideId: event.guideId,
    sweepGuideId: event.sweepGuideId,
    languageIds: event.languageIds,
    difficultyIds: event.difficultyIds,
    distanceKm: event.distanceKm,
    elevationGainM: event.elevationGainM,
    meetingPointDescription: event.meetingPointDescription,
    meetingPointCoordinates: event.meetingPointCoordinates,
    maxParticipants: event.maxParticipants,
    priceType: event.priceType,
    price: event.price,
    whatIsNecessary: event.whatIsNecessary,
    includedItems: event.includedItems,
    excludedItems: event.excludedItems,
    cancellationPolicy: event.cancellationPolicy,
    additionalInfo: event.additionalInfo,
    coverImage: event.coverImage,
    galleryImages: event.galleryImages,
  };
}

function toEventListItem(values: EventFormValues): Omit<EventListItem, "id" | "status"> {
  return {
    name: values.name,
    category: values.category,
    region: (EVENT_REGIONS as readonly string[]).includes(values.region)
      ? (values.region as EventRegion)
      : EVENT_REGIONS[0],
    date: values.date,
    time: values.time,
    durationType: (EVENT_DURATION_TYPES as readonly string[]).includes(values.durationType)
      ? (values.durationType as EventDurationType)
      : EVENT_DURATION_TYPES[0],
    endDate: values.endDate,
    guideId: values.guideId,
    sweepGuideId: values.sweepGuideId,
    languageIds: values.languageIds as EventLanguage[],
    difficultyIds: values.difficultyIds as EventDifficulty[],
    distanceKm: values.distanceKm,
    elevationGainM: values.elevationGainM,
    meetingPointDescription: values.meetingPointDescription,
    meetingPointCoordinates: values.meetingPointCoordinates,
    maxParticipants: values.maxParticipants,
    priceType: (EVENT_PRICE_TYPES as readonly string[]).includes(values.priceType)
      ? (values.priceType as EventPriceType)
      : EVENT_PRICE_TYPES[0],
    price: values.price,
    whatIsNecessary: values.whatIsNecessary,
    includedItems: values.includedItems,
    excludedItems: values.excludedItems,
    cancellationPolicy: values.cancellationPolicy,
    additionalInfo: values.additionalInfo,
    description: values.description,
    coverImage: values.coverImage,
    galleryImages: values.galleryImages,
  };
}

function EventsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState<EventListItem[]>(() => {
    const state = location.state as EventsPageLocationState | null;
    const createdEvent = state?.createdEvent;
    if (!createdEvent) return mockEvents;

    return [
      ...mockEvents,
      {
        id: crypto.randomUUID(),
        ...toEventListItem(createdEvent),
        status: "scheduled",
      },
    ];
  });
  const [editingEvent, setEditingEvent] = useState<EventListItem | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(null);

  useEffect(() => {
    if (!location.state) return;
    navigate(location.pathname, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  function handleUpdateEvent(values: EventFormValues) {
    setEvents((prev) =>
      prev.map((event) =>
        editingEvent && event.id === editingEvent.id
          ? { ...event, ...toEventListItem(values) }
          : event,
      ),
    );
    setEditingEvent(null);
  }

  function handleConfirmAction() {
    if (!confirmAction) return;

    if (confirmAction.type === "delete") {
      setEvents((prev) => prev.filter((event) => event.id !== confirmAction.event.id));
    } else {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === confirmAction.event.id ? { ...event, status: "cancelled" } : event,
        ),
      );
    }

    setConfirmAction(null);
  }

  const columns: TableColumn<EventListItem>[] = [
    {
      key: "name",
      header: t("events.table.name"),
      sortable: true,
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <span>{row.name}</span>
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
        const category = EVENT_CATEGORIES.find((item) => item.id === row.category);
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
      accessor: (row) => EVENT_GUIDES.find((guide) => guide.id === row.guideId)?.name ?? "",
      render: (row) => EVENT_GUIDES.find((guide) => guide.id === row.guideId)?.name ?? "—",
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
            onClick={() => setEditingEvent(row)}
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

      {editingEvent && (
        <EventFormModal
          key={editingEvent.id}
          isOpen
          initialValues={toEventFormValues(editingEvent)}
          onClose={() => setEditingEvent(null)}
          onSubmit={handleUpdateEvent}
        />
      )}

      <ConfirmDialog
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        icon={confirmAction?.type === "delete" ? "ri-delete-bin-line" : "ri-error-warning-line"}
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
      />
    </>
  );
}

export default EventsPage;
