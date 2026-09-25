/**
 * Pathway 3 of 4: International Finance.
 *
 * Same shape and depth as the Islamic Finance track, which is the reference
 * implementation for this section. Built to be practical rather than
 * definitional: every lesson ends on a decision a student with family, work or
 * study connections overseas might actually face.
 */
import type { Track } from "../curriculum";
import { WORLD_SOURCES } from "./sources";

export const internationalTrack: Track = {
  id: "international",
  title: { en: "International Finance", ar: "التمويل الدولي" },
  tagline: {
    en: "What changes when money crosses a border",
    ar: "ما الذي يتغيّر حين يعبر المال حدوداً",
  },
  icon: "⊕",
  optional: true,
  audience: {
    en: "Optional branch. Useful if you send or receive money across a border, hold more than one currency, or have family in another country.",
    ar: "مسار اختياري. مفيد إن كنت ترسل أو تستقبل مالاً عبر الحدود، أو تحمل أكثر من عملة، أو لديك عائلة في بلد آخر.",
  },
  units: [
    {
      id: "international-u1",
      title: { en: "Rates, transfers, and what you are exposed to", ar: "الأسعار والتحويلات وما أنت معرّض له" },
      lessons: [
        /* ---------------------------------------------------------------- */
        {
          id: "international-rates",
          title: { en: "An exchange rate is a price", ar: "سعر الصرف سعر" },
          objective: {
            en: "Explain what moves a currency, and work out what a rate change does to money you send or receive.",
            ar: "اشرح ما يحرّك العملة، واحسب أثر تغيّر السعر على مال ترسله أو تستقبله.",
          },
          minutes: 8,
          xp: 140,
          relevance: {
            en: "If £500 arrives from abroad, the amount you receive depends on a price set in a market you never see, and it can move several per cent in a month. That is a real difference in money for a student, and it is not random.",
            ar: "إن وصلت ٥٠٠ جنيه من الخارج، فالمبلغ الذي تستلمه يعتمد على سعر يُحدَّد في سوق لا تراها، وقد يتحرّك عدة بالمئة في شهر. وهذا فرق حقيقي في المال للطالب، وهو ليس عشوائياً.",
          },
          steps: [
            {
              k: "idea",
              title: { en: "A currency is a thing with a price", ar: "العملة شيء له سعر" },
              body: {
                en: "An exchange rate is the price of one currency in another. Like any price it is set by supply and demand, and it moves. Four things move it most: interest rates, inflation, the flow of trade and investment, and expectations about all three.",
                ar: "سعر الصرف هو سعر عملة بعملة أخرى. وكأي سعر يحدّده العرض والطلب، وهو يتحرّك. وأكثر ما يحرّكه أربعة: أسعار الفائدة، والتضخم، وتدفق التجارة والاستثمار، والتوقعات بشأن الثلاثة.",
              },
              points: [
                {
                  en: "Higher interest rates in a country tend to attract money into it, which tends to raise its currency. This is why central bank decisions move exchange rates within seconds.",
                  ar: "أسعار الفائدة الأعلى في بلد ما تجذب المال إليه عادة، وهذا يرفع عملته غالباً. ولهذا تحرّك قرارات البنوك المركزية أسعار الصرف في ثوانٍ.",
                },
                {
                  en: "Higher inflation works the other way over time: money that buys less at home is worth less abroad.",
                  ar: "التضخم الأعلى يعمل في الاتجاه المعاكس مع الوقت: مال يشتري أقل في الداخل يساوي أقل في الخارج.",
                },
                {
                  en: "Nobody reliably predicts the next move. If they could, the price would already have changed.",
                  ar: "لا أحد يتوقّع الحركة التالية بموثوقية. ولو استطاعوا، لتغيّر السعر بالفعل.",
                },
              ],
            },
            {
              k: "example",
              title: { en: "£500, two rates, one month apart", ar: "٥٠٠ جنيه، سعران، شهر بينهما" },
              setup: {
                en: "The same £500 sent to the same country, converted at the rate on two different days. The fee is held constant so the rate is the only thing moving.",
                ar: "المبلغ نفسه ٥٠٠ جنيه إلى البلد نفسه، محوَّلاً بالسعر في يومين مختلفين. الرسوم ثابتة ليكون السعر هو المتغيّر الوحيد.",
              },
              rows: [
                {
                  label: { en: "Rate moves against you by 3%", ar: "السعر يتحرّك ضدك بنسبة ٣٪" },
                  value: {
                    en: "Your £500 buys about 3% less of the foreign currency. On £500 that is roughly £15 of value, gone without anyone charging you anything.",
                    ar: "تشترى ٥٠٠ جنيه أقل بنحو ٣٪ من العملة الأجنبية. أي نحو ١٥ جنيهاً من القيمة تختفي دون أن يتقاضى أحد رسوماً.",
                  },
                },
                {
                  label: { en: "Rate moves in your favour by 3%", ar: "السعر يتحرّك لصالحك بنسبة ٣٪" },
                  value: {
                    en: "You get about 3% more, again for free. The movement is not a fee you paid or a discount you earned.",
                    ar: "تحصل على نحو ٣٪ أكثر، مجاناً أيضاً. فالحركة ليست رسمًا دفعته ولا خصماً كسبته.",
                  },
                },
                {
                  label: { en: "Over a year of regular transfers", ar: "على مدى عام من التحويلات المنتظمة" },
                  value: {
                    en: "A student sending money monthly is exposed to this twelve times. The sum of those movements is usually larger than the transfer fees.",
                    ar: "الطالب الذي يحوّل شهرياً يتعرّض لهذا اثنتي عشرة مرة. ومجموع هذه الحركات أكبر عادة من رسوم التحويل.",
                  },
                },
              ],
              takeaway: {
                en: "Rate movement is usually a bigger number than the fee, and unlike the fee it is not on the price list.",
                ar: "حركة السعر رقم أكبر عادة من الرسوم، وخلافاً للرسوم فهي ليست مكتوبة في قائمة الأسعار.",
              },
            },
            {
              k: "choice",
              prompt: {
                en: "You are in the UK expecting £500 from family abroad. The pound weakens against their currency before they send. What happens to the amount they need to send?",
                ar: "أنت في بريطانيا وتنتظر ٥٠٠ جنيه من عائلتك في الخارج. ضعفت قيمة الجنيه أمام عملتهم قبل أن يرسلوا. ما الذي يحدث للمبلغ الذي يحتاجون إرساله؟",
              },
              options: [
                {
                  en: "They need to send more of their currency to deliver the same £500.",
                  ar: "يحتاجون إلى إرسال المزيد من عملتهم لتسليم ٥٠٠ جنيه نفسها.",
                },
                {
                  en: "They need to send less.",
                  ar: "يحتاجون إلى إرسال أقل.",
                },
                {
                  en: "Nothing changes, the amount is fixed.",
                  ar: "لا شيء يتغيّر، فالمبلغ ثابت.",
                },
              ],
              answer: 0,
              why: {
                en: "If the pound buys less foreign currency, it takes more foreign currency to buy the same pounds. Whoever is on the other side pays for that movement, not the transfer company. This is why “send £500” and “send an amount in their currency” behave differently.",
                ar: "إن اشترى الجنيه عملة أجنبية أقل، احتاج الأمر عملة أجنبية أكثر لشراء الجنيهات نفسها. ومن يقع على الطرف الآخر يدفع ثمن هذه الحركة، لا شركة التحويل. ولهذا يختلف سلوك «أرسل ٥٠٠ جنيه» عن «أرسل مبلغاً بعملتهم».",
              },
            },
            {
              k: "match",
              prompt: { en: "Match each term to what it means.", ar: "طابق كل مصطلح بمعناه." },
              pairs: [
                {
                  left: { en: "Spot rate", ar: "السعر الفوري" },
                  right: { en: "The rate for a conversion now", ar: "سعر التحويل الآن" },
                },
                {
                  left: { en: "Mid-market rate", ar: "سعر السوق الوسيط" },
                  right: { en: "The midpoint between buying and selling, before any mark-up", ar: "المنتصف بين الشراء والبيع، قبل أي هامش" },
                },
                {
                  left: { en: "Spread", ar: "الهامش" },
                  right: { en: "The gap between the rate you are offered and the mid-market rate", ar: "الفرق بين السعر المعروض عليك وسعر السوق الوسيط" },
                },
                {
                  left: { en: "Volatility", ar: "التقلّب" },
                  right: { en: "How much the rate moves around", ar: "مقدار تذبذب السعر" },
                },
              ],
            },
            {
              k: "fill",
              prompt: { en: "Complete the sentence.", ar: "أكمل الجملة." },
              before: {
                en: "The rate your provider shows is set by the market, but the rate you are given is",
                ar: "السعر الذي يعرضه مزوّدك تحدّده السوق، لكن السعر الذي تحصل عليه",
              },
              after: {
                en: "by the provider, which is where most of the real cost of a transfer hides.",
                ar: "يحدّده المزوّد، وهنا يختفي معظم التكلفة الحقيقية للتحويل.",
              },
              bank: [
                { en: "adjusted", ar: "يُعدَّل" },
                { en: "guaranteed", ar: "مضمون" },
                { en: "regulated", ar: "منظّم" },
              ],
              answer: ["adjusted"],
              why: {
                en: "The market rate is a fact. The rate you are offered is a commercial decision, and the difference between the two is revenue. That is why the next lesson is about reading both halves of the cost at once.",
                ar: "سعر السوق حقيقة. أما السعر المعروض عليك فقرار تجاري، والفرق بينهما إيراد. ولهذا يعنى الدرس التالي بقراءة شقّي التكلفة معاً.",
              },
            },
            {
              k: "scenario",
              prompt: {
                en: "Your family sends you £500 from another country each month. What determines how much you actually receive?",
                ar: "ترسل عائلتك ٥٠٠ جنيه شهرياً من بلد آخر. ما الذي يحدّد ما تستلمه فعلاً؟",
              },
              options: [
                {
                  label: { en: "Only the transfer fee.", ar: "الرسوم وحدها." },
                  outcome: {
                    en: "The fee is the smaller half. Providers advertise it precisely because it is easy to compare and easy to waive.",
                    ar: "الرسوم هي النصف الأصغر. ويعلن عنها المزوّدون تحديداً لأنها سهلة المقارنة وسهلة الإلغاء.",
                  },
                  delta: 0,
                },
                {
                  label: {
                    en: "The fee, the mark-up on the exchange rate, and where the rate sits that day.",
                    ar: "الرسوم والهامش على سعر الصرف وموقع السعر في ذلك اليوم.",
                  },
                  outcome: {
                    en: "That is the full picture. Two providers can both say “no fee” and deliver noticeably different amounts, because one is taking its margin out of the rate instead.",
                    ar: "هذه هي الصورة كاملة. قد يقول مزوّدان «بلا رسوم» ويسلّمان مبالغ مختلفة بوضوح، لأن أحدهما يأخذ هامشه من السعر بدلاً من ذلك.",
                  },
                  delta: 2,
                },
                {
                  label: { en: "The bank in your country decides the amount.", ar: "بنك بلدك هو من يحدّد المبلغ." },
                  outcome: {
                    en: "Banks are one kind of provider among many, and often an expensive one. Mobile and specialist transfer services are usually cheaper for regular small amounts.",
                    ar: "البنوك نوع من المزوّدين بين أنواع كثيرة، وغالباً من الأغلى. أما خدمات التحويل المتخصصة والتطبيقات فهي أرخص عادة للمبالغ الصغيرة المنتظمة.",
                  },
                  delta: 0,
                },
              ],
            },
          ],
          sources: [WORLD_SOURCES.boe, WORLD_SOURCES.bis, WORLD_SOURCES.ons],
        },

        /* ---------------------------------------------------------------- */
        {
          id: "international-transfers",
          title: { en: "The two halves of a transfer cost", ar: "شقّا تكلفة التحويل" },
          objective: {
            en: "Work out the true cost of a transfer when the fee is zero, and choose a provider on evidence.",
            ar: "احسب التكلفة الحقيقية للتحويل حين تكون الرسوم صفراً، واختر مزوّداً بناءً على الدليل.",
          },
          minutes: 9,
          xp: 150,
          relevance: {
            en: "“No fees” is the most common advertising line in remittances and it can be literally true and still the most expensive option available. Learning to compare the total amount received, rather than the fee, is the single most valuable habit in this pathway.",
            ar: "«بلا رسوم» أشهر عبارة إعلانية في تحويلات المغتربين، وقد تكون صحيحة حرفياً ومع ذلك الأغلى المتاح. وتعلّم مقارنة المبلغ الصافي المستلم، لا الرسوم، هو أنفع عادة في هذا المسار.",
          },
          steps: [
            {
              k: "idea",
              title: { en: "The total delivered is the only number that matters", ar: "المبلغ الصافي المستلم هو الرقم الوحيد المهم" },
              body: {
                en: "Every transfer has a cost made of two parts: a stated fee, and the margin the provider builds into the exchange rate. The second part is invisible unless you look up the mid-market rate for comparison. The only figure that compares two providers fairly is the amount that lands in the recipient's account.",
                ar: "لكل تحويل تكلفة من شقّين: رسم معلن، وهامش يضيفه المزوّد إلى سعر الصرف. والشق الثاني غير مرئي ما لم تقارن بسعر السوق الوسيط. والرقم الوحيد الذي يقارن بين مزوّدين بعدل هو المبلغ الذي يصل إلى حساب المستلم.",
              },
              points: [
                {
                  en: "A £0 fee funded by a 3% worse rate is more expensive than a £3 fee at the mid-market rate on most amounts.",
                  ar: "رسوم صفرية يعوّضها سعر أسوأ بـ٣٪ أغلى من رسوم ٣ جنيهات بسعر السوق الوسيط في معظم المبالغ.",
                },
                {
                  en: "Speed, traceability and what happens if something goes wrong are real differences between providers, and worth paying something for.",
                  ar: "السرعة وإمكانية التتبّع وما يحدث عند الخطأ فروق حقيقية بين المزوّدين، وتستحق دفع شيء مقابلها.",
                },
                {
                  en: "A swap between two people who each want the other's currency removes the market from the transaction entirely, but carries its own risks and has no protection.",
                  ar: "المقايضة بين شخصين يريد كل منهما عملة الآخر تُخرج السوق من المعادلة تماماً، لكنها تحمل مخاطرها الخاصة وبلا أي حماية.",
                },
              ],
            },
            {
              k: "example",
              title: { en: "Three providers, £500, same day", ar: "ثلاثة مزوّدون، ٥٠٠ جنيه، اليوم نفسه" },
              setup: {
                en: "All three advertise no transfer fee. The mid-market rate that day is 1.20. Figures are illustrative of a real pattern.",
                ar: "الثلاثة يعلنون عدم وجود رسوم تحويل. وسعر السوق الوسيط ذلك اليوم ١٫٢٠. والأرقام توضيحية لنمط واقعي.",
              },
              rows: [
                {
                  label: { en: "Provider A: rate 1.20, fee £0", ar: "المزوّد (أ): السعر ١٫٢٠، رسوم ٠" },
                  value: {
                    en: "Delivers the full amount. This is what the mid-market rate looks like when nothing is taken.",
                    ar: "يسلّم المبلغ كاملاً. هكذا يبدو سعر السوق الوسيط حين لا يُؤخذ شيء.",
                  },
                },
                {
                  label: { en: "Provider B: rate 1.176, fee £0", ar: "المزوّد (ب): السعر ١٫١٧٦، رسوم ٠" },
                  value: {
                    en: "2% worse on the rate. On £500 that is about £10 taken, and the receipt says the fee was zero.",
                    ar: "سعر أسوأ بـ٢٪. على ٥٠٠ جنيه هذا نحو ١٠ جنيهات مأخوذة، والإيصال يقول إن الرسوم صفر.",
                  },
                },
                {
                  label: { en: "Provider C: rate 1.20, fee £8", ar: "المزوّد (ج): السعر ١٫٢٠، رسوم ٨" },
                  value: {
                    en: "Honest and comparable. £8 is £8, and you can see it on the receipt.",
                    ar: "صادق وقابل للمقارنة. ٨ جنيهات هي ٨ جنيهات، وتراها على الإيصال.",
                  },
                },
              ],
              takeaway: {
                en: "B looks cheapest and is the most expensive. C looks worst and is better than B. The fee column cannot tell you this, and the delivered-amount column can.",
                ar: "يبدو (ب) الأرخص وهو الأغلى. ويبدو (ج) الأسوأ وهو أفضل من (ب). وعمود الرسوم لا يخبرك بهذا، أما عمود المبلغ المستلم فيخبرك.",
              },
            },
            {
              k: "categorise",
              prompt: {
                en: "Sort each cost into how visible it is.",
                ar: "صنّف كل تكلفة بحسب مدى ظهورها.",
              },
              buckets: [
                {
                  name: { en: "Visible on the receipt", ar: "ظاهرة على الإيصال" },
                  items: [
                    { en: "A flat transfer fee", ar: "رسم تحويل ثابت" },
                    { en: "A card payment surcharge", ar: "رسوم إضافية على الدفع بالبطاقة" },
                  ],
                },
                {
                  name: { en: "Hidden in the rate", ar: "مخفية في السعر" },
                  items: [
                    { en: "A mark-up over the mid-market rate", ar: "هامش فوق سعر السوق الوسيط" },
                    { en: "A “commission-free” conversion", ar: "تحويل «بلا عمولة»" },
                    { en: "A weekend rate applied while markets are shut", ar: "سعر نهاية الأسبوع بينما الأسواق مغلقة" },
                  ],
                },
              ],
            },
            {
              k: "order",
              prompt: {
                en: "Put the steps of a cross-border transfer in order.",
                ar: "رتّب خطوات التحويل الدولي.",
              },
              items: [
                { en: "You check the mid-market rate", ar: "تتحقق من سعر السوق الوسيط" },
                { en: "You compare the amount each provider would deliver", ar: "تقارن المبلغ الذي سيسلّمه كل مزوّد" },
                { en: "The provider converts your money at its own rate", ar: "يحوّل المزوّد مالك بسعره الخاص" },
                { en: "The money is sent through the payment system", ar: "يُرسل المال عبر نظام المدفوعات" },
                { en: "The recipient's bank receives it, possibly less its own charge", ar: "يستلمه بنك المستلم، وربما ناقصاً رسمه" },
              ],
              why: {
                en: "The last step is the one people forget. A receiving bank can levy its own charge, which means the amount sent and the amount received are not always the same, and comparing providers only on what they send can mislead.",
                ar: "الخطوة الأخيرة هي التي ينساها الناس. قد يفرض بنك المستلم رسماً خاصاً به، أي أن المبلغ المُرسل والمبلغ المستلم لا يتساويان دائماً، ومقارنة المزوّدين بما يرسلونه فقط قد تضلّل.",
              },
            },
            {
              k: "choice",
              prompt: {
                en: "A provider advertises “zero fees, always”. What is the accurate reading?",
                ar: "يعلن مزوّد «بلا رسوم دائماً». ما القراءة الدقيقة؟",
              },
              options: [
                {
                  en: "The transfer is genuinely free to you.",
                  ar: "التحويل مجاني فعلاً بالنسبة لك.",
                },
                {
                  en: "The fee is zero, so the provider's revenue must come from the exchange rate it sets.",
                  ar: "الرسوم صفر، إذاً إيراد المزوّد لا بد أن يأتي من سعر الصرف الذي يحدّده.",
                },
                {
                  en: "It is a scam.",
                  ar: "إنها عملية احتيال.",
                },
              ],
              answer: 1,
              why: {
                en: "A provider has to be paid somehow. Zero fee is not a scam and not charity, it is a pricing choice, and the margin moves to the rate. Compare the delivered amount, not the fee.",
                ar: "لابد أن يُدفع للمزوّد بطريقة ما. الرسوم الصفرية ليست احتيالاً ولا عملاً خيرياً، بل خيار تسعيري، وينتقل الهامش إلى السعر. قارن المبلغ المستلم لا الرسوم.",
              },
            },
            {
              k: "scenario",
              prompt: {
                en: "You send money home every month. Provider X is instant and takes £12 in total. Provider Y is free and takes £10 hidden in the rate but lands in two days. Which is the better decision?",
                ar: "ترسل مالاً إلى وطنك كل شهر. المزوّد (س) فوري وتكلفته الإجمالية ١٢ جنيهاً. والمزوّد (ص) مجاني ويكلّفك ١٠ جنيهات مخفية في السعر لكنه يصل في يومين. أي القرارين أفضل؟",
              },
              options: [
                {
                  label: { en: "Always Y, it is cheaper.", ar: "دائماً (ص)، فهو أرخص." },
                  outcome: {
                    en: "Probably right for a regular transfer with no deadline, but “cheaper by 20p on £500” is not automatically worth two days if the money is needed now.",
                    ar: "صحيح على الأرجح لتحويل منتظم بلا موعد، لكن «أرخص بعشرين قرشاً على ٥٠٠ جنيه» لا يستحق يومين تلقائياً إن كان المال مطلوباً الآن.",
                  },
                  delta: 1,
                },
                {
                  label: {
                    en: "It depends on whether the two days matter, and on how much £2 is worth to you that month.",
                    ar: "يتوقف على ما إذا كان اليومان يهمّان، وعلى قيمة الجنيهين لك ذلك الشهر.",
                  },
                  outcome: {
                    en: "That is the honest answer. The comparison is arithmetic, but the choice is not: speed, certainty and the amount at stake all belong in it. Comparing the delivered amount tells you the price, and only you can price the wait.",
                    ar: "هذا هو الجواب الصادق. المقارنة حسابية، لكن الاختيار ليس كذلك: السرعة واليقين وحجم المبلغ كلها داخلة فيه. ومقارنة المبلغ المستلم تخبرك بالسعر، وأنت وحدك من يقدّر قيمة الانتظار.",
                  },
                  delta: 2,
                },
                {
                  label: { en: "Always X, because it is faster.", ar: "دائماً (س)، لأنه أسرع." },
                  outcome: {
                    en: "Speed is worth something, but paying a premium every month for speed you do not use is just a higher price.",
                    ar: "السرعة تساوي شيئاً، لكن دفع علاوة شهرياً مقابل سرعة لا تستخدمها ليس إلا سعراً أعلى.",
                  },
                  delta: 0,
                },
              ],
            },
          ],
          sources: [WORLD_SOURCES.worldBank, WORLD_SOURCES.bis, WORLD_SOURCES.fcaFinancialCrime],
        },

        /* ---------------------------------------------------------------- */
        {
          id: "international-holding",
          title: { en: "Holding two currencies", ar: "حمل عملتين" },
          objective: {
            en: "Identify when you are exposed to currency risk without ever trading currency, and know what a hedge does.",
            ar: "حدّد متى تكون معرّضاً لمخاطر العملة دون أن تتداولها، واعرف ما تفعله التحوّطات.",
          },
          minutes: 8,
          xp: 140,
          relevance: {
            en: "Currency risk does not require you to trade currencies. It only requires your income and your obligations to be in different ones, which is ordinary for international students and for anyone supporting family abroad.",
            ar: "مخاطر العملة لا تتطلب أن تتداول العملات، بل يكفي أن يكون دخلك والتزاماتك بعملات مختلفة، وهو أمر عادي للطلاب الدوليين ولكل من يعيل عائلة في الخارج.",
          },
          steps: [
            {
              k: "idea",
              title: { en: "Exposure is about mismatch, not activity", ar: "التعرّض يتعلق بالاختلال لا بالنشاط" },
              body: {
                en: "You are exposed to a currency when something you must pay or receive is in it. If your fees are in pounds and your family's support comes from another currency, the exchange rate is part of your budget whether or not you ever open a trading app.",
                ar: "تكون معرّضاً لعملة حين يكون شيء يجب أن تدفعه أو تستقبله بها. فإن كانت رسومك بالجنيه ودعم عائلتك بعملة أخرى، فسعر الصرف جزء من ميزانيتك سواء فتحت تطبيق تداول أم لا.",
              },
              points: [
                {
                  en: "Currency movement is two-sided. The move that hurts you as a payer helps you as a recipient, which is why the same news is good for some students and bad for others.",
                  ar: "حركة العملة ذات وجهين. ما يؤذيك كدافع ينفعك كمستلم، ولهذا يكون الخبر نفسه جيداً لطلاب وسيئاً لآخرين.",
                },
                {
                  en: "A natural hedge is when you already hold both sides: some income in the currency you spend in reduces the mismatch without any financial product.",
                  ar: "التحوّط الطبيعي هو أن تملك الطرفين أصلاً: دخل جزئي بالعملة التي تنفق بها يقلّل الاختلال دون أي منتج مالي.",
                },
              ],
            },
            {
              k: "example",
              title: { en: "The same rate move, two students", ar: "الحركة نفسها، طالبان" },
              setup: {
                en: "The pound strengthens against another currency. Both students live in the UK. The rate move is identical.",
                ar: "يرتفع الجنيه أمام عملة أخرى. الطالبان يعيشان في بريطانيا. وحركة السعر واحدة.",
              },
              rows: [
                {
                  label: { en: "Student A supported from abroad", ar: "الطالب (أ) يتلقى دعماً من الخارج" },
                  value: {
                    en: "The same amount in the other currency converts to fewer pounds. Their UK budget shrinks without anyone changing the amount sent.",
                    ar: "المبلغ نفسه بالعملة الأخرى يُحوَّل إلى جنيهات أقل. ميزانيته في بريطانيا تنكمش دون أن يغيّر أحد المبلغ المرسل.",
                  },
                },
                {
                  label: { en: "Student B earning in pounds, paying fees abroad", ar: "الطالب (ب) يكسب بالجنيه ويدفع رسوماً بالخارج" },
                  value: {
                    en: "The same pounds now cover more of the foreign bill. Their position improves for the same reason A's worsened.",
                    ar: "الجنيهات نفسها تغطي الآن جزءاً أكبر من الفاتورة الأجنبية. وتتحسّن حاله للسبب نفسه الذي سوّأ حال (أ).",
                  },
                },
                {
                  label: { en: "Student C earning and spending in pounds", ar: "الطالب (ج) يكسب وينفق بالجنيه" },
                  value: {
                    en: "No direct effect. Not every student is exposed, and assuming everyone is would be as wrong as assuming nobody is.",
                    ar: "لا أثر مباشر. ليس كل طالب معرّضاً، والافتراض بأن الجميع معرّض خطأ كالافتراض بأن لا أحد معرّض.",
                  },
                },
              ],
              takeaway: {
                en: "Exposure is personal. The question is never “what is the pound doing” but “what am I holding, and what do I have to pay”.",
                ar: "التعرّض شخصي. والسؤال ليس «ماذا يفعل الجنيه» بل «ماذا أملك وماذا يجب أن أدفع».",
              },
            },
            {
              k: "choice",
              prompt: {
                en: "Who is exposed to the pound–rupee rate?",
                ar: "من المعرّض لسعر صرف الجنيه مقابل الروبية؟",
              },
              options: [
                {
                  en: "Only people who trade currency.",
                  ar: "فقط من يتداول العملات.",
                },
                {
                  en: "Anyone whose income and outgoings are in different currencies, whether or not they trade.",
                  ar: "كل من دخله ونفقاته بعملات مختلفة، سواء تداول أم لا.",
                },
                {
                  en: "Only large companies.",
                  ar: "الشركات الكبرى فقط.",
                },
              ],
              answer: 1,
              why: {
                en: "A student receiving support from abroad is running an unhedged currency position of several thousand pounds a year without ever making a trade. That is the point of the lesson.",
                ar: "الطالب الذي يتلقى دعماً من الخارج يدير مركزاً بالعملة غير محوّط بآلاف الجنيهات سنوياً دون أن ينفّذ أي صفقة. وهذه خلاصة الدرس.",
              },
            },
            {
              k: "fill",
              prompt: { en: "Complete the sentence about hedging.", ar: "أكمل الجملة عن التحوّط." },
              before: {
                en: "Hedging does not remove the risk, it",
                ar: "التحوّط لا يزيل المخاطرة، بل",
              },
              after: {
                en: "which means you give up the chance of a favourable move to avoid the unfavourable one.",
                ar: "أي أنك تتخلى عن فرصة الحركة المواتية لتتجنّب الحركة غير المواتية.",
              },
              bank: [
                { en: "fixes a price now", ar: "يثبّت سعراً الآن" },
                { en: "doubles your money", ar: "يضاعف مالك" },
                { en: "removes all fees", ar: "يزيل كل الرسوم" },
              ],
              answer: ["fixes a price now"],
              why: {
                en: "That symmetry is why hedging is a budgeting decision rather than an investment one. You are buying certainty, and certainty has a price. For a student with a fixed bill in three months, fixing the rate is often the boring and correct answer.",
                ar: "هذا التماثل هو ما يجعل التحوّط قراراً متعلقاً بالميزانية لا بالاستثمار. أنت تشتري يقيناً، ولليقين ثمن. ولطالب له فاتورة ثابتة بعد ثلاثة أشهر، تثبيت السعر هو الجواب المملّ والصحيح غالباً.",
              },
            },
            {
              k: "match",
              prompt: { en: "Match each term to what it describes.", ar: "طابق كل مصطلح بما يصفه." },
              pairs: [
                {
                  left: { en: "Currency risk", ar: "مخاطر العملة" },
                  right: { en: "The rate moving while you hold a mismatch", ar: "تحرّك السعر أثناء حملك اختلالاً" },
                },
                {
                  left: { en: "Natural hedge", ar: "التحوّط الطبيعي" },
                  right: { en: "Earning in the currency you spend in", ar: "الكسب بالعملة التي تنفق بها" },
                },
                {
                  left: { en: "Hedging", ar: "التحوّط" },
                  right: { en: "Fixing a rate now to remove the uncertainty", ar: "تثبيت السعر الآن لإزالة عدم اليقين" },
                },
                {
                  left: { en: "Speculation", ar: "المضاربة" },
                  right: { en: "Taking on a currency position you did not already need", ar: "اتخاذ مركز بالعملة لم تكن بحاجه إليه" },
                },
              ],
            },
            {
              k: "scenario",
              prompt: {
                en: "You have a £9,000 tuition bill due in three months, paid from savings held in another currency. What is the sensible thing to understand?",
                ar: "عليك فاتورة رسوم بقيمة ٩٠٠٠ جنيه بعد ثلاثة أشهر، تُدفع من مدخرات بعملة أخرى. ما المعقول أن تفهمه؟",
              },
              options: [
                {
                  label: {
                    en: "“My bill is £9,000, so my risk is £9,000.”",
                    ar: "«فاتورتي ٩٠٠٠ جنيه، فمخاطرتي ٩٠٠٠ جنيه.»",
                  },
                  outcome: {
                    en: "The bill is fixed; the cost to you is not. If your currency weakens 5% in three months you need about £450 more, and the bill on the letter has not changed at all.",
                    ar: "الفاتورة ثابتة، أما كلفتها عليك فليست ثابتة. فإن ضعفت عملتك ٥٪ في ثلاثة أشهر فستحتاج نحو ٤٥٠ جنيهاً أكثر، والفاتورة المدوّنة لم تتغيّر إطلاقاً.",
                  },
                  delta: 0,
                },
                {
                  label: {
                    en: "“What I owe is fixed in pounds, but what it costs me is not, so the timing of the conversion is a real decision.”",
                    ar: "«ما عليّ ثابت بالجنيه، أما كلفته عليّ فليست ثابتة، فموعد التحويل قرار حقيقي.»",
                  },
                  outcome: {
                    en: "Exactly right, and it is a decision most people make by accident: they convert when the bill falls due. Deciding deliberately, including possibly fixing part of it early, is the whole of currency management for someone in your position.",
                    ar: "صحيح تماماً، وهو قرار يتخذه معظم الناس بالمصادفة: يحوّلون حين يحل موعد الفاتورة. والبتّ فيه عن قصد، بما في ذلك تثبيت جزء منه مبكراً، هو كل ما يمكن فعله في إدارة العملة لمن هم في وضعك.",
                  },
                  delta: 2,
                },
                {
                  label: { en: "“I should buy more of the other currency to profit from the move.”", ar: "«ينبغي أن أشتري المزيد من العملة الأخرى لأربح من الحركة.»" },
                  outcome: {
                    en: "That turns a budgeting problem into a bet, and now you have two risks instead of one. Speculating to cover a bill you must pay is how a manageable position becomes an unmanageable one.",
                    ar: "هذا يحوّل مسألة ميزانية إلى رهان، وتصبح لديك مخاطرتان بدل واحدة. والمضاربة لتغطية فاتورة واجبة هي كيف يتحوّل مركز يمكن إدارته إلى مركز لا يمكن إدارته.",
                  },
                  delta: 0,
                },
              ],
            },
          ],
          sources: [WORLD_SOURCES.boe, WORLD_SOURCES.ecb, WORLD_SOURCES.bis],
        },

        /* ---------------------------------------------------------------- */
        {
          id: "international-investing",
          title: { en: "Investing across borders", ar: "الاستثمار عبر الحدود" },
          objective: {
            en: "Tell a company's risk apart from a currency's risk, and know what a global fund already holds.",
            ar: "ميّز بين مخاطر الشركة ومخاطر العملة، واعرف ما يحمله الصندوق العالمي أصلاً.",
          },
          minutes: 9,
          xp: 160,
          relevance: {
            en: "Most students who invest at all do it through a global tracker, which already means taking on a dozen currencies without a decision ever being made about them. Knowing what the fund holds, and which risks are the company's rather than the exchange rate's, is what makes that a choice instead of a default.",
            ar: "معظم الطلاب الذين يستثمرون يفعلون ذلك عبر صندوق عالمي متتبّع، وهذا يعني أصلاً التعرّض لعشرات العملات دون أي قرار يُتخذ بشأنها. ومعرفة ما يحمله الصندوق، وأي المخاطر يعود للشركة وأيّها لسعر الصرف، هو ما يجعل ذلك اختياراً لا افتراضاً.",
          },
          steps: [
            {
              k: "idea",
              title: { en: "Two risks wearing one coat", ar: "مخاطرتان في معطف واحد" },
              body: {
                en: "Buying a foreign share gives you two separate things: the performance of the company in its own currency, and the performance of that currency against yours. Either can help or hurt, and they can cancel each other out, which is why the result is often less dramatic than either component.",
                ar: "شراء سهم أجنبي يمنحك أمرين منفصلين: أداء الشركة بعملتها، وأداء تلك العملة مقابل عملتك. وكل منهما قد ينفع أو يضر، وقد يتلاشى أحدهما بالآخر، ولهذا تكون النتيجة غالباً أقل دراماتيكية من أي من المكوّنين.",
              },
              points: [
                {
                  en: "Currency exposure in a global fund is not a strategy you chose. It arrives bundled, and it is one of the largest sources of short-term movement in a global portfolio.",
                  ar: "التعرّض للعملات في الصندوق العالمي ليس استراتيجية اخترتها، بل يأتي مرافقاً، وهو من أكبر مصادر التحرّك قصير الأجل في المحفظة العالمية.",
                },
                {
                  en: "Over long periods currencies have tended to be roughly a wash against each other, but the period a student's money is invested for is not necessarily long.",
                  ar: "على المدى الطويل تميل العملات إلى التعادل تقريباً، لكن المدة التي يُستثمر فيها مال الطالب ليست طويلة بالضرورة.",
                },
                {
                  en: "A global tracker already holds most of the world's listed companies by value. Adding a single-country or emerging-markets fund is a deliberate narrowing, not a way of “getting more international”.",
                  ar: "الصندوق العالمي المتتبّع يحمل أصلاً معظم شركات العالم المدرجة بالقيمة. وإضافة صندوق لبلد واحد أو للأسواق الناشئة هو تضييق متعمّد، لا وسيلة لـ«زيادة العالمية».",
                },
              ],
            },
            {
              k: "example",
              title: { en: "Same company, two currencies", ar: "الشركة نفسها، عملتان" },
              setup: {
                en: "A UK investor holds a US company and a UK company. Both companies do equally well in their own terms.",
                ar: "مستثمر بريطاني يحمل شركة أمريكية وشركة بريطانية. أداء الشركتين متساوٍ بعملتهما.",
              },
              rows: [
                {
                  label: { en: "The US company, no currency move", ar: "الشركة الأمريكية بلا حركة عملة" },
                  value: {
                    en: "You get exactly the company's return. Nothing has been added or taken away.",
                    ar: "تحصل على عائد الشركة تماماً. لم يُضف شيء ولم يُنقص.",
                  },
                },
                {
                  label: { en: "The US company, dollar falls 5% against the pound", ar: "الشركة الأمريكية والدولار يهبط ٥٪ أمام الجنيه" },
                  value: {
                    en: "Your profit in dollars is worth about 5% less when converted. A good company became a poor result.",
                    ar: "ربحك بالدولار يساوي نحو ٥٪ أقل عند التحويل. شركة جيدة تحوّلت إلى نتيجة سيئة.",
                  },
                },
                {
                  label: { en: "A UK company in a global fund", ar: "شركة بريطانية في صندوق عالمي" },
                  value: {
                    en: "A UK investor in a global tracker usually has roughly 40% or more in a handful of foreign currencies before making any decision at all.",
                    ar: "المستثمر البريطاني في صندوق عالمي متتبّع يحمل عادة نحو ٤٠٪ أو أكثر بعملات أجنبية قليلة قبل أن يتخذ أي قرار.",
                  },
                },
              ],
              takeaway: {
                en: "The company's return and your return are not the same number. The gap is the currency, and it is not a rounding error.",
                ar: "عائد الشركة وعائدك ليسا الرقم نفسه. والفارق هو العملة، وهو ليس خطأ تقريب.",
              },
            },
            {
              k: "categorise",
              prompt: {
                en: "Sort each risk by where it comes from.",
                ar: "صنّف كل خطر بحسب مصدره.",
              },
              buckets: [
                {
                  name: { en: "The company's risk", ar: "خطر الشركة" },
                  items: [
                    { en: "Its products stop selling", ar: "توقّف منتجاتها عن البيع" },
                    { en: "Its management makes a bad acquisition", ar: "قيام إدارتها باستحواذ سيئ" },
                    { en: "A regulator fines it", ar: "تغريم جهة تنظيمية لها" },
                  ],
                },
                {
                  name: { en: "The currency's risk", ar: "خطر العملة" },
                  items: [
                    { en: "The rate moves after you buy", ar: "تحرّك السعر بعد شرائك" },
                    { en: "Your country's interest rate changes", ar: "تغيّر سعر الفائدة في بلدك" },
                  ],
                },
              ],
            },
            {
              k: "choice",
              prompt: {
                en: "What does a global tracker fund already give you?",
                ar: "ما الذي يمنحك إيّاه الصندوق العالمي المتتبّع أصلاً؟",
              },
              options: [
                {
                  en: "Only UK companies.",
                  ar: "شركات بريطانية فقط.",
                },
                {
                  en: "Thousands of companies across many countries, and exposure to their currencies.",
                  ar: "آلاف الشركات في بلدان كثيرة، وتعرّضاً لعملاتها.",
                },
                {
                  en: "Protection from currency risk.",
                  ar: "حماية من مخاطر العملة.",
                },
              ],
              answer: 1,
              why: {
                en: "A global fund is international by default. That is also why adding an emerging-markets fund is a bet on a specific slice, and why it is a change in risk rather than an addition of diversification.",
                ar: "الصندوق العالمي دولي بشكل افتراضي. ولهذا أيضاً تكون إضافة صندوق للأسواق الناشئة رهاناً على شريحة محدّدة، ولهذا تكون تغييراً في المخاطر لا إضافة للتنويع.",
              },
            },
            {
              k: "fill",
              prompt: { en: "Complete the sentence about currency in portfolios.", ar: "أكمل الجملة عن العملات في المحافظ." },
              before: {
                en: "Currency movement is a large part of a global fund's short-term return, which is why the fund's own factsheet",
                ar: "حركة العملة جزء كبير من عائد الصندوق العالمي قصير الأجل، ولهذا فإن ورقة بيانات الصندوق",
              },
              after: {
                en: "its currency exposure, not just its countries.",
                ar: "تعرّضه للعملات، لا لبلدانها فقط.",
              },
              bank: [
                { en: "has to disclose", ar: "يجب أن تفصح عن" },
                { en: "ignores", ar: "تتجاهل" },
                { en: "guarantees", ar: "تضمن" },
              ],
              answer: ["has to disclose"],
              why: {
                en: "Reading the currency breakdown turns an abstract worry into a number you can see. It also usually shows concentration you did not expect, because a handful of currencies dominate global markets.",
                ar: "قراءة توزيع العملات تحوّل القلق المجرّد إلى رقم تراه. وهي تُظهر عادة تركّزاً لم تتوقّعه، لأن عدداً قليلاً من العملات يسيطر على الأسواق العالمية.",
              },
            },
            {
              k: "scenario",
              prompt: {
                en: "You hold a global tracker and a friend says you should add an emerging-markets fund “to be more diversified”. What is the accurate response?",
                ar: "تحمل صندوقاً عالمياً متتبّعاً ويقول لك صديق إن عليك إضافة صندوق للأسواق الناشئة «لتزيد التنويع». ما الردّ الدقيق؟",
              },
              options: [
                {
                  label: { en: "“Good idea, more countries means less risk.”", ar: "«فكرة جيدة، بلدان أكثر تعني مخاطرة أقل.»" },
                  outcome: {
                    en: "More countries is not less risk. Emerging markets are more volatile, and the global tracker already holds some of them, so the effect is to concentrate rather than to spread.",
                    ar: "بلدان أكثر لا تعني مخاطرة أقل. فالأسواق الناشئة أكثر تقلّباً، والصندوق العالمي يحمل بعضها أصلاً، فالأثر تركيز لا توزيع.",
                  },
                  delta: 0,
                },
                {
                  label: {
                    en: "“The global fund already holds emerging markets, so this would be a deliberate bet on that part of the world.”",
                    ar: "«الصندوق العالمي يحمل أسواقاً ناشئة أصلاً، فسيكون هذا رهاناً متعمّداً على ذلك الجزء من العالم.»",
                  },
                  outcome: {
                    en: "That is the accurate reading. It may still be what you want, but it is a change in what you are betting on, not a free improvement in diversification.",
                    ar: "هذه هي القراءة الدقيقة. وقد يكون هذا ما تريده فعلاً، لكنه تغيير في موضوع رهانك، لا تحسين مجاني في التنويع.",
                  },
                  delta: 2,
                },
                {
                  label: { en: "“Never invest outside your own country.”", ar: "«لا تستثمر خارج بلدك أبداً.»" },
                  outcome: {
                    en: "That is the opposite error. It concentrates everything in one economy and one currency, which is the exposure you were trying to manage in the first place.",
                    ar: "هذا هو الخطأ المعاكس. فهو يركّز كل شيء في اقتصاد واحد وعملة واحدة، وهو التعرّض الذي كنت تحاول إدارته أساساً.",
                  },
                  delta: 0,
                },
              ],
            },
          ],
          sources: [WORLD_SOURCES.bis, WORLD_SOURCES.federalReserve, WORLD_SOURCES.ecb],
        },
      ],
    },
  ],
};
