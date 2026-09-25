/**
 * The Lesson of the Day, as a game.
 *
 * Three screens: the briefing before you start, the challenge itself, and the
 * scoreboard. The challenge is the ordinary lesson player — this module only
 * adds what makes it a game: a combo that builds while you are right, a
 * multiplier that pays out, and a hard stop at one run per day so the reward
 * cannot be farmed.
 *
 * Every date-dependent value comes from `useDaily`, which reads the clock and
 * storage inside an effect. Nothing here touches `new Date()` or localStorage
 * during render, because the site is prerendered to static HTML and a mismatched
 * first paint would break hydration.
 */
import { Link } from "@tanstack/react-router";
import { ChevronRight, Flame, Play, Sparkles, Trophy, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Mascot, Page, useApp, useCopy } from "@/components/unidojo/app";
import { LessonPlayer, type LessonFinish } from "@/components/unidojo/player";
import { DAILY_QUESTIONS, dailyPlan } from "@/lib/daily";
import { markDailyDone, useDaily } from "@/lib/use-daily";
import { useNation } from "@/lib/use-nation";
import { cn } from "@/lib/utils";

/** Combo stops climbing here. Past x5 the reward stops meaning anything. */
const MAX_MULTIPLIER = 5;

/** Paid for a flawless run, over and above the per-combo bonus. */
const PERFECT_BONUS = 50;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Page nav={false}>
      <div className="mx-auto flex min-h-[calc(100dvh-2.5rem)] max-w-md flex-col">{children}</div>
    </Page>
  );
}

function TopBar({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-between pt-1">
      <Link
        to="/home"
        aria-label={label ?? "Close"}
        className="grid size-11 flex-none place-items-center rounded-full text-muted-foreground hover:bg-muted"
      >
        <X className="size-6" />
      </Link>
    </div>
  );
}

