import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Plain Vite config owned by this repository. It replaces the former
// @lovable.dev/vite-tanstack-config wrapper so the project no longer depends on
// Lovable for building. The plugin list, alias, dedupe set, optimizeDeps and
// dev-server port below intentionally mirror what that wrapper configured.
//
// There is deliberately NO nitro/SSR server plugin: this app ships as a purely
// static client-side SPA, and .github/workflows/deploy-pages.yml publishes the
// `dist` directory that vite build emits.
export default defineConfig(({ mode }) => {
  // Expose VITE_* variables from .env to client code (same contract as before).
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const define: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    define[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define,

    // GitHub Pages publishes this repository below /unidojodojo/.
    // Keep local development at / while making every production asset resolvable.
    // A root-hosted deploy (Vercel) sets VITE_BASE=/ to override the prefix.
    base:
      process.env["VITE_BASE"] ??
      (process.env["NODE_ENV"] === "production" ? "/unidojodojo/" : "/"),

    css: { transformer: "lightningcss" },

    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      ignoreOutdatedRequests: true,
    },

    // `host: "::"` binds to every interface so the LAN URL works on a phone.
    // allowedHosts names the temporary Cloudflare quick tunnel used to give the
    // local preview a public URL; Vite otherwise rejects any non-localhost Host
    // header with "Blocked request. This host is not allowed."
    server: {
      host: "::",
      port: 8080,
      allowedHosts: [".trycloudflare.com"],
    },

    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        // Fail the build if server-only code is pulled into the client graph.
        importProtection: {
          behavior: "error",
          client: { files: ["**/server/**"], specifiers: ["server-only"] },
        },
        server: { entry: "server" },
        // GitHub Pages only serves static files: prerender a client-rendered
        // shell as index.html (the deploy workflow copies it to 404.html so
        // deep links still resolve).
        spa: {
          enabled: true,
          prerender: { outputPath: "/index.html" },
        },
      }),
      viteReact(),
    ],
  };
});
