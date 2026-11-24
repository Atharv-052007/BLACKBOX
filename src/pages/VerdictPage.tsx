import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Gavel,
  Lightbulb,
  Lock,
  Scale,
  ScanLine,
  Sparkles,
  X,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/components/ui/Badges'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar, ScoreRing } from '@/components/ui/Progress'
import { EVIDENCE, EVIDENCE_BY_ID } from '@/data/evidence'
import {
  CULPRIT_OPTIONS,
  KEY_EVIDENCE,
  METHOD_OPTIONS,
  MOTIVE_OPTIONS,
  SOLUTION,
} from '@/data/solution'
import { useCaseStore } from '@/store/useCaseStore'
import { useUiStore } from '@/store/useUiStore'
import { scoreVerdict, scoreVerdictLabel } from '@/utils/scoring'
import { shortDate } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { VerdictAnswers } from '@/types'

const KEY_EVIDENCE_SET = new Set<string>(KEY_EVIDENCE)

const OUTCOME_META = {
  SOLVED: {
    label: 'SOLVED',
    tone: 'green' as const,
    headline: 'The file is closed.',
    body: 'You named the culprit, the method and the motive, and your reasoning crossed the 85-point threshold. The sealed solution is now open.',
  },
  PARTIAL: {
    label: 'PARTIAL',
    tone: 'amber' as const,
    headline: 'A partial reconstruction.',
    body: 'Some of your deductions hold. The file requires a correct culprit and at least 85 points for a full solve. Review the flagged gaps below.',
  },
  UNSOLVED: {
    label: 'UNSOLVED',
    tone: 'red' as const,
    headline: 'The file remains open.',
    body: 'The conclusion does not survive contact with the record. Reconcile the controller audit trail, the access log and the storage inventory, then revise.',
  },
}

function OptionCard({
  selected,
  onSelect,
  label,
  detail,
  code,
  disabled = false,
}: {
  selected: boolean
  onSelect: () => void
  label: string
  detail: string
  code: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        'group relative flex w-full items-start gap-3 border p-4 text-left transition-colors',
        selected
          ? 'border-brass/60 bg-brass/[0.07]'
          : 'border-white/[0.09] bg-ink-900/40 hover:border-white/25 hover:bg-white/[0.02]',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <span
        className={cn(
          'mt-0.5 grid h-4 w-4 shrink-0 place-items-center border',
          selected ? 'border-brass bg-brass text-ink-950' : 'border-white/25 text-transparent',
        )}
      >
        <Check size={11} strokeWidth={3} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-ash/45">{code}</span>
          <span className="font-serif text-lg leading-tight text-bone">{label}</span>
        </span>
        <span className="mt-1 block text-[11.5px] leading-relaxed text-ash">{detail}</span>
      </span>
    </button>
  )
}

function EvidencePicker({
  selected,
  onToggle,
  disabled = false,
}: {
  selected: string[]
  onToggle: (id: string) => void
  disabled?: boolean
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return EVIDENCE
    return EVIDENCE.filter((item) =>
      `${item.code} ${item.title} ${item.summary} ${item.tags.join(' ')}`
        .toLowerCase()
        .includes(normalized),
    )
  }, [query])

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash/50">
            {selected.length} cited
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash/40">
            minimum 3
          </span>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter exhibits…"
          className="input input-mono h-8 w-full max-w-[220px] py-1 text-[10px]"
          aria-label="Filter exhibits for citation"
        />
      </div>

      <div className="grid max-h-[360px] gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2">
        {filtered.map((item) => {
          const active = selected.includes(item.id)
          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(item.id)}
              aria-pressed={active}
              className={cn(
                'flex items-center gap-2.5 border px-2.5 py-2 text-left transition-colors',
                active
                  ? 'border-brass/45 bg-brass/[0.06]'
                  : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]',
                disabled && 'cursor-not-allowed opacity-60',
              )}
            >
              <span
                className={cn(
                  'grid h-4 w-4 shrink-0 place-items-center border',
                  active ? 'border-brass bg-brass text-ink-950' : 'border-white/20 text-transparent',
                )}
              >
                <Check size={10} strokeWidth={3} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[7.5px] uppercase tracking-[0.1em] text-ash/50">
                  {item.code}
                </span>
                <span className="block truncate text-[11px] text-bone/75">{item.title}</span>
              </span>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-full border border-dashed border-white/10 px-3 py-6 text-center text-[11px] text-ash/50">
            No exhibits match “{query}”.
          </div>
        )}
      </div>
    </div>
  )
}

