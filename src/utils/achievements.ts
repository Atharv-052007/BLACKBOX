import type { Achievement, VerdictSubmission } from '@/types'
import { EVIDENCE } from '@/data/evidence'
import { SUSPECTS } from '@/data/suspects'
import { TIMELINE } from '@/data/timeline'

interface AchievementInput {
  reviewedEvidence: string[]
  viewedSuspects: string[]
  savedEvidence: string[]
  notes: Record<string, string>
  expandedEvents: string[]
  boardEdges: unknown[]
  verdict: VerdictSubmission | null
  reconstructionScore: number | null
}

const NOTE_COUNT = 3

export const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'first-contact',
    name: 'First Contact',
    description: 'Open your first exhibit.',
    test: (state: AchievementInput) => state.reviewedEvidence.length >= 1,
  },
  {
    id: 'scene-sweep',
    name: 'Scene Sweep',
    description: 'Review five exhibits.',
    test: (state: AchievementInput) => state.reviewedEvidence.length >= 5,
  },
  {
    id: 'forensic-complete',
    name: 'Full Forensics',
    description: 'Review every exhibit in the file.',
    test: (state: AchievementInput) => state.reviewedEvidence.length >= EVIDENCE.length,
  },
  {
    id: 'interrogator',
    name: 'Interrogator',
    description: 'Read all four suspect interviews.',
    test: (state: AchievementInput) => state.viewedSuspects.length >= SUSPECTS.length,
  },
  {
    id: 'board-architect',
    name: 'Board Architect',
    description: 'Draw five connections on the investigation board.',
    test: (state: AchievementInput) => state.boardEdges.length >= 5,
  },
  {
    id: 'chronologist',
    name: 'Chronologist',
    description: 'Expand every event on the timeline.',
    test: (state: AchievementInput) => state.expandedEvents.length >= TIMELINE.length,
  },
  {
    id: 'note-keeper',
    name: 'Margin Notes',
    description: 'Leave personal notes on three exhibits.',
    test: (state: AchievementInput) =>
      Object.values(state.notes).filter((note) => note.trim().length > 0).length >= NOTE_COUNT,
  },
  {
    id: 'archivist',
    name: 'Archivist',
    description: 'Save five exhibits for later review.',
    test: (state: AchievementInput) => state.savedEvidence.length >= 5,
  },
  {
    id: 'reconstructionist',
    name: 'Reconstructionist',
    description: 'Validate a reconstruction of the blackout.',
    test: (state: AchievementInput) => state.reconstructionScore !== null,
  },
  {
    id: 'true-sequence',
    name: 'True Sequence',
    description: 'Place all eight beats correctly.',
    test: (state: AchievementInput) => state.reconstructionScore === 100,
  },
  {
    id: 'case-closed',
    name: 'Case Closed',
    description: 'Submit a final verdict.',
    test: (state: AchievementInput) => Boolean(state.verdict),
  },
  {
    id: 'master-detective',
    name: 'Master Detective',
    description: 'Score 90 or higher on the final verdict.',
    test: (state: AchievementInput) => (state.verdict?.score.total ?? 0) >= 90,
  },
] as const

export function getAchievements(state: AchievementInput): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map((definition) => ({
    id: definition.id,
    name: definition.name,
    description: definition.description,
    unlocked: definition.test(state),
    unlockedAt: definition.test(state) ? state.verdict?.submittedAt : undefined,
  }))
}
