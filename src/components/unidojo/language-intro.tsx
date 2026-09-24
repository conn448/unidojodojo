/**
 * Short explainer for the English and Arabic toggle.
 *
 * Built as a self contained block so onboarding can drop it in as one of its
 * first steps. It says three things and stops: English is the default, Arabic
 * is a full translation rather than a partial one, and the choice is
 * remembered. The real toggle is rendered inline so the learner can try it
 * there and then instead of being told about a button they cannot see.
 */
import { LanguageToggle, Mascot, useCopy } from "./app";

export function LanguageIntro() {
  const t = useCopy();

  return (
    <section
      aria-labelledby="language-intro-title"
      className="rounded-card border-2 border-border bg-card p-5"
    >
      <Mascot pose="wave" className="mb-4 scale-90" />
      <p className="text-xs font-extrabold uppercase text-accent-foreground">
        {t.languageKicker}
      </p>
      <h2
        id="language-intro-title"
        className="mt-2 font-display text-2xl font-extrabold leading-tight"
      >
        {t.languageTitle}
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">{t.languageBody}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <LanguageToggle />
        <span className="text-sm font-semibold text-muted-foreground">{t.languageTryIt}</span>
      </div>
    </section>
  );
}
