import { createFileRoute } from "@tanstack/react-router";
import { DailyChallenge } from "@/components/unidojo/daily";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/daily")({
  head: () =>
    pageMeta(
      "Lesson of the Day — UniDojo",
      "A new money challenge every day: one idea, five questions, and a streak worth keeping.",
    ),
  component: DailyChallenge,
});
