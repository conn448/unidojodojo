import { createFileRoute } from "@tanstack/react-router";
import { SocietyPage } from "@/components/unidojo/pages";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/society")({
  head: () => pageMeta("Your society â€” UniDojo", "See how your society is learning together."),
  component: SocietyPage,
});