export function DailyChallenge() {
  const { locale, play, completeLesson, addPoints, streak } = useApp();
  const t = useCopy();
  const { nation, ready: nationReady } = useNation();
  const daily = useDaily();

  const [started, setStarted] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [finish, setFinish] = useState<LessonFinish | null>(null);
  const [bonus, setBonus] = useState(0);

  const plan = useMemo(
    () => (daily.day ? dailyPlan(daily.day, nation) : null),
    [daily.day, nation],
  );

  // The clock can cross midnight while this page is open, and `useDaily` ticks
  // every second, so the run in progress is dropped when the day changes. The
  // next challenge is then already loaded and ready to start.
  useEffect(() => {
    setStarted(false);
    setFinish(null);
    setCombo(0);
    setBestCombo(0);
    setBonus(0);
  }, [daily.day]);

  if (!daily.day || !nationReady || !plan) {
    return (
      <Page nav={false}>
        <div className="min-h-[70dvh]" />
      </Page>
    );
  }

  const multiplier = Math.min(combo + 1, MAX_MULTIPLIER);
  const isArabic = locale === "ar";

  const handleAnswer = (correct: boolean) => {
    const next = correct ? combo + 1 : 0;
    setCombo(next);
    if (next > bestCombo) setBestCombo(next);
  };

  const handleFinish = (result: LessonFinish) => {
    // The existing daily gate drives points and the streak, so finishing this
    // counts as the day's lesson. The combo bonus is the game's extra layer.
    completeLesson();
    const earned =
      result.accuracy === 100 ? PERFECT_BONUS : Math.min(bestCombo, MAX_MULTIPLIER) * 5;
    if (earned > 0) addPoints(earned);
    markDailyDone({ score: result.accuracy, combo: bestCombo });
    setBonus(earned);
    setFinish(result);
  };

  /* ---------- scoreboard ---------- */
  if (finish) {
    const perfect = finish.accuracy === 100;
    return (
      <Shell>
        <TopBar />
        <div className="my-auto py-8 text-center">
          <Mascot pose="success" className="mx-auto mb-6 scale-125" />
          <p className="reward-kicker mx-auto">
            {perfect ? t.dailyPerfect : t.dailyDone}
          </p>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight">
            {plan.theme.title[locale]}
          </h1>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <Score value={String(finish.xp)} label="XP" />
            <Score value={`${finish.accuracy}%`} label={isArabic ? "الدقة" : "Accuracy"} />
            <Score value={`${finish.correct}/${finish.total}`} label={isArabic ? "صحيح" : "Correct"} />
          </div>

          {bonus > 0 && (
            <p className="reward-pill amber mx-auto mt-6">
              <Sparkles />
              {t.dailyBonus} <strong>+{bonus}</strong>
            </p>
          )}

          <p className="mt-6 leading-relaxed text-muted-foreground">
            {t.dailyCombo}: <strong>x{Math.min(Math.max(bestCombo, 1), MAX_MULTIPLIER)}</strong>
            {" · "}
            {t.dailyBest}: <strong>{daily.best}</strong>
          </p>

          <p className="mt-3 text-sm text-muted-foreground">
            {t.dailyStreak}: <strong>{streak}</strong>
          </p>

          <Link
            to="/home"
            className="btn-3d mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-button bg-primary px-6 font-extrabold text-primary-foreground"
          >
            <Trophy className="size-5" />
            {isArabic ? "العودة للمسار" : "Back to my path"}
          </Link>
          <p className="mt-5 text-sm text-muted-foreground">
            {t.dailyTomorrow} <strong className="tabular-nums">{daily.reset}</strong>
          </p>
        </div>
      </Shell>
    );
  }

  /* ---------- already done today ---------- */
  if (daily.done) {
    return (
      <Shell>
        <TopBar />
        <div className="my-auto py-10 text-center">
          <Mascot pose="success" className="mx-auto mb-8 scale-125" />
          <p className="reward-kicker mx-auto">{t.dailyDone}</p>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight">
            {plan.theme.title[locale]}
          </h1>
          <p className="mt-4 text-muted-foreground">{t.dailyStreakKeep}</p>

          <div className="mt-8 grid grid-cols-2 gap-3 text-center">
            {daily.score !== null && (
              <Score value={`${daily.score}%`} label={isArabic ? "الدقة" : "Accuracy"} />
            )}
            <Score value={String(daily.best)} label={t.dailyBest} />
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            {t.dailyTomorrow} <strong className="tabular-nums">{daily.reset}</strong>
          </p>

          <Link
            to="/home"
            className="btn-3d mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-button bg-primary px-6 font-extrabold text-primary-foreground"
          >
            {isArabic ? "العودة للمسار" : "Back to my path"}
          </Link>
        </div>
      </Shell>
    );
  }

  /* ---------- the challenge ---------- */
  if (started) {
    return (
      <LessonPlayer
        lessonId={plan.lesson.id}
        lesson={plan.lesson}
        exitTo="/daily"
        onAnswer={handleAnswer}
        onFinish={handleFinish}
        hud={
          combo >= 1 ? (
            <span
              key={combo}
              className="combo-meter"
              aria-label={`${t.dailyCombo} x${multiplier}`}
              title={`${t.dailyCombo} x${multiplier}`}
            >
              <Flame className="size-4" />
              <strong className="tabular-nums">x{multiplier}</strong>
            </span>
          ) : null
        }
      />
    );
  }

  /* ---------- briefing ---------- */
  return (
    <Shell>
      <TopBar />
      <div className="my-auto py-10 text-center">
        <Mascot pose="wave" className="mx-auto mb-8 scale-125" />
        <p className="reward-kicker mx-auto">
          {t.dailyTitle} · {isArabic ? `اليوم ${plan.number}` : `Day ${plan.number}`}
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight">
          {plan.theme.title[locale]}
        </h1>
        <p className="mt-4 text-muted-foreground">{plan.theme.blurb[locale]}</p>

        <p className="mt-6 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          {DAILY_QUESTIONS} {t.dailyMeta}
        </p>

        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="reward-pill amber" aria-label={t.dailyStreak}>
            <Flame />
            <strong>{streak}</strong>
          </span>
          <span className="reward-pill mint">
            <Sparkles />
            <strong>+{plan.lesson.xp}</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            play("tap");
            setStarted(true);
          }}
          className="btn-3d btn-3d-gold mt-9 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-button px-6 text-lg font-extrabold"
        >
          <Play className="size-5" />
          {t.dailyStart}
        </button>

        <p className="mt-5 text-sm text-muted-foreground">
          {t.dailyTomorrow} <strong className="tabular-nums">{daily.reset}</strong>
        </p>

        <div className="mt-8 text-start">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {isArabic ? "من هذه الدروس" : "Drawn from"}
          </p>
          <ul className="mt-2 space-y-1">
            {plan.lessonTitles.map((title) => (
              <li key={title.en} className="flex items-center gap-2 text-sm">
                <ChevronRight className="directional size-4 flex-none text-muted-foreground" />
                <span className="truncate">{title[locale]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Shell>
  );
}

function Score({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-card bg-muted p-4">
      <strong className="block font-display text-xl tabular-nums">{value}</strong>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
