/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = import.meta.dirname;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src")
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3's SCSS still relies on legacy `@import` and the old
        // global color functions, which are supported but deprecated in
        // newer Dart Sass. Silence those specific warnings instead of the
        // deprecation noise on every build; `quietDeps` additionally mutes
        // anything genuinely coming from node_modules.
        silenceDeprecations: ["import", "color-functions", "global-builtin", "if-function"],
        quietDeps: true,
      },
    },
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});