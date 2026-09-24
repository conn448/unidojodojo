/**
 * UniDojo curriculum model.
 *
 * Design notes
 * ------------
 * Exercise types below mirror the mechanics that actually drive Duolingo's
 * retention: short lessons (3-8 min), one decision per screen, immediate
 * feedback on every tap, and a mix of recall styles rather than repeated
 * multiple choice. `numeric` and `scenario` steps are what let this teach
 * money at university level instead of staying trivial.
 *
 * Every lesson carries its own `sources` array. Content must be traceable to a
 * real, checkable reference, no invented figures. Where a figure is
 * UK-specific (student loans, ISAs) the lesson says so explicitly, because the
 * audience is UK university students but the app may be read elsewhere.
 */

export type Locale = "en" | "ar";
/** A string that exists in both shipping languages. */
export type L = Record<Locale, string>;

export interface Source {
  /** Shown in-app, e.g. "MoneyHelper, Budgeting". */
  label: string;
  url: string;
  /** Who publishes it, so students can judge how much to trust it. */
  publisher: string;
}

/* ------------------------------------------------------------------ */
/* Exercise types                                                      */
/* ------------------------------------------------------------------ */

/**
 * A lesson is taught, then tested. Steps default to `teach`/`practice` based on
 * their kind, so a lesson only has to declare `phase` when it wants to override
 * that. Accuracy and XP are scored on practice steps only, being asked
 * something you have not been taught yet is not a test, it is a guess.
 */
/**
 * UK nation. This matters because the money rules genuinely differ: student
 * loan payment frequency, deposit protection schemes and repayment plans are
 * all nation-specific. Steps can be tagged with `nations` so a lesson can say
 * different true things to different students instead of one wrong thing to
 * everyone.
 */
export type Nation = "england" | "scotland" | "wales" | "northern-ireland";

export const NATIONS: Array<{ id: Nation; label: L }> = [
  { id: "england", label: { en: "England", ar: "إنجلترا" } },
  { id: "scotland", label: { en: "Scotland", ar: "اسكتلندا" } },
  { id: "wales", label: { en: "Wales", ar: "ويلز" } },
  { id: "northern-ireland", label: { en: "Northern Ireland", ar: "أيرلندا الشمالية" } },
];

export type Phase = "teach" | "practice";

export type StepBody =
  /** Teaching beat: one idea, no interaction. */
  | { k: "idea"; title: L; body: L; points?: L[] }
  /** Worked example. Shows the numbers; asks nothing. */
  | {
      k: "example";
      title: L;
      setup: L;
      rows: Array<{ label: L; value: L }>;
      takeaway: L;
    }
  /** Common mistake, called out before the learner can make it. */
  | { k: "watchout"; title: L; body: L }
  /** Multiple choice with a single correct option. */
  | { k: "choice"; prompt: L; options: L[]; answer: number; why: L }
  /** Tap pairs to connect a term to its meaning. Good for vocabulary. */
  | { k: "match"; prompt: L; pairs: Array<{ left: L; right: L }> }
  /** Tap into the correct sequence. Order of `items` is the answer. */
  | { k: "order"; prompt: L; items: L[]; why: L }
  /** Complete the sentence by tapping words from a bank. */
  | { k: "fill"; prompt: L; bef
  phase?: Phase;
  /** When set, this step is only shown to students in these nations. */
  nations?: Nation[];
L; bank: L[]; answer: string[]; why: L }
  /**
   * Numeric input. Use ONLY where the number itself is the insight (a rate, a
   * threshold). This is a financial literacy app, not a mental-arithmetic test:
   * if the learner has to do multi-step arithmetic, the question is wrong.
   */
  | { k: "numeric"; prompt: L; unit?: string; answer: number; tolerance: number; why: L }
  /** Sort items into buckets, e.g. need vs want, halal vs not. */
  | { k: "categorise"; prompt: L; buckets: Array<{ name: L; items: L[] }> }
  /** Branching real-world decision. */
  | {
      k: "scenario";
      prompt: L;
      options: Array<{ label: L; outcome: L; delta: number }>;
    };

export type Step = StepBody & { phase?: Phase };


/**
 * Untagged steps apply to everyone. Tagged steps apply only when the student's
 * nation is known and matches. While nation is unknown we show untagged steps
 * only, which is why lessons must not put nation-specific claims in untagged
 * steps.
 */
export const stepApplies = (step: Step, nation: Nation | null): boolean =>
  !step.nations || (nation !== null && step.nations.includes(nation));

export const stepsFor = (steps: Step[], nation: Nation | null): Step[] =>
  steps.filter((step) => stepApplies(step, nation));
const TEACHING_KINDS = new Set(["idea", "example", "watchout"]);

export const stepPhase = (step: Step): Phase =>
  step.phase ?? (TEACHING_KINDS.has(step.k) ? "teach" : "practice");

export interface Lesson {
  id: string;
  title: L;
  /** One sentence: what the student can do afterwards. */
  objective: L;
  minutes: number;
  xp: number;
  /** Why this lesson exists at university level, not school level. */
  relevance: L;
  steps: Step[];
  sources: Source[];
}

export interface Unit {
  id: string;
  title: L;
  /** Units end with a checkpoint to force spaced retrieval. */
  checkpoint?: boolean;
  lessons: Lesson[];
}

export interface Track {
  id: string;
  title: L;
  tagline: L;
  icon: string;
  /**
   * Optional branches are surfaced but never gated. The Islamic finance track
   * is optional by design: many students already know the rulings, and those
   * who do not should not have it forced on them.
   */
  optional?: boolean;
  audience?: L;
  units: Unit[];
}

/* ------------------------------------------------------------------ */
/* Verified sources                                                    */
/* ------------------------------------------------------------------ */

