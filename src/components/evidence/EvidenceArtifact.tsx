import type { ReactNode } from 'react'
import {
  Camera,
  FileText,
  Fingerprint,
  Mail,
  ScrollText,
  ShieldAlert,
} from 'lucide-react'
import type {
  EvidenceAnnotation,
  EvidenceAudioContent,
  EvidenceCctvContent,
  EvidenceDocumentContent,
  EvidenceEmailContent,
  EvidenceItem,
  EvidenceLogContent,
  EvidencePhotoContent,
  EvidenceWitnessContent,
} from '@/types'
import { cn } from '@/utils/cn'
import { CATEGORY_META } from '@/utils/format'

function PlateHeader({
  item,
  icon,
  note,
}: {
  item: EvidenceItem
  icon: ReactNode
  note?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-4 py-3">
      <div className="flex items-center gap-3">
        <span style={{ color: CATEGORY_META[item.category].color }}>{icon}</span>
        <span className="font-mono text-[9px] uppercase tracking-label text-bone/70">
          {item.code} · {CATEGORY_META[item.category].label}
        </span>
      </div>
      <span className="hidden font-mono text-[8px] uppercase tracking-label text-ash sm:block">
        {note ?? 'Chain of custody verified'}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Photo plates                                                        */
/* ------------------------------------------------------------------ */

function CradleScene() {
  return (
    <svg viewBox="0 0 800 500" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="plate-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12151a" />
          <stop offset="100%" stopColor="#08090b" />
        </linearGradient>
        <linearGradient id="plate-top" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#3a4049" />
          <stop offset="100%" stopColor="#23272d" />
        </linearGradient>
        <radialGradient id="plate-glow" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#C69A55" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#C69A55" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="url(#plate-floor)" />
      <rect width="800" height="500" fill="url(#plate-glow)" />
      <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
        <path d="M0 120H800M0 260H800M0 400H800" />
        <path d="M120 0V500M300 0V500M500 0V500M680 0V500" />
      </g>
      <g opacity="0.55" fill="#0d0f12" stroke="rgba(255,255,255,0.06)">
        <rect x="60" y="70" width="180" height="120" />
        <rect x="560" y="80" width="170" height="100" />
      </g>
      <path d="M258 300L542 300L578 436L222 436Z" fill="#0d0f12" />
      <path d="M258 300L542 300L520 214L280 214Z" fill="url(#plate-top)" />
      <path d="M280 214L520 214L542 300L258 300Z" fill="#2b3038" opacity="0.55" />
      <path d="M296 236H504V292H296Z" fill="#171a1f" stroke="rgba(255,255,255,0.09)" />
      <path d="M318 246H482V280H318Z" fill="#0a0b0d" />
      <path d="M330 252H470V274H330Z" fill="#050607" />
      <g fill="#3f454e">
        <circle cx="340" cy="263" r="3" />
        <circle cx="460" cy="263" r="3" />
        <circle cx="400" cy="255" r="2" />
      </g>
      <path
        d="M318 286C356 280 444 280 482 286"
        stroke="#C8C2B4"
        strokeWidth="3"
        strokeDasharray="14 5"
        opacity="0.7"
      />
      <path d="M404 288L428 300" stroke="#B83232" strokeWidth="2.5" opacity="0.9" />
      <path
        d="M292 318C360 324 440 324 508 318"
        stroke="rgba(198,154,85,0.22)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path d="M330 300C330 330 320 360 300 380" stroke="#1b1f24" strokeWidth="2" fill="none" />
      <g stroke="rgba(255,255,255,0.35)" strokeWidth="1">
        <path d="M230 470H570" />
        <path d="M230 464V476M280 464V476M330 464V476M380 464V476M430 464V476M480 464V476M530 464V476M570 464V476" />
      </g>
      <text
        x="230"
        y="456"
        fill="#858991"
        fontFamily="JetBrains Mono, monospace"
        fontSize="8"
        letterSpacing="2"
      >
        0 — 10 CM · FORENSIC SCALE
      </text>
      <text
        x="60"
        y="470"
        fill="#5e636b"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9"
        letterSpacing="2"
      >
        LAB-3 / PLINTH 01 / 22:56
      </text>
    </svg>
  )
}

function CaseScene() {
  return (
    <svg viewBox="0 0 800 500" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="case-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#111418" />
          <stop offset="100%" stopColor="#07080a" />
        </linearGradient>
        <linearGradient id="case-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a3f37" />
          <stop offset="100%" stopColor="#1c1f1c" />
        </linearGradient>
        <radialGradient id="case-light" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#C69A55" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#C69A55" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="url(#case-floor)" />
      <rect width="800" height="500" fill="url(#case-light)" />
      <g stroke="rgba(255,255,255,0.04)">
        <path d="M0 90H800M0 190H800M0 420H800" />
        <path d="M100 0V500M700 0V500" />
      </g>
      <path d="M120 420L680 420L720 470L80 470Z" fill="#0b0c0e" />
      <g>
        <path d="M236 210L564 210L596 400L204 400Z" fill="url(#case-body)" stroke="#4a4f45" />
        <path d="M236 210L564 210L548 178L252 178Z" fill="#2c302a" />
        <path d="M252 196L548 196L564 210L236 210Z" fill="#171a16" />
        <path d="M244 226L556 226L576 382L224 382Z" fill="#0e100d" />
        <path d="M260 240L540 240L556 366L244 366Z" fill="#242821" stroke="#4a4f45" />
        <path d="M300 258L500 258L514 348L286 348Z" fill="#0a0b09" stroke="rgba(198,154,85,0.25)" />
        <path d="M330 272H470V300H330Z" fill="#050605" />
        <path d="M310 312H490V334H310Z" fill="#050605" />
        <path d="M282 336L518 336" stroke="rgba(255,255,255,0.08)" />
        <g fill="#151713" stroke="#4a4f45">
          <rect x="276" y="252" width="18" height="88" />
          <rect x="506" y="252" width="18" height="88" />
        </g>
        <g fill="#3a3f37">
          <circle cx="270" cy="404" r="18" />
          <circle cx="530" cy="404" r="18" />
        </g>
        <g fill="#0a0b09">
          <circle cx="270" cy="404" r="8" />
          <circle cx="530" cy="404" r="8" />
        </g>
        <path d="M204 400L596 400" stroke="#565b50" strokeWidth="2" />
        <rect x="430" y="210" width="66" height="22" fill="#d9d2c0" />
        <text
          x="463"
          y="225"
          textAnchor="middle"
          fill="#1a1814"
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
          fontWeight="600"
        >
          SEC-114
        </text>
      </g>
      <g stroke="rgba(255,255,255,0.3)" strokeWidth="1">
        <path d="M150 455H650" />
        <path d="M150 449V461M250 449V461M350 449V461M450 449V461M550 449V461M650 449V461" />
      </g>
      <text
        x="150"
        y="442"
        fill="#858991"
        fontFamily="JetBrains Mono, monospace"
        fontSize="8"
        letterSpacing="2"
      >
        0 — 40 CM · SERVICE CORRIDOR
      </text>
      <text
        x="650"
        y="480"
        textAnchor="end"
        fill="#5e636b"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9"
        letterSpacing="2"
      >
        PLATE 02 / 23:18
      </text>
    </svg>
  )
}

function RfidScene() {
  return (
    <svg viewBox="0 0 800 500" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="rfid-table" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#1a1e24" />
          <stop offset="100%" stopColor="#0a0b0e" />
        </linearGradient>
        <radialGradient id="rfid-light" cx="45%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#C69A55" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#C69A55" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="url(#rfid-table)" />
      <rect width="800" height="500" fill="url(#rfid-light)" />
      <g stroke="rgba(255,255,255,0.05)">
        <path d="M0 330H800M0 360H800" />
      </g>
      <g transform="translate(210 170) rotate(-6)">
        <rect width="250" height="150" fill="#2b3038" stroke="#4b525c" />
        <rect x="16" y="16" width="218" height="70" fill="#0b0c0f" stroke="#1d2127" />
        <g stroke="#8fa69a" strokeWidth="1.4" opacity="0.75">
          <path d="M30 62L60 42L86 58L118 30L150 54L178 38L212 50" />
        </g>
        <rect x="16" y="98" width="66" height="36" fill="#1a1d22" stroke="#3a4049" />
        <rect x="94" y="98" width="66" height="36" fill="#1a1d22" stroke="#3a4049" />
        <circle cx="200" cy="118" r="13" fill="#B83232" opacity="0.8" />
        <text
          x="206"
          y="122"
          fill="#f2f0ea"
          fontFamily="JetBrains Mono, monospace"
          fontSize="8"
          textAnchor="middle"
        >
          PWR
        </text>
        <text
          x="16"
          y="90"
          fill="#858991"
          fontFamily="JetBrains Mono, monospace"
          fontSize="8"
          letterSpacing="2"
        >
          PX-8 · RFID WRITER
        </text>
      </g>
      <g transform="translate(520 250)">
        <rect width="88" height="56" fill="#d8d2c2" stroke="#8f8877" />
        <rect x="8" y="8" width="72" height="30" fill="none" stroke="#8f8877" strokeDasharray="3 3" />
        <text
          x="44"
          y="46"
          textAnchor="middle"
          fill="#2a2822"
          fontFamily="JetBrains Mono, monospace"
          fontSize="8"
          letterSpacing="1"
        >
          MIFARE
        </text>
      </g>
      <g transform="translate(480 320) rotate(8)">
        <rect width="88" height="56" fill="#cfc9b8" stroke="#8f8877" />
        <rect x="8" y="8" width="72" height="30" fill="none" stroke="#8f8877" strokeDasharray="3 3" />
        <text
          x="44"
          y="46"
          textAnchor="middle"
          fill="#2a2822"
          fontFamily="JetBrains Mono, monospace"
          fontSize="8"
          letterSpacing="1"
        >
          MIFARE
        </text>
      </g>
      <g transform="translate(548 380) rotate(-4)">
        <rect width="88" height="56" fill="#e2dccb" stroke="#B83232" strokeWidth="2" />
        <rect x="8" y="8" width="72" height="30" fill="none" stroke="#8f8877" strokeDasharray="3 3" />
        <text
          x="44"
          y="46"
          textAnchor="middle"
          fill="#8f1f1f"
          fontFamily="JetBrains Mono, monospace"
          fontSize="8"
          letterSpacing="1"
        >
          TAG #2
        </text>
      </g>
      <rect x="120" y="120" width="140" height="42" fill="#14171b" stroke="#3a4049" />
      <text
        x="190"
        y="138"
        textAnchor="middle"
        fill="#C69A55"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9"
        letterSpacing="2"
      >
        LOCKER 03
      </text>
      <text
        x="190"
        y="152"
        textAnchor="middle"
        fill="#858991"
        fontFamily="JetBrains Mono, monospace"
        fontSize="8"
        letterSpacing="2"
      >
        M. VOSS
      </text>
      <text
        x="60"
        y="470"
        fill="#5e636b"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9"
        letterSpacing="2"
      >
        SECURITY STORAGE / 01:05
      </text>
    </svg>
  )
}

function DeviceScene() {
  return (
    <svg viewBox="0 0 800 500" className="h-full w-full" aria-hidden="true">
      <rect width="800" height="500" fill="#0a0b0d" />
      <g stroke="rgba(255,255,255,0.05)">
        <path d="M0 140H800M0 360H800M200 0V500M600 0V500" />
      </g>
      <rect x="300" y="150" width="200" height="200" fill="#171a1f" stroke="#3a4049" />
      <circle cx="400" cy="250" r="62" fill="#0d0f12" stroke="#C69A55" strokeWidth="1" />
      <circle cx="400" cy="250" r="34" fill="none" stroke="#3a4049" />
      <path d="M330 250H470M400 180V320" stroke="rgba(198,154,85,0.3)" />
      <text
        x="400"
        y="390"
        textAnchor="middle"
        fill="#858991"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9"
        letterSpacing="3"
      >
        VANTAGE-7 / CALIBRATION CRADLE
      </text>
    </svg>
  )
}

function PhotoPlate({ item }: { item: EvidenceItem }) {
  const content = item.content as EvidencePhotoContent
  const scene =
    content.scene === 'cradle' ? (
      <CradleScene />
    ) : content.scene === 'case' ? (
      <CaseScene />
    ) : content.scene === 'rfid' ? (
      <RfidScene />
    ) : (
      <DeviceScene />
    )

  return (
    <div>
      <div className="artifact-frame relative aspect-[16/10] overflow-hidden">
        {scene}
        <div className="pointer-events-none absolute inset-0 noise opacity-[0.07] mix-blend-screen" />
        <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 font-mono text-[8px] uppercase tracking-label text-bone/50">
          {item.code} / forensic plate
        </div>
        {content.annotations.map((annotation: EvidenceAnnotation) => (
          <div
            key={annotation.label}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
          >
            <span className="marker-pulse absolute inset-0 rounded-full border border-brass/60" />
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full border border-brass bg-ink-950/80 font-mono text-[9px] text-brass">
              {annotation.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {content.annotations.map((annotation) => (
          <div key={annotation.label} className="border-l border-brass/30 pl-3">
            <div className="font-mono text-[9px] uppercase tracking-label text-brass">
              Marker {annotation.label}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ash">{annotation.note}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 font-mono text-[9px] uppercase tracking-label text-ash/70">{content.caption}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Documents                                                           */
/* ------------------------------------------------------------------ */

function PaperSheet({ children, stamp }: { children: ReactNode; stamp?: string }) {
  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="paper doc-edge relative px-6 py-8 sm:px-10 sm:py-10">
        {children}
        {stamp && (
          <div className="absolute right-6 top-8 sm:right-10">
            <div className="stamp text-[#9c2727]" style={{ borderColor: '#9c2727' }}>
              {stamp}
            </div>
          </div>
        )}
        <div className="mt-10 flex items-center justify-between border-t border-black/15 pt-3 font-mono text-[8px] uppercase tracking-[0.18em] text-black/45">
          <span>Meridian Sound Labs · document control</span>
          <span>Page 1 / 1</span>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
    </div>
  )
}

function DocumentArtifact({ content }: { content: EvidenceDocumentContent }) {
  return (
    <PaperSheet stamp={content.stamp}>
      <div className="flex items-start justify-between border-b border-black/25 pb-4">
        <div>
          <div className="font-mono text-[8px] uppercase tracking-[0.26em] text-black/50">
            Meridian Sound Labs
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-black/70">
            Building C · Kestrel Wharf · London
          </div>
        </div>
        <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/45">Internal</div>
      </div>

      <div className="mt-6">
        <div className="font-mono text-[8px] uppercase tracking-[0.24em] text-black/45">
          {content.ref}
        </div>
        <h3 className="mt-2 font-serif text-3xl leading-tight text-[#191713]">{content.docTitle}</h3>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 border-y border-black/15 py-4 sm:grid-cols-2">
        {content.fields.map((field) => (
          <div key={field.label} className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-black/45">
              {field.label}
            </span>
            <span className="text-right font-mono text-[9px] uppercase tracking-[0.06em] text-black/75">
              {field.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3 text-[12.5px] leading-relaxed text-black/80">
        {content.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {content.bullets && (
        <ul className="mt-4 space-y-1.5 border-l border-black/20 pl-4">
          {content.bullets.map((bullet) => (
            <li key={bullet} className="text-[12px] leading-relaxed text-black/70">
              — {bullet}
            </li>
          ))}
        </ul>
      )}

      {content.signature && (
        <div className="mt-8">
          <div className="font-serif text-2xl italic text-black/75">{content.signature}</div>
          <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-black/40">
            Authorised signature
          </div>
        </div>
      )}

      {content.note && (
        <div className="mt-6 border-l-2 border-[#9c2727]/50 pl-3 font-mono text-[9px] leading-relaxed tracking-[0.03em] text-black/50">
          FORENSIC NOTE: {content.note}
        </div>
      )}
    </PaperSheet>
  )
}

/* ------------------------------------------------------------------ */
/* Email                                                               */
/* ------------------------------------------------------------------ */

function EmailArtifact({ content }: { content: EvidenceEmailContent }) {
  return (
    <div className="border border-white/[0.1] bg-ink-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-ink-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-brass" />
          <span className="font-mono text-[9px] uppercase tracking-label text-bone/70">
            Secure message viewer
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip border-brass/40 text-brass">PGP · decrypted</span>
          <span className="chip">Relay copy</span>
        </div>
      </div>

      <div className="space-y-2 border-b border-white/[0.08] px-4 py-4 font-mono text-[10px]">
        <div className="flex gap-3">
          <span className="w-20 shrink-0 uppercase tracking-label text-ash/70">From</span>
          <span className="text-bone/90">{content.from}</span>
        </div>
        <div className="flex gap-3">
          <span className="w-20 shrink-0 uppercase tracking-label text-ash/70">To</span>
          <span className="text-bone/90">{content.to}</span>
        </div>
        <div className="flex gap-3">
          <span className="w-20 shrink-0 uppercase tracking-label text-ash/70">Subject</span>
          <span className="text-brass">{content.subject}</span>
        </div>
        <div className="flex gap-3">
          <span className="w-20 shrink-0 uppercase tracking-label text-ash/70">Sent</span>
          <span className="text-bone/70">{content.sentAt}</span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_240px]">
        <div className="px-4 py-5 sm:px-6">
          <div className="space-y-3 text-[13.5px] leading-relaxed text-bone/85">
            {content.body.map((line, index) => (
              <p key={index} className={line.startsWith('—') ? 'pt-2 font-serif text-xl italic text-brass' : ''}>
                {line}
              </p>
            ))}
          </div>
          {content.attachment && (
            <div className="mt-6 flex items-center gap-3 border border-white/[0.09] bg-white/[0.02] px-3 py-2.5">
              <FileText size={14} className="text-ash" />
              <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ash">
                {content.attachment}
              </span>
            </div>
          )}
        </div>
        <aside className="border-t border-white/[0.08] bg-ink-950/40 px-4 py-5 lg:border-l lg:border-t-0">
          <div className="label mb-3 text-brass">Message metadata</div>
          <dl className="space-y-3">
            {content.headers.map((header) => (
              <div key={header.label}>
                <dt className="font-mono text-[8px] uppercase tracking-[0.16em] text-ash/60">
                  {header.label}
                </dt>
                <dd className="mt-0.5 break-words font-mono text-[9.5px] leading-relaxed text-bone/75">
                  {header.value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Logs                                                                */
/* ------------------------------------------------------------------ */

function LogArtifact({ content }: { content: EvidenceLogContent }) {
  return (
    <div className="border border-white/[0.1] bg-ink-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] bg-ink-800 px-4 py-3">
        <span className="font-mono text-[9px] uppercase tracking-label text-bone/70">{content.system}</span>
        <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-label text-[#9DB8A4]">
          <span className="h-[4px] w-[4px] animate-pulse-dot rounded-full bg-[#9DB8A4]" />
          Export verified
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse font-mono text-[10px]">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
              {content.columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-4 py-2.5 text-left text-[8px] font-normal uppercase tracking-[0.16em] text-ash"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  'border-b border-white/[0.045] last:border-0',
                  row.flag === 'crit' && 'bg-blood/[0.09]',
                  row.flag === 'warn' && 'bg-brass/[0.055]',
                )}
              >
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cn(
                      'whitespace-nowrap px-4 py-2.5 text-bone/70',
                      cellIndex === 0 && 'text-bone/50',
                      row.flag === 'crit' && cellIndex === row.cells.length - 1 && 'text-[#E08A8A]',
                      row.flag === 'warn' && cellIndex === row.cells.length - 1 && 'text-brass',
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {content.footer && (
        <div className="border-t border-white/[0.08] bg-ink-950/50 px-4 py-3 font-mono text-[9px] leading-relaxed tracking-[0.02em] text-ash">
          {content.footer}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* CCTV                                                                */
/* ------------------------------------------------------------------ */

function CorridorScene() {
  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="corr-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#15181d" />
          <stop offset="100%" stopColor="#07080a" />
        </linearGradient>
        <linearGradient id="corr-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#101216" />
          <stop offset="100%" stopColor="#050607" />
        </linearGradient>
        <radialGradient id="corr-light" cx="50%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#9AA1AA" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#9AA1AA" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="#060708" />
      <path d="M0 0H800V450H0Z" fill="url(#corr-wall)" />
      <path d="M0 450L270 250H530L800 450Z" fill="url(#corr-floor)" />
      <path d="M0 0L270 250V450H0Z" fill="#0a0b0e" />
      <path d="M800 0L530 250V450H800Z" fill="#0a0b0e" />
      <path d="M270 250H530V450H270Z" fill="#08090b" />
      <rect x="270" y="250" width="260" height="200" fill="url(#corr-light)" />
      <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
        <path d="M0 120L270 250M800 120L530 250M0 300L270 300M800 300L530 300" />
      </g>
      <g fill="#0d0f12" stroke="rgba(255,255,255,0.07)">
        <rect x="80" y="130" width="90" height="150" />
        <rect x="620" y="130" width="90" height="150" />
      </g>
      <rect x="300" y="180" width="70" height="100" fill="#0b0c0f" stroke="rgba(198,154,85,0.2)" />
      <text
        x="335"
        y="235"
        textAnchor="middle"
        fill="rgba(198,154,85,0.45)"
        fontFamily="JetBrains Mono, monospace"
        fontSize="8"
        letterSpacing="2"
      >
        LAB 3
      </text>
      <g opacity="0.9">
        <path
          d="M405 262C397 250 398 236 408 228C418 220 430 226 431 238C432 246 427 253 424 258L436 320L446 360H431L422 330L412 364H397L403 318Z"
          fill="#242930"
          stroke="rgba(198,154,85,0.2)"
        />
        <path d="M409 232C414 226 423 226 428 231" stroke="#C69A55" strokeWidth="1.5" opacity="0.5" fill="none" />
        <path d="M403 318L399 348" stroke="#15171b" strokeWidth="7" />
        <rect x="434" y="300" width="46" height="58" fill="#1a1d22" stroke="rgba(255,255,255,0.1)" />
        <circle cx="447" cy="362" r="7" fill="#101216" stroke="#3a4049" />
        <circle cx="469" cy="362" r="7" fill="#101216" stroke="#3a4049" />
        <path d="M434 312H480" stroke="rgba(255,255,255,0.08)" />
        <rect x="416" y="268" width="16" height="30" fill="#1c2026" />
        <path d="M418 280H430" stroke="#C69A55" strokeWidth="2" opacity="0.6" />
      </g>
      <rect x="280" y="80" width="240" height="34" fill="#0b0c0f" stroke="rgba(184,50,50,0.25)" />
      <text
        x="400"
        y="102"
        textAnchor="middle"
        fill="rgba(184,50,50,0.55)"
        fontFamily="JetBrains Mono, monospace"
        fontSize="10"
        letterSpacing="5"
      >
        SERVICE CORRIDOR
      </text>
      <path d="M0 450H800" stroke="rgba(255,255,255,0.05)" />
    </svg>
  )
}

function DockScene() {
  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="dock-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14171b" />
          <stop offset="100%" stopColor="#060708" />
        </linearGradient>
        <linearGradient id="dock-door" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d2127" />
          <stop offset="100%" stopColor="#0b0c0f" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#dock-bg)" />
      <path d="M0 450L90 280H710L800 450Z" fill="#0a0b0d" />
      <rect x="120" y="80" width="560" height="210" fill="#050607" stroke="#2b3038" />
      <g stroke="rgba(255,255,255,0.045)">
        <path d="M120 110H680M120 140H680M120 170H680M120 200H680M120 230H680M120 260H680" />
      </g>
      <g>
        <rect x="470" y="150" width="210" height="160" fill="#2a2e33" stroke="#4a5059" />
        <rect x="490" y="170" width="170" height="60" fill="#121418" stroke="#3a4049" />
        <rect x="490" y="240" width="170" height="50" fill="#1c2026" />
        <circle cx="510" cy="316" r="17" fill="#0a0b0d" stroke="#3a4049" />
        <circle cx="650" cy="316" r="17" fill="#0a0b0d" stroke="#3a4049" />
        <rect x="470" y="150" width="210" height="12" fill="#383d44" />
        <rect x="520" y="130" width="30" height="24" fill="#3a4049" />
        <rect x="610" y="130" width="30" height="24" fill="#3a4049" />
        <text
          x="575"
          y="146"
          textAnchor="middle"
          fill="rgba(255,255,255,0.18)"
          fontFamily="JetBrains Mono, monospace"
          fontSize="8"
          letterSpacing="2"
        >
          KESTREL COURIERS
        </text>
      </g>
      <g>
        <path
          d="M300 196C293 184 295 170 305 163C315 156 327 162 328 174C329 183 323 189 320 194L332 262L342 300H327L318 268L308 304H293L300 250Z"
          fill="#1e2228"
          stroke="rgba(198,154,85,0.18)"
        />
        <path d="M299 250L313 268" stroke="#C69A55" strokeWidth="1" opacity="0.3" />
        <rect x="340" y="260" width="58" height="48" fill="#2b3038" stroke="#4a5059" />
        <rect x="348" y="268" width="42" height="32" fill="#101216" />
        <circle cx="354" cy="312" r="6" fill="#0a0b0d" stroke="#3a4049" />
        <circle cx="384" cy="312" r="6" fill="#0a0b0d" stroke="#3a4049" />
        <rect x="350" y="252" width="38" height="8" fill="#3a4049" />
        <rect x="360" y="254" width="18" height="4" fill="#C69A55" opacity="0.4" />
      </g>
      <g opacity="0.4" stroke="#C69A55" strokeWidth="1">
        <path d="M120 80H150M120 80V110" />
        <path d="M680 80H650M680 80V110" />
      </g>
      <text
        x="140"
        y="60"
        fill="rgba(198,154,85,0.45)"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9"
        letterSpacing="3"
      >
        NORTH DOCK / CAM-12
      </text>
      <path d="M0 450H800" stroke="rgba(255,255,255,0.06)" />
    </svg>
  )
}

function CctvArtifact({ content }: { content: EvidenceCctvContent }) {
  return (
    <div>
      <div className="cctv-frame relative aspect-video border border-white/[0.1]">
        {content.scene === 'corridor' ? <CorridorScene /> : <DockScene />}
        <div className="pointer-events-none absolute inset-0 noise opacity-[0.1] mix-blend-screen" />

        <div className="absolute left-4 top-4 flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-label text-[#E08A8A]">
            <span className="h-[6px] w-[6px] animate-pulse-dot rounded-full bg-[#B83232]" />
            REC
          </span>
          <span className="font-mono text-[9px] uppercase tracking-label text-bone/60">
            {content.camera}
          </span>
        </div>

        <div className="absolute right-4 top-4 text-right font-mono text-[9px] uppercase tracking-label text-bone/60">
          <div>{content.timestamp}</div>
          <div className="mt-1 text-[8px] text-ash/60">{content.quality}</div>
        </div>

        <div className="absolute bottom-4 left-4 space-y-1">
          {content.overlays.map((overlay) => (
            <div
              key={overlay}
              className="w-fit border border-white/10 bg-black/45 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-bone/65 backdrop-blur-[1px]"
            >
              {overlay}
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 right-4 font-mono text-[8px] uppercase tracking-label text-bone/40">
          {content.location}
        </div>

        <div className="pointer-events-none absolute inset-0 border border-white/[0.06]" />
      </div>
      {content.transcript && (
        <div className="mt-4 border-l border-steel/40 pl-4">
          <div className="font-mono text-[9px] uppercase tracking-label text-steel">Frame analysis</div>
          <p className="mt-1.5 text-xs leading-relaxed text-ash">{content.transcript}</p>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Audio + witness                                                     */
/* ------------------------------------------------------------------ */

function AudioArtifact({ content }: { content: EvidenceAudioContent }) {
  return (
    <div className="border border-white/[0.1] bg-ink-900">
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-ink-800 px-4 py-3">
        <span className="font-mono text-[9px] uppercase tracking-label text-bone/70">
          {content.source}
        </span>
        <span className="font-mono text-[9px] text-ash">{content.duration}</span>
      </div>
      <div className="flex h-28 items-center gap-[2px] px-4">
        {content.waveform.map((value, index) => (
          <div
            key={index}
            className="flex-1 bg-brass/40"
            style={{ height: `${Math.max(6, value)}%` }}
          />
        ))}
      </div>
      <div className="border-t border-white/[0.08] px-4 py-4">
        {content.transcript.map((line, index) => (
          <div key={index} className="flex gap-4 py-2">
            <span className="w-12 shrink-0 font-mono text-[9px] text-ash/60">{line.time}</span>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-label text-brass">{line.speaker}</div>
              <p className="mt-1 text-xs leading-relaxed text-bone/75">{line.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WitnessArtifact({ content }: { content: EvidenceWitnessContent }) {
  return (
    <PaperSheet>
      <div className="flex items-start justify-between border-b border-black/25 pb-4">
        <div>
          <div className="font-mono text-[8px] uppercase tracking-[0.26em] text-black/50">
            Metropolitan Police Service
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-black/70">
            Witness statement · MG11
          </div>
        </div>
        <div className="text-right font-mono text-[8px] uppercase tracking-[0.16em] text-black/45">
          <div>{content.statementNo}</div>
          <div className="mt-1">Copy 1 / 3</div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-b border-black/15 pb-4 font-mono text-[9px] text-black/65 sm:grid-cols-2">
        <div>
          <div className="text-[8px] uppercase tracking-[0.18em] text-black/40">Statement taken at</div>
          <div className="mt-0.5">{content.takenAt}</div>
        </div>
        <div>
          <div className="text-[8px] uppercase tracking-[0.18em] text-black/40">Taken by</div>
          <div className="mt-0.5">{content.takenBy}</div>
        </div>
      </div>

      <div className="mt-5 space-y-4 font-serif text-[15px] leading-[1.75] text-black/80">
        {content.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-8 border-t border-black/15 pt-4">
        <div className="font-serif text-2xl italic text-black/75">{content.signature}</div>
        <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-black/40">
          Witness signature
        </div>
      </div>

      {content.note && (
        <div className="mt-6 border-l-2 border-black/20 pl-3 font-mono text-[9px] leading-relaxed text-black/50">
          INVESTIGATOR NOTE: {content.note}
        </div>
      )}
    </PaperSheet>
  )
}

/* ------------------------------------------------------------------ */
/* Dispatcher                                                          */
/* ------------------------------------------------------------------ */

export function EvidenceArtifact({ item }: { item: EvidenceItem }) {
  const icon =
    item.kind === 'cctv' ? (
      <Camera size={14} />
    ) : item.kind === 'email' ? (
      <Mail size={14} />
    ) : item.kind === 'witness' ? (
      <ScrollText size={14} />
    ) : item.kind === 'photo' ? (
      <Fingerprint size={14} />
    ) : item.kind === 'document' ? (
      <FileText size={14} />
    ) : (
      <ShieldAlert size={14} />
    )

  return (
    <div>
      <PlateHeader
        item={item}
        icon={icon}
        note={item.kind === 'cctv' ? 'Recovered media · hash verified' : undefined}
      />
      <div className="p-3 sm:p-5">
        {item.content.kind === 'photo' && <PhotoPlate item={item} />}
        {item.content.kind === 'document' && <DocumentArtifact content={item.content} />}
        {item.content.kind === 'email' && <EmailArtifact content={item.content} />}
        {item.content.kind === 'log' && <LogArtifact content={item.content} />}
        {item.content.kind === 'cctv' && <CctvArtifact content={item.content} />}
        {item.content.kind === 'audio' && <AudioArtifact content={item.content} />}
        {item.content.kind === 'witness' && <WitnessArtifact content={item.content} />}
      </div>
    </div>
  )
}
