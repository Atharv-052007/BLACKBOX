import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Edge, Node } from '@xyflow/react'
import type { BoardNodeData, VerdictSubmission } from '@/types'
import { EVIDENCE_BY_ID } from '@/data/evidence'
import { SUSPECTS, SUSPECTS_BY_ID } from '@/data/suspects'
import { KEY_EVIDENCE } from '@/data/solution'
import { emptyReconstructionSlots, scoreReconstruction } from '@/data/reconstruction'

export type DossierNode = Node<BoardNodeData, 'dossier'>

const CATEGORY_LABEL: Record<string, string> = {
  suspect: 'Suspect',
  physical: 'Physical Evidence',
  digital: 'Digital Evidence',
  document: 'Document',
  cctv: 'CCTV Record',
  audio: 'Audio Record',
  witness: 'Witness Statement',
}

function suspectNode(id: string, x: number, y: number): DossierNode {
  const suspect = SUSPECTS_BY_ID[id]
  return {
    id: `suspect-${id}`,
    type: 'dossier',
    position: { x, y },
    data: {
      kind: 'suspect',
      refId: id,
      code: suspect.code,
      title: suspect.name,
      category: 'suspect',
      subtitle: suspect.occupation,
    },
  }
}

function evidenceNode(id: string, x: number, y: number): DossierNode {
  const item = EVIDENCE_BY_ID[id]
  return {
    id: `evidence-${id}`,
    type: 'dossier',
    position: { x, y },
    data: {
      kind: 'evidence',
      refId: id,
      code: item.code,
      title: item.title,
      category: item.category,
      subtitle: CATEGORY_LABEL[item.category] ?? 'Exhibit',
    },
  }
}

export function initialBoardNodes(): DossierNode[] {
  return [
    suspectNode('elias-vance', 40, 40),
    suspectNode('mara-voss', 340, 40),
    suspectNode('julian-reyes', 640, 40),
    suspectNode('nadia-kaur', 940, 40),
  ]
}

function seededEvidenceNodes(): DossierNode[] {
  const positions = [
    [40, 300],
    [320, 300],
    [600, 300],
    [880, 300],
    [40, 540],
    [320, 540],
    [600, 540],
    [880, 540],
  ]
  return KEY_EVIDENCE.map((id, index) => evidenceNode(id, positions[index][0], positions[index][1]))
}

interface CaseStore {
  detectiveName: string
  startedAt: string | null
  reviewedEvidence: string[]
  flaggedEvidence: string[]
  savedEvidence: string[]
  notes: Record<string, string>
  viewedSuspects: string[]
  expandedEvents: string[]
  hintsRevealed: number
  boardNodes: DossierNode[]
  boardEdges: Edge[]
  verdict: VerdictSubmission | null
  reconstructionOrder: (string | null)[]
  reconstructionScore: number | null
  reconstructionAttempts: number
  reconstructionCheckedAt: string | null

  startCase: () => void
  setDetectiveName: (name: string) => void
  reviewEvidence: (id: string) => void
  unreviewEvidence: (id: string) => void
  toggleFlag: (id: string) => void
  toggleSave: (id: string) => void
  setNote: (id: string, note: string) => void
  markSuspectViewed: (id: string) => void
  toggleEventExpanded: (id: string) => void
  expandAllEvents: (ids: string[]) => void
  collapseAllEvents: () => void
  revealHint: () => void
  setBoardNodes: (nodes: DossierNode[]) => void
  setBoardEdges: (edges: Edge[]) => void
  addBoardNode: (node: DossierNode) => void
  addEvidenceToBoard: (id: string, position: { x: number; y: number }) => void
  addSuspectToBoard: (id: string, position: { x: number; y: number }) => void
  removeBoardNode: (id: string) => void
  seedBoard: () => void
  resetBoard: () => void
  setVerdict: (verdict: VerdictSubmission) => void
  clearVerdict: () => void
  setReconstructionOrder: (order: (string | null)[]) => void
  checkReconstruction: () => void
  resetReconstruction: () => void
  resetCase: () => void
}

