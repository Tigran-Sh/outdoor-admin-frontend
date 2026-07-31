import { useTranslation } from "react-i18next";

import type { AuthCardProps } from "./AuthCard.types";

/**
 * Shared chrome for the auth pages (Login, Forgot password, ...):
 * the branding header + card wrapper. Pages only need to provide
 * what goes inside `.card-body.p-4` via `children`, plus optional
 * content below the card via `afterCard`.
 */
function AuthCard({ children, afterCard }: AuthCardProps) {
  const { t } = useTranslation();

  return (
    <div className="auth-page-content">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="text-center mt-sm-5 mb-4 text-white-50">
              <h2 className="text-white">{t("app.name")}</h2>
              <p className="mt-3 fs-15 fw-medium text-light">{t("auth.tagline")}</p>
            </div>

            <div className="card mt-4">
              <div className="card-body p-4">{children}</div>
            </div>

            {afterCard}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthCard;
