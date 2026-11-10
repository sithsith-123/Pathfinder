import { careers } from '@/data/careers';
import { majors } from '@/data/majors';
import { assessmentQuestions } from '@/data/questions-km';
import type { CareerRecommendation, DimensionKey, RecommendationItem } from '@/types/assessment';

const dimensionOrder: DimensionKey[] = ['R', 'I', 'A', 'S', 'E', 'C'];

function getSelectedTraits(answers: Record<string, string[]>) {
  const traitSet = new Set<string>();

  for (const question of assessmentQuestions) {
    const selected = answers[question.id] ?? [];
    for (const optionId of selected) {
      const option = question.options.find((item) => item.id === optionId);
      if (!option) continue;
      for (const traitGroup of Object.values(option.tags)) {
        for (const tag of traitGroup ?? []) {
          traitSet.add(tag.toLowerCase());
        }
      }
    }
  }

  return traitSet;
}

function matchScore(item: { tags: string[]; dimensions: Partial<Record<DimensionKey, number>> }, normalized: Record<DimensionKey, number>, traitSet: Set<string>, topDimensions: DimensionKey[]) {
  const dimensionTotal = dimensionOrder.reduce((sum, key) => {
    const weight = item.dimensions[key] ?? 0;
    return sum + (weight * normalized[key]) / 100;
  }, 0);

  const tagMatch = item.tags.reduce((sum, tag) => sum + (traitSet.has(tag.toLowerCase()) ? 1 : 0), 0);
  const topDimensionBonus = topDimensions.reduce((sum, key) => sum + (item.dimensions[key] ?? 0), 0);

  return dimensionTotal * 0.68 + tagMatch * 7 + topDimensionBonus * 2.8;
}

export function generateMajorRecommendations(
  answers: Record<string, string[]>,
  normalizedScores: Record<DimensionKey, number>,
  topDimensions: DimensionKey[],
): RecommendationItem[] {
  const traitSet = getSelectedTraits(answers);

  const scored = majors
    .map((major) => ({
      ...major,
      score: matchScore(major, normalizedScores, traitSet, topDimensions),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((entry) => ({
      name: entry.name,
      nameEnglish: entry.nameEnglish,
      description: entry.description,
      reason: entry.reason,
      subjects: entry.subjects,
      skills: entry.skills,
      learningAreas: entry.learningAreas,
      challenges: entry.challenges,
      tags: entry.tags,
      dimensions: entry.dimensions,
      alignment: entry.alignment,
    }));

  return scored;
}

export function generateCareerRecommendations(
  answers: Record<string, string[]>,
  normalizedScores: Record<DimensionKey, number>,
  topDimensions: DimensionKey[],
): CareerRecommendation[] {
  const traitSet = getSelectedTraits(answers);

  const scored = careers
    .map((career) => ({
      ...career,
      score: matchScore(career, normalizedScores, traitSet, topDimensions),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((entry) => ({
      title: entry.title,
      titleEnglish: entry.titleEnglish,
      description: entry.description,
      responsibilities: entry.responsibilities,
      skills: entry.skills,
      relatedMajors: entry.relatedMajors,
      reason: entry.reason,
      tags: entry.tags,
      dimensions: entry.dimensions,
      alignment: entry.alignment,
    }));

  return scored;
}
