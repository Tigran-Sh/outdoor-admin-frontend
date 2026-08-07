import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Avatar from "@/components/ui/Avatar/Avatar";
import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Card, { CardBody } from "@/components/ui/Card/Card";
import { useObjectUrl } from "@/hooks/useObjectUrl";

import {
  ACTIVITY_TYPES,
  CLUB_STATUS_BADGE_VARIANT,
  getClubVerificationStatus,
  mockClubs,
} from "./ClubsPage.data";

const myClub = mockClubs[0];

type ProfileTab = "overview" | "legal";

function SocialLink({ href, icon, label }: { href: string; icon: string; label: string }) {
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
      <i className="ri-external-link-line fs-13 text-muted" aria-hidden="true" />
    </a>
  );
}

function ClubViewPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  const logoUrl = useObjectUrl(myClub.logo[0]);
  const coverImageUrl = useObjectUrl(myClub.coverImage[0]);

  const status = getClubVerificationStatus(myClub);
  const requiresTaxId = myClub.entityType === "soleTrader" || myClub.entityType === "llc";
  const requiresOwnerId = myClub.entityType === "individual" || myClub.entityType === "informal";
  const ownerIdDocumentUrl = useObjectUrl(myClub.ownerIdDocument[0]);

  return (
    <>
      <Breadcrumbs title={myClub.name} />

      <div className="profile-foreground position-relative mx-n4 mt-n4">
        <div className="profile-wid-bg">
          {coverImageUrl && <img src={coverImageUrl} alt="" className="profile-wid-img" />}
        </div>
      </div>

      <div className="pt-4 mb-4 mb-lg-3 pb-lg-4">
        <div className="row g-4">
          <div className="col-auto">
            <Avatar src={logoUrl} name={myClub.name} size="lg" className="img-thumbnail" />
          </div>

          <div className="col">
            <div className="p-2">
              <h3 className="text-white mb-1">
                {myClub.name}
                {status === "fullyVerified" && (
                  <i
                    className="ri-verified-badge-fill text-info ms-1 align-middle"
                    aria-label={t("clubs.status.fullyVerified")}
                  />
                )}
              </h3>
              <p className="text-white text-opacity-75 mb-2">
                {t(`clubs.entityTypes.${myClub.entityType}`)}
              </p>
              <div className="hstack text-white-50 gap-3 flex-wrap">
                <div>
                  <i className="ri-map-pin-line me-1 align-middle" aria-hidden="true" />
                  {t(`regions.${myClub.baseRegion}`)}
                </div>
                {myClub.yearFounded && (
                  <div>
                    <i className="ri-calendar-line me-1 align-middle" aria-hidden="true" />
                    {myClub.yearFounded}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-auto order-last order-lg-0">
            <div className="p-2">
              <Badge variant={CLUB_STATUS_BADGE_VARIANT[status]} appearance="subtle" pill>
                {t(`clubs.status.${status}`)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
        <ul className="nav nav-pills profile-nav gap-2 flex-grow-1" role="tablist">
          <li className="nav-item">
            <button
              type="button"
              className={activeTab === "overview" ? "nav-link active" : "nav-link"}
              onClick={() => setActiveTab("overview")}
            >
              {t("clubs.view.tabs.overview")}
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={activeTab === "legal" ? "nav-link active" : "nav-link"}
              onClick={() => setActiveTab("legal")}
            >
              {t("clubs.view.tabs.legal")}
            </button>
          </li>
        </ul>

        <Link to="/club/profile/edit" className="btn btn-success">
          <i className="ri-edit-box-line align-bottom me-1" aria-hidden="true" />
          {t("clubs.view.editProfile")}
        </Link>
      </div>

      {activeTab === "overview" && (
        <div className="row">
          <div className="col-xxl-8">
            <Card>
              <CardBody>
                <h5 className="card-title mb-3">{t("clubs.form.fields.about.label")}</h5>
                <p className="text-muted mb-0">{myClub.about}</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h5 className="card-title mb-3">{t("clubs.form.fields.activityTypes.label")}</h5>
                <div className="d-flex flex-wrap gap-1">
                  {myClub.activityTypeIds.map((activityTypeId) => {
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
                    <span>{myClub.email}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <i className="ri-phone-line text-muted" aria-hidden="true" />
                    <span>{myClub.phone}</span>
                  </div>

                  <SocialLink
                    href={
                      myClub.instagram ? `https://instagram.com/${myClub.instagram}` : ""
                    }
                    icon="ri-instagram-line text-muted"
                    label={myClub.instagram}
                  />

                  <SocialLink
                    href={myClub.facebook ? `https://facebook.com/${myClub.facebook}` : ""}
                    icon="ri-facebook-box-fill text-muted"
                    label={myClub.facebook}
                  />

                  <SocialLink
                    href={myClub.telegram ? `https://t.me/${myClub.telegram}` : ""}
                    icon="ri-telegram-fill text-muted"
                    label={myClub.telegram}
                  />

                  <SocialLink
                    href={myClub.website}
                    icon="ri-global-line text-muted"
                    label={myClub.website}
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
                <h5 className="card-title mb-3">{t("clubs.form.steps.legal")}</h5>

                <div className="d-flex flex-column gap-3">
                  <div>
                    <div className="text-muted fs-13">
                      {t("clubs.form.fields.entityType.label")}
                    </div>
                    <div>{t(`clubs.entityTypes.${myClub.entityType}`)}</div>
                  </div>

                  {requiresTaxId && (
                    <div>
                      <div className="text-muted fs-13">
                        {t("clubs.form.fields.taxId.label")}
                      </div>
                      <div>{myClub.taxId || t("clubs.view.notProvided")}</div>
                    </div>
                  )}

                  {requiresOwnerId && (
                    <div>
                      <div className="text-muted fs-13 mb-2">
                        {t("clubs.form.fields.ownerIdDocument.label")}
                      </div>
                      {ownerIdDocumentUrl ? (
                        <img
                          src={ownerIdDocumentUrl}
                          alt=""
                          className="rounded border"
                          style={{ width: 160, height: 100, objectFit: "cover" }}
                        />
                      ) : (
                        <span className="text-muted">{t("clubs.view.notUploaded")}</span>
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

export default ClubViewPage;
