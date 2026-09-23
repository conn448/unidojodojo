import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: process.env.NODE_ENV === "production" ? "/unidojodojo/" : "/",
  },
  tanstackStart: undefined,
});
