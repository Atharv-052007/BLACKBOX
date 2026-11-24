import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Expand,
  ScanSearch,
  Shrink,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/components/ui/Badges'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/Progress'
import { EmptyState } from '@/components/ui/EmptyState'
import { TIMELINE } from '@/data/timeline'
import { EVIDENCE_BY_ID } from '@/data/evidence'
import { useCaseStore } from '@/store/useCaseStore'
import { useUiStore } from '@/store/useUiStore'
import { cn } from '@/utils/cn'

type Filter = 'all' | 'critical' | 'contested'

export function TimelinePage() {
  const [filter, setFilter] = useState<Filter>('all')
  const reviewed = useCaseStore((state) => state.reviewedEvidence)
  const expanded = useCaseStore((state) => state.expandedEvents)
  const toggleExpanded = useCaseStore((state) => state.toggleEventExpanded)
  const expandAll = useCaseStore((state) => state.expandAllEvents)
  const collapseAll = useCaseStore((state) => state.collapseAllEvents)
  const pushToast = useUiStore((state) => state.pushToast)

  const contradictions = useMemo(
    () =>
      TIMELINE.filter(
        (event) => event.contradiction && reviewed.includes(event.contradiction.requiresEvidence),
      ),
    [reviewed],
  )

  const filtered = useMemo(() => {
    if (filter === 'critical') return TIMELINE.filter((event) => event.critical)
    if (filter === 'contested') return contradictions
    return TIMELINE
  }, [filter, contradictions])

  const scan = () => {
    if (contradictions.length === 0) {
      pushToast(
        'No contradictions unlocked',
        'Cross-reference the controller audit trail and the incident report first.',
        'warning',
      )
      return
    }
    expandAll(contradictions.map((event) => event.id))
    setFilter('contested')
    pushToast(
      `${contradictions.length} contradiction${contradictions.length === 1 ? '' : 's'} detected`,
      'Conflicting accounts are now expanded in the timeline.',
      'danger',
    )
  }

  return (
    <div className="space-y-7 pb-8">
      <PageHeader
        eyebrow="Chronology / 14 events"
        title="Timeline"
        description="The record of the evening, assembled from access logs, controller events, camera frames, statements and the official report. Where accounts disagree, the disagreement is the evidence."
        meta={
          <>
            <StatusBadge tone="bone">14 events</StatusBadge>
            <StatusBadge tone="green">{expanded.length} expanded</StatusBadge>
            <StatusBadge tone={contradictions.length > 0 ? 'red' : 'neutral'}>
              {contradictions.length} contradictions found
            </StatusBadge>
            <StatusBadge tone="amber">Window 22:42 — 22:53</StatusBadge>
          </>
        }
        actions={
          <>
            <Button variant="brass" icon={<ScanSearch size={13} />} onClick={scan}>
              Scan contradictions
            </Button>
            {expanded.length > 0 ? (
              <Button variant="quiet" icon={<Shrink size={12} />} onClick={collapseAll}>
                Collapse
              </Button>
            ) : (
              <Button
                variant="quiet"
                icon={<Expand size={12} />}
                onClick={() => expandAll(TIMELINE.map((event) => event.id))}
              >
                Expand all
              </Button>
            )}
          </>
        }
      />

      <section className="border border-white/[0.09] bg-ink-850 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <Clock3 size={15} className="mt-0.5 shrink-0 text-brass" />
            <div>
              <div className="label text-brass">The eleven minutes</div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-bone/70">
                22:42:11 — 22:53:11 · 660 seconds
              </p>
            </div>
          </div>
          <div className="flex-1 lg:max-w-xl">
            <div className="relative h-2 bg-white/[0.06]">
              <div className="absolute inset-y-0 left-[42%] w-[26%] bg-blood/50" />
              <div className="absolute left-[42%] top-1/2 h-3 w-px -translate-y-1/2 bg-blood" />
              <div className="absolute left-[68%] top-1/2 h-3 w-px -translate-y-1/2 bg-blood" />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[7px] uppercase tracking-[0.1em] text-ash/40">
              <span>21:30</span>
              <span>22:42</span>
              <span>22:53</span>
              <span>23:20</span>
            </div>
          </div>
          <div className="w-36">
            <div className="mb-1 flex justify-between font-mono text-[7.5px] uppercase tracking-[0.12em] text-ash/50">
              <span>Expanded</span>
              <span>{expanded.length}/14</span>
            </div>
            <ProgressBar value={expanded.length} max={TIMELINE.length} />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4 border-b border-white/[0.08] pb-2">
        {(
          [
            ['all', 'All events', TIMELINE.length],
            ['critical', 'Critical', TIMELINE.filter((event) => event.critical).length],
            ['contested', 'Contested', contradictions.length],
          ] as const
        ).map(([value, label, count]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn('tab', filter === value && 'tab-active')}
          >
            {label}
            <span className="ml-2 font-mono text-[7px] opacity-50">{count}</span>
          </button>
        ))}
        <span className="ml-auto font-mono text-[8px] uppercase tracking-[0.12em] text-ash/35">
          All times GMT · 14 NOV 2026
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ScanSearch size={28} />}
          title="No contradictions unlocked"
          description="Contradictions appear only when you have reviewed both sides of the record. Start with the controller audit trail and the incident report."
          action={
            <Link to="/app/evidence/e-04" className="btn btn-ghost">
              Examine controller log
            </Link>
          }
        />
      ) : (
        <div>
          {filtered.map((event) => {
            const isOpen = expanded.includes(event.id)
            const contradictionRevealed =
              event.contradiction && reviewed.includes(event.contradiction.requiresEvidence)
            const linkedEvidence = event.evidenceIds
              .map((id) => EVIDENCE_BY_ID[id])
              .filter(Boolean)

            return (
              <div key={event.id} className="grid grid-cols-[58px_1fr] sm:grid-cols-[92px_1fr]">
                <div className="pt-5 text-right">
                  <span className="font-mono text-[10px] text-bone/70 sm:text-[11px]">{event.time}</span>
                  <span className="mt-1 block font-mono text-[7px] uppercase tracking-[0.08em] text-ash/35">
                    {event.critical ? 'Critical' : 'Record'}
                  </span>
                </div>

                <div className="relative border-l border-white/[0.1] pb-3 pl-5 sm:pl-7">
                  <span
                    className={cn(
                      'absolute -left-[4px] top-[26px] h-[7px] w-[7px] border',
                      event.critical
                        ? 'border-blood bg-blood/70'
                        : 'border-ash/50 bg-ink-950',
                    )}
                  />
                  <button
                    onClick={() => toggleExpanded(event.id)}
                    className="w-full pt-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-serif text-xl leading-tight sm:text-2xl">{event.title}</h2>
                      {contradictionRevealed && (
                        <span className="flex items-center gap-1 border border-blood/40 bg-blood/[0.07] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-[#D97878]">
                          <AlertTriangle size={8} />
                          Contradiction
                        </span>
                      )}
                      {event.verified && (
                        <span className="hidden items-center gap-1 font-mono text-[7px] uppercase tracking-[0.1em] text-[#9DB8A4]/70 sm:flex">
                          <CheckCircle2 size={9} />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 max-w-3xl text-[12.5px] leading-relaxed text-ash">
                      {event.summary}
                    </p>
                    <div className="mt-2 flex items-center gap-2 font-mono text-[7.5px] uppercase tracking-[0.1em] text-ash/40">
                      <span>{event.source}</span>
                      <ChevronDown
                        size={11}
                        className={cn('transition-transform', isOpen && 'rotate-180')}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mb-4 mt-4 border border-white/[0.09] bg-ink-850 p-4 sm:p-5">
                          <p className="text-[12.5px] leading-relaxed text-bone/70">{event.detail}</p>

                          {event.accounts && (
                            <div className="mt-4">
                              <div className="mb-2 flex items-center gap-2">
                                <span className="label text-brass">Accounts compared</span>
                                <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-ash/35">
                                  {event.accounts.length} sources
                                </span>
                              </div>
                              <div className="overflow-x-auto border border-white/[0.07]">
                                <table className="w-full min-w-[520px] border-collapse text-left">
                                  <thead>
                                    <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                      {['Source', 'Time', 'Claim'].map((header) => (
                                        <th
                                          key={header}
                                          className="px-3 py-2 font-mono text-[7.5px] font-normal uppercase tracking-[0.12em] text-ash/45"
                                        >
                                          {header}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {event.accounts.map((account, accountIndex) => {
                                      const times = new Set(event.accounts?.map((entry) => entry.time))
                                      const isMismatch = times.size > 1 && accountIndex > 0
                                      return (
                                        <tr
                                          key={accountIndex}
                                          className={cn(
                                            'border-b border-white/[0.05] last:border-0',
                                            isMismatch && 'bg-blood/[0.035]',
                                          )}
                                        >
                                          <td className="px-3 py-2 text-[10.5px] text-bone/65">
                                            {account.source}
                                          </td>
                                          <td
                                            className={cn(
                                              'whitespace-nowrap px-3 py-2 font-mono text-[9px]',
                                              isMismatch ? 'text-[#D97878]' : 'text-brass/80',
                                            )}
                                          >
                                            {account.time}
                                          </td>
                                          <td className="px-3 py-2 text-[10.5px] leading-relaxed text-ash">
                                            {account.claim}
                                          </td>
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {contradictionRevealed && event.contradiction && (
                            <div className="mt-4 border-l-2 border-blood bg-blood/[0.05] px-3 py-2.5">
                              <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#D97878]">
                                <AlertTriangle size={10} />
                                Investigative contradiction
                              </div>
                              <p className="mt-1 text-[11.5px] leading-relaxed text-ash">
                                {event.contradiction.note}
                              </p>
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
                            <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-ash/35">
                              Exhibits
                            </span>
                            {linkedEvidence.map((item) => (
                              <Link
                                key={item.id}
                                to={`/app/evidence/${item.id}`}
                                className="chip transition-colors hover:border-brass/50 hover:text-brass"
                              >
                                {item.code} · {item.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash/35">
          Chronology reconstructed from 15 exhibits and 4 interviews
        </span>
        <Link
          to="/app/board"
          className="group inline-flex items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone"
        >
          Map this timeline on the board
          <ChevronDown size={11} className="-rotate-90 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
