'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, ArrowLeft, Check, CheckCircle2,
  ChevronDown, ExternalLink, GraduationCap, MapPin, RotateCcw, X,
  Compass, Award, Clock, Filter, Building2,
} from 'lucide-react';
import { assessmentQuestions } from '@/data/questions-km';
import { getAssessmentResults } from '@/lib/scoring';
import { getStrongestInterests, riasecToInterestScores } from '@/lib/interest-mapping';
import { majorNameToKey, matchMajorToUniversities, filterMatchesByProvince, type UniversityMatch } from '@/lib/university-matching';
import type { DimensionKey, Question, Screen } from '@/types/assessment';

const TOTAL_QUESTIONS = assessmentQuestions.length;
const ANALYSIS_STEPS = [
  'ពិនិត្យចំណាប់អារម្មណ៍របស់អ្នក',
  'ស្វែងយល់ពីចំណូលចិត្តរបស់អ្នក',
  'គណនាចំណុចខ្លាំងតាមចម្លើយ',
  'ស្វែងរកជំនាញសិក្សាដែលពាក់ព័ន្ធ',
  'រៀបចំការណែនាំសម្រាប់អ្នក',
] as const;
const DIMENSION_ORDER: DimensionKey[] = ['R', 'I', 'A', 'S', 'E', 'C'];
type ConfirmationIntent = 'close' | 'submit';

/* ─────────────────────────────────────────────
   Confirmation Dialog
───────────────────────────────────────────── */
function ConfirmationDialog({
  intent, onCancel, onConfirm,
}: { intent: ConfirmationIntent; onCancel: () => void; onConfirm: () => void }) {
  const isSubmit = intent === 'submit';
  return (
    <div className="dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <section
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-description"
        aria-modal="true"
        className="dialog-panel w-full max-w-md rounded-[12px] border border-border bg-white p-6 shadow-soft sm:p-7"
        onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); }}
        role="alertdialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="confirmation-title" className="text-lg font-semibold text-primary">
              {isSubmit ? 'បញ្ជាក់ការបញ្ជូនចម្លើយ' : 'ត្រឡប់ទៅទំព័រដើម?'}
            </h2>
            <p id="confirmation-description" className="mt-2 text-sm leading-6 text-secondary">
              {isSubmit
                ? 'តើអ្នកប្រាកដថាចង់បញ្ជូនចម្លើយទាំង ២០ របស់អ្នកមែនទេ?'
                : 'ចម្លើយដែលអ្នកបានជ្រើសរើសនឹងត្រូវលុប។ តើអ្នកចង់បិទ ហើយត្រឡប់ទៅទំព័រដើមមែនទេ?'}
            </p>
          </div>
          <button
            type="button" onClick={onCancel} aria-label="បិទ"
            className="btn-ghost inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-secondary hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button" autoFocus onClick={onCancel}
            className="btn-ghost rounded-[8px] border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            បន្ត
          </button>
          <button
            type="button" onClick={onConfirm}
            className="btn-primary rounded-[8px] bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            {isSubmit ? 'បញ្ជូនចម្លើយ' : 'បិទ ហើយត្រឡប់ទៅទំព័រដើម'}
          </button>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────
   3D Book component (Stripe Press style)
───────────────────────────────────────────── */
function Book3D() {
  return (
    <div className="book-scene">
      {/* Dynamic blurred ground shadow */}
      <div className="book-shadow" />

      {/* 3D Book Volume */}
      <div className="book-body">
        {/* ── Front cover ── */}
        <div className="book-face book-front">
          <div className="relative flex h-full flex-col justify-between p-6 pl-8">
            {/* Elegant debossed cover frame */}
            <div className="pointer-events-none absolute inset-3 left-7 rounded-[4px] border border-amber-200/25" />

            {/* Top header */}
            <div className="flex items-center justify-between border-b border-amber-200/20 pb-3">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-amber-100/90">
                PATHFINDER
              </span>
              <span className="font-sans text-[9px] font-semibold tracking-wider text-amber-200/70">
                ២០២៦
              </span>
            </div>

            {/* Center: Graduation cap & main typography */}
            <div className="flex flex-col items-center py-2 text-center">
              {/* Graduation Cap Emblem */}
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-amber-200/30 bg-gradient-to-b from-amber-500/20 to-transparent p-3 shadow-inner">
                <svg
                  viewBox="0 0 80 80"
                  className="h-14 w-14 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Cap diamond board */}
                  <polygon
                    points="40,10 74,26 40,40 6,26"
                    fill="url(#cap-gradient)"
                    stroke="rgba(255, 235, 200, 0.8)"
                    strokeWidth="1.5"
                  />
                  {/* Skull cap base */}
                  <path
                    d="M20 33 L20 48 C20 57 60 57 60 48 L60 33 Z"
                    fill="url(#cap-base)"
                  />
                  {/* Center cap button */}
                  <circle cx="40" cy="25" r="3" fill="#ffe5b4" />
                  {/* Tassel cord */}
                  <path
                    d="M40 25 Q 58 28 64 42"
                    stroke="#ffe099"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Tassel fringe */}
                  <rect x="61" y="42" width="7" height="15" rx="2" fill="#ffcf66" />
                  <defs>
                    <linearGradient id="cap-gradient" x1="6" y1="10" x2="74" y2="40" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fff8eb" />
                      <stop offset="0.6" stopColor="#f5ddb0" />
                      <stop offset="1" stopColor="#d19c52" />
                    </linearGradient>
                    <linearGradient id="cap-base" x1="20" y1="33" x2="60" y2="57" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#f7e6c4" />
                      <stop offset="1" stopColor="#b37c35" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Title in MiSans Khmer Bold */}
              <h3 className="font-sans text-[26px] font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                PATHFINDER
              </h3>
              <p className="mt-1 font-sans text-xs font-bold tracking-normal text-amber-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                ស្វែងយល់ពីអនាគតរបស់អ្នក
              </p>

              {/* Divider line */}
              <div className="my-3 h-[1px] w-12 bg-amber-200/40" />

              <p className="max-w-[170px] font-sans text-[10px] font-medium leading-4 text-amber-100/80">
                ការវាយតម្លៃចំណាប់អារម្មណ៍ ជំនាញសិក្សា និងមាគ៌ាអាជីព
              </p>
            </div>

            {/* Bottom info */}
            <div className="flex items-center justify-between border-t border-amber-200/20 pt-2.5 text-[8.5px] font-semibold uppercase tracking-wider text-amber-200/70">
              <span>RIASEC METHOD</span>
              <span>CAMBODIA</span>
            </div>
          </div>
        </div>

        {/* ── Back cover ── */}
        <div className="book-face book-back">
          <div className="relative flex h-full flex-col justify-between p-6 pr-8">
            <div className="pointer-events-none absolute inset-3 right-7 rounded-[4px] border border-amber-200/20" />

            <div className="text-center font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-amber-200/70">
              អំពីការវាយតម្លៃ
            </div>

            <div className="space-y-2 text-center font-sans text-[9.5px] leading-relaxed text-amber-100/85">
              <p>
                ឧបករណ៍ជំនួយស្វែងរកសាកលវិទ្យាល័យ និងជំនាញដែលស័ក្តិសមបំផុតជាមួយបុគ្គលិកលក្ខណៈរបស់អ្នក។
              </p>
              <p className="text-amber-200/70">
                ផ្អែកលើការស្រាវជ្រាវ និងទិន្នន័យជាក់ស្តែងនៅកម្ពុជា។
              </p>
            </div>

            {/* Barcode simulation */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex h-7 w-28 items-end justify-center gap-[2px] rounded-[2px] bg-white/90 p-1">
                {[3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 1, 2, 3, 1, 4, 2, 1].map((h, i) => (
                  <span
                    key={i}
                    className="w-[2px] bg-slate-900"
                    style={{ height: `${h * 20 + 20}%` }}
                  />
                ))}
              </div>
              <span className="font-mono text-[7px] tracking-widest text-amber-200/60">
                ISBN 978-9924-9000-0-1
              </span>
            </div>
          </div>
        </div>

        {/* ── Spine (Left face) ── */}
        <div className="book-face book-spine">
          <div className="relative flex h-full w-full flex-col items-center justify-between py-6">
            <span className="font-mono text-[8px] font-bold tracking-widest text-amber-200/70">
              2026
            </span>

            {/* Vertical spine title */}
            <div
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
              }}
              className="font-sans text-[11px] font-bold tracking-[0.22em] text-amber-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
            >
              PATHFINDER · ស្វែងយល់ពីអនាគត
            </div>

            <GraduationCap className="h-4 w-4 text-amber-200/80 drop-shadow" />
          </div>
        </div>

        {/* ── Page Block: Right Fore-edge with ribbon marker ── */}
        <div className="book-face book-pages-right">
          {/* Silk bookmark ribbon dangling from page edge */}
          <div className="book-ribbon" />
        </div>

        {/* ── Page Block: Top Edge ── */}
        <div className="book-face book-pages-top" />

        {/* ── Page Block: Bottom Edge ── */}
        <div className="book-face book-pages-bottom" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Welcome Screen
