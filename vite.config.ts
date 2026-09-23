// @lovable.dev/vite-tanstack-config already includes the framework plugins.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // GitHub Pages publishes this repository below /unidojodojo/.
  // Keep local development at / while making every production asset resolvable.
  vite: {
    base: process.env.NODE_ENV === "production" ? "/unidojodojo/" : "/",
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
