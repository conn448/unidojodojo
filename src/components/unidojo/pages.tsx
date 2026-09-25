import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  Bell,
  Check,
  ChevronRight,
  Download,
  Eye,
  Flame,
  Heart,
  LockKeyhole,
  LogIn,
  LogOut,
  MessageCircle,
  Moon,
  Puzzle,
  ShieldCheck,
  Sparkles,
  Trash2,
  Trophy,
} from "lucide-react";
import {
  AppProvider,
  EmptyState,
  Header,
  LanguageToggle,
  Mascot,
  Page,
  ProgressRing,
  SectionTitle,
  TrackCard,
  useApp,
  useCopy,
} from "./app";
import { LanguageIntro } from "./language-intro";
import { NationPicker } from "./nation-picker";
import { dailyRunway, tracks } from "@/lib/unidojo-data";
import { useAuth } from "@/lib/use-auth";
import { useProfile } from "@/lib/use-profile";
import { submitFeedback, exportMyData, deleteMyAccount } from "@/lib/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export { AppProvider };
export function LanguagePage() {
  const t = useCopy(),
    { setLocale } = useApp(),
    nav = useNavigate();
  return (
    <Page dark nav={false}>
      <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col">
        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-bold">UniDojo</span>
          <span className="text-sm opacity-70">1 / 3</span>
        </div>
        <div className="my-auto py-10">
          <Mascot className="mb-10 scale-150 origin-left rtl:origin-right" />
          <p className="mb-3 text-sm font-bold uppercase text-accent">WELCOME · أهلاً</p>
          <h1 className="max-w-xl font-display text-4xl font-bold leading-tight sm:text-6xl">
            {t.languageTitle}
          </h1>
          <p className="mt-4 max-w-md text-lg opacity-75">{t.languageBody}</p>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ["en", t.english, "English"],
              ["ar", t.arabic, "العربية"],
              ["en", t.both, "English + العربية"],
            ].map(([v, label, sub]) => (
              <button
                key={label}
                onClick={() => {
                  setLocale(v as "en" | "ar");
                  nav({ to: "/onboarding" });
                }}
                className="min-h-28 rounded-card border border-primary-foreground/20 bg-primary-foreground/5 p-5 text-start transition hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <strong className="block text-xl">{label}</strong>
                <span className="mt-2 block text-sm opacity-65">{sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}
export function OnboardingPage() {
  const t = useCopy(),
    { name, setName, play, locale } = useApp(),
    nav = useNavigate();
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState(0);
  const [university, setUniversity] = useState("");
  const { save } = useProfile();
  const levels = ["Starting fresh", "Know the basics", "Ready to level up"];
  const goals = ["Spend with confidence", "Build a safety buffer", "Understand investing"];
  return (
    <Page nav={false}>
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <Mascot className="scale-75" />
            <strong className="font-display text-lg">UniDojo</strong>
          </div>
          <span className="text-sm font-bold text-muted-foreground">{step + 1} / 3</span>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>
        <div className="py-9">
          <Mascot
            pose={step === 2 ? "success" : "wave"}
            className="mb-9 scale-150 origin-left rtl:origin-right"
          />
          <p className="reward-kicker">{["YOUR DOJO", "YOUR LEVEL", "YOUR GOAL"][step]}</p>
          <h1 className="mt-4 font-display text-4xl leading-tight">
            {step === 0
              ? t.onboardingTitle
              : step === 1
                ? "Where are you starting?"
                : "What is your first win?"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {step === 0
              ? "This takes less than a minute. We’ll shape your daily path around you."
              : step === 1
                ? "No judgement. This only changes where your path begins."
                : "Pick one goal. You can explore everything else later."}
          </p>
          {step === 0 && (
            <div className="mt-8 space-y-5">
              <label className="block font-semibold">
                {t.name}
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 min-h-14 text-lg"
                />
              </label>
              <label className="block font-semibold">
                {t.university}
                <Input
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. University of Manchester"
                  className="mt-2 min-h-14"
                />
              </label>
            </div>
          )}
          {step === 0 && (
            <div className="mt-8">
              <LanguageIntro />
            </div>
          )}
          {step === 0 && (
            <div className="mt-8">
              <NationPicker />
            </div>
          )}
          {step > 0 && (
            <div className="mt-8 grid gap-3">
              {(step === 1 ? levels : goals).map((x, i) => (
                <Button
                  key={x}
                  variant={choice === i ? "default" : "outline"}
                  className="min-h-16 justify-start text-base"
                  onClick={() => {
                    setChoice(i);
                    play();
                  }}
                >
                  {choice === i && <Check />}
                  {x}
                </Button>
              ))}
            </div>
          )}
          <Button
            size="lg"
            className="mt-9 min-h-14 w-full bg-accent text-lg text-accent-foreground shadow-reward"
            onClick={() => {
              play("win");
              if (step < 2) {
                setStep((x) => x + 1);
                setChoice(0);
              } else {
                localStorage.setItem("ud_onboarded", "yes");
                // Saved only here, on the deliberate finish, not on every
                // keystroke of the name field.
                void save({ display_name: name, university, language: locale });
                nav({ to: "/home" });
              }
            }}
          >
            {step < 2 ? t.continue : t.finishSetup}
            <ChevronRight className="directional" />
          </Button>
          {step === 2 && (
            <Link
              to="/auth"
              className="mt-3 grid min-h-12 w-full place-items-center rounded-button border-2 border-border bg-card font-bold"
            >
              {t.saveProgress}
            </Link>
          )}
          {step > 0 && (
            <Button variant="ghost" className="mt-2 w-full" onClick={() => setStep((x) => x - 1)}>
              {t.back}
            </Button>
          )}
        </div>
      </div>
    </Page>
  );
}
export function HomePage() {
  const t = useCopy(),
    { name, locale, streak, hearts, points } = useApp();
  return (
    <Page>
      <Header />
      <div className="mx-auto max-w-2xl">
        <section className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              {t.greeting}, {name}
            </p>
            <h1 className="mt-1 font-display text-3xl">{t.dailyPath}</h1>
          </div>
          <div className="flex gap-2">
            <span className="reward-pill amber" aria-label={`${streak} day streak`}>
              <Flame />
              <strong>{streak}</strong>
            </span>
            <span className="reward-pill mint" aria-label={`${hearts} hearts`}>
              <Heart />
              <strong>{hearts}</strong>
            </span>
          </div>
        </section>
        <div className="mt-7 flex items-center gap-4 rounded-card border bg-card p-4">
          <div className="grid size-12 place-items-center rounded-full bg-primary font-display text-primary-foreground">
            5
          </div>
          <div className="grow">
            <div className="flex justify-between text-sm">
              <strong>{t.level} 5</strong>
              <span>{points} pts</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[68%] rounded-full bg-accent" />
            </div>
          </div>
        </div>
        <section className="runway mt-8">
          <div className="runway-line" />
          {dailyRunway.map((node, i) => (
            <RunwayNode key={node.id} node={node} index={i} locale={locale} />
          ))}
        </section>
      </div>
    </Page>
  );
}
function RunwayNode({
  node,
  index,
  locale,
}: {
  node: (typeof dailyRunway)[number];
  index: number;
  locale: "en" | "ar";
}) {
  const t = useCopy();
  const active = node.state === "active",
    done = node.state === "done",
    locked = node.state === "locked";
  const isLesson = node.kind === "lesson";
  return (
    <div className={cn("runway-stop", active && "featured", locked && "opacity-55")}>
      <Link
        to={isLesson ? "/lesson/$lessonId" : "/home"}
        params={isLesson ? { lessonId: node.id } : (undefined as never)}
        onClick={(e) => locked && e.preventDefault()}
      >
        <span className={cn("runway-node", active && "active", done && "done", locked && "locked")}>
          {done ? <Check /> : locked ? <LockKeyhole /> : <Sparkles />}
        </span>
        <div className="mt-3 text-center">
          <small>{isLesson ? (active ? t.todaysLesson : t.nextLesson) : t.reviewLabel}</small>
          <h2 className="font-display text-xl">{node.title[locale]}</h2>
          {active && (
            <>
              <p className="mt-1 text-sm text-muted-foreground">{t.lessonMeta}</p>
              <span className="btn-3d mt-4 inline-flex min-h-12 items-center rounded-button bg-primary px-6 font-extrabold text-primary-foreground">
                {t.startToday}
                <ChevronRight className="directional ms-2 size-4" />
              </span>
            </>
          )}
        </div>
      </Link>
      {index === 1 && <Mascot pose="reading" className="runway-mascot scale-125" />}
    </div>
  );
}
export function TopicsPage({ trackId }: { trackId?: string }) {
  const { locale } = useApp(),
    t = useCopy();
  const list = trackId ? tracks.filter((x) => x.id === trackId) : tracks;
  return (
    <Page>
      <Header title={trackId ? (list[0]?.title[locale] ?? t.learn) : t.learn} back={!!trackId} />
      {!trackId ? (
        <div className="grid gap-4 md:grid-cols-3">
          {list.map((x, i) => (
            <TrackCard key={x.id} track={x} index={i} />
          ))}
        </div>
      ) : (
        <>
          <section className="mb-8 rounded-card bg-primary p-6 text-primary-foreground">
            <span className="text-4xl">{list[0]?.icon}</span>
            <h1 className="mt-6 font-display text-3xl font-bold">{list[0]?.title[locale]}</h1>
            <p className="mt-2 max-w-lg opacity-75">{list[0]?.description[locale]}</p>
          </section>
          <div className="space-y-3">
            {list[0]?.lessons.map((l, i) => (
              <Link
                key={l.id}
                to={l.locked ? "/topics/$trackId" : "/lesson/$lessonId"}
                params={l.locked ? { trackId: trackId } : { lessonId: l.id }}
                className="grid min-h-20 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-card border bg-card p-4"
              >
                <span className="grid size-11 place-items-center rounded-full bg-muted font-bold">
                  {l.locked ? <LockKeyhole className="size-4" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <strong className="block truncate">{l.title[locale]}</strong>
                  <span className="text-sm text-muted-foreground">
                    {l.minutes} {t.minutes}
                  </span>
                </span>
                <ChevronRight className="directional size-5" />
              </Link>
            ))}
          </div>
        </>
      )}
    </Page>
  );
}
export function ProfilePage() {
  const t = useCopy(),
    { name, locale } = useApp();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  return (
    <Page>
      <Header title={t.profile} />
      <div className="flex items-center gap-4 border-b pb-7">
        <div className="grid size-16 flex-none place-items-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          {name[0]}
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold">{name}</h1>
          <p className="truncate text-muted-foreground">
            {user?.email ?? (locale === "ar" ? "طالب جامعي" : "University student")}
          </p>
          {profile?.university ? (
            <p className="truncate text-sm text-muted-foreground">{profile.university}</p>
          ) : null}
        </div>
      </div>
      <section className="py-7">
        <SectionTitle title={locale === "ar" ? "تعلّمك" : "Your learning"} />
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat n="7" l={locale === "ar" ? "دروس" : "Lessons"} />
          <Stat n="84%" l={locale === "ar" ? "دقة" : "Accuracy"} />
          <Stat n="46m" l={locale === "ar" ? "وقت" : "Time"} />
        </div>
      </section>
      <div className="space-y-2">
        {user ? (
          <button
            type="button"
            onClick={() => {
              void signOut();
            }}
            className="grid min-h-14 w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-b px-1 text-start"
          >
            <span className="text-primary [&_svg]:size-5">
              <LogOut />
            </span>
            <span className="font-semibold">{t.logout}</span>
            <ChevronRight className="directional size-4 text-muted-foreground" />
          </button>
        ) : (
          <Menu
            to="/auth"
            icon={<LogIn />}
            label={locale === "ar" ? "سجّل الدخول لحفظ تقدّمك" : "Sign in to save progress"}
          />
        )}
      </div>
    </Page>
  );
}
function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-card bg-muted p-4">
      <strong className="block font-display text-xl">{n}</strong>
      <span className="text-xs text-muted-foreground">{l}</span>
    </div>
  );
}
function Menu({ to, icon, label }: { to: "/auth"; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="grid min-h-14 grid-cols-[auto_1fr_auto] items-center gap-3 border-b px-1"
    >
      <span className="text-primary [&_svg]:size-5">{icon}</span>
      <span className="font-semibold">{label}</span>
      <ChevronRight className="directional size-4 text-muted-foreground" />
    </Link>
  );
}
export function SettingsPage() {
  const t = useCopy(),
    { locale, sound, setSound } = useApp();
  return (
    <Page>
      <Header title={t.settings} back />
      <div className="space-y-2">
        <Setting icon={<Moon />} title={locale === "ar" ? "تقليل الحركة" : "Reduce motion"} />
        <Setting icon={<Eye />} title={locale === "ar" ? "نص أكبر" : "Larger text"} />
        <Setting
          icon={<Bell />}
          title={locale === "ar" ? "إشعارات التعلّم" : "Learning notifications"}
        />
        <div className="grid min-h-16 grid-cols-[1fr_auto] items-center gap-3 border-b">
          <span className="font-semibold">
            {locale === "ar" ? "المؤثرات الصوتية" : "Sound effects"}
          </span>
          <Switch checked={sound} onCheckedChange={setSound} aria-label="Sound effects" />
        </div>
        <div className="flex min-h-16 items-center justify-between border-b">
          <span className="font-semibold">{locale === "ar" ? "لغة التطبيق" : "App language"}</span>
          <LanguageToggle />
        </div>
      </div>
    </Page>
  );
}
function Setting({ icon, title }: { icon: React.ReactNode; title: string }) {
  const [v, setV] = useState(false);
  return (
    <div className="grid min-h-16 grid-cols-[auto_1fr_auto] items-center gap-3 border-b">
      <span>{icon}</span>
      <span className="font-semibold">{title}</span>
      <Switch checked={v} onCheckedChange={setV} aria-label={title} />
    </div>
  );
}
export function FeedbackPage() {
  const t = useCopy(),
    { locale } = useApp();
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const ideas = ["Rent", "Credit scores", "Zakat", "Student loans"];

  async function send() {
    setBusy(true);
    setError("");
    const result = await submitFeedback({
      userId: user?.id ?? null,
      topic: topic || "General",
      message: note,
      locale,
    });
    setBusy(false);
    if (result.ok) {
      setTopic("");
      setNote("");
      setDone(true);
      return;
    }
    setError(result.message ?? "Could not send that just now.");
  }

  return (
    <Page>
      <Header title={t.feedback} back />
      {done ? (
        <EmptyState
          action={
            <Button onClick={() => setDone(false)}>
              {locale === "ar" ? "أرسل فكرة أخرى" : "Send another idea"}
            </Button>
          }
        />
      ) : (
        <div className="mx-auto max-w-xl">
          <Mascot pose="thinking" className="mb-8 scale-125" />
          <h1 className="font-display text-3xl font-bold">
            {locale === "ar" ? "ما الذي نعلّمه لاحقاً؟" : "What should we teach next?"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {locale === "ar"
              ? "اختر فكرة أو اكتب ما يدور في بالك."
              : "Pick an idea or tell us what is on your mind."}
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {ideas.map((x) => (
              <Button
                key={x}
                variant={topic === x ? "default" : "outline"}
                className="rounded-full"
                aria-pressed={topic === x}
                onClick={() => setTopic(topic === x ? "" : x)}
              >
                {x}
              </Button>
            ))}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-5 min-h-36 w-full rounded-card border bg-card p-4 focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder={locale === "ar" ? "اكتب اقتراحك (اختياري)" : "Add a note (optional)"}
          />
          <Button
            className="mt-4 min-h-12 w-full rounded-button"
            disabled={busy || (!topic && !note.trim())}
            onClick={send}
          >
            {locale === "ar" ? "أرسل الاقتراح" : "Send suggestion"}
          </Button>
          {error ? (
            <p
              role="status"
              className="mt-3 rounded-button bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}
        </div>
      )}
    </Page>
  );
}
export function PrivacyPage() {
  const t = useCopy(),
    { locale } = useApp();
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState<"export" | "delete" | null>(null);
  const [status, setStatus] = useState("");

  async function doExport() {
    if (!user) return;
    setBusy("export");
    setStatus("");
    const data = await exportMyData(user.id);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "unidojo-data.json";
    link.click();
    URL.revokeObjectURL(url);
    setBusy(null);
  }

  async function doDelete() {
    if (!user) return;
    const sure = window.confirm(
      locale === "ar"
        ? "سيُحذف حسابك وتقدّمك نهائياً. لا يمكن التراجع."
        : "This deletes your account and everything in it. It cannot be undone.",
    );
    if (!sure) return;
    setBusy("delete");
    setStatus("");
    const result = await deleteMyAccount();
    if (result.ok) {
      await signOut();
      return;
    }
    setBusy(null);
    setStatus(result.message ?? "Could not delete that just now.");
  }

  return (
    <Page>
      <Header title={t.privacy} back />
      <div className="prose-copy mx-auto max-w-2xl">
        <h1>{locale === "ar" ? "بياناتك تحت سيطرتك" : "Your data stays in your control"}</h1>
        <p>
          {locale === "ar"
            ? "نحفظ تفضيلات التعلّم والتقدّم وإجابات الاختبارات لنساعدك على المتابعة. لا نحفظ بيانات حسابات مالية أبداً."
            : "We store your learning preferences, progress and quiz answers so you can continue. We never store financial account data."}
        </p>
        <p>
          {locale === "ar"
            ? "يمكنك تنزيل بياناتك أو حذف حسابك في أي وقت. لا توجد خطوات خفية."
            : "You can download your data or delete your account at any time. There are no hidden steps."}
        </p>
        {user ? (
          <>
            <Button
              variant="outline"
              className="mt-5 min-h-12 w-full rounded-button"
              disabled={busy !== null}
              onClick={doExport}
            >
              <Download />
              {t.export}
            </Button>
            <Button
              variant="outline"
              className="mt-3 min-h-12 w-full rounded-button text-destructive"
              disabled={busy !== null}
              onClick={doDelete}
            >
              <Trash2 />
              {t.delete}
            </Button>
          </>
        ) : (
          <p className="mt-5 rounded-card border-2 border-border bg-card p-4 text-sm">
            {locale === "ar"
              ? "سجّل الدخول لتنزيل بياناتك أو حذف حسابك."
              : "Sign in to download your data or delete your account."}
          </p>
        )}
        {status ? (
          <p role="status" className="mt-3 text-sm text-destructive">
            {status}
          </p>
        ) : null}
      </div>
    </Page>
  );
}
export function AuthPage() {
  const t = useCopy(),
    { locale } = useApp();
  const { user, ready, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  async function magic() {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + import.meta.env.BASE_URL + "home" },
    });
    setBusy(false);
    setMsg(error ? error.message : t.sent);
  }
  async function social(p: "google" | "github") {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: p,
      options: { redirectTo: window.location.origin + import.meta.env.BASE_URL + "auth" },
    });
    if (error) setMsg(error.message);
  }
  if (ready && user) {
    return (
      <Page dark nav={false}>
        <div className="mx-auto flex min-h-[calc(100dvh-2.5rem)] max-w-md flex-col justify-center">
          <Mascot className="mb-8 scale-150 origin-left rtl:origin-right" />
          <h1 className="font-display text-4xl font-bold">
            {locale === "ar" ? "أنت مسجّل الدخول" : "You are signed in"}
          </h1>
          <p className="mt-3 break-all opacity-70">{user.email}</p>
          <Link
            to="/home"
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-button bg-accent text-accent-foreground font-extrabold"
          >
            {locale === "ar" ? "إلى مساحة التعلّم" : "Go to my learning"}
          </Link>
          <Button
            variant="outline"
            className="mt-3 min-h-12 w-full rounded-button border-primary-foreground/25 bg-transparent text-primary-foreground"
            onClick={() => {
              void signOut();
            }}
          >
            {t.logout}
          </Button>
          <p className="mt-6 text-sm opacity-60">{t.noBankDetails}</p>
        </div>
      </Page>
    );
  }
  return (
    <Page dark nav={false}>
      <div className="mx-auto flex min-h-[calc(100dvh-2.5rem)] max-w-md flex-col justify-center">
        <Mascot className="mb-8 scale-150 origin-left rtl:origin-right" />
        <h1 className="font-display text-4xl font-bold">{t.authTitle}</h1>
        <p className="mt-3 opacity-70">{t.noBankDetails}</p>
        <div className="mt-8 space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.email}
            className="min-h-12 rounded-button bg-primary-foreground text-foreground"
          />
          <Button
            className="min-h-12 w-full rounded-button bg-accent text-accent-foreground"
            disabled={busy || !email}
            onClick={magic}
          >
            {t.magicLink}
          </Button>
          <div className="py-2 text-center text-sm opacity-50">or / أو</div>
          <Button
            variant="outline"
            className="min-h-12 w-full rounded-button border-primary-foreground/25 bg-transparent text-primary-foreground"
            onClick={() => social("google")}
          >
            {t.google}
          </Button>
          <Button
            variant="outline"
            className="min-h-12 w-full rounded-button border-primary-foreground/25 bg-transparent text-primary-foreground"
            onClick={() => social("github")}
          >
            {t.github}
          </Button>
          {msg && (
            <p role="status" className="rounded-button bg-primary-foreground/10 p-3 text-sm">
              {msg}
            </p>
          )}
        </div>
      </div>
    </Page>
  );
}
