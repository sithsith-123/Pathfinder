export type DimensionKey = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
export type TraitGroup = 'academic' | 'strengths' | 'work' | 'values' | 'ambitions' | 'personal';
export type Screen = 'welcome' | 'assessment' | 'analysis' | 'results';

export interface QuestionOption {
  id: string;
  label: string;
  scores: Partial<Record<DimensionKey, number>>;
  tags: Partial<Record<TraitGroup, string[]>>;
}

export interface Question {
  id: string;
  category: string;
  prompt: string;
  allowMultiple?: boolean;
  options: QuestionOption[];
}

export interface BaseRecommendation {
  name: string;
  nameEnglish: string;
  description: string;
  reason: string;
  tags: string[];
  dimensions: Partial<Record<DimensionKey, number>>;
  alignment: string;
}

export interface RecommendationItem extends BaseRecommendation {
  subjects: string[];
  skills: string[];
  learningAreas: string[];
  challenges: string[];
}

export interface CareerRecommendation {
  title: string;
  titleEnglish: string;
  description: string;
  reason: string;
  responsibilities: string[];
  skills: string[];
  relatedMajors: string[];
  tags: string[];
  dimensions: Partial<Record<DimensionKey, number>>;
  alignment: string;
}

export interface DevelopmentOpportunity {
  title: string;
  points: string[];
}

export interface AssessmentResult {
  dimensionScores: Record<DimensionKey, number>;
  normalizedScores: Record<DimensionKey, number>;
  topDimensions: DimensionKey[];
  profileSummary: string;
  majorRecommendations: RecommendationItem[];
  careerRecommendations: CareerRecommendation[];
  reasoning: string[];
  developmentOpportunities: DevelopmentOpportunity[];
  alternativePaths: string[];
}
