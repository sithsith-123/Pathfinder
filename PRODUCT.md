# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Cambodian high-school students in the situation of choosing a university major. They take the assessment alone, self-serve, in one sitting of about 4–6 minutes.

## Product Purpose

PATHFINDER helps those students understand their interests and find university majors and career paths that fit them, through a structured 20-question assessment. The product exists to give Khmer-speaking students accessible career guidance at the moment they must choose a major. Success is a publicly launched site that real students take and retake over time.

## Positioning

A Khmer-first career-interest assessment built for Cambodian students, where the entire experience — questions, scoring explanation, major and career recommendations — is natively in Khmer rather than translated from an English tool. Its mechanism is a transparent six-dimension interest model (R/I/A/S/E/C) that scores answers in the browser and shows students both the result and the reasoning behind every recommendation.

## Operating Context

- Single-page Next.js flow: welcome → 20 questions (single/multi-select with validation, progress, back/close confirmation dialogs) → analysis interstitial → results → retake.
- Results include: six-dimension radar and percentages, top dimensions with explanations, 10 recommended majors, 10 recommended career paths, reasoning list, development opportunities, alternative paths, and a "Find Your Future University" section recommending Cambodian universities for the matched majors.
- Client-side only: scoring runs in the browser; no accounts, no backend, no persistence of answers.
- Content lives in static TypeScript files: `data/questions-km.ts` (20 Khmer questions), `data/majors.ts` (20 majors, Khmer + English names), `data/careers.ts` (20 careers, Khmer + English names).
- Deploy target decided: Vercel for the public site. Alternative build options remain in the repo but are not the chosen path: standalone Docker image (`Dockerfile`), static export (`npm run build:html`), and Cloudflare (`@opennextjs/cloudflare`, `wrangler`, `open-next.config.ts`; latest commit upgraded Next.js for Cloudflare compatibility).
- Tests: `npm test` (node:test via tsx) covering scoring (`lib/scoring.test.ts`).
- Repository: https://github.com/sithsith-123/Pathfinder

## Capabilities and Constraints

Confirmed functionality:

- 20-question assessment across six interest dimensions with per-option scores and trait tags.
- Score totals, normalization to 0–100 per dimension, profile summary, and ranked major/career matching (dimension weights + trait-tag overlap).
- Results presentation as listed under Operating Context, with retake and answer-preservation confirmations.
- "Find Your Future University" section on the results page: interest scores map to majors (`lib/interest-mapping.ts`, `matching-engine.js`), which match Cambodian universities offering those majors from `universities.json`, each with reasons, tuition fees, admission requirements, and alternative universities/related majors. Khmer throughout, university names in English + Khmer.
- Accessibility affordances already in code: `aria-*` attributes, `focus-visible` rings, Escape-to-close dialogs, semantic headings.

Constraints and explicitly undecided product facts:

- Khmer is the primary language (`lang="km"`); English appears only as secondary names on majors and careers.
- Framing constraints in current copy: no right/wrong answers; results are guidance, not a decision made for the student.
- Undecided: localization beyond Khmer; whether answers or results should ever persist; how the static major/career library will be maintained after launch.

## Brand Commitments

- Name: PATHFINDER (binding).
- Language: Khmer-first — Khmer is the primary and default language of the product; English is secondary only (binding).
- Voice (evident in shipped copy, to preserve): encouraging, non-judgmental, humble — guidance offered to the student, never a verdict about their future.

## Evidence on Hand

- Real content in the repo: 20 assessment questions (`data/questions-km.ts`), 20 majors (`data/majors.ts`), 20 careers (`data/careers.ts`), each with descriptions and reasons.
- University content: `universities.json` (Cambodian universities with locations, websites, faculties, majors, tuition, admission) plus `README-INTEGRATION.md` and `example-integration.html` documenting the university recommendation feature. No documented verification source for tuition/admission figures.
- No testimonials, user research data, press, institution partnerships, or outcome benchmarks exist. Future work must not fabricate any of these.

## Product Principles

1. Guidance, not verdicts — every recommendation shows its reasoning; the student keeps the decision.
2. Khmer-first — a student can complete the whole experience without English; English names are a bridge, not the interface.
3. One sitting, zero setup — the full assessment works with no accounts, no backend, and nothing to configure.
4. Honest matching — recommendations trace back to the scoring model and content library; no claim the app cannot support.
5. Built to stay public — ship and maintain a site real students can take and retake, not a demo.
