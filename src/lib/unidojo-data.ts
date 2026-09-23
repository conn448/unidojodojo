export type Locale = "en" | "ar";
export type LessonStep =
  | { k: "idea"; eyebrow: string; title: string; body: string }
  | { k: "choice"; eyebrow: string; title: string; options: string[]; answer: number; why: string }
  | { k: "sort"; eyebrow: string; title: string; items: string[]; why: string };
export type Track = { id:string; title:Record<Locale,string>; description:Record<Locale,string>; icon:string; lessons:{id:string;title:Record<Locale,string>;minutes:number;locked?:boolean}[] };
export const tracks: Track[]=[
{id:"money",icon:"£",title:{en:"Money Basics",ar:"أساسيات المال"},description:{en:"Budget, save and make everyday choices with confidence.",ar:"خطّط وادّخر واتخذ قراراتك اليومية بثقة."},lessons:[{id:"money-plan",title:{en:"Make a plan that works",ar:"ضع خطة تناسبك"},minutes:4},{id:"banking",title:{en:"Banking without the fog",ar:"افهم الخدمات المصرفية"},minutes:5},{id:"buffer",title:{en:"Build a useful buffer",ar:"كوّن احتياطياً مفيداً"},minutes:4,locked:true}]},
{id:"islamic",icon:"◇",title:{en:"Islamic Finance",ar:"التمويل الإسلامي"},description:{en:"Explore principles, products and questions with clear sources.",ar:"تعرّف إلى المبادئ والمنتجات والأسئلة بمصادر واضحة."},lessons:[{id:"principles",title:{en:"The core principles",ar:"المبادئ الأساسية"},minutes:5},{id:"riba",title:{en:"Understanding riba",ar:"فهم الربا"},minutes:6},{id:"home",title:{en:"Home finance choices",ar:"خيارات تمويل السكن"},minutes:7,locked:true}]},
{id:"student",icon:"⌂",title:{en:"Student Life",ar:"حياة الطالب"},description:{en:"Student finance, rent, bills and moving through university.",ar:"تمويل الطالب والإيجار والفواتير والحياة الجامعية."},lessons:[{id:"student-loan",title:{en:"Your student loan",ar:"قرضك الطلابي"},minutes:5},{id:"rent",title:{en:"Rent and shared bills",ar:"الإيجار والفواتير المشتركة"},minutes:4},{id:"work",title:{en:"Working while studying",ar:"العمل أثناء الدراسة"},minutes:5,locked:true}]}
];
export const lessonSteps: Record<Locale, LessonStep[]>={en:[
{k:"idea",eyebrow:"THE BIG IDEA",title:"Give every pound a job",body:"A budget is not a restriction. It is a plan for the money you have, based on what matters to you. When money arrives, split it before everyday spending makes the decisions for you."},
{k:"choice",eyebrow:"TRY A DECISION",title:"Your maintenance payment lands. What comes first?",options:["Set aside rent and essential bills","Book a weekend away","Upgrade your phone","Ignore it until next month"],answer:0,why:"Protecting essentials first shows what is genuinely available for everything else."},
{k:"idea",eyebrow:"MAKE IT PRACTICAL",title:"Use three simple pots",body:"Start with essentials, then future-you, then flexible spending. The percentages can change each month; the order is what protects you."},
{k:"sort",eyebrow:"MINI GAME",title:"Essential or flexible?",items:["Rent","Groceries","Takeaway","Streaming"],why:"Essentials keep daily life running. Flexible costs can usually move when plans change."},
{k:"choice",eyebrow:"REAL-LIFE CHECK",title:"Your energy bill rises by £35. What is the strongest next move?",options:["Move £35 from flexible spending","Use an overdraft immediately","Cancel every social plan","Ignore the bill"],answer:0,why:"A flexible plan absorbs changes without panic. Adjust one category before taking on debt."},
{k:"idea",eyebrow:"REMEMBER THIS",title:"A useful budget can bend",body:"Review your plan when income or costs change. A budget that needs updating is not a failed budget — it is doing its job."},
{k:"choice",eyebrow:"FINAL QUIZ",title:"Which sentence best describes a good budget?",options:["A flexible plan for your priorities","A ban on enjoyable spending","A perfect forecast","A spreadsheet you never change"],answer:0,why:"A good budget protects priorities and still leaves room for real life."}
],ar:[
{k:"idea",eyebrow:"الفكرة الأساسية",title:"اجعل لكل جنيه مهمة",body:"الميزانية ليست قيداً، بل خطة للمال المتاح لديك وفق ما يهمك. عند وصول المال، قسّمه قبل أن يقرر الإنفاق اليومي نيابة عنك."},
{k:"choice",eyebrow:"جرّب قراراً",title:"وصلت دفعة إعالة الطالب. ما الأولوية؟",options:["تخصيص الإيجار والفواتير الأساسية","حجز رحلة نهاية الأسبوع","ترقية الهاتف","تجاهلها حتى الشهر المقبل"],answer:0,why:"تخصيص الضروريات أولاً يوضّح المبلغ المتاح فعلاً لبقية اختياراتك."},
{k:"idea",eyebrow:"اجعلها عملية",title:"استخدم ثلاث خانات بسيطة",body:"ابدأ بالضروريات، ثم ادخار المستقبل، ثم الإنفاق المرن. يمكن أن تتغير النسب كل شهر، لكن الترتيب هو ما يحميك."},
{k:"sort",eyebrow:"لعبة صغيرة",title:"ضروري أم مرن؟",items:["الإيجار","البقالة","وجبة جاهزة","اشتراك بث"],why:"الضروريات تحفظ استقرار حياتك اليومية، ويمكن تعديل المصروفات المرنة عند تغيّر الخطط."},
{k:"choice",eyebrow:"موقف واقعي",title:"ارتفعت فاتورة الطاقة 35 جنيهاً. ما الخطوة الأقوى؟",options:["نقل 35 جنيهاً من الإنفاق المرن","استخدام السحب على المكشوف فوراً","إلغاء كل الخطط الاجتماعية","تجاهل الفاتورة"],answer:0,why:"الخطة المرنة تمتص التغييرات دون ذعر. عدّل فئة واحدة قبل اللجوء إلى الدين."},
{k:"idea",eyebrow:"تذكّر هذا",title:"الميزانية المفيدة مرنة",body:"راجع خطتك عند تغير الدخل أو التكاليف. الميزانية التي تحتاج إلى تحديث ليست فاشلة، بل تؤدي وظيفتها."},
{k:"choice",eyebrow:"الاختبار النهائي",title:"أي عبارة تصف الميزانية الجيدة؟",options:["خطة مرنة لأولوياتك","منع كل إنفاق ممتع","توقع مثالي","جدول لا يتغير أبداً"],answer:0,why:"الميزانية الجيدة تحمي الأولويات وتترك مساحة للحياة الواقعية."}
]};

export const dailyRunway = [
  { id:"warmup", title:{en:"Know where it goes",ar:"اعرف أين يذهب مالك"}, kind:"review", state:"done" },
  { id:"money-plan", title:{en:"Build a budget that bends",ar:"ابنِ ميزانية مرنة"}, kind:"lesson", state:"active" },
  { id:"daily-puzzle", title:{en:"The £12 shuffle",ar:"لغز الاثني عشر جنيهاً"}, kind:"puzzle", state:"available" },
  { id:"banking", title:{en:"Banking without the fog",ar:"خدمات مصرفية بلا غموض"}, kind:"lesson", state:"locked" },
  { id:"chapter-one", title:{en:"Money Basics certificate",ar:"شهادة أساسيات المال"}, kind:"certificate", state:"locked" },
] as const;

export const leaderboard = [
  { name:"Amina", score:620, avatar:"A" },
  { name:"Theo", score:590, avatar:"T" },
  { name:"Sam", score:540, avatar:"S", me:true },
  { name:"Lina", score:515, avatar:"L" },
  { name:"Omar", score:470, avatar:"O" },
];
