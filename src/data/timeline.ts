import type { TimelineEvent } from '@/types'

export const TIMELINE: TimelineEvent[] = [
  {
    id: 't-01',
    time: '21:30',
    sortKey: '21:30',
    title: 'Private exhibition opens',
    summary:
      'Meridian Sound Labs opens its private technology exhibition in the Building C atrium. VANTAGE-7 is on display in Laboratory 3, behind restricted access.',
    detail:
      'Forty-one guests, seven board members and the project team are present. The prototype is mounted on its powered cradle in Laboratory 3. The anti-tamper seal is intact at the start of the evening. Security is managed from SEC-01 by the Director of Security.',
    source: 'Event schedule / guest manifest',
    evidenceIds: ['e-10', 'e-01'],
    verified: true,
    critical: false,
  },
  {
    id: 't-02',
    time: '21:40',
    sortKey: '21:40',
    title: 'Vance and Kaur argue',
    summary:
      'Dr Elias Vance confronts board director Nadia Kaur about the Halcyon acquisition. Witnesses hear him say he will not let the device leave the building.',
    detail:
      'The exchange lasts under three minutes but is overheard by at least six guests. Kaur is pushing to close the sale on 16 November. Vance voted against it and considers the buyer’s intentions military. Both later confirm the argument. Neither denies the words.',
    source: 'Witness accounts / E-13',
    evidenceIds: ['e-13', 'e-10'],
    verified: true,
    critical: false,
  },
  {
    id: 't-03',
    time: '21:58',
    sortKey: '21:58',
    title: 'Reyes enters the security office',
    summary:
      'Julian Reyes badges into the security office to deliver a firmware drive. Sixty-eight seconds later, a tag matching his credential is written by an RFID writer inside the office.',
    detail:
      'The access log records J-114 at 21:58:14. The security controller records an RFID read at 21:58:41 and a write at 21:59:22. Reyes says he stayed two minutes and left his jacket by the door. The writer is later recovered from security storage locker 03, assigned to M. Voss.',
    source: 'Access log / controller audit / E-14',
    evidenceIds: ['e-03', 'e-04', 'e-14', 'e-11'],
    verified: true,
    critical: true,
    accounts: [
      { source: 'Access log', time: '21:58:14', claim: 'J-114 enters SEC-OFFICE.' },
      { source: 'RFID writer memory', time: '21:59:22', claim: 'J-114 tag written in SEC-OFFICE.' },
      {
        source: 'J. Reyes statement',
        time: '21:58–22:00',
        claim: 'Delivered a drive, stayed two minutes, card in jacket.',
      },
    ],
    contradiction: {
      requiresEvidence: 'e-14',
      note: 'Reyes’s card could not have been written after he left unless someone else had physical access to it. The writer was in a locker assigned to Voss.',
    },
  },
  {
    id: 't-04',
    time: '22:12',
    sortKey: '22:12',
    title: 'Vance enters Laboratory 3',
    summary:
      'Vance collects his calibration notebook. He confirms the prototype was on its cradle and the seal was intact. This is the last confirmed sighting of the device in place.',
    detail:
      'V-001 opens the lab at 22:12:06. Vance is inside for under four minutes. The calibration key remains in his notebook, not with the prototype. After this entry, no legitimate access to Laboratory 3 is recorded until 22:44.',
    source: 'Access log / E-13',
    evidenceIds: ['e-03', 'e-13', 'e-01'],
    verified: true,
    critical: true,
  },
  {
    id: 't-05',
    time: '22:29',
    sortKey: '22:29',
    title: 'Unregistered device joins guest Wi-Fi',
    summary:
      'A handset with no corporate registration associates with access point AP-03 in the security wing. It remains connected for four minutes.',
    detail:
      'The device MAC 9C:4E:20:1A:77:B3 is not in the Meridian device registry. It associates with AP-03 at 22:29:41. AP-03 serves the security office and the restricted-wing corridor. The same device sends the encrypted email two minutes later.',
    source: 'Network association log / E-04',
    evidenceIds: ['e-04', 'e-05'],
    verified: true,
    critical: true,
  },
  {
    id: 't-06',
    time: '22:31',
    sortKey: '22:31',
    title: 'Two calls, one email',
    summary:
      'Nadia Kaur calls her lawyer from the atrium. At the same minute, an unregistered handset calls Halcyon Dynamics from the security wing — and an encrypted email is sent.',
    detail:
      'Kaur’s call lasts 4:12 and is confirmed by her counsel. The unregistered handset makes two short calls to Halcyon’s procurement line. At 22:31:47 the encrypted “Lot 7” email leaves the guest network via AP-03. The email names the blackout window, the SEC-114 case and the 22:58 dock handoff.',
    source: 'Carrier record / mail relay / E-05–E-06',
    evidenceIds: ['e-05', 'e-06'],
    verified: true,
    critical: true,
    accounts: [
      {
        source: 'Carrier record',
        time: '22:31:02',
        claim: 'Kaur calls Harrow & Finch LLP from the atrium (4:12).',
      },
      {
        source: 'Carrier record',
        time: '22:31:47',
        claim: 'Unregistered handset calls Halcyon from security wing.',
      },
      {
        source: 'Mail relay',
        time: '22:31:47',
        claim: 'Encrypted message sent from AP-03, security wing.',
      },
    ],
  },
  {
    id: 't-07',
    time: '22:42',
    sortKey: '22:42',
    title: 'The blackout begins',
    summary:
      'UPS-2 receives a signed firmware update from SEC-01. A 660-second maintenance window isolates the camera bus and intrusion sensors. Door controllers remain live.',
    detail:
      'The controller logs no surge and no hardware fault. The maintenance window is deliberate and time-boxed: 22:42:11 to 22:53:11. Cameras on the bus go dark. Legacy CAM-07, with local storage, continues recording. The security director’s incident report later describes the event as a power surge beginning at 22:45 and lasting nineteen minutes.',
    source: 'UPS-2 audit trail / E-04',
    evidenceIds: ['e-04', 'e-09'],
    verified: true,
    critical: true,
    accounts: [
      {
        source: 'IR-114 (M. Voss)',
        time: '22:45',
        claim: 'Unexpected power surge; camera bus lost for ~19 minutes.',
      },
      {
        source: 'UPS-2 controller',
        time: '22:42:11',
        claim: 'Signed firmware 4.8.1 push; maintenance window 660 seconds.',
      },
    ],
    contradiction: {
      requiresEvidence: 'e-04',
      note: 'The controller recorded a scheduled firmware maintenance window, not a surge. The report’s start time is three minutes late and its duration is eight minutes long.',
    },
  },
  {
    id: 't-08',
    time: '22:44',
    sortKey: '22:44',
    title: 'Laboratory 3 opens',
    summary:
      'The lab door opens on credential J-114 under a single-factor override issued from SEC-01. Julian Reyes is at the catering counter in the atrium.',
    detail:
      'The access event is the only entry to Laboratory 3 during the blackout. It bypasses the six-digit PIN using a security override generated at 22:43:58. J-114 was cloned in the security office at 21:59. Reyes’s phone remains associated with the atrium access point; the caterer places him at the east counter.',
    source: 'Access log / override record / E-12',
    evidenceIds: ['e-03', 'e-04', 'e-12', 'e-14'],
    verified: true,
    critical: true,
    accounts: [
      {
        source: 'Access log',
        time: '22:44:09',
        claim: 'J-114 granted at LAB-3 under OVERRIDE SEC-01.',
      },
      {
        source: 'P. Nair statement',
        time: '22:35–23:06',
        claim: 'Reyes at the east counter throughout.',
      },
      {
        source: 'Atrium AP log',
        time: '22:36–23:06',
        claim: 'Reyes’s phone continuously in the atrium.',
      },
    ],
    contradiction: {
      requiresEvidence: 'e-12',
      note: 'The credential was at the door. The cardholder was in the atrium. The override — not the card — is the thread that leads back to security.',
    },
  },
  {
    id: 't-09',
    time: '22:45',
    sortKey: '22:45',
    title: 'CAM-07 is disconnected',
    summary:
      'The only camera still recording captures a figure in a security jacket moving away from the lab with a wheeled case. Twelve seconds later the signal dies.',
    detail:
      'Motion is detected at 22:44:52. The subject is filmed from behind, moving toward the north service corridor, height estimated at 1.72 m ± 0.03. The case measures 62 × 41 cm. The reflective shoulder stripe matches Meridian security uniforms. The SD card is removed from the camera.',
    source: 'CAM-07 local SD recovery / E-07',
    evidenceIds: ['e-07', 'e-01', 'e-02'],
    verified: true,
    critical: true,
  },
  {
    id: 't-10',
    time: '22:47',
    sortKey: '22:47',
    title: 'Nadia Kaur leaves',
    summary:
      'Kaur departs the exhibition, citing an early flight. Her car leaves the north gate at 22:52 with a single handbag. No case is loaded.',
    detail:
      'Lobby staff confirm her departure. The north gate camera records the vehicle. The timing places her outside the building before the theft is reported, but the dock handoff occurs after systems are restored. Her call to counsel is already on record. No physical evidence links her to the SEC-114 case.',
    source: 'Lobby log / gate camera / E-06',
    evidenceIds: ['e-06', 'e-13'],
    verified: true,
    critical: false,
  },
  {
    id: 't-11',
    time: '22:50',
    sortKey: '22:50',
    title: 'Reyes reports his card missing',
    summary:
      'Julian Reyes tells the security office his access card is gone. It is deactivated at 22:51 — six minutes after the clone opened Laboratory 3.',
    detail:
      'Reyes is visibly distressed. He reports the loss before the theft is discovered. The card is deactivated from the admin console by V-019. The original card is never recovered. The clone remains in the RFID writer’s pouch until the forensic sweep.',
    source: 'Security desk log / E-11',
    evidenceIds: ['e-11', 'e-03', 'e-14'],
    verified: true,
    critical: false,
  },
  {
    id: 't-12',
    time: '22:53',
    sortKey: '22:53',
    title: 'The theft is discovered',
    summary:
      'Vance returns to Laboratory 3 and finds the cradle empty. At the same moment, the firmware maintenance window ends and the camera bus returns.',
    detail:
      'Vance raises the alarm at 22:53. The empty cradle is photographed at 22:56. The controller logs the maintenance window ending at 22:53:11. The dock handoff is still five minutes away. Security does not seal the north dock.',
    source: 'E-01 / E-04 / incident log',
    evidenceIds: ['e-01', 'e-04', 'e-09'],
    verified: true,
    critical: true,
    accounts: [
      {
        source: 'Vance statement',
        time: '22:53',
        claim: 'Found cradle empty; raised alarm immediately.',
      },
      {
        source: 'UPS-2 controller',
        time: '22:53:11',
        claim: 'Maintenance window ended; systems nominal.',
      },
    ],
  },
  {
    id: 't-13',
    time: '22:58',
    sortKey: '22:58',
    title: 'The dock handoff',
    summary:
      'CAM-12 captures a figure loading the SEC-114 case into a grey panel van at the north dock. The interaction lasts forty-one seconds.',
    detail:
      'The dock door is opened with a security master key. The door was on the maintenance bus, so no alarm is raised. The van’s partial plate resolves to a dissolved shell company. The case tag is legible. The driver never leaves the cab. The figure returns through the service stair toward the security wing.',
    source: 'CAM-12 NVR export / E-08',
    evidenceIds: ['e-08', 'e-02', 'e-05'],
    verified: true,
    critical: true,
  },
  {
    id: 't-14',
    time: '23:04',
    sortKey: '23:04',
    title: 'Incident report IR-114 filed',
    summary:
      'Mara Voss files the official account: a power surge, nineteen minutes of lost coverage, systems restored at 23:04. CAM-07 had been restored two minutes earlier.',
    detail:
      'The report recommends an audit of the maintenance contractor. It does not mention the firmware push, the override, the RFID write, or the north dock. The controller records CAM-07 signal restoration at 23:02:47 and the report filing at 23:04:02. The maintenance window had actually ended at 22:53:11.',
    source: 'IR-114 / controller audit / E-09',
    evidenceIds: ['e-09', 'e-04', 'e-07'],
    verified: true,
    critical: true,
    accounts: [
      {
        source: 'IR-114 (M. Voss)',
        time: '23:04',
        claim: 'Systems restored after nineteen-minute surge.',
      },
      {
        source: 'UPS-2 controller',
        time: '22:53:11',
        claim: 'Window ended; systems nominal 11 minutes earlier.',
      },
      {
        source: 'CAM-07 controller',
        time: '23:02:47',
        claim: 'Camera signal restored manually.',
      },
    ],
    contradiction: {
      requiresEvidence: 'e-09',
      note: 'The report’s restoration time post-dates the system’s own recovery by eleven minutes. The author describes an event her equipment had already ended.',
    },
  },
]
