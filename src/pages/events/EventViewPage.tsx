import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Card, { CardBody } from "@/components/ui/Card/Card";

import { useObjectUrl } from "@/hooks/useObjectUrl";
import { useObjectUrls } from "@/hooks/useObjectUrls";

import {
  EVENT_CANCELLATION_REASONS,
  EVENT_CATEGORIES,
  EVENT_GUIDES,
  formatEventDate,
  getEventById,
} from "./EventsPage.data";

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

function EventViewPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const event = id ? getEventById(id) : undefined;

  const coverImageUrl = useObjectUrl(event?.coverImage[0]);
  const galleryImageUrls = useObjectUrls(event?.galleryImages ?? []);

  if (!event) {
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
  const guide = EVENT_GUIDES.find((item) => item.id === event.guideId);
  const sweepGuide = EVENT_GUIDES.find((item) => item.id === event.sweepGuideId);
  const mapsUrl = event.meetingPointCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.meetingPointCoordinates)}`
    : undefined;

  return (
    <>
      <Breadcrumbs
        title={event.name}
        items={[{ label: t("sidebar.events"), to: "/club/events" }]}
      />

      <div className="d-flex justify-content-end mb-3">
        <Link to={`/club/events/${event.id}/edit`} className="btn btn-success">
          <i className="ri-edit-box-line align-bottom me-1" aria-hidden="true" />
          {t("events.view.editEvent")}
        </Link>
      </div>

      {coverImageUrl && (
        <Card>
          <img
            src={coverImageUrl}
            alt=""
            className="card-img-top"
            style={{ maxHeight: 320, objectFit: "cover" }}
          />
        </Card>
      )}

      <Card>
        <CardBody>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
            <h4 className="mb-0">{event.name}</h4>
            {category && (
              <Badge variant={category.variant} appearance="subtle">
                {t(`activityTypes.${event.category}`)}
              </Badge>
            )}
            {event.status === "cancelled" && (
              <Badge variant="danger" appearance="subtle">
                {t("events.status.cancelled")}
              </Badge>
            )}
          </div>

          {event.status === "cancelled" && event.cancellationReason && (
            <p className="text-danger fs-13 mb-2">
              <i className="ri-error-warning-line align-middle me-1" aria-hidden="true" />
              {t("events.view.cancellationReason")}:{" "}
              {(EVENT_CANCELLATION_REASONS as readonly string[]).includes(
                event.cancellationReason,
              )
                ? t(`events.confirmCancel.reasons.${event.cancellationReason}`)
                : event.cancellationReason}
            </p>
          )}

          <p className="text-muted mb-0">
            {event.description || t("events.view.notSpecified")}
          </p>
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
                    value={formatEventDate(event.date, event.time)}
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
                      value={event.endDate}
                    />
                  </div>
                )}
              </div>

              <div className="mt-3">
                <div className="text-muted fs-13 mb-2">
                  {t("events.form.fields.languages.label")}
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {event.languageIds.length > 0 ? (
                    event.languageIds.map((language) => (
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
                  {event.difficultyIds.length > 0 ? (
                    event.difficultyIds.map((difficulty) => (
                      <Badge key={difficulty} variant="warning" appearance="subtle">
                        {t(`events.difficulties.${difficulty}`)}
                      </Badge>
                    ))
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
                    value={event.meetingPointDescription}
                  />
                </div>
                <div className="col-sm-6">
                  <div className="text-muted fs-13">
                    {t("events.form.fields.meetingPointCoordinates.label")}
                  </div>
                  {event.meetingPointCoordinates ? (
                    <a href={mapsUrl} target="_blank" rel="noreferrer">
                      {event.meetingPointCoordinates}
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
                    value={t(`events.priceTypes.${event.priceType}`)}
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
                  value={event.whatIsNecessary}
                />
                <DetailField
                  label={t("events.form.fields.includedItems.label")}
                  value={event.includedItems}
                />
                <DetailField
                  label={t("events.form.fields.excludedItems.label")}
                  value={event.excludedItems}
                />
                <DetailField
                  label={t("events.form.fields.cancellationPolicy.label")}
                  value={event.cancellationPolicy}
                />
                <DetailField
                  label={t("events.form.fields.additionalInfo.label")}
                  value={event.additionalInfo}
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
                <DetailField label={t("events.form.fields.guide.label")} value={guide?.name} />
                <DetailField
                  label={t("events.form.fields.sweepGuide.label")}
                  value={sweepGuide?.name}
                />
                <DetailField
                  label={t("events.table.region")}
                  value={t(`regions.${event.region}`)}
                />
              </div>
            </CardBody>
          </Card>

          {galleryImageUrls.length > 0 && (
            <Card>
              <CardBody>
                <h5 className="card-title mb-3">
                  {t("events.form.fields.galleryImages.label")}
                </h5>

                <div className="row g-2">
                  {galleryImageUrls.map((url) => (
                    <div key={url} className="col-6">
                      <img
                        src={url}
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

export default EventViewPage;
