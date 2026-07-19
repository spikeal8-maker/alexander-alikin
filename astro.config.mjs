import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const PRELAUNCH = process.env.SITE_MODE !== "production";
const SITE_URL = process.env.SITE_URL ?? "https://spikeal8-maker.github.io";
const BASE_PATH = "/alexander-alikin";

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap({ filter: PRELAUNCH ? () => false : undefined })],
  devToolbar: { enabled: false },
  build: {
    format: "directory",
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
  markdown: {
    gfm: true,
  },
});