function ScoreRow({
  label,
  earned,
  max,
  tone = '#B83232',
}: {
  label: string
  earned: number
  max: number
  tone?: string
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between font-mono text-[8.5px] uppercase tracking-[0.1em]">
        <span className="text-ash/65">{label}</span>
        <span className="text-bone/70">
          {earned} / {max}
        </span>
      </div>
      <ProgressBar value={earned} max={max} color={tone} />
    </div>
  )
}

function VerdictResult() {
  const verdict = useCaseStore((state) => state.verdict)
  const clearVerdict = useCaseStore((state) => state.clearVerdict)
  const reconstructionScore = useCaseStore((state) => state.reconstructionScore)
  const reconstructionAttempts = useCaseStore((state) => state.reconstructionAttempts)
  const pushToast = useUiStore((state) => state.pushToast)

  if (!verdict) return null

  const { answers, score, explanationAnalysis, outcome } = verdict
  const outcomeMeta = OUTCOME_META[outcome]
  const culpritOption = CULPRIT_OPTIONS.find((option) => option.id === answers.culprit)
  const methodOption = METHOD_OPTIONS.find((option) => option.id === answers.method)
  const motiveOption = MOTIVE_OPTIONS.find((option) => option.id === answers.motive)
  const correctedCulprit = CULPRIT_OPTIONS.find((option) => option.id === SOLUTION.culpritId)
  const correctedMethod = METHOD_OPTIONS.find((option) => option.id === SOLUTION.methodId)
  const correctedMotive = MOTIVE_OPTIONS.find((option) => option.id === SOLUTION.motiveId)

  const citedKey = answers.evidence.filter((id) => KEY_EVIDENCE_SET.has(id))
  const citedIncorrect = answers.evidence.filter((id) => !KEY_EVIDENCE_SET.has(id))
  const missedKey = SOLUTION.keyEvidence.filter((id) => !answers.evidence.includes(id))

  const selectionChecks = [
    {
      label: 'Culprit',
      selected: culpritOption?.label ?? 'No selection',
      correct: answers.culprit === SOLUTION.culpritId,
      expected: correctedCulprit?.label ?? 'Mara Voss',
    },
    {
      label: 'Method',
      selected: methodOption?.label ?? 'No selection',
      correct: answers.method === SOLUTION.methodId,
      expected: correctedMethod?.label ?? 'Cloned credential + firmware blackout',
    },
    {
      label: 'Motive',
      selected: motiveOption?.label ?? 'No selection',
      correct: answers.motive === SOLUTION.motiveId,
      expected: correctedMotive?.label ?? 'Paid by Halcyon Dynamics',
    },
  ]

  return (
    <div className="space-y-7 pb-8">
      <header className="relative border-b border-white/[0.08] pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
            Verdict / filed
          </span>
          <span className="h-3 w-px bg-white/15" />
          <StatusBadge tone={outcomeMeta.tone} dot>
            {outcomeMeta.label}
          </StatusBadge>
          <StatusBadge tone="neutral">{scoreVerdictLabel(score.total)}</StatusBadge>
          <span className="ml-auto font-mono text-[8px] uppercase tracking-[0.12em] text-ash/40">
            {shortDate(verdict.submittedAt)}
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <h1 className="display text-[clamp(2.6rem,5vw,4.4rem)]">{outcomeMeta.headline}</h1>
            <p className="mt-4 text-sm leading-relaxed text-ash">{outcomeMeta.body}</p>
            {outcome === 'SOLVED' && (
              <p className="mt-3 font-serif text-xl italic text-brass">{SOLUTION.headline}</p>
            )}
          </div>
          <div className="flex items-center gap-5 border border-white/[0.09] bg-ink-850 px-5 py-4">
            <ScoreRing value={score.total} size={128} label="Final" />
            <div className="space-y-2">
              <div>
                <div className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-ash/45">
                  Classification
                </div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-bone/75">
                  {outcomeMeta.label}
                </div>
              </div>
              <div>
                <div className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-ash/45">
                  Hint penalty
                </div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-bone/75">
                  −{score.hintPenalty} pts · {score.hintPenalty / 2}/3 hints
                </div>
              </div>
              <div>
                <div className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-ash/45">
                  Reasoning
                </div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-bone/75">
                  {explanationAnalysis.wordCount} words
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="space-y-6">
          <section className="border border-white/[0.09] bg-ink-850">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Scale size={13} className="text-brass" />
                <span className="label text-brass">Deduction marks</span>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash/45">
                {score.total} / 100
              </span>
            </div>
            <div className="space-y-4 p-5">
              <ScoreRow label="Culprit" earned={score.culprit.earned} max={score.culprit.max} tone="#B83232" />
              <ScoreRow label="Method" earned={score.method.earned} max={score.method.max} tone="#C69A55" />
              <ScoreRow label="Motive" earned={score.motive.earned} max={score.motive.max} tone="#C69A55" />
              <ScoreRow label="Evidence cited" earned={score.evidence.earned} max={score.evidence.max} tone="#7C93A8" />
              <ScoreRow
                label="Reasoning depth"
                earned={score.explanation.earned}
                max={score.explanation.max}
                tone="#8FA69A"
              />
              {score.hintPenalty > 0 && (
                <div className="flex items-center justify-between border-t border-white/[0.07] pt-3 font-mono text-[8.5px] uppercase tracking-[0.1em]">
                  <span className="flex items-center gap-2 text-ash/65">
                    <Lightbulb size={11} className="text-brass" />
                    Hint penalty
                  </span>
                  <span className="text-[#D97878]">−{score.hintPenalty}</span>
                </div>
              )}
            </div>
          </section>

          <section className="border border-white/[0.09] bg-ink-850">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <ScanLine size={13} className="text-brass" />
                <span className="label text-brass">Reconstruction cross-check</span>
              </div>
              <StatusBadge
                tone={
                  reconstructionScore === null ? 'neutral' : reconstructionScore >= 75 ? 'green' : 'red'
                }
              >
                {reconstructionScore === null ? 'Not validated' : `${reconstructionScore}% accuracy`}
              </StatusBadge>
            </div>
            <div className="p-5">
              <p className="text-[12px] leading-relaxed text-ash">
                {reconstructionScore === null
                  ? 'You filed without validating the blackout sequence. The Reconstruction Room tests whether the eleven minutes hold together in chronological order.'
                  : reconstructionScore === 100
                    ? 'Your reconstruction matches the controller audit exactly. The sequence independently corroborates the verdict you filed.'
                    : 'Your reconstruction only partly matches the controller audit. Re-open the sequence and reconcile the discrepancy report.'}
              </p>
              {reconstructionScore !== null && (
                <div className="mt-3">
                  <ProgressBar
                    value={reconstructionScore}
                    max={100}
                    color={reconstructionScore === 100 ? '#5F7D68' : '#C69A55'}
                  />
                  <div className="mt-1.5 font-mono text-[7.5px] uppercase tracking-[0.12em] text-ash/45">
                    {reconstructionAttempts} validation{reconstructionAttempts === 1 ? '' : 's'} logged
                  </div>
                </div>
              )}
              <Link
                to="/app/reconstruction"
                className="mt-3 inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-brass transition-colors hover:text-bone"
              >
                Open the Reconstruction Room
                <ArrowRight size={11} />
              </Link>
            </div>
          </section>

          <section className="border border-white/[0.09] bg-ink-850">
            <div className="border-b border-white/[0.08] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-brass" />
                <span className="label text-brass">Your three answers</span>
              </div>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {selectionChecks.map((check) => (
                <div key={check.label} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-ash/45">
                        {check.label}
                      </div>
                      <div className="mt-1 font-serif text-lg leading-tight">{check.selected}</div>
                      {!check.correct && (
                        <div className="mt-1 text-[11px] leading-relaxed text-ash/60">
                          File supports: <span className="text-brass">{check.expected}</span>
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        'mt-0.5 flex shrink-0 items-center gap-1 border px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em]',
                        check.correct
                          ? 'border-[#5F7D68]/50 bg-[#5F7D68]/[0.08] text-[#9DB8A4]'
                          : 'border-blood/40 bg-blood/[0.07] text-[#D97878]',
                      )}
                    >
                      {check.correct ? <Check size={9} /> : <X size={9} />}
                      {check.correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-brass" />
                <span className="label text-brass">Reasoning analysis</span>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash/45">
                {explanationAnalysis.matchedConcepts.length} /{' '}
                {explanationAnalysis.matchedConcepts.length + explanationAnalysis.missedConcepts.length}{' '}
                concepts
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#9DB8A4]/80">
                  Established
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {explanationAnalysis.matchedConcepts.length === 0 ? (
                    <span className="text-[11px] text-ash/45">None recognised.</span>
                  ) : (
                    explanationAnalysis.matchedConcepts.map((concept) => (
                      <span
                        key={concept}
                        className="flex items-center gap-1 border border-[#5F7D68]/40 bg-[#5F7D68]/[0.07] px-1.5 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.08em] text-[#9DB8A4]"
                      >
                        <Check size={8} />
                        {concept}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <div>
                <div className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-ash/45">
                  Not addressed
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {explanationAnalysis.missedConcepts.length === 0 ? (
                    <span className="text-[11px] text-ash/45">Nothing missing.</span>
                  ) : (
                    explanationAnalysis.missedConcepts.map((concept) => (
                      <span
                        key={concept}
                        className="border border-white/[0.08] px-1.5 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.08em] text-ash/50"
                      >
                        {concept}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
            {verdict.answers.explanation && (
              <div className="mt-5 border-t border-white/[0.07] pt-4">
                <div className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-ash/45">
                  Submitted reasoning
                </div>
                <p className="mt-2 whitespace-pre-wrap text-[12.5px] leading-relaxed text-bone/70">
                  {verdict.answers.explanation}
                </p>
              </div>
            )}
          </section>

          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={13} className="text-brass" />
                <span className="label text-brass">Evidence cited</span>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash/45">
                {citedKey.length} / {SOLUTION.keyEvidence.length} key exhibits
              </span>
            </div>

            <div className="mt-4">
              <div className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#9DB8A4]/80">
                Key exhibits cited
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {citedKey.length === 0 ? (
                  <span className="text-[11px] text-ash/45">No key exhibits cited.</span>
                ) : (
                  citedKey.map((id) => (
                    <Link
                      key={id}
                      to={`/app/evidence/${id}`}
                      className="border border-[#5F7D68]/40 bg-[#5F7D68]/[0.06] px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.08em] text-[#9DB8A4] hover:border-[#5F7D68]"
                    >
                      {EVIDENCE_BY_ID[id]?.code ?? id}
                    </Link>
                  ))
                )}
              </div>
            </div>

            {missedKey.length > 0 && (
              <div className="mt-4">
                <div className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-ash/45">
                  Missed key exhibits
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {missedKey.map((id) => (
                    <Link
                      key={id}
                      to={`/app/evidence/${id}`}
                      className="border border-white/[0.1] px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.08em] text-ash/60 hover:border-brass/40 hover:text-brass"
                    >
                      {EVIDENCE_BY_ID[id]?.code ?? id}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {citedIncorrect.length > 0 && (
              <div className="mt-4">
                <div className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#D97878]/80">
                  Cited but not decisive
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {citedIncorrect.map((id) => (
                    <Link
                      key={id}
                      to={`/app/evidence/${id}`}
                      className="border border-blood/25 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.08em] text-[#D97878]/80 hover:border-blood/50"
                    >
                      {EVIDENCE_BY_ID[id]?.code ?? id}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="border border-brass/30 bg-brass/[0.035] p-5">
            <div className="flex items-center gap-2">
              <Lock size={13} className="text-brass" />
              <span className="label text-brass">Sealed solution</span>
            </div>
            <div className="mt-4 space-y-3">
              {SOLUTION.summary.map((entry) => (
                <div key={entry.label} className="border-b border-brass/15 pb-2.5 last:border-0 last:pb-0">
                  <div className="font-mono text-[7px] uppercase tracking-[0.14em] text-brass/60">
                    {entry.label}
                  </div>
                  <div className="mt-0.5 text-[12px] leading-relaxed text-bone/80">{entry.value}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-white/[0.09] bg-ink-850">
            <div className="border-b border-white/[0.08] px-5 py-3.5">
              <span className="label text-brass">The sequence</span>
            </div>
            <div className="p-4">
              {SOLUTION.sequence.map((step) => (
                <div key={step.time} className="flex gap-3 border-l border-white/10 pb-3 pl-3 last:pb-0">
                  <span className="w-12 shrink-0 font-mono text-[9px] text-brass/70">{step.time}</span>
                  <span className="text-[11px] leading-relaxed text-ash">{step.text}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="flex items-center gap-2">
              <Gavel size={13} className="text-brass" />
              <span className="label text-brass">Next</span>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/app/reports" className="btn btn-primary w-full">
                <FileText size={13} />
                Open official report
              </Link>
              <Link to="/app/evidence" className="btn btn-ghost w-full">
                Re-examine evidence
              </Link>
              <Button
                variant="quiet"
                className="w-full"
                onClick={() => {
                  clearVerdict()
                  pushToast('Verdict withdrawn', 'You can revise and file a new conclusion.', 'warning')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Revise verdict
              </Button>
            </div>
          </section>
        </aside>
      </div>

      <section className="border border-white/[0.09] bg-ink-850 p-5 sm:p-7">
        <div className="flex items-center gap-2">
          <Lock size={13} className="text-brass" />
          <span className="label text-brass">Full solution</span>
        </div>
        <div className="mt-4 space-y-4">
          {SOLUTION.narrative.map((paragraph, index) => (
            <p key={index} className="text-[13.5px] leading-relaxed text-bone/75">
              {paragraph}
            </p>
          ))}
        </div>
        <p className="mt-5 border-l-2 border-brass/50 pl-4 font-serif text-lg italic leading-relaxed text-brass/90">
          {SOLUTION.conclusion}
        </p>
      </section>
    </div>
  )
}

function VerdictForm() {
  const hintsRevealed = useCaseStore((state) => state.hintsRevealed)
  const setVerdict = useCaseStore((state) => state.setVerdict)
  const verdict = useCaseStore((state) => state.verdict)
  const pushToast = useUiStore((state) => state.pushToast)

  const [culprit, setCulprit] = useState(verdict?.answers.culprit ?? '')
  const [method, setMethod] = useState(verdict?.answers.method ?? '')
  const [motive, setMotive] = useState(verdict?.answers.motive ?? '')
  const [evidence, setEvidence] = useState<string[]>(verdict?.answers.evidence ?? [])
  const [explanation, setExplanation] = useState(verdict?.answers.explanation ?? '')
  const [errors, setErrors] = useState<string[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)

  const wordCount = explanation.trim().split(/\s+/).filter(Boolean).length

  const toggleEvidence = (id: string) => {
    setEvidence((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const validate = (): string[] => {
    const list: string[] = []
    if (!culprit) list.push('Name the person responsible.')
    if (!method) list.push('Select how the security system was bypassed.')
    if (!motive) list.push('Select why the prototype was taken.')
    if (evidence.length < 3) list.push('Cite at least three exhibits that support your conclusion.')
    if (wordCount < 40) list.push('Write at least 40 words of reasoning (you have ' + wordCount + ').')
    return list
  }

  const attemptSubmit = () => {
    const list = validate()
    setErrors(list)
    if (list.length > 0) {
      pushToast('Verdict incomplete', 'Resolve the flagged items before filing.', 'warning')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setConfirmOpen(true)
  }

  const fileVerdict = () => {
    const answers: VerdictAnswers = { culprit, method, motive, evidence, explanation }
    const result = scoreVerdict(answers, hintsRevealed)
    setVerdict({
      answers,
      submittedAt: new Date().toISOString(),
      score: result.score,
      explanationAnalysis: result.explanationAnalysis,
      outcome: result.outcome,
    })
    setConfirmOpen(false)
    pushToast('Verdict filed', `Final score ${result.score.total} / 100 · ${result.outcome}`, 'success')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const culpritLabel = CULPRIT_OPTIONS.find((option) => option.id === culprit)?.label
  const methodLabel = METHOD_OPTIONS.find((option) => option.id === method)?.label
  const motiveLabel = MOTIVE_OPTIONS.find((option) => option.id === motive)?.label

  return (
    <div className="space-y-7 pb-8">
      <PageHeader
        eyebrow="Resolution / final filing"
        title="Final Verdict"
        description="Name the culprit, establish the method and identify the motive. Your answer is graded against the sealed solution. A correct culprit alone is not a solve."
        meta={
          <>
            <StatusBadge tone="red">40 · culprit</StatusBadge>
            <StatusBadge tone="amber">20 · method</StatusBadge>
            <StatusBadge tone="amber">15 · motive</StatusBadge>
            <StatusBadge tone="steel">15 · evidence</StatusBadge>
            <StatusBadge tone="green">10 · reasoning</StatusBadge>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {errors.length > 0 && (
            <div
              className="border border-blood/40 bg-blood/[0.06] p-4"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.12em] text-[#D97878]">
                <AlertTriangle size={12} />
                Filing blocked · {errors.length} {errors.length === 1 ? 'issue' : 'issues'}
              </div>
              <ul className="mt-2 space-y-1">
                {errors.map((error) => (
                  <li key={error} className="flex items-start gap-2 text-[11.5px] leading-relaxed text-ash">
                    <X size={10} className="mt-1 shrink-0 text-blood" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <fieldset className="border border-white/[0.09] bg-ink-850 p-5">
            <legend className="label px-1 text-brass">01 · Who took the VANTAGE-7?</legend>
            <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Culprit">
              {CULPRIT_OPTIONS.map((option, index) => (
                <OptionCard
                  key={option.id}
                  code={`0${index + 1}`}
                  label={option.label}
                  detail={option.detail}
                  selected={culprit === option.id}
                  onSelect={() => setCulprit(option.id)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="border border-white/[0.09] bg-ink-850 p-5">
            <legend className="label px-1 text-brass">02 · How was the security system bypassed?</legend>
            <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Method">
              {METHOD_OPTIONS.map((option, index) => (
                <OptionCard
                  key={option.id}
                  code={`0${index + 1}`}
                  label={option.label}
                  detail={option.detail}
                  selected={method === option.id}
                  onSelect={() => setMethod(option.id)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="border border-white/[0.09] bg-ink-850 p-5">
            <legend className="label px-1 text-brass">03 · Why was it taken?</legend>
            <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Motive">
              {MOTIVE_OPTIONS.map((option, index) => (
                <OptionCard
                  key={option.id}
                  code={`0${index + 1}`}
                  label={option.label}
                  detail={option.detail}
                  selected={motive === option.id}
                  onSelect={() => setMotive(option.id)}
                />
              ))}
            </div>
          </fieldset>

          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="mb-4 flex items-center gap-2">
              <FileText size={13} className="text-brass" />
              <span className="label text-brass">04 · Cite your evidence</span>
            </div>
            <EvidencePicker selected={evidence} onToggle={toggleEvidence} />
          </section>

          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-brass" />
                <span className="label text-brass">05 · Reasoning</span>
              </div>
              <span
                className={cn(
                  'font-mono text-[8px] uppercase tracking-[0.1em]',
                  wordCount >= 40 ? 'text-[#9DB8A4]' : 'text-ash/45',
                )}
              >
                {wordCount} words · min 40
              </span>
            </div>
            <textarea
              value={explanation}
              onChange={(event) => setExplanation(event.target.value)}
              rows={10}
              maxLength={4000}
              placeholder="Reconstruct the eleven minutes. Name the mechanism, the timeline and the motive. Explain why the other suspects are excluded."
              className="input resize-none text-[13px] leading-relaxed"
              aria-label="Reasoning explanation"
            />
            <p className="mt-2 font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.08em] text-ash/35">
              Assessed for: credential cloning, staged blackout, security authority, camera disconnect,
              dock handoff, payment, timeline precision and the framing of Julian Reyes.
            </p>
          </section>

          <div className="flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.1em] text-ash/45">
              <Lock size={11} />
              One filing is graded · revision permitted after withdrawal
            </div>
            <Button variant="primary" size="lg" icon={<Gavel size={14} />} onClick={attemptSubmit}>
              File final verdict
            </Button>
          </div>
        </div>

        <aside className="space-y-4">
          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="label text-brass">Filing summary</div>
            <div className="mt-4 space-y-3">
              {[
                ['Culprit', culpritLabel ?? 'Not named'],
                ['Method', methodLabel ?? 'Not selected'],
                ['Motive', motiveLabel ?? 'Not selected'],
                ['Exhibits', `${evidence.length} cited`],
                ['Reasoning', `${wordCount} words`],
                ['Hints', `${hintsRevealed}/3 · −${hintsRevealed * 2} pts`],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-white/[0.06] pb-2.5 last:border-0 last:pb-0">
                  <div className="font-mono text-[7px] uppercase tracking-[0.14em] text-ash/40">
                    {label}
                  </div>
                  <div className="mt-0.5 text-[11.5px] leading-relaxed text-bone/75">{value}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-brass/25 bg-brass/[0.035] p-5">
            <div className="flex items-center gap-2">
              <Scale size={13} className="text-brass" />
              <span className="label text-brass">Grading</span>
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-ash">
              A full solve requires the correct culprit and a total of 85 or more. Method and motive
              carry 35 points between them; evidence selection and reasoning carry the rest.
            </p>
            <div className="mt-3 border-t border-brass/15 pt-3 font-mono text-[7.5px] uppercase tracking-[0.1em] text-ash/45">
              40 + 20 + 15 + 15 + 10 = 100
            </div>
          </section>

          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="flex items-center gap-2">
              <Lightbulb size={13} className="text-brass" />
              <span className="label text-brass">Before you file</span>
            </div>
            <ul className="mt-3 space-y-2 text-[11.5px] leading-relaxed text-ash">
              <li className="flex gap-2">
                <span className="mt-1.5 h-[4px] w-[4px] shrink-0 bg-brass/60" />
                A credential at a door is not a person at a door.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-[4px] w-[4px] shrink-0 bg-brass/60" />
                Compare the incident report against the controller’s signed log.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-[4px] w-[4px] shrink-0 bg-brass/60" />
                The case that carried the device belongs to someone.
              </li>
            </ul>
            <Link
              to="/app/timeline"
              className="group mt-4 inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.12em] text-brass"
            >
              Review the timeline
              <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </section>
        </aside>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="File this verdict?"
        eyebrow="Final submission"
        maxWidth="max-w-lg"
      >
        <p className="text-sm leading-relaxed text-ash">
          Your conclusion will be graded against the sealed solution and written to the official
          report. You can withdraw and revise afterwards, but the filed attempt is recorded.
        </p>
        <div className="mt-5 space-y-3 border-y border-white/[0.08] py-4">
          {[
            ['Culprit', culpritLabel ?? '—'],
            ['Method', methodLabel ?? '—'],
            ['Motive', motiveLabel ?? '—'],
            ['Exhibits', `${evidence.length} cited`],
            ['Reasoning', `${wordCount} words`],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-ash/45">
                {label}
              </span>
              <span className="text-right text-[12px] leading-relaxed text-bone/80">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="quiet" onClick={() => setConfirmOpen(false)}>
            Keep editing
          </Button>
          <Button variant="primary" icon={<Gavel size={13} />} onClick={fileVerdict}>
            File verdict
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export function VerdictPage() {
  const verdict = useCaseStore((state) => state.verdict)
  return verdict ? <VerdictResult /> : <VerdictForm />
}
