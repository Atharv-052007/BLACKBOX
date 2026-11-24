import type { CaseFile } from '@/types'

export const CASE_FILE: CaseFile = {
  id: 'bb-2026-001',
  code: 'CASE 001',
  title: 'The Silent Frequency',
  classification: 'RESTRICTED',
  difficulty: 'ADVANCED',
  status: 'UNSOLVED',
  location: 'Meridian Sound Labs — Building C, 14 Kestrel Wharf, London E14',
  date: '14 NOV 2026',
  openedAt: '15 NOV 2026 · 00:12 GMT',
  synopsis:
    'During a private technology exhibition, a revolutionary communication device vanished from a secured laboratory. The building went dark for eleven minutes. Four people had authorised access. Only one of them is telling the truth.',
  briefing: [
    'At 22:53 on 14 November, Dr Elias Vance entered Laboratory 3 at Meridian Sound Labs and found the display cradle empty. The VANTAGE-7 prototype — a directional ultrasonic communication device known internally as the Silent Frequency — was gone.',
    'The theft occurred inside an eleven-minute security blackout. The surveillance bus failed, the lab’s intrusion sensors were blind, and the only camera still recording was physically disconnected at 22:45.',
    'Four people held authorised access to the restricted wing: the device’s creator, the director of security, a junior access-control technician, and the board director leading the acquisition. Their statements do not agree.',
    'You have the recovered exhibits, the access logs, the camera fragments and the interviews. The file does not contain a confession. It contains a sequence. Find it.',
  ],
  directives: [
    'Identify who removed the prototype from Laboratory 3.',
    'Establish how the security system was bypassed.',
    'Determine the motive behind the theft.',
    'Reconstruct what happened during the eleven-minute blackout.',
  ],
  stats: [
    { label: 'Jurisdiction', value: 'Metropolitan / Private' },
    { label: 'Lead Investigator', value: 'Det. A. Morgan' },
    { label: 'Exhibits Logged', value: '15' },
    { label: 'Persons of Interest', value: '04' },
    { label: 'Blackout Window', value: '22:42 — 22:53' },
    { label: 'Case Status', value: 'UNSOLVED' },
  ],
}

export const PROCESS_STAGES = [
  {
    number: '01',
    title: 'OBSERVE',
    caption: 'Examine the evidence.',
    detail:
      'Every exhibit is catalogued, timestamped and signed. Read the documents. Study the frames. Nothing in this file is decorative.',
  },
  {
    number: '02',
    title: 'INVESTIGATE',
    caption: 'Question the suspects.',
    detail:
      'Four accounts. Four versions of the same eleven minutes. Compare what they say against what the record can prove.',
  },
  {
    number: '03',
    title: 'CONNECT',
    caption: 'Discover hidden relationships.',
    detail:
      'Pin exhibits to the board. Draw the lines. A contradiction is not an accident — it is a door.',
  },
  {
    number: '04',
    title: 'REVEAL',
    caption: 'Submit your final verdict.',
    detail:
      'Name the culprit, the method and the motive. The system will grade your reasoning against the sealed solution.',
  },
]

export const SEALED_CASES = [
  {
    code: 'CASE 002',
    title: 'The Vanishing at Hallow Point',
    classification: 'SEALED',
    note: 'Declassification pending review by the archive board.',
    year: '2026',
  },
  {
    code: 'CASE 003',
    title: 'A Room Without a Door',
    classification: 'SEALED',
    note: 'File withheld under the Meridian accord. Access denied.',
    year: '2025',
  },
]
