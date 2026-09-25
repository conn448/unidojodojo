/**
 * Pathway 4 of 4: Community & Cooperative Finance.
 *
 * Same shape and depth as the Islamic Finance track, which is the reference
 * implementation for this section. The subject is genuinely contested — some
 * people think member ownership is the better model and some think it is
 * structurally limited — so the lessons explain the mechanics, name the
 * trade-offs on both sides, and let the reader decide.
 */
import type { Track } from "../curriculum";
import { WORLD_SOURCES } from "./sources";

export const communityTrack: Track = {
  id: "community",
  title: { en: "Community & Cooperative Finance", ar: "التمويل المجتمعي والتعاوني" },
  tagline: {
    en: "What changes when the customers own the institution",
    ar: "ما الذي يتغيّر حين يملك العملاء المؤسسة",
  },
  icon: "◎",
  optional: true,
  audience: {
    en: "Optional branch. Useful if you want to know what a building society or credit union actually is, and why some financial institutions have no shareholders.",
    ar: "مسار اختياري. مفيد لمعرفة ما هي جمعية البناء أو الاتحاد الائتماني فعلاً، ولماذا لا يوجد لبعض المؤسسات المالية مساهمون.",
  },
  units: [
    {
      id: "community-u1",
      title: { en: "Owned by the members", ar: "مملوكة للأعضاء" },
      lessons: [
        /* ---------------------------------------------------------------- */
        {
          id: "community-credit-unions",
          title: { en: "Credit unions: banks owned by their members", ar: "الاتحادات الائتمانية: بنوك يملكها أعضاؤها" },
          objective: {
            en: "Explain who owns a credit union, who can join one, and where it differs from a bank.",
            ar: "اشرح من يملك الاتحاد الائتماني، ومن يمكنه الانضمام، وأين يختلف عن البنك.",
          },
          minutes: 8,
          xp: 140,
          relevance: {
            en: "Credit unions are one of the few financial institutions a student can join that are not trying to sell to an outside shareholder, and their rates are frequently better than a bank's for exactly that reason. They are also smaller, which has real consequences.",
            ar: "الاتحادات الائتمانية من المؤسسات المالية القليلة التي يستطيع الطالب الانضمام إليها دون أن تعمل لصالح مساهم خارجي، وأسعارها أفضل من أسعار البنوك غالباً ولهذا السبب تحديداً. لكنها أصغر حجماً، ولذلك نتائج حقيقية.",
          },
          steps: [
            {
              k: "idea",
              title: { en: "A co-operative, not a charity", ar: "تعاونية لا جمعية خيرية" },
              body: {
                en: "A credit union is a financial co-operative. The people who save with it are the owners, and they are also the people who borrow from it. There is no outside shareholder to pay, so surplus goes back to members as better savings rates or cheaper loans rather than as a dividend.",
                ar: "الاتحاد الائتماني تعاونية مالية. من يودعون فيه هم المالكون، وهم أيضاً من يقترضون منه. ولا يوجد مساهم خارجي يُدفع له، فالفائض يعود للأعضاء على شكل أسعار إيداع أفضل أو قروض أرخص لا على شكل توزيعات.",
              },
              points: [
                {
                  en: "You join, you do not just open an account. Membership usually requires a “common bond”: living in an area, working for an employer, or belonging to an association.",
                  ar: "أنت تنضم، ولا تكتفي بفتح حساب. والعضوية تشترط عادة «رابطة مشتركة»: السكن في منطقة، أو العمل عند جهة، أو الانتماء إلى جمعية.",
                },
                {
                  en: "It is not a charity. It must cover its costs and hold capital, and it can decline you or charge for a loan like any lender.",
                  ar: "وهو ليس جمعية خيرية. عليه تغطية تكاليفه وحمل رأس مال، ويمكنه رفضك أو فرض رسوم على القرض كأي مُقرِض.",
                },
                {
                  en: "Savings are protected to the same limit as a bank's, because credit unions are covered by the same compensation scheme.",
                  ar: "المدخرات محمية بالحد نفسه الذي يحمي مدخرات البنوك، لأن الاتحادات الائتمانية مشمولة بنظام التعويض نفسه.",
                },
              ],
            },
            {
              k: "example",
              title: { en: "The same £1,000 in two institutions", ar: "ألف جنيه في مؤسستين" },
              setup: {
                en: "A student saves £1,000 and later borrows £1,000. One institution is a bank owned by shareholders, the other a credit union owned by its members.",
                ar: "طالب يوفّر ١٠٠٠ جنيه ثم يقترض ١٠٠٠ جنيه. إحدى المؤسستين بنك يملكه مساهمون، والأخرى اتحاد ائتماني يملكه أعضاؤه.",
              },
              rows: [
                {
                  label: { en: "Where the profit goes (bank)", ar: "إلى أين يذهب الربح (البنك)" },
                  value: {
                    en: "After costs, to shareholders as a dividend, or retained to grow the business for shareholders.",
                    ar: "بعد التكاليف، إلى المساهمين كتوزيعات، أو يُحتجز لتنمية العمل لصالح المساهمين.",
                  },
                },
                {
                  label: { en: "Where the profit goes (credit union)", ar: "إلى أين يذهب الربح (الاتحاد)" },
                  value: {
                    en: "Back into the member services, usually as a higher rate on savings or a lower rate on borrowing. Some pay a small dividend to members.",
                    ar: "يعود إلى خدمات الأعضاء، غالباً كسعر أعلى على المدخرات أو أقل على الاقتراض. وبعضها يوزّع أرباحاً صغيرة على الأعضاء.",
                  },
                },
                {
                  label: { en: "The trade-off", ar: "المقايضة" },
                  value: {
                    en: "Branch networks, 24-hour phone lines and app budgets are smaller. What you gain in rates you may lose in convenience.",
                    ar: "شبكات الفروع وخطوط الهاتف على مدار الساعة وميزانيات التطبيقات أصغر. وما تكسبه في الأسعار قد تخسره في السهولة.",
                  },
                },
              ],
              takeaway: {
                en: "The advantage is structural, not charitable. The disadvantage is also structural, and neither is a secret.",
                ar: "الميزة بنيوية لا خيرية. والعيب بنيوي أيضاً، ولا أحد يخفيهما.",
              },
            },
            {
              k: "choice",
              prompt: {
                en: "Who owns a credit union?",
                ar: "من يملك الاتحاد الائتماني؟",
              },
              options: [
                {
                  en: "Its members",
                  ar: "أعضاؤه",
                },
                {
                  en: "The government",
                  ar: "الحكومة",
                },
                {
                  en: "Outside shareholders",
                  ar: "مساهمون خارجيون",
                },
              ],
              answer: 0,
              why: {
                en: "Membership ownership is the whole definition, and it is why the surplus is distributed differently. Everything else about a credit union follows from that one fact.",
                ar: "ملكية الأعضاء هي التعريف كله، وهي سبب اختلاف توزيع الفائض. وكل ما عدا ذلك في الاتحاد يتبع هذه الحقيقة الواحدة.",
              },
            },
            {
              k: "match",
              prompt: { en: "Match each term to what it means.", ar: "طابق كل مصطلح بمعناه." },
              pairs: [
                {
                  left: { en: "Common bond", ar: "الرابطة المشتركة" },
                  right: { en: "The shared link that makes you eligible to join", ar: "الرابط المشترك الذي يؤهلك للانضمام" },
                },
                {
                  left: { en: "Member", ar: "العضو" },
                  right: { en: "A saver who also owns the institution", ar: "مودِع يملك المؤسسة أيضاً" },
                },
                {
                  left: { en: "Surplus", ar: "الفائض" },
                  right: { en: "What is left after costs, returned to members", ar: "ما يتبقى بعد التكاليف ويُعاد للأعضاء" },
                },
                {
                  left: { en: "FSCS", ar: "نظام تعويض الودائع" },
                  right: { en: "The scheme that protects your savings if the institution fails", ar: "النظام الذي يحمي مدخراتك إن تعثّرت المؤسسة" },
                },
              ],
            },
            {
              k: "fill",
              prompt: { en: "Complete the sentence.", ar: "أكمل الجملة." },
              before: {
                en: "A credit union is owned by its members, so its main advantage over a bank is",
                ar: "الاتحاد الائتماني مملوك لأعضائه، فميزته الأساسية على البنك",
              },
              after: {
                en: "rather than anything to do with the service being free.",
                ar: "لا علاقة لها بكون الخدمة مجانية.",
              },
              bank: [
                { en: "that surplus returns to those members", ar: "أن الفائض يعود إلى هؤلاء الأعضاء" },
                { en: "that it pays no tax", ar: "أنه لا يدفع ضريبة" },
                { en: "that deposits earn nothing", ar: "أن الودائع لا تدرّ شيئاً" },
              ],
              answer: ["that surplus returns to those members"],
              why: {
                en: "Getting the reason right matters. A student who joins a credit union expecting free banking will be disappointed; one who joins expecting a better rate and less convenience will usually be right.",
                ar: "فهم السبب مهم. فالطالب الذي ينضم متوقعاً خدمات مصرفية مجانية سيُصاب بخيبة أمل، أما من ينضم متوقعاً سعراً أفضل وسهولة أقل فسيكون على حق غالباً.",
              },
            },
            {
              k: "scenario",
              prompt: {
                en: "You want a student account with an app you like, and also to know your savings are doing something other than paying a shareholder. What is the sensible arrangement?",
                ar: "تريد حساباً طلابياً بتطبيق يعجبك، وفي الوقت نفسه أن تعرف أن مدخراتك لا تعمل لصالح مساهم فقط. ما الترتيب المعقول؟",
              },
              options: [
                {
                  label: {
                    en: "“I have to pick one institution and stay with it.”",
                    ar: "«عليّ اختيار مؤسسة واحدة والبقاء معها.»",
                  },
                  outcome: {
                    en: "Nobody has to. Holding accounts in more than one place is common, and it is often how people get both the convenience they use daily and the rate they want on savings.",
                    ar: "لا يلزم أحداً ذلك. وفتح حسابات في أكثر من مكان أمر شائع، وهو غالباً السبيل للحصول على السهولة اليومية والسعر المطلوب على المدخرات.",
                  },
                  delta: 0,
                },
                {
                  label: {
                    en: "“Keep the everyday account where the app is good, and move the savings to the credit union if its rate is better.”",
                    ar: "«أُبقي حساب الاستخدام اليومي حيث التطبيق جيد، وأنقل المدخرات إلى الاتحاد إن كان سعره أفضل.»",
                  },
                  outcome: {
                    en: "That is how the two institutions actually compete with each other, and it costs you nothing but an extra account. Compare the rates on the amount you actually hold, not the headline rate.",
                    ar: "بهذه الطريقة تتنافس المؤسستان فعلاً، ولن يكلّفك الأمر إلا حساباً إضافياً. قارن الأسعار على المبلغ الذي تحمله فعلاً، لا السعر المعلن.",
                  },
                  delta: 2,
                },
                {
                  label: { en: "“Credit unions are only for people who cannot get a bank account.”", ar: "«الاتحادات الائتمانية لمن لا يستطيع فتح حساب بنكي فقط.»" },
                  outcome: {
                    en: "That was closer to true decades ago and is not true now. Many credit unions deliberately serve people the banks declined, but membership is open to anyone with the common bond, and the rates attract savers with no difficulty at all.",
                    ar: "كان ذلك أقرب للصحة قبل عقود، ولم يعد كذلك. كثير من الاتحادات تخدم عن قصد من رفضتهم البنوك، لكن العضوية متاحة لكل من تنطبق عليه الرابطة المشتركة، والأسعار تجذب مودعين لا يعانون أي صعوبة.",
                  },
                  delta: 0,
                },
              ],
            },
          ],
          sources: [WORLD_SOURCES.woccu, WORLD_SOURCES.findCreditUnion, WORLD_SOURCES.fscs],
        },

        /* ---------------------------------------------------------------- */
        {
          id: "community-mutuals",
          title: { en: "Mutuals and building societies", ar: "الجمعيات التعاونية وجمعيات البناء" },
          objective: {
            en: "Explain member ownership at scale, and name the structural limitation that comes with it.",
            ar: "اشرح ملكية الأعضاء على نطاق واسع، وسمِّ القيد البنيوي المصاحب لها.",
          },
          minutes: 9,
          xp: 150,
          relevance: {
            en: "Building societies hold a large share of UK mortgages and savings, so most students will deal with one without realising it is not a bank. The interesting part is why the model survives at all when it cannot raise capital from the stock market, and what that means for the customer.",
            ar: "تستحوذ جمعيات البناء على حصة كبيرة من الرهون والمدخرات في بريطانيا، لذا سيتعامل معظم الطلاب مع إحداها دون أن يدركوا أنها ليست بنكاً. والمثير هو سبب بقاء النموذج وهو لا يستطيع جمع رأس المال من السوق، وما يعنيه ذلك للعميل.",
          },
          steps: [
            {
              k: "idea",
              title: { en: "One member, one vote", ar: "عضو واحد، صوت واحد" },
              body: {
                en: "A mutual is owned by its members rather than by shareholders, and control is democratic: each member gets one vote regardless of how much they have saved. It is a different answer to the question of who the institution is for.",
                ar: "الجمعية التعاونية مملوكة لأعضائها لا لمساهمين، والسيطرة ديمقراطية: لكل عضو صوت واحد أياً كان حجم مدخراته. إنها إجابة مختلفة عن سؤال: لمن تعمل المؤسسة.",
              },
              points: [
                {
                  en: "Because there are no shares, the institution cannot raise equity from the market. It funds itself from deposits and retained profits, which makes it cautious by construction rather than by policy.",
                  ar: "لعدم وجود أسهم، لا تستطيع المؤسسة جمع رأس مال من السوق، بل تموّل نفسها من الودائع والأرباح المحتجزة. وهذا يجعلها حذرة بالبناء لا بالسياسة.",
                },
                {
                  en: "One vote per member is fair and also means a member with £50,000 saved has the same say as one with £50. That is a deliberate choice with real weaknesses, including that it is hard to raise large amounts of capital quickly.",
                  ar: "صوت واحد لكل عضو عادل، ويعني أيضاً أن عضواً بمدخرات ٥٠٠٠٠ جنيه له رأي كصاحب ٥٠ جنيهاً. وهو خيار متعمّد له ضعف حقيقي، منها صعوبة جمع مبالغ كبيرة بسرعة.",
                },
                {
                  en: "Size is possible: some UK building societies are among the largest mortgage lenders in the country, so mutual does not mean small.",
                  ar: "الحجم ممكن: بعض جمعيات البناء البريطانية من أكبر مقرضي الرهون في البلد، فالتعاونية لا تعني صغيرة.",
                },
              ],
            },
            {
              k: "example",
              title: { en: "The same mortgage, two owners", ar: "الرهن نفسه، مالكان مختلفان" },
              setup: {
                en: "Two lenders offer a similar fixed-rate mortgage. The structural difference shows up in how each behaves when conditions change.",
                ar: "مقرضان يعرضان رهناً مشابهاً بسعر ثابت. ويظهر الفرق البنيوي في سلوك كل منهما عند تغيّر الظروف.",
              },
              rows: [
                {
                  label: { en: "When rates fall (shareholder-owned)", ar: "عند انخفاض الفائدة (ملكية مساهمين)" },
                  value: {
                    en: "Pressure to widen the margin and improve profit, because shareholders expect a return.",
                    ar: "ضغط لتوسيع الهامش وتحسين الربح، لأن المساهمين يتوقّعون عائداً.",
                  },
                },
                {
                  label: { en: "When rates fall (mutual)", ar: "عند انخفاض الفائدة (تعاونية)" },
                  value: {
                    en: "More freedom to pass the benefit to borrowers or savers, since there is no external dividend to protect.",
                    ar: "حرية أكبر لتمرير النفع إلى المقترضين أو المودعين، إذ لا توزيعات خارجية لحمايتها.",
                  },
                },
                {
                  label: { en: "When capital is needed (mutual)", ar: "عند الحاجة إلى رأس مال (تعاونية)" },
                  value: {
                    en: "It has to retain profit or borrow, and cannot issue shares. Growth is slower and a shock is harder to absorb.",
                    ar: "عليها احتجاز الأرباح أو الاقتراض، ولا يمكنها إصدار أسهم. النمو أبطأ واستيعاب الصدمات أصعب.",
                  },
                },
              ],
              takeaway: {
                en: "Member ownership shifts who benefits in the good times and removes a tool for surviving the bad times. Both halves are the same design decision.",
                ar: "ملكية الأعضاء تغيّر من ينتفع في الأوقات الجيدة وتزيل أداة للنجاة في الأوقات الصعبة. والوجهان قرار تصميمي واحد.",
              },
            },
            {
              k: "categorise",
              prompt: {
                en: "Sort each characteristic by the kind of institution it describes.",
                ar: "صنّف كل صفة بحسب نوع المؤسسة التي تصفها.",
              },
              buckets: [
                {
                  name: { en: "Member-owned mutual", ar: "تعاونية مملوكة للأعضاء" },
                  items: [
                    { en: "One member, one vote", ar: "عضو واحد، صوت واحد" },
                    { en: "No shares traded on a market", ar: "لا أسهم متداولة في سوق" },
                    { en: "Surplus retained or passed to members", ar: "الفائض يُحتجز أو يُمرَّر للأعضاء" },
                  ],
                },
                {
                  name: { en: "Shareholder-owned company", ar: "شركة مملوكة لمساهمين" },
                  items: [
                    { en: "One share, one vote", ar: "سهم واحد، صوت واحد" },
                    { en: "Can raise capital by issuing shares", ar: "يمكنها جمع رأس المال بإصدار أسهم" },
                    { en: "Dividends paid to outside owners", ar: "توزيعات تُدفع لمالكين خارجيين" },
                  ],
                },
              ],
            },
            {
              k: "choice",
              prompt: {
                en: "What is the main structural limitation of a building society?",
                ar: "ما القيد البنيوي الأساسي لجمعية البناء؟",
              },
              options: [
                {
                  en: "It cannot raise equity capital from the market, so it must grow out of retained profit.",
                  ar: "لا تستطيع جمع رأس مال من السوق، فعليها النمو من الأرباح المحتجزة.",
                },
                {
                  en: "It is not regulated.",
                  ar: "غير خاضعة للتنظيم.",
                },
                {
                  en: "Its deposits are not protected.",
                  ar: "ودائعها غير محمية.",
                },
              ],
              answer: 0,
              why: {
                en: "The capital constraint is the real one, and it explains the caution that members often experience as good service and critics describe as missed opportunity. Deposits in a building society are protected and it is fully regulated, so the other two options are wrong.",
                ar: "قيد رأس المال هو القيد الحقيقي، وهو يفسّر الحذر الذي يعتبره الأعضاء خدمة جيدة ويصفه النقاد بفرصة ضائعة. أما الودائع في جمعية البناء فمحمية والمؤسسة منظّمة بالكامل، لذا الخياران الآخران خطأ.",
              },
            },
            {
              k: "order",
              prompt: {
                en: "Put the steps of a demutualisation in order.",
                ar: "رتّب خطوات التحوّل من التعاونية إلى شركة.",
              },
              items: [
                { en: "Members are offered a vote on the change", ar: "يُعرض على الأعضاء التصويت على التغيير" },
                { en: "A majority of members votes in favour", ar: "تصوّت أغلبية الأعضاء بالموافقة" },
                { en: "The society becomes a company with shares", ar: "تتحول الجمعية إلى شركة ذات أسهم" },
                { en: "Members receive shares or cash as a windfall", ar: "يتلقى الأعضاء أسهماً أو نقداً كمكسب مفاجئ" },
                { en: "Future profits are answerable to shareholders, not members", ar: "تصبح الأرباح المستقبلية مسؤولة أمام المساهمين لا الأعضاء" },
              ],
              why: {
                en: "Demutualisation genuinely happened in the UK in the 1990s, and it is worth understanding the incentive it created: a member with a £500 account was voting on whether to receive a windfall of a few thousand pounds, while giving up a share in an institution worth billions. Whether that was a good deal is still argued about.",
                ar: "حدث التحوّل فعلاً في بريطانيا في التسعينيات، ويستحق فهم الحافز الذي خلقه: عضو بحساب ٥٠٠ جنيه يصوّت على استلام مكسب مفاجئ ببضعة آلاف، مقابل التنازل عن حصة في مؤسسة تساوي المليارات. وهل كان ذلك صفقة جيدة لا يزال محل جدل.",
              },
            },
            {
              k: "scenario",
              prompt: {
                en: "A building society offers you £200,000 and a savings bond to demutualise. You are a member with £1,000 in savings. What is the honest way to think about it?",
                ar: "تعرض عليك جمعية بناء ٢٠٠ ألف جنيه وسنداً ادخارياً مقابل التحوّل إلى شركة. وأنت عضو بمدخرات ١٠٠٠ جنيه. ما الطريقة الصادقة للتفكير؟",
              },
              options: [
                {
                  label: { en: "“Free money, I should take it.”", ar: "«مال مجاني، عليّ قبوله.»" },
                  outcome: {
                    en: "It is not free. You are selling your ownership of the institution, and its future profits will go to shareholders. The payment may still be enough to persuade you, but it is a sale, not a gift.",
                    ar: "ليس مجانياً. أنت تبيع ملكيتك في المؤسسة، وستذهب أرباحها المستقبلية إلى المساهمين. وقد يكفي المبلغ لإقناعك، لكنه بيع لا هدية.",
                  },
                  delta: 0,
                },
                {
                  label: {
                    en: "“I am trading a share of a large institution for a smaller certain amount, so the question is which I value more.”",
                    ar: "«أنا أبادل حصة في مؤسسة كبيرة بمبلغ مؤكد أصغر، فالسؤال أيهما أثمن عندي.»",
                  },
                  outcome: {
                    en: "That is the actual decision, and it is a genuinely reasonable one to answer either way. The useful thing is to notice that a small certain sum is psychologically compelling in a way an unquantifiable ownership share is not, which is exactly how these votes tend to pass.",
                    ar: "هذا هو القرار الفعلي، والجواب عنه من الطرفين معقول فعلاً. والمفيد أن تلاحظ أن المبلغ الصغير المؤكد جاذب نفسياً بطريقة لا تجذب بها الحصة الملكية غير القابلة للقياس، وهكذا تمرّ هذه التصويتات عادة.",
                  },
                  delta: 2,
                },
                {
                  label: { en: "“Demutualisation is always wrong.”", ar: "«التحوّل إلى شركة خطأ دائماً.»" },
                  outcome: {
                    en: "Not always. The capital constraint is real, and a mutual that needs capital to survive may serve its members better as a company. The honest position is that it is a trade, not a moral test.",
                    ar: "ليس دائماً. فقيد رأس المال حقيقي، وقد تخدم التعاونية أعضاءها أفضل كشركة إن احتاجت رأس مال للبقاء. والموقف الصادق أنها مقايضة لا اختبار أخلاقي.",
                  },
                  delta: 0,
                },
              ],
            },
          ],
          sources: [WORLD_SOURCES.coopUk, WORLD_SOURCES.fscs, WORLD_SOURCES.boe],
        },

        /* ---------------------------------------------------------------- */
        {
          id: "community-shares",
          title: { en: "Pooling capital as a community", ar: "تجميع رأس المال مجتمعياً" },
          objective: {
            en: "Describe how community shares work, and identify the risks that make them different from listed shares.",
            ar: "اشرح كيف تعمل الأسهم المجتمعية، وحدّد المخاطر التي تجعلها مختلفة عن الأسهم المدرجة.",
          },
          minutes: 9,
          xp: 160,
          relevance: {
            en: "Community shares are the one place a student is likely to be offered an investment by people they know, for local reasons rather than financial ones. That mix is exactly why the risks need stating plainly before the decision, not after.",
            ar: "الأسهم المجتمعية هي الموضع الذي يُرجّح فيه أن يعرض عليك أشخاص تعرفهم استثماراً لأسباب محلية لا مالية. وهذا المزيج بالتحديد هو سبب الحاجة إلى بيان المخاطر بوضوح قبل القرار لا بعده.",
          },
          steps: [
            {
              k: "idea",
              title: { en: "Money for something local, and at risk", ar: "مال لشيء محلي، ومعرّض للخسارة" },
              body: {
                en: "Community shares raise money from many people, usually small amounts each, to buy or run something local: a pub, a shop, a sports club, an energy scheme. They are legally a form of withdrawable share capital in a community benefit society, with one member one vote regardless of how much each person put in.",
                ar: "تجمع الأسهم المجتمعية المال من كثيرين، بمبالغ صغيرة عادة، لشراء أو تشغيل شيء محلي: حانة أو متجر أو نادٍ رياضي أو مشروع طاقة. وهي قانوناً شكل من رأس المال القابل للسحب في جمعية نفع مجتمعي، بصوت واحد لكل عضو أياً كان ما دفعه.",
              },
              points: [
                {
                  en: "You cannot sell them to someone else. They are not listed, and the society can usually suspend withdrawals if its finances weaken.",
                  ar: "لا يمكنك بيعها لشخص آخر. فهي غير مدرجة، ويمكن للجمعية عادة تعليق السحب إن ضعفت ماليتها.",
                },
                {
                  en: "They are not covered by the deposit protection scheme. That scheme protects money in a savings account, and this is not a savings account.",
                  ar: "وهي غير مشمولة بنظام حماية الودائع. فذلك النظام يحمي المال في حساب ادخاري، وهذا ليس حساباً ادخارياً.",
                },
                {
                  en: "The return is usually modest and sometimes zero. People buy them as much for the outcome as for the yield, and that is legitimate, as long as it is not mistaken for a safe savings product.",
                  ar: "والعائد متواضع عادة وأحياناً صفر. والناس يشترونها بقدر ما يشترونها للنتيجة بقدر ما يشترونها للعائد، وهذا مشروع ما لم تُفهم على أنها منتج ادخاري آمن.",
                },
              ],
            },
            {
              k: "example",
              title: { en: "Saving account or community share?", ar: "حساب ادخاري أم سهم مجتمعي؟" },
              setup: {
                en: "£500 in two places, and the important differences are not the interest rates.",
                ar: "٥٠٠ جنيه في مكانين، والفروق المهمة ليست أسعار الفائدة.",
              },
              rows: [
                {
                  label: { en: "£500 in a savings account", ar: "٥٠٠ جنيه في حساب ادخاري" },
                  value: {
                    en: "Protected up to the scheme limit. You can withdraw it. The interest is small but the capital is not at risk.",
                    ar: "محمية حتى حد النظام. ويمكنك سحبها. والفائدة صغيرة لكن رأس المال غير معرّض للخسارة.",
                  },
                },
                {
                  label: { en: "£500 in community shares", ar: "٥٠٠ جنيه في أسهم مجتمعية" },
                  value: {
                    en: "Not protected. Withdrawal depends on the society's rules and its cash. If the project fails, the money can be lost entirely.",
                    ar: "غير محمية. والسحب يعتمد على قواعد الجمعية وسيولتها. وإن فشل المشروع فقد يُفقد المال كلياً.",
                  },
                },
                {
                  label: { en: "The one you can get out of quickly", ar: "أيّهما يمكن الخروج منه بسرعة" },
                  value: {
                    en: "The savings account, always. Community shares are illiquid by design, which is what makes them long-term community capital.",
                    ar: "الحساب الادخاري دائماً. فالأسهم المجتمعية غير سائلة بحكم تصميمها، وهذا ما يجعلها رأس مال مجتمعي طويل الأجل.",
                  },
                },
              ],
              takeaway: {
                en: "The right question is not “what does it pay” but “can I afford to lose this, and am I willing to wait for it”. If the answer is no to either, it is the wrong product.",
                ar: "السؤال الصحيح ليس «كم تدفع» بل «هل أستطيع تحمّل خسارتها، وهل أقبل الانتظار». وإن كان الجواب لا لأي منهما فالمنتج خطأ.",
              },
            },
            {
              k: "watchout",
              title: { en: "Local and friendly are not the same as protected", ar: "المحلي والودّي ليس مثل المحمي" },
              body: {
                en: "A community share offer from people you know, for a cause you support, is still an investment with a real chance of total loss. The rules on how such offers must be presented exist precisely because enthusiasm and financial judgement are separate things, and the offer document is where the risks are meant to be stated. Read the part about what happens if the project fails before the part about the interest rate.",
                ar: "عرض الأسهم المجتمعية من أشخاص تعرفهم ولغرض تؤيده يبقى استثماراً فيه احتمال حقيقي بخسارة كاملة. والقواعد المنظّمة لكيفية تقديم هذه العروض موجودة تحديداً لأن الحماس والحكم المالي أمران منفصلان، ومستند العرض هو موضع بيان المخاطر. اقرأ الجزء المتعلق بما يحدث إن فشل المشروع قبل الجزء المتعلق بسعر الفائدة.",
              },
            },
            {
              k: "choice",
              prompt: {
                en: "What makes community shares different from listed shares?",
                ar: "ما الذي يجعل الأسهم المجتمعية مختلفة عن الأسهم المدرجة؟",
              },
              options: [
                {
                  en: "They usually pay a guaranteed dividend.",
                  ar: "تدفع عادة توزيعات مضمونة.",
                },
                {
                  en: "They cannot be sold to another investor, and are not covered by the savings protection scheme.",
                  ar: "لا يمكن بيعها لمستثمر آخر، ولا تشملها حماية الودائع.",
                },
                {
                  en: "They are only available to people over 30.",
                  ar: "متاحة فقط لمن تجاوز الثلاثين.",
                },
              ],
              answer: 1,
              why: {
                en: "Illiquidity and the absence of protection are the defining features, and they are what allow a project to be funded by its own community rather than by a bank. There are no guaranteed dividends in this structure.",
                ar: "عدم السيولة وغياب الحماية هما السمتان المميّزتان، وهما ما يسمح بتمويل مشروع من مجتمعه لا من بنك. ولا توجد توزيعات مضمونة في هذا الهيكل.",
              },
            },
            {
              k: "fill",
              prompt: { en: "Complete the sentence.", ar: "أكمل الجملة." },
              before: { en: "Community shares are meant to be held", ar: "الأسهم المجتمعية مصمّمة لتُحمل" },
              after: {
                en: ", which is why the society is allowed to suspend withdrawals.",
                ar: "، ولهذا يُسمح للجمعية بتعليق السحب.",
              },
              bank: [
                { en: "for the long term", ar: "على المدى الطويل" },
                { en: "for a few weeks", ar: "لبضعة أسابيع" },
                { en: "only by institutions", ar: "من المؤسسات فقط" },
              ],
              answer: ["for the long term"],
              why: {
                en: "That suspension is not a loophole, it is the mechanism. A society that had to repay every member on demand could not fund anything lasting, so the trade is certain illiquidity in exchange for the project existing at all.",
                ar: "التعليق ليس ثغرة بل هو الآلية. فالجمعية التي تُلزم بسداد كل عضو عند الطلب لا تستطيع تمويل شيء دائم، فالمقايضة عدم سيولة مؤكد مقابل وجود المشروع أصلاً.",
              },
            },
            {
              k: "scenario",
              prompt: {
                en: "A community energy co-operative near you offers shares at 3% and needs £100,000. You have £600 in savings and you want to help. What is the right approach?",
                ar: "تعاونية طاقة مجتمعية قريبة منك تطرح أسهماً بعائد ٣٪ وتحتاج ١٠٠ ألف جنيه. لديك ٦٠٠ جنيه مدخرات وتريد المساعدة. ما المقاربة الصحيحة؟",
              },
              options: [
                {
                  label: { en: "Invest all £600, the cause is good.", ar: "استثمر الـ٦٠٠ كلها، فالغرض نبيل." },
                  outcome: {
                    en: "That puts your entire buffer into an illiquid, unprotected asset. Good causes and good financial decisions are separate axes, and a project failing would cost you the emergency money too.",
                    ar: "هذا يضع كامل مخزونك في أصل غير سائل وغير محمي. فالغرض النبيل والقرار المالي السليم محوران منفصلان، وفشل المشروع سيكلّفك مال الطوارئ أيضاً.",
                  },
                  delta: 0,
                },
                {
                  label: {
                    en: "Consider whether you can lose the amount and wait for it, then invest only what fits that answer.",
                    ar: "انظر إن كنت تستطيع خسارة المبلغ والانتظار، ثم استثمر ما يوافق ذلك فقط.",
                  },
                  outcome: {
                    en: "That is the decision the product actually requires. It may be £100 and it may be nothing, and both are respectable. What matters is that the emergency money stays where it can be reached.",
                    ar: "هذا هو القرار الذي يتطلبه المنتج فعلاً. وقد يكون ١٠٠ جنيه وقد يكون لا شيء، وكلاهما محترم. والمهم أن يبقى مال الطوارئ في مكان يمكن الوصول إليه.",
                  },
                  delta: 2,
                },
                {
                  label: { en: "Treat it as a savings account with a better rate.", ar: "اعتبرها حساب ادخار بسعر أفضل." },
                  outcome: {
                    en: "That is the exact misunderstanding the rules on these offers exist to prevent. It is not a savings account, the capital is at risk, and the 3% is not a rate you are owed but a hoped-for return.",
                    ar: "هذا هو الخطأ الفهمي نفسه الذي وُجدت قواعد هذه العروض لمنعه. فهو ليس حساب ادخار، ورأس المال معرّض للخسارة، و٣٪ ليست سعراً مستحقاً لك بل عائداً مأمولاً.",
                  },
                  delta: 0,
                },
              ],
            },
          ],
          sources: [WORLD_SOURCES.communityShares, WORLD_SOURCES.coopUk, WORLD_SOURCES.fscs],
        },

        /* ---------------------------------------------------------------- */
        {
          id: "community-microfinance",
          title: { en: "Microfinance: what it does, and what it does not", ar: "التمويل الأصغر: ما يفعله وما لا يفعله" },
          objective: {
            en: "Explain why microloans carry high interest rates, and name the documented criticisms alongside the successes.",
            ar: "اشرح سبب ارتفاع أسعار الفائدة على القروض الصغيرة، وسمِّ الانتقادات الموثّقة إلى جانب النجاحات.",
          },
          minutes: 9,
          xp: 160,
          relevance: {
            en: "Microfinance is the clearest example in this whole section of a model that genuinely helps some people and genuinely harms others. It is also the one students are most likely to meet through fundraising rather than through a bank, which makes the ability to assess it honestly more useful than a strong opinion about it.",
            ar: "التمويل الأصغر أوضح مثال في هذا القسم كله على نموذج ينفع بعض الناس فعلاً ويضرّ آخرين فعلاً. وهو أيضاً الأكثر ترجيحاً أن يصادفه الطلاب عبر حملات التبرع لا عبر بنك، مما يجعل القدرة على تقييمه بصدق أنفع من تبنّي رأي حاسم بشأنه.",
          },
          steps: [
            {
              k: "idea",
              title: { en: "Small loans, and why they cost more", ar: "قروض صغيرة، ولماذا تكلّف أكثر" },
              body: {
                en: "Microfinance is the provision of small loans, savings and insurance to people who have no collateral and no formal credit history. The interest rates are much higher than a mortgage, and the reason is arithmetic before it is anything else: the cost of assessing and collecting a loan is roughly the same whether the loan is a hundred pounds or a hundred thousand.",
                ar: "التمويل الأصغر تقديم قروض ومدخرات وتأمين صغيرة لمن لا ضمانات لديه ولا سجل ائتماني رسمي. وأسعار فائدته أعلى بكثير من الرهن العقاري، والسبب حسابي قبل أي شيء آخر: كلفة تقييم القرض وتحصيله متقاربة سواء كان القرض مئة جنيه أو مئة ألف.",
              },
              points: [
                {
                  en: "Group lending is the classic mechanism: borrowers guarantee one another, which substitutes social accountability for the collateral they do not have.",
                  ar: "الإقراض الجماعي هو الآلية الكلاسيكية: يضمن المقترضون بعضهم بعضاً، فتحلّ المساءلة الاجتماعية محل الضمانات التي لا يملكونها.",
                },
                {
                  en: "The model is genuinely successful at reaching people that banks do not serve, and it has been replicated in dozens of countries since the 1970s.",
                  ar: "النموذج ناجح فعلاً في الوصول إلى من لا تخدمهم البنوك، وقد استُنسخ في عشرات البلدان منذ السبعينيات.",
                },
                {
                  en: "The same mechanism also means a borrower who cannot repay is pressured by their neighbours as well as by the lender, and that pressure is where much of the documented harm comes from.",
                  ar: "الآلية نفسها تعني أيضاً أن المقترض العاجز عن السداد يتعرض لضغط جيرانه إلى جانب ضغط المُقرِض، ومن هذا الضغط يأتي كثير من الضرر الموثّق.",
                },
              ],
            },
            {
              k: "example",
              title: { en: "Where the interest rate goes", ar: "إلى أين يذهب سعر الفائدة" },
              setup: {
                en: "A lender makes 1,000 small loans of £200. The rate looks high next to a mortgage, so it is worth seeing what it covers.",
                ar: "مقرِض يقدّم ١٠٠٠ قرض صغير بقيمة ٢٠٠ جنيه. يبدو السعر مرتفعاً بالمقارنة مع رهن عقاري، فيستحق الأمر رؤية ما يغطّيه.",
              },
              rows: [
                {
                  label: { en: "Assessing and approving", ar: "التقييم والموافقة" },
                  value: {
                    en: "Staff time per loan is similar to a large loan. Spread over £200 instead of £200,000, it is a hundred times more expensive per pound lent.",
                    ar: "وقت الموظف لكل قرض مماثل لوقت القرض الكبير. وعند توزيعه على ٢٠٠ جنيه بدل ٢٠٠ ألف، يصبح أغلى مئة مرة لكل جنيه مُقرض.",
                  },
                },
                {
                  label: { en: "Collecting repayments", ar: "تحصيل الأقساط" },
                  value: {
                    en: "Weekly collections from a thousand borrowers in person costs far more than a monthly direct debit from one borrower.",
                    ar: "التحصيل الأسبوعي من ألف مقترض حضورياً أغلى بكثير من خصم شهري من مقترض واحد.",
                  },
                },
                {
                  label: { en: "Losses", ar: "الخسائر" },
                  value: {
                    en: "No collateral means unpaid loans are usually not recovered. That has to be covered by the borrowers who do repay.",
                    ar: "غياب الضمانات يعني أن القروض غير المسددة لا تُسترد عادة. ويلزم تغطيتها من المقترضين السدادين.",
                  },
                },
              ],
              takeaway: {
                en: "Some of the high rate is real cost and some of it is margin, and the proportions are exactly what the criticism is about. The arithmetic explains why it cannot be as cheap as a mortgage; it does not by itself justify how high it goes.",
                ar: "بعض السعر المرتفع كلفة حقيقية وبعضه هامش، والنسب هي بالضبط موضع الانتقاد. والحساب يفسّر لماذا لا يمكن أن يكون رخيصاً كالرهن، لكنه لا يبرّر في ذاته مدى ارتفاعه.",
              },
            },
            {
              k: "categorise",
              prompt: {
                en: "Sort each statement by whether it is a strength of microfinance or a documented criticism.",
                ar: "صنّف كل عبارة: هل هي قوة في التمويل الأصغر أم انتقاد موثّق؟",
              },
              buckets: [
                {
                  name: { en: "Strength", ar: "قوة" },
                  items: [
                    { en: "Reaches people banks will not serve", ar: "يصل إلى من لا تخدمهم البنوك" },
                    { en: "Builds a repayment record where none existed", ar: "يبني سجلاً ائتمانياً حيث لم يكن" },
                    { en: "Turns social accountability into a substitute for collateral", ar: "يحوّل المساءلة الاجتماعية بديلاً عن الضمانات" },
                  ],
                },
                {
                  name: { en: "Documented criticism", ar: "انتقاد موثّق" },
                  items: [
                    { en: "Group pressure can become serious social pressure on those who default", ar: "قد يتحوّل ضغط المجموعة إلى ضغط اجتماعي شديد على المتعثرين" },
                    { en: "Some borrowers take multiple loans and become over-indebted", ar: "بعض المقترضين يأخذون قروضاً متعددة فيثقلون بالدين" },
                    { en: "Evidence of a lasting effect on income is weaker than the early claims suggested", ar: "الأدلة على أثر دائم على الدخل أضعف مما أوحته الادعاءات الأولى" },
                  ],
                },
              ],
            },
            {
              k: "choice",
              prompt: {
                en: "Why are microfinance interest rates much higher than a mortgage rate?",
                ar: "لماذا أسعار فائدة التمويل الأصغر أعلى بكثير من فائدة الرهن العقاري؟",
              },
              options: [
                {
                  en: "The lenders are greedy criminals.",
                  ar: "المقرضون مجرمون جشعون.",
                },
                {
                  en: "The fixed cost of each loan is spread over a very small amount, and there is no collateral for the losses.",
                  ar: "الكلفة الثابتة لكل قرض تُوزّع على مبلغ صغير جداً، ولا توجد ضمانات لتحمّل الخسائر.",
                },
                {
                  en: "There is no competition in those markets.",
                  ar: "لا يوجد تنافس في تلك الأسواق.",
                },
              ],
              answer: 1,
              why: {
                en: "The arithmetic is the main reason, and it is a real one. It is also not the whole story: different providers pass on very different margins, which is why some microfinance institutions are heavily criticised while others are not.",
                ar: "الحساب هو السبب الرئيسي وهو سبب حقيقي. لكنه ليس القصة كاملة: المزوّدون المختلفون يمرّرون هوامش مختلفة جداً، ولهذا تُنتقد بعض مؤسسات التمويل الأصغر بشدة وأخرى لا.",
              },
            },
            {
              k: "fill",
              prompt: { en: "Complete the sentence about how it works.", ar: "أكمل الجملة عن كيفية عمله." },
              before: {
                en: "Group lending works by replacing collateral with",
                ar: "الإقراض الجماعي يعمل باستبدال الضمانات بـ",
              },
              after: {
                en: ", which is also the source of its best-documented harm.",
                ar: "، وهو أيضاً مصدر أشهر أضراره الموثّقة.",
              },
              bank: [
                { en: "mutual social accountability", ar: "مساءلة اجتماعية متبادلة" },
                { en: "government guarantees", ar: "ضمانات حكومية" },
                { en: "property titles", ar: "سندات ملكية" },
              ],
              answer: ["mutual social accountability"],
              why: {
                en: "The same feature that makes it work for people without assets is the feature that makes default an interpersonal problem rather than a purely financial one. That is the honest way to describe both the innovation and the flaw.",
                ar: "الصفة نفسها التي تجعله ناجحاً مع من لا يملكون أصولاً هي التي تجعل التعثر مشكلة بين الأشخاص لا مشكلة مالية محضة. وهذه هي الطريقة الصادقة لوصف الابتكار والعيب معاً.",
              },
            },
            {
              k: "scenario",
              prompt: {
                en: "A charity asks you to donate so a microloan fund can operate in a country you know well. What would you want to know before giving?",
                ar: "جمعية خيرية تطلب تبرعاً ليعمل صندوق قروض صغيرة في بلد تعرفه جيداً. ما الذي تريد معرفته قبل التبرع؟",
              },
              options: [
                {
                  label: { en: "Nothing, microfinance is always good.", ar: "لا شيء، فالتمويل الأصغر جيد دائماً." },
                  outcome: {
                    en: "That confidence is not supported by the evidence. Randomised studies have found smaller and more mixed effects on income than the early stories suggested, alongside real problems with over-indebtedness.",
                    ar: "هذه الثقة لا تسندها الأدلة. فقد وجدت دراسات عشوائية آثاراً أصغر وأكثر اختلاطاً على الدخل مما أوحته القصص الأولى، إلى جانب مشكلات حقيقية من فرط الاستدانة.",
                  },
                  delta: 0,
                },
                {
                  label: {
                    en: "What rate the borrowers pay, who holds the surplus, and what evidence the fund has on outcomes.",
                    ar: "ما السعر الذي يدفعه المقترضون، ومن يحتفظ بالفائض، وما الدليل على النتائج.",
                  },
                  outcome: {
                    en: "Those three questions separate a programme that helps borrowers from one that helps its managers. They are also answerable, which is what makes them worth asking rather than a reason to walk away.",
                    ar: "هذه الأسئلة الثلاثة تفصل برنامجاً ينفع المقترضين عن برنامج ينفع مديريه. وهي أيضاً قابلة للإجابة، وهذا ما يجعل طرحها مجدياً بدل أن يكون سبباً للانصراف.",
                  },
                  delta: 2,
                },
                {
                  label: { en: "Is the interest rate zero?", ar: "هل سعر الفائدة صفر؟" },
                  outcome: {
                    en: "Zero-rate lending rarely survives without subsidy, and subsidy can distort a local market for credit. A rate high enough to cover cost is not automatically a bad sign; the number itself needs context.",
                    ar: "الإقراض بلا فائدة قلّما يستمر دون دعم، والدعم قد يشوّه سوق الائتمان المحلي. وسعر يكفي لتغطية الكلفة ليس مؤشراً سيئاً بذاته، فالرقم وحده يحتاج سياقاً.",
                  },
                  delta: 0,
                },
              ],
            },
          ],
          sources: [WORLD_SOURCES.cgap, WORLD_SOURCES.worldBank, WORLD_SOURCES.socialEnterpriseUk],
        },
      ],
    },
  ],
};
