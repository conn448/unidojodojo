/**
 * Supabase auth session, shared by every component that asks for it.
 *
 * The session lives in a module level store rather than inside AppProvider so
 * that any screen can read it without threading it through the context, and so
 * the auth and profile screens can never disagree about who is signed in.
 *
 * Nothing here touches the network or local storage at import time. The store
 * starts empty and only fills in when a component subscribes, which keeps the
 * static prerender on GitHub Pages safe: during prerender there is no browser
 * session, the server snapshot is always the empty one, and no request is made.
 */
import { useSyncExternalStore } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthSnapshot = { session: Session | null; ready: boolean };

const EMPTY: AuthSnapshot = { session: null, ready: false };

let snapshot: AuthSnapshot = EMPTY;
const listeners = new Set<() => void>();
let started = false;

function emit(next: AuthSnapshot) {
  snapshot = next;
  for (const listener of listeners) listener();
}

/** Only ever called from subscribe, which React runs in the browser. */
function start() {
  if (started || typeof window === "undefined") return;
  started = true;

  void supabase.auth
    .getSession()
    .then(({ data }) => emit({ session: data.session, ready: true }))
    // A failed read is not worth blocking the page for: treat it as signed out.
    .catch(() => emit(EMPTY));

  supabase.auth.onAuthStateChange((_event, session) => {
    emit({ session, ready: true });
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  start();
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

/** Server and prerender snapshot: nobody is signed in and we are not waiting. */
function getServerSnapshot() {
  return EMPTY;
}

export function useAuth() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const user: User | null = state.session?.user ?? null;

  return {
    session: state.session,
    user,
    ready: state.ready,
    signOut: () => supabase.auth.signOut(),
  };
}
