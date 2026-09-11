import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Card, { CardBody } from "@/components/ui/Card/Card";
import LocationMapPreview from "@/components/ui/LocationMapPreview/LocationMapPreview";

import { getEvent } from "@/services/events.api";
import { EVENT_CATEGORIES, EVENT_STATUS_BADGE_VARIANT } from "@/types/event";

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

function AdminEventViewPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const eventQuery = useQuery({
    queryKey: ["admin-event", id],
    queryFn: () => getEvent(id as string),
    enabled: Boolean(id),
    retry: false,
  });
  const event = eventQuery.data;

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
          items={[{ label: t("sidebar.eventsModeration"), to: "/admin/events" }]}
        />

        <Card>
          <CardBody>
            <p className="text-muted mb-3">{t("events.view.notFoundMessage")}</p>
            <Link to="/admin/events" className="btn btn-primary">
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

  return (
    <>
      <Breadcrumbs
        title={event.title || t("events.view.notSpecified")}
        items={[{ label: t("sidebar.eventsModeration"), to: "/admin/events" }]}
      />

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
            <h4 className="mb-0">{event.title || t("events.view.notSpecified")}</h4>
            {category && (
              <Badge variant={category.variant} appearance="subtle">
                {t(`activityTypes.${event.category}`)}
              </Badge>
            )}
            <Badge variant={EVENT_STATUS_BADGE_VARIANT[event.status]} appearance="subtle">
              {t(`events.status.${event.status}`)}
            </Badge>
          </div>

          <Link to={`/admin/clubs/${event.club}`} className="d-inline-flex align-items-center gap-1">
            <i className="ri-building-line" aria-hidden="true" />
            {event.clubName}
          </Link>

          {event.status === "cancelled" && (
            <p className="text-danger fs-13 mt-2 mb-0">
              <i className="ri-error-warning-line align-middle me-1" aria-hidden="true" />
              {t("events.view.cancellationReason")}:{" "}
              {event.cancellationReason === "other"
                ? event.cancellationReasonOther
                : event.cancellationReason
                  ? t(`events.confirmCancel.reasons.${event.cancellationReason}`)
                  : t("events.view.notSpecified")}
              {event.cancelledAt && (
                <>
                  {" "}
                  · {t("events.admin.view.cancelledAt")}{" "}
                  {new Date(event.cancelledAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </>
              )}
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
                  value={event.region ? t(`regions.${event.region}`) : undefined}
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
    </>
  );
}

export default AdminEventViewPage;
