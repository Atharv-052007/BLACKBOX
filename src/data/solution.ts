import type { VerdictOption } from '@/types'

export const CULPRIT_OPTIONS: VerdictOption[] = [
  {
    id: 'mara-voss',
    label: 'Mara Voss',
    detail: 'Director of Security · sole holder of SEC-01 override authority',
  },
  {
    id: 'elias-vance',
    label: 'Dr Elias Vance',
    detail: 'Lead Engineer · creator of the VANTAGE-7 prototype',
  },
  {
    id: 'julian-reyes',
    label: 'Julian Reyes',
    detail: 'Junior Systems Technician · credential J-114',
  },
  {
    id: 'nadia-kaur',
    label: 'Nadia Kaur',
    detail: 'Board Director, Vantage Holdings · led the acquisition',
  },
]

export const METHOD_OPTIONS: VerdictOption[] = [
  {
    id: 'cloned-firmware',
    label: 'Cloned credential + firmware blackout',
    detail:
      'A duplicated access tag and a signed maintenance window used to blind the cameras and sensors.',
  },
  {
    id: 'forced-door',
    label: 'Forced service door',
    detail: 'Physical entry through the north service corridor during a genuine power failure.',
  },
  {
    id: 'remote-cameras',
    label: 'External network intrusion',
    detail: 'Cameras and sensors disabled remotely from outside the building.',
  },
  {
    id: 'equipment-crate',
    label: 'Exhibition equipment crate',
    detail: 'The prototype concealed in event equipment and removed after the exhibition closed.',
  },
]

export const MOTIVE_OPTIONS: VerdictOption[] = [
  {
    id: 'halcyon-payment',
    label: 'Paid by Halcyon Dynamics',
    detail: 'Financial pressure. The prototype delivered to a buyer for a fixed cash payment.',
  },
  {
    id: 'stop-sale',
    label: 'Stop the defence sale',
    detail: 'Ideological. The theft intended to prevent the device reaching a military buyer.',
  },
  {
    id: 'discredit-vance',
    label: 'Discredit Dr Vance',
    detail: 'Professional. The theft intended to destroy the creator and take his position.',
  },
  {
    id: 'insurance',
    label: 'Insurance fraud',
    detail: 'Commercial. The prototype removed to claim its insured value.',
  },
]

export const KEY_EVIDENCE = [
  'e-02',
  'e-03',
  'e-04',
  'e-05',
  'e-07',
  'e-09',
  'e-14',
  'e-15',
] as const

