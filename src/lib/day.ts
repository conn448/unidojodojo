/**
 * The calendar day, in one place.
 *
 * Everything that resets once a day keys off this: the streak gate, the puzzle
 * gate and the Lesson of the Day. The app previously used
 * `new Date().toISOString().slice(0, 10)`, which is UTC. That is wrong for a
 * daily feature: a learner in Auckland would get tomorrow's lesson at 10am,
 * and a learner in Honolulu would still be on yesterday's at 2pm. A day has to
 * end at the learner's own midnight, so the key is built from local date parts.
 *
 * No React and no storage in here, so it is safe to call during the static
 * prerender. Components must still only call it from an effect: see
 * `use-daily.ts` for why.
 */

const DAY_MS = 86_400_000;

const pad = (value: number) => (value < 10 ? `0${value}` : String(value));

/** `YYYY-MM-DD` for a given moment, read in the learner's own timezone. */
export function dayKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Whole days since 1970-01-01, local. Built from UTC parts so the result is an
 * exact integer that no daylight-saving jump can shift by a fraction.
 */
export function dayNumber(date: Date = new Date()): number {
  return Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
}

/** Midnight at the start of a `YYYY-MM-DD` key, local. */
export function parseDayKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

/** True for a well-formed `YYYY-MM-DD`. Guards against junk in localStorage. */
export function isDayKey(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** Milliseconds from `now` until the next local midnight. */
export function msUntilNextDay(now: Date = new Date()): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return Math.max(next.getTime() - now.getTime(), 0);
}

/** `H:MM:SS`, or `M:SS` in the last ten minutes, for the reset countdown. */
export function formatCountdown(ms: number): string {
  const total = Math.max(Math.floor(ms / 1000), 0);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (hours === 0) return `${minutes}:${pad(seconds)}`;
  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * `1 day` / `4 days` for "day 4" style labels. Kept bilingual-free: the caller
 * decides the wording, this only counts.
 */
export function daysBetween(from: string, to: string): number {
  return Math.round((parseDayKey(to).getTime() - parseDayKey(from).getTime()) / DAY_MS);
}
