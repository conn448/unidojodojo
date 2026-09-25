import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Home,
  LockKeyhole,
  MessageCircle,
  Share2,
  Sparkles,
  UserRound,
  Volume2,
  VolumeX,
} from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import { tracks, type Locale } from "@/lib/unidojo-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/use-auth";

type AppState = {
  locale: Locale;
  setLocale: (v: Locale) => void;
  name: string;
  setName: (v: string) => void;
  sound: boolean;
  setSound: (v: boolean) => void;
  streak: number;
  hearts: number;
  points: number;
  puzzleDone: boolean;
  completeLesson: () => void;
  completePuzzle: () => void;
  play: (tone?: "tap" | "win" | "wrong") => void;
};
const C = createContext<AppState | undefined>(undefined);
export function AppProvider({ children }: { children: ReactNode }) {
  const [locale, setL] = useState<Locale>("en");
  const [name, setN] = useState("Sam");
  const [sound, setSoundState] = useState(true);
  const [streak, setStreak] = useState(7);
  const [hearts] = useState(5);
  const [points, setPoints] = useState(540);
  const [puzzleDone, setPuzzleDone] = useState(false);
  useEffect(() => {
    const l = localStorage.getItem("ud_locale");
    const r = l === "ar" ? "ar" : "en";
    setL(r);
    document.documentElement.lang = r;
    document.documentElement.dir = r === "ar" ? "rtl" : "ltr";
    setN(localStorage.getItem("ud_name") || "Sam");
    setSoundState(localStorage.getItem("ud_sound") !== "off");
    setStreak(Number(localStorage.getItem("ud_streak") || 7));
    setPoints(Number(localStorage.getItem("ud_points") || 540));
    setPuzzleDone(localStorage.getItem("ud_puzzle_day") === new Date().toISOString().slice(0, 10));
  }, []);
  const setLocale = (v: Locale) => {
    setL(v);
    localStorage.setItem("ud_locale", v);
    document.documentElement.lang = v;
    document.documentElement.dir = v === "ar" ? "rtl" : "ltr";
  };
  const setName = (v: string) => {
    setN(v);
    localStorage.setItem("ud_name", v);
  };
  const setSound = (v: boolean) => {
    setSoundState(v);
    localStorage.setItem("ud_sound", v ? "on" : "off");
  };
  const play = (tone: "tap" | "win" | "wrong" = "tap") => {
    if (!sound || typeof window === "undefined") return;
    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = tone === "win" ? [523, 659, 784] : tone === "wrong" ? [220, 175] : [440];
    notes.forEach((freq, n) => {
      const o = ctx.createOscillator(),
        g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + n * 0.08);
      g.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + n * 0.08 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + n * 0.08 + 0.12);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(ctx.currentTime + n * 0.08);
      o.stop(ctx.currentTime + n * 0.08 + 0.14);
    });
    setTimeout(() => ctx.close(), 500);
  };
  const completeLesson = () => {
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem("ud_lesson_day") !== today) {
      localStorage.setItem("ud_lesson_day", today);
      setPoints((v) => {
        localStorage.setItem("ud_points", String(v + 100));
        return v + 100;
      });
      setStreak((v) => {
        const next = v + 1;
        localStorage.setItem("ud_streak", String(next));
        return next;
      });
    }
  };
  const completePuzzle = () => {
    localStorage.setItem("ud_puzzle_day", new Date().toISOString().slice(0, 10));
    setPuzzleDone(true);
    setPoints((v) => {
      localStorage.setItem("ud_points", String(v + 25));
      return v + 25;
    });
  };
  return (
    <C.Provider
      value={{
        locale,
        setLocale,
        name,
        setName,
        sound,
        setSound,
        streak,
        hearts,
        points,
        puzzleDone,
        completeLesson,
        completePuzzle,
        play,
      }}
    >
      {children}
    </C.Provider>
  );
}
export function useApp() {
  const c = useContext(C);
  if (!c) throw new Error("AppProvider missing");
  return c;
}
export function useCopy() {
  const { locale } = useApp();
  return locale === "ar" ? ar : en;
}
export function Mascot({ pose = "wave", className }: { pose?: string; className?: string }) {
  return (
    <div className={cn("mascot", className)} role="img" aria-label={`Dojo ${pose}`}>
      <div className="ear ear-a" />
      <div className="ear ear-b" />
      <div className="face">
        <span className="eye eye-a" />
        <span className="eye eye-b" />
        <span className="mask mask-a" />
        <span className="mask mask-b" />
        <span className="nose" />
      </div>
    </div>
  );
}
export function Brand() {
  const t = useCopy();
  return (
    <Link
      to="/home"
      className="flex min-w-0 items-center gap-2 font-display text-base font-extrabold sm:text-xl"
    >
      <Mascot className="scale-[0.65] sm:scale-75" />
      <span className="truncate">{t.brand}</span>
    </Link>
  );
}
export function Page({
  children,
  dark = false,
  nav = true,
}: {
  children: ReactNode;
  dark?: boolean;
  nav?: boolean;
}) {
  const t = useCopy();
  return (
    <div className={cn("min-h-dvh pb-24", dark && "surface-ink")}>
      <main className="mx-auto min-h-dvh w-full max-w-5xl px-5 py-5 sm:px-8">{children}</main>
      {nav && (
        <nav
          aria-label="Primary"
          className="fixed inset-x-0 bottom-0 z-30 mx-auto grid max-w-sm grid-cols-2 border-t-2 border-border bg-background/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
        >
          <Nav to="/home" icon={<Home />} label={t.home} />
          <Nav to="/topics" icon={<BookOpen />} label={t.learn} />
        </nav>
      )}
    </div>
  );
}
function Nav({ to, icon, label }: { to: "/home" | "/topics"; icon: ReactNode; label: string }) {
  return (
    <Link
      to={to}
      activeProps={{ className: "text-primary" }}
      className="flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] text-muted-foreground [&_svg]:size-5"
    >
      {icon}
      {label}
    </Link>
  );
}
export function Header({ title, back }: { title?: string; back?: boolean }) {
  const { locale, sound, setSound, play, name } = useApp();
  const { user } = useAuth();
  const initial = (name.trim()[0] || "?").toUpperCase();
  return (
    <header className="mb-7 flex items-center gap-2">
      {back ? (
        <Button
          variant="ghost"
          size="icon"
          className="min-h-11 min-w-11 flex-none"
          aria-label="Back"
          onClick={() => history.back()}
        >
          {locale === "ar" ? <ArrowRight /> : <ArrowLeft />}
        </Button>
      ) : (
        <Brand />
      )}
      {title && (
        <h1 className="min-w-0 flex-1 truncate font-display text-xl font-extrabold">{title}</h1>
      )}
      {!title && <div className="min-w-0 flex-1" />}
      <Button
        variant="ghost"
        size="icon"
        className="min-h-11 min-w-11 flex-none max-[400px]:hidden"
        aria-label={sound ? "Mute sounds" : "Turn sounds on"}
        onClick={() => {
          setSound(!sound);
          if (!sound) setTimeout(() => play("tap"), 0);
        }}
      >
        {sound ? <Volume2 /> : <VolumeX />}
      </Button>
      <LanguageToggle />
      <Link
        to="/profile"
        aria-label={locale === "ar" ? "حسابك" : "Your account"}
        title={user?.email ?? (locale === "ar" ? "حسابك" : "Your account")}
        className="grid size-11 flex-none place-items-center rounded-full border-2 border-border bg-card text-sm font-extrabold text-primary"
      >
        {user ? initial : <UserRound className="size-5" />}
      </Link>
    </header>
  );
}
export function LanguageToggle() {
  const { locale, setLocale, play } = useApp();
  const on = locale === "ar";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Arabic"
      title={on ? "Switch to English" : "التبديل إلى العربية"}
      onClick={() => {
        setLocale(on ? "en" : "ar");
        play("tap");
      }}
      className="inline-flex min-h-11 flex-none items-center gap-2 rounded-pill border-2 border-border bg-card px-2.5 text-sm font-extrabold"
    >
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-5 w-9 flex-none items-center rounded-pill transition-colors",
          on ? "bg-primary" : "bg-muted-foreground/40",
        )}
      >
        <span
          className={cn(
            "absolute size-4 rounded-full bg-white shadow-sm transition-all",
            on ? "left-[1.15rem]" : "left-0.5",
          )}
        />
      </span>
      <span className="hidden sm:inline">{on ? "English" : "العربية"}</span>
    </button>
  );
}
export function TrackCard({ track, index }: { track: (typeof tracks)[number]; index: number }) {
  const { locale } = useApp();
  return (
    <Link
      to="/topics/$trackId"
      params={{ trackId: track.id }}
      className="group block rounded-card border-2 border-border bg-card p-5 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mb-8 flex items-start justify-between gap-3">
        <span className="grid size-12 flex-none place-items-center rounded-button bg-primary text-xl font-extrabold text-primary-foreground">
          {track.icon}
        </span>
        <span className="text-end text-sm text-muted-foreground">
          {track.lessons.length} {locale === "ar" ? "دروس" : "lessons"}
        </span>
      </div>
      <h3 className="font-display text-xl font-extrabold">{track.title[locale]}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{track.description[locale]}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary">
        {locale === "ar" ? "استكشف المسار" : "Explore track"}
        <ChevronRight className="directional size-4" />
      </span>
    </Link>
  );
}
export function ProgressRing({ value = 3, total = 5 }: { value?: number; total?: number }) {
  const p = (value / total) * 100;
  return (
    <div className="progress-ring" style={{ "--progress": `${p * 3.6}deg` } as React.CSSProperties}>
      <div>
        <strong>{value}</strong>
        <span>/{total}</span>
      </div>
    </div>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-bold uppercase text-accent-foreground">{eyebrow}</p>
        )}
        <h2 className="font-display text-2xl font-bold">{title}</h2>
      </div>
      {action}
    </div>
  );
}
export function EmptyState({ action }: { action?: ReactNode }) {
  const t = useCopy();
  return (
    <div className="py-14 text-center">
      <Mascot pose="reading" className="mx-auto mb-5 scale-125" />
      <p className="mx-auto max-w-xs text-muted-foreground">{t.empty}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
export const icons = { Check, LockKeyhole, MessageCircle, Share2, Sparkles };
