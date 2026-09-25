import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/unidojo/pages";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/settings")({
  head: () => pageMeta("Settings â€” UniDojo", "Sound, language, motion and text size."),
  component: SettingsPage,
});
