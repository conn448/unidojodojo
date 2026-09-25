/**
 * Nation picker for onboarding.
 *
 * This used to be a gate at the front of every lesson, which meant a learner
 * was asked where they study each time they opened a lesson they had already
 * started. It belongs in onboarding, where the answer is given once and then
 * used everywhere.
 */
import { useApp, Mascot } from "./app";
import { NATIONS } from "@/lib/curriculum";
import { useNation } from "@/lib/use-nation";

export function NationPicker() {
  const { locale } = useApp();
  const { nation, setNation } = useNation();
  const ar = locale === "ar";

  return (
    <section
      aria-labelledby="nation-picker-title"
      className="rounded-card border-2 border-border bg-card p-5"
    >
      <Mascot pose="wave" className="mb-4 scale-90" />
      <p className="text-xs font-extrabold uppercase text-accent-foreground">
        {ar ? "أين تدرس" : "Where you study"}
      </p>
      <h2
        id="nation-picker-title"
        className="mt-2 font-display text-2xl font-extrabold leading-tight"
      >
        {ar ? "أين تدرس؟" : "Where do you study?"}
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        {ar
          ? "قواعد المال تختلف بين إنجلترا واسكتلندا وويلز وأيرلندا الشمالية. سنعلّمك النظام الذي ينطبق عليك أنت."
          : "Money rules differ across England, Scotland, Wales and Northern Ireland. We will teach the one that applies to you."}
      </p>
      <div className="mt-5 grid gap-2">
        {NATIONS.map((option) => {
          const chosen = nation === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setNation(option.id)}
              aria-pressed={chosen}
              className={
                "min-h-12 rounded-button border-2 px-4 text-start font-bold transition " +
                (chosen
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary")
              }
            >
              {option.label[locale]}
            </button>
          );
        })}
      </div>
    </section>
  );
}
