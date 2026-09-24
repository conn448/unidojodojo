import { useCallback, useEffect, useState } from "react";
import type { Nation } from "@/lib/curriculum";

const KEY = "ud_nation";

/**
 * The student's UK nation, persisted locally.
 *
 * Deliberately kept out of the main app context: this is a single value with a
 * single owner, and the provider is a large file where a careless edit does
 * real damage. When accounts land this moves to the profile row.
 */
export function useNation() {
  const [nation, setNationState] = useState<Nation | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored) setNationState(stored as Nation);
    setReady(true);
  }, []);

  const setNation = useCallback((value: Nation) => {
    setNationState(value);
    try {
      localStorage.setItem(KEY, value);
    } catch {
      // Private browsing or storage disabled: session-only is still fine.
    }
  }, []);

  return { nation, setNation, ready };
}
