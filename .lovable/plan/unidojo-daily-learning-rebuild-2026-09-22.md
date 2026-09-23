# UniDojo Daily Learning Rebuild

## Goal
Turn UniDojo into a polished, motivating daily learning app: one comprehensive lesson and quiz per day, a focused vertical runway, meaningful rewards, and secure accounts.

## Experience
- Keep onboarding and make it a short, visual setup for language, confidence level, goals, university, and optional society code.
- Make `/home` a focused runway: daily streak, hearts, today’s lesson, completed and locked lesson nodes, daily puzzle, certificate milestone, and leaderboard preview.
- Expand lessons into short, varied sections with explanations, examples, interactive checks, mini-games, a final quiz, immediate feedback, and a clear completion celebration.
- Add one small rotating daily puzzle with a once-per-day completion state.
- Add chapter certificates, daily streak tracking, and opt-in leaderboards.
- Keep sign-in available through email, Google, and Apple, with a clear anonymous-first account offer.

## Visual direction
- White canvas with Midnight Indigo foundations, Saffron Amber primary actions, and Signal Mint only for success, completion, and live streak states.
- Archivo Black headings and Hind body text, with Noto Sans Arabic for Arabic.
- Match the selected focused mobile runway: large tactile lesson node, strong vertical path, compact reward counters, playful red-panda reactions, and crisp progress states.
- Add subtle press, progress, and celebration motion; respect reduced-motion preferences.
- Preserve English/Arabic directionality and the permanent lesson scrollbar.

## Technical details
- Extend the shared app state for sound preference, anonymous daily progress, streaks, hearts, puzzle completion, and certificate unlocks, persisted locally for signed-out learners.
- Reuse the existing Lovable Cloud tables for signed-in progress and account data; keep local fallback behavior so the core journey works without signing in.
- Add dedicated routes for the daily puzzle, leaderboard, and certificate so navigation and sharing remain reliable.
- Generate lightweight sound effects with the browser Audio API instead of purchasing or downloading audio assets.
- Keep the existing route-level metadata distinct and update it for all new pages.

## Verification
- Test onboarding, home runway, lesson and quiz completion, daily puzzle, certificate, leaderboard, sign-in controls, sound toggle, English/Arabic layout, mobile viewport, keyboard focus, reduced motion, and clean browser/build logs.