───────────────────────────────────────────── */
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="screen-enter flex min-h-[100svh] flex-col justify-between bg-surface">
      {/* ── Top Header Bar ── */}
      <header className="site-header px-6 py-4 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-primary">
              PATHFINDER
            </span>
            <span className="rounded-[4px] bg-accent/10 px-2 py-0.5 font-sans text-[10px] font-bold text-accent">
              ២០២៦
            </span>
          </div>
          <span className="font-sans text-xs font-medium text-secondary hidden sm:inline-block">
            ការវាយតម្លៃជំនាញសិក្សា & អាជីព
          </span>
        </div>
      </header>

      {/* ── Centered Hero Section ── */}
      <main className="my-auto w-full px-6 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-14">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-12 lg:gap-14">

          {/* Left Column: Hero Text & Call to Action */}
          <div className="lg:col-span-7">
            <div className="hero-line mb-4 inline-flex items-center gap-2 rounded-[6px] border border-accent/20 bg-accent/5 px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-accent">
              <Compass className="h-3.5 w-3.5" />
              <span>ការវាយតម្លៃអាជីពសាកលវិទ្យាល័យ</span>
            </div>

            <h1 className="hero-line font-sans text-4xl font-bold leading-[1.25] tracking-tight text-primary sm:text-5xl sm:leading-[1.18] lg:text-[52px]">
              ស្គាល់ចំណាប់អារម្មណ៍
              <br />
              <span className="text-accent">ស្វែងយល់ពីអនាគត</span>
            </h1>

            <p className="hero-line mt-5 max-w-xl font-sans text-base leading-7 text-secondary sm:text-lg sm:leading-8">
              ឆ្លើយសំណួរអំពីចំណាប់អារម្មណ៍ ចំណុចខ្លាំង និងគោលដៅរបស់អ្នក
              ដើម្បីស្វែងរកជំនាញសាកលវិទ្យាល័យ និងផ្លូវអាជីពជាក់ស្តែងដែលអាចសមស្របបំផុតនឹងអ្នក។
            </p>

            {/* Micro details pills */}
            <div className="hero-line mt-6 flex flex-wrap gap-4 text-sm text-secondary">
              <div className="flex items-center gap-2 rounded-[6px] border border-border bg-white px-3 py-1.5 shadow-sm">
                <Clock className="h-3.5 w-3.5 text-accent" />
                <span className="font-sans font-medium text-xs sm:text-sm">២០ សំណួរ (៤–៦ នាទី)</span>
              </div>
              <div className="flex items-center gap-2 rounded-[6px] border border-border bg-white px-3 py-1.5 shadow-sm">
                <Award className="h-3.5 w-3.5 text-accent" />
                <span className="font-sans font-medium text-xs sm:text-sm">គ្មានចម្លើយត្រូវ ឬខុស</span>
              </div>
            </div>

            {/* Action button */}
            <div className="hero-line mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onStart}
                className="btn-primary inline-flex items-center gap-3 rounded-[8px] bg-accent px-7 py-4 font-sans text-base font-bold text-white shadow-md hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                ចាប់ផ្តើមការវាយតម្លៃ
                <ArrowRight className="h-4 w-4" />
              </button>
              <span className="font-sans text-xs text-secondary">
                ឥតគិតថ្លៃ ១០០% • មិនចាំបាច់ចុះឈ្មោះ
              </span>
            </div>
          </div>

          {/* Right Column: 3D Floating Book */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <Book3D />
          </div>

        </div>
      </main>

      {/* ── Grounding Feature Strip (Balances Bottom Space) ── */}
      <footer className="border-t border-border/80 bg-white/70 py-6 backdrop-blur-sm px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-border bg-surface text-accent">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
                វិធីសាស្ត្រ RIASEC
              </h4>
              <p className="mt-0.5 font-sans text-xs leading-5 text-secondary">
                ផ្អែកលើ ៦ វិមាត្របុគ្គលិកលក្ខណៈ ដើម្បីផ្គូផ្គងជំនាញត្រូវនឹងខ្លួន។
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-border bg-surface text-accent">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
                ទិន្នន័យជាក់ស្តែង
              </h4>
              <p className="mt-0.5 font-sans text-xs leading-5 text-secondary">
                ភ្ជាប់ជាមួយសាកលវិទ្យាល័យ តម្លៃសិក្សា និងតម្រូវការចូលរៀននៅកម្ពុជា។
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-border bg-surface text-accent">
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
                លទ្ធផលលម្អិតភ្លាមៗ
              </h4>
              <p className="mt-0.5 font-sans text-xs leading-5 text-secondary">
                ទទួលបានរបាយការណ៍ជំនាញ ១០ និងផ្លូវអាជីព ១០ បន្ទាប់ពីឆ្លើយរួច។
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Assessment Screen — with slide transition
───────────────────────────────────────────── */
function AssessmentScreen({
  question, questionIndex, total, selected, onSelect,
  onBack, onClose, onNext, isFirst, isLast,
  validationMessage, confirmation, onCancelConfirmation, onConfirmConfirmation,
}: {
  question: Question; questionIndex: number; total: number;
  selected: string[]; onSelect: (id: string) => void;
  onBack: () => void; onClose: () => void; onNext: () => void;
  isFirst: boolean; isLast: boolean; validationMessage?: string;
  confirmation: ConfirmationIntent | null;
  onCancelConfirmation: () => void; onConfirmConfirmation: () => void;
}) {
  const progress = ((questionIndex + 1) / total) * 100;
  // Track slide key so each question gets a fresh enter animation
  const [slideKey, setSlideKey] = useState(questionIndex);
  useEffect(() => { setSlideKey(questionIndex); }, [questionIndex]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Sticky header */}
      <header className="site-header px-5 py-3 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Pathfinder</span>
          <div className="flex items-center gap-3">
            <span className="tabular-nums text-xs text-secondary">{questionIndex + 1} / {total}</span>
            <button
              type="button" onClick={onClose} aria-label="បិទ"
              className="btn-ghost inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-secondary hover:bg-border hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Thin animated progress line */}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <main className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent">{question.category}</p>

          {/* Question card slides in with each new question */}
          <div key={slideKey} className="question-enter rounded-[12px] border border-border bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-2xl font-bold leading-snug tracking-tight text-primary sm:text-3xl">{question.prompt}</h2>
            <p className="mt-3 text-sm leading-6 text-secondary">
              សូមជ្រើសរើសចម្លើយដែលសមស្របបំផុតនឹងចំណូលចិត្តរបស់អ្នក។
            </p>

            <div className="mt-7 grid gap-2.5">
              {question.options.map((option, i) => {
                const isSelected = selected.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelect(option.id)}
                    style={{ animationDelay: `${i * 45}ms` }}
                    className={`option-btn w-full rounded-[8px] border p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                      isSelected
                        ? 'border-accent bg-accent/5 shadow-sm option-btn-selected'
                        : 'border-border bg-white hover:border-accent/40 hover:bg-surface'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border option-check ${
                        isSelected ? 'border-accent bg-accent text-white option-check-selected' : 'border-border bg-white text-transparent'
                      }`}>
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium leading-6 text-text sm:text-base">{option.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {validationMessage ? (
              <p className="mt-4 animate-[fade-up_300ms_ease_both] rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {validationMessage}
              </p>
            ) : null}
          </div>

          {/* Nav row */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button" onClick={onBack} disabled={isFirst}
              className="btn-ghost inline-flex items-center gap-2 rounded-[8px] border border-border bg-white px-4 py-2.5 text-sm font-medium text-primary hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <ArrowLeft className="h-4 w-4" />
              ត្រឡប់ក្រោយ
            </button>
            <button
              type="button" onClick={onNext}
              className="btn-primary inline-flex items-center gap-2 rounded-[8px] bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              {isLast ? 'បញ្ជូនចម្លើយ' : 'បន្ទាប់'}
              {!isLast ? <ArrowRight className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </main>

      {confirmation ? (
        <ConfirmationDialog
          intent={confirmation}
          onCancel={onCancelConfirmation}
          onConfirm={onConfirmConfirmation}
        />
      ) : null}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Analysis Screen
───────────────────────────────────────────── */
function AnalysisScreen() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= ANALYSIS_STEPS.length - 1) return prev;
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="screen-enter min-h-screen bg-surface">
      <header className="site-header px-6 py-4 sm:px-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Pathfinder</span>
      </header>

      <main className="flex min-h-[calc(100vh-57px)] items-center px-6 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 spinner" />
          <h2 className="text-2xl font-bold tracking-tight text-primary">កំពុងរៀបចំលទ្ធផល…</h2>
          <p className="mt-3 text-sm leading-6 text-secondary">
            យើងកំពុងគណនាពិន្ទុ និងរៀបចំជម្រើសសម្រាប់អ្នក។
          </p>

          <div className="mt-8 space-y-3">
            {ANALYSIS_STEPS.map((step, index) => {
              const isDone = index < activeStep;
              const isActive = index === activeStep;
              return (
                <div
                  key={step}
                  className="flex items-center gap-3"
                  style={{ opacity: index <= activeStep ? 1 : 0.35, transition: 'opacity 400ms ease' }}
                >
                  <div className={`step-dot flex h-6 w-6 items-center justify-center rounded-[4px] text-xs font-semibold ${
                    isDone || isActive ? 'bg-accent text-white' : 'bg-border text-secondary'
                  } ${isActive ? 'step-dot-active' : ''}`}>
                    {isDone ? <Check className="h-3 w-3 stroke-[3]" /> : index + 1}
                  </div>
                  <span className={`step-label text-sm ${isDone || isActive ? 'font-semibold text-primary' : 'text-secondary'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mini progress bar */}
          <div className="progress-track mt-8">
            <div
              className="progress-fill"
              style={{ width: `${((activeStep + 1) / ANALYSIS_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────
   University Card
───────────────────────────────────────────── */
function UniversityCard({
  match,
  rank,
  isTopPick,
}: {
  match: UniversityMatch;
  rank?: number;
  isTopPick?: boolean;
}) {
  const { university, faculty, major, matchType } = match;
  const isExact = matchType === 'exact';
  const tuition = typeof major.tuition_per_year_usd === 'number'
    ? new Intl.NumberFormat('en-US').format(major.tuition_per_year_usd)
    : null;
  const admissionRequirements = major.admission_requirements ?? [];
  const scholarships = major.scholarships ?? [];
  const teachingLanguages = university.teaching_languages ?? [];
  const provinceLabel = university.province_km || university.province || university.location;

  return (
    <article
      className={`flex min-w-0 flex-col rounded-[12px] border p-5 transition-all duration-200 hover:shadow-card ${
        isTopPick
          ? 'border-accent/40 bg-white ring-1 ring-accent/20'
          : 'border-border bg-surface'
      }`}
    >
      {/* Header with rank badge and university name */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {rank && rank <= 3 ? (
              <span
                className={`shrink-0 rounded-[6px] px-2 py-0.5 font-sans text-[11px] font-bold ${
                  rank === 1
                    ? 'bg-amber-500 text-white shadow-sm'
                    : rank === 2
                    ? 'bg-slate-700 text-white'
                    : 'bg-accent text-white'
                }`}
              >
                #{rank} កំពូលជម្រើសណែនាំ
              </span>
            ) : null}
            <h4 className="break-words font-sans text-base font-bold text-primary">{university.name_en}</h4>
          </div>
          <p className="mt-1 break-words font-sans text-sm font-semibold text-secondary">{university.name_km}</p>
        </div>

        <span
          className={`badge-pop shrink-0 whitespace-nowrap rounded-[6px] px-2.5 py-1 font-sans text-xs font-semibold ${
            isExact ? 'bg-accent/10 text-accent' : 'border border-border bg-white text-secondary'
          }`}
        >
          {isExact ? 'ជំនាញដូចគ្នា' : 'ជំនាញជិតស្និទ្ធ'}
        </span>
      </div>

      {/* Location / Province tags */}
      <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-secondary">
        <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-border bg-white px-2.5 py-1 font-sans font-medium text-primary shadow-sm">
          <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
          {provinceLabel}
        </span>
        {university.short_name ? (
          <span className="rounded-[4px] bg-accent/5 px-2 py-1 font-sans font-bold text-accent">
            {university.short_name}
          </span>
        ) : null}
        {university.location && university.location !== provinceLabel ? (
          <span className="font-sans text-secondary">{university.location}</span>
        ) : null}
      </div>

      {/* Degree & Tuition Details */}
      <dl className="mt-4 space-y-2 border-t border-border/70 pt-3 text-sm">
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-sans font-semibold text-primary">មហាវិទ្យាល័យ៖</dt>
          <dd className="min-w-0 break-words font-sans text-secondary">{faculty.name_km}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-sans font-semibold text-primary">ជំនាញ៖</dt>
          <dd className="min-w-0 break-words font-sans font-medium text-text">
            {major.name_km} ({major.name_en})
          </dd>
        </div>
        <div className="flex flex-wrap items-center gap-x-2">
          <dt className="font-sans font-semibold text-primary">ថ្លៃសិក្សាប្រចាំឆ្នាំ៖</dt>
          <dd className="tabular-nums font-sans font-bold text-accent">
            {tuition ? `${tuition} USD / ឆ្នាំ` : 'មិនមានទិន្នន័យជាក់លាក់'}
          </dd>
        </div>
        {teachingLanguages.length > 0 ? (
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-sans font-semibold text-primary">ភាសាបង្រៀន៖</dt>
            <dd className="min-w-0 font-sans text-secondary">{teachingLanguages.join(' · ')}</dd>
          </div>
        ) : null}
      </dl>

      {/* Admission requirements */}
      <div className="mt-3.5">
        <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-primary">តម្រូវការចូលរៀន</h5>
        {admissionRequirements.length > 0 ? (
          <ul className="mt-1.5 space-y-1 font-sans text-xs leading-5 text-secondary">
            {admissionRequirements.map((req, i) => (
              <li key={`${i}-${req}`} className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                <span className="min-w-0 break-words">{req}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 font-sans text-xs text-secondary">សញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប)</p>
        )}
      </div>

      {/* Scholarships */}
      {scholarships.length > 0 ? (
        <div className="mt-3">
          <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-primary">អាហារូបករណ៍</h5>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {scholarships.map((s, i) => (
              <span key={`${i}-${s}`} className="rounded-[4px] border border-border bg-white px-2 py-0.5 font-sans text-[11px] font-medium text-secondary">
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-3.5 font-sans text-xs leading-5 text-secondary">
        <span className="font-bold text-primary">ហេតុអ្វីសមស្រប៖</span>{' '}
        {isExact
          ? 'សាលានេះផ្តល់ជូនជំនាញដែលបានណែនាំដោយផ្ទាល់។'
          : 'សាលានេះផ្តល់ជូនជំនាញជិតស្និទ្ធជាមួយជំនាញដែលបានណែនាំ។'}
      </p>

      {university.website ? (
        <div className="mt-auto pt-4 border-t border-border/70">
          <a
            href={university.website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-border bg-white px-3 py-2 font-sans text-xs font-semibold text-primary hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <span>ទៅកាន់គេហទំព័រផ្លូវការ {university.short_name || ''}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      ) : null}
    </article>
  );
}

/* ─────────────────────────────────────────────
   Animated bar fill hook
───────────────────────────────────────────── */
function useBarAnimation(value: number, delay = 0) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay + 80);
    return () => clearTimeout(t);
  }, [value, delay]);
  return width;
}

/* ─────────────────────────────────────────────
   Results Screen
───────────────────────────────────────────── */
function ResultsScreen({ result, onRetake }: { result: ReturnType<typeof getAssessmentResults>; onRetake: () => void }) {
  const radarLevels = [20, 40, 60, 80, 100];
  const [selectedMajorName, setSelectedMajorName] = useState<string | null>(
    () => result.majorRecommendations[0]?.nameEnglish ?? null,
  );
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [showAllMatches, setShowAllMatches] = useState<boolean>(false);
  const universitySectionRef = useRef<HTMLElement>(null);

  // Animate radar polygon draw-on
  const [radarVisible, setRadarVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setRadarVisible(true), 400); return () => clearTimeout(t); }, []);

  const labelMap: Record<DimensionKey, string> = {
    R: 'ការងារជាក់ស្តែង', I: 'ការស្រាវជ្រាវ', A: 'ការច្នៃប្រឌិត',
    S: 'ការជួយអ្នកដទៃ', E: 'ភាពជាអ្នកដឹកនាំ', C: 'ការរៀបចំប្រព័ន្ធ',
  };
  const interestLabels: Record<string, string> = {
    technology: 'បច្ចេកវិទ្យា', mathematics: 'គណិតវិទ្យា',
    analytical_problem_solving: 'ការវិភាគបញ្ហា', biology: 'ជីវវិទ្យា',
    chemistry: 'គីមីវិទ្យា', healthcare: 'សុខភាព', communication: 'ការទំនាក់ទំនង',
    creativity: 'ភាពច្នៃប្រឌិត', business: 'អាជីពពាណិជ្ជកម្ម',
    social_interaction: 'ការងារសង្គម', engineering: 'វិស្វកម្ម',
    science: 'វិទ្យាសាស្ត្រ', agriculture: 'កសិកម្ម', environment: 'បរិស្ថាន',
  };
  const dimensionDescriptions: Record<DimensionKey, string> = {
    R: 'ពិន្ទុនេះឆ្លុះបញ្ចាំងពីចំណាប់អារម្មណ៍លើការអនុវត្ត ការបង្កើត និងលទ្ធផលជាក់ស្តែង។',
    I: 'ពិន្ទុនេះឆ្លុះបញ្ចាំងពីចំណាប់អារម្មណ៍លើការស្រាវជ្រាវ ការវិភាគ និងការស្វែងរកចម្លើយ។',
    A: 'ពិន្ទុនេះឆ្លុះបញ្ចាំងពីចំណាប់អារម្មណ៍លើការច្នៃប្រឌិត ការរចនា និងការបញ្ចេញគំនិត។',
    S: 'ពិន្ទុនេះឆ្លុះបញ្ចាំងពីចំណាប់អារម្មណ៍លើការបង្រៀន ការគាំទ្រ និងការធ្វើការជាមួយមនុស្ស។',
    E: 'ពិន្ទុនេះឆ្លុះបញ្ចាំងពីចំណាប់អារម្មណ៍លើការដឹកនាំ ការបញ្ចុះបញ្ចូល និងការជំរុញគម្រោង។',
    C: 'ពិន្ទុនេះឆ្លុះបញ្ចាំងពីចំណាប់អារម្មណ៍លើការរៀបចំ ភាពត្រឹមត្រូវ និងនីតិវិធីច្បាស់លាស់។',
  };

  const radarPoints = useMemo(() => {
    const cx = 160, cy = 160, r = 120;
    return DIMENSION_ORDER.map((key, i) => {
      const angle = (Math.PI * 2 * i) / DIMENSION_ORDER.length - Math.PI / 2;
      const d = r * (result.normalizedScores[key] / 100);
      return `${cx + Math.cos(angle) * d},${cy + Math.sin(angle) * d}`;
    }).join(' ');
  }, [result.normalizedScores]);

  const interestScores = useMemo(() => riasecToInterestScores(result.normalizedScores), [result.normalizedScores]);
  const strongestInterests = useMemo(() => getStrongestInterests(interestScores, 3), [interestScores]);

  const selectedMajor = selectedMajorName
    ? result.majorRecommendations.find((m) => m.nameEnglish === selectedMajorName) ?? null
    : null;

  const allUniversityMatches = useMemo(
    () => (selectedMajor ? matchMajorToUniversities(majorNameToKey(selectedMajor.nameEnglish)) : []),
    [selectedMajor],
  );

  const availableProvinces = useMemo(() => {
    const provinceMap = new Map<string, { en: string; km: string; count: number }>();
    for (const m of allUniversityMatches) {
      const pEn = m.university.province ?? 'Phnom Penh';
      const pKm = m.university.province_km ?? pEn;
      if (!provinceMap.has(pEn)) {
        provinceMap.set(pEn, { en: pEn, km: pKm, count: 0 });
      }
      provinceMap.get(pEn)!.count += 1;
    }
    return Array.from(provinceMap.values()).sort((a, b) => b.count - a.count);
  }, [allUniversityMatches]);

  const filteredMatches = useMemo(() => {
    return filterMatchesByProvince(allUniversityMatches, selectedProvince);
  }, [allUniversityMatches, selectedProvince]);

  const displayedMatches = useMemo(() => {
    if (showAllMatches || selectedProvince !== 'all') {
      return filteredMatches;
    }
    return filteredMatches.slice(0, 3);
  }, [filteredMatches, showAllMatches, selectedProvince]);

  const toggleMajor = (name: string) => {
    setSelectedMajorName((cur) => {
      if (cur === name) return null;
      setSelectedProvince('all');
      setShowAllMatches(false);
      return name;
    });
  };

  useEffect(() => {
    if (!selectedMajorName || !universitySectionRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    universitySectionRef.current.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
  }, [selectedMajorName]);

  return (
    <div className="screen-enter min-h-screen bg-surface">
      {/* Header */}
      <header className="site-header px-6 py-4 sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Pathfinder</span>
          <button
            onClick={onRetake}
            className="btn-ghost inline-flex items-center gap-2 rounded-[8px] border border-border bg-white px-3 py-2 text-sm font-medium text-primary transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            ធ្វើម្តងទៀត
          </button>
        </div>
      </header>

      <main className="px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-6xl space-y-6">

          {/* ── Hero ── */}
          <section className="section-enter rounded-[12px] border border-border bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">លទ្ធផលរបស់អ្នករួចរាល់ហើយ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">ការណែនាំ PATHFINDER</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-secondary">
              លទ្ធផលនេះផ្អែកលើចម្លើយដែលអ្នកបានជ្រើសរើស ហើយបង្ហាញជម្រើសជំនាញសិក្សា និងអាជីពសម្រាប់ស្វែងយល់បន្ថែម។
              វាជាព័ត៌មានណែនាំ មិនមែនជាការសម្រេចចិត្តជំនួសអ្នកទេ។
            </p>
          </section>

          {/* ── Radar + Top Dimensions ── */}
          <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            {/* Radar */}
            <div className="section-enter rounded-[12px] border border-border bg-white p-6 sm:p-8" style={{ animationDelay: '80ms' }}>
              <h3 className="mb-1 text-lg font-semibold text-primary">ទម្រង់ចំណាប់អារម្មណ៍</h3>
              <p className="mb-6 text-sm leading-6 text-secondary">{result.profileSummary}</p>

              <div className="grid gap-6 xl:grid-cols-[1fr_200px]">
                {/* SVG radar with animated polygon */}
                <svg viewBox="0 0 320 320" className="mx-auto w-full max-w-[280px]">
                  {radarLevels.map((level) => {
                    const pts = DIMENSION_ORDER.map((_, i) => {
                      const angle = (Math.PI * 2 * i) / DIMENSION_ORDER.length - Math.PI / 2;
                      const rr = (level / 100) * 120;
                      return `${160 + Math.cos(angle) * rr},${160 + Math.sin(angle) * rr}`;
                    }).join(' ');
                    return <polygon key={level} points={pts} fill="none" stroke="#e2ddd8" strokeWidth="1" />;
                  })}
                  {DIMENSION_ORDER.map((key, i) => {
                    const angle = (Math.PI * 2 * i) / DIMENSION_ORDER.length - Math.PI / 2;
                    const x = 160 + Math.cos(angle) * 120;
                    const y = 160 + Math.sin(angle) * 120;
                    const lx = 160 + Math.cos(angle) * 142;
                    const ly = 160 + Math.sin(angle) * 142;
                    return (
                      <g key={key}>
                        <line x1="160" y1="160" x2={x} y2={y} stroke="#e2ddd8" strokeWidth="1" />
                        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#1a1a2e" fontSize="12" fontWeight="600">{key}</text>
                      </g>
                    );
                  })}
                  {/* Animated polygon */}
                  <polygon
                    points={radarPoints}
                    stroke="#c0622f"
                    strokeWidth="2"
                    fill="rgba(192,98,47,0.15)"
                    style={{
                      transition: 'opacity 800ms ease, fill-opacity 800ms ease',
                      opacity: radarVisible ? 1 : 0,
                      fillOpacity: radarVisible ? 1 : 0,
                    }}
                  />
                </svg>

                {/* Bars animate in with delays */}
                <div className="space-y-2.5">
                  {DIMENSION_ORDER.map((key, idx) => (
                    <AnimatedBar key={key} label={labelMap[key]} value={result.normalizedScores[key]} delay={idx * 80} />
                  ))}
                </div>
              </div>
            </div>

            {/* Top dimensions */}
            <div className="section-enter rounded-[12px] border border-border bg-white p-6 sm:p-8" style={{ animationDelay: '140ms' }}>
              <h3 className="mb-5 text-lg font-semibold text-primary">ចំណុចដែលមានពិន្ទុខ្ពស់</h3>
              <div className="stagger-children space-y-3">
                {result.topDimensions.map((key, index) => (
                  <div key={key} className="rounded-[8px] border border-border bg-surface p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tabular-nums text-accent">#{index + 1}</span>
                      <span className="text-sm font-semibold text-primary">{labelMap[key]}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-secondary">{dimensionDescriptions[key]}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Majors ── */}
          <section className="section-enter rounded-[12px] border border-border bg-white p-6 sm:p-8" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold text-primary">ជំនាញសាកលវិទ្យាល័យដែលបានណែនាំ ១០</h3>
            <p className="mt-1 mb-6 text-sm leading-6 text-secondary">
              ជ្រើសរើសជំនាញមួយដើម្បីមើលសាកលវិទ្យាល័យ ថ្លៃសិក្សា និងតម្រូវការចូលរៀន។
            </p>
            <div className="grid gap-3 xl:grid-cols-2">
              {result.majorRecommendations.map((major, index) => {
                const isSelected = selectedMajorName === major.nameEnglish;
                const majorMatches = matchMajorToUniversities(majorNameToKey(major.nameEnglish));
                const top3 = majorMatches.slice(0, 3);

                return (
                  <article
                    key={major.name}
                    style={{ animationDelay: `${200 + index * 40}ms` }}
                    className={`recommendation-card cursor-pointer rounded-[12px] border p-5 ${
                      isSelected ? 'border-accent bg-accent/5 ring-1 ring-accent/30' : 'border-border bg-surface'
                    }`}
                    role="button" tabIndex={0}
                    aria-expanded={isSelected}
                    onClick={() => toggleMajor(major.nameEnglish)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMajor(major.nameEnglish); } }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-base font-semibold text-primary">{major.name}</h4>
                        <p className="mt-0.5 text-sm text-secondary">{major.nameEnglish}</p>
                      </div>
                      <span className="shrink-0 rounded-[6px] bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">{major.alignment}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-secondary">{major.description}</p>
                    <p className="mt-2 text-sm text-text"><span className="font-semibold">មូលហេតុ៖</span> {major.reason}</p>
                    <div className="mt-3 space-y-1 text-sm text-secondary">
                      <div><span className="font-semibold text-primary">មុខវិជ្ជា៖</span> {major.subjects.join(' · ')}</div>
                      <div><span className="font-semibold text-primary">ជំនាញ៖</span> {major.skills.join(' · ')}</div>
                      <div><span className="font-semibold text-primary">អ្វីដែលត្រូវសិក្សា៖</span> {major.learningAreas.join(' · ')}</div>
                    </div>

                    {/* Top 3 Universities Badges */}
                    {top3.length > 0 ? (
                      <div className="mt-4 pt-3 border-t border-border/70">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-accent mb-2">
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>សាកលវិទ្យាល័យកំពូលទាំង ៣៖</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {top3.map((m, idx) => (
                            <span
                              key={m.university.id}
                              className="inline-flex items-center gap-1 rounded-[6px] border border-border bg-white px-2 py-1 font-sans text-xs font-semibold text-primary shadow-xs"
                            >
                              <span className="rounded-[4px] bg-accent/15 px-1 text-[10px] font-bold text-accent">#{idx + 1}</span>
                              <span>{m.university.short_name || m.university.name_km}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2.5 text-xs sm:text-sm">
                      <span className="inline-flex items-center gap-1.5 font-bold text-accent">
                        <Building2 className="h-4 w-4" />
                        {isSelected ? 'កំពុងពិនិត្យមើលសាកលវិទ្យាល័យ' : 'មើលព័ត៌មានលម្អិត និងថ្លៃសិក្សា'}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-secondary transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSelected ? 'rotate-180 text-accent' : ''}`} />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* ── University matches ── */}
          {selectedMajor ? (
            <section
              key={selectedMajor.nameEnglish}
              id="university-section"
              ref={universitySectionRef}
              aria-labelledby="university-section-title"
              className="section-enter rounded-[12px] border border-border bg-white p-6 sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-[6px] bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>រកឃើញ {allUniversityMatches.length} សាកលវិទ្យាល័យនៅកម្ពុជា</span>
                  </div>
                  <h3 id="university-section-title" className="font-sans text-xl font-bold text-primary sm:text-2xl">
                    សាកលវិទ្យាល័យសម្រាប់ {selectedMajor.name}
                  </h3>
                  <p className="mt-0.5 font-sans text-sm font-semibold text-secondary">{selectedMajor.nameEnglish}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleMajor(selectedMajor.nameEnglish)}
                  aria-label="បិទ"
                  className="btn-ghost inline-flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-[6px] border border-border text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {strongestInterests.length > 0 ? (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-secondary">
                  <span className="font-sans font-medium text-xs sm:text-sm">ចំណាប់អារម្មណ៍ដែលពាក់ព័ន្ធ៖</span>
                  {strongestInterests.map(({ key, score }) => (
                    <span key={key} className="badge-pop rounded-[6px] bg-accent/10 px-2.5 py-1 font-sans text-xs font-bold text-accent">
                      {interestLabels[key] ?? key} {score}%
                    </span>
                  ))}
                </div>
              ) : null}

              {/* Sub-header bar: Top 3 status & Province Filter */}
              <div className="mt-6 flex flex-col gap-3.5 rounded-[10px] border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-sans text-xs font-bold uppercase tracking-wider text-accent">
                    {selectedProvince === 'all' && !showAllMatches
                      ? '★ កំពូលសាកលវិទ្យាល័យទាំង ៣ ដែលណែនាំបំផុត (Top 3 Recommended)'
                      : `សាកលវិទ្យាល័យដែលបានជ្រើសរើស (${filteredMatches.length} សាលា)`}
                  </p>
                  <p className="mt-0.5 font-sans text-xs text-secondary">
                    {selectedProvince === 'all' && !showAllMatches
                      ? 'ជ្រើសរើសដោយផ្អែកលើកិត្យានុភាព គុណភាពបណ្តុះបណ្តាល និងឱកាសការងារជាក់ស្តែង'
                      : selectedProvince !== 'all'
                      ? 'បង្ហាញស្ថាប័នក្នុងខេត្តដែលបានជ្រើសរើស (ជ្រើសរើស «គ្រប់ ២៥ ខេត្ត/រាជធានី» ដើម្បីមើលកំពូលទាំង ៣ ថ្នាក់ជាតិ)'
                      : 'សាកលវិទ្យាល័យដែលផ្តល់ជូនជំនាញនេះនៅទូទាំងប្រទេសកម្ពុជា'}
                  </p>
                </div>

                {/* Province Filter Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <Filter className="h-4 w-4 text-accent" />
                  <label htmlFor="province-filter" className="sr-only">
                    ជ្រើសរើសខេត្ត/ក្រុង
                  </label>
                  <select
                    id="province-filter"
                    value={selectedProvince}
                    onChange={(e) => {
                      setSelectedProvince(e.target.value);
                      setShowAllMatches(true);
                    }}
                    className="cursor-pointer rounded-[6px] border border-border bg-white px-3 py-1.5 font-sans text-xs font-bold text-primary shadow-sm hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    <option value="all">គ្រប់ ២៥ ខេត្ត/រាជធានី (សរុប {allUniversityMatches.length})</option>
                    {availableProvinces.map((p) => (
                      <option key={p.en} value={p.en}>
                        {p.km} ({p.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* University Cards Grid */}
              {filteredMatches.length === 0 ? (
                <div className="mt-5 rounded-[8px] border border-border bg-surface p-6 text-center">
                  <p className="font-sans text-base font-bold text-primary">មិនមានសាកលវិទ្យាល័យក្នុងខេត្តនេះនៅឡើយទេ</p>
                  <p className="mt-1 font-sans text-xs text-secondary">
                    សូមជ្រើសរើស «គ្រប់ ២៥ ខេត្ត/រាជធានី» ដើម្បីស្វែងរកសាកលវិទ្យាល័យនៅទូទាំងប្រទេស។
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {displayedMatches.map((match, idx) => (
                    <UniversityCard
                      key={`${match.university.id}-${match.faculty.name_en}-${match.major.key}`}
                      match={match}
                      rank={selectedProvince === 'all' ? idx + 1 : undefined}
                      isTopPick={idx < 3 && selectedProvince === 'all'}
                    />
                  ))}
                </div>
              )}

              {/* View More / Collapse Toggle */}
              {allUniversityMatches.length > 3 && selectedProvince === 'all' && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllMatches(!showAllMatches)}
                    className="inline-flex items-center gap-2 rounded-[8px] border border-accent/40 bg-accent/5 px-5 py-2.5 font-sans text-xs font-bold text-accent transition-colors hover:bg-accent/10"
                  >
                    {showAllMatches
                      ? 'បង្រួមមកកំពូល ៣ សាកលវិទ្យាល័យ'
                      : `មើលសាកលវិទ្យាល័យទាំងអស់តាមបណ្តាខេត្ត (សរុប ${allUniversityMatches.length} សាលា)`}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${showAllMatches ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
              )}

              {selectedProvince !== 'all' && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProvince('all');
                      setShowAllMatches(false);
                    }}
                    className="btn-ghost inline-flex items-center gap-1.5 rounded-[8px] border border-border bg-white px-4 py-2 font-sans text-xs font-bold text-primary shadow-xs transition hover:border-accent/40 hover:text-accent"
                  >
                    <span>← ត្រឡប់ទៅមើលសាកលវិទ្យាល័យកំពូលទាំង ៣ ទូទាំងប្រទេស</span>
                  </button>
                </div>
              )}
            </section>
          ) : null}

          {/* ── Career recommendations ── */}
          <section className="section-enter rounded-[12px] border border-border bg-white p-6 sm:p-8" style={{ animationDelay: '260ms' }}>
            <h3 className="mb-5 text-lg font-semibold text-primary">ផ្លូវអាជីពដែលអាចសាកសម ១០</h3>
            <div className="grid gap-3 xl:grid-cols-2">
              {result.careerRecommendations.map((career, index) => (
                <article
                  key={career.title}
                  style={{ animationDelay: `${260 + index * 40}ms` }}
                  className="recommendation-card rounded-[12px] border border-border bg-surface p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-base font-semibold text-primary">{career.title}</h4>
                      <p className="mt-0.5 text-sm text-secondary">{career.titleEnglish}</p>
                    </div>
                    <span className="shrink-0 rounded-[6px] bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">{career.alignment}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-secondary">{career.description}</p>
                  <div className="mt-3 space-y-1 text-sm text-secondary">
                    <div><span className="font-semibold text-primary">ភារកិច្ច៖</span> {career.responsibilities.join(' · ')}</div>
                    <div><span className="font-semibold text-primary">ជំនាញ៖</span> {career.skills.join(' · ')}</div>
                    <div><span className="font-semibold text-primary">ជំនាញសិក្សា៖</span> {career.relatedMajors.join(' · ')}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── Reasoning ── */}
          <section className="section-enter rounded-[12px] border border-border bg-white p-6 sm:p-8" style={{ animationDelay: '320ms' }}>
            <h3 className="mb-5 text-lg font-semibold text-primary">ហេតុអ្វីបានជាមានការណែនាំទាំងនេះ?</h3>
            <ul className="stagger-children space-y-2.5">
              {result.reasoning.map((reason) => (
                <li key={reason} className="flex items-start gap-3 rounded-[8px] border border-border bg-surface p-3 text-sm leading-6 text-secondary">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Development opportunities ── */}
          <section className="section-enter rounded-[12px] border border-border bg-white p-6 sm:p-8" style={{ animationDelay: '380ms' }}>
            <h3 className="mb-5 text-lg font-semibold text-primary">ឱកាសអភិវឌ្ឍខ្លួន</h3>
            <div className="stagger-children grid gap-4 md:grid-cols-3">
              {result.developmentOpportunities.map((item) => (
                <div key={item.title} className="rounded-[8px] border border-border bg-surface p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">{item.title}</p>
                  <ul className="space-y-2 text-sm leading-6 text-secondary">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── Alternative paths ── */}
          <section className="section-enter rounded-[12px] border border-border bg-white p-6 sm:p-8" style={{ animationDelay: '440ms' }}>
            <h3 className="mb-5 text-lg font-semibold text-primary">ជម្រើសផ្សេងទៀតសម្រាប់ស្វែងយល់</h3>
            <div className="stagger-children flex flex-wrap gap-2">
              {result.alternativePaths.map((path) => (
                <span key={path} className="rounded-[6px] border border-border bg-surface px-3 py-2 text-sm text-secondary transition-colors hover:border-accent/40 hover:text-primary">
                  {path}
                </span>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Animated bar component (results radar panel)
───────────────────────────────────────────── */
function AnimatedBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const width = useBarAnimation(value, delay);
  return (
    <div className="rounded-[8px] border border-border bg-surface p-3">
      <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-primary">{label}</span>
        <span className="tabular-nums text-secondary">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${width}%`, transition: 'width 700ms cubic-bezier(0.16,1,0.3,1)' }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Root
───────────────────────────────────────────── */
export default function Home() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [validationMessage, setValidationMessage] = useState('');
  const [result, setResult] = useState<ReturnType<typeof getAssessmentResults> | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<ConfirmationIntent | null>(null);

  const currentQuestion = assessmentQuestions[currentIndex];
  const selectedOptions = currentQuestion ? answers[currentQuestion.id] ?? [] : [];

  const returnToWelcome = () => {
    setAnswers({}); setCurrentIndex(0); setValidationMessage(''); setResult(null); setScreen('welcome');
  };

  const handleCloseAssessment = () => {
    const hasAnswers = Object.values(answers).some((s) => s.length > 0);
    if (hasAnswers) { setPendingConfirmation('close'); return; }
    returnToWelcome();
  };

  const handleConfirmAction = () => {
    const action = pendingConfirmation;
    setPendingConfirmation(null);
    if (action === 'close') returnToWelcome();
    else if (action === 'submit') { setResult(getAssessmentResults(assessmentQuestions, answers)); setScreen('analysis'); }
  };

  const handleSelect = (optionId: string) => {
    const q = assessmentQuestions[currentIndex];
    if (!q) return;
    setValidationMessage('');
    setAnswers((prev) => {
      const cur = prev[q.id] ?? [];
      if (!q.allowMultiple) return { ...prev, [q.id]: [optionId] };
      return { ...prev, [q.id]: cur.includes(optionId) ? cur.filter((id) => id !== optionId) : [...cur, optionId] };
    });
  };

  const handleNext = () => {
    if (!currentQuestion) return;
    const selected = answers[currentQuestion.id] ?? [];
    if (selected.length === 0) { setValidationMessage('សូមជ្រើសរើសចម្លើយយ៉ាងតិចមួយ មុននឹងបន្ត។'); return; }
    if (currentIndex < assessmentQuestions.length - 1) { setCurrentIndex((i) => i + 1); setValidationMessage(''); return; }
    setPendingConfirmation('submit');
  };

  const handleBack = () => {
    if (currentIndex > 0) { setCurrentIndex((i) => i - 1); setValidationMessage(''); }
  };

  useEffect(() => {
    if (screen !== 'analysis' || !result) return;
    const t = setTimeout(() => setScreen('results'), 4200);
    return () => clearTimeout(t);
  }, [screen, result]);

  if (screen === 'welcome') return <WelcomeScreen onStart={() => { setScreen('assessment'); setCurrentIndex(0); setValidationMessage(''); }} />;

  if (screen === 'assessment' && currentQuestion) {
    return (
      <AssessmentScreen
        question={currentQuestion} questionIndex={currentIndex} total={TOTAL_QUESTIONS}
        selected={selectedOptions} onSelect={handleSelect}
        onBack={handleBack} onClose={handleCloseAssessment} onNext={handleNext}
        isFirst={currentIndex === 0} isLast={currentIndex === TOTAL_QUESTIONS - 1}
        validationMessage={validationMessage} confirmation={pendingConfirmation}
        onCancelConfirmation={() => setPendingConfirmation(null)} onConfirmConfirmation={handleConfirmAction}
      />
    );
  }

  if (screen === 'analysis') return <AnalysisScreen />;

  if (screen === 'results' && result) {
    return <ResultsScreen result={result} onRetake={() => {
      setAnswers({}); setCurrentIndex(0); setScreen('welcome'); setValidationMessage(''); setResult(null);
    }} />;
  }

  return null;
}
