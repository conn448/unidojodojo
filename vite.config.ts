// @lovable.dev/vite-tanstack-config already includes the framework plugins.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // GitHub Pages publishes this repository below /unidojodojo/.
  // Keep local development at / while making every production asset resolvable.
  vite: {
    base: process.env["NODE_ENV"] === "production" ? "/unidojodojo/" : "/",
  },
  tanstackStart: {
    server: { entry: "server" },
    // GitHub Pages only serves static files: prerender a client-rendered shell
    // as index.html (the deploy workflow copies it to 404.html for deep links).
    spa: {
      enabled: true,
      prerender: { outputPath: "/index.html" },
    },
  },
});
