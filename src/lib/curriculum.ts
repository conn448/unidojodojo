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
  | { k: "fill"; prompt: L; before: L; after: L; bank: L[]; answer: string[]; why: L }
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

export type Step = StepBody & {
  phase?: Phase;
  /** When set, this step is only shown to students in these nations. */
  nations?: Nation[];
};


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
  govTax: {
    label: "Income Tax rates and Personal Allowances",
    url: "https://www.gov.uk/income-tax-rates",
    publisher: "GOV.UK",
  },
  scottishTax: {
    label: "Income Tax in Scotland, current rates and bands",
    url: "https://www.gov.uk/scottish-income-tax",
    publisher: "GOV.UK",
  },
  govNI: {
    label: "National Insurance rates and categories",
    url: "https://www.gov.uk/national-insurance-rates-letters",
    publisher: "GOV.UK",
  },
  govDeposits: {
    label: "Tenancy deposit protection",
    url: "https://www.gov.uk/tenancy-deposit-protection",
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
          {
            id: "student-loan",
            title: { en: "Which loan plan are you on?", ar: "على أي خطة قرض أنت؟" },
            objective: {
              en: "Identify your repayment plan, and know what it decides for you.",
              ar: "حدّد خطة السداد الخاصة بك، واعرف ما الذي تحدّده لك.",
            },
            minutes: 7,
            xp: 110,
            relevance: {
              en: "Your plan is not a choice and not a status symbol. It sets the income level at which you start repaying, and that level differs by thousands of pounds depending on which funding body you applied to.",
              ar: "خطتك ليست اختياراً ولا ميزة. هي تحدّد مستوى الدخل الذي تبدأ عنده السداد، وهذا المستوى يختلف بآلاف الجنيهات حسب جهة التمويل التي تقدّمت إليها.",
            },
            steps: [
              {
                k: "idea",
                title: { en: "Your plan is decided, not chosen", ar: "خطتك تُحدَّد ولا تُختار" },
                body: {
                  en: "Your repayment plan is set by two things only: which funding body you applied to, and the year you started. You cannot pick it, and it has nothing to do with your subject, your university or your grades.",
                  ar: "خطة السداد تُحدَّد بأمرين فقط: جهة التمويل التي تقدّمت إليها، وسنة بدايتك. لا يمكنك اختيارها، ولا علاقة لها بتخصصك أو جامعتك أو درجاتك.",
                },
                points: [
                  {
                    en: "Four separate systems run in parallel: England, Wales, Scotland and Northern Ireland. Which one you applied to decides your rules.",
                    ar: "أربعة أنظمة تعمل بالتوازي: إنجلترا وويلز واسكتلندا وأيرلندا الشمالية. الجهة التي تقدّمت إليها هي التي تحدّد قواعدك.",
                  },
                  {
                    en: "Start year matters as much as nation. The same funding body can put two students on different plans if they started a decade apart.",
                    ar: "سنة البداية لا تقل أهمية عن الدولة. الجهة نفسها قد تضع طالبين على خطتين مختلفتين إذا بدأ أحدهما قبل الآخر بعشر سنوات.",
                  },
                ],
              },
              {
                k: "example",
                title: { en: "What your plan actually decides", ar: "ما الذي تحدّده خطتك فعلاً" },
                setup: {
                  en: "Your plan sets how much you can earn before you repay a single pound. These are the current annual thresholds.",
                  ar: "خطتك تحدّد المبلغ الذي يمكنك كسبه قبل أن تسدّد جنيهاً واحداً. هذه هي الحدود السنوية الحالية.",
                },
                rows: [
                  { label: { en: "Plan 1", ar: "خطة 1" }, value: { en: "£26,900", ar: "£26,900" } },
                  { label: { en: "Plan 2", ar: "خطة 2" }, value: { en: "£29,385", ar: "£29,385" } },
                  { label: { en: "Plan 4", ar: "خطة 4" }, value: { en: "£33,795", ar: "£33,795" } },
                  { label: { en: "Plan 5", ar: "خطة 5" }, value: { en: "£25,000", ar: "£25,000" } },
                ],
                takeaway: {
                  en: "Above your threshold you repay 9% of whatever you earn over it. Plan 5 starts at £25,000 while Plan 4 starts at £33,795, so the same salary can repay in England and repay nothing in Scotland.",
                  ar: "فوق حدّك تسدّد 9% من كل ما تكسبه زيادته. خطة 5 تبدأ من £25,000 وخطة 4 تبدأ من £33,795، لذا الراتب نفسه قد يُسدَّد منه في إنجلترا ولا يُسدَّد منه شيء في اسكتلندا.",
                },
              },
              {
                k: "watchout",
                title: { en: "You can hold more than one plan", ar: "يمكن أن تحمل أكثر من خطة" },
                body: {
                  en: "If you borrowed at different times, or studied at both undergraduate and postgraduate level, you can be on more than one plan at once. Each keeps its own threshold, and your employer has to know about all of them.",
                  ar: "إذا اقترضت في أوقات مختلفة، أو درست البكالوريوس والدراسات العليا، فقد تكون على أكثر من خطة في الوقت نفسه. لكل خطة حدّها الخاص، وعلى جهة عملك معرفتها جميعاً.",
                },
              },
              {
                k: "match",
                prompt: {
                  en: "Match each funding body to the plan it puts most students on.",
                  ar: "صِل كل جهة تمويل بالخطة التي تضع عليها معظم الطلاب.",
                },
                pairs: [
                  {
                    left: { en: "Student Finance England, started 2023", ar: "تمويل الطلاب إنجلترا، بداية 2023" },
                    right: { en: "Plan 5", ar: "خطة 5" },
                  },
                  {
                    left: { en: "Student Finance Wales", ar: "تمويل الطلاب ويلز" },
                    right: { en: "Plan 2", ar: "خطة 2" },
                  },
                  {
                    left: { en: "Student Awards Agency Scotland", ar: "هيئة منح الطلاب اسكتلندا" },
                    right: { en: "Plan 4", ar: "خطة 4" },
                  },
                  {
                    left: { en: "Student Finance Northern Ireland", ar: "تمويل الطلاب أيرلندا الشمالية" },
                    right: { en: "Plan 1", ar: "خطة 1" },
                  },
                ],
              },
              {
                k: "choice",
                nations: ["england"],
                prompt: {
                  en: "You applied to Student Finance England and started your course in 2023. Which plan are you on?",
                  ar: "تقدّمت إلى تمويل الطلاب في إنجلترا وبدأت دراستك عام 2023. على أي خطة أنت؟",
                },
                options: [
                  { en: "Plan 1", ar: "خطة 1" },
                  { en: "Plan 2", ar: "خطة 2" },
                  { en: "Plan 4", ar: "خطة 4" },
                  { en: "Plan 5", ar: "خطة 5" },
                ],
                answer: 3,
                why: {
                  en: "Anyone applying to Student Finance England who started on or after 1 August 2023 is on Plan 5.",
                  ar: "كل من تقدّم إلى تمويل الطلاب في إنجلترا وبدأ في 1 أغسطس 2023 أو بعده على خطة 5.",
                },
              },
              {
                k: "choice",
                nations: ["scotland"],
                prompt: {
                  en: "You applied to the Student Awards Agency Scotland. Which plan are you on?",
                  ar: "تقدّمت إلى هيئة منح الطلاب في اسكتلندا. على أي خطة أنت؟",
                },
                options: [
                  { en: "Plan 1", ar: "خطة 1" },
                  { en: "Plan 2", ar: "خطة 2" },
                  { en: "Plan 4", ar: "خطة 4" },
                  { en: "Plan 5", ar: "خطة 5" },
                ],
                answer: 2,
                why: {
                  en: "SAAS students are on Plan 4 whether they studied an undergraduate or a postgraduate course. It does not depend on your start year, which is why Scottish graduates repay from a higher income.",
                  ar: "طلاب اسكتلندا على خطة 4 سواء درسوا البكالوريوس أو الدراسات العليا. لا تعتمد على سنة البداية، ولهذا يبدأ الخريجون في اسكتلندا السداد من دخل أعلى.",
                },
              },
              {
                k: "choice",
                nations: ["wales"],
                prompt: {
                  en: "You applied to Student Finance Wales and started your course in 2023. Which plan are you on?",
                  ar: "تقدّمت إلى تمويل الطلاب في ويلز وبدأت دراستك عام 2023. على أي خطة أنت؟",
                },
                options: [
                  { en: "Plan 1", ar: "خطة 1" },
                  { en: "Plan 2", ar: "خطة 2" },
                  { en: "Plan 4", ar: "خطة 4" },
                  { en: "Plan 5", ar: "خطة 5" },
                ],
                answer: 1,
                why: {
                  en: "Wales did not move to Plan 5. If you applied to Student Finance Wales and started on or after 1 September 2012, you stay on Plan 2, so your threshold is higher than an English student who started the same year.",
                  ar: "ويلز لم تنتقل إلى خطة 5. إذا تقدّمت إلى تمويل الطلاب في ويلز وبدأت في 1 سبتمبر 2012 أو بعده، تبقى على خطة 2، وحدّك أعلى من طالب في إنجلترا بدأ في السنة نفسها.",
                },
              },
              {
                k: "choice",
                nations: ["northern-ireland"],
                prompt: {
                  en: "You applied to Student Finance Northern Ireland. Which plan are you on?",
                  ar: "تقدّمت إلى تمويل الطلاب في أيرلندا الشمالية. على أي خطة أنت؟",
                },
                options: [
                  { en: "Plan 1", ar: "خطة 1" },
                  { en: "Plan 2", ar: "خطة 2" },
                  { en: "Plan 4", ar: "خطة 4" },
                  { en: "Plan 5", ar: "خطة 5" },
                ],
                answer: 0,
                why: {
                  en: "Student Finance Northern Ireland puts students on Plan 1, whether undergraduate or postgraduate.",
                  ar: "تمويل الطلاب في أيرلندا الشمالية يضع الطلاب على خطة 1، سواء في البكالوريوس أو الدراسات العليا.",
                },
              },
              {
                k: "choice",
                prompt: {
                  en: "Which of these does not change how much you repay each month?",
                  ar: "أي من هذه لا يغيّر المبلغ الذي تسدّده شهرياً؟",
                },
                options: [
                  { en: "Your salary", ar: "راتبك" },
                  { en: "Which plan you are on", ar: "الخطة التي أنت عليها" },
                  { en: "The size of your outstanding balance", ar: "حجم الرصيد المتبقي عليك" },
                  { en: "How often you are paid", ar: "عدد مرات استلامك للراتب" },
                ],
                answer: 2,
                why: {
                  en: "Repayment is a percentage of income above your threshold. The total you owe does not enter the calculation at all, which is why a large balance is not the emergency it feels like.",
                  ar: "السداد نسبة من الدخل فوق حدّك. إجمالي ما تدين به لا يدخل في الحساب إطلاقاً، ولهذا لا يُعد الرصيد الكبير أزمة كما يبدو.",
                },
              },
              {
                k: "scenario",
                prompt: {
                  en: "Your payslip shows Plan 2 deductions, but the letter in your online account says Plan 4. What do you do?",
                  ar: "قسيمة راتبك تُظهر خصماً على خطة 2، لكن الخطاب في حسابك الإلكتروني يقول خطة 4. ماذا تفعل؟",
                },
                options: [
                  {
                    label: { en: "Leave it, the difference is small", ar: "أتركه، الفرق بسيط" },
                    outcome: {
                      en: "You keep repaying from an income that should not be repaying at all, every month, until someone notices.",
                      ar: "تستمر في السداد من دخل لا يجب أن يسدّد أصلاً، كل شهر، حتى ينتبه أحد.",
                    },
                    delta: 0,
                  },
                  {
                    label: {
                      en: "Download your active plan type letter and show your employer",
                      ar: "أنزّل خطاب نوع الخطة النشطة وأعرضه على جهة عملي",
                    },
                    outcome: {
                      en: "Your employer corrects your payroll, and you can claim a refund for what you overpaid.",
                      ar: "تصحّح جهة عملك كشف الرواتب، ويمكنك المطالبة باسترداد ما دفعته بالزيادة.",
                    },
                    delta: 20,
                  },
                  {
                    label: { en: "Ask payroll to stop the deductions", ar: "أطلب من قسم الرواتب إيقاف الخصم" },
                    outcome: {
                      en: "They cannot. Repayments come out of payroll automatically, so the fix is correcting the plan, not cancelling it.",
                      ar: "لا يمكنهم ذلك. الخصم يخرج من الرواتب تلقائياً، والحل هو تصحيح الخطة لا إلغاؤها.",
                    },
                    delta: 0,
                  },
                ],
              },
            ],
            sources: [SOURCES.govStudentFinance, SOURCES.saasScotland, SOURCES.mseStudents],
          },
          {
            id: "student-repay",
            title: { en: "Repayment is not a debt", ar: "السداد ليس دَيناً كالعادة" },
            objective: {
              en: "Explain why repayment follows your income rather than your balance, and know when the balance disappears.",
              ar: "اشرح لماذا يتبع السداد دخلك لا رصيدك، واعرف متى يسقط الرصيد.",
            },
            minutes: 7,
            xp: 110,
            relevance: {
              en: "Every other debt you will meet demands a fixed instalment and punishes a missed payment. This one does not. That difference is why paying it off early is often the wrong move, which is the opposite of what instinct says.",
              ar: "كل دَين آخر ستقابله يطلب قسطاً ثابتاً ويعاقب على التأخر في السداد. هذا القرض لا يفعل ذلك. هذا الفرق هو سبب أن السداد المبكر غالباً خطأ، وهو عكس ما يمليه الحدس.",
            },
            steps: [
              {
                k: "idea",
                title: { en: "A debt that does not behave like one", ar: "دَين لا يتصرّف كالدَّين" },
                body: {
                  en: "Legally your student loan is a debt. In behaviour it is closer to a tax on income, and that difference is not a technicality. It changes what you should do with spare money.",
                  ar: "قرض الطالب قانونياً دَين. لكنه في سلوكه أقرب إلى ضريبة على الدخل، وهذا الفرق ليس تفصيلاً شكلياً. إنه يغيّر ما ينبغي أن تفعله بالمال الفائض.",
                },
                points: [
                  {
                    en: "Repayment is a percentage of income above a threshold, not an instalment agreed with a lender.",
                    ar: "السداد نسبة من الدخل فوق حدّ معيّن، وليس قسطاً متفقاً عليه مع مُقرِض.",
                  },
                  {
                    en: "If your income drops below your threshold, repayments simply stop. Nobody chases you and nothing is defaulted.",
                    ar: "إذا نزل دخلك تحت حدّك، يتوقّف السداد ببساطة. لا أحد يطاردك ولا يقع أي تعثّر.",
                  },
                  {
                    en: "The balance is cancelled on a set date whether or not you cleared it, which no ordinary lender would ever agree to.",
                    ar: "يُلغى الرصيد في تاريخ محدّد سواء سدّدته أم لا، وهذا ما لا توافق عليه أي جهة إقراض عادية.",
                  },
                ],
              },
              {
                k: "example",
                title: { en: "What 9% actually looks like", ar: "كيف تبدو نسبة 9% فعلاً" },
                setup: {
                  en: "On Plan 2 you repay 9% of everything you earn above £29,385 a year. Here is that rule applied at three salaries.",
                  ar: "على خطة 2 تسدّد 9% من كل ما تكسبه فوق £29,385 سنوياً. هذه هي القاعدة مطبّقة على ثلاثة رواتب.",
                },
                rows: [
                  {
                    label: { en: "Earning £30,000 a year", ar: "دخل £30,000 سنوياً" },
                    value: { en: "about £5 a month", ar: "حوالي £5 شهرياً" },
                  },
                  {
                    label: { en: "Earning £35,000 a year", ar: "دخل £35,000 سنوياً" },
                    value: { en: "about £42 a month", ar: "حوالي £42 شهرياً" },
                  },
                  {
                    label: { en: "Earning £50,000 a year", ar: "دخل £50,000 سنوياً" },
                    value: { en: "about £155 a month", ar: "حوالي £155 شهرياً" },
                  },
                ],
                takeaway: {
                  en: "Just above the threshold the payment is almost nothing. It grows with income and it is taken from your pay before you ever see it, so you never have to find the money.",
                  ar: "فوق الحد بقليل يكون المبلغ شبه معدوم. ينمو مع الدخل ويُخصم من راتبك قبل أن تراه، فلا تضطر للبحث عن المال.",
                },
              },
              {
                k: "watchout",
                title: { en: "Overpaying is often money thrown away", ar: "السداد الزائد غالباً مال مهدور" },
                body: {
                  en: "Most borrowers never clear the balance, because it is cancelled first. If that is your situation, every extra pound you pay is a pound you did not owe. Extra payments only make sense if you are confident you will repay the whole balance before the write off date.",
                  ar: "معظم المقترضين لا يسدّدون الرصيد كاملاً، لأن الرصيد يُلغى قبل ذلك. إذا كانت هذه حالتك، فكل جنيه إضافي تدفعه هو جنيه لم يكن مطلوباً منك. السداد الزائد منطقي فقط إذا كنت واثقاً من سداد الرصيد كاملاً قبل تاريخ الإلغاء.",
                },
              },
              {
                k: "fill",
                prompt: { en: "Complete the rule.", ar: "أكمل القاعدة." },
                before: { en: "If your income falls below your threshold, your repayments", ar: "إذا نزل دخلك تحت حدّك، فإن سدادك" },
                after: { en: "until your income rises again.", ar: "حتى يرتفع دخلك مرة أخرى." },
                bank: [
                  { en: "stop", ar: "يتوقّف" },
                  { en: "double", ar: "يتضاعف" },
                  { en: "transfer", ar: "يُحوَّل" },
                  { en: "continue", ar: "يستمر" },
                ],
                answer: ["stop"],
                why: {
                  en: "Repayment is taken out of income. Below the threshold there is nothing to take, so the balance simply waits, and interest is still applied while it waits.",
                  ar: "السداد يُخصم من الدخل. تحت الحد لا يوجد ما يُخصم، فينتظر الرصيد، وتُضاف الفائدة أثناء انتظاره.",
                },
              },
              {
                k: "choice",
                prompt: {
                  en: "You earn £22,000 a year and you are on Plan 2. How much do you repay?",
                  ar: "تكسب £22,000 سنوياً وأنت على خطة 2. كم تسدّد؟",
                },
                options: [
                  { en: "Nothing", ar: "لا شيء" },
                  { en: "About £15 a month", ar: "حوالي £15 شهرياً" },
                  { en: "About £55 a month", ar: "حوالي £55 شهرياً" },
                  { en: "9% of your salary", ar: "9% من راتبك" },
                ],
                answer: 0,
                why: {
                  en: "£22,000 is below the Plan 2 threshold of £29,385, so nothing is due. This is the single most misunderstood thing about student loans in the first years after graduating.",
                  ar: "£22,000 أقل من حد خطة 2 البالغ £29,385، فلا يجب عليك شيء. هذا أكثر ما يُفهم خطأً عن قروض الطلاب في السنوات الأولى بعد التخرّج.",
                },
              },
              {
                k: "match",
                prompt: {
                  en: "Match each change to what it does to your repayments.",
                  ar: "صِل كل تغيّر بما يفعله بسدادك.",
                },
                pairs: [
                  {
                    left: { en: "Your income falls below the threshold", ar: "دخلك ينزل تحت الحد" },
                    right: { en: "Repayments stop", ar: "يتوقّف السداد" },
                  },
                  {
                    left: { en: "Your outstanding balance grows", ar: "رصيدك المتبقي يزداد" },
                    right: { en: "Your monthly payment does not change", ar: "دفعتك الشهرية لا تتغيّر" },
                  },
                  {
                    left: { en: "You reach the write off date", ar: "تصل إلى تاريخ الإلغاء" },
                    right: { en: "The balance is cancelled", ar: "يُلغى الرصيد" },
                  },
                ],
              },
              {
                k: "choice",
                nations: ["england"],
                prompt: {
                  en: "You are on Plan 5. How long until the balance is written off?",
                  ar: "أنت على خطة 5. كم من الوقت حتى يُلغى الرصيد؟",
                },
                options: [
                  { en: "25 years", ar: "25 سنة" },
                  { en: "30 years", ar: "30 سنة" },
                  { en: "40 years", ar: "40 سنة" },
                  { en: "It is never written off", ar: "لا يُلغى أبداً" },
                ],
                answer: 2,
                why: {
                  en: "Plan 5 is written off 40 years after the April you were first due to repay. That is the longest of any plan, and it is why most Plan 5 borrowers treat the payment as a contribution rather than a debt to clear.",
                  ar: "تُلغى خطة 5 بعد 40 سنة من أبريل الذي كان يجب أن تبدأ السداد فيه. هذه أطول مدة بين الخطط، ولهذا يعتبر معظم المقترضين على خطة 5 الدفعة مساهمة لا دَيناً يجب إغلاقه.",
                },
              },
              {
                k: "choice",
                nations: ["scotland"],
                prompt: {
                  en: "You are on Plan 4. How long until the balance is written off?",
                  ar: "أنت على خطة 4. كم من الوقت حتى يُلغى الرصيد؟",
                },
                options: [
                  { en: "25 years", ar: "25 سنة" },
                  { en: "30 years", ar: "30 سنة" },
                  { en: "40 years", ar: "40 سنة" },
                  { en: "It is never written off", ar: "لا يُلغى أبداً" },
                ],
                answer: 1,
                why: {
                  en: "Plan 4 is written off 30 years after the April you were first due to repay, and it starts from the highest threshold of the four plans. A Scottish graduate repays less than an English one on the same salary, and for a shorter period.",
                  ar: "تُلغى خطة 4 بعد 30 سنة من أبريل الذي كان يجب أن تبدأ السداد فيه، وتبدأ من أعلى حد بين الخطط الأربع. الخريج في اسكتلندا يسدّد أقل من نظيره في إنجلترا بالراتب نفسه، ولمدة أقصر.",
                },
              },
              {
                k: "choice",
                nations: ["wales"],
                prompt: {
                  en: "You are on Plan 2. How long until the balance is written off?",
                  ar: "أنت على خطة 2. كم من الوقت حتى يُلغى الرصيد؟",
                },
                options: [
                  { en: "25 years", ar: "25 سنة" },
                  { en: "30 years", ar: "30 سنة" },
                  { en: "40 years", ar: "40 سنة" },
                  { en: "It is never written off", ar: "لا يُلغى أبداً" },
                ],
                answer: 1,
                why: {
                  en: "Plan 2 is written off 30 years after the April you were first due to repay. Wales also writes off £1,500 of the maintenance loan for full time students from Wales, on top of the standard terms.",
                  ar: "تُلغى خطة 2 بعد 30 سنة من أبريل الذي كان يجب أن تبدأ السداد فيه. وتلغي ويلز أيضاً £1,500 من قرض المعيشة للطلاب المتفرّغين من ويلز، إضافة إلى الشروط المعتادة.",
                },
              },
              {
                k: "choice",
                nations: ["northern-ireland"],
                prompt: {
                  en: "You are on Plan 1. How long until the balance is written off?",
                  ar: "أنت على خطة 1. كم من الوقت حتى يُلغى الرصيد؟",
                },
                options: [
                  { en: "25 years", ar: "25 سنة" },
                  { en: "30 years", ar: "30 سنة" },
                  { en: "40 years", ar: "40 سنة" },
                  { en: "It is never written off", ar: "لا يُلغى أبداً" },
                ],
                answer: 0,
                why: {
                  en: "Plan 1 is written off 25 years after the April you were first due to repay, the shortest period of any plan. Northern Irish graduates become free of the balance sooner than anyone else.",
                  ar: "تُلغى خطة 1 بعد 25 سنة من أبريل الذي كان يجب أن تبدأ السداد فيه، وهي أقصر مدة بين الخطط. خريجو أيرلندا الشمالية يتحرّرون من الرصيد أسرع من غيرهم.",
                },
              },
              {
                k: "scenario",
                prompt: {
                  en: "You have £3,000 saved and you are on Plan 5, expecting to earn around £28,000 for the next few years. You are thinking about paying it against the loan. What is the strongest argument against?",
                  ar: "لديك £3,000 مدّخرة وأنت على خطة 5، وتتوقّع أن تكسب حوالي £28,000 في السنوات القادمة. تفكّر في دفعها لإغلاق جزء من القرض. ما أقوى حجة ضد ذلك؟",
                },
                options: [
                  {
                    label: { en: "You should pay, clearing debt is always right", ar: "يجب أن تدفع، إغلاق الدَين صحيح دائماً" },
                    outcome: {
                      en: "On £28,000 you repay roughly £22 a month. £3,000 would take over eleven years off a loan that is cancelled in forty anyway, and you would have given up your only buffer.",
                      ar: "على £28,000 تسدّد حوالي £22 شهرياً. إن £3,000 ستوفّر أكثر من إحدى عشرة سنة من قرض يُلغى في الأربعين على أي حال، وستكون قد فقدت احتياطك الوحيد.",
                    },
                    delta: 0,
                  },
                  {
                    label: {
                      en: "It would be spent on a balance that will be cancelled before you clear it",
                      ar: "سيُصرف على رصيد سيُلغى قبل أن تسدّده",
                    },
                    outcome: {
                      en: "Correct reasoning. The buffer protects you from borrowing at real interest, and the student loan would have disappeared on its own.",
                      ar: "استدلال صحيح. الاحتياط يحميك من الاقتراض بفائدة حقيقية، وقرض الطالب كان سيسقط من تلقاء نفسه.",
                    },
                    delta: 20,
                  },
                  {
                    label: { en: "You should pay because interest is added every month", ar: "يجب أن تدفع لأن الفائدة تُضاف كل شهر" },
                    outcome: {
                      en: "Interest grows the balance, but the balance is not what you pay. It is cancelled either way, so the interest figure is mostly irrelevant to what leaves your pay.",
                      ar: "الفائدة تزيد الرصيد، لكن الرصيد ليس ما تدفعه. هو يُلغى في الحالتين، فرقم الفائدة لا أثر له تقريباً على ما يُخصم من راتبك.",
                    },
                    delta: 0,
                  },
                ],
              },
              {
                k: "idea",
                title: { en: "How to think about it", ar: "كيف تفكّر فيه" },
                body: {
                  en: "For most graduates the honest description is a contribution of 9% of income above a threshold, paid for a fixed number of years and then gone. Plan around your income, not around the balance, and you will make better decisions than someone worrying about the headline number.",
                  ar: "بالنسبة لمعظم الخريجين، الوصف الصادق هو مساهمة بنسبة 9% من الدخل فوق حدّ معيّن، تُدفع لعدد محدّد من السنوات ثم تنتهي. خطّط حسب دخلك لا حسب الرصيد، وستتخذ قرارات أفضل من شخص يقلق من الرقم الكبير.",
                },
              },
            ],
            sources: [SOURCES.govStudentFinance, SOURCES.saasScotland, SOURCES.mseStudents],
          },
          {
            id: "student-work",
            title: { en: "Work, tax, and your payslip", ar: "العمل والضريبة وقسيمة الراتب" },
            objective: {
              en: "Read a payslip properly, and know which deductions should not be there.",
              ar: "اقرأ قسيمة راتبك بوعي، واعرف أي خصم لا ينبغي أن يكون فيها.",
            },
            minutes: 8,
            xp: 120,
            relevance: {
              en: "A term time job usually pays no income tax at all, because earnings sit under the personal allowance. Payroll systems do not always know that, and a first payslip with tax on it is one of the most common things a student never questions.",
              ar: "العمل خلال الدراسة غالباً لا يخضع لضريبة الدخل أصلاً، لأن الدخل يقل عن الإعفاء الشخصي. لكن أنظمة الرواتب لا تعرف ذلك دائماً، وقسيمة أول راتب فيها ضريبة من أكثر ما لا يسأل عنه الطالب أبداً.",
            },
            steps: [
              {
                k: "idea",
                title: { en: "Two deductions, not one", ar: "خصمان لا خصم واحد" },
                body: {
                  en: "Payroll takes two separate things off your pay, and they have separate thresholds. Income Tax starts above £12,570 a year. National Insurance starts above £242 a week. Both are annual limits, so a summer of full time work can cross them even if term time never does.",
                  ar: "يُخصم من راتبك أمران منفصلان، ولكل منهما حدّه. ضريبة الدخل تبدأ فوق £12,570 سنوياً. والتأمين الوطني يبدأ فوق £242 أسبوعياً. وكلاهما حدود سنوية، لذا قد يتجاوزها عمل صيفي بدوام كامل حتى لو لم تتجاوزها أيام الدراسة.",
                },
                points: [
                  {
                    en: "The personal allowance of £12,570 applies across the whole UK, and it is what makes most student jobs tax free.",
                    ar: "الإعفاء الشخصي البالغ £12,570 يُطبَّق في كل بريطانيا، وهو ما يجعل معظم أعمال الطلاب معفاة من الضريبة.",
                  },
                  {
                    en: "National Insurance is not income tax. It can be taken even when your income tax is zero.",
                    ar: "التأمين الوطني ليس ضريبة دخل. قد يُخصم حتى عندما تكون ضريبتك صفراً.",
                  },
                ],
              },
              {
                k: "example",
                title: { en: "Where you live changes your rate", ar: "مكان إقامتك يغيّر نسبتك" },
                setup: {
                  en: "The personal allowance is the same everywhere, but the bands above it are not. Scotland has six bands, the rest of the UK has three.",
                  ar: "الإعفاء الشخصي واحد في كل مكان، لكن الشرائح فوقه ليست كذلك. في اسكتلندا ست شرائح، وفي بقية بريطانيا ثلاث.",
                },
                rows: [
                  {
                    label: { en: "Starter, Scotland only", ar: "شريحة البداية، في اسكتلندا فقط" },
                    value: { en: "19% from £12,571 to £16,537", ar: "19% من £12,571 إلى £16,537" },
                  },
                  {
                    label: { en: "Basic", ar: "الشريحة الأساسية" },
                    value: {
                      en: "20% up to £50,270 in the rest of the UK, but only to £29,526 in Scotland",
                      ar: "20% حتى £50,270 في بقية بريطانيا، لكن حتى £29,526 فقط في اسكتلندا",
                    },
                  },
                  {
                    label: { en: "Intermediate, Scotland only", ar: "الشريحة الوسطى، في اسكتلندا فقط" },
                    value: { en: "21% from £29,527 to £43,662", ar: "21% من £29,527 إلى £43,662" },
                  },
                  {
                    label: { en: "Higher", ar: "الشريحة العليا" },
                    value: {
                      en: "40% above £50,270 in the rest of the UK, but 42% above £43,663 in Scotland",
                      ar: "40% فوق £50,270 في بقية بريطانيا، لكن 42% فوق £43,663 في اسكتلندا",
                    },
                  },
                ],
                takeaway: {
                  en: "The same salary can be taxed at a different rate depending on where you live. If you move between Scotland and the rest of the UK, your tax code changes with you.",
                  ar: "قد يُفرض على الراتب نفسه معدل مختلف حسب مكان إقامتك. وإذا انتقلت بين اسكتلندا وبقية بريطانيا، يتغيّر رمزك الضريبي معك.",
                },
              },
              {
                k: "watchout",
                title: { en: "An emergency tax code is not your tax code", ar: "الرمز الضريبي الطارئ ليس رمزك" },
                body: {
                  en: "Starting a first job without handing over a P45 can put you on an emergency code, which taxes you as though you had no personal allowance. If your first payslip takes tax out of a small wage, that is usually why. Give your employer a P45 or complete the starter checklist, and claim a refund for anything overpaid.",
                  ar: "بدء أول عمل دون تسليم نموذج P45 قد يضعك على رمز طارئ يفرض عليك الضريبة كأنك بلا إعفاء شخصي. إذا خصمت أول قسيمة راتب ضريبة من أجر صغير، فهذا هو السبب عادة. سلّم جهة عملك نموذج P45 أو أكمل قائمة البداية، وطالب باسترداد ما دُفع بالزيادة.",
                },
              },
              {
                k: "choice",
                nations: ["england", "wales", "northern-ireland"],
                prompt: {
                  en: "You earn £30,000 in England. Which rate applies to the income just above £29,527?",
                  ar: "تكسب £30,000 في إنجلترا. أي معدل يُطبَّق على الدخل الذي يزيد قليلاً عن £29,527؟",
                },
                options: [
                  { en: "0%, it is inside the allowance", ar: "0%، لأنه داخل الإعفاء" },
                  { en: "20%", ar: "20%" },
                  { en: "21%", ar: "21%" },
                  { en: "40%", ar: "40%" },
                ],
                answer: 1,
                why: {
                  en: "In England, Wales and Northern Ireland the basic rate of 20% runs all the way to £50,270, so £30,000 is still inside it. The same salary in Scotland would be one band higher.",
                  ar: "في إنجلترا وويلز وأيرلندا الشمالية تمتد الشريحة الأساسية بمعدل 20% حتى £50,270، لذا يبقى £30,000 داخلها. الراتب نفسه في اسكتلندا يقع في شريحة أعلى.",
                },
              },
              {
                k: "choice",
                nations: ["scotland"],
                prompt: {
                  en: "You earn £30,000 in Scotland. Which rate applies to the income just above £29,527?",
                  ar: "تكسب £30,000 في اسكتلندا. أي معدل يُطبَّق على الدخل الذي يزيد قليلاً عن £29,527؟",
                },
                options: [
                  { en: "0%, it is inside the allowance", ar: "0%، لأنه داخل الإعفاء" },
                  { en: "20%", ar: "20%" },
                  { en: "21%", ar: "21%" },
                  { en: "42%", ar: "42%" },
                ],
                answer: 2,
                why: {
                  en: "Scotland's basic rate stops at £29,526, and the intermediate rate of 21% takes over immediately above it. Scotland also has a starter rate of 19%, which the rest of the UK does not have at all.",
                  ar: "تتوقف الشريحة الأساسية في اسكتلندا عند £29,526، وتبدأ الشريحة الوسطى بمعدل 21% فوراً فوقها. ولدى اسكتلندا أيضاً شريحة بداية بمعدل 19% لا وجود لها في بقية بريطانيا.",
                },
              },
              {
                k: "match",
                prompt: {
                  en: "Match each deduction to the point at which it starts.",
                  ar: "صِل كل خصم بالنقطة التي يبدأ منها.",
                },
                pairs: [
                  {
                    left: { en: "Income Tax", ar: "ضريبة الدخل" },
                    right: { en: "Above £12,570 a year", ar: "فوق £12,570 سنوياً" },
                  },
                  {
                    left: { en: "National Insurance", ar: "التأمين الوطني" },
                    right: { en: "Above £242 a week", ar: "فوق £242 أسبوعياً" },
                  },
                  {
                    left: { en: "Student loan repayment", ar: "سداد قرض الطالب" },
                    right: { en: "Above your plan threshold", ar: "فوق حدّ خطتك" },
                  },
                ],
              },
              {
                k: "choice",
                prompt: {
                  en: "You earn £12,000 over the year from a part time job. What should be deducted?",
                  ar: "تكسب £12,000 خلال السنة من عمل جزئي. ما الذي ينبغي خصمه؟",
                },
                options: [
                  { en: "Nothing at all", ar: "لا شيء إطلاقاً" },
                  { en: "Income Tax only", ar: "ضريبة الدخل فقط" },
                  { en: "National Insurance only", ar: "التأمين الوطني فقط" },
                  { en: "Both", ar: "كلاهما" },
                ],
                answer: 0,
                why: {
                  en: "£12,000 is under the £12,570 personal allowance and under the £242 a week National Insurance threshold, so both come out at zero. If your payslip shows otherwise, your tax code is wrong.",
                  ar: "£12,000 أقل من الإعفاء الشخصي البالغ £12,570 وأقل من حد التأمين الوطني البالغ £242 أسبوعياً، لذا يكون كلاهما صفراً. وإذا أظهرت قسيمتك غير ذلك، فرمزك الضريبي خاطئ.",
                },
              },
              {
                k: "scenario",
                prompt: {
                  en: "Your first payslip shows £180 of tax taken from a £900 monthly wage. What is the most useful thing to do?",
                  ar: "تُظهر أول قسيمة راتب خصم £180 ضريبة من أجر شهري قدره £900. ما أنفع خطوة تقوم بها؟",
                },
                options: [
                  {
                    label: { en: "Accept it, payroll knows best", ar: "أتقبّلها، قسم الرواتب أدرى" },
                    outcome: {
                      en: "You keep overpaying for the rest of the tax year. Payroll applies your tax code, it does not check whether the code suits you.",
                      ar: "تستمر في الدفع بالزيادة لبقية السنة الضريبية. قسم الرواتب يطبّق رمزك الضريبي، ولا يتحقّق من ملاءمته لك.",
                    },
                    delta: 0,
                  },
                  {
                    label: { en: "Hand over a P45 or complete the starter checklist", ar: "سلّم نموذج P45 أو أكمل قائمة البداية" },
                    outcome: {
                      en: "Your code is corrected to include the personal allowance, and the tax already taken is refundable.",
                      ar: "يُصحَّح رمزك ليشمل الإعفاء الشخصي، ويمكن استرداد الضريبة التي خُصمت بالفعل.",
                    },
                    delta: 20,
                  },
                  {
                    label: { en: "Ask for fewer hours to drop below the threshold", ar: "اطلب تقليل ساعاتك للنزول تحت الحد" },
                    outcome: {
                      en: "You reduce your income to solve a paperwork problem, and lose pay you were entitled to keep.",
                      ar: "تقلّل دخلك لحل مشكلة ورقية، وتخسر أجراً كان من حقك الاحتفاظ به.",
                    },
                    delta: 0,
                  },
                ],
              },
              {
                k: "idea",
                title: { en: "Read it once a month", ar: "اقرأها مرة كل شهر" },
                body: {
                  en: "Three numbers tell you whether a payslip is right: gross pay, total deductions and net pay. If net pay does not match the hours you worked, the tax code is the first thing to check and the payroll team is the first place to ask.",
                  ar: "ثلاثة أرقام تخبرك إن كانت القسيمة صحيحة: الأجر الإجمالي، وإجمالي الخصومات، وصافي الأجر. وإذا لم يطابق صافي الأجر ساعات عملك، فرّمز الضريبة هو أول ما تتحقّق منه، وقسم الرواتب هو أول من تسأله.",
                },
              },
            ],
            sources: [SOURCES.govTax, SOURCES.scottishTax, SOURCES.govNI, SOURCES.moneyHelper],
          },
          {
            id: "student-rent",
            title: { en: "Rent and deposits", ar: "الإيجار والودائع" },
            objective: {
              en: "Know that your deposit is protected by law, and what a landlord cannot keep it for.",
              ar: "اعرف أن وديعة إيجارك محمية قانوناً، وما لا يحق للمالك الاحتفاظ به منها.",
            },
            minutes: 8,
            xp: 120,
            relevance: {
              en: "A deposit is often the largest single payment a student makes in the whole year, and it is the one payment most students never check was lodged anywhere. The protection is automatic only if somebody confirms it happened.",
              ar: "الوديعة غالباً أكبر دفعة واحدة يقوم بها الطالب في السنة كلها، وهي الدفعة التي لا يتحقّق معظم الطلاب من إيداعها في أي مكان. الحماية لا تُطبَّق إلا إذا تأكّد أحد من وقوع الإيداع.",
            },
            steps: [
              {
                k: "idea",
                title: { en: "It is your money, held by someone else", ar: "مالك، لكن في يد غيرك" },
                body: {
                  en: "A tenancy deposit is not rent paid early and it is not the landlord's money to spend. It stays yours, and the law requires it to be held in a government approved tenancy deposit scheme. Those schemes exist to return it to you if you meet the terms of the tenancy, do not damage the property, and pay your rent and bills.",
                  ar: "وديعة الإيجار ليست إيجاراً مدفوعاً مقدماً وليست مالاً للمالك يتصرّف به. هي تبقى ملكك، ويلزم القانون بإيداعها في نظام ودائع معتمد من الحكومة. وهذه الأنظمة موجودة لإعادة المال إليك إذا التزمت بشروط العقد ولم تُتلف العقار ودفعت الإيجار والفواتير.",
                },
                points: [
                  {
                    en: "The deposit must be registered in a scheme. It is not enough for the landlord to promise to hold it separately.",
                    ar: "يجب تسجيل الوديعة في نظام معتمد. ولا يكفي أن يَعِد المالك بالاحتفاظ بها منفصلة.",
                  },
                  {
                    en: "The scheme matters more than the landlord's goodwill, because it is the scheme that decides who gets the money.",
                    ar: "النظام المعتمد أهم من حسن نية المالك، لأنه هو من يقرّر من يستلم المال.",
                  },
                ],
              },
              {
                k: "example",
                title: { en: "The timeline of a deposit", ar: "المسار الزمني للوديعة" },
                setup: {
                  en: "In England and Wales the law sets deadlines at both ends of the tenancy. Each one protects a different person.",
                  ar: "في إنجلترا وويلز يحدّد القانون مواعيد في طرفي العقد. كل موعد يحمي طرفاً مختلفاً.",
                },
                rows: [
                  {
                    label: { en: "You pay the deposit", ar: "تدفع الوديعة" },
                    value: { en: "Must be protected within 30 days", ar: "يجب إيداعها خلال 30 يوماً" },
                  },
                  {
                    label: { en: "You both agree the amount to return", ar: "تتفقان على المبلغ المسترد" },
                    value: { en: "Paid back within 10 days", ar: "تُرد خلال 10 أيام" },
                  },
                  {
                    label: { en: "You disagree about the amount", ar: "تختلفان على المبلغ" },
                    value: {
                      en: "The scheme holds the money until it is resolved",
                      ar: "يحتفظ النظام بالمال حتى تُحل المسألة",
                    },
                  },
                ],
                takeaway: {
                  en: "The deposit stays inside the scheme while a dispute runs, so a disagreement cannot be settled by one side simply keeping the money.",
                  ar: "تبقى الوديعة داخل النظام أثناء أي نزاع، لذا لا يمكن حسم الخلاف بأن يحتفظ أحد الطرفين بالمال ببساطة.",
                },
              },
              {
                k: "choice",
                nations: ["england", "wales"],
                prompt: {
                  en: "You rent in England. Where must your deposit be held?",
                  ar: "تستأجر في إنجلترا. أين يجب إيداع وديعة إيجارك؟",
                },
                options: [
                  { en: "In the landlord's own account", ar: "في حساب المالك الشخصي" },
                  { en: "In a government approved tenancy deposit scheme", ar: "في نظام ودائع معتمد من الحكومة" },
                  { en: "With your university", ar: "لدى جامعتك" },
                  { en: "Nowhere in particular", ar: "في أي مكان، لا يهم" },
                ],
                answer: 1,
                why: {
                  en: "England and Wales use three government approved schemes: the Deposit Protection Service, MyDeposits and the Tenancy Deposit Scheme. Your landlord must lodge it within 30 days of receiving it.",
                  ar: "تستخدم إنجلترا وويلز ثلاثة أنظمة معتمدة: خدمة حماية الودائع، وماي ديبوزيتس، ونظام ودائع الإيجار. وعلى مالكك إيداعها خلال 30 يوماً من استلامها.",
                },
              },
              {
                k: "choice",
                nations: ["scotland"],
                prompt: {
                  en: "You rent in Scotland. Where must your deposit be held?",
                  ar: "تستأجر في اسكتلندا. أين يجب إيداع وديعة إيجارك؟",
                },
                options: [
                  { en: "In the landlord's own account", ar: "في حساب المالك الشخصي" },
                  { en: "In one of the England and Wales schemes", ar: "في أحد أنظمة إنجلترا وويلز" },
                  { en: "In a separate Scottish tenancy deposit scheme", ar: "في نظام ودائع اسكتلندي مستقل" },
                  { en: "Nowhere in particular", ar: "في أي مكان، لا يهم" },
                ],
                answer: 2,
                why: {
                  en: "Scotland runs its own tenancy deposit schemes, separately from England and Wales. A landlord who only knows the English scheme names is a warning sign that the deposit may not have been lodged.",
                  ar: "لدى اسكتلندا أنظمتها الخاصة للودائع، منفصلة عن إنجلترا وويلز. المالك الذي يعرف أسماء الأنظمة الإنجليزية فقط مؤشر على أن الوديعة قد لا تكون قد أُودعت.",
                },
              },
              {
                k: "choice",
                nations: ["northern-ireland"],
                prompt: {
                  en: "You rent in Northern Ireland. Where must your deposit be held?",
                  ar: "تستأجر في أيرلندا الشمالية. أين يجب إيداع وديعة إيجارك؟",
                },
                options: [
                  { en: "In the landlord's own account", ar: "في حساب المالك الشخصي" },
                  { en: "In one of the England and Wales schemes", ar: "في أحد أنظمة إنجلترا وويلز" },
                  { en: "In a separate Northern Ireland tenancy deposit scheme", ar: "في نظام ودائع مستقل لأيرلندا الشمالية" },
                  { en: "Nowhere in particular", ar: "في أي مكان، لا يهم" },
                ],
                answer: 2,
                why: {
                  en: "Northern Ireland has its own tenancy deposit scheme, separate from the three used in England and Wales. Ask which scheme your deposit went into and get the name in writing.",
                  ar: "لدى أيرلندا الشمالية نظام ودائع خاص بها، منفصل عن الأنظمة الثلاثة المستخدمة في إنجلترا وويلز. اسأل في أي نظام أُودعت وديعة إيجارك واحصل على الاسم كتابةً.",
                },
              },
              {
                k: "choice",
                prompt: {
                  en: "Your parents pay your deposit for you. Does it still need protecting?",
                  ar: "والداك دفعا الوديعة عنك. هل تبقى بحاجة إلى حماية؟",
                },
                options: [
                  { en: "No, because you did not pay it", ar: "لا، لأنك لم تدفعها" },
                  { en: "Yes, the same rules apply", ar: "نعم، تنطبق القواعد نفسها" },
                  { en: "Only if it is more than one month of rent", ar: "فقط إذا زادت عن إيجار شهر" },
                  { en: "Only if they sign the tenancy too", ar: "فقط إذا وقّعا العقد أيضاً" },
                ],
                answer: 1,
                why: {
                  en: "The landlord must use a scheme even when the deposit comes from someone else, including a rent deposit scheme or a parent. Who paid it does not change the protection.",
                  ar: "على المالك استخدام نظام معتمد حتى لو جاءت الوديعة من شخص آخر، بما في ذلك نظام ضمان الإيجار أو أحد الوالدين. من دفع لا يغيّر الحماية.",
                },
              },
              {
                k: "choice",
                prompt: {
                  en: "You pay £200 to hold a property before the tenancy is signed. Does that need protecting?",
                  ar: "تدفع £200 لحجز عقار قبل توقيع العقد. هل تحتاج إلى حماية؟",
                },
                options: [
                  { en: "Yes, from the moment you pay it", ar: "نعم، من لحظة دفعها" },
                  { en: "No, but it does once you become a tenant", ar: "لا، لكنها تحتاج إليها حين تصبح مستأجراً" },
                  { en: "No, and never", ar: "لا، ولا تحتاج أبداً" },
                  { en: "Only if the landlord keeps it", ar: "فقط إذا احتفظ بها المالك" },
                ],
                answer: 1,
                why: {
                  en: "A holding deposit does not have to be protected. Once you become a tenant it turns into a deposit, and from that point it must be lodged in a scheme.",
                  ar: "وديعة الحجز لا يلزم حمايتها. وعندما تصبح مستأجراً تتحوّل إلى وديعة، ومن تلك اللحظة يجب إيداعها في نظام معتمد.",
                },
              },
              {
                k: "scenario",
                prompt: {
                  en: "At the end of the year your landlord wants to keep £300 for a carpet worn thin along the walkway. What is the strongest move?",
                  ar: "في نهاية السنة يريد مالكك الاحتفاظ بـ £300 مقابل سجادة رقّت عند ممر المشي. ما أقوى خطوة؟",
                },
                options: [
                  {
                    label: { en: "Pay it, arguing will cost more than £300", ar: "ادفعها، الجدال سيكلّف أكثر من £300" },
                    outcome: {
                      en: "You fund a deduction you never tested. Disputes through the scheme are free and the money stays protected while they run.",
                      ar: "تدفع خصماً لم تختبره قط. النزاع عبر النظام مجاني ويبقى المال محمياً أثناءه.",
                    },
                    delta: 0,
                  },
                  {
                    label: { en: "Raise it through the scheme and let it decide", ar: "اعرض الأمر على النظام واتركه يقرّر" },
                    outcome: {
                      en: "Correct move. The scheme holds the money until the dispute is settled, and ordinary wear from living in a property is the classic case where a deduction gets reduced.",
                      ar: "خطوة صحيحة. يحتفظ النظام بالمال حتى يُحل النزاع، والاستهلاك الطبيعي من السكن هو الحالة الأشهر التي يُخفَّض فيها الخصم.",
                    },
                    delta: 20,
                  },
                  {
                    label: { en: "Stop paying rent until it is returned", ar: "أوقف دفع الإيجار حتى تُرد" },
                    outcome: {
                      en: "This puts you in breach and gives the landlord a much stronger position than the carpet ever did.",
                      ar: "هذا يضعك في إخلال بالعقد ويمنح المالك موقفاً أقوى بكثير من مسألة السجادة.",
                    },
                    delta: 0,
                  },
                ],
              },
              {
                k: "idea",
                title: { en: "Three things to do before you sign", ar: "ثلاث خطوات قبل التوقيع" },
                body: {
                  en: "Ask which scheme the deposit will go into. Get the scheme name and the deposit amount in writing. Photograph the whole property on the day you move in, with dates, because the condition you left it in is only ever compared against the condition you found it in.",
                  ar: "اسأل في أي نظام ستُودع الوديعة. واحصل على اسم النظام ومبلغ الوديعة كتابةً. وصوّر العقار كاملاً يوم انتقالك مع التواريخ، لأن حالة العقار عند خروجك تُقارن دائماً بحالته عند دخولك.",
                },
              },
            ],
            sources: [SOURCES.govDeposits, SOURCES.moneyHelper, SOURCES.mseStudents],
          },
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
