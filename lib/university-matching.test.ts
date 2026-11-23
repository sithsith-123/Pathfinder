import test from 'node:test';
import assert from 'node:assert/strict';
import { majorNameToKey, matchMajorToUniversities, type University } from '@/lib/university-matching';

test('majorNameToKey normalizes English major names to university keys', () => {
  assert.equal(majorNameToKey('Computer Science'), 'computer_science');
  assert.equal(majorNameToKey('Civil Engineering'), 'civil_engineering');
  assert.equal(majorNameToKey('  Tourism and Hospitality Management '), 'tourism_and_hospitality_management');
  assert.equal(majorNameToKey(''), '');
});

test('finds exact university matches with tuition and admission data, listed before related matches', () => {
  const matches = matchMajorToUniversities('computer_science');

  assert.ok(matches.length >= 3);
  assert.equal(matches[0].matchType, 'exact');

  const exact = matches.filter((match) => match.matchType === 'exact');
  assert.ok(exact.length >= 3);
  const rupp = exact.find((m) => m.university.short_name === 'RUPP');
  assert.ok(rupp);
  assert.equal(rupp.faculty.name_en, 'Faculty of Science');
  assert.equal(rupp.major.tuition_per_year_usd, 500);
  assert.ok((rupp.major.admission_requirements ?? []).length > 0);
});

test('finds matches for software engineering with exact degrees', () => {
  const matches = matchMajorToUniversities('software_engineering');

  assert.ok(matches.length >= 3);
  assert.equal(matches[0].matchType, 'exact');
  const exactMajors = matches.filter((m) => m.matchType === 'exact');
  assert.ok(exactMajors.length >= 2);
});

test('returns exact matches before related matches across faculties', () => {
  const fixture: University[] = [
    {
      id: 'fixture',
      name_en: 'Fixture University',
      name_km: 'សាកលវិទ្យាល័យគំរូ',
      short_name: 'FIX',
      location: 'Phnom Penh, Cambodia',
      website: 'https://example.edu.kh',
      faculties: [
        {
          name_en: 'Faculty of Related',
          name_km: 'វិទ្យាសាលាជិតស្និទ្ធ',
          majors: [
            {
              key: 'chemistry',
              name_en: 'Chemistry',
              name_km: 'គីមីវិទ្យា',
              related_majors: ['physics'],
            },
          ],
        },
        {
          name_en: 'Faculty of Exact',
          name_km: 'វិទ្យាសាលាដូចគ្នា',
          majors: [
            {
              key: 'physics',
              name_en: 'Physics',
              name_km: 'រូបវិទ្យា',
            },
          ],
        },
      ],
    },
  ];

  const matches = matchMajorToUniversities('physics', fixture);

  assert.equal(matches.length, 2);
  assert.equal(matches[0].matchType, 'exact');
  assert.equal(matches[0].major.key, 'physics');
  assert.equal(matches[1].matchType, 'related');
  assert.equal(matches[1].major.key, 'chemistry');
});

test('returns an empty list when no university offers the major', () => {
  assert.deepEqual(matchMajorToUniversities('non_existent_unsupported_major'), []);
  assert.deepEqual(matchMajorToUniversities(''), []);
});

test('tolerates universities without faculties or majors', () => {
  const fixture: University[] = [
    {
      id: 'bare',
      name_en: 'Bare University',
      name_km: 'សាកលវិទ្យាល័យទំនេរ',
      short_name: 'BARE',
      location: 'Siem Reap, Cambodia',
      website: 'https://example.edu.kh',
    },
  ];

  assert.deepEqual(matchMajorToUniversities('computer_science', fixture), []);
});

test('filters matches by province', () => {
  const matches = matchMajorToUniversities('computer_science');
  const siemReapMatches = matches.filter(m => m.university.province === 'Siem Reap');
  assert.ok(siemReapMatches.length >= 1);

  const battambangMatches = matches.filter(m => m.university.province === 'Battambang');
  assert.ok(battambangMatches.length >= 1);
});
