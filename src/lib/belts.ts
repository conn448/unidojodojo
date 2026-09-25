/**
 * Belts.
 *
 * The app has exactly one progression: a level derived from points, written as
 * `Math.floor(points / 100) + 1` on the home screen. A belt is the *name* of that
 * level, so this is a lookup and not a second system — no new state, no storage,
 * no database, nothing to migrate. The level stays the single source of truth.
 *
 * Copy lives here as bilingual `L` values rather than in the locale files, which
 * is how `curriculum.ts` stores its own content.
 */
import type { L } from "./curriculum";

/** Points that make one level. Matches the derivation already in use. */
export const POINTS_PER_LEVEL = 100;

/**
 * Levels per belt. A belt spans several levels, which is the only reason the
 * belt bar on the character card is not the same bar as the level bar.
 */
export const LEVELS_PER_BELT = 5;

export interface Belt {
  id: string;
  name: L;
  /** Swatch colour for the belt chip. */
  color: string;
}

export const BELTS: Belt[] = [
  { id: "white", name: { en: "White belt", ar: "الحزام الأبيض" }, color: "#e7e5e4" },
  { id: "yellow", name: { en: "Yellow belt", ar: "الحزام الأصفر" }, color: "#facc15" },
  { id: "orange", name: { en: "Orange belt", ar: "الحزام البرتقالي" }, color: "#fb923c" },
  { id: "green", name: { en: "Green belt", ar: "الحزام الأخضر" }, color: "#4ade80" },
  { id: "blue", name: { en: "Blue belt", ar: "الحزام الأزرق" }, color: "#60a5fa" },
  { id: "black", name: { en: "Black belt", ar: "الحزام الأسود" }, color: "#1c1917" },
];

/** The belt a level sits in, plus the one after it. Pure, so it cannot drift. */
export function beltFor(level: number): { belt: Belt; next: Belt | null } {
  const index = Math.min(
    Math.max(Math.floor((level - 1) / LEVELS_PER_BELT), 0),
    BELTS.length - 1,
  );
  return { belt: BELTS[index]!, next: BELTS[index + 1] ?? null };
}
