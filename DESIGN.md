---
name: PATHFINDER
description: Khmer-first career-interest assessment for Cambodian students — calm guidance, never verdicts.
colors:
  primary: "#172B4D"
  primary-hover: "#102545"
  accent: "#4779D1"
  accent-tint: "rgba(71, 121, 209, 0.1)"
  success: "#27845A"
  success-tint: "rgba(39, 132, 90, 0.1)"
  surface: "#F7F8FA"
  card: "#FFFFFF"
  text: "#202938"
  secondary: "#64748B"
  border: "#E5E9F0"
  focus-ring: "#BFDBFE"
  progress-track: "#E2E8F0"
typography:
  display:
    fontFamily: "'Noto Sans Khmer', 'Khmer OS System', 'Khmer Sangam MN', sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0em"
  headline:
    fontFamily: "'Noto Sans Khmer', 'Khmer OS System', 'Khmer Sangam MN', sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Noto Sans Khmer', 'Khmer OS System', 'Khmer Sangam MN', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0em"
  body:
    fontFamily: "'Noto Sans Khmer', 'Khmer OS System', 'Khmer Sangam MN', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "0em"
  label:
    fontFamily: "'Noto Sans Khmer', 'Khmer OS System', 'Khmer Sangam MN', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.2em"
rounded:
  xl: "12px"
  "2xl": "16px"
  section: "30px"
  full: "9999px"
spacing:
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "10px 16px"
  card-section:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.section}"
    padding: "24px"
  option-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "{rounded.2xl}"
    padding: "16px"
  chip-accent:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  chip-success:
    backgroundColor: "{colors.success-tint}"
    textColor: "{colors.success}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
---

# Design System: PATHFINDER

## Overview

**Creative North Star: "The Guidance Compass"**

PATHFINDER is a quiet guide that points the way without deciding for the student. The system is calm, reassuring, and structured: one centered column of white cards floating on a cool misty surface, pill-shaped controls that feel friendly rather than clinical, and generous leading that lets Khmer script breathe. Every screen answers the same need — a high-school student sitting alone with a consequential choice — so the design lowers pressure instead of raising it.

Density stays low and rhythm stays regular. Depth comes from a single ambient shadow rather than stacked layers; emphasis comes from weight and scale rather than decoration. Confirmed visual rejections: judgmental or high-pressure assessment styling, gamified flash (points, streaks, confetti), corporate-assessment coldness, gradients, glass, and hard offset shadows.

**Key Characteristics:**
- Single-screen guided flow (welcome → questions → analysis → results) on a cool misty surface
- Pill controls and large-radius white cards — soft, continuous, reassuring geometry
- Deep navy leads headings and actions; steady blue marks progress and data
- Khmer-first typography with generous leading; English only as secondary names
- Flat surfaces with one navy-tinted ambient lift shadow
- Calm, staggered motion that fully respects `prefers-reduced-motion`
- Guidance voice — every recommendation shows its reasoning; the student keeps the decision

## Colors

The Guidance palette pairs a deep, trustworthy navy with a steady compass blue on cool misty neutrals — reassuring and legible, never loud.

