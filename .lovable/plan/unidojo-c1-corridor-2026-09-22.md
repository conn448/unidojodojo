# UniDojo C1 — Corridor

## Outcome
Rebuild the current prototype as a mobile-first bilingual learning app. Students can try one complete lesson anonymously, switch between English and Arabic, join societies, create an account to save progress, and manage their data.

Arabic content will ship as polished draft copy clearly marked for native-speaker review before public release.

## Product structure
- Replace the embedded prototype with native app screens and reusable interface pieces.
- Add routes for language selection, onboarding, account access, home, topics, lessons, quizzes, results, societies, leaderboards, profile, settings, feedback, privacy, and error states.
- Keep lesson interactions varied—tap, swipe, sort, match, order, and sliders—without belts, battles, missions, XP, or an economy.
- Let anonymous students finish one lesson and quiz, then offer account creation to save progress.
- Add a persistent, easy-to-grab scrollbar where lesson content scrolls.

## Brand, language, and accessibility
- Implement the exact Indigo Night, Amber Sand, and Mint Signal system through semantic design tokens; Mint only communicates success or live status.
- Use the specified warm geometric display face, readable Latin body face, and a dedicated Arabic typeface.
- Build both LTR and native RTL layouts from locale files, logical spacing, mirrored directional icons, and document-level direction changes.
- Create the Dojo red-panda mascot as a compact custom vector set for onboarding, loading, completion, empty states, encouragement, and errors—never as a game mechanic.
- Add the structural pattern, paper texture, restrained motion, visible focus, 44px targets, keyboard support, reduced-motion behavior, loading skeletons, and complete empty/error/success states.

## Learning and content
- Build Money Basics, Islamic Finance, and Student Life tracks with language filters, lesson duration, lock state, and completion indicators.
- Add one-concept lesson steps, 3–5 question quizzes, immediate explanatory feedback, results, next-lesson flow, result sharing, and WhatsApp sharing.
- Draft English and Modern Standard Arabic locale content separately rather than translating strings inside components.
- Include educational-only wording, source citations, reviewer credit fields, and a clear not-financial-advice notice for Islamic-finance lessons.

## Accounts, societies, and data
- Enable Lovable Cloud for authentication, database, and storage.
- Add email magic links plus managed Google and Apple sign-in; keep the anonymous lesson available without an account.
- Store profiles, language and accessibility preferences, topic interests, society membership, lesson progress, quiz answers, consent-safe engagement events, and feedback.
- Add society creation/join codes, crest support, aggregate weekly progress, opt-in first-name leaderboards, and share-kit controls.
- Add plain-language bilingual privacy controls, one-tap data export, account deletion, and logout.
- Protect all student-owned records with row-level access rules; roles remain in a separate roles table.

## Technical details
- Use TanStack routes and native React components rather than an embedded HTML document.
- Use JSON locale files (`en.json`, `ar.json`) for all visible copy.
- Define the data model with explicit grants and row-level policies for profiles, societies, memberships, lesson progress, quiz answers, feedback, events, and user roles.
- Keep public content readable anonymously while all private writes and reads validate the signed-in student on the server.
- Add analytics events for the specified learning, language, society, sharing, and feedback actions without collecting financial-account data.
- Add unique bilingual metadata to each content route, including language alternates where appropriate.

## Verification
- Test the anonymous journey from language choice through lesson, quiz, result, and share at the 390px target.
- Test every route in English LTR and Arabic RTL, plus keyboard navigation and reduced motion.
- Test account saving, society create/join, leaderboard opt-in, profile updates, export, deletion, and sign-out.
- Check contrast, tap targets, overflow, empty/loading/error/success states, preview errors, and mobile performance/accessibility targets.
