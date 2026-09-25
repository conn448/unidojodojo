/**
 * Whether today's challenge has been done, and how long until the next one.
 *
 * Same store shape as `use-auth`, `use-profile` and `use-progress`: a module
 * level snapshot read through `useSyncExternalStore`, a frozen empty server
 * snapshot, and storage touched only inside `subscribe` — never at import time
 * and never during render. That is what keeps the static prerender working:
 * during the build there is no localStorage and no clock, so the HTML contains
 * the empty state and the real day arrives on mount.
 *
 * The one difference from the other stores is that this one is time based, so a
 * single interval refreshes it while anything is subscribed. It stops as soon
 * as the last subscriber goes away.
 */
import { useSyncExternalStore } from "react";
import { dayKey, formatCountdown, isDayKey, msUntilNextDay } from "./day";

const KEY_DAY = "ud_daily_day";
const KEY_SCORE = "ud_daily_score";
const KEY_BEST = "ud_daily_best";

export interface DailyState {
  /** The learner's current day. Null before mount and during the prerender. */
  day: string | null;
  /** True once today's challenge has been completed. */
  done: boolean;
  /** Accuracy of today's run, when one has been recorded. */
  score: number | null;
  /** Best combo ever recorded on this device. */
  best: number;
  /** `H:MM:SS` until the next challenge. Empty string until mounted. */
  reset: string;
}

const EMPTY: DailyState = { day: null, done: false, score: null, best: 0, reset: "" };

let snapshot: DailyState = EMPTY;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function emit(next: DailyState) {
  snapshot = next;
  for (const listener of listeners) listener();
}

/** localStorage throws in private mode and when storage is disabled entirely. */
function stored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storedNumber(key: string): number {
  const raw = stored(key);
  const value = raw === null ? Number.NaN : Number(raw);
  return Number.isFinite(value) ? value : 0;
}

/**
 * Rebuild the snapshot from the clock and storage. Values change only once a
 * second at most, and a no-op refresh does not notify, so the interval is cheap.
 */
function refresh() {
  if (typeof window === "undefined") return;

  const day = dayKey();
  const reset = formatCountdown(msUntilNextDay());
  const marked = stored(KEY_DAY);
  const done = isDayKey(marked) && marked === day;
  const score = done ? storedNumber(KEY_SCORE) : null;
  const best = storedNumber(KEY_BEST);

  if (
    snapshot.day === day &&
    snapshot.done === done &&
    snapshot.score === score &&
    snapshot.best === best &&
    snapshot.reset === reset
  ) {
    return;
  }

  emit({ day, done, score, best, reset });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === undefined) {
    refresh();
    timer = setInterval(refresh, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => EMPTY;

/** Today's challenge state. Re-renders the caller once a second for the countdown. */
export function useDaily(): DailyState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Record that today's challenge is finished. Idempotent per day: playing again
 * the same day cannot pay out twice, because `done` is keyed on the day itself.
 */
export function markDailyDone(input: { score: number; combo: number }) {
  if (typeof window === "undefined") return;
  const day = dayKey();
  const best = Math.max(storedNumber(KEY_BEST), input.combo);
  try {
    window.localStorage.setItem(KEY_DAY, day);
    window.localStorage.setItem(KEY_SCORE, String(input.score));
    window.localStorage.setItem(KEY_BEST, String(best));
  } catch {
    // Storage is unavailable. The challenge still works; it just will not be
    // remembered, which is the same deal the rest of the app offers.
  }
  refresh();
}
