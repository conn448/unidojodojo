/**
 * Lesson of the Day.
 *
 * A challenge that is different every day, built from teaching steps the
 * curriculum already contains rather than from newly authored content, so it
 * cannot run out and cannot drift out of step with the lessons.
 *
 * Three rules keep it honest:
 *
 * 1. **Deterministic.** The day key seeds the whole thing, so every learner
 *    sees the same challenge on the same day and nothing has to be stored to
 *    remember which lesson today is.
 * 2. **No optional tracks.** The pool is `coreTracks`, so the daily challenge
 *    never forces the Islamic finance branch on a learner who did not opt in.
 * 3. **Nation-filtered at selection time.** Steps teach different things in
 *    different UK nations, so the plan only ever contains steps that apply to
 *    the learner in front of us — the same rule the player applies when it
 *    renders. Selecting first and filtering later would leave some learners
 *    with an empty quiz.
 *
 * The theme order uses a shuffle bag, the trick games use to avoid repeats: the
 * themes are permuted once per cycle, so all 15 are seen before any comes back
 * and two consecutive days can never share one.
 */
import {
  coreTracks,
  stepApplies,
  stepPhase,
  type L,
  type Lesson,
  type Source,
  type Step,
  type Track,
  type Nation,
} from "./curriculum";
import { dayNumber, daysBetween } from "./day";

/* ------------------------------------------------------------------ */
/* Deterministic randomness                                            */
/* ------------------------------------------------------------------ */

/** FNV-1a. Turns a day key into a seed. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: tiny, fast, and identical on every device and in every browser. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seeded Fisher-Yates. Returns a new array; never mutates the input. */
function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const swap = out[i] as T;
    out[i] = out[j] as T;
    out[j] = swap;
  }
  return out;
}

/** Unseeded, for the first render only — replaced by the seeded order on mount. */
function seededPick<T>(items: readonly T[], key: string): T | undefined {
  if (items.length === 0) return undefined;
  const random = rng(hash(key));
  return items[Math.floor(random() * items.length)];
}

/* ------------------------------------------------------------------ */
/* Themes                                                              */
/* ------------------------------------------------------------------ */

export interface DailyTheme {
  id: string;
  /** The mission, not the lesson title — this is a challenge, not a chapter. */
  title: L;
  blurb: L;
  /** Lessons this day draws its teaching beat and its questions from. */
  lessonIds: string[];
}

export const DAILY_THEMES: DailyTheme[] = [
  {
    id: "week-map",
    title: { en: "Map the week's money", ar: "خطّط مال الأسبوع" },
    blurb: {
      en: "Sort what actually has to leave your account this week.",
      ar: "رتّب ما يجب أن يخرج من حسابك هذا الأسبوع فعلاً.",
    },
    lessonIds: ["money-plan"],
  },
  {
    id: "where-it-goes",
    title: { en: "Where it actually goes", ar: "أين يذهب مالك فعلاً" },
    blurb: {
      en: "Track a week of spending and the leaks show up.",
      ar: "تابع مصاريف أسبوع وستظهر لك التسريبات.",
    },
    lessonIds: ["money-tracking"],
  },
  {
    id: "card-traps",
    title: { en: "Traps hiding on the card", ar: "فخاخ مخبّأة في بطاقتك" },
    blurb: {
      en: "Spot the costs a card adds before you tap it.",
      ar: "اكتشف التكاليف التي تضيفها البطاقة قبل أن تدفع.",
    },
    lessonIds: ["money-cards"],
  },
  {
    id: "interest-bill",
    title: { en: "What interest really costs", ar: "كم تكلّفك الفائدة فعلاً" },
    blurb: {
      en: "Read an interest rate like the price tag it is.",
      ar: "اقرأ سعر الفائدة كما تقرأ بطاقة السعر.",
    },
    lessonIds: ["money-interest"],
  },
  {
    id: "loan-shape",
    title: { en: "The shape of a student loan", ar: "شكل قرض الطالب" },
    blurb: {
      en: "What you borrowed, what you owe, and what changes that.",
      ar: "ما اقترضته وما عليك وما يغيّر ذلك.",
    },
    lessonIds: ["student-loan"],
  },
  {
    id: "repayment-threshold",
    title: { en: "Repayment, without the panic", ar: "السداد بلا قلق" },
    blurb: {
      en: "When repayment actually bites, and when it does not.",
      ar: "متى يبدأ السداد فعلاً ومتى لا يبدأ.",
    },
    lessonIds: ["student-repay"],
  },
  {
    id: "payslip",
    title: { en: "Read your payslip in a minute", ar: "اقرأ قسيمة راتبك في دقيقة" },
    blurb: {
      en: "Find the numbers that decide what lands in your account.",
      ar: "اعرف الأرقام التي تحدّد ما يصل إلى حسابك.",
    },
    lessonIds: ["student-work"],
  },
  {
    id: "rent-run",
    title: { en: "Rent, deposit, flatmates", ar: "الإيجار والوديعة ورفاق السكن" },
    blurb: {
      en: "The up-front cost of moving out, before you commit.",
      ar: "التكلفة الأولية للانتقال قبل أن تلتزم.",
    },
    lessonIds: ["student-rent"],
  },
  {
    id: "buffer-first",
    title: { en: "Build the buffer first", ar: "ابنِ مخزون الطوارئ أولاً" },
    blurb: {
      en: "Why the boring account is the one that protects you.",
      ar: "لماذا الحساب البسيط هو الذي يحميك.",
    },
    lessonIds: ["building-buffer"],
  },
  {
    id: "compound-time",
    title: { en: "Slow, then sudden", ar: "ببطء ثم فجأة" },
    blurb: {
      en: "How compounding behaves across a student's timeline.",
      ar: "كيف تتصرّف الفائدة المركبة خلال سنوات الدراسة.",
    },
    lessonIds: ["building-compound"],
  },
  {
    id: "isa-check",
    title: { en: "Is the ISA worth it?", ar: "هل يستحق حساب الـ ISA؟" },
    blurb: {
      en: "Allowances, limits, and the tax you are not paying.",
      ar: "الحدود والبدلات والضريبة التي لا تدفعها.",
    },
    lessonIds: ["building-isa"],
  },
  {
    id: "hype-filter",
    title: { en: "Filter the hype", ar: "افلتر الضجيج" },
    blurb: {
      en: "Separate a real opportunity from a good story.",
      ar: "افصل الفرصة الحقيقية عن القصة الجذّابة.",
    },
    lessonIds: ["building-hype"],
  },
  {
    id: "plan-and-track",
    title: { en: "Plan it, then check it", ar: "خطّط ثم تحقّق" },
    blurb: {
      en: "Set the plan, then test it against a real week.",
      ar: "ضع الخطة ثم اختبرها على أسبوع حقيقي.",
    },
    lessonIds: ["money-plan", "money-tracking"],
  },
  {
    id: "biggest-costs",
    title: { en: "Your biggest costs", ar: "أكبر التكاليف عليك" },
    blurb: {
      en: "Where student money quietly goes during term time.",
      ar: "إلى أين يذهب مال الطالب بهدوء خلال الفصل الدراسي.",
    },
    lessonIds: ["student-rent", "money-cards"],
  },
  {
    id: "future-you",
    title: { en: "Money for future you", ar: "مال لمستقبلك" },
    blurb: {
      en: "The two habits that do most of the work.",
      ar: "العادتان اللتان تقومان بأغلب العمل.",
    },
    lessonIds: ["building-buffer", "building-compound"],
  },
];

