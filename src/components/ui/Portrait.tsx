import { cn } from '@/utils/cn'

type PortraitVariant = 'vance' | 'voss' | 'reyes' | 'kaur'

function Hair({ variant }: { variant: PortraitVariant }) {
  if (variant === 'vance') {
    return (
      <>
        <path
          d="M138 196C136 132 160 104 200 104C240 104 264 132 262 196C252 164 232 150 200 150C168 150 148 164 138 196Z"
          fill="#15181d"
        />
        <path d="M138 196C140 170 148 156 160 148" stroke="#3b414a" strokeWidth="1.2" fill="none" />
        <g stroke="#8b8f96" strokeWidth="1.1" opacity="0.55" fill="none">
          <rect x="152" y="198" width="40" height="21" rx="2" />
          <rect x="208" y="198" width="40" height="21" rx="2" />
          <path d="M192 207h16" />
        </g>
      </>
    )
  }

  if (variant === 'voss') {
    return (
      <>
        <path
          d="M134 218C128 138 158 100 200 100C242 100 272 138 266 218L254 252L250 154C232 138 168 138 150 154L146 252Z"
          fill="#13161a"
        />
        <path d="M134 218C136 166 148 132 170 114" stroke="#3b414a" strokeWidth="1.2" fill="none" />
        <path d="M200 102V150" stroke="#2b3038" strokeWidth="1" opacity="0.6" />
      </>
    )
  }

  if (variant === 'reyes') {
    return (
      <>
        <g fill="#15181d">
          <circle cx="152" cy="142" r="24" />
          <circle cx="178" cy="116" r="24" />
          <circle cx="210" cy="108" r="25" />
          <circle cx="242" cy="124" r="23" />
          <circle cx="258" cy="156" r="20" />
          <circle cx="143" cy="174" r="18" />
          <path d="M140 190C140 130 165 104 200 104C236 104 260 130 260 190C248 160 228 148 200 148C172 148 152 160 140 190Z" />
        </g>
        <path d="M148 140c8-16 24-26 42-28" stroke="#3b414a" strokeWidth="1" fill="none" opacity="0.7" />
      </>
    )
  }

  return (
    <>
      <ellipse cx="154" cy="318" rx="26" ry="20" fill="#13161a" />
      <path
        d="M136 216C132 136 160 100 200 100C240 100 268 136 264 216L254 250L250 156C230 140 170 140 150 156L146 250Z"
        fill="#13161a"
      />
      <path d="M200 102V154" stroke="#2b3038" strokeWidth="1" opacity="0.7" />
      <path d="M136 216C138 168 150 136 168 118" stroke="#3b414a" strokeWidth="1.2" fill="none" />
      <circle cx="142" cy="246" r="3" fill="#C69A55" opacity="0.55" />
    </>
  )
}

export function Portrait({
  variant,
  code,
  className,
  compact = false,
}: {
  variant: PortraitVariant
  code: string
  className?: string
  compact?: boolean
}) {
  const uid = `portrait-${variant}`
  return (
    <div className={cn('relative overflow-hidden bg-ink-950', className)}>
      <svg
        viewBox="0 0 400 500"
        className="h-full w-full"
        role="img"
        aria-label={`Surveillance portrait for ${code}`}
      >
        <defs>
          <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="#1a1d22" />
            <stop offset="55%" stopColor="#101216" />
            <stop offset="100%" stopColor="#08090b" />
          </linearGradient>
          <radialGradient id={`${uid}-light`} cx="32%" cy="28%" r="62%">
            <stop offset="0%" stopColor="#C69A55" stopOpacity="0.16" />
            <stop offset="55%" stopColor="#C69A55" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#C69A55" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-fig`} x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0%" stopColor="#343a43" />
            <stop offset="38%" stopColor="#242930" />
            <stop offset="100%" stopColor="#121418" />
          </linearGradient>
          <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C69A55" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#C69A55" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#C69A55" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="400" height="500" fill={`url(#${uid}-bg)`} />
        <rect width="400" height="500" fill={`url(#${uid}-light)`} />

        <g>
          <path
            d="M18 500C32 410 104 356 200 356C296 356 368 410 382 500Z"
            fill={`url(#${uid}-fig)`}
            stroke="rgba(255,255,255,0.06)"
          />
          <path
            d="M150 348L166 300H234L250 348C232 366 168 366 150 348Z"
            fill="#1c2026"
          />
          <path
            d="M166 300H234V352C220 368 180 368 166 352Z"
            fill="#242930"
          />
          <ellipse cx="200" cy="212" rx="63" ry="82" fill="#262b32" />
          <ellipse cx="137" cy="220" rx="9" ry="16" fill="#20242a" />
          <ellipse cx="263" cy="220" rx="9" ry="16" fill="#20242a" />

          <Hair variant={variant} />

          <g opacity="0.5" fill="none" stroke="#0b0c0f" strokeWidth="1.6">
            <path d="M168 192C176 186 188 185 196 188" />
            <path d="M232 192C224 186 212 185 204 188" />
            <path d="M200 208C198 224 196 232 202 238" />
            <path d="M184 260C192 266 208 266 216 260" />
          </g>
          <g opacity="0.28" fill="none" stroke="#4a5059" strokeWidth="1">
            <path d="M160 246C166 258 174 264 184 266" />
            <path d="M240 246C234 258 226 264 216 266" />
          </g>
          <path
            d="M140 206C138 154 162 126 196 124"
            stroke={`url(#${uid}-rim)`}
            strokeWidth="2.4"
            fill="none"
          />
          <path
            d="M132 500C142 424 176 386 200 382"
            stroke={`url(#${uid}-rim)`}
            strokeWidth="1.4"
            fill="none"
            opacity="0.5"
          />
        </g>

        <g stroke="rgba(242,240,234,0.28)" strokeWidth="1" fill="none">
          <path d="M18 44V18H44" />
          <path d="M382 44V18H356" />
          <path d="M18 456V482H44" />
          <path d="M382 456V482H356" />
        </g>

        <g fontFamily="'JetBrains Mono', monospace" fill="#858991" fontSize="8.5" letterSpacing="2.4">
          <text x="28" y="40">{code} / SUBJECT</text>
          <text x="372" y="40" textAnchor="end">MSL-C / 14.11.26</text>
          {!compact && (
            <>
              <text x="28" y="476">IDENT PLATE · NOT FOR DISTRIBUTION</text>
              <text x="372" y="476" textAnchor="end">FRAME 01</text>
            </>
          )}
        </g>

        <line x1="28" y1="52" x2="86" y2="52" stroke="#B83232" strokeWidth="1.5" />
      </svg>

      <div className="pointer-events-none absolute inset-0 scanlines opacity-60" />
      <div className="pointer-events-none absolute inset-0 noise opacity-[0.06] mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
    </div>
  )
}
