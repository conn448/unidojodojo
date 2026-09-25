/**
 * Pathway 2 of 4: Ethical & Sustainable Finance.
 *
 * Written to the same shape and depth as the Islamic Finance track, which is the
 * reference implementation for the Finance Around the World section: one unit,
 * four lessons, a teaching beat and then questions that make the learner use the
 * idea rather than recall it.
 *
 * Balanced on purpose. This pathway explains how the machinery works, what the
 * evidence does and does not support, and why informed people disagree. It does
 * not tell anyone what to invest in or what to believe, and it flags the
 * contested parts as contested rather than settling them.
 */
import type { Track } from "../curriculum";
import { WORLD_SOURCES } from "./sources";

export const ethicalTrack: Track = {
  id: "ethical",
  title: { en: "Ethical & Sustainable Finance", ar: "التمويل الأخلاقي والمستدام" },
  tagline: {
    en: "How environmental and social factors actually enter an investment decision",
    ar: "كيف تدخل العوامل البيئية والاجتماعية فعلاً في قرار الاستثمار",
  },
  icon: "◈",
  optional: true,
  audience: {
    en: "Optional branch. No prior knowledge assumed, and no position is taken. Useful if you will ever hold a pension, an ISA or a fund, which is most students eventually.",
    ar: "مسار اختياري. لا يفترض معرفة سابقة ولا يتبنّى موقفاً. مفيد إن كان لديك تقاعد أو حساب استثماري أو صندوق، وهو ما سيحدث لمعظم الطلاب في النهاية.",
  },
  units: [
    {
      id: "ethical-u1",
      title: { en: "Reading the label, then the contents", ar: "اقرأ الملصق ثم المحتوى" },
      lessons: [
        /* ---------------------------------------------------------------- */
        {
          id: "ethical-basics",
          title: { en: "Three things called “ethical finance”", ar: "ثلاثة أشياء تُسمّى «التمويل الأخلاقي»" },
          objective: {
            en: "Separate the three approaches that get bundled together, and know which one a fund is actually using.",
            ar: "افصل بين المقاربات الثلاث التي تُخلط معاً، واعرف أيّها يستخدمه الصندوق فعلاً.",
          },
          minutes: 8,
          xp: 140,
          relevance: {
            en: "Almost every disagreement about ethical investing is really two people describing different approaches with the same words. Getting the three apart is the difference between a useful conversation and a shouting match, and it is the first thing a fund's own documents will tell you if you know what to look for.",
            ar: "معظم الخلاف حول الاستثمار الأخلاقي هو في الحقيقة شخصان يصفان مقاربتين مختلفتين بالكلمات نفسها. والتمييز بين الثلاث هو الفرق بين حوار مفيد وتراشق، وهو أول ما تخبرك به وثائق الصندوق إن عرفت ما تبحث عنه.",
          },
          steps: [
            {
              k: "idea",
              title: { en: "One label, three different jobs", ar: "ملصق واحد، ثلاث وظائف مختلفة" },
              body: {
                en: "“Ethical finance” covers three things that are often confused. Avoiding certain industries is exclusion. Treating environmental and social factors as financial risk information is integration. Deliberately funding something to produce a measurable benefit is impact. A fund can do any one of these without doing the others.",
                ar: "«التمويل الأخلاقي» يغطي ثلاثة أمور كثيراً ما تُخلط. تجنّب قطاعات معيّنة هو الاستبعاد. ومعاملة العوامل البيئية والاجتماعية كمعلومات عن المخاطر المالية هي الدمج. وتمويل شيء بقصد إحداث نفع قابل للقياس هو الأثر. ويمكن للصندوق أن يفعل أحدها دون الآخرين.",
              },
              points: [
                {
                  en: "ESG is not a moral score. It is a set of factors some investors treat as financially material, meaning they could affect returns.",
                  ar: "معايير ESG ليست تقييماً أخلاقياً، بل مجموعة عوامل يعتبرها بعض المستثمرين جوهرية مالياً، أي قد تؤثر على العائد.",
                },
                {
                  en: "So a fund can carry an ESG label and still hold a company you dislike. What it holds is decided by its screening rules, not by its rating.",
                  ar: "لذا قد يحمل صندوق ما تصنيف ESG ويحتوي شركة لا تحبها. ما يحتويه يحدّده نظام الفرز لديه، لا تصنيفه.",
                },
                {
                  en: "Integration is the least intuitive of the three, because it can look identical to ordinary investing from the outside.",
                  ar: "الدمج هو الأقل بداهة من الثلاثة، لأنه قد يبدو من الخارج مطابقاً للاستثمار العادي.",
                },
              ],
            },
            {
              k: "example",
              title: { en: "The same £1,000, three different decisions", ar: "ألف جنيه واحدة، ثلاثة قرارات مختلفة" },
              setup: {
                en: "Imagine the same student with the same £1,000. Each approach produces a different portfolio, and answers a different question.",
                ar: "تخيّل الطالب نفسه بألف جنيه. كل مقاربة تنتج محفظة مختلفة، وتجيب على سؤال مختلف.",
              },
              rows: [
                {
                  label: { en: "Exclusion: “I will not own these”", ar: "الاستبعاد: «لن أملك هذه»" },
                  value: {
                    en: "Tobacco, gambling and weapons are removed. The question being answered is what to refuse.",
                    ar: "تُستبعد التبغ والمقامرة والأسلحة. والسؤال المُجاب عنه هو: ما الذي نرفضه.",
                  },
                },
                {
                  label: { en: "Integration: “Which risks am I paid for?”", ar: "الدمج: «ما المخاطر التي أُكافأ عليها؟»" },
                  value: {
                    en: "Nothing is banned. Companies exposed to carbon pricing, water stress or bad governance are judged riskier and weighted accordingly. The question is what the risk is worth.",
                    ar: "لا شيء محرّم. الشركات المعرّضة لتسعير الكربون أو شح المياه أو سوء الحوكمة تُعدّ أكثر خطراً وتُوزّن بناءً على ذلك. والسؤال هو: ما قيمة هذا الخطر.",
                  },
                },
                {
                  label: { en: "Impact: “What does this change?”", ar: "الأثر: «ما الذي يتغيّر؟»" },
                  value: {
                    en: "Money goes to something specific, like a bond financing a solar farm, and the benefit is meant to be measured. The question is what the money did.",
                    ar: "المال يذهب لشيء محدّد، كسند يموّل محطة شمسية، ويُفترض قياس النفع. والسؤال هو: ماذا فعل المال.",
                  },
                },
              ],
              takeaway: {
                en: "None of these is more ethical than the others. They are answers to different questions, and a fund's documents will say which one it is answering.",
                ar: "لا شيء منها أخلاقي أكثر من الآخر. إنها إجابات لأسئلة مختلفة، ووثائق الصندوق تبين أي سؤال يجيب عنه.",
              },
            },
            {
              k: "categorise",
              prompt: { en: "Which approach is each statement describing?", ar: "أي مقاربة تصفها كل عبارة؟" },
              buckets: [
                {
                  name: { en: "Exclusion", ar: "الاستبعاد" },
                  items: [
                    { en: "“No fossil fuel producers, full stop.”", ar: "«لا منتجي وقود أحفوري، بلا استثناء.»" },
                    { en: "“I do not want to profit from gambling.”", ar: "«لا أريد الربح من المقامرة.»" },
                  ],
                },
                {
                  name: { en: "Integration", ar: "الدمج" },
                  items: [
                    { en: "“Water risk makes this company a worse bet.”", ar: "«خطر المياه يجعل هذه الشركة رهاناً أسوأ.»" },
                    { en: "“Weak governance usually costs shareholders eventually.”", ar: "«ضعف الحوكمة يكلّف المساهمين في النهاية غالباً.»" },
                  ],
                },
                {
                  name: { en: "Impact", ar: "الأثر" },
                  items: [
                    { en: "“This bond builds the wind farm, and we will report the tonnes avoided.”", ar: "«هذا السند يبني المزرعة، وسننشر الأطنان التي جرى تجنّبها.»" },
                  ],
                },
              ],
            },
            {
              k: "choice",
              prompt: {
                en: "A fund advertises a high ESG score. Which statement is true?",
                ar: "صندوق يعلن عن تصنيف ESG مرتفع. أي عبارة صحيحة؟",
              },
              options: [
                {
                  en: "It cannot hold any company involved in harmful activity.",
                  ar: "لا يمكنه الاحتفاظ بأي شركة متورطة في نشاط ضار.",
                },
                {
                  en: "It rates well on the factors that provider chose to measure, which is not the same as a moral judgement.",
                  ar: "يقيَّم جيداً وفق العوامل التي اختارها مزوّد التصنيف، وهذا ليس حكماً أخلاقياً.",
                },
                {
                  en: "It is guaranteed to have excluded tobacco, gambling and weapons.",
                  ar: "من المضمون أنه استبعد التبغ والمقامرة والأسلحة.",
                },
              ],
              answer: 1,
              why: {
                en: "There is no single agreed set of ESG factors, and providers disagree with each other about the same company. A score reflects one provider's chosen metrics, not a verdict on whether the business is acceptable.",
                ar: "لا توجد مجموعة عوامل متفق عليها، والمزوّدون يختلفون حول الشركة نفسها. فالتصنيف يعكس معايير مزوّد واحد، لا حكماً على مقبولية النشاط.",
              },
            },
            {
              k: "fill",
              prompt: {
                en: "Complete the definition investors actually use.",
                ar: "أكمل التعريف الذي يستخدمه المستثمرون فعلاً.",
              },
              before: {
                en: "A factor counts as ESG when it could be",
                ar: "يُعدّ العامل من معايير ESG حين يكون",
              },
              after: {
                en: "to the financial performance of the investment, not when it is merely admirable.",
                ar: "على الأداء المالي للاستثمار، لا حين يكون مجرّد أمر محمود.",
              },
              bank: [
                { en: "material", ar: "جوهرياً" },
                { en: "popular", ar: "شائعاً" },
                { en: "expensive", ar: "مكلفاً" },
                { en: "optional", ar: "اختيارياً" },
              ],
              answer: ["material"],
              why: {
                en: "Materiality is the hinge. It is why integration can include a coal company: the question is what the exposure does to the risk and the return, not whether the company is likeable. Some frameworks have moved towards “double materiality”, which also asks what the investment does to the world, and that shift is itself contested.",
                ar: "الجوهرية هي المحور. ولهذا قد يشمل الدمج شركة فحم: السؤال هو ما يفعله التعرّض بالمخاطر والعائد، لا هل الشركة محبوبة. وقد اتجهت بعض الأطر إلى «الجوهرية المزدوجة» التي تسأل أيضاً عمّا يفعله الاستثمار بالعالم، وهذا التحوّل محل خلاف.",
              },
            },
            {
              k: "scenario",
              prompt: {
                en: "You start a graduate job and are auto-enrolled into the workplace pension. The default fund is a normal global equity fund. What is the accurate thing to say about your options?",
                ar: "بدأت عملاً بعد التخرج وتم تسجيلك تلقائياً في تقاعد العمل. الصندوق الافتراضي هو صندوق أسهم عالمي عادي. ما الصحيح قوله عن خياراتك؟",
              },
              options: [
                {
                  label: {
                    en: "“It is the default, so there is nothing to decide.”",
                    ar: "«إنه الافتراضي، فلا يوجد ما أقرّره.»",
                  },
                  outcome: {
                    en: "There is usually a choice. Most workplace schemes offer several funds, and the default is a starting point rather than a rule. Whether you exercise that choice is genuinely up to you.",
                    ar: "الخيار موجود عادة. معظم أنظمة العمل تقدّم عدة صناديق، والافتراضي نقطة بداية لا قاعدة. واستخدامك لهذا الخيار قرارك فعلاً.",
                  },
                  delta: 0,
                },
                {
                  label: {
                    en: "“There may be a sustainable or Sharia option, and it will have its own costs and its own holdings.”",
                    ar: "«قد يوجد خيار مستدام أو متوافق مع الشريعة، وله تكاليفه ومحتواه.»",
                  },
                  outcome: {
                    en: "That is the useful position. Many UK schemes do offer those funds. They usually charge a different fee and hold a narrower portfolio, and both facts matter more to your outcome than the label.",
                    ar: "هذا هو الموقف المفيد. كثير من أنظمة التقاعد البريطانية تقدّم هذه الصناديق. وهي غالباً برسوم مختلفة ومحفظة أضيق، وكلا الأمرين أهم لنتيجتك من الملصق.",
                  },
                  delta: 2,
                },
                {
                  label: {
                    en: "“Sustainability is not a real investment factor, so it is irrelevant.”",
                    ar: "«الاستدامة ليست عاملاً استثمارياً حقيقياً، فهي غير ذات صلة.»",
                  },
                  outcome: {
                    en: "Regulators and large asset managers treat climate and governance as financial risks, and the Bank of England publishes on it. You can disagree with how they do it, but “irrelevant” is not a defensible summary of the current position.",
                    ar: "الجهات التنظيمية وكبار مديري الأصول يعتبرون المناخ والحوكمة مخاطر مالية، وبنك إنجلترا ينشر حول ذلك. يمكنك الاعتراض على الطريقة، لكن «غير ذات صلة» ليست وصفاً صحيحاً للموقف الحالي.",
                  },
                  delta: 0,
                },
              ],
            },
          ],
          sources: [WORLD_SOURCES.unpri, WORLD_SOURCES.boeClimate, WORLD_SOURCES.fcaConsumers],
        },

        /* ---------------------------------------------------------------- */
        {
          id: "ethical-screening",
          title: { en: "How a fund decides what it holds", ar: "كيف يقرّر الصندوق ما يقتنيه" },
          objective: {
            en: "Tell the four screening methods apart, and predict what each one does to a portfolio.",
            ar: "افرق بين طرق الفرز الأربع، وتوقّع أثر كل منها على المحفظة.",
          },
          minutes: 9,
          xp: 150,
          relevance: {
            en: "The label on a fund is written by its marketing team. The method in its documents is written by the people who build it. Knowing the four methods lets you predict what a fund will actually hold instead of trusting the adjective on the front.",
            ar: "الملصق على الصندوق يكتبه فريق التسويق. أما المنهج في وثائقه فيكتبه من يبنيه. ومعرفة الطرق الأربع تتيح لك توقّع ما سيقتنيه الصندوق بدل الوثوق بالصفة المكتوبة على الغلاف.",
          },
          steps: [
            {
              k: "idea",
              title: { en: "Four methods, four different portfolios", ar: "أربع طرق، أربع محافظ مختلفة" },
              body: {
                en: "Negative screening removes industries. Positive screening keeps the best-scoring companies within each industry, which means the industry is still there. Norms-based screening removes companies judged to breach widely accepted standards. Engagement keeps the holding and uses voting and dialogue to try to change the company instead.",
                ar: "الفرز السلبي يستبعد قطاعات. والفرز الإيجابي يُبقي الشركات الأعلى تقييماً داخل كل قطاع، أي أن القطاع يبقى موجوداً. والفرز المعياري يستبعد الشركات التي يُرى أنها تخالف معايير متعارفاً عليها. أما الانخراط فيُبقي الحصة ويستخدم التصويت والحوار لمحاولة تغيير الشركة.",
              },
              points: [
                {
                  en: "Positive screening and exclusion give opposite answers about the same industry, and both are commonly called ethical.",
                  ar: "الفرز الإيجابي والاستبعاد يعطيان إجابتين متعاكستين عن القطاع نفسه، وكلاهما يُسمّى أخلاقياً عادة.",
                },
                {
                  en: "Engagement and divestment are a genuine strategic disagreement, not a difference in how strict someone is.",
                  ar: "الانخراط وسحب الاستثمارات خلاف استراتيجي حقيقي، وليس اختلافاً في درجة الصرامة.",
                },
              ],
            },
            {
              k: "example",
              title: { en: "One index, four results", ar: "مؤشّر واحد، أربع نتائج" },
              setup: {
                en: "A broad global index is screened four ways. The industry weights below are illustrative of the pattern, not a forecast.",
                ar: "مؤشّر عالمي واسع يُفرز بأربع طرق. أوزان القطاعات أدناه توضيحية للنمط لا تنبؤية.",
              },
              rows: [
                {
                  label: { en: "Negative screening", ar: "الفرز السلبي" },
                  value: {
                    en: "Oil and gas, tobacco and gambling leave the index. The remaining weights barely move.",
                    ar: "يخرج النفط والغاز والتبغ والمقامرة. وتبقى الأوزان الأخرى شبه ثابتة.",
                  },
                },
                {
                  label: { en: "Positive screening", ar: "الفرز الإيجابي" },
                  value: {
                    en: "The cleanest companies in every industry stay, including the best-rated oil company. Sector weights are similar to the original index.",
                    ar: "تبقى أنظف الشركات في كل قطاع، ومنها أفضل شركة نفط تقييماً. وأوزان القطاعات قريبة من المؤشّر الأصلي.",
                  },
                },
                {
                  label: { en: "Norms-based screening", ar: "الفرز المعياري" },
                  value: {
                    en: "Firms judged to breach labour, human rights or corruption standards leave regardless of industry. The list is researched case by case.",
                    ar: "تخرج الشركات التي يُرى أنها تخالف معايير العمل أو حقوق الإنسان أو مكافحة الفساد، أيّاً كان القطاع. والقائمة تُبنى بالبحث حالة بحالة.",
                  },
                },
                {
                  label: { en: "Engagement", ar: "الانخراط" },
                  value: {
                    en: "Nothing leaves. The fund votes at company meetings and publishes what it asked for and what it got.",
                    ar: "لا شيء يخرج. يصوّت الصندوق في اجتماعات الشركات وينشر ما طلبه وما حصل عليه.",
                  },
                },
              ],
              takeaway: {
                en: "A portfolio that “excludes fossil fuels” and one that “engages with fossil fuel companies” can hold almost the same companies. The method, not the adjective, tells you which you are buying.",
                ar: "قد تحتفظ محفظة «تستبعد الوقود الأحفوري» وأخرى «تنخرط مع شركات الوقود الأحفوري» بالشركات نفسها تقريباً. المنهج، لا الصفة، هو ما يخبرك بما تشتريه.",
              },
            },
            {
              k: "match",
              prompt: { en: "Match each method to what it does.", ar: "طابق كل طريقة بما تفعله." },
              pairs: [
                {
                  left: { en: "Negative screening", ar: "الفرز السلبي" },
                  right: { en: "Removes whole industries", ar: "يستبعد قطاعات كاملة" },
                },
                {
                  left: { en: "Positive screening", ar: "الفرز الإيجابي" },
                  right: { en: "Keeps the leaders in each industry", ar: "يُبقي المتصدّرين في كل قطاع" },
                },
                {
                  left: { en: "Norms-based screening", ar: "الفرز المعياري" },
                  right: { en: "Removes companies judged to breach standards", ar: "يستبعد الشركات التي يُرى أنها تخالف المعايير" },
                },
                {
                  left: { en: "Engagement", ar: "الانخراط" },
                  right: { en: "Keeps the holding and tries to change it", ar: "يُبقي الحصة ويحاول تغييرها" },
                },
              ],
            },
            {
              k: "choice",
              prompt: {
                en: "What is the main criticism of positive or “best-in-class” screening?",
                ar: "ما الانتقاد الرئيسي للفرز الإيجابي أو «الأفضل في فئته»؟",
              },
              options: [
                {
                  en: "It is illegal in the UK.",
                  ar: "غير قانوني في بريطانيا.",
                },
                {
                  en: "It still holds the industry. A best-in-class oil producer is still an oil producer, so the fund's money still supports it.",
                  ar: "يبقي القطاع. فمنتج النفط المتصدّر يبقى منتج نفط، ومال الصندوق لا يزال يدعمه.",
                },
                {
                  en: "It always produces lower returns.",
                  ar: "يؤدي دائماً إلى عوائد أقل.",
                },
              ],
              answer: 1,
              why: {
                en: "That is the standard objection, and the standard reply is that rewarding the best performers creates pressure to improve. Whether that pressure works is exactly what people disagree about. The claim that it always lowers returns is not supported: the evidence is mixed.",
                ar: "هذا هو الاعتراض المعتاد، والرد المعتاد أن مكافأة الأفضل تخلق ضغطاً للتحسين. وهل ينجح هذا الضغط هو محل الخلاف بالضبط. أما أنّه يخفض العوائد دائماً فغير مسنود: الأدلة متباينة.",
              },
            },
            {
              k: "order",
              prompt: {
                en: "Put the steps of building a screened portfolio in the order they happen.",
                ar: "رتّب خطوات بناء محفظة مفروزة كما تحدث.",
              },
              items: [
                { en: "Decide what the fund is for", ar: "تحديد الغرض من الصندوق" },
                { en: "Choose a screening method", ar: "اختيار طريقة الفرز" },
                { en: "Apply it to the investable universe", ar: "تطبيقها على النطاق القابل للاستثمار" },
                { en: "Weight and rebalance what is left", ar: "الوزن وإعادة الموازنة لما تبقّى" },
                { en: "Report holdings and outcomes to investors", ar: "إبلاغ المستثمرين بالمحتوى والنتائج" },
              ],
              why: {
                en: "The order matters because the method is chosen for a purpose. Funds that pick a screen first and a purpose second end up with a portfolio nobody can explain.",
                ar: "الترتيب مهم لأن الطريقة تُختار لغرض. أما الصناديق التي تختار الفرز أولاً والغرض ثانياً فينتهي بها الأمر بمحفظة لا يستطيع أحد تفسيرها.",
              },
            },
            {
              k: "scenario",
              prompt: {
                en: "Two funds are offered in your ISA. Fund A excludes oil, gas and mining and has a higher fee. Fund B holds everything but votes its shares and publishes engagement records. Both call themselves sustainable. Which question actually separates them?",
                ar: "يُعرض عليك صندوقان في حسابك الاستثماري. الصندوق (أ) يستبعد النفط والغاز والتعدين ورسومه أعلى. والصندوق (ب) يحتفظ بكل شيء لكنه يصوّت بأسهمه وينشر سجلات انخراطه. كلاهما يصف نفسه بالمستدام. أي سؤال يفصلهما فعلاً؟",
              },
              options: [
                {
                  label: { en: "“Which one is genuinely ethical?”", ar: "«أيّهما أخلاقي فعلاً؟»" },
                  outcome: {
                    en: "Unanswerable, and not the fund's decision to make. You would be asking the label to settle a values question for you.",
                    ar: "سؤال لا جواب له، وليس قرار الصندوق. أنت تطلب من الملصق أن يحسم سؤال قيم نيابة عنك.",
                  },
                  delta: 0,
                },
                {
                  label: {
                    en: "“Which method am I buying, and what does that method actually do?”",
                    ar: "«أي منهج أشتري، وماذا يفعل هذا المنهج فعلاً؟»",
                  },
                  outcome: {
                    en: "That is the decision. A shuts out the industry but charges for the narrower universe. B keeps the exposure and bets on influence. Both are defensible; they are bets on different mechanisms.",
                    ar: "هذا هو القرار. (أ) يغلق القطاع لكنه يتقاضى رسوماً مقابل نطاق أضيق. و(ب) يُبقي التعرّض ويراهن على التأثير. كلاهما قابل للدفاع؛ إنهما رهانان على آليتين مختلفتين.",
                  },
                  delta: 2,
                },
                {
                  label: { en: "“Which one performed better last year?”", ar: "«أيّهما حقّق أداءً أفضل العام الماضي؟»" },
                  outcome: {
                    en: "One year of returns tells you almost nothing about either method, and annual performance is the most heavily marketed and least informative number available.",
                    ar: "عائد سنة واحدة لا يخبرك بشيء تقريباً عن أي من المنهجين، والأداء السنوي أكثر الأرقام تسويقاً وأقلها إفادة.",
                  },
                  delta: 0,
                },
              ],
            },
          ],
          sources: [WORLD_SOURCES.unpri, WORLD_SOURCES.eurosif, WORLD_SOURCES.gssb],
        },

        /* ---------------------------------------------------------------- */
        {
          id: "ethical-green",
          title: { en: "Green bonds, and where the money goes", ar: "السندات الخضراء، وإلى أين يذهب المال" },
          objective: {
            en: "Explain what makes a bond green, and spot the difference between labelling the money and labelling the borrower.",
            ar: "اشرح ما يجعل السند أخضر، وميّز بين وسم المال ووسم المُصدر.",
          },
          minutes: 8,
          xp: 140,
          relevance: {
            en: "Green bonds are one of the few parts of sustainable finance with a concrete mechanism you can inspect: a defined project, a defined pot of money and an annual report on it. They are also the place where the gap between the label and the substance is easiest to see.",
            ar: "السندات الخضراء من الأجزاء القليلة في التمويل المستدام التي لها آلية ملموسة يمكن فحصها: مشروع محدّد، ومبلغ محدّد، وتقرير سنوي عنه. وهي أيضاً الموضع الذي يسهل فيه رؤية الفجوة بين الملصق والجوهر.",
          },
          steps: [
            {
              k: "idea",
              title: { en: "Green is about use of proceeds, not about the issuer", ar: "«الأخضر» يتعلق باستخدام العائد لا بالمُصدر" },
              body: {
                en: "A green bond works like any other bond: you lend money, you receive interest, you get your money back at maturity. What makes it green is a promise that the borrowed money is spent on a defined environmental project, tracked separately and reported on.",
                ar: "السند الأخضر يعمل كأي سند آخر: تُقرض مالاً، وتتلقى فائدة، ويُعاد إليك مالك عند الاستحقاق. وما يجعله أخضر هو تعهّد بأن المال المقترض يُنفق على مشروع بيئي محدّد، ويُتابع في حساب منفصل ويُقدَّم تقرير عنه.",
              },
              points: [
                {
                  en: "The company issuing it does not have to be green. A large oil company has issued green bonds to fund a wind farm.",
                  ar: "الشركة المُصدِرة لا يلزم أن تكون خضراء. شركة نفط كبيرة أصدرت سندات خضراء لتمويل مزرعة رياح.",
                },
                {
                  en: "The Green Bond Principles are voluntary. They describe good practice for labelling, and they are not law.",
                  ar: "مبادئ السندات الخضراء طوعية. وهي تصف الممارسة الجيدة للوسم، وليست قانوناً.",
                },
                {
                  en: "Because the money is ring-fenced, this is the clearest example of the impact approach: the question is what a specific pot of money did.",
                  ar: "ولأن المال معزول في حساب محدّد، فهذا أوضح مثال على مقاربة الأثر: السؤال عمّا فعله مبلغ محدّد.",
                },
              ],
            },
            {
              k: "example",
              title: { en: "Two bonds that both sound green", ar: "سندان يبدوان أخضرين" },
              setup: {
                en: "The difference between these two is the single most useful distinction in this lesson.",
                ar: "الفرق بين هذين هو أنفع تمييز في هذا الدرس.",
              },
              rows: [
                {
                  label: { en: "Green bond", ar: "سند أخضر" },
                  value: {
                    en: "Money is earmarked for a named project: a wind farm, a rail line, a building retrofit. The issuer reports what was funded and, increasingly, the impact.",
                    ar: "المال مخصّص لمشروع مسمّى: مزرعة رياح أو خط سكة أو تحديث مبنى. ويُبلّغ المُصدر عمّا مُوّل، وأكثر فأكثر عن الأثر.",
                  },
                },
                {
                  label: { en: "Sustainability-linked bond", ar: "سند مرتبط بالاستدامة" },
                  value: {
                    en: "The money is used for general purposes. Instead, the interest rate changes if the issuer hits or misses stated targets, such as a carbon reduction by a set year.",
                    ar: "المال يُستخدم لأغراض عامة. وبدلاً من ذلك يتغيّر سعر الفائدة إن حقّق المُصدر أهدافاً معلنة أو أخطأها، مثل خفض الكربون بحلول سنة محدّدة.",
                  },
                },
              ],
              takeaway: {
                en: "One labels the money, the other labels the borrower's ambition. A sustainability-linked bond can fund anything at all, which is why the targets are where the argument happens.",
                ar: "أحدهما يوسم المال، والآخر يوسم طموح المُصدر. والسند المرتبط بالاستدامة يمكن أن يموّل أي شيء، ولهذا يكون الجدل حول الأهداف.",
              },
            },
            {
              k: "choice",
              prompt: {
                en: "What distinguishes a sustainability-linked bond from a green bond?",
                ar: "ما الذي يميّز السند المرتبط بالاستدامة عن السند الأخضر؟",
              },
              options: [
                {
                  en: "It pays a higher interest rate.",
                  ar: "يدفع فائدة أعلى.",
                },
                {
                  en: "Its interest rate is tied to whether the issuer meets sustainability targets, rather than the money being earmarked for a project.",
                  ar: "سعر فائدته مرتبط بتحقيق المُصدر أهداف الاستدامة، لا بتخصيص المال لمشروع.",
                },
                {
                  en: "It is issued only by governments.",
                  ar: "تصدره الحكومات فقط.",
                },
              ],
              answer: 1,
              why: {
                en: "The mechanism moves from the project to the company's performance. That means the credibility of the bond rests on whether the target is genuinely demanding, which is precisely where critics say the design is weakest.",
                ar: "الآلية تنتقل من المشروع إلى أداء الشركة. وهذا يعني أن مصداقية السند تعتمد على مدى جدّية الهدف، وهو بالضبط ما يقول النقاد إن التصميم أضعف فيه.",
              },
            },
            {
              k: "fill",
              prompt: {
                en: "Complete the sentence about how these are governed.",
                ar: "أكمل الجملة عن كيفية تنظيمها.",
              },
              before: {
                en: "The Green Bond Principles are",
                ar: "مبادئ السندات الخضراء",
              },
              after: {
                en: ", so an issuer can label a bond without them and no regulator will object.",
                ar: "، لذا يمكن لمُصدر وسم سند دونها ولا يعترض أي منظّم.",
              },
              bank: [
                { en: "voluntary guidelines", ar: "إرشادات طوعية" },
                { en: "UK legislation", ar: "تشريع بريطاني" },
                { en: "a tax", ar: "ضريبة" },
                { en: "a guarantee", ar: "ضمان" },
              ],
              answer: ["voluntary guidelines"],
              why: {
                en: "That is the source of both the framework's reach and its weakness. Because it is voluntary and widely adopted, a lot of bonds carry a green label. Because it is voluntary, the label tells you the issuer followed a process, not that the project is sound.",
                ar: "هذا مصدر قوة الإطار وضعفه معاً. لأنه طوعي ومنتشر على نطاق واسع، تحمل سندات كثيرة وسم «أخضر». ولأنه طوعي، فالوسم يخبرك أن المُصدر اتبع إجراءً، لا أن المشروع سليم.",
              },
            },
            {
              k: "match",
              prompt: { en: "Match each term to what it tells you.", ar: "طابق كل مصطلح بما يخبرك به." },
              pairs: [
                {
                  left: { en: "Use of proceeds", ar: "استخدام العائد" },
                  right: { en: "What the borrowed money is spent on", ar: "ما يُنفق عليه المال المقترض" },
                },
                {
                  left: { en: "Green Bond Principles", ar: "مبادئ السندات الخضراء" },
                  right: { en: "Voluntary labelling good practice", ar: "ممارسة جيدة طوعية للوسم" },
                },
                {
                  left: { en: "Coupon step-up", ar: "رفع قسيمة الفائدة" },
                  right: { en: "Interest rises if a target is missed", ar: "ترتفع الفائدة إذا فشل الهدف" },
                },
                {
                  left: { en: "Allocation reporting", ar: "تقرير التخصيص" },
                  right: { en: "The annual account of where the money went", ar: "البيان السنوي لأين ذهب المال" },
                },
              ],
            },
            {
              k: "scenario",
              prompt: {
                en: "A bond is advertised as green. You read the allocation report and most of the money went to refinancing an existing project rather than a new one. Is that misconduct?",
                ar: "يُعلن عن سند أنه أخضر. قرأت تقرير التخصيص فوجدت أن معظم المال ذهب لإعادة تمويل مشروع قائم لا لمشروع جديد. هل هذا سوء سلوك؟",
              },
              options: [
                {
                  label: { en: "Yes, refinancing is never allowed.", ar: "نعم، إعادة التمويل غير مسموحة أبداً." },
                  outcome: {
                    en: "Refinancing is permitted and common. Ruling it out entirely would be wrong, and most green bond frameworks allow it.",
                    ar: "إعادة التمويل مسموحة وشائعة. واستبعادها تماماً غير صحيح، ومعظم أطر السندات الخضراء تجيزها.",
                  },
                  delta: 0,
                },
                {
                  label: {
                    en: "No, but it changes what the bond achieved, because refinancing frees up money rather than adding any.",
                    ar: "لا، لكنه يغيّر ما حققه السند، لأن إعادة التمويل تحرّر مالاً بدل أن تضيف مالاً.",
                  },
                  outcome: {
                    en: "That is the substantive point. Refinancing an existing asset can still be useful, by lowering the cost of capital for that asset, but the additionality is weaker than funding something that would not otherwise exist. A careful report says which it is.",
                    ar: "هذه هي النقطة الجوهرية. إعادة تمويل أصل قائم قد تظل مفيدة بخفض كلفة رأس المال عليه، لكن «الإضافة» أضعف من تمويل شيء لم يكن ليوجد لولاه. والتقرير الدقيق يوضّح أيّهما.",
                  },
                  delta: 2,
                },
                {
                  label: { en: "Yes, because the labels are legally binding.", ar: "نعم، لأن الملصقات ملزمة قانوناً." },
                  outcome: {
                    en: "The Principles are voluntary, so this is not a legal test. Separately, the UK has been introducing rules on sustainability claims in fund marketing, which is a different mechanism aimed at a different problem.",
                    ar: "المبادئ طوعية، فالمسألة ليست قانونية. ومنفصلاً عن ذلك، أدخلت بريطانيا قواعد على الادعاءات المتعلقة بالاستدامة في تسويق الصناديق، وهي آلية مختلفة لمعالجة مشكلة مختلفة.",
                  },
                  delta: 0,
                },
              ],
            },
          ],
          sources: [WORLD_SOURCES.icma, WORLD_SOURCES.unepfi, WORLD_SOURCES.boeClimate],
        },

        /* ---------------------------------------------------------------- */
        {
          id: "ethical-limits",
          title: { en: "Greenwashing and the honest trade-offs", ar: "التضليل البيئي والمفاضلات الصادقة" },
          objective: {
            en: "Recognise the documented weaknesses of ethical investing, and ask the questions that get past a label.",
            ar: "تعرّف على مواطن الضعف الموثّقة في الاستثمار الأخلاقي، واطرح الأسئلة التي تتجاوز الملصق.",
          },
          minutes: 9,
          xp: 160,
          relevance: {
            en: "The most useful thing a university student can take from this pathway is not a conclusion but a set of questions. Sustainability claims are now regulated, contested and heavily marketed all at once, and the ability to tell those three apart will outlast whatever the current terminology is.",
            ar: "أنفع ما يخرج به الطالب الجامعي من هذا المسار ليس نتيجة بل مجموعة أسئلة. فالادعاءات المتعلقة بالاستدامة منظّمة ومتنازع عليها ومسوَّقة بكثافة في الوقت نفسه، والقدرة على التمييز بين الثلاث ستبقى بعد أن يتغيّر المصطلح الرائج.",
          },
          steps: [
            {
              k: "idea",
              title: { en: "Where the gap opens", ar: "من أين تنشأ الفجوة" },
              body: {
                en: "Greenwashing is a claim that overstates what an investment does. It does not have to be a lie. It can be true that a fund excludes tobacco and misleading to imply that makes it sustainable, and both statements can sit next to each other on the same page.",
                ar: "التضليل البيئي ادعاء يبالغ في وصف ما يفعله الاستثمار. ولا يلزم أن يكون كذباً. فقد يصح أن الصندوق يستبعد التبغ، ويضلّ حين يوحي بأن ذلك يجعله مستداماً، وقد تقع العبارتان جنباً إلى جنب على الصفحة نفسها.",
              },
              points: [
                {
                  en: "There is no single agreed definition of “sustainable” or “ESG”, so a label can be technically defensible and practically meaningless.",
                  ar: "لا يوجد تعريف واحد متفق عليه لـ«المستدام» أو «ESG»، لذا قد يكون الملصق سليماً تقنياً وعديم الجدوى عملياً.",
                },
                {
                  en: "Different rating agencies score the same company differently, sometimes by a lot. That is a measurement problem, not a disagreement about ethics.",
                  ar: "وكالات التقييم المختلفة تمنح الشركة نفسها درجات مختلفة، وأحياناً بفارق كبير. وهذه مشكلة قياس لا خلاف أخلاقي.",
                },
                {
                  en: "Regulators have responded, which is itself the clearest sign the problem was real.",
                  ar: "وقد استجابت الجهات التنظيمية، وهذا بذاته أوضح دليل على أن المشكلة كانت حقيقية.",
                },
              ],
            },
            {
              k: "watchout",
              title: { en: "“Sustainable” is a regulated claim in the UK, not a guarantee", ar: "«مستدام» ادعاء منظّم في بريطانيا، وليس ضماناً" },
              body: {
                en: "UK rules now constrain how sustainability claims can be made in fund marketing, and funds using sustainability labels must meet conditions and disclose more. That raises the floor. It does not tell you whether the fund suits you, and it does not make the underlying investments low-risk. A sustainable fund holds shares, and shares fall.",
                ar: "القواعد البريطانية تحدّ الآن من كيفية تقديم الادعاءات المتعلقة بالاستدامة في تسويق الصناديق، وعلى الصناديق التي تستخدم ملصقات الاستدامة استيفاء شروط والإفصاح أكثر. وهذا يرفع الحد الأدنى. لكنه لا يخبرك إن كان الصندوق مناسباً لك، ولا يجعل الاستثمارات الأساسية منخفضة المخاطر. فالصندوق المستدام يحمل أسهماً، والأسهم تهبط.",
              },
            },
            {
              k: "choice",
              prompt: {
                en: "Which of these is a documented limitation of ESG ratings?",
                ar: "أي من هذه قيد موثّق على تصنيفات ESG؟",
              },
              options: [
                {
                  en: "They are calculated too slowly to be useful.",
                  ar: "تُحتسب ببطء شديد فلا تنفع.",
                },
                {
                  en: "Different providers rate the same company differently, so the score depends on who you ask.",
                  ar: "مزوّدون مختلفون يقيّمون الشركة نفسها بشكل مختلف، فالتصنيف يعتمد على من تسأل.",
                },
                {
                  en: "They are only available to institutional investors.",
                  ar: "متاحة للمستثمرين المؤسسيين فقط.",
                },
              ],
              answer: 1,
              why: {
                en: "Providers use different metrics, different weightings and different definitions of materiality, and the published research consistently finds low correlation between them. That does not make ratings useless, but it does mean a single score is one opinion rather than a fact.",
                ar: "المزوّدون يستخدمون مقاييس وأوزاناً وتعريفات مختلفة للجوهرية، والبحوث المنشورة تجد ارتباطاً منخفضاً بينها باستمرار. وهذا لا يجعل التصنيفات بلا قيمة، لكنه يعني أن الدرجة الواحدة رأي لا حقيقة.",
              },
            },
            {
              k: "categorise",
              prompt: {
                en: "Sort each statement into what it describes.",
                ar: "صنّف كل عبارة بحسب ما تصفه.",
              },
              buckets: [
                {
                  name: { en: "A weakness of the field", ar: "ضعف في المجال" },
                  items: [
                    { en: "Two agencies disagree about the same company.", ar: "وكالتان تختلفان حول الشركة نفسها." },
                    { en: "A fund is 90% identical to a normal index fund.", ar: "صندوق مطابق بنسبة ٩٠٪ لصندوق مؤشّر عادي." },
                    { en: "The costs are higher than the standard version.", ar: "التكاليف أعلى من النسخة القياسية." },
                  ],
                },
                {
                  name: { en: "A reasonable objective", ar: "هدف معقول" },
                  items: [
                    { en: "Getting the same exposure at a lower fee.", ar: "الحصول على التعرّض نفسه برسوم أقل." },
                    { en: "Knowing what the fund actually holds.", ar: "معرفة ما يحمله الصندوق فعلاً." },
                  ],
                },
              ],
            },
            {
              k: "fill",
              prompt: {
                en: "Complete the standard trade-off argument.",
                ar: "أكمل حجّة المفاضلة المعتادة.",
              },
              before: {
                en: "A fund that excludes more industries holds a",
                ar: "الصندوق الذي يستبعد قطاعات أكثر يحمل محفظة",
              },
              after: {
                en: "portfolio, which can mean higher costs and a different return profile, for better or worse.",
                ar: "أضيق، وهذا قد يعني تكاليف أعلى ومسار عائد مختلفاً، للخير أو للشر.",
              },
              bank: [
                { en: "narrower and less diversified", ar: "أضيق وأقل تنويعاً" },
                { en: "guaranteed", ar: "مضمونة" },
                { en: "tax-free", ar: "معفاة من الضريبة" },
              ],
              answer: ["narrower and less diversified"],
              why: {
                en: "Narrowing the universe is a real cost, because diversification is one of the few protections an individual investor actually gets for free. Whether that trade is worth it is a judgement about what your money is for, and reasonable people land differently.",
                ar: "تضييق النطاق كلفة حقيقية، لأن التنويع من الحمايات القليلة التي يحصل عليها المستثمر الفرد مجاناً. وهل تستحق هذه المفاضلة ذلك حكم يتعلق بغرض مالك، والعقلاء يختلفون فيه.",
              },
            },
            {
              k: "scenario",
              prompt: {
                en: "A friend says: “I put my savings in the sustainable fund because it is the ethical one.” What is the most useful thing you can say?",
                ar: "يقول صديق: «وضعت مدخراتي في الصندوق المستدام لأنه الأخلاقي.» ما أنفع ما تقوله له؟",
              },
              options: [
                {
                  label: { en: "“You are right, that one is the ethical one.”", ar: "«معك حق، ذاك هو الأخلاقي.»" },
                  outcome: {
                    en: "This settles a values question on their behalf and skips the part that matters. It also assumes the label maps onto their priorities, which it may not.",
                    ar: "هذا يحسم سؤال قيم نيابة عنه ويتجاوز الجزء المهم. كما يفترض أن الملصق يوافق أولوياته، وقد لا يوافق.",
                  },
                  delta: 0,
                },
                {
                  label: {
                    en: "“Worth checking what it holds and what it costs, then deciding if it matches what you care about.”",
                    ar: "«يستحق أن تتحقق مما يحمله وما يكلّف، ثم تقرّر إن كان يوافق ما يهمّك.»",
                  },
                  outcome: {
                    en: "This is the version that leaves the decision with the person whose money it is, and gives them the two facts that most often change the answer: holdings and fees.",
                    ar: "هذه هي الصيغة التي تترك القرار لصاحب المال، وتمنحه الحقيقتين الأكثر تغييراً للجواب: المحتوى والرسوم.",
                  },
                  delta: 2,
                },
                {
                  label: { en: "“Ethical investing does not work, the returns are worse.”", ar: "«الاستثمار الأخلاقي لا ينفع، عوائده أسوأ.»" },
                  outcome: {
                    en: "Not supported. The evidence on relative performance is mixed and depends heavily on period, method and fees. Stating it as settled makes you less credible, not more.",
                    ar: "غير مسنود. الأدلة على الأداء النسبي متباينة وتعتمد كثيراً على الفترة والمنهج والرسوم. وإطلاقها كحقيقة يقلّل مصداقيتك لا يزيدها.",
                  },
                  delta: 0,
                },
              ],
            },
          ],
          sources: [WORLD_SOURCES.fcaConsumers, WORLD_SOURCES.fsb, WORLD_SOURCES.eurosif, WORLD_SOURCES.unpri],
        },
      ],
    },
  ],
};