### Primary
- **Deep Guidance Navy** (#172B4D): Every heading, primary button, progress fill, selected-option ring, and radar label. The voice of authority in the interface — used wherever the system speaks or asks the student to act.
- **Navy Deep** (#102545): Hover/pressed state of every primary control; the only sanctioned darkening of the primary.

### Secondary
- **Steady Compass Blue** (#4779D1): Dimension score fills, major alignment badges, the results eyebrow, bullet dots, radar polygon stroke, and selection hover borders. Marks progress and data — never the primary action.
- **Compass Tint** (rgba(71, 121, 209, 0.1)): Background wash behind accent chips and the selected option's `primary/5` field.

### Tertiary
- **Pathway Green** (#27845A): Career alignment badges and reasoning checkmarks — the "this fits" signal, kept rare so it stays meaningful.
- **Pathway Tint** (rgba(39, 132, 90, 0.1)): Background of career alignment chips.

### Neutral
- **Misty Paper** (#F7F8FA): The page surface under every screen; cool, low-contrast, lets white cards read as elevated.
- **Card White** (#FFFFFF): All section cards, option cards, dialogs, and tiles.
- **Ink Text** (#202938): Body copy and option labels.
- **Slate Secondary** (#64748B): Supporting copy, meta rows, inactive step text.
- **Hairline Gray** (#E5E9F0): The 1px border on every card, chip, and divider; also the radar grid stroke.
- **Focus Ring Blue** (#BFDBFE): The universal `ring-4` on every `focus-visible` control.
- **Progress Track** (#E2E8F0): The empty track behind every progress bar and step meter.

### Named Rules
**The Guidance Navy Rule.** Deep navy leads every heading and primary action; steady blue marks progress, data, and selection feedback — it never takes the primary action's place.

## Typography

**Display Font:** Noto Sans Khmer (with Khmer OS System, Khmer Sangam MN, sans-serif)
**Body Font:** Noto Sans Khmer (with Khmer OS System, Khmer Sangam MN, sans-serif)

**Character:** A friendly humanist Khmer sans that carries the whole interface alone. Structure comes from weight steps (600 vs 400) and scale, not from a decorative display face. Note: Tailwind declares Inter as `font-sans`, but the body stack above is normative — Khmer-first is a binding product commitment and the rendered truth.

### Hierarchy
- **Display** (600, clamp(1.875rem, 4vw, 3rem), line-height 1.3; 1.75 on mobile): The welcome headline only — the one moment the product introduces itself.
- **Headline** (600, clamp(1.5rem, 3vw, 1.875rem), -0.025em): Screen titles — question prompts, analysis and results headings.
- **Title** (600, 1.25rem, 1.4): Section headings inside results (interest profile, majors, careers, reasoning).
- **Body** (400, 1rem, 1.75): Paragraphs and instructions; card copy steps down to 0.875rem / 1.5. Measures cap at max-w-2xl–max-w-3xl (roughly 65–70ch).
- **Label** (600, 0.75rem, 0.2em tracking, uppercase): Eyebrows, the PATHFINDER badge, rank markers, and meta captions (0.15em on denser list labels).

### Named Rules
**The Khmer-First Rule.** All interface copy renders in the Khmer stack with generous body leading (1.75); English appears only as secondary names on majors and careers — a bridge, never the interface.

## Layout

A single-page, one-screen-at-a-time flow in a centered single column. Containers tighten or widen by screen: welcome card `max-w-3xl` inside a `max-w-5xl` stage; assessment `max-w-4xl`; analysis `max-w-3xl`; results `max-w-6xl`. Page gutters are `px-4 → lg:px-8` (welcome uses `clamp(12px, 4vw, 24px)`).

Spacing runs on the 12 / 16 / 20 / 24 / 32px steps: section rhythm is 32px (`space-y-8`), card padding 24px growing to 32–40px on large screens, option and tile padding 16px, tight inner groups 12px. Results break the single column only where comparison helps: `lg:grid-cols-[1.2fr_0.8fr]` for profile vs. top dimensions, `xl:grid-cols-2` for major and career pairs, `md:grid-cols-3` for development opportunities. Everything stacks to one column below those breakpoints. Mobile-first; nothing depends on hover alone.

## Elevation & Depth

The system is flat at rest with a single ambient lift: hairline borders (#E5E9F0) define every edge, and one soft navy-tinted shadow floats white cards above Misty Paper. No hard offsets, no glows, no layered stacks — depth answers state, not decoration.

### Shadow Vocabulary
- **Ambient card lift** (`box-shadow: 0 20px 45px -25px rgba(23, 43, 77, 0.25)`): Every white section card and the welcome/analysis panels (`shadow-soft`).
- **Card hover response** (`box-shadow: 0 8px 20px rgba(23, 43, 77, 0.06)` + `translateY(-2px)`): Recommendation cards on hover, paired with a blue-tinted border shift.
- **Dialog elevation** (`box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)`): Confirmation modal panels over a 45% slate-950 backdrop.
- **Selected option** (`box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)` + `ring-2` at primary/20): Chosen answer options.

### Named Rules
**The Ambient Lift Rule.** Surfaces are flat at rest; one soft navy-tinted shadow lifts them. Depth appears only as a response to state — hover, selection, modal — never as resting decoration.

## Shapes

Pill-first control language: every button, chip, badge, progress bar, and selection dot is fully rounded (9999px). Cards use large soft corners — 30px on section cards (32px on the welcome panel at `sm+`), 16px on option cards and inner tiles, 12px on validation callouts, 16px on dialog panels. Borders are always 1px hairlines; there is not a sharp corner in the product. The silhouette reads soft, continuous, and reassuring — geometry that lowers pressure rather than enforcing it.

## Components

### Buttons
- **Shape:** Fully rounded pills (9999px).
- **Primary:** Deep Guidance Navy background (#172B4D), white semibold text; 14px 24px padding on the welcome CTA, 10px 20px on standard actions; 16px lucide icon leading or trailing the label.
- **Hover / Focus:** Background shifts to Navy Deep (#102545); `focus-visible` is always `ring-4` in Focus Ring Blue (#BFDBFE); `transition-colors`.
- **Secondary / Ghost:** Card white or slate-50 background, hairline border, navy text; hover pushes the border toward accent at 70%; disabled drops to 40% opacity with `not-allowed`.
- **Icon button (close):** 36–40px circle, hairline border, slate secondary icon; hover borders toward accent, icon to navy.

### Chips
- **Meta chips** (welcome facts, question category, alternative paths): slate-50 background, hairline border, full round, 14px text.
- **Alignment badges:** Tinted — Compass Tint background with Steady Compass Blue text for majors; Pathway Tint with Pathway Green for careers. 12px semibold, 6px 12px padding.

### Cards / Containers
- **Section card:** Card White, 30px radius, hairline border, ambient lift shadow, 24px padding (32–40px on large). Every results section and the analysis panel.
- **Inner tile** (score rows, top-dimension items): slate-50 background, 16px radius, hairline border, 12–16px padding.
- **Welcome hero card:** 16px radius growing to 32px at `sm+`, padding `clamp(20px, 5vw, 28px)` → 56px on large.

### Option Cards (assessment answers)
- **Style:** 16px radius, hairline border, Card White, 16px padding; the whole row is the hit target with `aria-pressed`.
- **Hover:** Border toward accent at 70%, slate-50 wash.
- **Selected:** Navy border, primary/5 background, `ring-2` at primary/20, light shadow; the 20px circular indicator fills navy with a white check.
- **Focus:** `ring-4` Focus Ring Blue, consistent with every control.

### Progress
- **Style:** 8px tall, full-round track in Progress Track (#E2E8F0); fill is Deep Guidance Navy for question progress, Steady Compass Blue for dimension score bars.
- **Motion:** Width transitions 500–700ms ease-out; the analysis step meter advances one step every 700ms.

### Dialog
- **Style:** Slate-950/45 backdrop (fade-in 180ms); Card White panel, 16px radius, hairline border, dialog elevation, 24–28px padding; circular close button top-right.
- **Behavior:** `role="alertdialog"`, Escape closes, primary action auto-focused; actions are right-aligned pills — outline cancel, navy confirm.

### Signature: Recommendation Card + Radar
- **Recommendation card:** Slate-50 tile, 16px radius, hairline border; enters with a 480ms staggered rise (45ms delay per index); hover lifts −2px with a blue-tinted border and soft shadow; alignment badge sits top-right.
- **Radar chart:** SVG hexagon on a hairline grid (#E5E9F0); the result polygon fills at 22% Steady Compass Blue with a 2px solid stroke; axis labels in Deep Guidance Navy, 12px semibold.

## Do's and Don'ts

### Do:
- **Do** keep every interactive control a full pill (9999px) and every section card at 30px radius with a hairline border plus the ambient lift shadow.
- **Do** render all primary UI copy in Khmer with the Noto Sans Khmer stack and body leading of 1.75.
- **Do** use Deep Guidance Navy for headings and primary actions; reserve Steady Compass Blue for progress, data fills, and selection feedback.
- **Do** give every focusable control `focus-visible: ring-4` in Focus Ring Blue (#BFDBFE).
- **Do** stagger recommendation cards (45ms per card) and honor `prefers-reduced-motion` by collapsing animation to effectively instant.
- **Do** write copy as guidance: encouraging and non-judgmental; results show reasoning and leave the decision to the student.

### Don't:
- **Don't** use square or hard-edged corners — no 0px radius on cards, buttons, or chips.
- **Don't** add gradients, glass/blur decoration, or hard offset shadows (4px 4px 0).
- **Don't** let Steady Compass Blue replace navy as the primary action color.
- **Don't** introduce English-first labels; English appears only as secondary names on majors and careers.
- **Don't** use emoji or bare unicode glyphs as icons — icons come from lucide-react at 16–24px with consistent stroke.
- **Don't** present results as verdicts or use judgmental, high-pressure, or gamified styling.
