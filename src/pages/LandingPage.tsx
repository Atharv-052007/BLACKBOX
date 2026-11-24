import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Fingerprint, Lock, ScanLine } from 'lucide-react'
import { CASE_FILE, PROCESS_STAGES, SEALED_CASES } from '@/data/case'
import { EVIDENCE_BY_ID } from '@/data/evidence'
import { Logo } from '@/components/layout/Sidebar'
import { Reveal } from '@/components/ui/Reveal'
import { CATEGORY_META } from '@/utils/format'

const WAVE = Array.from({ length: 140 }, (_, index) => {
  const x = (index / 139) * 560
  const envelope = Math.sin((index / 139) * Math.PI) ** 0.7
  const y =
    150 +
    Math.sin(index * 0.42) * 22 * envelope +
    Math.sin(index * 1.31) * 8 * envelope +
    (index % 17 === 0 ? 14 : 0)
  return `${x.toFixed(1)},${y.toFixed(1)}`
}).join(' ')

function SignalVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      <div className="absolute -inset-4 border border-white/[0.04]" aria-hidden="true" />
      <div className="relative border border-white/[0.11] bg-ink-900/70 p-5 backdrop-blur-[1px] sm:p-6">
        <span className="absolute -left-[1px] -top-[1px] h-4 w-4 border-l border-t border-brass/60" />
        <span className="absolute -right-[1px] -top-[1px] h-4 w-4 border-r border-t border-brass/60" />
        <span className="absolute -bottom-[1px] -left-[1px] h-4 w-4 border-b border-l border-brass/60" />
        <span className="absolute -bottom-[1px] -right-[1px] h-4 w-4 border-b border-r border-brass/60" />

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-[#9DB8A4]">
            <span className="h-[5px] w-[5px] animate-pulse-dot rounded-full bg-[#5F7D68]" />
            Live signal
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-ash/60">
            MSL-C / 07
          </span>
        </div>

        <div className="relative mt-4 aspect-square overflow-hidden border border-white/[0.06] bg-ink-950">
          <div className="absolute inset-0 grid-lines opacity-40" />
          <div className="absolute inset-0 scanlines opacity-40" />
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <g stroke="rgba(255,255,255,0.09)" fill="none">
              <circle cx="200" cy="200" r="168" />
              <circle cx="200" cy="200" r="124" strokeDasharray="2 6" />
              <circle cx="200" cy="200" r="82" />
              <circle cx="200" cy="200" r="40" />
              <path d="M200 18V382M18 200H382" />
            </g>
            <g stroke="rgba(198,154,85,0.32)" strokeWidth="1">
              {Array.from({ length: 48 }).map((_, index) => {
                const angle = (index / 48) * Math.PI * 2
                const outer = 174
                const inner = index % 4 === 0 ? 160 : 168
                return (
                  <line
                    key={index}
                    x1={200 + Math.cos(angle) * inner}
                    y1={200 + Math.sin(angle) * inner}
                    x2={200 + Math.cos(angle) * outer}
                    y2={200 + Math.sin(angle) * outer}
                  />
                )
              })}
            </g>
            <g>
              <circle cx="200" cy="200" r="6" fill="#B83232" opacity="0.9" />
              <circle cx="200" cy="200" r="14" fill="none" stroke="#B83232" opacity="0.35" />
              <path d="M200 200L318 118" stroke="#B83232" strokeWidth="1" opacity="0.35" />
              <circle cx="318" cy="118" r="3" fill="#C69A55" />
            </g>
            <g transform="translate(200 200) rotate(-18)">
              <rect x="-118" y="-38" width="236" height="76" fill="rgba(9,10,12,0.72)" stroke="rgba(198,154,85,0.18)" />
              <text
                x="-108"
                y="-24"
                fill="rgba(198,154,85,0.55)"
                fontFamily="JetBrains Mono, monospace"
                fontSize="7"
                letterSpacing="2.4"
              >
                ACOUSTIC TRACE / 18.4 KHZ
              </text>
              <polyline
                points={WAVE}
                transform="translate(-280 -150)"
                fill="none"
                stroke="#C69A55"
                strokeWidth="1.2"
                className="wave-draw"
                opacity="0.9"
              />
            </g>
            <text
              x="200"
              y="230"
              textAnchor="middle"
              fill="#F2F0EA"
              fontFamily="Instrument Serif, serif"
              fontSize="30"
              opacity="0.85"
            >
              V7
            </text>
          </svg>
          <div className="absolute bottom-3 left-3 font-mono text-[7.5px] uppercase tracking-[0.18em] text-ash/55">
            Signal lost 22:42:11
          </div>
          <div className="absolute right-3 top-3 border border-blood/40 bg-blood/[0.08] px-2 py-1 font-mono text-[7.5px] uppercase tracking-[0.18em] text-[#D97878]">
            Unresolved
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-ash/55">
              Active file
            </div>
            <div className="mt-1 font-serif text-2xl leading-none">{CASE_FILE.title}</div>
            <div className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-ash/60">
              {CASE_FILE.code} · {CASE_FILE.difficulty}
            </div>
          </div>
          <Link
            to="/app"
            state={{ openCase: true }}
            className="grid h-11 w-11 place-items-center border border-brass/40 text-brass transition-colors hover:bg-brass hover:text-ink-950"
            aria-label="Open Case 001"
          >
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-px bg-white/[0.07]">
          {[
            ['15', 'Exhibits'],
            ['04', 'Suspects'],
            ['11', 'Minutes'],
          ].map(([value, label]) => (
            <div key={label} className="bg-ink-900 px-3 py-2.5">
              <div className="font-mono text-sm text-bone/80">{value}</div>
              <div className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.14em] text-ash/50">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CasePreview() {
  const fragments = ['e-07', 'e-04', 'e-01']
  return (
    <div className="relative min-h-[300px] overflow-hidden border-l border-white/[0.07] bg-ink-950 p-6 sm:p-8">
      <div className="absolute inset-0 grid-lines opacity-50" />
      <div className="absolute inset-0 scanlines opacity-30" />
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash/50">
          Evidence fragments
        </span>
        <span className="stamp text-[8px] text-blood/70">Restricted</span>
      </div>
      <div className="relative mt-8 space-y-3">
        {fragments.map((id, index) => {
          const item = EVIDENCE_BY_ID[id]
          return (
            <div
              key={id}
              className="flex items-center justify-between gap-3 border border-white/[0.09] bg-ink-900/90 px-4 py-3 backdrop-blur"
              style={{
                transform: `translateX(${index * 12}px) rotate(${(index - 1) * 0.6}deg)`,
              }}
            >
              <div className="min-w-0">
                <div className="font-mono text-[8px] uppercase tracking-[0.16em]" style={{ color: CATEGORY_META[item.category].color }}>
                  {item.code} · {CATEGORY_META[item.category].short}
                </div>
                <div className="mt-1 truncate font-serif text-lg">{item.title}</div>
              </div>
              <Fingerprint size={14} className="shrink-0 text-ash/40" />
            </div>
          )
        })}
      </div>
      <div className="relative mt-8 flex items-center gap-3 border-t border-white/[0.08] pt-4">
        <Lock size={12} className="text-ash/50" />
        <span className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-ash/50">
          Full file sealed until system entry
        </span>
      </div>
    </div>
  )
}

const FIRST_INVESTIGATION_STEPS = [
  {
    num: '01',
    title: 'OPEN A CASE',
    text: 'Read the incident report and understand the mystery you are about to investigate.',
  },
  {
    num: '02',
    title: 'EXPLORE THE EVIDENCE',
    text: 'Examine documents, messages, recordings and clues. Pay attention to details.',
  },
  {
    num: '03',
    title: 'INVESTIGATE SUSPECTS',
    text: 'Explore suspect profiles, understand their motives and identify contradictions.',
  },
  {
    num: '04',
    title: 'CONNECT THE DOTS',
    text: 'Use the Investigation Board to connect evidence and uncover relationships between clues.',
  },
  {
    num: '05',
    title: 'RECONSTRUCT THE EVENTS',
    text: 'Arrange the events in chronological order inside the Reconstruction Room.',
  },
  {
    num: '06',
    title: 'SUBMIT YOUR VERDICT',
    text: 'Choose who you believe is responsible and receive your investigation report.',
  },
]

function FirstInvestigationSection() {
  const howRef = useRef<HTMLDivElement>(null)

  const scrollToSection = () => {
    howRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="first-investigation" ref={howRef} className="relative border-t border-white/[0.07]">
      <div className="relative mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="display text-[clamp(2.4rem,4.5vw,3.8rem)] leading-[0.95]">
                YOUR FIRST INVESTIGATION STARTS HERE.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ash">
                New to BLACKBOX? No detective experience required. Follow the evidence, connect the
                clues, and uncover the truth.
              </p>
            </div>
            <button
              type="button"
              onClick={scrollToSection}
              className="btn btn-ghost mt-0 shrink-0"
            >
              HOW TO PLAY
              <ArrowDown size={13} className="ml-1.5" />
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {FIRST_INVESTIGATION_STEPS.map((step, index) => (
              <div key={step.num} className="group relative flex items-start gap-3">
                <div className="flex w-9 shrink-0 flex-col items-center pl-1">
                  <div className="grid h-9 w-9 place-items-center border border-brass/40 bg-ink-950">
                    <span className="font-mono text-[11px] uppercase tracking-wide text-brass">
                      {step.num}
                    </span>
                  </div>
                  {index < FIRST_INVESTIGATION_STEPS.length - 1 && (
                    <div className="relative mt-2 h-8 w-[2px] bg-white/[0.08]" aria-hidden="true">
                      <span className="absolute -inset-x-3 -top-0.5 h-px bg-brass/30" />
                    </div>
                  )}
                </div>
                <Reveal delay={0.08 * index}>
                  <div className="border border-white/[0.09] bg-ink-900 p-5">
                    <h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-ash/80">{step.text}</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-8 max-w-3xl text-center font-mono text-[8px] uppercase tracking-[0.16em] text-ash/35">
            First investigation? Take your time. Explore every clue. The truth is hidden in the
            details.
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950">
      <div className="grain" />
      <div className="pointer-events-none fixed inset-0 vignette" aria-hidden="true" />

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? 'border-b border-white/[0.07] bg-ink-950/90 backdrop-blur-md' : ''
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex" aria-label="Landing navigation">
            {[
              ['Process', '#process'],
              ['Cases', '#cases'],
              ['Doctrine', '#doctrine'],
              ['How to play', '#first-investigation'],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="font-mono text-[9px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-bone"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-ash/60 lg:flex">
              <span className="h-[5px] w-[5px] animate-pulse-dot rounded-full bg-[#5F7D68]" />
              Network online
            </span>
            <Link
              to="/app"
              state={{ openCase: true }}
              className="group flex items-center gap-2 border border-white/20 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-bone transition-colors hover:border-blood hover:bg-blood"
            >
              Enter system
              <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      <section
        ref={heroRef}
        className="relative mx-auto flex min-h-screen max-w-[1480px] flex-col justify-center px-5 pb-16 pt-32 sm:px-8 lg:px-12 lg:pt-36"
      >
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-8 bg-blood" />
              <span className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-ash">
                Classified investigation network
              </span>
              <span className="hidden font-mono text-[8px] uppercase tracking-[0.16em] text-ash/40 sm:inline">
                / Node 07
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="display mt-6 text-[clamp(3.4rem,9.4vw,8.6rem)] tracking-[-0.035em]"
            >
              BLACKBOX
              <span className="ml-3 inline-block h-[0.13em] w-[0.13em] bg-blood align-baseline" />
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 max-w-lg border-l border-brass/30 pl-5"
            >
              <p className="serif-italic text-[clamp(1.2rem,2vw,1.6rem)] leading-[1.4] text-bone/90">
                Every mystery leaves a trace.
                <br />
                Every trace tells a story.
                <br />
                Only the right mind finds the truth.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/app"
                state={{ openCase: true }}
                className="group flex items-center justify-between gap-8 border border-blood bg-blood px-5 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-bone transition-colors hover:border-[#c94444] hover:bg-[#a52929] sm:justify-center"
              >
                Enter the system
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#cases"
                className="group flex items-center justify-between gap-8 border border-white/20 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/80 transition-colors hover:border-white/40 hover:bg-white/[0.04] hover:text-bone sm:justify-center"
              >
                Explore case files
                <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/[0.07] pt-5 font-mono text-[8px] uppercase tracking-[0.16em] text-ash/50"
            >
              <span className="flex items-center gap-2">
                <span className="h-[5px] w-[5px] animate-pulse-dot rounded-full bg-[#5F7D68]" />
                System online
              </span>
              <span>AES-256 / local persistence</span>
              <span className="hidden sm:inline">Case 001 · active</span>
              <span className="hidden md:inline">No account required</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pl-4"
          >
            <SignalVisual />
          </motion.div>
        </div>

        <div className="mt-16 hidden items-center justify-between border-t border-white/[0.06] pt-5 lg:flex">
          <div className="flex items-center gap-6 font-mono text-[8px] uppercase tracking-[0.16em] text-ash/40">
            <span>Meridian Sound Labs / 14.11.26</span>
            <span>Restricted</span>
            <span>File BB-2026-001</span>
          </div>
          <a
            href="#process"
            className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-ash/50 transition-colors hover:text-bone"
          >
            Scroll to brief
            <ArrowDown size={11} />
          </a>
        </div>
      </section>

      <section id="process" className="relative border-t border-white/[0.07]">
        <div className="mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <div className="label mb-4 text-brass">01 / Protocol</div>
              <h2 className="display text-[clamp(2.4rem,4.5vw,4rem)]">
                The investigation
                <br />
                <span className="serif-italic text-bone/70">process.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-sm text-sm leading-relaxed text-ash">
                A disciplined method. Four stages. No shortcuts. The file rewards the investigator
                who reads slowly and compares everything.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-px bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STAGES.map((stage, index) => (
              <Reveal key={stage.number} delay={index * 0.08} className="bg-ink-950">
                <div className="group h-full bg-ink-950 p-6 transition-colors hover:bg-ink-900 lg:p-7">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[9px] tracking-[0.18em] text-brass">
                      {stage.number}
                    </span>
                    <span className="h-px w-8 bg-white/10 transition-all group-hover:w-14 group-hover:bg-blood" />
                  </div>
                  <h3 className="mt-8 font-serif text-3xl tracking-[0.02em]">{stage.title}</h3>
                  <p className="mt-2 font-serif text-lg italic text-bone/60">{stage.caption}</p>
                  <p className="mt-5 text-xs leading-relaxed text-ash">{stage.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="cases" className="relative border-t border-white/[0.07]">
        <div className="mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="label mb-4 text-brass">02 / Active files</div>
                <h2 className="display text-[clamp(2.4rem,4.5vw,4rem)]">Open investigations.</h2>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-ash/50">
                01 active · 02 sealed
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <div className="grid border border-white/[0.09] bg-ink-900 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
                    {CASE_FILE.code}
                  </span>
                  <span className="h-3 w-px bg-white/15" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-ash">
                    {CASE_FILE.classification}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#D97878]">
                    {CASE_FILE.difficulty}
                  </span>
                  <span className="ml-auto flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.14em] text-[#D97878]">
                    <span className="h-[5px] w-[5px] animate-pulse-dot rounded-full bg-blood" />
                    Unsolved
                  </span>
                </div>

                <h3 className="mt-6 font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-[0.95]">
                  The Silent
                  <br />
                  Frequency
                </h3>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-ash">{CASE_FILE.synopsis}</p>

                <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/[0.08] pt-5 sm:grid-cols-4">
                  {[
                    ['Location', 'Meridian Labs'],
                    ['Date', '14 NOV 2026'],
                    ['Exhibits', '15 logged'],
                    ['Persons', '04 of interest'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-ash/45">
                        {label}
                      </div>
                      <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.06em] text-bone/70">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/app"
                    state={{ openCase: true }}
                    className="group inline-flex items-center justify-between gap-8 bg-bone px-5 py-3.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-950 transition-colors hover:bg-white sm:justify-center"
                  >
                    Open case 001
                    <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    to="/app/cases"
                    className="inline-flex items-center justify-center gap-2 border border-white/15 px-5 py-3.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-bone/70 transition-colors hover:border-white/35 hover:text-bone"
                  >
                    Browse all files
                  </Link>
                </div>
              </div>
              <CasePreview />
            </div>
          </Reveal>

          <div className="mt-4 border border-white/[0.07]">
            {SEALED_CASES.map((sealed) => (
              <div
                key={sealed.code}
                className="flex flex-col gap-3 border-b border-white/[0.06] px-6 py-5 last:border-0 sm:flex-row sm:items-center sm:gap-6"
              >
                <span className="w-20 shrink-0 font-mono text-[8.5px] uppercase tracking-[0.14em] text-ash/50">
                  {sealed.code}
                </span>
                <span className="flex-1 font-serif text-xl text-bone/45">{sealed.title}</span>
                <span className="flex-1 font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-ash/35">
                  {sealed.note}
                </span>
                <span className="flex shrink-0 items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-ash/40">
                  <Lock size={10} />
                  Sealed
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FirstInvestigationSection />

      <section id="doctrine" className="relative border-t border-white/[0.07]">
        <div className="absolute inset-0 grid-lines opacity-30" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1480px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <div className="label text-brass">03 / Doctrine</div>
              <div className="mt-6 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.16em] text-ash/50">
                <ScanLine size={14} className="text-ash/40" />
                Principle 001
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <blockquote className="border-l border-blood/50 pl-6 sm:pl-10">
                <p className="display text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.98]">
                  “Evidence doesn’t lie.
                  <br />
                  <span className="serif-italic text-bone/65">Interpretations do.</span>”
                </p>
                <footer className="mt-8 flex items-center gap-4 font-mono text-[8px] uppercase tracking-[0.18em] text-ash/55">
                  <span className="h-px w-10 bg-white/20" />
                  BLACKBOX doctrine / 001
                </footer>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/[0.07]">
        <div className="mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal>
            <div className="relative overflow-hidden border border-white/[0.1] bg-ink-900 px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
              <div className="absolute inset-0 scanlines opacity-20" aria-hidden="true" />
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/[0.04]" aria-hidden="true" />
              <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="label mb-5 text-brass">Access granted</div>
                  <h2 className="display text-[clamp(2.8rem,6vw,5rem)]">
                    The file is open.
                    <br />
                    <span className="serif-italic text-bone/60">Find what happened.</span>
                  </h2>
                  <p className="mt-5 max-w-lg text-sm leading-relaxed text-ash">
                    Fifteen exhibits. Four accounts. Eleven minutes unaccounted for. Your
                    investigation is saved in this browser — no account, no download, no waiting.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/app"
                    state={{ openCase: true }}
                    className="group inline-flex items-center justify-between gap-10 bg-blood px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-bone transition-colors hover:bg-[#a52929]"
                  >
                    Enter the system
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/app/evidence"
                    className="inline-flex items-center justify-center gap-2 border border-white/15 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/70 transition-colors hover:border-white/35 hover:text-bone"
                  >
                    Go straight to evidence
                  </Link>
                  <span className="text-center font-mono text-[7.5px] uppercase tracking-[0.16em] text-ash/35">
                    Progress stored locally
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto max-w-[1480px] px-5 py-10 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Logo />
              <p className="mt-4 max-w-sm font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-ash/35">
                A fictional investigation experience. All cases, persons, organisations and
                documents are invented. Any resemblance to real events is coincidental.
              </p>
            </div>
            <div className="flex gap-12">
              <div>
                <div className="label mb-3 text-[8px]">File</div>
                <div className="space-y-2 font-mono text-[8.5px] uppercase tracking-[0.12em] text-ash/55">
                  <a href="#process" className="block hover:text-bone">Process</a>
                  <a href="#cases" className="block hover:text-bone">Cases</a>
                  <a href="#doctrine" className="block hover:text-bone">Doctrine</a>
                  <a href="#first-investigation" className="block hover:text-bone">How to play</a>
                </div>
              </div>
              <div>
                <div className="label mb-3 text-[8px]">System</div>
                <div className="space-y-2 font-mono text-[8.5px] uppercase tracking-[0.12em] text-ash/55">
                  <Link to="/app" className="block hover:text-bone">Overview</Link>
                  <Link to="/app/evidence" className="block hover:text-bone">Evidence</Link>
                  <Link to="/app/verdict" className="block hover:text-bone">Verdict</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-white/[0.06] pt-5 font-mono text-[7.5px] uppercase tracking-[0.14em] text-ash/30 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 BLACKBOX / Every mystery has a hidden truth.</span>
            <span>Node 07 · London · Offline capable</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
