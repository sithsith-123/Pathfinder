'use client';

import { ChevronDown, GraduationCap } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { majors } from '@/data/majors';
import { majorNameToKey } from '@/lib/university-matching';

interface MajorSelectorProps {
  selectedMajorKey: string | null;
  onChange: (majorKey: string) => void;
  availableMajors: string[];
  totalUniversities?: number;
}

export function MajorSelector({ selectedMajorKey, onChange, availableMajors, totalUniversities }: MajorSelectorProps) {
  // Filter majors to only those that have university matches
  const filteredMajors = majors.filter((m) => availableMajors.includes(majorNameToKey(m.nameEnglish)));

  return (
    <div className="flex items-center gap-2 shrink-0">
      <GraduationCap className="h-4 w-4 text-accent" />
      <label htmlFor="major-selector" className="sr-only">
        ជ្រើសរើសជំនាញ
      </label>
      <select
        id="major-selector"
        value={selectedMajorKey ?? ''}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          const key = e.target.value;
          if (key) onChange(key);
        }}
        className="cursor-pointer rounded-[6px] border border-border bg-white px-3 py-1.5 font-sans text-xs font-bold text-primary shadow-sm hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring min-w-[280px]"
      >
        <option value="">ជ្រើសរើសជំនាញដើម្បីមើលសាកលវិទ្យាល័យ</option>
        {filteredMajors.map((major) => (
          <option key={major.nameEnglish} value={majorNameToKey(major.nameEnglish)}>
            {major.name} ({major.nameEnglish})
          </option>
        ))}
      </select>
      {totalUniversities && selectedMajorKey && (
        <span className="badge-pop rounded-[6px] bg-accent/10 px-2.5 py-1 font-sans text-xs font-semibold text-accent">
          {totalUniversities} សាលា
        </span>
      )}
    </div>
  );
}