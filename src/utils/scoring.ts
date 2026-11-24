import { EXPLANATION_CONCEPTS, SOLUTION } from '@/data/solution'
import type {
  ExplanationAnalysis,
  ScoreBreakdown,
  VerdictAnswers,
  VerdictSubmission,
} from '@/types'
import { clamp } from '@/utils/cn'

const WEIGHTS = {
  culprit: 40,
  method: 20,
  motive: 15,
  evidence: 15,
  explanation: 10,
} as const

export function analyzeExplanation(text: string): ExplanationAnalysis {
  const normalized = text.toLowerCase()
  const matchedConcepts: string[] = []
  const missedConcepts: string[] = []

  for (const concept of EXPLANATION_CONCEPTS) {
    const matched = concept.terms.some((term) => normalized.includes(term))
    if (matched) matchedConcepts.push(concept.label)
    else missedConcepts.push(concept.label)
  }

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  return { matchedConcepts, missedConcepts, wordCount }
}

export function scoreVerdict(
  answers: VerdictAnswers,
  hintsRevealed: number,
): {
  score: ScoreBreakdown
  explanationAnalysis: ExplanationAnalysis
  outcome: VerdictSubmission['outcome']
} {
  const analysis = analyzeExplanation(answers.explanation)

  const correctEvidence = answers.evidence.filter((id) =>
    SOLUTION.keyEvidence.includes(id as (typeof SOLUTION.keyEvidence)[number]),
  )
  const incorrectEvidence = answers.evidence.filter(
    (id) => !SOLUTION.keyEvidence.includes(id as (typeof SOLUTION.keyEvidence)[number]),
  )

  const evidenceRatio =
    (correctEvidence.length - incorrectEvidence.length * 0.5) / SOLUTION.keyEvidence.length
  const evidencePoints = Math.round(clamp(evidenceRatio, 0, 1) * WEIGHTS.evidence)

  const conceptRatio = analysis.matchedConcepts.length / EXPLANATION_CONCEPTS.length
  const lengthBonus =
    analysis.wordCount >= 80 ? 2 : analysis.wordCount >= 40 ? 1 : analysis.wordCount >= 15 ? 0.5 : 0
  const explanationPoints = Math.round(clamp(conceptRatio * 8 + lengthBonus, 0, WEIGHTS.explanation))

  const hintPenalty = Math.min(6, hintsRevealed * 2)

  const score: ScoreBreakdown = {
    culprit: {
      earned: answers.culprit === SOLUTION.culpritId ? WEIGHTS.culprit : 0,
      max: WEIGHTS.culprit,
    },
    method: {
      earned: answers.method === SOLUTION.methodId ? WEIGHTS.method : 0,
      max: WEIGHTS.method,
    },
    motive: {
      earned: answers.motive === SOLUTION.motiveId ? WEIGHTS.motive : 0,
      max: WEIGHTS.motive,
    },
    evidence: { earned: evidencePoints, max: WEIGHTS.evidence },
    explanation: { earned: explanationPoints, max: WEIGHTS.explanation },
    hintPenalty,
    total: 0,
  }

  const rawTotal =
    score.culprit.earned +
    score.method.earned +
    score.motive.earned +
    score.evidence.earned +
    score.explanation.earned -
    hintPenalty
  score.total = clamp(Math.round(rawTotal), 0, 100)

  const culpritCorrect = answers.culprit === SOLUTION.culpritId
  const outcome: VerdictSubmission['outcome'] =
    culpritCorrect && score.total >= 85
      ? 'SOLVED'
      : score.total >= 60
        ? 'PARTIAL'
        : 'UNSOLVED'

  return { score, explanationAnalysis: analysis, outcome }
}

export function scoreVerdictLabel(total: number): string {
  if (total >= 90) return 'MASTER DETECTIVE'
  if (total >= 85) return 'CASE SOLVED'
  if (total >= 70) return 'STRONG DEDUCTION'
  if (total >= 60) return 'PARTIAL SOLUTION'
  if (total >= 35) return 'INCOMPLETE'
  return 'UNSOLVED'
}
