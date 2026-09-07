import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import defaultCoverImage from "@/assets/images/auth-one-bg.jpg";
import Avatar from "@/components/ui/Avatar/Avatar";
import Badge from "@/components/ui/Badge/Badge";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody } from "@/components/ui/Card/Card";

import { fetchClubIdDocument } from "@/services/clubs.api";
import { ACTIVITY_TYPES } from "@/constants/activityTypes";
import {
  CLUB_VERIFICATION_BADGE_VARIANT,
  getClubVerificationStatus,
  type Club,
} from "@/types/club";

type ProfileTab = "overview" | "legal";

interface SocialLinkProps {
  href: string;
  icon: string;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="d-flex align-items-center gap-2 text-body"
    >
      <i className={icon} aria-hidden="true" />
      <span>{label}</span>
      <i
        className="ri-external-link-line fs-13 text-muted"
        aria-hidden="true"
      />
    </a>
  );
}

interface OwnerIdDocumentDownloadProps {
  clubId: string;
}

function OwnerIdDocumentDownload({ clubId }: OwnerIdDocumentDownloadProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleDownload() {
    setIsLoading(true);
    setHasError(false);
    try {
      const blob = await fetchClubIdDocument(clubId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Button
        type="button"
        appearance="outline"
        variant="secondary"
        size="sm"
        loading={isLoading}
        leftIcon={<i className="ri-download-2-line align-bottom" />}
        onClick={handleDownload}
      >
        {t("clubs.view.downloadIdDocument")}
      </Button>
      {hasError && (
        <div className="text-danger fs-13 mt-1">{t("clubs.view.idDocumentError")}</div>
      )}
    </div>
  );
}

interface ClubProfileViewProps {
  club: Club;
  editHref?: string;
  editLabel?: string;
  /** Whether the current viewer may download the private owner ID document. */
  canViewIdDocument?: boolean;
}

function ClubProfileView({ club, editHref, editLabel, canViewIdDocument }: ClubProfileViewProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  const status = getClubVerificationStatus(club);
  const requiresTaxId = club.entityType === "soleTrader" || club.entityType === "llc";
  const requiresOwnerId = club.entityType === "individual" || club.entityType === "informal";

  return (
    <>
      <Card className="overflow-hidden">
        <div className="position-relative" style={{ height: 220 }}>
          <img
            src={club.coverImage ?? defaultCoverImage}
            alt=""
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)",
            }}
          />

          <div className="position-absolute top-0 start-0 p-3">
            <Badge
              variant={CLUB_VERIFICATION_BADGE_VARIANT[status]}
              pill
              className="shadow-sm"
            >
              {t(`clubs.status.${status}`)}
            </Badge>
          </div>

          {editHref && (
            <div className="position-absolute top-0 end-0 p-3">
              <Link to={editHref} className="btn btn-light shadow-sm">
                <i
                  className="ri-edit-box-line align-bottom me-1"
                  aria-hidden="true"
                />
                {editLabel}
              </Link>
            </div>
          )}
        </div>

        <CardBody>
          <div className="d-flex align-items-end gap-3 mt-n5 mb-3 flex-wrap position-relative">
            <Avatar
              src={club.logo ?? undefined}
              name={club.name}
              size="xl"
              className="img-thumbnail bg-body flex-shrink-0"
            />

            <div className="flex-grow-1 pb-1">
              <h3 className="mb-1">
                {club.name}
                {status === "fullyVerified" && (
                  <i
                    className="ri-verified-badge-fill text-info ms-1 align-middle"
                    aria-label={t("clubs.status.fullyVerified")}
                  />
                )}
              </h3>
              <p className="text-muted mb-0">
                {club.entityType ? t(`clubs.entityTypes.${club.entityType}`) : club.ownerEmail}
              </p>
            </div>
          </div>

          {club.missingProfileFields.length > 0 && (
            <div className="alert alert-warning d-flex align-items-start gap-2">
              <i className="ri-error-warning-line mt-1" aria-hidden="true" />
              <div>
                <div className="fw-medium mb-1">{t("clubs.view.incompleteProfile.title")}</div>
                <div className="d-flex flex-wrap gap-1">
                  {club.missingProfileFields.map((field) => (
                    <Badge key={field} variant="warning" appearance="subtle" pill>
                      {t(`clubs.missingFields.${field}`)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="hstack text-muted gap-3 flex-wrap mb-4">
            {club.baseRegion && (
              <div>
                <i
                  className="ri-map-pin-line me-1 align-middle"
                  aria-hidden="true"
                />
                {t(`regions.${club.baseRegion}`)}
              </div>
            )}
            {club.yearFounded && (
              <div>
                <i
                  className="ri-calendar-line me-1 align-middle"
                  aria-hidden="true"
                />
                {club.yearFounded}
              </div>
            )}
          </div>

          <ul className="nav nav-tabs-custom gap-2" role="tablist">
            <li className="nav-item">
              <button
                type="button"
                className={
                  activeTab === "overview" ? "nav-link active" : "nav-link"
                }
                onClick={() => setActiveTab("overview")}
              >
                {t("clubs.view.tabs.overview")}
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={
                  activeTab === "legal" ? "nav-link active" : "nav-link"
                }
                onClick={() => setActiveTab("legal")}
              >
                {t("clubs.view.tabs.legal")}
              </button>
            </li>
          </ul>
        </CardBody>
      </Card>

      {activeTab === "overview" && (
        <div className="row">
          <div className="col-xxl-8">
            <Card>
              <CardBody>
                <h5 className="card-title mb-3">
                  {t("clubs.form.fields.about.label")}
                </h5>
                <p className="text-muted mb-0">
                  {club.about || t("clubs.view.notProvided")}
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h5 className="card-title mb-3">
                  {t("clubs.form.fields.activityTypes.label")}
                </h5>
                <div className="d-flex flex-wrap gap-1">
                  {club.activityTypeIds.map((activityTypeId) => {
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
                  })}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="col-xxl-4">
            <Card>
              <CardBody>
                <h5 className="card-title mb-3">{t("clubs.view.contact")}</h5>

                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <i className="ri-mail-line text-muted" aria-hidden="true" />
                    <span>{club.email || t("clubs.view.notProvided")}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <i
                      className="ri-phone-line text-muted"
                      aria-hidden="true"
                    />
                    <span>{club.phone || t("clubs.view.notProvided")}</span>
                  </div>

                  <SocialLink
                    href={
                      club.instagram
                        ? `https://instagram.com/${club.instagram}`
                        : ""
                    }
                    icon="ri-instagram-line text-muted"
                    label={club.instagram}
                  />

                  <SocialLink
                    href={
                      club.facebook
                        ? `https://facebook.com/${club.facebook}`
                        : ""
                    }
                    icon="ri-facebook-box-fill text-muted"
                    label={club.facebook}
                  />

                  <SocialLink
                    href={club.telegram ? `https://t.me/${club.telegram}` : ""}
                    icon="ri-telegram-fill text-muted"
                    label={club.telegram}
                  />

                  <SocialLink
                    href={club.website}
                    icon="ri-global-line text-muted"
                    label={club.website}
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "legal" && (
        <div className="row">
          <div className="col-xxl-8">
            <Card>
              <CardBody>
                <h5 className="card-title mb-3">
                  {t("clubs.form.steps.legal")}
                </h5>

                <div className="d-flex flex-column gap-3">
                  <div>
                    <div className="text-muted fs-13">
                      {t("clubs.form.fields.entityType.label")}
                    </div>
                    <div>
                      {club.entityType
                        ? t(`clubs.entityTypes.${club.entityType}`)
                        : t("clubs.view.notProvided")}
                    </div>
                  </div>

                  {requiresTaxId && (
                    <div>
                      <div className="text-muted fs-13">
                        {t("clubs.form.fields.taxId.label")}
                      </div>
                      <div>{club.taxId || t("clubs.view.notProvided")}</div>
                    </div>
                  )}

                  {requiresOwnerId && (
                    <div>
                      <div className="text-muted fs-13 mb-2">
                        {t("clubs.form.fields.ownerIdDocument.label")}
                      </div>
                      {club.hasOwnerIdDocument ? (
                        canViewIdDocument ? (
                          <OwnerIdDocumentDownload clubId={club.id} />
                        ) : (
                          <Badge variant="success" appearance="subtle" pill>
                            {t("clubs.view.uploaded")}
                          </Badge>
                        )
                      ) : (
                        <span className="text-muted">
                          {t("clubs.view.notUploaded")}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

export default ClubProfileView;