/** Said once, in both languages, so no theme has to repeat it. */
const DAILY_RELEVANCE: L = {
  en: "A few minutes of retrieval today is what makes last month's lesson stick.",
  ar: "دقائق من الاسترجاع اليوم هي ما يثبّت درس الشهر الماضي.",
};

/**
 * Day 1. Nothing before this date had a daily challenge, so the counter starts
 * here rather than at the epoch — "Day 24" is a number a learner can feel.
 */
export const LAUNCH_DAY = "2026-09-01";

/** 1 on launch day, counting up. Never negative, whatever the device clock says. */
export function dailyNumber(day: string): number {
  return Math.max(daysBetween(LAUNCH_DAY, day) + 1, 1);
}

/* ------------------------------------------------------------------ */
/* The pool                                                            */
/* ------------------------------------------------------------------ */

type Indexed = { lesson: Lesson; track: Track };

/**
 * Every core lesson by id. Built from `coreTracks`, so the optional Islamic
 * finance branch is structurally absent rather than filtered out later.
 */
const lessonIndex: Map<string, Indexed> = new Map(
  coreTracks.flatMap((track) => track.units.flatMap((unit) => unit.lessons.map((lesson) => [lesson.id, { lesson, track }] as const))),
);

/** Fallback pool for padding, so a thin nation slice can never empty the quiz. */
const wholePool: Indexed[] = [...lessonIndex.values()];

/** How many questions the challenge asks. Five is a game round, not a lesson. */
export const DAILY_QUESTIONS = 5;

/** A teaching beat, then five questions. */
export const DAILY_STEP_COUNT = DAILY_QUESTIONS + 1;

/**
 * Practice steps that apply to this learner, deduplicated by prompt so the same
 * question can never appear twice in one challenge.
 */
function practiceSteps(entries: Indexed[], nation: Nation | null): Step[] {
  const seen = new Set<string>();
  const out: Step[] = [];
  for (const { lesson } of entries) {
    for (const step of lesson.steps) {
      if (stepPhase(step) !== "practice") continue;
      if (!stepApplies(step, nation)) continue;
      const prompt = promptOf(step);
      if (seen.has(prompt)) continue;
      seen.add(prompt);
      out.push(step);
    }
  }
  return out;
}

/** The teaching beats that apply to this learner. */
function teachSteps(entries: Indexed[], nation: Nation | null): Step[] {
  return entries.flatMap(({ lesson }) =>
    lesson.steps.filter((step) => stepPhase(step) === "teach" && stepApplies(step, nation)),
  );
}

/** English prompt text, used only as a dedupe key — never shown to anyone. */
function promptOf(step: Step): string {
  switch (step.k) {
    case "idea":
    case "example":
    case "watchout":
      return step.title.en;
    default:
      return step.prompt.en;
  }
}

