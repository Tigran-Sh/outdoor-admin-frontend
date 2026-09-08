import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Card, { CardBody } from "@/components/ui/Card/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import LocationMapPreview from "@/components/ui/LocationMapPreview/LocationMapPreview";
import Radio from "@/components/ui/Radio/Radio";
import Textarea from "@/components/ui/Textarea/Textarea";

import { useAuth } from "@/app/providers/useAuth";
import { cancelEvent, deleteEvent, getEvent, publishEvent } from "@/services/events.api";
import { ApiError } from "@/types/apiError";
import {
  CANCEL_REASON_OTHER_MAX_LENGTH,
  EVENT_CANCELLATION_REASONS,
  EVENT_CATEGORIES,
  EVENT_STATUS_BADGE_VARIANT,
  cancellationReasonToApi,
  type EventCancellationReason,
} from "@/types/event";

interface DetailFieldProps {
  label: string;
  value?: string;
}

function DetailField({ label, value }: DetailFieldProps) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-muted fs-13">{label}</div>
      <div>{value?.trim() ? value : t("events.view.notSpecified")}</div>
    </div>
  );
}

type ConfirmActionType = "publish" | "cancel" | "delete";

function EventViewPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [confirmAction, setConfirmAction] = useState<ConfirmActionType | null>(null);
  const [cancelReason, setCancelReason] = useState<EventCancellationReason | "">("");
  const [cancelReasonOther, setCancelReasonOther] = useState("");
  const [actionError, setActionError] = useState<string>();

  const eventQuery = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id as string),
    enabled: Boolean(id),
    retry: false,
  });
  const event = eventQuery.data;

  const publishMutation = useMutation({ mutationFn: () => publishEvent(id as string) });
  const cancelMutation = useMutation({
    mutationFn: () => cancelEvent(id as string, cancellationReasonToApi(cancelReason), cancelReasonOther),
  });
  const deleteMutation = useMutation({ mutationFn: () => deleteEvent(id as string) });

  const capabilities = user?.capabilities ?? [];
  const canPublish = capabilities.includes("publish_event");
  const canCancel = capabilities.includes("cancel_event");
  const canEdit = capabilities.includes("edit_event");

  function closeConfirmAction() {
    setConfirmAction(null);
    setCancelReason("");
    setCancelReasonOther("");
    setActionError(undefined);
  }

  async function handleConfirmAction() {
    setActionError(undefined);
    try {
      if (confirmAction === "delete") {
        await deleteMutation.mutateAsync();
        navigate("/club/events");
        return;
      }
      if (confirmAction === "publish") {
        await publishMutation.mutateAsync();
      } else if (confirmAction === "cancel") {
        await cancelMutation.mutateAsync();
      }
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      closeConfirmAction();
    } catch (error) {
      setActionError(error instanceof ApiError ? error.generalMessage() : t("events.form.saveError"));
    }
  }

  if (eventQuery.isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (eventQuery.isError || !event) {
    return (
      <>
        <Breadcrumbs
          title={t("events.view.notFound")}
          items={[{ label: t("sidebar.events"), to: "/club/events" }]}
        />

        <Card>
          <CardBody>
            <p className="text-muted mb-3">{t("events.view.notFoundMessage")}</p>
            <Link to="/club/events" className="btn btn-primary">
              {t("events.view.backToEvents")}
            </Link>
          </CardBody>
        </Card>
      </>
    );
  }

  const category = EVENT_CATEGORIES.find((item) => item.id === event.category);
  const meetingPointLat = Number(event.meetingPointLat);
  const meetingPointLng = Number(event.meetingPointLng);
  const hasMeetingPoint =
    event.meetingPointLat !== "" &&
    event.meetingPointLng !== "" &&
    !Number.isNaN(meetingPointLat) &&
    !Number.isNaN(meetingPointLng);
  const mapsUrl = hasMeetingPoint
    ? `https://www.google.com/maps/search/?api=1&query=${meetingPointLat},${meetingPointLng}`
    : undefined;
  const isCancelReasonMissing =
    confirmAction === "cancel" &&
    (!cancelReason || (cancelReason === "other" && !cancelReasonOther.trim()));

  return (
    <>
      <Breadcrumbs
        title={event.title}
        items={[{ label: t("sidebar.events"), to: "/club/events" }]}
      />

      <div className="d-flex justify-content-end gap-2 mb-3">
        {event.status === "draft" && canPublish && (
          <button
            type="button"
            className="btn btn-success"
            disabled={event.missingToPublish.length > 0}
            title={
              event.missingToPublish.length > 0
                ? t("events.view.missingToPublish", {
                    fields: event.missingToPublish
                      .map((field) => t(`events.missingFields.${field}`, field))
                      .join(", "),
                  })
                : undefined
            }
            onClick={() => setConfirmAction("publish")}
          >
            <i className="ri-send-plane-fill align-bottom me-1" aria-hidden="true" />
            {t("events.publishEvent")}
          </button>
        )}

        {event.status === "published" && canCancel && (
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => setConfirmAction("cancel")}
          >
            <i className="ri-close-circle-line align-bottom me-1" aria-hidden="true" />
            {t("events.cancelEvent")}
          </button>
        )}

        {event.status === "draft" && canEdit && (
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => setConfirmAction("delete")}
          >
            <i className="ri-delete-bin-5-fill align-bottom me-1" aria-hidden="true" />
            {t("common.delete")}
          </button>
        )}

        {canEdit && event.status !== "cancelled" && (
          <Link to={`/club/events/${event.id}/edit`} className="btn btn-primary">
            <i className="ri-edit-box-line align-bottom me-1" aria-hidden="true" />
            {t("events.view.editEvent")}
          </Link>
        )}
      </div>

      {event.status === "draft" && event.missingToPublish.length > 0 && (
        <div className="alert alert-info">
          {t("events.view.missingToPublish", {
            fields: event.missingToPublish
              .map((field) => t(`events.missingFields.${field}`, field))
              .join(", "),
          })}
        </div>
      )}

      {event.coverImage && (
        <Card>
          <img
            src={event.coverImage}
            alt=""
            className="card-img-top"
            style={{ maxHeight: 320, objectFit: "cover" }}
          />
        </Card>
      )}

      <Card>
        <CardBody>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
            <h4 className="mb-0">{event.title}</h4>
            {category && (
              <Badge variant={category.variant} appearance="subtle">
                {t(`activityTypes.${event.category}`)}
              </Badge>
            )}
            <Badge variant={EVENT_STATUS_BADGE_VARIANT[event.status]} appearance="subtle">
              {t(`events.status.${event.status}`)}
            </Badge>
          </div>

          {event.status === "cancelled" && (
            <p className="text-danger fs-13 mb-2">
              <i className="ri-error-warning-line align-middle me-1" aria-hidden="true" />
              {t("events.view.cancellationReason")}:{" "}
              {event.cancellationReason === "other"
                ? event.cancellationReasonOther
                : event.cancellationReason
                  ? t(`events.confirmCancel.reasons.${event.cancellationReason}`)
                  : t("events.view.notSpecified")}
            </p>
          )}
        </CardBody>
      </Card>

      <div className="row">
        <div className="col-xxl-8">
          <Card>
            <CardBody>
              <h5 className="card-title mb-3">{t("events.form.steps.schedule")}</h5>

              <div className="row g-3">
                <div className="col-sm-4">
                  <DetailField
                    label={t("events.form.fields.date.label")}
                    value={
                      event.startAt
                        ? new Date(event.startAt).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : undefined
                    }
                  />
                </div>
                <div className="col-sm-4">
                  <DetailField
                    label={t("events.form.fields.durationType.label")}
                    value={t(`events.durationTypes.${event.durationType}`)}
                  />
                </div>
                {event.durationType === "multi" && (
                  <div className="col-sm-4">
                    <DetailField
                      label={t("events.form.fields.endDate.label")}
                      value={event.endAt ? event.endAt.split("T")[0] : undefined}
                    />
                  </div>
                )}
              </div>

              <div className="mt-3">
                <div className="text-muted fs-13 mb-2">
                  {t("events.form.fields.languages.label")}
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {event.languages.length > 0 ? (
                    event.languages.map((language) => (
                      <Badge key={language} variant="secondary" appearance="subtle">
                        {t(`events.languages.${language}`)}
                      </Badge>
                    ))
                  ) : (
                    <span>{t("events.view.notSpecified")}</span>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h5 className="card-title mb-3">{t("events.form.steps.route")}</h5>

              <div className="mb-3">
                <div className="text-muted fs-13 mb-2">
                  {t("events.form.fields.difficulties.label")}
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {event.difficulty ? (
                    <Badge variant="warning" appearance="subtle">
                      {t(`events.difficulties.${event.difficulty}`)}
                    </Badge>
                  ) : (
                    <span>{t("events.view.notSpecified")}</span>
                  )}
                </div>
              </div>

              <div className="row g-3">
                <div className="col-sm-6">
                  <DetailField
                    label={t("events.form.fields.distanceKm.label")}
                    value={event.distanceKm}
                  />
                </div>
                <div className="col-sm-6">
                  <DetailField
                    label={t("events.form.fields.elevationGainM.label")}
                    value={event.elevationGainM}
                  />
                </div>
                <div className="col-sm-6">
                  <DetailField
                    label={t("events.form.fields.meetingPointDescription.label")}
                    value={event.meetingPointNote}
                  />
                </div>
                <div className="col-sm-6">
                  <div className="text-muted fs-13">
                    {t("events.form.fields.meetingPointCoordinates.label")}
                  </div>
                  {mapsUrl ? (
                    <a href={mapsUrl} target="_blank" rel="noreferrer">
                      {event.meetingPointLat}, {event.meetingPointLng}
                      <i
                        className="ri-external-link-line fs-13 text-muted ms-1"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">{t("events.view.openInMaps")}</span>
                    </a>
                  ) : (
                    <div>{t("events.view.notSpecified")}</div>
                  )}
                </div>

                {hasMeetingPoint && (
                  <div className="col-12">
                    <LocationMapPreview lat={meetingPointLat} lng={meetingPointLng} />
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h5 className="card-title mb-3">{t("events.form.steps.salesTerms")}</h5>

              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <DetailField
                    label={t("events.form.fields.maxParticipants.label")}
                    value={event.maxParticipants}
                  />
                </div>
                <div className="col-sm-6">
                  <DetailField
                    label={t("events.form.fields.priceType.label")}
                    value={event.priceType ? t(`events.priceTypes.${event.priceType}`) : undefined}
                  />
                </div>
                {event.priceType === "paid" && (
                  <div className="col-sm-6">
                    <DetailField
                      label={t("events.form.fields.price.label")}
                      value={event.price}
                    />
                  </div>
                )}
              </div>

              <div className="d-flex flex-column gap-3">
                <DetailField
                  label={t("events.form.fields.whatIsNecessary.label")}
                  value={event.requiredItems.join(", ")}
                />
                <DetailField
                  label={t("events.form.fields.includedItems.label")}
                  value={event.included}
                />
                <DetailField
                  label={t("events.form.fields.excludedItems.label")}
                  value={event.notIncluded}
                />
                <DetailField
                  label={t("events.form.fields.cancellationPolicy.label")}
                  value={event.cancellationTerms}
                />
                <DetailField
                  label={t("events.form.fields.additionalInfo.label")}
                  value={event.otherInfo}
                />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-xxl-4">
          <Card>
            <CardBody>
              <h5 className="card-title mb-3">{t("events.form.fields.guide.label")}</h5>

              <div className="d-flex flex-column gap-3">
                <DetailField label={t("events.form.fields.guide.label")} value={event.guideName} />
                <DetailField
                  label={t("events.table.region")}
                  value={t(`regions.${event.region}`)}
                />
              </div>
            </CardBody>
          </Card>

          {event.galleryImages.length > 0 && (
            <Card>
              <CardBody>
                <h5 className="card-title mb-3">
                  {t("events.form.fields.galleryImages.label")}
                </h5>

                <div className="row g-2">
                  {event.galleryImages.map((image) => (
                    <div key={image.id} className="col-6">
                      <img
                        src={image.image}
                        alt=""
                        className="rounded border w-100"
                        style={{ height: 100, objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmAction !== null}
        onClose={closeConfirmAction}
        onConfirm={handleConfirmAction}
        loading={publishMutation.isPending || cancelMutation.isPending || deleteMutation.isPending}
        confirmDisabled={isCancelReasonMissing}
        icon={
          confirmAction === "delete"
            ? "ri-delete-bin-line"
            : confirmAction === "publish"
              ? "ri-send-plane-line"
              : "ri-error-warning-line"
        }
        confirmVariant={
          confirmAction === "delete" ? "danger" : confirmAction === "publish" ? "success" : "warning"
        }
        title={
          confirmAction === "delete"
            ? t("events.confirmDelete.title")
            : confirmAction === "publish"
              ? t("events.confirmPublish.title")
              : t("events.confirmCancel.title")
        }
        message={
          confirmAction === "delete"
            ? t("events.confirmDelete.message")
            : confirmAction === "publish"
              ? t("events.confirmPublish.message")
              : t("events.confirmCancel.message")
        }
        confirmLabel={
          confirmAction === "delete"
            ? t("events.confirmDelete.confirm")
            : confirmAction === "publish"
              ? t("events.confirmPublish.confirm")
              : t("events.confirmCancel.confirm")
        }
        cancelLabel={t("common.cancel")}
      >
        {confirmAction === "cancel" && (
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

export default EventViewPage;
