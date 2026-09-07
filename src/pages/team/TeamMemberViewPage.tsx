import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Avatar from "@/components/ui/Avatar/Avatar";
import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Card, { CardBody } from "@/components/ui/Card/Card";

import { ACTIVITY_TYPES } from "@/constants/activityTypes";
import { getTeamMember } from "@/services/teamMembers.api";

interface DetailFieldProps {
  label: string;
  value?: string | null;
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

  const memberQuery = useQuery({
    queryKey: ["team-member", id],
    queryFn: () => getTeamMember(id as string),
    enabled: Boolean(id),
    retry: false,
  });

  if (memberQuery.isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  const member = memberQuery.data;

  if (memberQuery.isError || !member) {
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

  return (
    <>
      <Breadcrumbs
        title={member.fullName}
        items={[{ label: t("sidebar.team"), to: "/club/team" }]}
      />

      <div className="d-flex justify-content-end mb-3">
        <Link to={`/club/team/${member.id}/edit`} className="btn btn-success">
          <i className="ri-edit-box-line align-bottom me-1" aria-hidden="true" />
          {t("team.view.editMember")}
        </Link>
      </div>

      <Card>
        <CardBody>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <Avatar
              src={member.photo ?? undefined}
              name={member.fullName}
              size="lg"
              className="img-thumbnail"
            />

            <div className="flex-grow-1">
              <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                <h4 className="mb-0">{member.fullName}</h4>
                <Badge variant="info" appearance="subtle">
                  {t(`admin.roleNames.${member.platformRole}`)}
                </Badge>
                <Badge variant={member.accountIsActive ? "success" : "secondary"} appearance="subtle">
                  {member.accountIsActive ? t("team.status.active") : t("team.status.inactive")}
                </Badge>
              </div>

              <div className="hstack text-muted gap-3 flex-wrap">
                {member.phone && (
                  <div>
                    <i className="ri-phone-line me-1 align-middle" aria-hidden="true" />
                    {member.phone}
                  </div>
                )}
                <div>
                  <i className="ri-mail-line me-1 align-middle" aria-hidden="true" />
                  {member.email}
                </div>
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
                    value={member.experienceYears != null ? String(member.experienceYears) : ""}
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

          {member.platformRole === "internal_admin" && (
            <Card>
              <CardBody>
                <h5 className="card-title mb-3">{t("team.view.permissions")}</h5>

                <div className="d-flex flex-wrap gap-1">
                  {member.permissions.length > 0 ? (
                    member.permissions.map((permission) => (
                      <Badge key={permission} variant="info" appearance="subtle">
                        {t(`admin.capabilityNames.${permission}`)}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted">{t("team.view.notSpecified")}</span>
                  )}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="col-xxl-4">
          <Card>
            <CardBody>
              <h5 className="card-title mb-3">{t("team.form.fields.certificates.label")}</h5>

              {member.certificates.length > 0 ? (
                <div className="row g-2">
                  {member.certificates.map((certificate) => (
                    <div key={certificate.id} className="col-6">
                      <a href={certificate.fileUrl} target="_blank" rel="noreferrer">
                        <img
                          src={certificate.fileUrl}
                          alt=""
                          className="rounded border w-100"
                          style={{ height: 100, objectFit: "cover" }}
                        />
                      </a>
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
