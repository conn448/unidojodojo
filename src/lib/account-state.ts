/**
 * Keeps this browser's account-scoped storage attached to the right account.
 *
 * Points, streak, the once-a-day gates, the display name and the nation are all
 * held in `localStorage`, which every account that uses this browser shares.
 * Nothing cleared them on sign-out, so the failure was real and easy to hit:
 *
 *   Account A earns 500 XP and names themselves. A signs out. B signs in on the
 *   same laptop. B is shown 500 XP, A's streak, A's name, A's nation — and is
 *   told they have already done today's challenge.
 *
 * The same values are also why "log out and back in" used to look like it worked
 * for XP: the numbers never left the device, so they survived every sign-out,
 * for whoever happened to look next.
 *
 * The fix is to give each account its own bucket. On the way out the live keys
 * are snapshotted under the account that owned them and then removed; on the way
 * back in that account's snapshot is restored. Points and streak therefore follow
 * the signed-in account *on this device*, and no account can ever inherit
 * another's.
 *
 * Device preferences (language, sound) are deliberately left alone. Those belong
 * to the machine, not to the person.
 *
 * Known limit: these buckets are per device. XP and streak still do not follow a
 * learner to a second device, because they are not in the database. Lessons,
 * quiz answers and accuracy DO follow, because those live in Supabase. Moving XP
 * and streak into `profiles` is the change that would close that gap.
 */
import { dayKey } from "./day";

/**
 * Keys that belong to a person rather than to the device.
 *
 * Includes the daily-challenge keys, which are a personal progress record: left
 * shared, the next account would be told they had already played today.
 */
const ACCOUNT_KEYS = [
  "ud_points",
  "ud_streak",
  "ud_lesson_day",
  "ud_puzzle_day",
  "ud_name",
  "ud_nation",
  "ud_onboarded",
  "ud_daily_day",
  "ud_daily_score",
  "ud_daily_best",
] as const;

/** The bucket used while nobody is signed in, so guests never inherit a user's data. */
const ANON = "anon";

/** Records which bucket the live keys currently hold. */
const OWNER_KEY = "ud_acct_owner";

const bucket = (owner: string) => `ud_acct:${owner}`;

/** Storage throws in private mode and when it is disabled outright. */
function attempt(run: () => void) {
  try {
    run();
  } catch {
    // Storage unavailable. The app still works; it just will not remember.
  }
}

function readOwner(): string | null {
  try {
    return window.localStorage.getItem(OWNER_KEY);
  } catch {
    return null;
  }
}

function writeOwner(owner: string) {
  attempt(() => window.localStorage.setItem(OWNER_KEY, owner));
}

/** The account whose values are live right now. */
export function currentOwner(): string {
  return readOwner() ?? ANON;
}

/** Copy the live values into `owner`'s bucket, then clear them. */
function stash(owner: string) {
  const payload: Record<string, string> = {};
  for (const key of ACCOUNT_KEYS) {
    try {
      const value = window.localStorage.getItem(key);
      if (value !== null) payload[key] = value;
    } catch {
      return;
    }
  }

  // Nothing worth keeping: leave any previous snapshot untouched rather than
  // replacing it with an empty one.
  if (Object.keys(payload).length === 0) return;

  attempt(() => window.localStorage.setItem(bucket(owner), JSON.stringify(payload)));
  clearLive();
}

function clearLive() {
  for (const key of ACCOUNT_KEYS) attempt(() => window.localStorage.removeItem(key));
}

/** Put `owner`'s snapshot back into the live keys. Missing bucket means a new account. */
function restore(owner: string) {
  clearLive();
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(bucket(owner));
  } catch {
    return;
  }
  if (!raw) return;

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return;
  }
  if (typeof payload !== "object" || payload === null) return;

  for (const key of ACCOUNT_KEYS) {
    const value = (payload as Record<string, unknown>)[key];
    if (typeof value === "string") attempt(() => window.localStorage.setItem(key, value));
  }
}

/**
 * Reconcile on the first render after the session is known.
 *
 * If no owner has ever been recorded this is the first run of this mechanism, so
 * the live values are left where they are and simply claimed by whoever is signed
 * in. Moving them would hand an existing learner's XP to the anonymous bucket.
 */
export function reconcileOwner(userId: string | null) {
  if (typeof window === "undefined") return;

  const wanted = userId ?? ANON;
  const recorded = readOwner();

  if (recorded === null) {
    writeOwner(wanted);
    return;
  }
  if (recorded === wanted) return;

  stash(recorded);
  restore(wanted);
  writeOwner(wanted);
}

/**
 * Called when the signed-in account changes. Idempotent, so calling it with the
 * same account twice does nothing.
 */
export function switchAccount(previous: string | null, next: string | null) {
  if (typeof window === "undefined") return;

  const from = previous ?? ANON;
  const to = next ?? ANON;
  if (from === to) return;

  stash(from);
  restore(to);
  writeOwner(to);
}

/**
 * Drop everything this device holds for an account.
 *
 * The privacy screen promises that deleting an account deletes the account, so
 * leaving the learner's XP, streak, name and nation sitting in localStorage
 * afterwards would make that promise false. Call this BEFORE signing out: the
 * live values are cleared here while they are still known to belong to this
 * account, which leaves the sign-out with nothing to snapshot, and sign-out
 * would otherwise recreate the bucket that was just removed.
 */
export function forgetAccount(userId: string) {
  if (typeof window === "undefined") return;

  attempt(() => window.localStorage.removeItem(bucket(userId)));

  if (currentOwner() === userId) {
    clearLive();
    writeOwner(ANON);
  }
}
