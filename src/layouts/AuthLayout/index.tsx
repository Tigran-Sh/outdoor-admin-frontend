import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "@/components/ui/LanguageSwitcher/LanguageSwitcher";

function AuthLayout() {
  const { t } = useTranslation();

  return (
    <div className="auth-page-wrapper pt-5">
      <div
        className="position-fixed top-0 m-3"
        style={{ zIndex: 1000, right: "130px" }}
      >
        <LanguageSwitcher />
      </div>

      <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
        <div className="bg-overlay" />

        <div className="shape">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 1440 120"
          >
            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z" />
          </svg>
        </div>
      </div>

      <Outlet />

      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <p className="mb-0 text-muted">
                  {t("footer.copyright", { year: new Date().getFullYear() })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AuthLayout;
