/**
 * The signed in learner's row in `profiles`.
 *
 * Same shape as `use-auth`: a module level store read through
 * `useSyncExternalStore`, so any screen can ask for the profile without
 * threading it through context, and two screens can never disagree.
 *
 * Nothing touches the network at import time. The store starts empty, the
 * server snapshot is always empty, and the fetch only happens in an effect,
 * which keeps the static prerender on GitHub Pages safe.
 */
import { useEffect, useSyncExternalStore } from "react";
import type { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfilePatch = Database["public"]["Tables"]["profiles"]["Update"];

type ProfileState = { profile: Profile | null; ready: boolean; userId: string | null };

const EMPTY: ProfileState = { profile: null, ready: false, userId: null };

let snapshot: ProfileState = EMPTY;
const listeners = new Set<() => void>();

/**
 * Which user the store currently reflects, or undefined before anything has
 * loaded. Used to make repeated calls from several mounted components cheap.
 */
let loadedFor: string | null | undefined;

function emit(next: ProfileState) {
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

/** Server and prerender snapshot: no user, nothing loaded. */
function getServerSnapshot() {
  return EMPTY;
}

async function load(userId: string | null) {
  if (loadedFor === userId) return;
  loadedFor = userId;

  if (!userId) {
    emit({ profile: null, ready: true, userId: null });
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    // Treat an unreadable profile as absent rather than blocking the screen.
    emit({ profile: null, ready: true, userId });
    return;
  }

  if (data) {
    emit({ profile: data, ready: true, userId });
    return;
  }

  // The signup trigger creates this row. Accounts made before the trigger
  // existed will not have one, so create it on first sight.
  const { data: created } = await supabase
    .from("profiles")
    .insert({ id: userId })
    .select()
    .maybeSingle();

  emit({ profile: created ?? null, ready: true, userId });
}

async function write(userId: string, patch: ProfilePatch) {
  const { data } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...patch })
    .select()
    .maybeSingle();

  if (data) emit({ profile: data, ready: true, userId });
}

export function useProfile() {
  const { user, ready: authReady } = useAuth();
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!authReady) return;
    if (state.userId === userId) return;
    void load(userId);
  }, [authReady, userId, state.userId]);

  return {
    profile: state.profile,
    ready: state.ready,
    signedIn: userId !== null,
    /** No-op when signed out, so callers never have to check first. */
    save: (patch: ProfilePatch) => (userId ? write(userId, patch) : Promise.resolve()),
  };
}
