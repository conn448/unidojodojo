/**
 * Lesson progress and quiz answers for the signed in learner.
 *
 * Writes are fire and forget on purpose. A learner mid-lesson must never be
 * interrupted, or have a heart deducted, because a network call failed. The
 * lesson player keeps working exactly as before when signed out.
 *
 * Same store shape as `use-auth` and `use-profile`: empty until a component
 * mounts, empty server snapshot, no network at import time, so the static
 * prerender stays safe.
 */
import { useEffect, useSyncExternalStore } from "react";
import type { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";

export type ProgressRow = {
  lesson_id: string;
  score: number | null;
  completed: boolean;
};

type ProgressState = { rows: ProgressRow[]; ready: boolean; userId: string | null };

const EMPTY: ProgressState = { rows: [], ready: false, userId: null };

let snapshot: ProgressState = EMPTY;
const listeners = new Set<() => void>();
let loadedFor: string | null | undefined;

function emit(next: ProgressState) {
  snapshot = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return EMPTY;
}

async function load(userId: string | null) {
  if (loadedFor === userId) return;
  loadedFor = userId;

  if (!userId) {
    emit({ rows: [], ready: true, userId: null });
    return;
  }

  // Filtered on the user id as well as scoped by row level security. The second
  // gate is the one that matters if a policy is ever changed by mistake.
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id, score, completed")
    .eq("user_id", userId);

  emit({ rows: error ? [] : (data ?? []), ready: true, userId });
}

/** Upsert a result. `score` is 0 to 100 over practice steps only. */
export async function saveLessonResult(input: {
  userId: string;
  lessonId: string;
  trackId: string;
  completed: boolean;
  score: number | null;
}) {
  await supabase.from("lesson_progress").upsert(
    {
      user_id: input.userId,
      lesson_id: input.lessonId,
      track_id: input.trackId,
      completed: input.completed,
      score: input.score,
      completed_at: input.completed ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,lesson_id" },
  );

  loadedFor = undefined;
  void load(input.userId);
}

/** One row per answered practice step, correct or not. */
export async function saveAnswer(input: {
  userId: string;
  lessonId: string;
  questionId: string;
  answer: Json;
  correct: boolean;
}) {
  await supabase.from("quiz_answers").insert({
    user_id: input.userId,
    lesson_id: input.lessonId,
    question_id: input.questionId,
    answer: input.answer,
    correct: input.correct,
  });
}

export function useProgress() {
  const { user, ready: authReady } = useAuth();
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!authReady) return;
    if (state.userId === userId) return;
    void load(userId);
  }, [authReady, userId, state.userId]);

  // Derived here so every caller agrees on what completed and accuracy mean.
  const completed = state.rows.filter((row) => row.completed).map((row) => row.lesson_id);
  const scored = state.rows.filter((row) => row.score !== null);

  return {
    rows: state.rows,
    completed,
    /** Mean of the stored scores, or null when nothing has been scored yet. */
    accuracy: scored.length
      ? Math.round(scored.reduce((sum, row) => sum + (row.score ?? 0), 0) / scored.length)
      : null,
    ready: state.ready,
    userId,
  };
}
