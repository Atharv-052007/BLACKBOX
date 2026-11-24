import { EVIDENCE } from '@/data/evidence'
import { SUSPECTS } from '@/data/suspects'
import { TIMELINE } from '@/data/timeline'
import type { VerdictSubmission } from '@/types'

export interface ProgressInput {
  reviewedEvidence: string[]
  viewedSuspects: string[]
  boardEdges: unknown[]
  expandedEvents: string[]
  verdict: VerdictSubmission | null
  reconstructionScore: number | null
}

export function caseProgress(state: ProgressInput): number {
  const evidence = Math.min(1, state.reviewedEvidence.length / EVIDENCE.length) * 40
  const suspects = Math.min(1, state.viewedSuspects.length / SUSPECTS.length) * 18
  const board = Math.min(1, state.boardEdges.length / 5) * 12
  const timeline = Math.min(1, state.expandedEvents.length / TIMELINE.length) * 8
  const reconstruction =
    (state.reconstructionScore === null ? 0 : Math.min(1, state.reconstructionScore / 100)) * 12
  const verdict = state.verdict ? 10 : 0
  return Math.round(evidence + suspects + board + timeline + reconstruction + verdict)
}
