import { useMemo, useState, type DragEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronRight,
  Clock3,
  Gavel,
  GripVertical,
  Info,
  ListRestart,
  Lock,
  ShieldCheck,
  Trash2,
  TriangleAlert,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/components/ui/Badges'
import { Button, buttonStyles } from '@/components/ui/Button'
import { ScoreRing } from '@/components/ui/Progress'
import { useCaseStore } from '@/store/useCaseStore'
import { useUiStore } from '@/store/useUiStore'
import { EVIDENCE_BY_ID } from '@/data/evidence'
import {
  RECONSTRUCTION_BY_ID,
  RECONSTRUCTION_EVENTS,
  RECONSTRUCTION_ORDER,
  RECONSTRUCTION_SEED_ORDER,
  reconstructionLabel,
  scoreReconstruction,
} from '@/data/reconstruction'
import { cn } from '@/utils/cn'

type DragOrigin = { from: 'pool' } | { from: 'slot'; slot: number }

function firstEmptySlot(order: (string | null)[]) {
  return order.findIndex((entry) => entry === null)
}

function withPlacement(
  order: (string | null)[],
  eventId: string,
  targetSlot: number,
  origin: DragOrigin | null,
): (string | null)[] {
  const next = [...order]
  const previousSlot = next.indexOf(eventId)
  const occupant = next[targetSlot] ?? null

  if (previousSlot >= 0) {
    next[previousSlot] = null
  }

  next[targetSlot] = eventId

  if (occupant && occupant !== eventId) {
    if (origin && origin.from === 'slot') {
      next[origin.slot] = occupant
    } else {
      const fallback = firstEmptySlot(next)
      if (fallback >= 0) next[fallback] = occupant
    }
  }

  return next
}

export function ReconstructionPage() {
  const order = useCaseStore((state) => state.reconstructionOrder)
  const storedScore = useCaseStore((state) => state.reconstructionScore)
  const attempts = useCaseStore((state) => state.reconstructionAttempts)
  const checkedAt = useCaseStore((state) => state.reconstructionCheckedAt)
  const setOrder = useCaseStore((state) => state.setReconstructionOrder)
  const checkReconstruction = useCaseStore((state) => state.checkReconstruction)
  const resetReconstruction = useCaseStore((state) => state.resetReconstruction)
  const pushToast = useUiStore((state) => state.pushToast)

  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOrigin, setDragOrigin] = useState<DragOrigin | null>(null)
  const [hoverSlot, setHoverSlot] = useState<number | null>(null)
  const [poolHover, setPoolHover] = useState(false)

  const placedIds = useMemo(
    () => order.filter((entry): entry is string => Boolean(entry)),
    [order],
  )

  const pool = useMemo(
    () =>
      RECONSTRUCTION_SEED_ORDER.filter((id) => !placedIds.includes(id)).map(
        (id) => RECONSTRUCTION_BY_ID[id],
      ),
    [placedIds],
  )

  const result = useMemo(() => (checkedAt ? scoreReconstruction(order) : null), [order, checkedAt])
  const complete = placedIds.length === RECONSTRUCTION_EVENTS.length
  const activeScore = result ? result.score : storedScore

  const commit = (next: (string | null)[]) => {
    setOrder(next)
  }

  const dropIntoSlot = (eventId: string, slot: number) => {
    if (!eventId) return
    const origin = dragOrigin
    commit(withPlacement(order, eventId, slot, origin))
    setDragId(null)
    setDragOrigin(null)
    setHoverSlot(null)
  }

  const removeFromSlot = (slot: number) => {
    const next = [...order]
    next[slot] = null
    commit(next)
  }

  const moveSlot = (slot: number, direction: -1 | 1) => {
    const target = slot + direction
    if (target < 0 || target >= order.length) return
    const next = [...order]
    const holding = next[target]
    next[target] = next[slot]
    next[slot] = holding
    commit(next)
  }

  const placeFromPool = (eventId: string) => {
    const slot = firstEmptySlot(order)
    if (slot < 0) {
      pushToast('Every position is filled', 'Remove or move a beat to make room.', 'warning')
      return
    }
    commit(withPlacement(order, eventId, slot, null))
  }

  const returnToPool = (eventId: string) => {
    const slot = order.indexOf(eventId)
    if (slot < 0) return
    removeFromSlot(slot)
  }

  const handleCheck = () => {
    if (!complete) {
      pushToast('Sequence incomplete', 'Place all eight beats before validating.', 'warning')
      return
    }
    checkReconstruction()
    const scored = scoreReconstruction(order)
    pushToast(
      scored.score === 100 ? 'Sequence verified' : 'Reconstruction analysed',
      `${scored.correctCount} of ${scored.total} beats in the correct position · ${scored.score}% accuracy`,
      scored.score === 100 ? 'success' : 'warning',
    )
  }

  const handleReset = () => {
    resetReconstruction()
    setDragId(null)
    setDragOrigin(null)
    pushToast('Reconstruction cleared', 'The eight beats are back in the pool.', 'default')
  }

  const onDragStart = (event: DragEvent<HTMLElement>, eventId: string, origin: DragOrigin) => {
    event.dataTransfer.setData('text/plain', eventId)
    event.dataTransfer.effectAllowed = 'move'
    setDragId(eventId)
    setDragOrigin(origin)
  }

  const onDropOnSlot = (event: DragEvent<HTMLElement>, slot: number) => {
    event.preventDefault()
    const eventId = event.dataTransfer.getData('text/plain') || dragId
    if (eventId) dropIntoSlot(eventId, slot)
  }

  const onDropOnPool = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const eventId = event.dataTransfer.getData('text/plain') || dragId
    if (eventId) returnToPool(eventId)
    setDragId(null)
    setDragOrigin(null)
    setPoolHover(false)
  }

  const remaining = RECONSTRUCTION_EVENTS.length - placedIds.length

  return (
    <div className="space-y-7 pb-10">
      <PageHeader
        eyebrow="Signature analysis · 08 beats"
        title="The Reconstruction Room"
        description="Arrange the discovered beats of the blackout in the order they actually occurred. Timestamps are withheld until you validate the sequence. Accuracy is scored independently of your verdict."
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              icon={<ListRestart size={13} />}
              onClick={handleReset}
              disabled={placedIds.length === 0 && !checkedAt}
            >
              Clear
            </Button>
            <Button
              variant="brass"
              size="sm"
              icon={checkedAt ? <ShieldCheck size={13} /> : <Lock size={13} />}
              onClick={handleCheck}
              disabled={!complete}
            >
              {checkedAt ? 'Re-validate sequence' : 'Validate sequence'}
            </Button>
          </>
        }
        meta={
          <>
            <StatusBadge tone={activeScore === null ? 'neutral' : activeScore >= 75 ? 'green' : 'red'} dot>
              {reconstructionLabel(activeScore)}
            </StatusBadge>
            <StatusBadge tone="neutral">{placedIds.length} / 8 positioned</StatusBadge>
            <StatusBadge tone="neutral">Attempts {attempts}</StatusBadge>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          {/* Pool */}
          <section
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = 'move'
              setPoolHover(true)
            }}
            onDragLeave={() => setPoolHover(false)}
            onDrop={onDropOnPool}
            className={cn(
              'border bg-ink-900/60 p-4 transition-colors sm:p-5',
              poolHover ? 'border-brass/60 bg-brass/[0.04]' : 'border-white/[0.09]',
            )}
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="label mb-1.5 text-brass">Unplaced beats</div>
                <h2 className="font-serif text-2xl leading-none">The evidence pool</h2>
              </div>
              <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-ash/60">
                {remaining === 0 ? 'All beats placed' : `${remaining} remaining`}
              </div>
            </div>

            {remaining === 0 ? (
              <div className="mt-4 border border-dashed border-white/12 px-4 py-6 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-ash/55">
                Every beat is on the board — validate when you are ready.
              </div>
            ) : (
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {pool.map((beat) => (
                  <div
                    key={beat.id}
                    draggable
                    onDragStart={(event) => onDragStart(event, beat.id, { from: 'pool' })}
                    onDragEnd={() => {
                      setDragId(null)
                      setDragOrigin(null)
                    }}
                    className={cn(
                      'group flex cursor-grab items-start gap-3 border border-white/[0.1] bg-ink-850 p-3.5 transition-all hover:border-white/25 hover:bg-ink-800 active:cursor-grabbing',
                      dragId === beat.id && 'opacity-40',
                    )}
                  >
                    <GripVertical size={14} className="mt-0.5 shrink-0 text-ash/30" />
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-ash/50">
                        {beat.source}
                      </div>
                      <h3 className="mt-1 font-serif text-base leading-tight text-bone">{beat.title}</h3>
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-ash/75">
                        {beat.detail}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => placeFromPool(beat.id)}
                      className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center border border-white/15 text-ash transition-colors hover:border-brass/60 hover:text-brass"
                      aria-label={`Place "${beat.title}" in the next open position`}
                      title="Place in next open position"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Slots */}
          <section className="border border-white/[0.09] bg-ink-850">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3 sm:px-5">
              <div className="flex items-center gap-3">
                <Clock3 size={14} className="text-brass" />
                <span className="label text-bone/70">Chronology</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.14em] text-ash/50">
                <span>01</span>
                <span className="h-px w-10 bg-white/15" />
                <span>08</span>
              </div>
            </div>

            <ol className="divide-y divide-white/[0.06]">
              {RECONSTRUCTION_ORDER.map((expectedId, slot) => {
                const placedId = order[slot]
                const beat = placedId ? RECONSTRUCTION_BY_ID[placedId] : null
                const placement = result?.placements[slot]
                const incorrect = Boolean(result && placement && !placement.correct)
                const isHover = hoverSlot === slot && dragId !== null

                return (
                  <li
                    key={expectedId}
                    onDragOver={(event) => {
                      event.preventDefault()
                      event.dataTransfer.dropEffect = 'move'
                      setHoverSlot(slot)
                    }}
                    onDragLeave={() => setHoverSlot((current) => (current === slot ? null : current))}
                    onDrop={(event) => onDropOnSlot(event, slot)}
                    className={cn(
                      'grid grid-cols-[46px_minmax(0,1fr)] transition-colors sm:grid-cols-[64px_minmax(0,1fr)]',
                      isHover && 'bg-brass/[0.06]',
                      incorrect && 'bg-blood/[0.045]',
                    )}
                  >
                    <div
                      className={cn(
                        'flex flex-col items-center justify-center border-r border-white/[0.06] py-4 font-mono',
                        placement?.correct ? 'text-[#9DB8A4]' : incorrect ? 'text-[#D97878]' : 'text-ash/45',
                      )}
                    >
                      <span className="text-sm leading-none">{String(slot + 1).padStart(2, '0')}</span>
                      {result && (
                        <span className="mt-1.5">
                          {placement?.correct ? <Check size={11} /> : <TriangleAlert size={11} />}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 p-3 sm:p-4">
                      {beat ? (
                        <div
                          draggable
                          onDragStart={(event) => onDragStart(event, beat.id, { from: 'slot', slot })}
                          onDragEnd={() => {
                            setDragId(null)
                            setDragOrigin(null)
                          }}
                          className={cn(
                            'group flex cursor-grab items-start gap-3 border bg-ink-900/70 p-3 transition-colors active:cursor-grabbing sm:p-3.5',
                            placement?.correct
                              ? 'border-[#5F7D68]/45'
                              : incorrect
                                ? 'border-blood/45'
                                : 'border-white/12 hover:border-white/25',
                            dragId === beat.id && 'opacity-40',
                          )}
                        >
                          <GripVertical size={14} className="mt-0.5 shrink-0 text-ash/30" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                              {checkedAt ? (
                                <span className="font-mono text-[8px] tracking-[0.12em] text-brass">
                                  {beat.time}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ash/35">
                                  <Lock size={9} /> time withheld
                                </span>
                              )}
                              <span className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-ash/45">
                                {beat.source}
                              </span>
                            </div>
                            <h3 className="mt-1 font-serif text-[1.05rem] leading-tight text-bone">
                              {beat.title}
                            </h3>
                            <p className="mt-1.5 text-[11px] leading-relaxed text-ash/75">{beat.detail}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              {beat.evidenceIds.map((id) => {
                                const item = EVIDENCE_BY_ID[id]
                                if (!item) return null
                                return (
                                  <Link
                                    key={id}
                                    to={`/app/evidence/${id}`}
                                    className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-ash/55 transition-colors hover:text-brass"
                                  >
                                    {item.code} ↗
                                  </Link>
                                )
                              })}
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-col items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveSlot(slot, -1)}
                              disabled={slot === 0}
                              className="grid h-6 w-6 place-items-center border border-white/10 text-ash/55 transition-colors hover:border-white/30 hover:text-bone disabled:opacity-25"
                              aria-label="Move beat earlier"
                            >
                              <ArrowUp size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSlot(slot, 1)}
                              disabled={slot === order.length - 1}
                              className="grid h-6 w-6 place-items-center border border-white/10 text-ash/55 transition-colors hover:border-white/30 hover:text-bone disabled:opacity-25"
                              aria-label="Move beat later"
                            >
                              <ArrowDown size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromSlot(slot)}
                              className="grid h-6 w-6 place-items-center border border-white/10 text-ash/55 transition-colors hover:border-blood/50 hover:text-[#D97878]"
                              aria-label="Remove beat from sequence"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            'flex min-h-[76px] items-center justify-center gap-2 border border-dashed px-4 py-5 transition-colors',
                            isHover
                              ? 'border-brass/70 bg-brass/[0.05] text-brass'
                              : 'border-white/12 text-ash/35',
                          )}
                        >
                          <span className="font-mono text-[8.5px] uppercase tracking-[0.16em]">
                            {isHover ? 'Release to place beat here' : 'Awaiting beat'}
                          </span>
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>

          {/* Discrepancy report */}
          {result && result.correctCount < result.total && (
            <section className="border border-blood/30 bg-blood/[0.035]">
              <div className="flex items-center gap-3 border-b border-blood/25 px-4 py-3 sm:px-5">
                <TriangleAlert size={14} className="text-[#D97878]" />
                <span className="label text-[#D97878]">Discrepancy report</span>
              </div>
              <ul className="divide-y divide-blood/15">
                {result.placements
                  .filter((placement) => !placement.correct)
                  .map((placement) => {
                    const placed = placement.placedId ? RECONSTRUCTION_BY_ID[placement.placedId] : null
                    const expected = RECONSTRUCTION_BY_ID[placement.expectedId]
                    const trueIndex = placement.placedId
                      ? RECONSTRUCTION_ORDER.indexOf(placement.placedId)
                      : -1
                    return (
                      <li key={placement.slot} className="px-4 py-3.5 sm:px-5">
                        <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#D97878]">
                          Position {String(placement.slot + 1).padStart(2, '0')}
                        </div>
                        {placed ? (
                          <>
                            <p className="mt-1.5 text-[12px] leading-relaxed text-bone/80">
                              <span className="text-ash">You placed</span> {placed.title}
                              <span className="text-ash"> at {placed.time}.</span> It belongs at position{' '}
                              <span className="font-mono text-brass">
                                {String(trueIndex + 1).padStart(2, '0')}
                              </span>
                              .
                            </p>
                            <p className="mt-1 text-[11px] leading-relaxed text-ash/70">
                              This position should hold <span className="text-bone/80">{expected.title}</span>{' '}
                              <span className="font-mono text-brass">({expected.time})</span>.
                            </p>
                          </>
                        ) : (
                          <p className="mt-1.5 text-[12px] leading-relaxed text-bone/80">
                            Empty position. This beat belongs here:{' '}
                            <span className="text-bone">{expected.title}</span>{' '}
                            <span className="font-mono text-brass">({expected.time})</span>.
                          </p>
                        )}
                      </li>
                    )
                  })}
              </ul>
              <div className="px-4 py-3 font-mono text-[8px] uppercase leading-relaxed tracking-[0.12em] text-ash/55 sm:px-5">
                Re-validate after each adjustment — the score updates live once a sequence has been checked.
              </div>
            </section>
          )}

          {result && result.correctCount === result.total && (
            <section className="border border-[#5F7D68]/35 bg-[#5F7D68]/[0.06] p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#9DB8A4]" />
                <div>
                  <h2 className="font-serif text-2xl leading-tight text-bone">Sequence verified</h2>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-ash">
                    The reconstruction now matches the controller audit, the access log and the dock export.
                    Every beat is in the correct position. Carry this account into your verdict.
                  </p>
                  <Link
                    to="/app/verdict"
                    className={cn(buttonStyles('primary', 'sm'), 'mt-4')}
                  >
                    <Gavel size={13} />
                    Take the reconstruction to verdict
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Side panel */}
        <aside className="min-w-0 space-y-5">
          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="label mb-3 text-brass">Accuracy</div>
            {activeScore === null ? (
              <div className="flex items-center gap-4">
                <div className="grid h-[104px] w-[104px] place-items-center border border-dashed border-white/15 font-serif text-4xl text-ash/35">
                  —
                </div>
                <div>
                  <div className="font-serif text-xl leading-tight text-bone/80">Unverified</div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-ash/70">
                    Place all eight beats, then run validation to score the sequence.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <ScoreRing value={activeScore} size={112} label="ACCURACY" />
                <div className="min-w-0">
                  <div className="font-serif text-xl leading-tight">
                    {result ? result.correctCount : '—'}{' '}
                    <span className="text-ash/60">/ {RECONSTRUCTION_EVENTS.length}</span>
                  </div>
                  <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-ash/60">
                    beats correctly placed
                  </div>
                  <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-ash/45">
                    {attempts} validation{attempts === 1 ? '' : 's'} logged
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="label mb-2.5 text-brass">Chain of events</div>
            <p className="text-[11.5px] leading-relaxed text-ash">
              This reconstruction covers the security blackout from the credential clone to the false incident
              report. Only beats already evidenced in the file appear in the pool.
            </p>
            <ul className="mt-4 space-y-2 border-t border-white/[0.07] pt-3">
              {[
                ['Window', '22:42:11 — 22:53:11'],
                ['Coverage lost', '660 seconds'],
                ['Dock handoff', '22:58:04'],
                ['Report filed', '23:04:02'],
              ].map(([label, value]) => (
                <li key={label} className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash/55">{label}</span>
                  <span className="font-mono text-[8.5px] tracking-[0.04em] text-bone/75">{value}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-brass/25 bg-brass/[0.035] p-5">
            <div className="flex items-center gap-2">
              <Info size={13} className="text-brass" />
              <span className="label text-brass">How it is scored</span>
            </div>
            <p className="mt-2.5 text-[11.5px] leading-relaxed text-ash">
              Accuracy is the percentage of beats in their true chronological position. Each beat carries equal
              weight, so eight correct placements return 100%.
            </p>
            <div className="mt-3 h-[3px] w-full bg-white/[0.08]">
              <div
                className="h-full bg-brass transition-[width] duration-700"
                style={{ width: `${activeScore ?? 0}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.12em] text-ash/55">
              <span>0%</span>
              <span>100%</span>
            </div>
          </section>

          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="label mb-2">Cross-check</div>
            <p className="text-[11.5px] leading-relaxed text-ash">
              The verified sequence should support the same culprit, method and motive you submit to the
              tribunal. Use the links to test each beat against its source exhibit.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                to="/app/timeline"
                className="group flex items-center justify-between border border-white/10 px-3 py-2 transition-colors hover:border-white/25"
              >
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-bone/70">
                  Open master timeline
                </span>
                <ArrowRight size={12} className="text-ash transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/app/evidence"
                className="group flex items-center justify-between border border-white/10 px-3 py-2 transition-colors hover:border-white/25"
              >
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-bone/70">
                  Re-examine exhibits
                </span>
                <ArrowRight size={12} className="text-ash transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
