import universitiesDatabase from '@/universities.json';

export interface UniversityMajor {
  key: string;
  name_en: string;
  name_km: string;
  tuition_per_year_usd?: number | null;
  admission_requirements?: string[];
  scholarships?: string[];
  related_majors?: string[];
}

export interface UniversityFaculty {
  name_en: string;
  name_km: string;
  majors: UniversityMajor[];
}

export interface University {
  id: string;
  name_en: string;
  name_km: string;
  short_name: string;
  location: string;
  province?: string;
  province_km?: string;
  website: string;
  teaching_languages?: string[];
  ranking?: number;
  faculties?: UniversityFaculty[];
}

interface UniversitiesDatabase {
  version: string;
  universities: University[];
}

export interface UniversityMatch {
  university: University;
  faculty: UniversityFaculty;
  major: UniversityMajor;
  matchType: 'exact' | 'related';
}

const database = universitiesDatabase as UniversitiesDatabase;

export const universities: University[] = database.universities ?? [];

export function majorNameToKey(nameEnglish: string): string {
  return nameEnglish
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function matchMajorToUniversities(
  majorKey: string,
  universityList: University[] = universities,
): UniversityMatch[] {
  if (!majorKey) return [];

  const matches: UniversityMatch[] = [];

  for (const university of universityList) {
    for (const faculty of university.faculties ?? []) {
      for (const universityMajor of faculty.majors ?? []) {
        if (universityMajor.key === majorKey) {
          matches.push({ university, faculty, major: universityMajor, matchType: 'exact' });
        } else if (universityMajor.related_majors?.includes(majorKey)) {
          matches.push({ university, faculty, major: universityMajor, matchType: 'related' });
        }
      }
    }
  }

  matches.sort((a, b) => {
    if (a.matchType !== b.matchType) {
      return a.matchType === 'exact' ? -1 : 1;
    }
    const rankA = a.university.ranking ?? 99;
    const rankB = b.university.ranking ?? 99;
    if (rankA !== rankB) return rankA - rankB;
    return a.university.name_en.localeCompare(b.university.name_en);
  });

  return matches;
}

export function filterMatchesByProvince(
  matches: UniversityMatch[],
  selectedProvince: string,
): UniversityMatch[] {
  if (!selectedProvince || selectedProvince === 'all') return matches;
  return matches.filter(
    (m) =>
      m.university.province === selectedProvince ||
      m.university.province_km === selectedProvince ||
      m.university.location.toLowerCase().includes(selectedProvince.toLowerCase()),
  );
}
