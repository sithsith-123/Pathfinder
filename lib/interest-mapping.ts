import { DimensionKey } from '@/types/assessment';

// Mapping from RIASEC dimensions to interest categories
// Each interest category has weighted contributions from RIASEC dimensions
// Weights are normalized to sum to 1 for each interest category, with 0 for unused dimensions
const interestToRiasecMap: Record<string, Record<DimensionKey, number>> = {
  // Technology/technical fields - analytical, logical, systematic thinking
  technology: { I: 0.35, C: 0.3, E: 0.2, R: 0.1, A: 0, S: 0 },
  // Mathematics/analytical problem-solving
  mathematics: { I: 0.4, R: 0.3, C: 0.2, E: 0.1, A: 0, S: 0 },
  // Analytical problem-solving
  analytical_problem_solving: { I: 0.45, R: 0.3, C: 0.15, E: 0.1, A: 0, S: 0 },
  // Biology/healthcare/science - investigative + social
  biology: { I: 0.3, S: 0.3, C: 0.2, E: 0.1, R: 0, A: 0 },
  chemistry: { I: 0.4, C: 0.3, E: 0.2, R: 0.1, A: 0, S: 0 },
  healthcare: { S: 0.35, I: 0.3, C: 0.2, E: 0.15, R: 0, A: 0 },
  // Communication/creative/social
  communication: { S: 0.4, E: 0.3, I: 0.2, A: 0.1, R: 0, C: 0 },
  creativity: { A: 0.4, E: 0.3, I: 0.2, S: 0.1, R: 0, C: 0 },
  // Business/social interaction
  business: { E: 0.4, C: 0.3, S: 0.2, I: 0.1, R: 0, A: 0 },
  social_interaction: { S: 0.4, E: 0.3, I: 0.2, C: 0.1, R: 0, A: 0 },
  // Engineering/technical
  engineering: { R: 0.3, I: 0.3, C: 0.2, E: 0.2, A: 0, S: 0 },
  // Science/research
  science: { I: 0.5, C: 0.3, R: 0.1, E: 0.1, A: 0, S: 0 },
  // Agriculture/environment
  agriculture: { R: 0.3, S: 0.3, I: 0.2, C: 0.2, A: 0, E: 0 },
  environment: { R: 0.3, S: 0.3, I: 0.2, C: 0.2, A: 0, E: 0 },
};

// Convert RIASEC normalized scores to interest category scores
// Each interest score is a weighted sum of the RIASEC dimensions
export function riasecToInterestScores(
  normalizedScores: Record<DimensionKey, number>
): Record<string, number> {
  const interestScores: Record<string, number> = {};

  for (const [interest, riasecWeights] of Object.entries(interestToRiasecMap)) {
    let score = 0;
    for (const [dimension, weight] of Object.entries(riasecWeights) as [DimensionKey, number][]) {
      const scoreValue = (normalizedScores[dimension] ?? 0) * weight;
      score += scoreValue;
    }
    interestScores[interest] = Math.round(score);
  }

  return interestScores;
}

// Get the strongest interest categories based on converted scores
export function getStrongestInterests(
  interestScores: Record<string, number>,
  count = 3
): Array<{ key: string; score: number }> {
  return Object.entries(interestScores)
    .filter(([_, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([key, score]) => ({ key, score }));
}