export const SOURCES = {
  moneyHelper: {
    label: "Budgeting guides and free budget planner",
    url: "https://www.moneyhelper.org.uk/en/everyday-money/budgeting",
    publisher: "MoneyHelper (UK Money & Pensions Service)",
  },
  mseStudents: {
    label: "Student money guides, loans, budgeting, bank accounts",
    url: "https://www.moneysavingexpert.com/students/",
    publisher: "MoneySavingExpert",
  },
  saasScotland: {
    label: "Student funding in Scotland, including payment schedules",
    url: "https://www.saas.gov.uk/",
    publisher: "Student Awards Agency Scotland (SAAS)",
  },
  ifg: {
    label: "Halal investing, Zakat and Islamic mortgage guides",
    url: "https://www.islamicfinanceguru.com/",
    publisher: "Islamic Finance Guru",
  },
  govStudentFinance: {
    label: "Student finance: eligibility, loans and repayments",
    url: "https://www.gov.uk/student-finance",
    publisher: "GOV.UK",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Tracks                                                              */
/* ------------------------------------------------------------------ */

export const tracks: Track[] = [
  {
    id: "money",
    title: { en: "Money Basics", ar: "أساسيات المال" },
    tagline: {
      en: "Make your money behave before it runs out",
      ar: "اجعل مالك منظماً قبل أن ينتهي",
    },
    icon: "£",
    units: [
      {
        id: "money-u1",
        title: { en: "Where it goes", ar: "إلى أين يذهب" },
        lessons: [
                              {
            id: "money-plan",
            title: { en: "Build a budget that bends", ar: "ابنِ ميزانية مرنة" },
            objective: {
              en: "Build a weekly plan you can keep for a whole term, and know what to do when a week goes over.",
              ar: "ابنِ خطة أسبوعية تستمر عليها فصلاً كاملاً، واعرف ما تفعله حين يتجاوز أسبوع حدّه.",
            },
            minutes: 9,
            xp: 150,
            relevance: {
              en: "How often your money arrives depends on where you are funded. Scottish students on SAAS are paid monthly, while students in England, Wales and Northern Ireland usually get theirs in a few larger instalments. Either way, spending happens daily and that gap is what you have to manage.",
              ar: "وتيرة وصول مالك تعتمد على جهة تمويلك. الطلاب في اسكتلندا عبر SAAS يتلقون دفعات شهرية، بينما يتلقى الطلاب في إنجلترا وويلز وأيرلندا الشمالية مبالغ أكبر على دفعات أقل. وفي الحالتين، الإنفاق يومي، وهذه الفجوة هي ما عليك إدارته.",
            },
            steps: [
              {
                k: "idea",
                title: { en: "Money in bursts, spending in drips", ar: "المال دفعات والإنفاق قطرات" },
                body: {
                  en: "The timing of your money and the timing of your spending almost never match. That mismatch is the whole problem a budget solves.",
                  ar: "توقيت وصول مالك وتوقيت إنفاقك لا يتطابقان إلا نادراً. هذا التباعد هو المشكلة التي تحلّها الميزانية.",
                },
                points: [
                  { en: "Where you are paid monthly, rent leaving monthly is easy to line up.", ar: "إن كنت تُدفع شهرياً، فخروج الإيجار شهرياً أمر سهل الموازنة." },
                  { en: "Where you are paid in a few large instalments, a big balance in October is not October's money. It is the whole term's.", ar: "إن كنت تتلقى دفعات كبيرة قليلة، فالرصيد الكبير في أكتوبر ليس مال أكتوبر، بل مال الفصل كله." },
                  { en: "Food, travel and going out leave every day, in amounts small enough to ignore until they are not.", ar: "الطعام والتنقل والخروج تُصرف يومياً، بمبالغ صغيرة تتجاهلها حتى تصبح كبيرة." },
                  { en: "Check your own provider's payment schedule before you budget. The number and timing of payments is not the same across the UK.", ar: "تحقّق من جدول الدفعات لدى جهة تمويلك قبل أن تضع الميزانية. عدد الدفعات وتوقيتها يختلفان بين أنحاء بريطانيا." },
                ],
              },
              {
                k: "example",
                title: { en: "One term, one number", ar: "فصل واحد ورقم واحد" },
                setup: {
                  en: "You have rent and bills covered and £420 left for the term. Here is what that has to cover.",
                  ar: "غطّيت الإيجار والفواتير وبقي لديك 420 جنيهاً للفصل. وهذا ما يجب أن تغطيه.",
                },
                rows: [
                  { label: { en: "Term length", ar: "مدة الفصل" }, value: { en: "12 weeks", ar: "12 أسبوعاً" } },
                  { label: { en: "Left after rent and bills", ar: "المتبقي بعد الإيجار والفواتير" }, value: { en: "£420", ar: "420 جنيهاً" } },
                  { label: { en: "Books and course kit", ar: "الكتب ومستلزمات الدراسة" }, value: { en: "£40", ar: "40 جنيهاً" } },
                  { label: { en: "Left to live on", ar: "المتبقي للمعيشة" }, value: { en: "£380", ar: "380 جنيهاً" } },
                ],
                takeaway: {
                  en: "£380 over 12 weeks is your real weekly number. Notice it is not the £420 you first saw. Course costs are a real expense that students forget to plan for.",
                  ar: "380 جنيهاً على 12 أسبوعاً هو رقمك الأسبوعي الحقيقي. لاحظ أنه ليس 420 جنيهاً الذي رأيته أولاً. تكاليف الدراسة مصروف حقيقي ينسى الطلاب التخطيط له.",
                },
              },
              {
                k: "watchout",
                title: { en: "The monthly budget trap", ar: "فخ الميزانية الشهرية" },
                body: {
                  en: "Divide a term's money by months and you get a number that feels harmless. Then you try to live on it for a week and discover it was never weekly at all. Divide by the weeks you actually have, not the months a template assumes.",
                  ar: "اقسم مال الفصل على الأشهر فتحصل على رقم يبدو هادئاً. ثم تحاول أن تعيش عليه أسبوعاً فتحتاج أن تفهم أنه لم يكن أسبوعياً أبداً. اقسم على الأسابيع التي لديك فعلاً، لا على الأشهر التي تفترضها النماذج.",
                },
              },
              {
                k: "idea",
                title: { en: "Give every week a number", ar: "أعطِ كل أسبوع رقماً" },
                body: {
                  en: "A weekly number turns a scary total into a decision you make on Monday.",
                  ar: "الرقم الأسبوعي يحوّل مبلغاً مخيفاً إلى قرار تتخذه يوم الاثنين.",
                },
                points: [
                  { en: "You know what you can spend before you spend it.", ar: "تعرف ما يمكنك إنفاقه قبل أن تنفقه." },
                  { en: "Overspending affects one week, not the whole term.", ar: "التجاوز يؤثر على أسبوع واحد، لا على الفصل كله." },
                  { en: "A number you can hold in your head is a number you will actually use.", ar: "الرقم الذي تستطيع تذكّره هو الرقم الذي ستستخدمه فعلاً." },
                ],
              },
              {
                k: "categorise",
                prompt: {
                  en: "Sort these. Which leave your account no matter what you do, and which are yours to decide?",
                  ar: "صنّف هذه. أيّها يخرج من حسابك مهما فعلت، وأيّها قرارك أنت؟",
                },
                buckets: [
                  {
                    name: { en: "Leaves anyway", ar: "يخرج على أي حال" },
                    items: [{ en: "Rent", ar: "الإيجار" }, { en: "Phone contract", ar: "عقد الهاتف" }, { en: "Insurance", ar: "التأمين" }],
                  },
                  {
                    name: { en: "Your call", ar: "قرارك أنت" },
                    items: [{ en: "Food shop", ar: "تسوّق الطعام" }, { en: "Nights out", ar: "الخروج" }, { en: "New trainers", ar: "حذاء جديد" }],
                  },
                ],
              },
              {
                k: "match",
                prompt: { en: "Match each term to what it means.", ar: "طابق كل مصطلح مع معناه." },
                pairs: [
                  { left: { en: "Fixed cost", ar: "تكلفة ثابتة" }, right: { en: "Leaves whether or not you spend well", ar: "تخرج سواء أحسنت الإنفاق أم لا" } },
                  { left: { en: "Variable cost", ar: "تكلفة متغيّرة" }, right: { en: "You control the amount each week", ar: "تتحكم في مبلغها كل أسبوع" } },
                  { left: { en: "Sunk cost", ar: "تكلفة غارقة" }, right: { en: "Money already spent that you cannot recover", ar: "مال أُنفق ولا يمكن استرجاعه" } },
                  { left: { en: "Opportunity cost", ar: "تكلفة الفرصة" }, right: { en: "The thing you gave up to afford it", ar: "الشيء الذي تنازلت عنه لتتحمّل ثمنه" } },
                ],
              },
              {
                k: "choice",
                prompt: {
                  en: "What does a weekly number actually protect you from?",
                  ar: "من ماذا يحميك الرقم الأسبوعي فعلاً؟",
                },
                options: [
                  { en: "Running out of money before the term ends", ar: "نفاد المال قبل انتهاء الفصل" },
                  { en: "Spending money on things you enjoy", ar: "الإنفاق على أشياء تستمتع بها" },
                  { en: "Needing to check your balance", ar: "الحاجة إلى تفقّد رصيدك" },
                  { en: "Paying rent on time", ar: "دفع الإيجار في وقته" },
                ],
                answer: 0,
                why: {
                  en: "A weekly number spreads your money across the weeks you actually have. Rent being paid is a different problem, solved by setting rent money aside, not by budgeting.",
                  ar: "الرقم الأسبوعي يوزّع مالك على الأسابيع التي لديك فعلاً. أما دفع الإيجار فمشكلة أخرى تُحل بحجز مال الإيجار جانباً، لا بالميزانية.",
                },
              },
              {
                k: "order",
                prompt: {
                  en: "Money arrives. Put the decisions in the right order.",
                  ar: "وصل المال. رتّب القرارات بالترتيب الصحيح.",
                },
                items: [
                  { en: "Set rent and bills aside first", ar: "اعزل الإيجار والفواتير أولاً" },
                  { en: "Cover course costs you know are coming", ar: "غطِّ تكاليف الدراسة المعلومة مسبقاً" },
                  { en: "Move something to savings", ar: "حوّل مبلغاً إلى المدخرات" },
                  { en: "Divide what remains by weeks left", ar: "اقسم ما تبقّى على الأسابيع المتبقية" },
                ],
                why: {
                  en: "Fixed commitments come out before anything else, because they are not optional. Savings go next, before you have a chance to absorb the money into ordinary spending.",
                  ar: "الالتزامات الثابتة تخرج أولاً لأنها ليست اختيارية. ثم المدخرات، قبل أن يذوب المال في الإنفاق اليومي.",
                },
              },
              {
                k: "scenario",
                prompt: {
                  en: "Week nine. You have £60 left and a close friend's birthday weekend will cost £45.",
                  ar: "الأسبوع التاسع. بقي 60 جنيهاً وعطلة ميلاد صديق مقرّب ستكلّف 45 جنيهاً.",
                },
                options: [
                  {
                    label: { en: "Go, and eat cheaply for the week", ar: "اذهب، وقلّل الطعام هذا الأسبوع" },
                    outcome: {
                      en: "You stayed inside the term budget. It is a tight week, but you are not borrowing from the weeks after it.",
                      ar: "بقيت داخل ميزانية الفصل. أسبوع ضاغط، لكنك لا تقترض من الأسابيع التالية.",
                    },
                    delta: 15,
                  },
                  {
                    label: { en: "Go, and sort it out later", ar: "اذهب، ونرتّب الأمر لاحقاً" },
                    outcome: {
                      en: "£45 spent with £15 left for everything else. That gap is exactly how a student overdraft starts.",
                      ar: "أُنفق 45 وبقي 15 لكل شيء آخر. هذه الفجوة بالضبط كيف يبدأ السحب على المكشوف.",
                    },
                    delta: -10,
                  },
                  {
                    label: { en: "Skip it and keep the whole £45", ar: "لا تذهب واحتفظ بالـ 45 كاملة" },
                    outcome: {
                      en: "Your budget survives, but a plan that stops you seeing your friends is a plan you will abandon by week eleven.",
                      ar: "ميزانيتك تنجو، لكن خطة تمنعك من رؤية أصدقائك هي خطة ستتركها بحلول الأسبوع الحادي عشر.",
                    },
                    delta: 5,
                  },
                ],
              },
            ],
            sources: [SOURCES.moneyHelper, SOURCES.mseStudents, SOURCES.saasScotland],
          },
          {
            id: "money-tracking",
            title: { en: "Track without an app", ar: "تابع مصروفك بلا تطبيق" },
            objective: {
              en: "Know where your money went in under two minutes a week.",
              ar: "اعرف أين ذهب مالك في أقل من دقيقتين أسبوعياً.",
            },
            minutes: 5,
            xp: 90,
            relevance: {
              en: "Most budgets fail at data entry, not at maths. A rough number you keep beats a perfect one you abandon.",
              ar: "معظم الميزانيات تفشل عند إدخال البيانات لا عند الحساب. رقم تقريبي تستمر عليه أفضل من رقم دقيق تتركه.",
            },
            steps: [
              {
                k: "idea",
                title: { en: "Two minutes, weekly", ar: "دقيقتان كل أسبوع" },
                body: {
                  en: "A rough weekly total beats a perfect log you stop keeping. The goal is awareness, not accounting.",
                  ar: "إجمالي أسبوعي تقريبي أفضل من سجل مثالي تتوقف عن كتابته. الهدف هو الوعي لا المحاسبة.",
                },
              },
              {
                k: "match",
                prompt: {
                  en: "Match each term to what it actually means.",
                  ar: "طابق كل مصطلح مع معناه الفعلي.",
                },
                pairs: [
                  { left: { en: "Fixed cost", ar: "تكلفة ثابتة" }, right: { en: "Same every month", ar: "ثابتة شهرياً" } },
                  { left: { en: "Variable cost", ar: "تكلفة متغيّرة" }, right: { en: "Moves week to week", ar: "تتغيّر أسبوعياً" } },
                  { left: { en: "Sunk cost", ar: "تكلفة غارقة" }, right: { en: "Already spent, unrecoverable", ar: "أُنفقت ولا تُسترجع" } },
                  { left: { en: "Opportunity cost", ar: "تكلفة الفرصة" }, right: { en: "What you gave up for it", ar: "ما تنازلت عنه لأجلها" } },
                ],
              },
              {
                k: "order",
                prompt: {
                  en: "Put the weekly check in the right order.",
                  ar: "رتّب المراجعة الأسبوعية بالترتيب الصحيح.",
                },
                items: [
                  { en: "Check your balance", ar: "تحقّق من رصيدك" },
                  { en: "Note what left the account", ar: "سجّل ما خرج من الحساب" },
                  { en: "Subtract the fixed costs", ar: "اخصم التكاليف الثابتة" },
                  { en: "Divide what is left by weeks remaining", ar: "اقسم الباقي على الأسابيع المتبقية" },
                ],
                why: {
                  en: "Fixed costs come out first because they are not negotiable. Only then can you see what is actually spendable.",
                  ar: "تُخصم التكاليف الثابتة أولاً لأنها غير قابلة للتفاوض، وعندها فقط ترى ما يمكن إنفاقه فعلاً.",
                },
              },
              {
                k: "fill",
                prompt: { en: "Complete the idea.", ar: "أكمل الفكرة." },
                before: { en: "Money already spent is", ar: "المال الذي أُنفق بالفعل" },
                after: {
                  en: ",  the only question left is what it buys you next.",
                  ar: ",  والسؤال الوحيد المتبقي هو ماذا يشتري لك لاحقاً.",
                },
                bank: [
                  { en: "gone", ar: "قد ذهب" },
                  { en: "invested", ar: "مُستثمر" },
                  { en: "owed", ar: "مُستحق" },
                  { en: "free", ar: "مجاني" },
                ],
                answer: ["gone"],
                why: {
                  en: "That is the sunk cost trap. A wasted £40 is wasted whether or not you sit through a bad film to justify it.",
                  ar: "هذا هو فخ التكلفة الغارقة. الأربعون جنيهاً الضائعة ضائعة سواء أكملت الفيلم السيئ لتبريرها أم لا.",
                },
              },
              {
                k: "choice",
                prompt: {
                  en: "You have logged nothing for three weeks. What is the right move?",
                  ar: "لم تسجّل شيئاً لثلاثة أسابيع. ما الخطوة الصحيحة؟",
                },
                options: [
                  { en: "Start again from today", ar: "ابدأ من اليوم" },
                  { en: "Reconstruct all three weeks", ar: "أعد بناء الأسابيع الثلاثة" },
                  { en: "Give up on tracking", ar: "اترك التتبع" },
                  { en: "Find a better app", ar: "ابحث عن تطبيق أفضل" },
                ],
                answer: 0,
                why: {
                  en: "Reconstruction is exactly the chore that kills the habit. Starting from today keeps the streak and the awareness.",
                  ar: "إعادة البناء هي العبء الذي يقتل العادة. البدء من اليوم يحفظ الاستمرارية والوعي.",
                },
              },
              {
                k: "idea",
                title: { en: "The rule", ar: "القاعدة" },
                body: {
                  en: "A system you actually keep beats a better system you drop. Optimise for keeping it, not for precision.",
                  ar: "نظام تلتزم به فعلاً أفضل من نظام أدقّ تتركه. حسّن استمراريتك لا دقّتك.",
                },
              },
            ],
            sources: [SOURCES.moneyHelper],
          },
                    {
            id: "money-needs",
            title: { en: "Needs, wants, and lies", ar: "الضروريات والرغبات والأكاذيب" },
            objective: {
              en: "Tell a real need from a want that has learned to sound like one.",
              ar: "ميّز الحاجة الحقيقية من رغبة تعلّمت أن تتحدث بلسان الحاجة.",
            },
            minutes: 7,
            xp: 120,
            relevance: {
              en: "Marketing aimed at students works by making wants feel like needs. Spotting the swap is a skill, not a personality trait.",
              ar: "التسويق الموجّه للطلاب يعمل بتحويل الرغبات إلى ما يشبه الضروريات. ملاحظة هذا التحويل مهارة، لا سمة شخصية.",
            },
            steps: [
              {
                k: "idea",
                title: { en: "A need has a consequence", ar: "للحاجة نتيجة" },
                body: {
                  en: "The test is not how much you want it. The test is what actually happens if you do not buy it.",
                  ar: "المعيار ليس شدة رغبتك، بل ما يحدث فعلاً إن لم تشترِه.",
                },
                points: [
                  { en: "Food is a need. Takeaway on a bad day is a want.", ar: "الطعام حاجة. أما الوجبات الجاهزة في يوم سيئ فرغبة." },
                  { en: "A laptop for your course is a need. A faster one is a preference.", ar: "الحاسوب لدراستك حاجة. أما الأسرع فتفضيل." },
                  { en: "A phone is a need. Replacing a working one is a want.", ar: "الهاتف حاجة. أما استبدال هاتف يعمل فرغبة." },
                ],
              },
              {
                k: "watchout",
                title: { en: "The upgrade slide", ar: "انزلاق الترقية" },
                body: {
                  en: "Shops rarely sell you a want directly. They sell you a small step up from a need. You came for a coat and left with the one that cost twice as much, and it felt reasonable the whole way.",
                  ar: "المتاجر نادراً ما تبيعك رغبة صريحة. إنها تبيعك خطوة صغيرة فوق الحاجة. جئت لمعطف وخرجت بواحد يكلّف ضعف السعر، وبدا الأمر معقولاً في كل خطوة.",
                },
              },
              {
                k: "categorise",
                prompt: { en: "Sort these honestly. No judgement, just the consequence test.", ar: "صنّف هذه بصدق. لا حكم هنا، فقط اختبار النتيجة." },
                buckets: [
                  {
                    name: { en: "Need", ar: "حاجة" },
                    items: [{ en: "Bus pass for lectures", ar: "بطاقة الحافلة للمحاضرات" }, { en: "Prescription medicine", ar: "دواء بوصفة" }, { en: "Course textbook", ar: "كتاب المنهج" }],
                  },
                  {
                    name: { en: "Want", ar: "رغبة" },
                    items: [{ en: "Concert ticket", ar: "تذكرة حفل" }, { en: "Second pair of trainers", ar: "حذاء رياضي ثانٍ" }, { en: "Takeaway three nights running", ar: "وجبات جاهزة ثلاث ليالٍ متتالية" }],
                  },
                ],
              },
              {
                k: "choice",
                prompt: { en: "Your phone works but the new model is out. Which question actually settles it?", ar: "هاتفك يعمل لكن الطراز الجديد صدر. أي سؤال يحسم الأمر فعلاً؟" },
                options: [
                  { en: "What breaks if I do not buy it?", ar: "ما الذي ينكسر إن لم أشترِه؟" },
                  { en: "Can I afford it this month?", ar: "هل أستطيع تحمّله هذا الشهر؟" },
                  { en: "Is it good value compared to other phones?", ar: "هل قيمته جيدة مقارنة بهواتف أخرى؟" },
                  { en: "Will I still want it in a month?", ar: "هل سأرغبه بعد شهر؟" },
                ],
                answer: 0,
                why: {
                  en: "Affordability is not the same as need. The consequence question is the only one that separates the two, and it is deliberately uncomfortable.",
                  ar: "القدرة على الدفع ليست حاجة. سؤال النتيجة وحده يفصل بينهما، وهو سؤال مزعج عمداً.",
                },
              },
              {
                k: "scenario",
                prompt: { en: "It is week three. You have bought a £70 coat and a £45 night out, and you still need £60 for a course trip next month.", ar: "الأسبوع الثالث. اشتريت معطفاً بـ 70 جنيهاً وليلة ترفيه بـ 45، وما زلت تحتاج 60 جنيهاً لرحلة دراسية الشهر القادم." },
                options: [
                  {
                    label: { en: "Cut the takeaways until the trip is covered", ar: "قلّل الوجبات الجاهزة حتى تغطي الرحلة" },
                    outcome: { en: "You covered the trip and kept the coat. The money came from the category you had most slack in.", ar: "غطّيت الرحلة واحتفظت بالمعطف. جاء المال من البند الذي كان فيه أكبر هامش." },
                    delta: 15,
                  },
                  {
                    label: { en: "Skip the trip and keep the money", ar: "تخلَّ عن الرحلة واحتفظ بالمال" },
                    outcome: { en: "Your budget is fine but you missed a course trip for £60 you could have found elsewhere.", ar: "ميزانيتك بخير، لكنك فوّتت رحلة بـ 60 جنيهاً كان يمكن تدبيرها من بند آخر." },
                    delta: -5,
                  },
                  {
                    label: { en: "Borrow the £60 from a friend", ar: "استلف 60 جنيهاً من صديق" },
                    outcome: { en: "You solved this month. You also set a precedent that gets expensive by summer.", ar: "حللت هذا الشهر، وأسّست سابقة تصبح مكلفة بحلول الصيف." },
                    delta: -10,
                  },
                ],
              },
            ],
            sources: [SOURCES.moneyHelper],
          },
          {
            id: "money-cards",
            title: { en: "Debit, credit, and what you owe", ar: "الخصم والائتمان وما تدين به" },
            objective: {
              en: "Explain the difference between money you have and money you are borrowing.",
              ar: "اشرح الفرق بين مال تملكه ومال تستدينه.",
            },
            minutes: 8,
            xp: 130,
            relevance: {
              en: "Credit feels identical to cash at the till. The difference only appears later, which is exactly why it works on students.",
              ar: "الائتمان يبدو كالنقد تماماً عند الدفع. والفرق يظهر لاحقاً فقط، ولهذا بالضبط يعمل مع الطلاب.",
            },
            steps: [
              {
                k: "idea",
                title: { en: "Two numbers, not one", ar: "رقمان لا رقم واحد" },
                body: {
                  en: "A card has a balance and a limit. Confusing the two is how people spend money they do not have.",
                  ar: "البطاقة لها رصيد وسقف. والخلط بينهما هو كيف يُنفق الناس مالاً لا يملكونه.",
                },
                points: [
                  { en: "Balance is money that exists. It is yours.", ar: "الرصيد مال موجود، وهو لك." },
                  { en: "Limit is money the bank will lend you. It is not yours.", ar: "السقف مال يقرضك البنك إياه، وليس لك." },
                  { en: "A credit card spends the second number first, and the bill arrives later.", ar: "بطاقة الائتمان تنفق الرقم الثاني أولاً، والفاتورة تصل لاحقاً." },
                ],
              },
              {
                k: "example",
                title: { en: "How a credit card actually behaves", ar: "كيف تتصرّف بطاقة الائتمان فعلاً" },
                setup: { en: "A student spends £200 on a credit card with a £500 limit, and pays only the minimum.", ar: "ينفق طالب 200 جنيه على بطاقة ائتمان بسقف 500، ويسدد الحد الأدنى فقط." },
                rows: [
                  { label: { en: "Available credit afterwards", ar: "الائتمان المتاح بعدها" }, value: { en: "£300", ar: "300 جنيه" } },
                  { label: { en: "Money in the account", ar: "المال في الحساب" }, value: { en: "Unchanged", ar: "لم يتغيّر" } },
                  { label: { en: "Amount owed", ar: "المبلغ المستحق" }, value: { en: "£200", ar: "200 جنيه" } },
                  { label: { en: "Interest if only the minimum is paid", ar: "الفائدة إن سُدّد الحد الأدنى فقط" }, value: { en: "Added monthly", ar: "تُضاف شهرياً" } },
                ],
                takeaway: {
                  en: "The £300 is not extra money. It is the remainder of a loan you already took, and the interest runs while you decide what to do about it.",
                  ar: "الـ 300 جنيه لا تعني مالاً إضافياً. إنها بقية قرض أخذته بالفعل، والفائدة تجري بينما تقرر ما ستفعله.",
                },
              },
              {
                k: "watchout",
                title: { en: "Minimum payments are designed to feel fine", ar: "الأقساط الدنيا مصممة لتبدو مريحة" },
                body: {
                  en: "Paying the minimum keeps your account healthy and keeps the debt alive. It is the option that most reliably turns a small balance into a long one.",
                  ar: "سداد الحد الأدنى يُبقي حسابك سليماً ويُبقي الدين حياً. وهو الخيار الأكثر قدرة على تحويل رصيد صغير إلى دين طويل.",
                },
              },
              {
                k: "categorise",
                prompt: { en: "Which of these are actually money you have?", ar: "أيّ من هذه مال تملكه فعلاً؟" },
                buckets: [
                  {
                    name: { en: "Yours", ar: "ملكك" },
                    items: [{ en: "Maintenance loan in your account", ar: "دفعة المعيشة في حسابك" }, { en: "Overdraft", ar: "السحب على المكشوف" }, { en: "Money from a part time job", ar: "مال من عمل جزئي" }],
                  },
                  {
                    name: { en: "Borrowed", ar: "مقترض" },
                    items: [{ en: "Credit card limit", ar: "سقف بطاقة الائتمان" }, { en: "Buy now pay later balance", ar: "رصيد الشراء الآجل" }],
                  },
                ],
              },
              {
                k: "choice",
                prompt: { en: "A friend says their overdraft is free money because it has no interest. What is wrong with that?", ar: "يقول صديقك إن السحب على المكشوف مال مجاني لأنه بلا فائدة. ما الخطأ في ذلك؟" },
                options: [
                  { en: "It still has to be repaid, and the terms can change", ar: "يجب سداده، وقد تتغيّر شروطه" },
                  { en: "It has interest and they are mistaken", ar: "عليه فائدة وهو مخطئ" },
                  { en: "Nothing, if they are a student", ar: "لا شيء إن كان طالباً" },
                  { en: "It affects their credit score only", ar: "يؤثر على سمعته الائتمانية فقط" },
                ],
                answer: 0,
                why: {
                  en: "Student overdrafts are often interest free, but they are still a loan, usually repaid after graduation, and the bank sets the terms. Free of interest is not free.",
                  ar: "كثيراً ما تكون حسابات الطلاب بلا فائدة، لكنها تبقى قرضاً يُسدَّد عادة بعد التخرّج، والبنك يضع الشروط. انتفاء الفائدة لا يعني المجانية.",
                },
              },
            ],
            sources: [SOURCES.moneyHelper, SOURCES.mseStudents],
          },
          {
            id: "money-interest",
            title: { en: "What interest is really doing", ar: "ما تفعله الفائدة حقاً" },
            objective: {
              en: "Recognise when a payment plan costs more than the price on the label.",
              ar: "اعرف متى يكلّفك التقسيط أكثر من السعر المكتوب.",
            },
            minutes: 8,
            xp: 130,
            relevance: {
              en: "Buy now pay later is presented as the same price spread out. It is a credit agreement, and it behaves like one if anything goes wrong.",
              ar: "الشراء الآجل يُقدَّم كسعر واحد موزّع على دفعات. لكنه عقد ائتمان، ويتصرّف كعقد ائتمان إن حدث أي خلل.",
            },
            steps: [
              {
                k: "idea",
                title: { en: "Two numbers that decide everything", ar: "رقمان يحسمان كل شيء" },
                body: { en: "The rate, and the length. The rate is how fast it grows. The length is how long it has to grow.", ar: "النسبة والمدة. النسبة تحدد سرعة النمو، والمدة تحدد الوقت المتاح له." },
                points: [
                  { en: "A low rate over a long time can cost more than a high rate over a short one.", ar: "نسبة منخفضة لمدة طويلة قد تكلّف أكثر من نسبة مرتفعة لمدة قصيرة." },
                  { en: "The headline rate is rarely the whole cost.", ar: "النسبة المعلنة نادراً ما تكون التكلفة الكاملة." },
                  { en: "Ask for the total repayable, not the monthly payment.", ar: "اسأل عن إجمالي السداد، لا عن القسط الشهري." },
                ],
              },
              {
                k: "example",
                title: { en: "Same item, two ways to pay", ar: "نفس السلعة وطريقتان للدفع" },
                setup: { en: "A laptop costs £600. The shop offers two options.", ar: "حاسوب ثمنه 600 جنيه، ويعرض المتجر خيارين." },
                rows: [
                  { label: { en: "Pay now", ar: "الدفع الآن" }, value: { en: "£600", ar: "600 جنيه" } },
                  { label: { en: "Pay over 24 months", ar: "التقسيط على 24 شهراً" }, value: { en: "£32 per month", ar: "32 جنيهاً شهرياً" } },
                  { label: { en: "Total on the plan", ar: "الإجمالي بالتقسيط" }, value: { en: "£768", ar: "768 جنيهاً" } },
                  { label: { en: "Extra paid for the same laptop", ar: "الزيادة مقابل نفس الحاسوب" }, value: { en: "£168", ar: "168 جنيهاً" } },
                ],
                takeaway: {
                  en: "The monthly figure felt small. The total is where the decision lives, and it is the number the shop is least likely to put in large print.",
                  ar: "القسط الشهري بدا صغيراً. القرار كله في الإجمالي، وهو الرقم الأقل ظهوراً في إعلانات المتجر.",
                },
              },
              {
                k: "watchout",
                title: { en: "Zero percent has conditions", ar: "الـ 0% له شروط" },
                body: {
                  en: "Interest free offers usually depend on you paying on time every time. Miss one payment and the rate can apply from the start, not from the missed month. Always read what happens if you are late.",
                  ar: "عروض بلا فائدة تشترط عادة السداد في الوقت كل مرة. وإن تأخرت دفعة واحدة فقد تُطبَّق النسبة من البداية، لا من الشهر المتأخر فقط. اقرأ دائماً ما يحدث عند التأخر.",
                },
              },
              {
                k: "choice",
                prompt: { en: "Which of these tells you what a payment plan really costs?", ar: "أي من هذه يخبرك بالتكلفة الحقيقية لخطة التقسيط؟" },
                options: [
                  { en: "The total repayable over the whole plan", ar: "إجمالي السداد على مدى الخطة" },
                  { en: "The monthly payment", ar: "القسط الشهري" },
                  { en: "The headline interest rate", ar: "نسبة الفائدة المعلنة" },
                  { en: "The length of the plan", ar: "مدة الخطة" },
                ],
                answer: 0,
                why: {
                  en: "The total repayable already folds in the rate and the length, which is why it is the only figure you can compare across two different offers.",
                  ar: "إجمالي السداد يجمع النسبة والمدة معاً، ولهذا هو الرقم الوحيد القابل للمقارنة بين عرضين مختلفين.",
                },
              },
              {
                k: "scenario",
                prompt: { en: "You want a £480 phone. You can pay now, or spread it over 12 months at £46 per month.", ar: "تريد هاتفاً بـ 480 جنيهاً. يمكنك الدفع الآن أو تقسيطه على 12 شهراً بـ 46 جنيهاً شهرياً." },
                options: [
                  {
                    label: { en: "Save for three months and pay in full", ar: "وفّر ثلاثة أشهر وادفع كاملاً" },
                    outcome: { en: "You paid £480 and kept the £72 difference. Three months of waiting bought a pair of trainers.", ar: "دفعت 480 ووفّرت 72 جنيهاً فرقاً. ثلاثة أشهر انتظار اشترت لك حذاءً." },
                    delta: 20,
                  },
                  {
                    label: { en: "Take the 12 month plan", ar: "اختر خطة الـ 12 شهراً" },
                    outcome: { en: "You paid £552 for a £480 phone. That £72 was borrowed at a rate you never agreed to in those words.", ar: "دفعت 552 مقابل هاتف بـ 480. الـ 72 جنيهاً كانت قرضاً بنسبة لم توافق عليها بهذه الصياغة." },
                    delta: -10,
                  },
                  {
                    label: { en: "Buy a £250 phone outright", ar: "اشترِ هاتفاً بـ 250 نقداً" },
                    outcome: { en: "You spent less than either option and got a working phone. Worth asking which features you actually use.", ar: "أنفقت أقل من الخيارين وحصلت على هاتف يعمل. يحسن أن تسأل أي الميزات تستخدمها فعلاً." },
                    delta: 15,
                  },
                ],
              },
            ],
            sources: [SOURCES.moneyHelper],
          },
          {
            id: "money-safety",
            title: { en: "Spot the scam before it costs you", ar: "اكتشف الاحتيال قبل أن يكلّفك" },
            objective: {
              en: "Recognise the three shapes almost every student-targeted scam takes.",
              ar: "تعرّف على الأشكال الثلاثة التي تتخذها معظم عمليات الاحتيال على الطلاب.",
            },
            minutes: 7,
            xp: 120,
            relevance: {
              en: "Students are targeted for money mule accounts and rental deposits because they are new to both banking and renting.",
              ar: "الطلاب مستهدفون في حسابات تمرير الأموال وودائع الإيجار، لأنهم جدد على البنوك وعقود الإيجار معاً.",
            },
            steps: [
              {
                k: "idea",
                title: { en: "Three shapes", ar: "ثلاثة أشكال" },
                body: { en: "Almost every scam aimed at students is one of these three.", ar: "كل احتيال يستهدف الطلاب تقريباً يأخذ أحد هذه الأشكال الثلاثة." },
                points: [
                  { en: "Urgency. A deadline that stops you thinking.", ar: "الاستعجال. موعد نهائي يمنعك من التفكير." },
                  { en: "A payment you must make first to unlock something bigger.", ar: "دفعة يجب أن تسبق للحصول على شيء أكبر." },
                  { en: "Money passing through your account for someone else.", ar: "مال يمر عبر حسابك لشخص آخر." },
                ],
              },
              {
                k: "watchout",
                title: { en: "The money mule trap", ar: "فخ تمرير الأموال" },
                body: {
                  en: "Someone offers you a cut for receiving money and sending it on. It looks like easy work. In law it is money laundering, the account gets closed, and the consequences stay on your record long after university.",
                  ar: "يعرض عليك شخص نسبة مقابل استلام مال ثم تحويله. يبدو عملاً سهلاً. لكنه قانوناً تبييض أموال، ويُغلق الحساب، وتبقى التبعات في سجلك بعد الجامعة بزمن طويل.",
                },
              },
              {
                k: "categorise",
                prompt: { en: "Which of these should make you stop?", ar: "أي من هذه يجب أن يوقفك؟" },
                buckets: [
                  {
                    name: { en: "Red flag", ar: "إشارة خطر" },
                    items: [{ en: "A landlord abroad who cannot show you the flat", ar: "مالك في الخارج لا يستطيع إراءتك الشقة" }, { en: "A deposit demanded within the hour", ar: "وديعة تُطلب خلال ساعة" }, { en: "A job that only needs your bank details", ar: "وظيفة تحتاج بياناتك البنكية فقط" }],
                  },
                  {
                    name: { en: "Normal", ar: "أمر طبيعي" },
                    items: [{ en: "A written tenancy agreement", ar: "عقد إيجار مكتوب" }, { en: "A deposit protected in a scheme", ar: "وديعة محفوظة في نظام حماية" }],
                  },
                ],
              },
              {
                k: "choice",
                prompt: { en: "A letting agent asks for a deposit before you have seen the flat, because it is in high demand. What is the correct move?", ar: "يطلب وكيل عقاري وديعة قبل أن ترى الشقة لأن الطلب عليها مرتفع. ما التصرّف الصحيح؟" },
                options: [
                  { en: "Refuse to pay before viewing and seeing a written agreement", ar: "امتنع عن الدفع قبل المعاينة ورؤية عقد مكتوب" },
                  { en: "Pay a smaller holding deposit to secure it", ar: "ادفع وديعة حجز أصغر لتأمينها" },
                  { en: "Pay, but ask for a receipt", ar: "ادفع واطلب إيصالاً" },
                  { en: "Send the money to a friend to pay on your behalf", ar: "أرسل المال لصديق ليدفع بالنيابة عنك" },
                ],
                answer: 0,
                why: {
                  en: "Pressure plus payment before viewing is the classic rental scam. A genuine agent can show you the property and give you the agreement first.",
                  ar: "الضغط مع الدفع قبل المعاينة هو أسلوب الاحتيال الكلاسيكي في الإيجار. الوكيل الحقيقي يستطيع إراءتك العقار وتسليمك العقد أولاً.",
                },
              },
            ],
            sources: [SOURCES.moneyHelper, SOURCES.mseStudents],
          },
        ],
      },
    ],
  },
  {
    id: "student",
    title: { en: "Student Life", ar: "الحياة الجامعية" },
    tagline: { en: "Work the system you are actually inside", ar: "افهم النظام الذي تعيش داخله" },
    icon: "⌂",
    units: [
      {
        id: "student-u1",
        title: { en: "The UK student system", ar: "نظام الطالب في بريطانيا" },
        lessons: [
          { id: "student-loan", title: { en: "Which loan plan are you on?", ar: "على أي خطة قرض أنت؟" }, objective: { en: "Identify your plan and what it means for repayments.", ar: "حدّد خطتك وما تعنيه للسداد." }, minutes: 6, xp: 100, relevance: { en: "Plan 5 changed the maths for everyone starting from 2023.", ar: "خطة 5 غيّرت الحساب لكل من بدأ من 2023." }, steps: [], sources: [SOURCES.mseStudents, SOURCES.govStudentFinance] },
          { id: "student-repay", title: { en: "Repayment is not a debt", ar: "السداد ليس دَيناً كالعادة" }, objective: { en: "Explain why a student loan behaves more like a graduate tax.", ar: "اشرح لماذا يشبه قرض الطالب ضريبة على الخريجين." }, minutes: 6, xp: 100, relevance: { en: "Overpaying can be the wrong move, unusual for debt.", ar: "السداد المبكر قد يكون خطأً, وهذا غريب في باب الديون." }, steps: [], sources: [SOURCES.mseStudents] },
          { id: "student-maintenance", title: { en: "Where your maintenance loan goes", ar: "إلى أين تذهب دفعة المعيشة" }, objective: { en: "Plan a term around a three-payment income.", ar: "خطّط فصلاً كاملاً بميزانية ثلاث دفعات." }, minutes: 6, xp: 100, relevance: { en: "Deficit weeks are predictable and therefore avoidable.", ar: "أسابيع العجز متوقّعة وبالتالي يمكن تجنّبها." }, steps: [], sources: [SOURCES.mseStudents] },
          { id: "student-work", title: { en: "Work, tax, and your payslip", ar: "العمل والضريبة وقسيمة الراتب" }, objective: { en: "Read a payslip and check you were paid correctly.", ar: "اقرأ قسيمة راتبك وتحقّق من صحة أجرك." }, minutes: 7, xp: 110, relevance: { en: "Wrong tax codes are common for term-time workers.", ar: "رموز الضريبة الخاطئة شائعة للعاملين خلال الدراسة." }, steps: [], sources: [SOURCES.moneyHelper] },
          { id: "student-rent", title: { en: "Rent, deposits, and deposits", ar: "الإيجار والودائع" }, objective: { en: "Know what a landlord can and cannot withhold.", ar: "اعرف ما يحق للمالك حجبه وما لا يحق." }, minutes: 7, xp: 110, relevance: { en: "Deposit protection is a legal requirement most students never verify.", ar: "حماية الوديعة إلزام قانوني لا يتحقّق منه معظم الطلاب." }, steps: [], sources: [SOURCES.moneyHelper] },
          { id: "student-overdraft", title: { en: "The 0% overdraft trap", ar: "فخ السحب على المكشوف بلا فائدة" }, objective: { en: "Use an overdraft without letting it become your income.", ar: "استخدم السحب على المكشوف دون أن يصبح دخلك." }, minutes: 6, xp: 100, relevance: { en: "It is interest-free until it suddenly is not.", ar: "يبقى بلا فائدة حتى يتوقّف عن ذلك فجأة." }, steps: [], sources: [SOURCES.mseStudents] },
        ],
      },
    ],
  },
  {
    id: "build",
    title: { en: "Building Wealth", ar: "بناء الثروة" },
    tagline: { en: "Turn a surplus into something that compounds", ar: "حوّل الفائض إلى شيء ينمو" },
    icon: "▲",
    units: [
      {
        id: "build-u1",
        title: { en: "From buffer to compounding", ar: "من الاحتياط إلى النمو التراكمي" },
        lessons: [
          { id: "building-buffer", title: { en: "Your first £500", ar: "أول 500 جنيه" }, objective: { en: "Build an emergency buffer before investing anything.", ar: "ابنِ احتياطياً للطوارئ قبل أي استثمار." }, minutes: 5, xp: 90, relevance: { en: "Without a buffer, one emergency becomes debt.", ar: "بلا احتياطي، تتحوّل أي طارئة إلى دَين." }, steps: [], sources: [SOURCES.moneyHelper] },
          { id: "building-compound", title: { en: "Compounding, honestly", ar: "النمو التراكمي بلا مبالغة" }, objective: { en: "Calculate growth without being sold a fantasy.", ar: "احسب النمو دون أن تُباع لك أوهام." }, minutes: 7, xp: 120, relevance: { en: "Time in the market matters more than the amount at your age.", ar: "طول المدة في السوق أهم من المبلغ في عمرك." }, steps: [], sources: [SOURCES.moneyHelper] },
          { id: "building-isa", title: { en: "ISA versus pension", ar: "الحساب المعفى مقابل التقاعد" }, objective: { en: "Choose the right wrapper for money you will not touch.", ar: "اختر الوعاء المناسب للمال الذي لن تلمسه." }, minutes: 7, xp: 110, relevance: { en: "Tax wrappers are dull and worth real money.", ar: "أوعية الضرائب مملّة لكنها تساوي مالاً حقيقياً." }, steps: [], sources: [SOURCES.moneyHelper] },
          { id: "building-risk", title: { en: "Risk is not a feeling", ar: "الخطر ليس شعوراً" }, objective: { en: "Separate volatility from permanent loss.", ar: "افرق بين التقلّب والخسارة الدائمة." }, minutes: 7, xp: 120, relevance: { en: "The difference decides whether you sell at the bottom.", ar: "هذا الفرق يحدّد إن كنت ستبيع في القاع." }, steps: [], sources: [SOURCES.moneyHelper] },
          { id: "building-diversify", title: { en: "Diversification in one screen", ar: "التنويع في شاشة واحدة" }, objective: { en: "Explain why one stock is not an investment plan.", ar: "اشرح لماذا سهم واحد ليس خطة استثمار." }, minutes: 6, xp: 110, relevance: { en: "Concentration is how students lose money fastest.", ar: "التركيز هو أسرع طريق لخسارة الطلاب أموالهم." }, steps: [], sources: [SOURCES.moneyHelper] },
          { id: "building-hype", title: { en: "Crypto, tips, and hype cycles", ar: "العملات والنصائح ودورات الضجيج" }, objective: { en: "Test a tip before your money does.", ar: "اختبر أي نصيحة قبل أن يختبرها مالك." }, minutes: 7, xp: 130, relevance: { en: "FOMO peaks precisely when you can least afford it.", ar: "الخوف من فوات الفرصة يبلغ ذروته حين لا تحتمل الخسارة." }, steps: [], sources: [SOURCES.moneyHelper] },
        ],
      },
    ],
  },
  {
    id: "islamic",
    title: { en: "Islamic Finance", ar: "التمويل الإسلامي" },
    tagline: { en: "Practical halal money, not a rulings revision class", ar: "مال حلال عملي، لا مراجعة أحكام" },
    icon: "◇",
    optional: true,
    audience: {
      en: "Optional branch. Assumes you know why riba is prohibited, this is about applying it to real UK products.",
      ar: "مسار اختياري. يفترض أنك تعرف حكم الربا, التركيز هنا على تطبيقه على المنتجات الواقعية.",
    },
    units: [
      {
        id: "islamic-u1",
        title: { en: "Applying it, not reciting it", ar: "التطبيق لا الترديد" },
        lessons: [
          { id: "islamic-mortgage", title: { en: "Reading an Islamic mortgage", ar: "قراءة رهن إسلامي" }, objective: { en: "Compare a halal mortgage with a conventional one and know what to ask.", ar: "قارن رهناً إسلامياً بآخر تقليدي واعرف ما تسأل عنه." }, minutes: 8, xp: 140, relevance: { en: "Most students will meet this before any other Islamic finance product.", ar: "معظم الطلاب سيواجهون هذا قبل أي منتج تمويل إسلامي آخر." }, steps: [], sources: [SOURCES.ifg] },
          { id: "islamic-screening", title: { en: "Screening a stock properly", ar: "فحص سهم بعناية" }, objective: { en: "Apply the two financial screens and spot the awkward cases.", ar: "طبّق الفحصين الماليين وحدّد الحالات الملتبسة." }, minutes: 8, xp: 140, relevance: { en: "Screening is a calculation, not a feeling about the company.", ar: "الفحص حساب، لا شعور تجاه الشركة." }, steps: [], sources: [SOURCES.ifg] },
          { id: "islamic-zakat", title: { en: "Zakat on a student's assets", ar: "الزكاة على أموال الطالب" }, objective: { en: "Work out whether you owe Zakat at all, and on what.", ar: "حدّد إن كانت الزكاة تجب عليك، وعلى أي مال." }, minutes: 7, xp: 130, relevance: { en: "Students usually owe nothing, knowing that beats guessing.", ar: "الطلاب غالباً لا يجب عليهم شيء, والعلم بذلك أفضل من الظن." }, steps: [], sources: [SOURCES.ifg] },
          { id: "islamic-savings", title: { en: "Interest-free saving that still grows", ar: "ادخار بلا فائدة وينمو رغم ذلك" }, objective: { en: "Place spare cash without relying on interest.", ar: "وظّف مالك الفائض دون الاعتماد على الفائدة." }, minutes: 8, xp: 140, relevance: { en: "Keeping everything in cash loses to inflation.", ar: "إبقاء كل شيء نقداً يخسر أمام التضخم." }, steps: [], sources: [SOURCES.ifg] },
          { id: "islamic-conventional", title: { en: "When your only option is conventional", ar: "حين لا يوجد بديل غير التقليدي" }, objective: { en: "Reason through genuinely constrained situations.", ar: "فكّر في الحالات المقيّدة فعلاً." }, minutes: 8, xp: 140, relevance: { en: "Real life includes employers' pensions and shared tenancies.", ar: "الواقع يشمل صناديق التقاعد ومساكن مشتركة." }, steps: [], sources: [SOURCES.ifg] },
          { id: "islamic-crypto", title: { en: "Crypto and the screening question", ar: "العملات الرقمية وسؤال الفحص" }, objective: { en: "Understand why scholars disagree and where that leaves you.", ar: "افهم سبب اختلاف العلماء وماذا يعني ذلك لك." }, minutes: 8, xp: 140, relevance: { en: "Disagreement is a fact to navigate, not a loophole.", ar: "الخلاف أمر يُتعامل معه، وليس ثغرة." }, steps: [], sources: [SOURCES.ifg] },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

export const allLessons = (): Array<{ lesson: Lesson; track: Track; unit: Unit }> =>
  tracks.flatMap((track) =>
    track.units.flatMap((unit) => unit.lessons.map((lesson) => ({ lesson, track, unit }))),
  );

export const findLesson = (lessonId: string) =>
  allLessons().find((entry) => entry.lesson.id === lessonId);

export const coreTracks = tracks.filter((track) => !track.optional);

/** Total lessons a student must complete in the core curriculum. */
export const coreLessonCount = coreTracks.reduce(
  (total, track) =>
    total + track.units.reduce((sum, unit) => sum + unit.lessons.length, 0),
  0,
);
