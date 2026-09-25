/**
 * Account level actions: feedback, data export and account deletion.
 *
 * Export and deletion read and write only the caller's own rows. That is not a
 * convenience, it is the only thing the database will permit: every table here
 * has row level security scoped to auth.uid(), so an unfiltered select returns
 * the learner's rows and nobody else's.
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
    supabase.from("lesson_progress").select("*"),
    supabase.from("quiz_answers").select("*"),
    supabase.from("feedback").select("*"),
    supabase.from("society_memberships").select("*"),
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
