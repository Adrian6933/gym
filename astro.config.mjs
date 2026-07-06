// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://fitpulse.app",
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !["workout", "stats", "history", "settings"].some((p) =>
          page.includes(`/${p}`),
        ),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
