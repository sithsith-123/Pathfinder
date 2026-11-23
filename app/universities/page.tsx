'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Building2, Compass, Filter, GraduationCap, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { majors } from '@/data/majors';
import { majorNameToKey, matchMajorToUniversities, filterMatchesByProvince, type UniversityMatch } from '@/lib/university-matching';
import { UniversityCard, ProvinceFilter, MajorSelector } from '@/components/university';
import { UniversityTexts } from '@/lib/university-text';

export default function UniversitiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const universitySectionRef = useRef<HTMLElement>(null);

  // Initialize state from URL params
  const initialMajorKey = searchParams.get('major') || null;
  const initialProvince = searchParams.get('province') || 'all';

  const [selectedMajorKey, setSelectedMajorKey] = useState<string | null>(initialMajorKey);
  const [selectedProvince, setSelectedProvince] = useState<string>(initialProvince);
  const [showAllMatches, setShowAllMatches] = useState<boolean>(false);

  // Update URL when state changes
  const updateURL = (majorKey: string | null, province: string) => {
    const params = new URLSearchParams();
    if (majorKey) params.set('major', majorKey);
    if (province !== 'all') params.set('province', province);
    const url = `/universities${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url, { scroll: false });
  };

  // Sync state with URL on mount (for back/forward navigation)
  useEffect(() => {
    const majorFromURL = searchParams.get('major');
    const provinceFromURL = searchParams.get('province') || 'all';
    setSelectedMajorKey(majorFromURL);
    setSelectedProvince(provinceFromURL);
    setShowAllMatches(false);
  }, [searchParams]);

  // Scroll to results when major changes
  useEffect(() => {
    if (!selectedMajorKey || !universitySectionRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    universitySectionRef.current.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
  }, [selectedMajorKey]);

  // Get all university matches for the selected major
  const allUniversityMatches = useMemo(() => {
    if (!selectedMajorKey) return [];
    return matchMajorToUniversities(selectedMajorKey);
  }, [selectedMajorKey]);

  // Get available provinces with counts
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

  // Filter matches by selected province
  const filteredMatches = useMemo(() => {
    return filterMatchesByProvince(allUniversityMatches, selectedProvince);
  }, [allUniversityMatches, selectedProvince]);

  // Determine displayed matches (top 3 or all)
  const displayedMatches = useMemo(() => {
    if (showAllMatches || selectedProvince !== 'all') {
      return filteredMatches;
    }
    return filteredMatches.slice(0, 3);
  }, [filteredMatches, showAllMatches, selectedProvince]);

  // Find selected major info for display
  const selectedMajor = useMemo(() => {
    if (!selectedMajorKey) return null;
    return majors.find((m) => majorNameToKey(m.nameEnglish) === selectedMajorKey) ?? null;
  }, [selectedMajorKey]);

  const handleMajorChange = (majorKey: string) => {
    setSelectedMajorKey(majorKey);
    setSelectedProvince('all');
    setShowAllMatches(false);
    updateURL(majorKey, 'all');
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setShowAllMatches(true);
    updateURL(selectedMajorKey, province);
  };

  const handleClearMajor = () => {
    setSelectedMajorKey(null);
    setSelectedProvince('all');
    setShowAllMatches(false);
    router.push('/universities', { scroll: false });
  };

  const handleViewAllToggle = () => {
    setShowAllMatches(!showAllMatches);
    if (!showAllMatches) {
      updateURL(selectedMajorKey, selectedProvince);
    }
  };

  const handleBackToTop3 = () => {
    setSelectedProvince('all');
    setShowAllMatches(false);
    updateURL(selectedMajorKey, 'all');
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="site-header px-6 py-4 sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/"
            className="btn-ghost inline-flex items-center gap-2 rounded-[8px] border border-border bg-white px-3 py-2 text-sm font-medium text-primary transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {UniversityTexts.backToPathfinder}
          </Link>
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Pathfinder</span>
        </div>
      </header>

      <main className="px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="section-enter rounded-[12px] border border-border bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2 rounded-[6px] border border-accent/20 bg-accent/5 px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-accent">
              <Compass className="h-3.5 w-3.5" />
              <span>{UniversityTexts.universityDirectory}</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl">{UniversityTexts.findUniversities}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-secondary">{UniversityTexts.findUniversitiesDesc}</p>
          </section>

          <section className="section-enter rounded-[12px] border border-border bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <MajorSelector
                selectedMajorKey={selectedMajorKey}
                onChange={handleMajorChange}
                availableMajors={allUniversityMatches.map((m) => m.major.key)}
                totalUniversities={allUniversityMatches.length}
              />
              {selectedMajorKey && (
                <ProvinceFilter
                  selectedProvince={selectedProvince}
                  onChange={handleProvinceChange}
                  availableProvinces={availableProvinces}
                  totalCount={allUniversityMatches.length}
                />
              )}
              {selectedMajorKey && (
                <button
                  type="button"
                  onClick={handleClearMajor}
                  className="btn-ghost inline-flex items-center gap-1.5 rounded-[8px] border border-border bg-white px-3 py-2 font-sans text-xs font-bold text-secondary shadow-xs transition hover:border-accent/40 hover:text-accent"
                >
                  <X className="h-3.5 w-3.5" />
                  {UniversityTexts.clearSelection}
                </button>
              )}
            </div>
          </section>

          {selectedMajor ? (
            <section
              id="university-section"
              ref={universitySectionRef}
              aria-labelledby="university-section-title"
              className="section-enter rounded-[12px] border border-border bg-white p-6 sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-[6px] bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{UniversityTexts.foundUniversities} {allUniversityMatches.length} {UniversityTexts.universitiesInCambodia}</span>
                  </div>
                  <h2 id="university-section-title" className="font-sans text-xl font-bold text-primary sm:text-2xl">
                    {UniversityTexts.universitiesFor} {selectedMajor.name}
                  </h2>
                  <p className="mt-0.5 font-sans text-sm font-semibold text-secondary">{selectedMajor.nameEnglish}</p>
                </div>
                <button
                  type="button"
                  onClick={handleClearMajor}
                  aria-label={UniversityTexts.close}
                  className="btn-ghost inline-flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-[6px] border border-border text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-3.5 rounded-[10px] border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-sans text-xs font-bold uppercase tracking-wider text-accent">
                    {selectedProvince === 'all' && !showAllMatches
                      ? UniversityTexts.top3Recommended
                      : `${UniversityTexts.selectedUniversities} (${filteredMatches.length} ${UniversityTexts.schools})`}
                  </p>
                  <p className="mt-0.5 font-sans text-xs text-secondary">
                    {selectedProvince === 'all' && !showAllMatches
                      ? UniversityTexts.top3Description
                      : selectedProvince !== 'all'
                      ? UniversityTexts.provinceSelectedDescription
                      : UniversityTexts.allProvincesDescription}
                  </p>
                </div>
              </div>

              {filteredMatches.length === 0 ? (
                <div className="mt-5 rounded-[8px] border border-border bg-surface p-6 text-center">
                  <p className="font-sans text-base font-bold text-primary">{UniversityTexts.noUniversitiesInProvince}</p>
                  <p className="mt-1 font-sans text-xs text-secondary">{UniversityTexts.noUniversitiesInProvinceHint}</p>
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

              {allUniversityMatches.length > 3 && selectedProvince === 'all' && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleViewAllToggle}
                    className="inline-flex items-center gap-2 rounded-[8px] border border-accent/40 bg-accent/5 px-5 py-2.5 font-sans text-xs font-bold text-accent transition-colors hover:bg-accent/10"
                  >
                    {showAllMatches
                      ? UniversityTexts.collapseToTop3
                      : `${UniversityTexts.viewAllByProvince} (${UniversityTexts.schools} ${allUniversityMatches.length})`}
                    <Filter className={`h-4 w-4 transition-transform duration-200 ${showAllMatches ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}

              {selectedProvince !== 'all' && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleBackToTop3}
                    className="btn-ghost inline-flex items-center gap-1.5 rounded-[8px] border border-border bg-white px-4 py-2 font-sans text-xs font-bold text-primary shadow-xs transition hover:border-accent/40 hover:text-accent"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    {UniversityTexts.backToTop3}
                  </button>
                </div>
              )}
            </section>
          ) : (
            <section className="section-enter rounded-[12px] border border-border bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-primary sm:text-2xl">{UniversityTexts.selectMajorToStart}</h2>
              <p className="mt-2 text-sm leading-6 text-secondary">{UniversityTexts.selectMajorDesc}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {majors.map((major) => {
                  const majorKey = majorNameToKey(major.nameEnglish);
                  const majorMatches = matchMajorToUniversities(majorKey);
                  const hasMatches = majorMatches.length > 0;

                  return (
                    <button
                      key={major.name}
                      onClick={() => handleMajorChange(majorKey)}
                      disabled={!hasMatches}
                      className={`recommendation-card cursor-pointer rounded-[12px] border p-5 text-left transition-colors ${
                        hasMatches
                          ? 'border-border bg-surface hover:border-accent/40 hover:bg-accent/5'
                          : 'border-border/50 bg-surface/50 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-primary">{major.name}</h4>
                          <p className="mt-0.5 text-xs text-secondary">{major.nameEnglish}</p>
                        </div>
                        <span className="shrink-0 rounded-[6px] bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                          {hasMatches ? `${majorMatches.length} ${UniversityTexts.schools}` : UniversityTexts.noData}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-secondary line-clamp-2">{major.description}</p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-accent">
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>{hasMatches ? UniversityTexts.viewUniversities : UniversityTexts.noSchoolsAvailable}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}