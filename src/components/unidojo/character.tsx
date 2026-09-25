/**
 * Financial Character card.
 *
 * A game-profile summary of progression the app already tracks. It reads `points`
 * and `streak` from the existing app context and derives the level with the same
 * arithmetic the home screen uses, so the two screens can never disagree.
 *
 * No state, no storage, no network, no new progression: the belt is just a name
 * for the level (see `@/lib/belts`). Styling is the existing card shell, reward
 * pill and progress bar, so nothing new was invented to make it look like a game.
 */
import { Flame } from "lucide-react";
import { Mascot, useApp, useCopy } from "@/components/unidojo/app";
import { LEVELS_PER_BELT, POINTS_PER_LEVEL, beltFor } from "@/lib/belts";

export function CharacterCard({ points, streak }: { points: number; streak: number }) {
  const { locale } = useApp();
  const t = useCopy();

  const level = Math.floor(points / POINTS_PER_LEVEL) + 1;
  const levelProgress = points % POINTS_PER_LEVEL;
  const { belt, next } = beltFor(level);

  // Progress across the whole belt, not just the current level. At the top belt
  // there is nothing left to reach, so the bar simply sits full.
  const beltProgress = next
    ? Math.min(
        Math.round(
          ((((level - 1) % LEVELS_PER_BELT) * POINTS_PER_LEVEL + levelProgress) /
            (LEVELS_PER_BELT * POINTS_PER_LEVEL)) *
            100,
        ),
        100,
      )
    : 100;

  return (
    <section className="mt-7 flex items-center gap-4 rounded-card border bg-card p-4">
      <span className="grid size-16 flex-none place-items-center rounded-card bg-accent-soft">
        <Mascot pose="wave" />
      </span>

      <div className="min-w-0 grow">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
            {t.characterTitle}
          </span>
          <span className="reward-pill amber" aria-label={`${streak} ${t.dailyStreak}`}>
            <Flame />
            <strong>{streak}</strong>
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span
            className="size-6 flex-none rounded-full border"
            style={{ background: belt.color }}
            aria-hidden="true"
          />
          <strong className="truncate font-display text-lg">{belt.name[locale]}</strong>
        </div>

        <div className="mt-1 flex justify-between text-sm">
          <span className="font-semibold">
            {t.level} {level}
          </span>
          <span className="tabular-nums text-muted-foreground">{points} XP</span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${beltProgress}%` }}
          />
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {next ? `${t.nextBelt}: ${next.name[locale]}` : t.maxBelt}
        </p>
      </div>
    </section>
  );
}
