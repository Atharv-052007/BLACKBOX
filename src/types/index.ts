export type EvidenceCategory =
  | 'physical'
  | 'digital'
  | 'document'
  | 'cctv'
  | 'audio'
  | 'witness'

export type EvidenceKind =
  | 'photo'
  | 'document'
  | 'email'
  | 'log'
  | 'cctv'
  | 'audio'
  | 'witness'

export interface EvidenceAnnotation {
  x: number
  y: number
  label: string
  note: string
}

export interface EvidencePhotoContent {
  kind: 'photo'
  scene: 'cradle' | 'case' | 'rfid' | 'device'
  caption: string
  annotations: EvidenceAnnotation[]
}

export interface EvidenceDocumentContent {
  kind: 'document'
  docTitle: string
  ref: string
  fields: { label: string; value: string }[]
  body: string[]
  bullets?: string[]
  stamp?: string
  signature?: string
  note?: string
}

export interface EvidenceEmailContent {
  kind: 'email'
  from: string
  to: string
  subject: string
  sentAt: string
  encrypted: boolean
  decrypted: boolean
  headers: { label: string; value: string }[]
  body: string[]
  attachment?: string
}

export interface EvidenceLogRow {
  cells: string[]
  flag?: 'warn' | 'crit'
}

export interface EvidenceLogContent {
  kind: 'log'
  system: string
  columns: string[]
  rows: EvidenceLogRow[]
  footer?: string
}

export interface EvidenceCctvContent {
  kind: 'cctv'
  camera: string
  timestamp: string
  location: string
  quality: string
  scene: 'corridor' | 'dock'
  overlays: string[]
  transcript?: string
}

export interface EvidenceAudioContent {
  kind: 'audio'
  duration: string
  source: string
  waveform: number[]
  transcript: { time: string; speaker: string; text: string }[]
}

export interface EvidenceWitnessContent {
  kind: 'witness'
  statementNo: string
  takenAt: string
  takenBy: string
  body: string[]
  signature: string
  note?: string
}

export type EvidenceContent =
  | EvidencePhotoContent
  | EvidenceDocumentContent
  | EvidenceEmailContent
  | EvidenceLogContent
  | EvidenceCctvContent
  | EvidenceAudioContent
  | EvidenceWitnessContent

export interface EvidenceItem {
  id: string
  caseId: string
  code: string
  title: string
  category: EvidenceCategory
  kind: EvidenceKind
  discoveredAt: string
  location: string
  summary: string
  examination: string[]
  significance: string
  custody: string
  tags: string[]
  relatedEvidence: string[]
  suspects: string[]
  content: EvidenceContent
}

export interface SuspectConnection {
  name: string
  relation: string
}

export interface InterviewEntry {
  question: string
  answer: string
  flag?: 'notable' | 'inconsistency'
}

export interface SuspectContradiction {
  claim: string
  note: string
  evidenceId?: string
}

export interface Suspect {
  id: string
  code: string
  name: string
  age: number
  occupation: string
  status: 'PERSON OF INTEREST' | 'PRIME SUSPECT' | 'CLEARED' | 'WITNESS'
  portrait: 'vance' | 'voss' | 'reyes' | 'kaur'
  relationship: string
  motive: string
  alibi: string
  alibiStatus: 'CORROBORATED' | 'UNVERIFIED' | 'CONTESTED'
  summary: string
  contradictions?: SuspectContradiction[]
  risk: { label: string; value: number }[]
  connections: SuspectConnection[]
  interview: InterviewEntry[]
  pressurePoints: string[]
  evidence: string[]
}

export interface TimelineAccount {
  source: string
  time: string
  claim: string
}

export interface TimelineEvent {
  id: string
  time: string
  sortKey: string
  title: string
  summary: string
  detail: string
  source: string
  evidenceIds: string[]
  verified: boolean
  critical: boolean
  accounts?: TimelineAccount[]
  contradiction?: {
    requiresEvidence: string
    note: string
  }
}

export interface CaseFile {
  id: string
  code: string
  title: string
  classification: string
  difficulty: string
  status: string
  location: string
  date: string
  openedAt: string
  synopsis: string
  briefing: string[]
  directives: string[]
  stats: { label: string; value: string }[]
}

export type VerdictOption = {
  id: string
  label: string
  detail: string
}

export interface VerdictAnswers {
  culprit: string
  method: string
  motive: string
  evidence: string[]
  explanation: string
}

export interface ScoreBreakdown {
  culprit: { earned: number; max: number }
  method: { earned: number; max: number }
  motive: { earned: number; max: number }
  evidence: { earned: number; max: number }
  explanation: { earned: number; max: number }
  hintPenalty: number
  total: number
}

export interface ExplanationAnalysis {
  matchedConcepts: string[]
  missedConcepts: string[]
  wordCount: number
}

export interface VerdictSubmission {
  answers: VerdictAnswers
  submittedAt: string
  score: ScoreBreakdown
  explanationAnalysis: ExplanationAnalysis
  outcome: 'SOLVED' | 'PARTIAL' | 'UNSOLVED'
}

export interface ReconstructionEvent {
  id: string
  time: string
  title: string
  detail: string
  source: string
  evidenceIds: string[]
}

export interface ReconstructionPlacement {
  slot: number
  placedId: string | null
  expectedId: string
  correct: boolean
}

export interface ReconstructionResult {
  score: number
  correctCount: number
  total: number
  placements: ReconstructionPlacement[]
}

export interface BoardNodeData {
  kind: 'suspect' | 'evidence'
  refId: string
  code: string
  title: string
  category: string
  subtitle: string
  [key: string]: unknown
}

export type RelationshipType =
  | 'connected'
  | 'contradicts'
  | 'confirms'
  | 'present'
  | 'motive'

export interface Achievement {
  id: string
  name: string
  description: string
  unlocked: boolean
  unlockedAt?: string
}
