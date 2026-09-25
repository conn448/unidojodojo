import { Link } from "@tanstack/react-router";
import { Check, Heart, Info, Lightbulb, RotateCcw, Sparkles, Trophy, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Mascot, Page, useApp } from "@/components/unidojo/app";
import { findLesson, stepPhase, stepsFor, type L, type Locale, type Step } from "@/lib/curriculum";
import { useNation } from "@/lib/use-nation";
import { useAuth } from "@/lib/use-auth";
import { saveAnswer, saveLessonResult } from "@/lib/use-progress";
import type { Json } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

const MAX_HEARTS = 5;

const pick = (value: L | undefined, locale: Locale) => (value ? value[locale] : "");

/** Deterministic shuffle so an exercise looks the same every time you open it. */
function shuffle<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i -= 1) {
    s = (s * 1103515245 + 12345) % 2147483648;
    const j = s % (i + 1);
    const swap = out[i] as T;
    out[i] = out[j] as T;
    out[j] = swap;
  }
  return out;
}

type Answer =
  | { kind: "none" }
  | { kind: "choice"; index: number }
  | { kind: "scenario"; index: number }
  | { kind: "order"; order: number[] }
  | { kind: "fill"; picked: number[] }
  | { kind: "numeric"; value: string }
  | { kind: "categorise"; placed: Record<string, number> }
  | { kind: "match"; matched: string[]; active: number | null };

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const { locale, play, completeLesson } = useApp();
  const { user } = useAuth();
  const { nation, setNation, ready: nationReady } = useNation();
  const entry = useMemo(() => findLesson(lessonId), [lessonId]);

  // Nation-specific steps are filtered out for other nations, so a lesson only
  // ever tells the student something true about their own system.
  const steps = useMemo<Step[]>(
    () => (entry ? stepsFor(entry.lesson.steps, nation) : []),
    [entry, nation],
  );
  // Accuracy and XP are scored on practice steps only: teach steps must never
  // be marked wrong because there is nothing to get wrong yet.
  const practice = useMemo(() => steps.filter((s) => stepPhase(s) === "practice"), [steps]);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"answer" | "correct" | "wrong">("answer");
  const [answer, setAnswer] = useState<Answer>({ kind: "none" });
  const [missed, setMissed] = useState<number[]>([]);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [xp, setXp] = useState(0);
  const [outcome, setOutcome] = useState<"playing" | "finished" | "dead">("playing");
  const [showSources, setShowSources] = useState(false);

  useEffect(() => {
    if (!showSources) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSources(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showSources]);

  const restart = () => {
    setIndex(0);
    setAnswer({ kind: "none" });
    setPhase("answer");
    setMissed([]);
    setHearts(MAX_HEARTS);
    setXp(0);
    setOutcome("playing");
  };

  /* ---------- asked once, before any nation-specific content ---------- */
  if (!nationReady) {
    return (
      <Page nav={false}>
        <div className="min-h-[70dvh]" />
      </Page>
    );
  }
  /* ---------- lesson not written yet ---------- */
  if (!entry || steps.length === 0) {
    return (
      <Page nav={false}>
        <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col items-center justify-center text-center">
          <Mascot pose="reading" className="mb-6 scale-125" />
          <h1 className="font-display text-2xl font-extrabold">
            {locale === "ar" ? "هذا الدرس قيد الإعداد" : "This lesson is being written"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {locale === "ar"
              ? "المحتوى قادم قريباً. جرّب درساً آخر من مسارك."
              : "The content is coming soon. Try another lesson from your path."}
          </p>
          <Link
            to="/home"
            className="btn-3d mt-8 inline-flex min-h-12 items-center rounded-button bg-primary px-6 font-extrabold text-primary-foreground"
          >
            {locale === "ar" ? "عودة للمسار" : "Back to my path"}
          </Link>
        </div>
      </Page>
    );
  }

  /* ---------- out of hearts ---------- */
  if (outcome === "dead") {
    return (
      <Page nav={false}>
        <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col items-center justify-center text-center">
          <Heart className="size-14 fill-current text-destructive" />
          <h1 className="mt-6 font-display text-3xl font-extrabold">
            {locale === "ar" ? "نفدت القلوب" : "You are out of hearts"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {locale === "ar"
              ? "الأخطاء جزء من التعلّم. أعد المحاولة وستثبت الفكرة."
              : "Mistakes are part of learning. Run it again and the idea will stick."}
          </p>
          <button
            type="button"
            onClick={restart}
            className="btn-3d mt-8 inline-flex min-h-12 items-center gap-2 rounded-button bg-primary px-6 font-extrabold text-primary-foreground"
          >
            <RotateCcw className="size-5" />
            {locale === "ar" ? "أعد المحاولة" : "Try again"}
          </button>
        </div>
      </Page>
    );
  }

  /* ---------- resulpractice.length
      ? Math.round(((practice.length - missed.length) / practic
    const accuracy = interactive.length
      ? Math.round(((interactive.length - missed.length) / interactive.length) * 100)
      : 100;
    return (
      <Page nav={false}>
        <div className="mx-auto max-w-md py-6">
          <div className="text-center">
            <Mascot pose="success" className="mx-auto mb-6 scale-150" />
            <p className="reward-kicker mx-auto">{locale === "ar" ? "أكملت الدرس" : "Lesson complete"}</p>
            <h1 className="mt-4 font-display text-4xl font-extrabold">
              {locale === "ar" ? "أحسنت!" : "Nice work!"}
            </h1>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <Stat icon={<Sparkles className="size-5 text-gold" />} value={String(Math.round(xp))} label="XP" />
            <Stat
              icon={<Check className="size-5 text-primary" />}
              value={`${accuracy}%`}
              label={locale === "ar" ? "الدقة" : "Accuracy"}
            />
            <Stat
              icon={<Heart className="size-5 fill-current text-destructive" />}
              value={String(hearts)}
              label={locale === "ar" ? "القلوب" : "Hearts"}
            />
          </div>

          {missed.length > 0 && (
            <div className="mt-6 rounded-card border-2 border-destructive/30 bg-destructive/5 p-5">
              <h2 className="font-display text-lg font-extrabold">
                {locale === "ar" ? "راجع هذه" : "Review these"}
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {missed.map((stepIndex) => (
                  <li key={stepIndex} className="flex gap-2">
                    <X className="mt-0.5 size-4 flex-none text-destructive" />
                    <span>{pick((steps[stepIndex] as { prompt: L }).prompt, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            to="/home"
            className="btn-3d mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-button bg-primary px-6 font-extrabold text-primary-foreground"
          >
            <Trophy className="size-5" />
            {locale === "ar" ? "أكمل" : "Finish"}
          </Link>
        </div>
      </Page>
    );
  }

  /* ---------- finished ---------- */
  if (outcome === "finished") {
    const practiceCount = Math.max(practice.length, 1);
    const wrongCount = Math.min(missed.length, practiceCount);
    const correctCount = Math.max(practiceCount - wrongCount, 0);
    const accuracy = Math.round((correctCount / practiceCount) * 100);
    return (
      <Page nav={false}>
        <div className="mx-auto flex min-h-[80dvh] max-w-md flex-col justify-center text-center">
          <Mascot pose="success" className="mx-auto mb-6 scale-125" />
          <p className="reward-kicker">{locale === "ar" ? "أكملت الدرس" : "Lesson complete"}</p>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight">
            {pick(entry.lesson.title, locale)}
          </h1>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Stat
              icon={<Sparkles className="size-5 text-gold" />}
              value={String(Math.round(xp))}
              label="XP"
            />
            <Stat
              icon={<Heart className="size-5 fill-current text-destructive" />}
              value={`${accuracy}%`}
              label={locale === "ar" ? "الدقة" : "Accuracy"}
            />
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            {locale === "ar"
              ? `${correctCount} من ${practiceCount} إجابة صحيحة`
              : `${correctCount} of ${practiceCount} correct`}
          </p>
          {accuracy < 100 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {locale === "ar"
                ? "إعادة الدرس تثبّت ما فاتك."
                : "Running it again will settle what slipped."}
            </p>
          )}
          <Link
            to="/home"
            className="btn-3d mt-8 inline-flex min-h-14 items-center justify-center rounded-button bg-primary px-6 font-extrabold text-primary-foreground"
          >
            {locale === "ar" ? "العودة للمسار" : "Back to my path"}
          </Link>
        </div>
      </Page>
    );
  }

  /* ---------- playing ---------- */
  const step = steps[index];
  // index is state and steps can shrink when a nation is picked, so guard.
  if (!step) {
    return (
      <Page nav={false}>
        <div className="min-h-[70dvh]" />
      </Page>
    );
  }
  const isLast = index + 1 >= steps.length;

  const handleCheck = (correct: boolean) => {
    // Recorded whether right or wrong. Never awaited, because a dropped write
    // must not interrupt the lesson or cost the learner a heart.
    if (user && entry) {
      void saveAnswer({
        userId: user.id,
        lessonId: entry.lesson.id,
        questionId: String(index),
        answer: answer as unknown as Json,
        correct,
      });
    }
    if (correct) {
      play("win");
      setXp((v) => v + (entry.lesson.xp || 100) / Math.max(practice.length, 1));
      setPhase("correct");
      return;
    }
    play("wrong");
    setMissed((m) => (m.includes(index) ? m : [...m, index]));
    setPhase("wrong");
    setHearts((h) => {
      const next = h - 1;
      if (next <= 0) window.setTimeout(() => setOutcome("dead"), 900);
      return Math.max(0, next);
    });
  };

  const handleContinue = () => {
    if (isLast) {
      completeLesson();
      if (user && entry) {
        // Same maths the results screen shows, so the stored score and the
        // score on screen can never disagree.
        const practiceCount = Math.max(practice.length, 1);
        const wrongCount = Math.min(missed.length, practiceCount);
        const score = Math.round((Math.max(practiceCount - wrongCount, 0) / practiceCount) * 100);
        void saveLessonResult({
          userId: user.id,
          lessonId: entry.lesson.id,
          trackId: entry.track.id,
          completed: true,
          score,
        });
      }
      play("win");
      setOutcome("finished");
      return;
    }
    setIndex(index + 1);
    setAnswer({ kind: "none" });
    setPhase("answer");
  };

  return (
    <Page nav={false}>
      <div className="mx-auto flex min-h-[calc(100dvh-2.5rem)] max-w-2xl flex-col">
        <div className="flex items-center gap-3 pt-1">
          <Link
            to="/home"
            aria-label={locale === "ar" ? "إغلاق" : "Quit lesson"}
            className="grid size-11 flex-none place-items-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="size-6" />
          </Link>
          <div className="h-4 grow overflow-hidden rounded-pill bg-muted">
            <div
              className="h-full rounded-pill bg-primary transition-all duration-300"
              style={{ width: `${(index / steps.length) * 100}%` }}
            />
          </div>
          {entry.lesson.sources.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSources(true)}
              aria-label={locale === "ar" ? "المصادر" : "Sources"}
              title={locale === "ar" ? "المصادر" : "Sources"}
              className="grid size-11 flex-none place-items-center rounded-full text-muted-foreground hover:bg-muted"
            >
              <Info className="size-5" />
            </button>
          )}
          <span className="flex flex-none items-center gap-1 font-extrabold text-destructive">
            <Heart className="size-5 fill-current" />
            {hearts}
          </span>
        </div>

        <div className="flex grow flex-col justify-center py-8">
          <StepView
            step={step}
            locale={locale}
            answer={answer}
            setAnswer={setAnswer}
            locked={phase !== "answer"}
            onPlay={play}
          />
        </div>

        <Feedback
          step={step}
          locale={locale}
          phase={phase}
          answer={answer}
          isLast={isLast}
          onCheck={handleCheck}
          onContinue={handleContinue}
        />
      </div>
      {showSources && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={locale === "ar" ? "المصادر" : "Sources"}
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-4"
        >
          <div className="w-full max-w-md rounded-card border-2 border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-xl font-extrabold">
                {locale === "ar" ? "من أين جاءت هذه المعلومات" : "Where this comes from"}
              </h2>
              <button
                type="button"
                onClick={() => setShowSources(false)}
                aria-label={locale === "ar" ? "إغلاق" : "Close"}
                className="grid size-9 flex-none place-items-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {locale === "ar"
                ? "هذا الدرس مبني على مصادر منشورة. اضغط على أي منها لقراءته."
                : "This lesson is built from published sources. Tap any of them to read it."}
            </p>
            <ul className="mt-4 space-y-3">
              {entry.lesson.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-bold text-primary underline"
                  >
                    {source.publisher}
                  </a>
                  <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                    {source.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Page>
  );
}

/* The nation gate moved to onboarding. See components/unidojo/nation-picker.tsx. */

function Stat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-card border-2 border-border bg-card p-4">
      <div className="flex justify-center">{icon}</div>
      <strong className="mt-2 block font-display text-2xl">{value}</strong>
      <span className="text-xs font-bold uppercase text-muted-foreground">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Answer evaluation — pure functions                                  */
/* ------------------------------------------------------------------ */

function evaluate(step: Step, answer: Answer): boolean {
  switch (step.k) {
    case "idea":
      return true;
    case "choice":
      return answer.kind === "choice" && answer.index === step.answer;
    case "scenario":
      return answer.kind === "scenario";
    case "numeric":
      return (
        answer.kind === "numeric" &&
        answer.value.trim() !== "" &&
        Math.abs(Number(answer.value) - step.answer) <= step.tolerance
      );
    case "order":
      return (
        answer.kind === "order" &&
        answer.order.length === step.items.length &&
        answer.order.every((v, i) => v === i)
      );
    case "fill":
      // `bank` entries are bilingual objects; `answer` holds the English keys.
      return (
        answer.kind === "fill" &&
        answer.picked.length === step.answer.length &&
        answer.picked.every((bankIndex, slot) => step.bank[bankIndex]?.en === step.answer[slot])
      );
    case "categorise": {
      if (answer.kind !== "categorise") return false;
      const expected: Record<string, number> = {};
      step.buckets.forEach((bucket, bucketIndex) => {
        bucket.items.forEach((item) => {
          expected[item.en] = bucketIndex;
        });
      });
      const keys = Object.keys(expected);
      return (
        keys.length === Object.keys(answer.placed).length &&
        keys.every((k) => answer.placed[k] === expected[k])
      );
    }
    case "match":
      return answer.kind === "match" && answer.matched.length === step.pairs.length;
    default:
      return false;
  }
}

function hasAnswer(step: Step, answer: Answer): boolean {
  // Teach steps are always ready: the button simply advances.
  if (stepPhase(step) === "teach") return true;
  switch (step.k) {
    case "idea":
    case "example":
    case "watchout":
      return true;
    case "choice":
      return answer.kind === "choice";
    case "scenario":
      return answer.kind === "scenario";
    case "numeric":
      return answer.kind === "numeric" && answer.value.trim() !== "";
    case "order":
      return answer.kind === "order" && answer.order.length === step.items.length;
    case "fill":
      return answer.kind === "fill" && answer.picked.length === step.answer.length;
    case "categorise": {
      if (answer.kind !== "categorise") return false;
      const total = step.buckets.reduce((n, b) => n + b.items.length, 0);
      return Object.keys(answer.placed).length === total;
    }
    case "match":
      return answer.kind === "match" && answer.matched.length === step.pairs.length;
    default:
      return false;
  }
}

/* ------------------------------------------------------------------ */
/* Feedback footer                                                     */
/* ------------------------------------------------------------------ */

function Feedback({
  step,
  locale,
  phase,
  answer,
  isLast,
  onCheck,
  onContinue,
}: {
  step: Step;
  locale: Locale;
  phase: "answer" | "correct" | "wrong";
  answer: Answer;
  isLast: boolean;
  onCheck: (correct: boolean) => void;
  onContinue: () => void;
}) {
  const correct = phase === "correct";

  const explain = (() => {
    if (phase === "answer") return "";
    if (step.k === "scenario" && answer.kind === "scenario") {
      return pick(step.options[answer.index]?.outcome, locale);
    }
    if ("why" in step && step.why) return pick(step.why, locale);
    return "";
  })();

  const label =
    phase === "answer"
      ? stepPhase(step) === "teach"
        ? locale === "ar"
          ? "فهمت"
          : "Got it"
        : locale === "ar"
          ? "تحقّق"
          : "Check"
      : isLast
        ? locale === "ar"
          ? "إنهاء الدرس"
          : "Finish lesson"
        : locale === "ar"
          ? "متابعة"
          : "Continue";

  return (
    <div
      className={cn(
        "-mx-5 mt-2 rounded-t-card border-t-2 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:-mx-8 sm:px-8",
        phase === "correct" && "border-success/40 bg-success-soft",
        phase === "wrong" && "border-destructive/40 bg-destructive/10",
        phase === "answer" && "border-transparent",
      )}
    >
      {phase !== "answer" && (
        <div className="mb-4 flex items-start gap-3">
          <span
            className={cn(
              "grid size-8 flex-none place-items-center rounded-full text-white",
              correct ? "bg-primary" : "bg-destructive",
            )}
          >
            {correct ? <Check className="size-5" /> : <X className="size-5" />}
          </span>
          <div>
            <strong className="block font-display text-lg font-extrabold">
              {correct
                ? locale === "ar"
                  ? "إجابة صحيحة"
                  : "That's right"
                : locale === "ar"
                  ? "ليست الإجابة الصحيحة"
                  : "Not quite"}
            </strong>
            {explain && <p className="mt-1 text-sm leading-relaxed">{explain}</p>}
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={phase === "answer" && !hasAnswer(step, answer)}
        onClick={() => {
          if (phase === "answer") {
            if (stepPhase(step) === "teach") onContinue();
            else onCheck(evaluate(step, answer));
            return;
          }
          onContinue();
        }}
        className={cn(
          "min-h-14 w-full rounded-button px-6 font-extrabold uppercase tracking-wide",
          phase === "answer"
            ? "btn-3d bg-primary text-primary-foreground disabled:opacity-40 disabled:shadow-none"
            : correct
              ? "btn-3d-gold bg-gold text-ink"
              : "bg-destructive text-white",
        )}
      >
        {label}
      </button>

      {phase === "answer" && stepPhase(step) === "practice" && !hasAnswer(step, answer) && (
        <p className="mt-3 text-center text-xs font-bold text-muted-foreground">
          {locale === "ar" ? "اختر إجابة أولاً" : "Choose an answer first"}
        </p>
      )}
      {phase === "answer" && stepPhase(step) === "teach" && (
        <p className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground">
          <Lightbulb className="size-4" />
          {locale === "ar" ? "خذ وقتك" : "Take your time"}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Exercise renderers                                                  */
/* ------------------------------------------------------------------ */

function StepView({
  step,
  locale,
  answer,
  setAnswer,
  locked,
  onPlay,
}: {
  step: Step;
  locale: Locale;
  answer: Answer;
  setAnswer: (a: Answer) => void;
  locked: boolean;
  onPlay: (tone?: "tap" | "win" | "wrong") => void;
}) {
  // Computed before any early return so hook order never changes between steps.
  const shuffledRights = useMemo(
    () =>
      step.k === "match"
        ? shuffle(
            step.pairs.map((p) => p.right),
            step.pairs.length * 7919 + 13,
          )
        : [],
    [step],
  );

  if (step.k === "idea") {
    return (
      <div className="rounded-card border-2 border-border bg-card p-7">
        <h1 className="font-display text-3xl font-extrabold leading-tight">
          {pick(step.title, locale)}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {pick(step.body, locale)}
        </p>
        {step.points && step.points.length > 0 && (
          <ul className="mt-5 grid gap-3">
            {step.points.map((point, i) => (
              <li key={i} className="flex gap-3 text-base leading-relaxed">
                <Check className="mt-1 size-5 flex-none text-primary" />
                <span>{pick(point, locale)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (step.k === "example") {
    return (
      <div className="rounded-card border-2 border-border bg-card p-7">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          {locale === "ar" ? "مثال محلول" : "Worked example"}
        </p>
        <h1 className="font-display text-2xl font-extrabold leading-tight">
          {pick(step.title, locale)}
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">{pick(step.setup, locale)}</p>
        <dl className="mt-5 overflow-hidden rounded-button border-2 border-border">
          {step.rows.map((row, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center justify-between gap-4 px-4 py-3",
                i % 2 === 1 && "bg-muted/60",
              )}
            >
              <dt className="text-sm">{pick(row.label, locale)}</dt>
              <dd className="font-display text-lg font-extrabold">{pick(row.value, locale)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 rounded-button bg-accent-soft p-4 text-sm font-semibold leading-relaxed">
          {pick(step.takeaway, locale)}
        </p>
      </div>
    );
  }

  if (step.k === "watchout") {
    return (
      <div className="rounded-card border-2 border-destructive/40 bg-destructive/5 p-7">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-destructive">
          {locale === "ar" ? "انتبه" : "Watch out"}
        </p>
        <h1 className="font-display text-2xl font-extrabold leading-tight">
          {pick(step.title, locale)}
        </h1>
        <p className="mt-3 leading-relaxed">{pick(step.body, locale)}</p>
      </div>
    );
  }

  const heading = (
    <h1 className="mb-6 font-display text-2xl font-extrabold leading-snug">
      {pick(step.prompt, locale)}
    </h1>
  );

  const optionClass = (selected: boolean) =>
    cn(
      "min-h-14 rounded-button border-2 bg-card px-5 text-start text-lg font-bold transition",
      selected ? "border-primary bg-success-soft" : "border-border hover:border-primary/50",
    );

  if (step.k === "choice") {
    return (
      <div>
        {heading}
        <div className="grid gap-3">
          {step.options.map((option, i) => (
            <button
              key={i}
              type="button"
              disabled={locked}
              onClick={() => {
                setAnswer({ kind: "choice", index: i });
                onPlay("tap");
              }}
              className={optionClass(answer.kind === "choice" && answer.index === i)}
            >
              {pick(option, locale)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step.k === "scenario") {
    return (
      <div>
        {heading}
        <div className="grid gap-3">
          {step.options.map((option, i) => (
            <button
              key={i}
              type="button"
              disabled={locked}
              onClick={() => {
                setAnswer({ kind: "scenario", index: i });
                onPlay("tap");
              }}
              className={optionClass(answer.kind === "scenario" && answer.index === i)}
            >
              {pick(option.label, locale)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step.k === "numeric") {
    const value = answer.kind === "numeric" ? answer.value : "";
    return (
      <div>
        {heading}
        <div className="flex items-center gap-3">
          {step.unit && <span className="font-display text-3xl font-extrabold">{step.unit}</span>}
          <input
            type="number"
            inputMode="decimal"
            disabled={locked}
            value={value}
            onChange={(e) => setAnswer({ kind: "numeric", value: e.target.value })}
            className="min-h-14 w-full rounded-button border-2 border-border bg-card px-5 font-display text-2xl font-extrabold focus:border-primary focus:outline-none"
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {locale === "ar"
            ? "قرّب لأقرب جنيه عند الحاجة."
            : "Round to the nearest pound if you need to."}
        </p>
      </div>
    );
  }

  if (step.k === "order") {
    const order = answer.kind === "order" ? answer.order : [];
    const remaining = step.items.map((_, i) => i).filter((i) => !order.includes(i));
    return (
      <div>
        {heading}
        <div className="mb-5 min-h-16 rounded-card border-2 border-dashed border-border p-3">
          {order.length === 0 && (
            <p className="px-2 py-3 text-sm text-muted-foreground">
              {locale === "ar" ? "اضغط بالترتيب الصحيح" : "Tap the steps in the right order"}
            </p>
          )}
          <ol className="grid gap-2">
            {order.map((itemIndex, position) => (
              <li key={itemIndex} className="flex items-center gap-2">
                <span className="grid size-7 flex-none place-items-center rounded-full bg-primary font-display text-xs font-extrabold text-primary-foreground">
                  {position + 1}
                </span>
                <span className="font-bold">{pick(step.items[itemIndex], locale)}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid gap-3">
          {remaining.map((itemIndex) => (
            <button
              key={itemIndex}
              type="button"
              disabled={locked}
              onClick={() => {
                setAnswer({ kind: "order", order: [...order, itemIndex] });
                onPlay("tap");
              }}
              className="min-h-14 rounded-button border-2 border-border bg-card px-5 text-start font-bold hover:border-primary/50"
            >
              {pick(step.items[itemIndex], locale)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step.k === "fill") {
    const picked = answer.kind === "fill" ? answer.picked : [];
    const row: (number | null)[] = Array.from(
      { length: step.answer.length },
      (_, slot) => picked[slot] ?? null,
    );
    return (
      <div>
        {heading}
        <p className="text-lg leading-loose">
          {pick(step.before, locale)}{" "}
          {row.map((bankIndex, slot) => (
            <button
              key={slot}
              type="button"
              disabled={locked || bankIndex === null}
              onClick={() =>
                setAnswer({ kind: "fill", picked: picked.filter((_, i) => i !== slot) })
              }
              className={cn(
                "mx-1 inline-block min-w-24 rounded-button border-b-2 px-3 py-1 text-center font-bold",
                bankIndex === null
                  ? "border-border bg-muted text-muted-foreground"
                  : "border-primary bg-success-soft",
              )}
            >
              {bankIndex === null ? "…" : pick(step.bank[bankIndex], locale)}
            </button>
          ))}{" "}
          {pick(step.after, locale)}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {step.bank.map((word, i) =>
            picked.includes(i) ? null : (
              <button
                key={i}
                type="button"
                disabled={locked || picked.length >= step.answer.length}
                onClick={() => {
                  setAnswer({ kind: "fill", picked: [...picked, i] });
                  onPlay("tap");
                }}
                className="min-h-12 rounded-button border-2 border-border bg-card px-4 font-bold hover:border-primary/50 disabled:opacity-40"
              >
                {pick(word, locale)}
              </button>
            ),
          )}
        </div>
      </div>
    );
  }

  if (step.k === "categorise") {
    const placed = answer.kind === "categorise" ? answer.placed : {};
    const pool = step.buckets
      .flatMap((bucket) => bucket.items)
      .filter((item) => placed[item.en] === undefined);
    return (
      <div>
        {heading}
        <div className="grid gap-3">
          {step.buckets.map((bucket, bucketIndex) => (
            <div key={bucketIndex} className="rounded-card border-2 border-border bg-card p-4">
              <strong className="font-display text-lg">{pick(bucket.name, locale)}</strong>
              <div className="mt-3 flex min-h-8 flex-wrap gap-2">
                {bucket.items
                  .filter((item) => placed[item.en] === bucketIndex)
                  .map((item) => (
                    <span
                      key={item.en}
                      className="rounded-pill bg-success-soft px-3 py-1 font-bold"
                    >
                      {pick(item, locale)}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="mb-3 text-sm font-bold text-muted-foreground">
            {pool.length > 0
              ? locale === "ar"
                ? "بقي للتصنيف:"
                : "Left to sort:"
              : locale === "ar"
                ? "تم الترتيب"
                : "All sorted"}
          </p>
          <div className="flex flex-wrap gap-3">
            {pool.map((item) => (
              <PoolItem
                key={item.en}
                label={pick(item, locale)}
                disabled={locked}
                buckets={step.buckets.map((b) => pick(b.name, locale))}
                onPlace={(bucketIndex) => {
                  setAnswer({ kind: "categorise", placed: { ...placed, [item.en]: bucketIndex } });
                  onPlay("tap");
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // match
  const matched = answer.kind === "match" ? answer.matched : [];
  const active = answer.kind === "match" ? answer.active : null;
  return (
    <div>
      {heading}
      <div className="grid grid-cols-2 gap-3">
        <div className="grid content-start gap-3">
          {step.pairs.map((pair, i) => {
            const done = matched.includes(pair.left.en);
            return (
              <button
                key={i}
                type="button"
                disabled={locked || done}
                onClick={() => {
                  setAnswer({ kind: "match", matched, active: i });
                  onPlay("tap");
                }}
                className={cn(
                  "min-h-14 rounded-button border-2 px-4 text-start font-bold",
                  done
                    ? "border-primary bg-success-soft"
                    : active === i
                      ? "border-primary bg-accent/25"
                      : "border-border bg-card",
                )}
              >
                {pick(pair.left, locale)}
              </button>
            );
          })}
        </div>
        <div className="grid content-start gap-3">
          {shuffledRights.map((right, i) => {
            const done = matched.includes(right.en);
            return (
              <button
                key={i}
                type="button"
                disabled={locked || done || active === null}
                onClick={() => {
                  if (active === null) return;
                  const left = step.pairs[active];
                  if (!left) return;
                  if (left.right.en === right.en) {
                    setAnswer({ kind: "match", matched: [...matched, left.left.en], active: null });
                    onPlay("win");
                  } else {
                    onPlay("wrong");
                    setAnswer({ kind: "match", matched, active: null });
                  }
                }}
                className={cn(
                  "min-h-14 rounded-button border-2 px-4 text-start font-bold",
                  done ? "border-primary bg-success-soft" : "border-border bg-card",
                  !done && active === null && "opacity-60",
                )}
              >
                {pick(right, locale)}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        {locale === "ar"
          ? "اختر من العمود الأول ثم ما يقابله."
          : "Pick a term, then tap its match."}
      </p>
    </div>
  );
}

function PoolItem({
  label,
  buckets,
  onPlace,
  disabled,
}: {
  label: string;
  buckets: string[];
  onPlace: (bucketIndex: number) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="min-h-12 rounded-button border-2 border-border bg-card px-4 font-bold hover:border-primary/50"
      >
        {label}
      </button>
      {open && (
        <div className="absolute z-20 mt-2 grid gap-1 rounded-card border-2 border-border bg-popover p-2 shadow-lg">
          {buckets.map((bucket, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onPlace(i);
                setOpen(false);
              }}
              className="min-h-11 whitespace-nowrap rounded-button px-4 text-start font-bold hover:bg-muted"
            >
              {bucket}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
