/**
 * Account level actions: feedback, data export and account deletion.
 *
 * Export and deletion read and write only the caller's own rows. Row level
 * security already scopes every table here to auth.uid(), but the reads below
 * also filter on the user id. That redundancy is deliberate: if a policy were
 * ever dropped or applied wrongly, an unfiltered "download my data" would
 * quietly hand one learner everybody else's progress in a file. Two independent
 * gates is the right number for something that writes to disk.
 */
import { supabase } from "@/integrations/supabase/client";

type Locale = "en" | "ar";

export async function submitFeedback(input: {
  userId: string | null;
  topic: string;
  message: string;
  locale: Locale;
}) {
  const { error } = await supabase.from("feedback").insert({
    user_id: input.userId,
    topic: input.topic,
    message: input.message,
    locale: input.locale,
  });
  return { ok: !error, message: error?.message ?? null };
}

/** Everything held for this learner, as one plain object. */
export async function exportMyData(userId: string) {
  const [profile, progress, answers, feedback, memberships] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("lesson_progress").select("*").eq("user_id", userId),
    supabase.from("quiz_answers").select("*").eq("user_id", userId),
    // Anonymous feedback has a null user_id and is intentionally not this
    // learner's to export.
    supabase.from("feedback").select("*").eq("user_id", userId),
    supabase.from("society_memberships").select("*").eq("user_id", userId),
  ]);

  return {
    exported_at: new Date().toISOString(),
    account_id: userId,
    profile: profile.data ?? null,
    lesson_progress: progress.data ?? [],
    quiz_answers: answers.data ?? [],
    feedback: feedback.data ?? [],
    society_memberships: memberships.data ?? [],
  };
}

/**
 * Removes the learner's rows and the login itself.
 *
 * The login cannot be deleted with the browser key, so this calls a function
 * that runs with elevated rights. See supabase/apply-account-delete.sql.
 */
export async function deleteMyAccount() {
  // Cast because the generated types predate this function. Regenerate them
  // with the Supabase CLI and the cast can go.
  const { error } = await supabase.rpc("delete_my_account" as never);
  return { ok: !error, message: error?.message ?? null };
}
