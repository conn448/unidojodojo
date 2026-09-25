import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/components/unidojo/pages";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/profile")({
  head: () => pageMeta("Your profile â€” UniDojo", "Your learning stats and account."),
  component: ProfilePage,
});
