import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import { I18nProvider, QueryProvider, ThemeProvider } from "./app/providers";

import "./styles/main.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <QueryProvider>
          <App />
        </QueryProvider>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
