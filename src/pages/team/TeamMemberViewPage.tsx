import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import Avatar from "@/components/ui/Avatar/Avatar";
import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Card, { CardBody } from "@/components/ui/Card/Card";

import { useObjectUrl } from "@/hooks/useObjectUrl";
import { useObjectUrls } from "@/hooks/useObjectUrls";

import { formatEventDate } from "../events/EventsPage.data";
import {
  ACTIVITY_TYPES,
  TEAM_EVENTS,
  TEAM_ROLES,
  getTeamMemberById,
  getTeamMemberFullName,
} from "./TeamPage.data";

interface DetailFieldProps {
  label: string;
  value?: string;
}

function DetailField({ label, value }: DetailFieldProps) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-muted fs-13">{label}</div>
      <div>{value?.trim() ? value : t("team.view.notSpecified")}</div>
    </div>
  );
}

function TeamMemberViewPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const member = id ? getTeamMemberById(id) : undefined;

  const photoUrl = useObjectUrl(member?.photo[0]);
  const certificateUrls = useObjectUrls(member?.certificates ?? []);

  if (!member) {
    return (
      <>
        <Breadcrumbs
          title={t("team.view.notFound")}
          items={[{ label: t("sidebar.team"), to: "/club/team" }]}
        />

        <Card>
          <CardBody>
            <p className="text-muted mb-3">{t("team.view.notFoundMessage")}</p>
            <Link to="/club/team" className="btn btn-primary">
              {t("team.view.backToTeam")}
            </Link>
          </CardBody>
        </Card>
      </>
    );
  }

  const fullName = getTeamMemberFullName(member);
  const role = TEAM_ROLES.find((item) => item.id === member.role);
  const assignedEvents = TEAM_EVENTS.filter((event) => member.assignedEventIds.includes(event.id));

  return (
    <>
      <Breadcrumbs title={fullName} items={[{ label: t("sidebar.team"), to: "/club/team" }]} />

      <div className="d-flex justify-content-end mb-3">
        <Link to={`/club/team/${member.id}/edit`} className="btn btn-success">
          <i className="ri-edit-box-line align-bottom me-1" aria-hidden="true" />
          {t("team.view.editMember")}
        </Link>
      </div>

      <Card>
        <CardBody>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <Avatar src={photoUrl} name={fullName} size="lg" className="img-thumbnail" />

            <div className="flex-grow-1">
              <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                <h4 className="mb-0">{fullName}</h4>
                {role && (
                  <Badge variant={role.variant} appearance="subtle">
                    {t(`team.roles.${member.role}`)}
                  </Badge>
                )}
                <Badge variant={member.isActive ? "success" : "secondary"} appearance="subtle">
                  {member.isActive ? t("team.status.active") : t("team.status.inactive")}
                </Badge>
              </div>

              <div className="hstack text-muted gap-3 flex-wrap">
                <div>
                  <i className="ri-phone-line me-1 align-middle" aria-hidden="true" />
                  {member.phone}
                </div>
                {member.email && (
                  <div>
                    <i className="ri-mail-line me-1 align-middle" aria-hidden="true" />
                    {member.email}
                  </div>
                )}
                <div>
                  <i className="ri-calendar-line me-1 align-middle" aria-hidden="true" />
                  {t("team.view.joinedOn")} {member.joinedDate}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="row">
        <div className="col-xxl-8">
          <Card>
            <CardBody>
              <h5 className="card-title mb-3">{t("team.form.steps.specialization")}</h5>

              <div className="mb-3">
                <div className="text-muted fs-13 mb-2">
                  {t("team.form.fields.activityTypes.label")}
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {member.activityTypeIds.length > 0 ? (
                    member.activityTypeIds.map((activityTypeId) => {
                      const activityType = ACTIVITY_TYPES.find(
                        (item) => item.id === activityTypeId,
                      );
                      if (!activityType) return null;

                      return (
                        <Badge
                          key={activityTypeId}
                          variant={activityType.variant}
                          appearance="subtle"
                        >
                          {t(`activityTypes.${activityTypeId}`)}
                        </Badge>
                      );
                    })
                  ) : (
                    <span>{t("team.view.notSpecified")}</span>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-muted fs-13 mb-2">
                  {t("team.form.fields.languages.label")}
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {member.languageIds.length > 0 ? (
                    member.languageIds.map((language) => (
                      <Badge key={language} variant="secondary" appearance="subtle">
                        {t(`events.languages.${language}`)}
                      </Badge>
                    ))
                  ) : (
                    <span>{t("team.view.notSpecified")}</span>
                  )}
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <DetailField
                    label={t("team.form.fields.experienceYears.label")}
                    value={member.experienceYears}
                  />
                </div>
                <div className="col-sm-6">
                  <DetailField
                    label={t("team.form.fields.birthDate.label")}
                    value={member.birthDate}
                  />
                </div>
              </div>

              <DetailField label={t("team.form.fields.bio.label")} value={member.bio} />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h5 className="card-title mb-3">{t("team.view.permissions")}</h5>

              <div className="d-flex flex-wrap gap-1">
                {member.permissionIds.length > 0 ? (
                  member.permissionIds.map((permission) => (
                    <Badge key={permission} variant="info" appearance="subtle">
                      {t(`team.permissions.${permission}`)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted">{t("team.view.notSpecified")}</span>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h5 className="card-title mb-3">{t("team.view.assignedEvents")}</h5>

              {assignedEvents.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {assignedEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={`/club/events/${event.id}`}
                      className="d-flex align-items-center justify-content-between text-body"
                    >
                      <span>{event.name}</span>
                      <span className="text-muted fs-13">
                        {formatEventDate(event.date, event.time)}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <span className="text-muted">{t("team.view.noEvents")}</span>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="col-xxl-4">
          <Card>
            <CardBody>
              <h5 className="card-title mb-3">{t("team.form.fields.certificates.label")}</h5>

              {certificateUrls.length > 0 ? (
                <div className="row g-2">
                  {certificateUrls.map((url) => (
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
              ) : (
                <span className="text-muted">{t("team.view.noCertificates")}</span>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

export default TeamMemberViewPage;
