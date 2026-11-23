'use client';

import { Filter } from 'lucide-react';
import type { ChangeEvent } from 'react';

interface Province {
  en: string;
  km: string;
  count: number;
}

interface ProvinceFilterProps {
  selectedProvince: string;
  onChange: (province: string) => void;
  availableProvinces: Province[];
  totalCount: number;
}

export function ProvinceFilter({ selectedProvince, onChange, availableProvinces, totalCount }: ProvinceFilterProps) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <Filter className="h-4 w-4 text-accent" />
      <label htmlFor="province-filter" className="sr-only">
        ជ្រើសរើសខេត្ត/ក្រុង
      </label>
      <select
        id="province-filter"
        value={selectedProvince}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="cursor-pointer rounded-[6px] border border-border bg-white px-3 py-1.5 font-sans text-xs font-bold text-primary shadow-sm hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      >
        <option value="all">គ្រប់ ២៥ ខេត្ត/រាជធានី (សរុប {totalCount})</option>
        {availableProvinces.map((p) => (
          <option key={p.en} value={p.en}>
            {p.km} ({p.count})
          </option>
        ))}
      </select>
    </div>
  );
}