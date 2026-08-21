import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import Badge from "@/components/ui/Badge/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card/Card";

import { listCapabilities, listRoles } from "@/services/adminRoles.api";

function RolesPage() {
  const { t } = useTranslation();

  const rolesQuery = useQuery({ queryKey: ["admin-roles"], queryFn: listRoles });
  const capabilitiesQuery = useQuery({
    queryKey: ["admin-capabilities"],
    queryFn: listCapabilities,
  });

  const isError = rolesQuery.isError || capabilitiesQuery.isError;

  return (
    <>
      <Breadcrumbs title={t("admin.roles.title")} />

      {isError ? (
        <div className="alert alert-danger d-flex align-items-center justify-content-between">
          <span>{t("common.loadError")}</span>
          <Button
            variant="danger"
            appearance="outline"
            size="sm"
            onClick={() => {
              rolesQuery.refetch();
              capabilitiesQuery.refetch();
            }}
          >
            {t("common.retry")}
          </Button>
        </div>
      ) : (
        <>
          <div className="row">
            {(rolesQuery.data ?? []).map((role) => (
              <div key={role.key} className="col-lg-6">
                <Card>
                  <CardHeader title={t(`admin.roleNames.${role.key}`)} />
                  <CardBody>
                    {role.capabilities.length === 0 ? (
                      <p className="text-muted mb-0">{t("admin.users.empty")}</p>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        {role.capabilities.map((capability) => (
                          <Badge key={capability} variant="primary" appearance="subtle">
                            {t(`admin.capabilityNames.${capability}`)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader title={t("admin.roles.capabilitiesSectionTitle")} />
            <CardBody>
              <div className="d-flex flex-wrap gap-2">
                {(capabilitiesQuery.data ?? []).map((capability) => (
                  <Badge key={capability.key} variant="secondary" appearance="subtle">
                    {t(`admin.capabilityNames.${capability.key}`)}
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </>
  );
}

export default RolesPage;
