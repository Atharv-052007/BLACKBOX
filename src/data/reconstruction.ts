import type {
  ReconstructionEvent,
  ReconstructionPlacement,
  ReconstructionResult,
} from '@/types'

/**
 * The eight decisive beats of the blackout. Timestamps are intentionally
 * withheld from the interface until the investigator validates a sequence.
 */
export const RECONSTRUCTION_EVENTS: ReconstructionEvent[] = [
  {
    id: 'r-01',
    time: '21:59:22',
    title: 'The credential is cloned',
    detail:
      'A tag matching Julian Reyes’s credential is written inside the security office by the RFID writer stored in locker 03. Reyes is still in the room.',
    source: 'RFID writer memory / locker inventory',
    evidenceIds: ['e-14', 'e-03'],
  },
  {
    id: 'r-02',
    time: '22:42:11',
    title: 'UPS-2 opens a blind window',
    detail:
      'A signed firmware update from SEC-01 isolates the camera bus and the intrusion sensors. Door controllers remain live on battery.',
    source: 'UPS-2 controller audit',
    evidenceIds: ['e-04'],
  },
  {
    id: 'r-03',
    time: '22:43:58',
    title: 'The Lab 3 override is issued',
    detail:
      'A single-factor override for Laboratory 3 is generated from the security director’s workstation, bypassing the six-digit PIN entirely.',
    source: 'Override record / access controller',
    evidenceIds: ['e-03', 'e-04'],
  },
  {
    id: 'r-04',
    time: '22:44:09',
    title: 'Laboratory 3 opens on J-114',
    detail:
      'The cloned tag is granted at the lab door. The cardholder’s phone is simultaneously associated with the atrium access point.',
    source: 'Access log / atrium AP log',
    evidenceIds: ['e-03', 'e-12', 'e-14'],
  },
  {
    id: 'r-05',
    time: '22:45:12',
    title: 'CAM-07 records, then dies',
    detail:
      'The legacy camera films a figure in a security jacket moving away with a wheeled case. Twelve seconds later the signal is cut and the SD card removed.',
    source: 'CAM-07 local recovery',
    evidenceIds: ['e-07', 'e-01', 'e-02'],
  },
  {
    id: 'r-06',
    time: '22:53:11',
    title: 'The window closes on an empty cradle',
    detail:
      'The maintenance window ends and the camera bus returns. Dr Vance reaches the lab and finds the VANTAGE-7 gone.',
    source: 'Controller audit / incident log',
    evidenceIds: ['e-01', 'e-04'],
  },
  {
    id: 'r-07',
    time: '22:58:04',
    title: 'The SEC-114 case reaches the dock',
    detail:
      'A figure opens the north dock with a security master key and loads the battery case into a grey panel van. The driver never leaves the cab.',
    source: 'CAM-12 NVR export',
    evidenceIds: ['e-08', 'e-02', 'e-05'],
  },
  {
    id: 'r-08',
    time: '23:04:02',
    title: 'The false report is filed',
    detail:
      'IR-114 describes a power surge and nineteen minutes of lost coverage. It omits the firmware push, the override, the RFID write and the dock.',
    source: 'Incident report IR-114',
    evidenceIds: ['e-09', 'e-04'],
  },
]

export const RECONSTRUCTION_ORDER = RECONSTRUCTION_EVENTS.map((event) => event.id)

export const RECONSTRUCTION_SEED_ORDER = [
  'r-04',
  'r-01',
  'r-06',
  'r-03',
  'r-08',
  'r-02',
  'r-07',
  'r-05',
]

export const RECONSTRUCTION_VERIFIED_SCORE = 75

export const RECONSTRUCTION_BY_ID = Object.fromEntries(
  RECONSTRUCTION_EVENTS.map((event) => [event.id, event]),
) as Record<string, ReconstructionEvent>

export function emptyReconstructionSlots(): (string | null)[] {
  return Array.from({ length: RECONSTRUCTION_EVENTS.length }, () => null)
}

export function scoreReconstruction(order: (string | null)[]): ReconstructionResult {
  const placements: ReconstructionPlacement[] = RECONSTRUCTION_ORDER.map(
    (expectedId, slot) => {
      const placedId = order[slot] ?? null
      return {
        slot,
        placedId,
        expectedId,
        correct: placedId === expectedId,
      }
    },
  )

  const correctCount = placements.filter((placement) => placement.correct).length
  return {
    score: Math.round((correctCount / RECONSTRUCTION_ORDER.length) * 100),
    correctCount,
    total: RECONSTRUCTION_ORDER.length,
    placements,
  }
}

export function reconstructionLabel(score: number | null): string {
  if (score === null) return 'Not reconstructed'
  if (score === 100) return 'Perfect sequence'
  if (score >= RECONSTRUCTION_VERIFIED_SCORE) return 'Sequence verified'
  if (score >= 50) return 'Partial sequence'
  return 'Sequence rejected'
}
