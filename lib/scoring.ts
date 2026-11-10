import { assessmentQuestions } from '@/data/questions-km';
import { generateCareerRecommendations, generateMajorRecommendations } from '@/lib/recommendations';
import type { AssessmentResult, DimensionKey, Question } from '@/types/assessment';

export const dimensionOrder: DimensionKey[] = ['R', 'I', 'A', 'S', 'E', 'C'];

const labelMap: Record<DimensionKey, string> = {
  R: 'ការងារជាក់ស្តែង',
  I: 'ការស្រាវជ្រាវ',
  A: 'ការច្នៃប្រឌិត',
  S: 'ការជួយអ្នកដទៃ',
  E: 'ភាពជាអ្នកដឹកនាំ',
  C: 'ការរៀបចំប្រព័ន្ធ',
};

function getMaxPossiblePerDimension(questions: Question[]) {
  return questions.reduce<Record<DimensionKey, number>>((totals, question) => {
    question.options.forEach((option) => {
      dimensionOrder.forEach((dimension) => {
        const value = option.scores[dimension] ?? 0;
        totals[dimension] += value;
      });
    });
    return totals;
  }, { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
}

export function getDimensionTotals(questions: Question[], answers: Record<string, string[]>) {
  return questions.reduce<Record<DimensionKey, number>>(
    (totals, question) => {
      const selected = answers[question.id] ?? [];
      selected.forEach((optionId) => {
        const option = question.options.find((answer) => answer.id === optionId);
        if (!option) return;
        dimensionOrder.forEach((dimension) => {
          totals[dimension] += option.scores[dimension] ?? 0;
        });
      });
      return totals;
    },
    { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
  );
}

export function getNormalizedScores(rawScores: Record<DimensionKey, number>) {
  const maxValues = getMaxPossiblePerDimension(assessmentQuestions);
  return dimensionOrder.reduce<Record<DimensionKey, number>>((normalized, key) => {
    const max = maxValues[key] || 1;
    const value = Math.min(100, Math.round((rawScores[key] / max) * 100));
    normalized[key] = value;
    return normalized;
  }, { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
}

function summarizeProfile(topDimensions: DimensionKey[]) {
  const top = topDimensions.slice(0, 3);
  const first = labelMap[top[0]];
  const second = labelMap[top[1]];
  const third = labelMap[top[2]];

  return `ចម្លើយរបស់អ្នកបង្ហាញពីចំណាប់អារម្មណ៍លើ ${first} ${second} និង ${third}។ អ្នកអាចយកលទ្ធផលនេះទៅស្វែងយល់ពីជម្រើសសិក្សា និងអាជីពបន្ថែម។`;
}

export function getAssessmentResults(
  questions: Question[],
  answers: Record<string, string[]>,
): AssessmentResult {
  const dimensionScores = getDimensionTotals(questions, answers);
  const normalizedScores = getNormalizedScores(dimensionScores);
  const topDimensions = [...dimensionOrder].sort((a, b) => normalizedScores[b] - normalizedScores[a]);
  const profileSummary = summarizeProfile(topDimensions);

  const majorRecommendations = generateMajorRecommendations(answers, normalizedScores, topDimensions);
  const careerRecommendations = generateCareerRecommendations(answers, normalizedScores, topDimensions);

  const reasoning = [
    `ចំណុចដែលមានពិន្ទុខ្ពស់របស់អ្នកគឺ ${labelMap[topDimensions[0]]} និង ${labelMap[topDimensions[1]]}។ ចម្លើយទាំងនេះជួយកំណត់ការណែនាំអំពីជំនាញ ${majorRecommendations[0]?.name ?? 'ដែលពាក់ព័ន្ធ'}។`,
    `ផ្លូវអាជីព ${careerRecommendations[0]?.title ?? 'ដែលពាក់ព័ន្ធ'} អាចសមស្របនឹងចំណូលចិត្តដែលអ្នកបានបង្ហាញតាមរយៈចម្លើយរបស់អ្នក។`,
    `ចំណាប់អារម្មណ៍ផ្នែក ${labelMap[topDimensions[2]]} រួមជាមួយចម្លើយអំពីរបៀបធ្វើការរបស់អ្នក អាចជួយអ្នកស្វែងរកផ្លូវដែលសមនឹងតម្លៃ និងគោលដៅរបស់អ្នក។`,
  ];

  const developmentOpportunities = [
    {
      title: 'ជំនាញសម្រាប់ស្វែងយល់',
      points: [
        'ការទំនាក់ទំនង និងការធ្វើបទបង្ហាញ',
        'ការរៀបចំគម្រោង និងការសម្រេចចិត្ត',
        'ការស្រាវជ្រាវ ទិន្នន័យ ឬការអនុវត្តការរចនា',
      ],
    },
    {
      title: 'មុខវិជ្ជាសម្រាប់ស្វែងយល់បន្ថែម',
      points: [
        'គណិតវិទ្យា និងការគិតបែបវិទ្យាសាស្ត្រ',
        'ការសរសេរ ឬការទំនាក់ទំនងតាមរូបភាព',
        'អាកប្បកិរិយាមនុស្ស និងការគិតជាប្រព័ន្ធ',
      ],
    },
    {
      title: 'សកម្មភាពដែលអាចសាកល្បង',
      points: [
        'បង្កើតគម្រោងតូច ឬគំរូសាកល្បងមួយ',
        'ចូលរួមក្លឹបដែលពាក់ព័ន្ធនឹងចំណាប់អារម្មណ៍របស់អ្នក',
        'ពិភាក្សាជាមួយអ្នកណែនាំ ឬអ្នកជំនាញក្នុងវិស័យមួយ',
      ],
    },
    {
      title: 'សំណួរសម្រាប់ពិចារណា',
      points: [
        'តើការងារបែបណាដែលធ្វើឱ្យអ្នកមានកម្លាំងចិត្តក្នុងជីវិតប្រចាំថ្ងៃ?',
        'តើអ្នកចូលចិត្តធ្វើការជាក្រុម ឬធ្វើការដោយឯករាជ្យកម្រិតណា?',
        'តើបញ្ហា ឬការរួមចំណែកប្រភេទណាសំខាន់បំផុតសម្រាប់អ្នក?',
      ],
    },
  ];

  const alternativePaths = [
    ...majorRecommendations.slice(1).map((item) => item.name),
    ...careerRecommendations.slice(1).map((item) => item.title),
  ].slice(0, 6);

  return {
    dimensionScores,
    normalizedScores,
    topDimensions,
    profileSummary,
    majorRecommendations,
    careerRecommendations,
    reasoning,
    developmentOpportunities,
    alternativePaths,
  };
}
