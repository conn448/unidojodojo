/**
 * Compatibility view over `curriculum.ts`.
 *
 * The screens in `pages.tsx` and `app.tsx` were written against an older flat
 * shape (tracks → lessons, plus a hardcoded daily runway). Rather than rewrite
 * every screen at once, this module projects the real curriculum into that
 * shape, so the UI immediately reflects every track, unit and lesson that
 * actually exists — and a lesson can never appear in the UI without content,
 * or vice versa.
 */
import { coreTracks, tracks as curriculumTracks, type Locale } from "./curriculum";

export type { Locale };

export interface TrackSummary {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  icon: string;
  /** Optional branches are surfaced but never gated. */
  optional: boolean;
  lessons: Array<{ id: string; title: Record<Locale, string>; minutes: number; locked: boolean }>;
}

export const tracks: TrackSummary[] = curriculumTracks.map((track) => ({
  id: track.id,
  title: track.title,
  description: track.tagline,
  icon: track.icon,
  // Coerced to a real boolean because `exactOptionalPropertyTypes` is on.
  optional: Boolean(track.optional),
  lessons: track.units.flatMap((unit) =>
    unit.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      minutes: lesson.minutes,
      // Gating is switched off for now: every lesson is open. Kept as a
      // field so a future release can lock behind progress without a refactor.
      locked: false,
    })),
  ),
}));

export type RunwayKind = "review" | "lesson";
export type RunwayState = "done" | "active" | "available" | "locked";

export interface RunwayNode {
  id: string;
  title: Record<Locale, string>;
  kind: RunwayKind;
  state: RunwayState;
}

/** First core track drives the daily path, so it stays in step automatically. */
const firstTrackLessons = coreTracks[0]?.units.flatMap((unit) => unit.lessons) ?? [];

/**
 * Was hardcoded; now derived. Progress states are still placeholders until
 * real account progress lands, but the lessons themselves are the real ones.
 */
export const dailyRunway: RunwayNode[] = [
  {
    id: "__warmup",
    title: { en: "Know where it goes", ar: "اعرف أين يذهب مالك" },
    kind: "review",
    state: "done",
  },
  ...firstTrackLessons.slice(0, 3).map(
    (lesson, i): RunwayNode => ({
      id: lesson.id,
      title: lesson.title,
      kind: "lesson",
      state: i === 0 ? "active" : i === 1 ? "available" : "locked",
    }),
  ),
];
