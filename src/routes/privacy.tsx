import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/components/unidojo/pages";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => pageMeta("Privacy and data â€” UniDojo", "Export your data or delete your account at any time."),
  component: PrivacyPage,
});
