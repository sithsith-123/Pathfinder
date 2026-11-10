import test from 'node:test';
import assert from 'node:assert/strict';
import { careers } from '@/data/careers';
import { majors } from '@/data/majors';
import { assessmentQuestions } from '@/data/questions-km';
import { getAssessmentResults } from '@/lib/scoring';

function buildAnswerMap(selection: 'realistic' | 'creative' | 'balanced') {
  const answers: Record<string, string[]> = {};

  assessmentQuestions.forEach((question, index) => {
    const optionMap = {
      realistic: question.options[0].id,
      creative: question.options[2]?.id ?? question.options[0].id,
      balanced: question.options[index % 2 === 0 ? 0 : 2]?.id ?? question.options[0].id,
    };

    answers[question.id] = [optionMap[selection]];
  });

  return answers;
}

test('realistic-heavy profile produces a realistic top dimension and recommendations', () => {
  const result = getAssessmentResults(assessmentQuestions, buildAnswerMap('realistic'));

  assert.equal(result.topDimensions[0], 'R');
  assert.equal(result.majorRecommendations.length, 10);
  assert.equal(result.careerRecommendations.length, 10);
  assert.ok(result.profileSummary.length > 0);
});

test('creative-heavy profile still returns valid recommendations and explains the profile', () => {
  const result = getAssessmentResults(assessmentQuestions, buildAnswerMap('creative'));

  assert.ok(['A', 'E'].includes(result.topDimensions[0]));
  assert.ok(result.reasoning.length >= 3);
  assert.ok(result.alternativePaths.length > 0);
});

test('balanced profile keeps scores within 0-100 normalized range', () => {
  const result = getAssessmentResults(assessmentQuestions, buildAnswerMap('balanced'));

  for (const score of Object.values(result.normalizedScores)) {
    assert.ok(score >= 0 && score <= 100);
  }
});

test('assessment contains exactly twenty unique Khmer questions', () => {
  assert.equal(assessmentQuestions.length, 20);
  assert.deepEqual(
    assessmentQuestions.map((question) => question.id),
    Array.from({ length: 20 }, (_, index) => `q${index + 1}`),
  );

  for (const question of assessmentQuestions) {
    assert.match(question.category, /[\u1780-\u17FF]/);
    assert.match(question.prompt, /[\u1780-\u17FF]/);
    assert.equal(question.options.length, 6);
    for (const option of question.options) {
      assert.match(option.label, /[\u1780-\u17FF]/);
    }
  }
});

test('all six RIASEC dimensions and recommendation tag groups are represented', () => {
  const expectedDimensions = ['R', 'I', 'A', 'S', 'E', 'C'] as const;
  const expectedTagGroups = ['academic', 'strengths', 'work', 'values', 'ambitions'];
  const tagGroups = new Set<string>();

  for (let optionIndex = 0; optionIndex < expectedDimensions.length; optionIndex += 1) {
    const answers = Object.fromEntries(
      assessmentQuestions.map((question) => [question.id, [question.options[optionIndex].id]]),
    );
    const result = getAssessmentResults(assessmentQuestions, answers);

    assert.ok(result.dimensionScores[expectedDimensions[optionIndex]] > 0);
    assert.equal(result.topDimensions[0], expectedDimensions[optionIndex]);
    assert.equal(result.majorRecommendations.length, 10);
    assert.equal(result.careerRecommendations.length, 10);
  }

  for (const question of assessmentQuestions) {
    for (const option of question.options) {
      Object.keys(option.tags).forEach((group) => tagGroups.add(group));
    }
  }

  for (const group of expectedTagGroups) {
    assert.ok(tagGroups.has(group), `missing recommendation tag group: ${group}`);
  }
});

test('all displayed recommendation copy is in Khmer', () => {
  const khmerText = /[\u1780-\u17FF]/;
  const displayedCopy = [
    ...majors.flatMap((major) => [
      major.name,
      major.description,
      major.reason,
      major.alignment,
      ...major.subjects,
      ...major.skills,
      ...major.learningAreas,
    ]),
    ...careers.flatMap((career) => [
      career.title,
      career.description,
      career.reason,
      career.alignment,
      ...career.responsibilities,
      ...career.skills,
      ...career.relatedMajors,
    ]),
  ];

  for (const text of displayedCopy) {
    assert.match(text, khmerText);
  }
});

test('major and career catalogs provide twenty Khmer-English recommendations', () => {
  assert.equal(majors.length, 20);
  assert.equal(careers.length, 20);

  for (const major of majors) {
    assert.match(major.name, /[\u1780-\u17FF]/);
    assert.match(major.nameEnglish, /[A-Za-z]/);
  }

  for (const career of careers) {
    assert.match(career.title, /[\u1780-\u17FF]/);
    assert.match(career.titleEnglish, /[A-Za-z]/);
  }
});

test('different answer patterns produce different score profiles', () => {
  const profiles = Array.from({ length: 6 }, (_, optionIndex) => {
    const answers = Object.fromEntries(
      assessmentQuestions.map((question) => [question.id, [question.options[optionIndex].id]]),
    );
    return getAssessmentResults(assessmentQuestions, answers).topDimensions[0];
  });

  assert.ok(new Set(profiles).size >= 4);
});
