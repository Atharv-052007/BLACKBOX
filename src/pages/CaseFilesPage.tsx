import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Lock, ShieldAlert } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/components/ui/Badges'
import { ProgressBar } from '@/components/ui/Progress'
import { CASE_FILE, SEALED_CASES } from '@/data/case'
import { EVIDENCE } from '@/data/evidence'
import { SUSPECTS } from '@/data/suspects'
import { TIMELINE } from '@/data/timeline'
import { useCaseStore } from '@/store/useCaseStore'
import { caseProgress } from '@/utils/progress'
import { durationLabel } from '@/utils/format'

export function CaseFilesPage() {
  const reviewed = useCaseStore((state) => state.reviewedEvidence)
  const viewedSuspects = useCaseStore((state) => state.viewedSuspects)
  const boardEdges = useCaseStore((state) => state.boardEdges)
  const expandedEvents = useCaseStore((state) => state.expandedEvents)
  const verdict = useCaseStore((state) => state.verdict)
  const startedAt = useCaseStore((state) => state.startedAt)
  const reconstructionScore = useCaseStore((state) => state.reconstructionScore)

  const progress = caseProgress({
    reviewedEvidence: reviewed,
    viewedSuspects,
    boardEdges,
    expandedEvents,
    verdict,
    reconstructionScore,
  })

  return (
    <div className="space-y-8 pb-6">
      <PageHeader
        eyebrow="Archive / 03 files"
        title="Case Files"
        description="One active investigation. Two sealed records. Access to sealed files is withheld by the archive board."
        meta={
          <>
            <StatusBadge tone="green" dot>
              01 Active
            </StatusBadge>
            <StatusBadge tone="neutral">02 Sealed</StatusBadge>
            <StatusBadge tone="red">Restricted</StatusBadge>
          </>
        }
      />

      <section className="border border-white/[0.09] bg-ink-850">
        <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
          <div className="p-6 sm:p-8">
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
              <StatusBadge tone={verdict ? 'green' : 'red'} dot className="ml-auto">
                {verdict ? 'Closed · graded' : 'Open · unsolved'}
              </StatusBadge>
            </div>

            <h2 className="mt-5 font-serif text-[clamp(2.4rem,4.5vw,3.6rem)] leading-none">
              The Silent Frequency
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ash">{CASE_FILE.synopsis}</p>

            <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/[0.08] pt-5 sm:grid-cols-4">
              {[
                ['Exhibits', `${reviewed.length}/${EVIDENCE.length}`],
                ['Suspects', `${viewedSuspects.length}/${SUSPECTS.length}`],
                ['Timeline', `${Math.min(expandedEvents.length, TIMELINE.length)}/${TIMELINE.length}`],
                ['Duration', durationLabel(startedAt)],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-ash/45">
                    {label}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.05em] text-bone/70">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.14em]">
                <span className="text-ash/55">Investigation completion</span>
                <span className="text-bone/60">{progress}%</span>
              </div>
              <ProgressBar value={progress} max={100} />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to={verdict ? '/app/reports' : '/app'}
                className="group inline-flex items-center gap-3 bg-bone px-5 py-3.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-950 transition-colors hover:bg-white"
              >
                {verdict ? 'Open investigation report' : 'Continue investigation'}
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/app/evidence"
                className="inline-flex items-center gap-2 border border-white/15 px-5 py-3.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-bone/70 transition-colors hover:border-white/35 hover:text-bone"
              >
                Evidence room
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden border-t border-white/[0.07] bg-ink-950 p-6 lg:border-l lg:border-t-0">
            <div className="absolute inset-0 grid-lines opacity-40" />
            <div className="relative">
              <div className="label text-brass">File summary</div>
              <div className="mt-4 space-y-4">
                {[
                  ['Incident', 'Prototype theft · Lab 3'],
                  ['Window', '22:42 — 22:53 GMT'],
                  ['Location', 'Meridian Sound Labs'],
                  ['Classification', 'RESTRICTED'],
                  ['Case opened', CASE_FILE.openedAt],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-white/[0.06] pb-3 last:border-0">
                    <div className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-ash/45">
                      {label}
                    </div>
                    <div className="mt-1 font-mono text-[9px] uppercase leading-relaxed tracking-[0.04em] text-bone/65">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-start gap-2 border border-brass/20 bg-brass/[0.03] px-3 py-2.5">
                <ShieldAlert size={12} className="mt-0.5 shrink-0 text-brass" />
                <p className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.08em] text-ash/60">
                  Do not submit a verdict before reconciling the timeline with the controller log.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="label mb-2 text-brass">Sealed archive</div>
            <h2 className="font-serif text-2xl">Withheld records</h2>
          </div>
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-ash/40">
            Access denied
          </span>
        </div>
        <div className="border border-white/[0.08]">
          {SEALED_CASES.map((sealed) => (
            <div
              key={sealed.code}
              className="flex flex-col gap-3 border-b border-white/[0.06] px-5 py-5 last:border-0 sm:flex-row sm:items-center sm:gap-6"
            >
              <span className="w-20 shrink-0 font-mono text-[8.5px] uppercase tracking-[0.14em] text-ash/45">
                {sealed.code}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-serif text-xl text-bone/45">{sealed.title}</div>
                <div className="mt-1 font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-ash/35">
                  {sealed.note}
                </div>
              </div>
              <span className="flex shrink-0 items-center gap-2 border border-white/[0.08] px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-ash/35">
                <Lock size={10} />
                Sealed
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-white/[0.08] bg-ink-850/50 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ArrowUpRight size={15} className="mt-0.5 shrink-0 text-brass" />
            <div>
              <div className="label text-brass">Archive protocol</div>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ash">
                Sealed cases are fictional records withheld from the network. They cannot be opened
                from this terminal. All active case data is stored locally in your browser.
              </p>
            </div>
          </div>
          <Link
            to="/app/reports"
            className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone"
          >
            My reports →
          </Link>
        </div>
      </section>
    </div>
  )
}
