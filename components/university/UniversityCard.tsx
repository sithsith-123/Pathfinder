'use client';

import { MapPin, ExternalLink, CheckCircle2, GraduationCap, Building2 } from 'lucide-react';
import type { UniversityMatch } from '@/lib/university-matching';

interface UniversityCardProps {
  match: UniversityMatch;
  rank?: number;
  isTopPick?: boolean;
}

export function UniversityCard({ match, rank, isTopPick }: UniversityCardProps) {
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