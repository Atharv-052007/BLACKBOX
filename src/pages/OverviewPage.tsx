import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Clock3,
  Flag,
  Lightbulb,
  Lock,
  Network,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { CASE_FILE } from '@/data/case'
import { EVIDENCE } from '@/data/evidence'
import { SUSPECTS } from '@/data/suspects'
import { TIMELINE } from '@/data/timeline'
import { useCaseStore } from '@/store/useCaseStore'
import { useUiStore } from '@/store/useUiStore'
import { ProgressBar, ScoreRing } from '@/components/ui/Progress'
import { StatusBadge, ClassificationMark } from '@/components/ui/Badges'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Portrait } from '@/components/ui/Portrait'
import { CategoryBadge } from '@/components/ui/Badges'
import { caseProgress } from '@/utils/progress'
import { getAchievements } from '@/utils/achievements'
import { durationLabel } from '@/utils/format'
import { cn } from '@/utils/cn'

export function OverviewPage() {
  const [briefingOpen, setBriefingOpen] = useState(false)
  const reviewed = useCaseStore((state) => state.reviewedEvidence)
  const viewedSuspects = useCaseStore((state) => state.viewedSuspects)
  const boardEdges = useCaseStore((state) => state.boardEdges)
  const expandedEvents = useCaseStore((state) => state.expandedEvents)
  const verdict = useCaseStore((state) => state.verdict)
  const startedAt = useCaseStore((state) => state.startedAt)
  const savedEvidence = useCaseStore((state) => state.savedEvidence)
  const flaggedEvidence = useCaseStore((state) => state.flaggedEvidence)
  const notes = useCaseStore((state) => state.notes)
  const hintsRevealed = useCaseStore((state) => state.hintsRevealed)
  const reconstructionScore = useCaseStore((state) => state.reconstructionScore)
  const setHintsOpen = useUiStore((state) => state.setHintsOpen)

  const progress = caseProgress({
    reviewedEvidence: reviewed,
    viewedSuspects,
    boardEdges,
    expandedEvents,
    verdict,
    reconstructionScore,
  })

  const achievements = useMemo(
    () =>
      getAchievements({
        reviewedEvidence: reviewed,
        viewedSuspects,
        savedEvidence,
        notes,
        expandedEvents,
        boardEdges,
        verdict,
        reconstructionScore,
      }),
    [reviewed, viewedSuspects, savedEvidence, notes, expandedEvents, boardEdges, verdict, reconstructionScore],
  )

  const keyEvents = TIMELINE.filter((event) => event.critical).slice(0, 6)
  const unexamined = EVIDENCE.filter((item) => !reviewed.includes(item.id)).slice(0, 3)

  const nextAction = (() => {
    if (verdict) {
      return {
        label: 'Case submitted',
        title: 'Review your final report',
        body: 'Your verdict has been scored. Open the report to see correct deductions, missed clues and the sealed solution.',
        to: '/app/reports',
        cta: 'Open report',
      }
    }
    if (reviewed.length === 0) {
      return {
        label: 'First move',
        title: 'Start with the system',
        body: 'Read the controller audit trail and the incident report together. The blackout is the centre of this case.',
        to: '/app/evidence/e-04',
        cta: 'Examine E-04',
      }
    }
    if (reviewed.length < 6) {
      return {
        label: 'Evidence phase',
        title: 'Build the exhibit baseline',
        body: 'Six exhibits establish the scene. You have examined ' + reviewed.length + ' of 15.',
        to: '/app/evidence',
        cta: 'Continue evidence',
      }
    }
    if (viewedSuspects.length < 4) {
      return {
        label: 'Interview phase',
        title: 'Read every account',
        body: 'Four people. Four versions of eleven minutes. The contradictions only appear when you compare them.',
        to: '/app/suspects',
        cta: 'Open suspect files',
      }
    }
    if (boardEdges.length < 3) {
      return {
        label: 'Analysis phase',
        title: 'Connect the chain',
        body: 'Pin the key exhibits to the board and draw the relationships. A theory is a structure, not a feeling.',
        to: '/app/board',
        cta: 'Open the board',
      }
    }
    return {
      label: 'Resolution',
      title: 'The file is ready',
      body: 'You have the evidence, the accounts and a structure. Name the culprit, the method and the motive.',
      to: '/app/verdict',
      cta: 'Submit verdict',
    }
  })()

  const unlocked = achievements.filter((item) => item.unlocked)

  return (
    <div className="space-y-8 pb-6">
      <header className="relative border-b border-white/[0.08] pb-8">
        <div className="absolute right-0 top-0 hidden lg:block">
          <ClassificationMark label={CASE_FILE.classification} />
        </div>
        <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brass">
                {CASE_FILE.code}
              </span>
              <span className="h-3 w-px bg-white/15" />
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-ash">
                {CASE_FILE.classification}
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#D97878]">
                {CASE_FILE.difficulty}
              </span>
              <StatusBadge tone={verdict ? 'green' : 'red'} dot>
                {verdict ? 'Verdict filed' : 'Unsolved'}
              </StatusBadge>
            </div>

            <h1 className="display mt-4 text-[clamp(2.8rem,6vw,5rem)]">{CASE_FILE.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ash">{CASE_FILE.synopsis}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/app/evidence"
                className="group inline-flex items-center gap-3 bg-blood px-5 py-3.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-bone transition-colors hover:bg-[#a52929]"
              >
                Open evidence room
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Button variant="ghost" onClick={() => setBriefingOpen(true)} icon={<BookOpen size={13} />}>
                Read full briefing
              </Button>
              <Link
                to="/app/verdict"
                className="inline-flex items-center gap-2 px-2 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-ash transition-colors hover:text-bone"
              >
                {verdict ? 'View verdict' : 'Final verdict'}
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-3 border border-white/[0.08] bg-ink-850 p-5 xl:w-[330px]">
            {[
              ['Opened', CASE_FILE.openedAt.split('·')[0].trim()],
              ['Location', 'Building C · Lab 3'],
              ['Exhibits', '15 logged'],
              ['Window', '22:42 — 22:53'],
              ['Lead', 'Det. Morgan'],
              ['Duration', durationLabel(startedAt)],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-ash/45">
                  {label}
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.05em] text-bone/70">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          <section className="border border-white/[0.09] bg-ink-850">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5">
              <span className="label text-brass">Mission directives</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-ash/50">
                04 objectives
              </span>
            </div>
            <div className="grid sm:grid-cols-2">
              {CASE_FILE.directives.map((directive, index) => (
                <div
                  key={directive}
                  className={cn(
                    'flex gap-4 p-5',
                    index < 2 && 'border-b border-white/[0.06] sm:border-b',
                    index % 2 === 0 && 'sm:border-r sm:border-white/[0.06]',
                  )}
                >
                  <span className="font-serif text-2xl leading-none text-brass/70">0{index + 1}</span>
                  <p className="text-[13px] leading-relaxed text-bone/75">{directive}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-white/[0.09] bg-ink-850">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Clock3 size={13} className="text-ash" />
                <span className="label text-brass">Key chronology</span>
              </div>
              <Link
                to="/app/timeline"
                className="font-mono text-[8px] uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone"
              >
                Full timeline →
              </Link>
            </div>
            <div>
              {keyEvents.map((event) => (
                <Link
                  key={event.id}
                  to="/app/timeline"
                  className="group flex items-start gap-4 border-b border-white/[0.05] px-5 py-3.5 last:border-0 hover:bg-white/[0.02]"
                >
                  <span className="w-11 shrink-0 pt-0.5 font-mono text-[10px] text-brass/80">
                    {event.time}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] text-bone/80 group-hover:text-bone">{event.title}</div>
                    <div className="mt-0.5 truncate text-[11px] text-ash/60">{event.summary}</div>
                  </div>
                  <span className="mt-1.5 h-[5px] w-[5px] shrink-0 rounded-full bg-brass/60" />
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="label mb-2 text-brass">Persons of interest</div>
                <h2 className="font-serif text-2xl">Four accounts</h2>
              </div>
              <Link
                to="/app/suspects"
                className="font-mono text-[8px] uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone"
              >
                Open suspect files →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {SUSPECTS.map((suspect) => (
                <Link
                  key={suspect.id}
                  to={`/app/suspects/${suspect.id}`}
                  className="group flex items-stretch border border-white/[0.09] bg-ink-850 transition-colors hover:border-white/20 hover:bg-ink-800"
                >
                  <Portrait
                    variant={suspect.portrait}
                    code={suspect.code}
                    compact
                    className="w-[76px] shrink-0 border-r border-white/[0.07]"
                  />
                  <div className="min-w-0 flex-1 p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-ash/50">
                        {suspect.code}
                      </span>
                      <span className="font-mono text-[7px] uppercase tracking-[0.12em] text-[#D97878]">
                        {suspect.status.replace('PERSON OF', 'POI')}
                      </span>
                    </div>
                    <div className="mt-1 truncate font-serif text-lg leading-tight">
                      {suspect.name}
                    </div>
                    <div className="mt-0.5 truncate font-mono text-[8px] uppercase tracking-[0.08em] text-ash/60">
                      {suspect.occupation}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <StatusBadge
                        tone={suspect.alibiStatus === 'CORROBORATED' ? 'green' : 'amber'}
                        className="px-1.5 py-0.5 text-[7px]"
                      >
                        Alibi {suspect.alibiStatus}
                      </StatusBadge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {unexamined.length > 0 && (
            <section>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <div className="label mb-2 text-brass">Unexamined</div>
                  <h2 className="font-serif text-2xl">Still on the table</h2>
                </div>
                <Link
                  to="/app/evidence"
                  className="font-mono text-[8px] uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone"
                >
                  All exhibits →
                </Link>
              </div>
              <div className="space-y-2">
                {unexamined.map((item) => (
                  <Link
                    key={item.id}
                    to={`/app/evidence/${item.id}`}
                    className="group flex items-center gap-4 border border-white/[0.08] bg-ink-850 px-4 py-3 transition-colors hover:border-white/20"
                  >
                    <span className="font-mono text-[9px] text-ash/50">{item.code}</span>
                    <CategoryBadge category={item.category} compact className="hidden sm:flex" />
                    <span className="flex-1 truncate font-serif text-lg">{item.title}</span>
                    <ArrowUpRight
                      size={13}
                      className="text-ash/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="min-w-0 space-y-6">
          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="flex items-center justify-between">
              <span className="label text-brass">Case progress</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-ash/50">
                {progress}%
              </span>
            </div>
            <div className="mt-5 flex items-center gap-5">
              <ScoreRing value={progress} size={116} label="File" />
              <div className="flex-1 space-y-3">
                {[
                  { label: 'Evidence', value: reviewed.length, max: EVIDENCE.length },
                  { label: 'Suspects', value: viewedSuspects.length, max: 4 },
                  { label: 'Connections', value: Math.min(boardEdges.length, 5), max: 5 },
                  { label: 'Timeline', value: Math.min(expandedEvents.length, TIMELINE.length), max: TIMELINE.length },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-1 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.12em]">
                      <span className="text-ash/60">{row.label}</span>
                      <span className="text-bone/60">
                        {row.value}/{row.max}
                      </span>
                    </div>
                    <ProgressBar value={row.value} max={row.max} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-px bg-white/[0.07]">
              <div className="bg-ink-850 px-2 py-2.5 text-center">
                <div className="font-mono text-sm text-bone/80">{savedEvidence.length}</div>
                <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-ash/45">Saved</div>
              </div>
              <div className="bg-ink-850 px-2 py-2.5 text-center">
                <div className="font-mono text-sm text-bone/80">{flaggedEvidence.length}</div>
                <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-ash/45">Flagged</div>
              </div>
              <div className="bg-ink-850 px-2 py-2.5 text-center">
                <div className="font-mono text-sm text-bone/80">{hintsRevealed}</div>
                <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-ash/45">Hints</div>
              </div>
            </div>
          </section>

          <section className="border border-brass/25 bg-brass/[0.035] p-5">
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-brass" />
              <span className="label text-brass">{nextAction.label}</span>
            </div>
            <h3 className="mt-3 font-serif text-2xl leading-tight">{nextAction.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-ash">{nextAction.body}</p>
            <Link
              to={nextAction.to}
              className="group mt-4 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-brass"
            >
              {nextAction.cta}
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </section>

          <section className="border border-white/[0.09] bg-ink-850">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-ash" />
                <span className="label text-brass">Decorations</span>
              </div>
              <span className="font-mono text-[8px] text-ash/50">
                {unlocked.length}/{achievements.length}
              </span>
            </div>
            <div className="space-y-2.5 p-5">
              {achievements.slice(0, 5).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3">
                  <span
                    className={cn(
                      'grid h-6 w-6 shrink-0 place-items-center border',
                      achievement.unlocked
                        ? 'border-brass/40 bg-brass/[0.08] text-brass'
                        : 'border-white/10 text-ash/30',
                    )}
                  >
                    {achievement.unlocked ? <Check size={11} /> : <Lock size={10} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        'truncate font-mono text-[8.5px] uppercase tracking-[0.08em]',
                        achievement.unlocked ? 'text-bone/75' : 'text-ash/40',
                      )}
                    >
                      {achievement.name}
                    </div>
                    <div className="truncate text-[10px] text-ash/40">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="flex items-center gap-2">
              <Lightbulb size={13} className="text-brass" />
              <span className="label text-brass">Stuck?</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ash">
              Three progressive hints are available. Each one costs two points from your final
              score and points at evidence, never at the answer.
            </p>
            <Button
              variant="brass"
              size="sm"
              className="mt-4 w-full"
              onClick={() => setHintsOpen(true)}
              icon={<Lightbulb size={12} />}
            >
              Request hint ({3 - hintsRevealed} left)
            </Button>
          </section>

          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="flex items-center gap-2">
              <Network size={13} className="text-ash" />
              <span className="label text-brass">Your notes</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-serif text-2xl">{Object.values(notes).filter((note) => note.trim()).length}</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash/45">
                exhibits annotated
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Flag size={11} className="text-blood" />
              <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-ash/50">
                {flaggedEvidence.length} marked suspicious
              </span>
            </div>
          </section>
        </aside>
      </div>

      <Modal
        open={briefingOpen}
        onClose={() => setBriefingOpen(false)}
        title="Case briefing — The Silent Frequency"
        eyebrow="CASE 001 / RESTRICTED"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4 text-[14px] leading-relaxed text-bone/80">
          {CASE_FILE.briefing.map((paragraph, index) => (
            <p key={index} className={index === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:leading-[0.8] first-letter:text-brass' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-7 grid gap-3 border-t border-white/[0.08] pt-5 sm:grid-cols-2">
          {CASE_FILE.directives.map((directive, index) => (
            <div key={directive} className="flex gap-3">
              <span className="font-mono text-[9px] text-brass">0{index + 1}</span>
              <span className="text-xs leading-relaxed text-ash">{directive}</span>
            </div>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap justify-end gap-2">
          <Button variant="quiet" onClick={() => setBriefingOpen(false)}>
            Close
          </Button>
          <Link
            to="/app/evidence"
            onClick={() => setBriefingOpen(false)}
            className="btn btn-primary"
          >
            Begin with evidence
          </Link>
        </div>
      </Modal>
    </div>
  )
}