/**
 * Take one question per kind before taking a second of any kind, so a challenge
 * is five different games rather than five multiple-choice questions in a row.
 */
function mixByKind(pool: Step[], count: number, random: () => number): Step[] {
  const byKind = new Map<Step["k"], Step[]>();
  for (const step of pool) {
    const bucket = byKind.get(step.k);
    if (bucket) bucket.push(step);
    else byKind.set(step.k, [step]);
  }

  const picked: Step[] = [];
  const kinds = shuffled([...byKind.keys()], random);

  // Round one: one step from each kind, in a random kind order.
  for (const kind of kinds) {
    if (picked.length >= count) break;
    const bucket = byKind.get(kind);
    if (!bucket || bucket.length === 0) continue;
    const [step] = shuffled(bucket, random);
    if (step) picked.push(step);
  }

  // Round two: top up from whatever is left, if there were fewer kinds than slots.
  if (picked.length < count) {
    const leftovers = shuffled(
      pool.filter((step) => !picked.includes(step)),
      random,
    );
    for (const step of leftovers) {
      if (picked.length >= count) break;
      picked.push(step);
    }
  }

  return picked;
}

/** Every distinct source behind the lessons a challenge borrowed from. */
function sourcesFor(entries: Indexed[]): Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  for (const { lesson } of entries) {
    for (const source of lesson.sources) {
      if (seen.has(source.url)) continue;
      seen.add(source.url);
      out.push(source);
    }
  }
  return out.slice(0, 6);
}

/* ------------------------------------------------------------------ */
/* The plan                                                            */
/* ------------------------------------------------------------------ */

export interface DailyPlan {
  /** The day this plan belongs to, `YYYY-MM-DD`. */
  day: string;
  /** 1 on launch day, counting up. Drives the "Day 25" label. */
  number: number;
  theme: DailyTheme;
  /** A real `Lesson`, so the existing player can render it untouched. */
  lesson: Lesson;
  /** Lessons the challenge drew on, for the "what did this test?" line. */
  lessonTitles: L[];
}

/**
 * The challenge for a given day. Pure: same arguments, same plan, every time.
 * Never returns undefined — a theme whose lessons have all been renamed away
 * falls back to the whole core pool rather than breaking the day.
 */
export function dailyPlan(day: string, nation: Nation | null): DailyPlan {
  return buildPlan(day, dayNumberFromKey(day), nation);
}

/**
 * The theme for a day, without building the whole lesson. Cheap enough for the
 * home screen, which only wants the title.
 */
export function dailyTheme(day: string): DailyTheme {
  return themeForDay(dayNumberFromKey(day));
}

/** `dayNumber` needs a real `Date`; build one from the key without timezone drift. */
function dayNumberFromKey(day: string): number {
  const [year, month, date] = day.split("-").map(Number);
  if (!year || !month || !date) return dayNumber();
  return Math.round(Date.UTC(year, month - 1, date) / 86_400_000);
}

/**
 * The shuffle bag. Themes are permuted once per cycle, so every theme is used
 * before any repeats and consecutive days can never collide.
 */
function themeForDay(index: number): DailyTheme {
  const size = DAILY_THEMES.length;
  const cycle = Math.floor(index / size);
  const position = ((index % size) + size) % size;
  const bag = shuffled(DAILY_THEMES, rng(hash(`bag:${cycle}`)));
  return bag[position] ?? DAILY_THEMES[0]!;
}

function buildPlan(day: string, index: number, nation: Nation | null): DailyPlan {
  const theme = themeForDay(index);
  const random = rng(hash(`daily:${day}`));

  const themed = theme.lessonIds
    .map((id) => lessonIndex.get(id))
    .filter((entry): entry is Indexed => entry !== undefined);
  // A renamed lesson should degrade to a smaller challenge, not a missing one.
  const entries = themed.length > 0 ? themed : wholePool;

  const teaching =
    seededPick(teachSteps(entries, nation), `teach:${day}`) ??
    seededPick(teachSteps(wholePool, nation), `teach-fallback:${day}`);

  let pool = practiceSteps(entries, nation);
  if (pool.length < DAILY_QUESTIONS) {
    // Nation filtering can thin a themed pool. Top up from the core lessons
    // rather than hand the learner a two-question challenge.
    const extra = practiceSteps(wholePool, nation).filter(
      (step) => !pool.some((kept) => promptOf(kept) === promptOf(step)),
    );
    pool = [...pool, ...shuffled(extra, random)];
  }

  const questions = mixByKind(pool, DAILY_QUESTIONS, random);
  const steps: Step[] = teaching ? [teaching, ...questions] : questions;

  return {
    day,
    number: dailyNumber(day),
    theme,
    lessonTitles: entries.map(({ lesson }) => lesson.title),
    lesson: {
      id: `daily-${day}`,
      title: theme.title,
      objective: theme.blurb,
      minutes: 5,
      xp: 120,
      relevance: DAILY_RELEVANCE,
      steps,
      sources: sourcesFor(entries),
    },
  };
}
