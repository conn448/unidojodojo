/**
 * Onboarding answers captured before there is an account to put them in.
 *
 * The onboarding flow runs before sign-up, so `useProfile().save()` is a no-op
 * while signed out and the learner's name and university were being discarded:
 * they typed them, finished setup, signed up, and the database kept nothing.
 *
 * This holds those answers in a single local slot until an account exists, then
 * hands them over. Three rules keep that safe:
 *
 * 1. It only ever fills fields that are still **blank**, so it can never
 *    overwrite a profile that already carries real data.
 * 2. It is claimed **once** and the slot is deleted, so the same answers cannot
 *    be applied to a second account later.
 * 3. The write goes through `useProfile().save`, which is scoped to the signed-in
 *    user id, so it cannot reach anyone else's row.
 *
 * The slot is deliberately device-scoped rather than account-scoped, because the
 * whole point is to survive the moment the account appears. It is not part of
 * the account-scoped key set in `@/lib/account-state`.
 */
import type { Database } from "@/integrations/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfilePatch = Database["public"]["Tables"]["profiles"]["Update"];

const KEY = "ud_pending_profile";

export interface OnboardingData {
  display_name: string;
  university: string;
  language: "en" | "ar";
}

function attempt(run: () => void) {
  try {
    run();
  } catch {
    // Private mode, or storage disabled entirely. Nothing to do but carry on.
  }
}

/** Keep the answers for whichever account is created or signed into next. */
export function rememberOnboarding(data: OnboardingData) {
  if (typeof window === "undefined") return;
  attempt(() => window.localStorage.setItem(KEY, JSON.stringify(data)));
}

/**
 * Read the answers and delete the slot in the same breath, so they can only ever
 * be applied once.
 */
export function takePendingOnboarding(): OnboardingData | null {
  if (typeof window === "undefined") return null;

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
  attempt(() => window.localStorage.removeItem(KEY));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<OnboardingData>;
    if (typeof parsed.display_name !== "string") return null;
    return {
      display_name: parsed.display_name,
      university: typeof parsed.university === "string" ? parsed.university : "",
      language: parsed.language === "ar" ? "ar" : "en",
    };
  } catch {
    return null;
  }
}

/**
 * Which pending answers may be written to this profile, if any.
 *
 * Pure, so the rules can be tested without a database.
 *
 * All or nothing, deliberately. A row that already carries a name or a
 * university belongs to somebody who has used the app, which means the pending
 * answers are for a different person — filling in only their blank fields would
 * still be attributing one learner's name or university to another. So an
 * already-used profile is left completely alone.
 *
 * Language is only consulted for an otherwise untouched row, where `'en'` is
 * the column default and therefore indistinguishable from "never chosen".
 */
export function blankFieldsPatch(
  profile: ProfileRow | null,
  pending: OnboardingData | null,
): ProfilePatch {
  const patch: ProfilePatch = {};
  if (!pending) return patch;

  const blank = (value: string | null | undefined) => !value || value.trim() === "";

  // Any real content at all means this profile is not the one the answers were
  // typed for.
  const alreadyUsed = !blank(profile?.display_name) || !blank(profile?.university);
  if (alreadyUsed) return patch;

  if (!blank(pending.display_name)) {
    patch.display_name = pending.display_name.trim();
  }
  if (!blank(pending.university)) {
    patch.university = pending.university.trim();
  }
  if (pending.language === "ar" && (profile?.language ?? "en") === "en") {
    patch.language = "ar";
  }

  return patch;
}