export const SOLUTION = {
  culpritId: 'mara-voss',
  methodId: 'cloned-firmware',
  motiveId: 'halcyon-payment',
  keyEvidence: [...KEY_EVIDENCE],
  headline: 'The eleven minutes were purchased.',
  summary: [
    {
      label: 'Culprit',
      value: 'Mara Voss · Director of Security',
    },
    {
      label: 'Method',
      value: 'Cloned J-114 + signed UPS-2 maintenance window',
    },
    {
      label: 'Motive',
      value: '€120,000 from Halcyon Dynamics · debt of €118,400',
    },
    {
      label: 'Blackout',
      value: '22:42:11 — 22:53:11 · 660 seconds',
    },
  ],
  narrative: [
    'Mara Voss did not need to break into Meridian Sound Labs. She controlled the locks. At 21:58, Julian Reyes badged into the security office to deliver a firmware drive. Voss scanned his credential with the PX-8 writer in her locker and cloned it at 21:59:22. The tag went into the writer’s pouch and waited.',
    'At 22:29 she associated an unregistered handset with the security-wing access point. At 22:31:47 she sent Halcyon Dynamics the operational message signed “N” — the blackout window, the SEC-114 case, the north dock at 22:58. The “N” was not Nadia Kaur’s initial. It was a signature, chosen because it would point at the one person with an obvious reason to be in the file.',
    'At 22:42:11 she pushed a signed firmware update from SEC-01 to UPS-2. The controller opened a 660-second maintenance window. The camera bus and intrusion sensors went blind. Door controllers stayed live on battery. At 22:43:58 she issued a single-factor override for Laboratory 3. At 22:44:09 the cloned J-114 tag opened the door and put Julian Reyes’s name in the log.',
    'She cut the anti-tamper seal, lifted the VANTAGE-7 from its cradle, and packed it into the security-issue battery case tagged SEC-114. At 22:45:12 she physically disconnected CAM-07, the one legacy camera the firmware could not reach. It had already filmed her from behind: security jacket, lanyard, 1.72 metres, wheeled case.',
    'The window ended at 22:53:11. Vance found the empty cradle at the same moment. At 22:58 Voss opened the north dock with a security master key and loaded the case into a grey van. The driver never stepped out. Forty-one seconds. At 23:02:47 she reconnected CAM-07, and at 23:04:02 she filed a report describing a power surge that never happened.',
    'The file does not contain a confession. It contains a sequence — and every link in it belongs to the Director of Security.',
  ],
  sequence: [
    { time: '21:58:14', text: 'Reyes badges into the security office. His card is in the room.' },
    { time: '21:59:22', text: 'PX-8 writer clones J-114. The clone is stored in locker 03.' },
    { time: '22:29:41', text: 'Unregistered handset joins AP-03 in the security wing.' },
    { time: '22:31:47', text: '“Lot 7” email and Halcyon call. Payment promised.' },
    { time: '22:42:11', text: 'UPS-2 firmware push opens a 660-second blind window.' },
    { time: '22:43:58', text: 'Single-factor override issued for Laboratory 3.' },
    { time: '22:44:09', text: 'Cloned J-114 opens the lab. Reyes is in the atrium.' },
    { time: '22:45:12', text: 'CAM-07 films a security jacket with the case, then dies.' },
    { time: '22:53:11', text: 'Window ends. Vance finds the empty cradle.' },
    { time: '22:58:04', text: 'SEC-114 case loaded into a grey van at the north dock.' },
    { time: '23:04:02', text: 'False incident report IR-114 filed by M. Voss.' },
  ],
  conclusion:
    'Voss used the authority designed to protect the building to empty it. The debt, the burner call, the cloned tag, the firmware window, the camera disconnect, the storage tag and the false report are not separate anomalies. They are one chain, held at both ends by the same pair of hands.',
} as const

export const HINTS = [
  {
    level: 1,
    title: 'General direction',
    body: 'The blackout was not an accident. Start with the system that controls power and cameras, then ask who is authorised to command it. The answer is in the audit trail, not the incident report.',
  },
  {
    level: 2,
    title: 'Relevant evidence',
    body: 'Read E-04 beside E-09. Then look at E-03: who could issue a single-factor override for Lab 3 at 22:44? Finally, E-14: whose locker held the writer that cloned J-114 at 21:59?',
  },
  {
    level: 3,
    title: 'The contradiction',
    body: 'The encrypted email signs off with “N”, which points at Nadia Kaur — but its metadata places the sender in the security wing, and E-06 puts the Halcyon call there too. One suspect has the override authority, the storage locker, the equipment, the timeline and a €118,400 reason. The stolen case carried a security-storage tag.',
  },
]

export const EXPLANATION_CONCEPTS = [
  {
    id: 'clone',
    label: 'Credential cloning',
    terms: ['clone', 'cloned', 'cloning', 'rfid', 'duplicate', 'duplicated', 'skimm', 'tag write'],
  },
  {
    id: 'firmware',
    label: 'Firmware / staged blackout',
    terms: ['firmware', 'ups-2', 'ups', 'maintenance window', 'controller', '660', 'signed update'],
  },
  {
    id: 'authority',
    label: 'Security office authority',
    terms: ['sec-01', 'security office', 'override', 'security director', 'director of security'],
  },
  {
    id: 'camera',
    label: 'Camera disconnect',
    terms: ['cam-07', 'camera', 'cctv', 'surveillance', 'disconnect'],
  },
  {
    id: 'case',
    label: 'Case and dock handoff',
    terms: ['sec-114', 'battery case', 'north dock', 'loading dock', 'dock', 'van', 'handoff'],
  },
  {
    id: 'money',
    label: 'Halcyon payment / debt',
    terms: ['halcyon', 'payment', 'paid', 'debt', '€', 'euro', 'money', 'financial', '120,000', '120000'],
  },
  {
    id: 'timeline',
    label: 'Timeline precision',
    terms: ['22:42', '22:44', '22:45', '22:53', '22:58', '10:42', '10:44', '10:45', '10:53', '10:58'],
  },
  {
    id: 'frame',
    label: 'Reyes was framed',
    terms: ['julian', 'reyes', 'frame', 'framed', 'his card', 'reyes’s card', "reyes's card"],
  },
] as const