export const useCaseStore = create<CaseStore>()(
  persist(
    (set, get) => ({
      detectiveName: 'A. MORGAN',
      startedAt: null,
      reviewedEvidence: [],
      flaggedEvidence: [],
      savedEvidence: [],
      notes: {},
      viewedSuspects: [],
      expandedEvents: [],
      hintsRevealed: 0,
      boardNodes: initialBoardNodes(),
      boardEdges: [],
      verdict: null,
      reconstructionOrder: emptyReconstructionSlots(),
      reconstructionScore: null,
      reconstructionAttempts: 0,
      reconstructionCheckedAt: null,

      startCase: () => {
        if (!get().startedAt) set({ startedAt: new Date().toISOString() })
      },

      setDetectiveName: (name) => set({ detectiveName: name.trim().slice(0, 40) || 'A. MORGAN' }),

      reviewEvidence: (id) =>
        set((state) => ({
          startedAt: state.startedAt ?? new Date().toISOString(),
          reviewedEvidence: state.reviewedEvidence.includes(id)
            ? state.reviewedEvidence
            : [...state.reviewedEvidence, id],
        })),

      unreviewEvidence: (id) =>
        set((state) => ({
          reviewedEvidence: state.reviewedEvidence.filter((item) => item !== id),
        })),

      toggleFlag: (id) =>
        set((state) => ({
          flaggedEvidence: state.flaggedEvidence.includes(id)
            ? state.flaggedEvidence.filter((item) => item !== id)
            : [...state.flaggedEvidence, id],
        })),

      toggleSave: (id) =>
        set((state) => ({
          savedEvidence: state.savedEvidence.includes(id)
            ? state.savedEvidence.filter((item) => item !== id)
            : [...state.savedEvidence, id],
        })),

      setNote: (id, note) =>
        set((state) => ({
          notes: { ...state.notes, [id]: note },
        })),

      markSuspectViewed: (id) =>
        set((state) => ({
          startedAt: state.startedAt ?? new Date().toISOString(),
          viewedSuspects: state.viewedSuspects.includes(id)
            ? state.viewedSuspects
            : [...state.viewedSuspects, id],
        })),

      toggleEventExpanded: (id) =>
        set((state) => ({
          expandedEvents: state.expandedEvents.includes(id)
            ? state.expandedEvents.filter((item) => item !== id)
            : [...state.expandedEvents, id],
        })),

      expandAllEvents: (ids) =>
        set((state) => ({
          expandedEvents: Array.from(new Set([...state.expandedEvents, ...ids])),
        })),

      collapseAllEvents: () => set({ expandedEvents: [] }),

      revealHint: () =>
        set((state) => ({
          hintsRevealed: Math.min(3, state.hintsRevealed + 1),
        })),

      setBoardNodes: (nodes) => set({ boardNodes: nodes }),
      setBoardEdges: (edges) => set({ boardEdges: edges }),

      addBoardNode: (node) =>
        set((state) => {
          if (state.boardNodes.some((item) => item.id === node.id)) return state
          return { boardNodes: [...state.boardNodes, node] }
        }),

      addEvidenceToBoard: (id, position) => {
        const node = evidenceNode(id, position.x, position.y)
        get().addBoardNode(node)
      },

      addSuspectToBoard: (id, position) => {
        const node = suspectNode(id, position.x, position.y)
        get().addBoardNode(node)
      },

      removeBoardNode: (id) =>
        set((state) => ({
          boardNodes: state.boardNodes.filter((node) => node.id !== id),
          boardEdges: state.boardEdges.filter(
            (edge) => edge.source !== id && edge.target !== id,
          ),
        })),

      seedBoard: () =>
        set((state) => {
          const existing = new Set(state.boardNodes.map((node) => node.id))
          const additions = seededEvidenceNodes().filter((node) => !existing.has(node.id))
          return { boardNodes: [...state.boardNodes, ...additions] }
        }),

      resetBoard: () =>
        set({
          boardNodes: initialBoardNodes(),
          boardEdges: [],
        }),

      setVerdict: (verdict) => set({ verdict }),

      clearVerdict: () => set({ verdict: null }),

      setReconstructionOrder: (order) =>
        set((state) => ({
          reconstructionOrder: order,
          reconstructionScore: state.reconstructionCheckedAt
            ? scoreReconstruction(order).score
            : state.reconstructionScore,
        })),

      checkReconstruction: () =>
        set((state) => {
          const result = scoreReconstruction(state.reconstructionOrder)
          return {
            startedAt: state.startedAt ?? new Date().toISOString(),
            reconstructionScore: result.score,
            reconstructionAttempts: state.reconstructionAttempts + 1,
            reconstructionCheckedAt: new Date().toISOString(),
          }
        }),

      resetReconstruction: () =>
        set({
          reconstructionOrder: emptyReconstructionSlots(),
          reconstructionScore: null,
          reconstructionAttempts: 0,
          reconstructionCheckedAt: null,
        }),

      resetCase: () =>
        set({
          startedAt: null,
          reviewedEvidence: [],
          flaggedEvidence: [],
          savedEvidence: [],
          notes: {},
          viewedSuspects: [],
          expandedEvents: [],
          hintsRevealed: 0,
          boardNodes: initialBoardNodes(),
          boardEdges: [],
          verdict: null,
          reconstructionOrder: emptyReconstructionSlots(),
          reconstructionScore: null,
          reconstructionAttempts: 0,
          reconstructionCheckedAt: null,
        }),
    }),
    {
      name: 'blackbox-case-001',
      version: 1,
      partialize: (state) => ({
        detectiveName: state.detectiveName,
        startedAt: state.startedAt,
        reviewedEvidence: state.reviewedEvidence,
        flaggedEvidence: state.flaggedEvidence,
        savedEvidence: state.savedEvidence,
        notes: state.notes,
        viewedSuspects: state.viewedSuspects,
        expandedEvents: state.expandedEvents,
        hintsRevealed: state.hintsRevealed,
        boardNodes: state.boardNodes,
        boardEdges: state.boardEdges,
        verdict: state.verdict,
        reconstructionOrder: state.reconstructionOrder,
        reconstructionScore: state.reconstructionScore,
        reconstructionAttempts: state.reconstructionAttempts,
        reconstructionCheckedAt: state.reconstructionCheckedAt,
      }),
    },
  ),
)

export function makeEvidenceNode(id: string, position: { x: number; y: number }): DossierNode {
  return evidenceNode(id, position.x, position.y)
}

export function makeSuspectNode(id: string, position: { x: number; y: number }): DossierNode {
  return suspectNode(id, position.x, position.y)
}

export const SUSPECT_NODE_IDS = SUSPECTS.map((suspect) => `suspect-${suspect.id}`)
