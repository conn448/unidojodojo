/**
 * Finance Around the World.
 *
 * The optional pathways are listed here, apart from the core curriculum, so
 * "core" is defined by what is *not* in this file. The core journey is
 * `money`, `student` and `build`; it is the required path, and a learner can
 * ignore everything below and still finish UniDojo.
 *
 * Each pathway is a lens on how money works, not a position the app takes. The
 * copy explains a system and its trade-offs and leaves the judgement to the
 * reader. That is the whole point of the section: different financial systems
 * exist, and understanding them is not the same as endorsing them.
 *
 * ## Adding a pathway
 *
 * It is a data change, not a feature.
 *
 * 1. Write the track (see `./ethical.ts` for the shape) and import it in
 *    `../curriculum.ts`, adding it to `tracks` with `optional: true`.
 * 2. Add an entry below naming its id.
 *
 * The section, the cards and the track page all derive from this list, so
 * nothing else needs touching. No route, no component, no database change.
 * Anything not named here falls back into the core track grid, so a new track
 * can never silently disappear.
 */
import type { L } from "../curriculum";

export interface Pathway {
  id: string;
  /** Shown on the card in the Around the World section. */
  icon: string;
  /**
   * One or two sentences on what this lens covers. It describes the subject and
   * never recommends it, and it is shown above the lesson list.
   */
  note: L;
  /**
   * Tracks in this pathway, in display order. Every pathway is a single track
   * today, so a card links straight to it. A pathway that grows to hold more
   * than one track will need its own screen to list them.
   */
  trackIds: string[];
}

export const PATHWAYS: Pathway[] = [
  {
    id: "islamic",
    icon: "☪️",
    note: {
      en: "Islamic finance is a set of financial structures built to comply with Sharia. This pathway explains how the contracts work and how they behave in practice, including where scholars disagree. It is financial education, not religious instruction, and it issues no rulings.",
      ar: "التمويل الإسلامي مجموعة من الهياكل المالية المبنية على التوافق مع الشريعة. يشرح هذا المسار كيفية عمل العقود وسلوكها عملياً، بما في ذلك مواضع اختلاف العلماء. إنه تعليم مالي لا إرشاد ديني، ولا يصدر أحكاماً.",
    },
    trackIds: ["islamic"],
  },
  {
    id: "ethical",
    icon: "🌱",
    note: {
      en: "Ethical and sustainable finance is about how environmental, social and governance factors get taken into account when money is invested or lent. This pathway covers how it works, what the evidence says, and why reasonable people disagree about it. It does not tell you what to invest in.",
      ar: "التمويل الأخلاقي والمستدام يتعلق بكيفية مراعاة العوامل البيئية والاجتماعية والحوكمية عند استثمار المال أو إقراضه. يغطي هذا المسار كيفية عمله وما تقوله الأدلة ولماذا يختلف العقلاء حوله. وهو لا يملي عليك أين تستثمر.",
    },
    trackIds: ["ethical"],
  },
  {
    id: "international",
    icon: "🌎",
    note: {
      en: "Money behaves differently once it crosses a border. This pathway is about exchange rates, sending money home, holding more than one currency, and what changes when the financial system you grew up with is not the one you are living in.",
      ar: "يتصرف المال بشكل مختلف حين يعبر الحدود. يتناول هذا المسار أسعار الصرف، وإرسال المال إلى الوطن، وحمل أكثر من عملة، وما يتغيّر عندما لا يكون النظام المالي الذي نشأت عليه هو النظام الذي تعيش فيه.",
    },
    trackIds: ["international"],
  },
  {
    id: "community",
    icon: "🤝",
    note: {
      en: "Some financial institutions are owned by the people who use them rather than by outside shareholders. This pathway explains credit unions, mutuals, co-operatives and community investment, how they are governed, and where the model works well and where it struggles.",
      ar: "بعض المؤسسات المالية يملكها من يستخدمونها لا مساهمون خارجيون. يشرح هذا المسار الاتحادات الائتمانية والجمعيات التعاونية والاستثمار المجتمعي، وكيف تُدار، وأين ينجح النموذج وأين يتعثّر.",
    },
    trackIds: ["community"],
  },
];

/** The pathway a track belongs to, if it belongs to one. */
export function pathwayOf(trackId: string): Pathway | undefined {
  return PATHWAYS.find((pathway) => pathway.trackIds.includes(trackId));
}
