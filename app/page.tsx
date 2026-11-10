'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Compass, Sparkles, TrendingUp, BrainCircuit, RotateCcw, BriefcaseBusiness, X } from 'lucide-react';
import { assessmentQuestions } from '@/data/questions-km';
import { getAssessmentResults } from '@/lib/scoring';
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
function ConfirmationDialog({
  intent,
  onCancel,
  onConfirm,
}: {
  intent: ConfirmationIntent;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const isSubmit = intent === 'submit';

  return (
    <div className="dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <section
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-description"
        aria-modal="true"
        className="dialog-panel w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl sm:p-7"
        onKeyDown={(event) => {
          if (event.key === 'Escape') onCancel();
        }}
        role="alertdialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="confirmation-title" className="text-xl font-semibold text-primary">
              {isSubmit ? 'បញ្ជាក់ការបញ្ជូនចម្លើយ' : 'ត្រឡប់ទៅទំព័រដើម?'}
            </h2>
            <p id="confirmation-description" className="mt-3 text-sm leading-6 text-secondary">
              {isSubmit
                ? 'តើអ្នកប្រាកដថាចង់បញ្ជូនចម្លើយទាំង ២០ របស់អ្នកមែនទេ?'
                : 'ចម្លើយដែលអ្នកបានជ្រើសរើសនឹងត្រូវលុប។ តើអ្នកចង់បិទសំណួរ ហើយត្រឡប់ទៅទំព័រដើមមែនទេ?'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="បិទប្រអប់បញ្ជាក់"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-secondary transition-colors hover:bg-slate-100 hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="rounded-full border border-border px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            បន្ត
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#102545] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            {isSubmit ? 'បញ្ជូនចម្លើយ' : 'បិទ ហើយត្រឡប់ទៅទំព័រដើម'}
          </button>
        </div>
      </section>
    </div>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="screen-enter min-h-[100svh] bg-surface px-[clamp(12px,4vw,24px)] py-6 text-text sm:py-10">
      <div className="mx-auto flex min-h-[calc(100svh-3rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-3xl rounded-2xl border border-border bg-white p-[clamp(20px,5vw,28px)] shadow-soft sm:rounded-[32px] sm:p-10 lg:p-14">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <Compass className="h-3.5 w-3.5" />
            PATHFINDER
          </div>

          <h1 className="max-w-2xl text-3xl font-semibold leading-[1.75] tracking-normal text-primary sm:text-5xl sm:leading-[1.3]">
            ស្គាល់ចំណាប់អារម្មណ៍ ស្វែងយល់ពីអនាគតរបស់អ្នក
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-secondary sm:mt-6 sm:text-lg sm:leading-8">
            ឆ្លើយសំណួរអំពីចំណាប់អារម្មណ៍ ចំណុចខ្លាំង និងគោលដៅរបស់អ្នក ដើម្បីស្វែងរកជំនាញសាកលវិទ្យាល័យ និងផ្លូវអាជីពដែលអាចសមស្របនឹងអ្នក។
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-sm text-secondary">
            <div className="rounded-full border border-border bg-slate-50 px-3 py-2">២០ សំណួរ</div>
            <div className="rounded-full border border-border bg-slate-50 px-3 py-2">ប្រហែល ៤–៦ នាទី</div>
            <div className="rounded-full border border-border bg-slate-50 px-3 py-2">គ្មានចម្លើយត្រូវ ឬខុសទេ</div>
          </div>

          <button
            onClick={onStart}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#102545] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            ចាប់ផ្តើមការវាយតម្លៃ
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}

function AssessmentScreen({
  question,
  questionIndex,
  total,
  selected,
  onSelect,
  onBack,
  onClose,
  onNext,
  isFirst,
  isLast,
  validationMessage,
  confirmation,
  onCancelConfirmation,
  onConfirmConfirmation,
}: {
  question: Question;
  questionIndex: number;
  total: number;
  selected: string[];
  onSelect: (optionId: string) => void;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  validationMessage?: string;
  confirmation: ConfirmationIntent | null;
  onCancelConfirmation: () => void;
  onConfirmConfirmation: () => void;
}) {
  const progress = ((questionIndex + 1) / total) * 100;

  return (
    <main className="screen-enter min-h-screen bg-surface px-4 py-8 text-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 grid grid-cols-[1fr_auto_auto] items-center gap-2 text-sm font-medium text-secondary">
          <span>សំណួរ {questionIndex + 1} ក្នុងចំណោម {total}</span>
          <span className="max-w-[40vw] truncate rounded-full border border-border bg-white px-3 py-1.5">{question.category}</span>
          <button type="button" onClick={onClose} aria-label="បិទសំណួរ ហើយត្រឡប់ទៅទំព័រដើម" title="បិទ ហើយត្រឡប់ទៅទំព័រដើម" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-secondary transition hover:border-accent/70 hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <p className="mt-5 text-sm leading-6 text-secondary">សូមជ្រើសរើសចម្លើយដែលសមស្របបំផុតនឹងចំណូលចិត្តរបស់អ្នក។ ចម្លើយរបស់អ្នកមិនមានត្រូវ ឬខុសទេ។</p>

        <div className="mt-5 rounded-[30px] border border-border bg-white p-6 shadow-soft sm:p-8 lg:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">{question.prompt}</h2>

          <div className="mt-8 grid gap-3">
            {question.options.map((option) => {
              const isSelected = selected.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onSelect(option.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20'
                      : 'border-border bg-white hover:border-accent/70 hover:bg-slate-50'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold ${
                        isSelected ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white text-slate-400'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                    <span className="text-base font-medium leading-7 text-text">{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {validationMessage ? (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {validationMessage}
            </p>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              disabled={isFirst}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium text-primary transition hover:border-accent/70 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
                      ត្រឡប់ក្រោយ
            </button>

            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102545] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
                      {isLast ? 'បញ្ជូនចម្លើយ' : 'បន្ទាប់'}
              {!isLast ? <ArrowRight className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
      {confirmation ? (
        <ConfirmationDialog
          intent={confirmation}
          onCancel={onCancelConfirmation}
          onConfirm={onConfirmConfirmation}
        />
      ) : null}
    </main>
  );
}

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
    <main className="screen-enter min-h-screen bg-surface px-4 py-8 text-text sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[32px] border border-border bg-white p-8 text-center shadow-soft sm:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-primary">
            <Sparkles className="h-8 w-8 animate-pulse" />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-primary">កំពុងរៀបចំលទ្ធផលរបស់អ្នក...</h2>
          <p className="mt-4 text-base leading-7 text-secondary">
            យើងកំពុងគណនាពិន្ទុតាមចម្លើយរបស់អ្នក និងរៀបចំជម្រើសជំនាញសិក្សា និងអាជីពដែលពាក់ព័ន្ធ។
          </p>

          <div className="mt-8 space-y-4 text-left">
            {ANALYSIS_STEPS.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    index <= activeStep ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {index <= activeStep ? '✓' : index + 1}
                </div>
                <span className={index <= activeStep ? 'font-medium text-primary' : 'text-secondary'}>{step}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
              style={{ width: `${((activeStep + 1) / ANALYSIS_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function ResultsScreen({ result, onRetake }: { result: ReturnType<typeof getAssessmentResults>; onRetake: () => void }) {
  const radarLevels = [20, 40, 60, 80, 100];
  const labelMap: Record<DimensionKey, string> = {
    R: 'ការងារជាក់ស្តែង',
    I: 'ការស្រាវជ្រាវ',
    A: 'ការច្នៃប្រឌិត',
    S: 'ការជួយអ្នកដទៃ',
    E: 'ភាពជាអ្នកដឹកនាំ',
    C: 'ការរៀបចំប្រព័ន្ធ',
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
    const centerX = 160;
    const centerY = 160;
    const radius = 120;

    return DIMENSION_ORDER
      .map((key, index) => {
        const angle = (Math.PI * 2 * index) / DIMENSION_ORDER.length - Math.PI / 2;
        const normalized = result.normalizedScores[key] / 100;
        const distance = radius * normalized;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        return `${x},${y}`;
      })
      .join(' ');
  }, [result.normalizedScores]);

  return (
    <main className="screen-enter min-h-screen bg-surface px-4 py-8 text-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[30px] border border-border bg-white p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">លទ្ធផលរបស់អ្នករួចរាល់ហើយ</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">ការណែនាំពី PATHFINDER</h2>
            </div>
            <button
              onClick={onRetake}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-slate-50 px-4 py-2.5 text-sm font-medium text-primary transition hover:border-accent/70"
            >
              <RotateCcw className="h-4 w-4" />
              ធ្វើការវាយតម្លៃម្តងទៀត
            </button>
          </div>

          <p className="mt-5 max-w-3xl text-base leading-7 text-secondary">
            លទ្ធផលនេះផ្អែកលើចម្លើយដែលអ្នកបានជ្រើសរើស ហើយបង្ហាញជម្រើសជំនាញសិក្សា និងអាជីពមួយចំនួនសម្រាប់ស្វែងយល់បន្ថែម។ វាជាព័ត៌មានណែនាំ មិនមែនជាការសម្រេចចិត្តជំនួសអ្នកអំពីអនាគតរបស់អ្នកទេ។
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[30px] border border-border bg-white p-6 shadow-soft sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold text-primary">ទម្រង់ចំណាប់អារម្មណ៍</h3>
            </div>
            <p className="mb-5 text-sm leading-6 text-secondary">{result.profileSummary}</p>

            <div className="grid gap-6 xl:grid-cols-[1fr_220px]">
              <svg viewBox="0 0 320 320" className="mx-auto w-full max-w-[320px]">
                {radarLevels.map((level) => {
                  const points = DIMENSION_ORDER
                    .map((key, index) => {
                      const angle = (Math.PI * 2 * index) / DIMENSION_ORDER.length - Math.PI / 2;
                      const radius = ((level / 100) * 120);
                      const x = 160 + Math.cos(angle) * radius;
                      const y = 160 + Math.sin(angle) * radius;
                      return `${x},${y}`;
                    })
                    .join(' ');
                  return <polygon key={level} points={points} fill="none" stroke="#E5E9F0" strokeWidth="1" />;
                })}
                {DIMENSION_ORDER.map((key, index) => {
                  const angle = (Math.PI * 2 * index) / DIMENSION_ORDER.length - Math.PI / 2;
                  const x = 160 + Math.cos(angle) * 120;
                  const y = 160 + Math.sin(angle) * 120;
                  const labelX = 160 + Math.cos(angle) * 142;
                  const labelY = 160 + Math.sin(angle) * 142;
                  return (
                    <g key={key}>
                      <line x1="160" y1="160" x2={x} y2={y} stroke="#E5E9F0" strokeWidth="1" />
                      <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" fill="#172B4D" fontSize="12" fontWeight="600">
                        {key}
                      </text>
                    </g>
                  );
                })}
                <polygon points={radarPoints} fill="rgba(71,121,209,0.22)" stroke="#4779D1" strokeWidth="2" />
              </svg>

              <div className="space-y-3">
                {DIMENSION_ORDER.map((key) => (
                  <div key={key} className="rounded-2xl border border-border bg-slate-50 p-3">
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-primary">{labelMap[key]}</span>
                      <span className="font-medium text-secondary">{result.normalizedScores[key]}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${result.normalizedScores[key]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-border bg-white p-6 shadow-soft sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold text-primary">ចំណុចដែលមានពិន្ទុខ្ពស់</h3>
            </div>
            <div className="space-y-4">
              {result.topDimensions.map((key, index) => (
                <div key={key} className="rounded-2xl border border-border bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold uppercase tracking-[0.15em] text-secondary">#{index + 1}</span>
                    <span className="rounded-full bg-primary/5 px-2 py-1 text-xs font-semibold text-primary">{labelMap[key]}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-secondary">
                    {dimensionDescriptions[key]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-border bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Compass className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-primary">ជំនាញសាកលវិទ្យាល័យដែលបានណែនាំ ១០</h3>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {result.majorRecommendations.map((major, index) => (
              <article key={major.name} style={{ animationDelay: `${index * 45}ms` }} className="recommendation-card rounded-2xl border border-border bg-slate-50 p-5">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0">
                    <h4 className="text-lg font-semibold text-primary">{major.name}</h4>
                    <p className="mt-1 text-sm font-medium text-secondary">{major.nameEnglish}</p>
                  </div>
                  <span className="justify-self-start whitespace-nowrap rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent sm:justify-self-end">{major.alignment}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-secondary">{major.description}</p>
                <p className="mt-3 text-sm text-text"><span className="font-semibold">មូលហេតុដែលអាចសមស្រប៖</span> {major.reason}</p>
                <div className="mt-4 space-y-2 text-sm text-secondary">
                  <div><span className="font-semibold text-primary">មុខវិជ្ជា៖</span> {major.subjects.join(' • ')}</div>
                  <div><span className="font-semibold text-primary">ជំនាញ៖</span> {major.skills.join(' • ')}</div>
                  <div><span className="font-semibold text-primary">អ្វីដែលត្រូវសិក្សា៖</span> {major.learningAreas.join(' • ')}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-border bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <BriefcaseBusiness className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-primary">ផ្លូវអាជីពដែលអាចសាកសម ១០</h3>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {result.careerRecommendations.map((career, index) => (
              <article key={career.title} style={{ animationDelay: `${index * 45}ms` }} className="recommendation-card rounded-2xl border border-border bg-slate-50 p-5">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0">
                    <h4 className="text-lg font-semibold text-primary">{career.title}</h4>
                    <p className="mt-1 text-sm font-medium text-secondary">{career.titleEnglish}</p>
                  </div>
                  <span className="justify-self-start whitespace-nowrap rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success sm:justify-self-end">{career.alignment}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-secondary">{career.description}</p>
                <div className="mt-4 space-y-2 text-sm text-secondary">
                  <div><span className="font-semibold text-primary">ភារកិច្ច៖</span> {career.responsibilities.join(' • ')}</div>
                  <div><span className="font-semibold text-primary">ជំនាញ៖</span> {career.skills.join(' • ')}</div>
                  <div><span className="font-semibold text-primary">ជំនាញសិក្សាដែលពាក់ព័ន្ធ៖</span> {career.relatedMajors.join(' • ')}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-border bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-primary">ហេតុអ្វីបានជាមានការណែនាំទាំងនេះ?</h3>
          </div>
          <ul className="space-y-3 text-sm leading-6 text-secondary">
            {result.reasoning.map((reason) => (
              <li key={reason} className="flex items-start gap-3 rounded-2xl border border-border bg-slate-50 p-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-success" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[30px] border border-border bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-primary">ឱកាសអភិវឌ្ឍខ្លួន</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {result.developmentOpportunities.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-slate-50 p-4">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-accent">{item.title}</p>
                <ul className="space-y-2 text-sm leading-6 text-secondary">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-border bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Compass className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-primary">ជម្រើសផ្សេងទៀតសម្រាប់ស្វែងយល់</h3>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-secondary">
            {result.alternativePaths.map((path) => (
              <span key={path} className="rounded-full border border-border bg-slate-50 px-3 py-2">{path}</span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [validationMessage, setValidationMessage] = useState('');
  const [result, setResult] = useState<ReturnType<typeof getAssessmentResults> | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<ConfirmationIntent | null>(null);

  const currentQuestion = assessmentQuestions[currentIndex];

  const selectedOptions = currentQuestion ? answers[currentQuestion.id] ?? [] : [];

  const handleStart = () => {
    setScreen('assessment');
    setCurrentIndex(0);
    setValidationMessage('');
  };

  const returnToWelcome = () => {
    setAnswers({});
    setCurrentIndex(0);
    setValidationMessage('');
    setResult(null);
    setScreen('welcome');
  };

  const handleCloseAssessment = () => {
    const hasAnswers = Object.values(answers).some((selected) => selected.length > 0);
    if (hasAnswers) {
      setPendingConfirmation('close');
      return;
    }
    returnToWelcome();
  };

  const handleConfirmAction = () => {
    const action = pendingConfirmation;
    setPendingConfirmation(null);
    if (action === 'close') {
      returnToWelcome();
    } else if (action === 'submit') {
      setResult(getAssessmentResults(assessmentQuestions, answers));
      setScreen('analysis');
    }
  };

  const handleSelect = (optionId: string) => {
    const question = assessmentQuestions[currentIndex];
    if (!question) return;

    setValidationMessage('');
    setAnswers((prev) => {
      const current = prev[question.id] ?? [];
      if (!question.allowMultiple) {
        return { ...prev, [question.id]: [optionId] };
      }

      return {
        ...prev,
        [question.id]: current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
      };
    });
  };

  const handleNext = () => {
    if (!currentQuestion) return;

    const selected = answers[currentQuestion.id] ?? [];
    if (selected.length === 0) {
      setValidationMessage('សូមជ្រើសរើសចម្លើយយ៉ាងតិចមួយ មុននឹងបន្ត។');
      return;
    }

    if (currentIndex < assessmentQuestions.length - 1) {
      setCurrentIndex((index) => index + 1);
      setValidationMessage('');
      return;
    }

    setPendingConfirmation('submit');
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((index) => index - 1);
      setValidationMessage('');
    }
  };

  useEffect(() => {
    if (screen !== 'analysis' || !result) return;

    const timer = setTimeout(() => {
      setScreen('results');
    }, 4200);

    return () => clearTimeout(timer);
  }, [screen, result]);

  if (screen === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (screen === 'assessment' && currentQuestion) {
    return (
      <AssessmentScreen
        question={currentQuestion}
        questionIndex={currentIndex}
        total={TOTAL_QUESTIONS}
        selected={selectedOptions}
        onSelect={handleSelect}
        onBack={handleBack}
        onClose={handleCloseAssessment}
        onNext={handleNext}
        isFirst={currentIndex === 0}
        isLast={currentIndex === TOTAL_QUESTIONS - 1}
        validationMessage={validationMessage}
        confirmation={pendingConfirmation}
        onCancelConfirmation={() => setPendingConfirmation(null)}
        onConfirmConfirmation={handleConfirmAction}
      />
    );
  }

  if (screen === 'analysis') {
    return <AnalysisScreen />;
  }

  if (screen === 'results' && result) {
    return <ResultsScreen result={result} onRetake={() => {
      setAnswers({});
      setCurrentIndex(0);
      setScreen('welcome');
      setValidationMessage('');
      setResult(null);
    }} />;
  }

  return null;
}
