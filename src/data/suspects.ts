import type { Suspect } from '@/types'

export const SUSPECTS: Suspect[] = [
  {
    id: 'elias-vance',
    code: 'POI-01',
    name: 'Dr Elias Vance',
    age: 47,
    occupation: 'Lead Acoustic Engineer',
    status: 'PERSON OF INTEREST',
    portrait: 'vance',
    relationship: 'Creator of VANTAGE-7. Lead engineer on the Silent Frequency project.',
    motive:
      'Opposed the Halcyon Dynamics acquisition and publicly threatened to stop it. Believes the device should never be weaponised.',
    alibi:
      'On stage in the exhibition atrium from 22:40 to 22:53 before 41 witnesses and a livestream. Entered Lab 3 at 22:12 to collect his calibration notebook.',
    alibiStatus: 'CORROBORATED',
    summary:
      'Brilliant, volatile and fiercely protective of his work. He argued with Kaur ninety minutes before the theft and his credential is the last clean entry to Laboratory 3. He is also the only suspect with an alibi the whole room can see.',
    risk: [
      { label: 'ACCESS', value: 92 },
      { label: 'MOTIVE', value: 84 },
      { label: 'OPPORTUNITY', value: 18 },
      { label: 'CONCEALMENT', value: 40 },
    ],
    connections: [
      { name: 'Nadia Kaur', relation: 'Board director · adversary on the Halcyon sale' },
      { name: 'Mara Voss', relation: 'Security liaison · holds his lab access review' },
      { name: 'Julian Reyes', relation: 'Junior technician · former mentee' },
    ],
    interview: [
      {
        question: 'Where were you at 22:44, when the lab door opened?',
        answer:
          'On stage. Demonstrating the array to the room. Ask any of the forty-one people holding a glass.',
      },
      {
        question: 'Your card opened Laboratory 3 at 22:12. Why?',
        answer:
          'My calibration notebook. I left it on the bench after the morning run. I was in and out in four minutes.',
      },
      {
        question: 'You told Nadia Kaur you would not let the device leave the building.',
        answer:
          'I said I would not let it leave for Halcyon. I meant the deal, not the device. There is a difference, and she knows it.',
        flag: 'notable',
      },
      {
        question: 'Who else could operate the prototype?',
        answer:
          'Operate it? Anyone with the calibration key. Steal it? Anyone who can walk through a door and knows which screw to turn.',
      },
      {
        question: 'Who do you think took it?',
        answer:
          'Julian asked me twice last week how the access system handles overrides. Twice. Ask him why.',
        flag: 'notable',
      },
    ],
    pressurePoints: [
      'His 22:12 entry is the last confirmed sighting of the intact prototype.',
      'The argument at 21:40 supplies a loud, obvious motive.',
      'He volunteered a theory about Reyes before anyone asked.',
    ],
    evidence: ['e-01', 'e-03', 'e-10', 'e-13'],
  },
  {
    id: 'mara-voss',
    code: 'POI-02',
    name: 'Mara Voss',
    age: 34,
    occupation: 'Director of Security',
    status: 'PERSON OF INTEREST',
    portrait: 'voss',
    relationship:
      'Sole holder of SEC-01 override authority. Supervises access control, CCTV and the security storage locker.',
    motive:
      '€118,400 in declared unsecured debt, including a defaulted loan. The Halcyon payment described in the encrypted email would clear it.',
    alibi:
      'Claims continuous presence in the security office from 22:30 to 23:04, managing the blackout and filing the incident report.',
    alibiStatus: 'CONTESTED',
    summary:
      'Composed, procedural and precise. She wrote the official account of the blackout. Every system anomaly that night passes through her workstation, her certificate or her locker — and her report does not survive contact with her own audit trail.',
    risk: [
      { label: 'ACCESS', value: 96 },
      { label: 'MOTIVE', value: 72 },
      { label: 'OPPORTUNITY', value: 94 },
      { label: 'CONCEALMENT', value: 91 },
    ],
    connections: [
      { name: 'Elias Vance', relation: 'Lab access review · professional friction' },
      { name: 'Julian Reyes', relation: 'Direct report · access-control technician' },
      { name: 'Nadia Kaur', relation: 'Executive liaison for the Halcyon transfer' },
      { name: 'Halcyon Dynamics', relation: 'Denies all contact' },
    ],
    interview: [
      {
        question: 'Walk me through the blackout.',
        answer:
          'A surge hit the UPS at 22:45. The camera bus dropped. I restored systems at 23:04 and filed IR-114.',
      },
      {
        question: 'The controller log shows a firmware update from SEC-01 at 22:42:11.',
        answer:
          'I ran a scheduled maintenance push. The surge followed. I recorded what I observed. You can read the report.',
        flag: 'inconsistency',
      },
      {
        question: 'Why did CAM-07 need a physical disconnect?',
        answer:
          'It didn’t. The bus failure took it down. Legacy cameras fail in unpredictable ways.',
        flag: 'inconsistency',
      },
      {
        question: 'Julian Reyes’s card opened Lab 3 at 22:44 under your override.',
        answer:
          'Julian had access. If his card was at the door, that is his problem. I issued overrides that night to keep the building contained.',
        flag: 'notable',
      },
      {
        question: 'Who has the code to security storage locker 03?',
        answer:
          'Security keeps equipment there. Several people know the code. I don’t catalogue every tag.',
        flag: 'notable',
      },
      {
        question: 'The encrypted email is signed “N”. Any idea who that is?',
        answer:
          'Nadia Kaur’s initial. You should be asking her, not me. I was on the radio all night.',
      },
    ],
    pressurePoints: [
      'Only person able to issue a single-factor Lab 3 override.',
      'Her incident report’s timeline contradicts the signed controller log.',
      'Locker 03 is assigned to her; the RFID writer inside cloned J-114.',
      'The burner call at 22:31 triangulates to the security wing.',
    ],
    contradictions: [
      {
        claim: 'Must have been past the second factor — the log shows the device in place.',
        note:
          'Her incident report fixes the blackout as a power surge at 22:45. The controller states the firmware window ran 22:42:11 to 22:53:11 and there was no surge. The report is materially contradicted.',
        evidenceId: 'e-04',
      },
      {
        claim: 'Nothing happened until she said the lights flickered.',
        note:
          'The maintenance window is signed in the controller. Nothing but the RFID write at 21:59:22 precedes it — her family are not even on site.',
        evidenceId: 'e-14',
      },
    ],
    evidence: ['e-02', 'e-03', 'e-04', 'e-05', 'e-07', 'e-09', 'e-14', 'e-15'],
  },
  {
    id: 'julian-reyes',
    code: 'POI-03',
    name: 'Julian Reyes',
    age: 29,
    occupation: 'Junior Systems Technician',
    status: 'PERSON OF INTEREST',
    portrait: 'reyes',
    relationship:
      'Access-control administration. His credential J-114 opened Laboratory 3 at 22:44.',
    motive:
      'Passed over for promotion in September. Previously cautioned for an unauthorised network scan. Deep knowledge of the access system.',
    alibi:
      'In the exhibition atrium from 22:35 to 23:06. Corroborated by the catering supervisor and a continuous phone association with the atrium access point.',
    alibiStatus: 'CORROBORATED',
    summary:
      'Anxious, over-explaining and very easy to suspect. His credential is in the log at the exact minute of the theft, he reported it missing late, and he has a history. The evidence that clears him is quieter than the evidence that condemns him.',
    risk: [
      { label: 'ACCESS', value: 74 },
      { label: 'MOTIVE', value: 62 },
      { label: 'OPPORTUNITY', value: 22 },
      { label: 'CONCEALMENT', value: 48 },
    ],
    connections: [
      { name: 'Mara Voss', relation: 'Direct supervisor · security office' },
      { name: 'Elias Vance', relation: 'Former mentor · asked about access overrides' },
      { name: 'Priya Nair', relation: 'Catering supervisor · alibi witness' },
    ],
    interview: [
      {
        question: 'Your card opened Laboratory 3 at 22:44.',
        answer:
          'I was in the atrium. I reported the card missing at 22:50. Check the cameras — oh, right, there aren’t any.',
      },
      {
        question: 'When did you last see the card?',
        answer:
          'At 21:58. I tapped into the security office to drop off a drive. After that, nothing. I didn’t use it again.',
      },
      {
        question: 'Why wait until 22:50 to report it missing?',
        answer:
          'I thought I left it at my desk. I looked. Then I heard Vance shouting and I realised what it would look like.',
        flag: 'notable',
      },
      {
        question: 'You were cautioned for scanning the network in 2024.',
        answer:
          'I was curious. I was never charged. That doesn’t make me a thief, and it doesn’t put me in that corridor.',
      },
      {
        question: 'Who had access to your card between 21:58 and 22:44?',
        answer:
          'It was in my jacket. I hung it by the door in the security office. Mara was at her desk. I was there two minutes.',
        flag: 'notable',
      },
    ],
    pressurePoints: [
      'Credential used at the scene during the blackout.',
      'Delayed loss report creates an obvious narrative.',
      'Prior access-control incident supplies a motive-shaped fact.',
    ],
    contradictions: [
      {
        claim: 'The card was in your jacket the whole time.',
        note:
          'The log grants it without a PIN. He cannot appear at the door at the same moment it is issued elsewhere, and the recorder shows him inside Laboratory 3 at 22:44:09. Motion analysis from CAM-07 places someone in a security jacket behind the lab at 22:44:52.',
        evidenceId: 'e-14',
      },
      {
        claim: 'You could not have walked through Laboratory 3 during the blackout.',
        note:
          'Doors on battery stay live. The instrumented entry log shows the J-114 credential at 22:44:09. If it was yours, some add-on explains the chain — check the credential clone.',
        evidenceId: 'e-03',
      },
    ],
    evidence: ['e-03', 'e-11', 'e-12', 'e-14'],
  },
  {
    id: 'nadia-kaur',
    code: 'POI-04',
    name: 'Nadia Kaur',
    age: 41,
    occupation: 'Board Director, Vantage Holdings',
    status: 'WITNESS',
    portrait: 'kaur',
    relationship:
      'Led the Halcyon Dynamics acquisition. Signed the board approval for the sale of VANTAGE-7.',
    motive:
      'The sale would have paid her a €2.4m success fee. The theft kills the deal. Her financial interest runs against the crime.',
    alibi:
      'Left the exhibition at 22:47. Phone record places her call to counsel at 22:31 in the atrium; vehicle left the north gate at 22:52 with only a handbag.',
    alibiStatus: 'CORROBORATED',
    summary:
      'Controlled, surgical and entirely unimpressed by the investigation. She argued with Vance, left before the theft was discovered, and the encrypted email is signed with her initial. She also had the most to lose from the prototype vanishing.',
    risk: [
      { label: 'ACCESS', value: 18 },
      { label: 'MOTIVE', value: 34 },
      { label: 'OPPORTUNITY', value: 26 },
      { label: 'CONCEALMENT', value: 58 },
    ],
    connections: [
      { name: 'Elias Vance', relation: 'Board adversary · acquisition dispute' },
      { name: 'Mara Voss', relation: 'Security liaison for the transfer' },
      { name: 'Halcyon Dynamics', relation: 'Counterparty · acquisition talks' },
    ],
    interview: [
      {
        question: 'Where were you when the prototype disappeared?',
        answer:
          'In my car, on the phone with counsel. I left at 22:47. I heard about the theft on the radio at midnight.',
      },
      {
        question: 'The encrypted email is signed “N”. That is your initial.',
        answer:
          'So is half of London. My calls are on record. My car is on record. I did not need to steal what I was already buying.',
        flag: 'notable',
      },
      {
        question: 'You argued with Dr Vance at 21:40.',
        answer:
          'He was being romantic about a weapon. I was being realistic about a company. That is not a motive to destroy the asset.',
      },
      {
        question: 'Who knew the sale was two days from closing?',
        answer:
          'The board. Vance. Security — they had to plan the transfer and the export paperwork.',
        flag: 'notable',
      },
      {
        question: 'Do you own a second handset?',
        answer:
          'A company phone for the Singapore office. It is in my bag, logged, and has been since September. Ask my assistant.',
      },
    ],
    pressurePoints: [
      'Initial “N” in the encrypted email is a deliberate-looking coincidence.',
      'Left the building before the theft was reported.',
      'Public argument with the device’s creator.',
      'Second handset on her corporate profile.',
    ],
    contradictions: [
      {
        claim: 'You left the building before the theft was reported.',
        note:
          'CCTV at the dock shows a figure in a dark coat wheeling SEC-114 into a grey panel van at 22:58:04. It is not your face. The van’s load is more than your message allows.',
        evidenceId: 'e-05',
      },
    ],
    evidence: ['e-05', 'e-06', 'e-10', 'e-13'],
  },
]

export const SUSPECTS_BY_ID = Object.fromEntries(
  SUSPECTS.map((suspect) => [suspect.id, suspect]),
) as Record<string, Suspect>
