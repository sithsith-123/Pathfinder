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
  website: string;
  teaching_languages?: string[];
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
    if (a.matchType === b.matchType) return 0;
    return a.matchType === 'exact' ? -1 : 1;
  });

  return matches;
}
