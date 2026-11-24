import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Award,
  Check,
  Download,
  FileText,
  Lock,
  Printer,
  RotateCcw,
  ShieldCheck,
  X,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/Badges'
import { ProgressBar, ScoreRing } from '@/components/ui/Progress'
import { CASE_FILE } from '@/data/case'
import { EVIDENCE } from '@/data/evidence'
import { SUSPECTS } from '@/data/suspects'
import { TIMELINE } from '@/data/timeline'
import {
  CULPRIT_OPTIONS,
  KEY_EVIDENCE,
  METHOD_OPTIONS,
  MOTIVE_OPTIONS,
  SOLUTION,
} from '@/data/solution'
import { useCaseStore } from '@/store/useCaseStore'
import { useUiStore } from '@/store/useUiStore'
import { getAchievements } from '@/utils/achievements'
import { caseProgress } from '@/utils/progress'
import { durationLabel, initials, shortDate } from '@/utils/format'
import { scoreVerdictLabel } from '@/utils/scoring'
import { cn } from '@/utils/cn'

const KEY_EVIDENCE_SET = new Set<string>(KEY_EVIDENCE)

const OUTCOME_LABEL = {
  SOLVED: 'SOLVED',
  PARTIAL: 'PARTIAL SOLUTION',
  UNSOLVED: 'UNSOLVED',
}

function NoReport() {
  const reviewed = useCaseStore((state) => state.reviewedEvidence)
  const viewedSuspects = useCaseStore((state) => state.viewedSuspects)
  const boardEdges = useCaseStore((state) => state.boardEdges)
  const expandedEvents = useCaseStore((state) => state.expandedEvents)
  const savedEvidence = useCaseStore((state) => state.savedEvidence)
  const notes = useCaseStore((state) => state.notes)
  const verdict = useCaseStore((state) => state.verdict)
  const reconstructionScore = useCaseStore((state) => state.reconstructionScore)

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
    [
      reviewed,
      viewedSuspects,
      savedEvidence,
      notes,
      expandedEvents,
      boardEdges,
      verdict,
      reconstructionScore,
    ],
  )

  const progress = caseProgress({
    reviewedEvidence: reviewed,
    viewedSuspects,
    boardEdges,
    expandedEvents,
    verdict,
    reconstructionScore,
  })
  const unlocked = achievements.filter((achievement) => achievement.unlocked).length

  return (
    <div className="space-y-7 pb-8">
      <PageHeader
        eyebrow="Case 001 / reporting"
        title="My Reports"
        description="The official investigation report is issued after a final verdict is filed. It records your conclusion, your score, the evidence you cited and the sealed solution."
        meta={
          <>
            <StatusBadge tone="neutral">No report on file</StatusBadge>
            <StatusBadge tone="amber">{progress}% complete</StatusBadge>
            <StatusBadge tone="green">
              {unlocked}/{achievements.length} decorations
            </StatusBadge>
          </>
        }
      />

      <EmptyState
        icon={<FileText size={30} />}
        title="No report has been issued"
        description="A report is generated only when you file a verdict. Continue the investigation — read the remaining exhibits, compare the accounts and connect the chain — then submit your conclusion."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/app/verdict" className="btn btn-primary">
              Open final verdict
            </Link>
            <Link to="/app/evidence" className="btn btn-ghost">
              Return to evidence
            </Link>
          </div>
        }
      />

      <section className="border border-white/[0.09] bg-ink-850">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Award size={13} className="text-brass" />
            <span className="label text-brass">Decorations</span>
          </div>
          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash/45">
            {unlocked} of {achievements.length} unlocked
          </span>
        </div>
        <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-start gap-3 bg-ink-850 px-4 py-3.5"
            >
              <span
                className={cn(
                  'mt-0.5 grid h-7 w-7 shrink-0 place-items-center border',
                  achievement.unlocked
                    ? 'border-brass/40 bg-brass/[0.08] text-brass'
                    : 'border-white/10 text-ash/30',
                )}
              >
                {achievement.unlocked ? <Check size={12} /> : <Lock size={11} />}
              </span>
              <div className="min-w-0">
                <div
                  className={cn(
                    'font-mono text-[8.5px] uppercase tracking-[0.08em]',
                    achievement.unlocked ? 'text-bone/75' : 'text-ash/45',
                  )}
                >
                  {achievement.name}
                </div>
                <div className="mt-0.5 text-[10.5px] leading-relaxed text-ash/50">
                  {achievement.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Exhibits reviewed', value: reviewed.length, max: EVIDENCE.length },
          { label: 'Dossiers read', value: viewedSuspects.length, max: SUSPECTS.length },
          { label: 'Board connections', value: boardEdges.length, max: 8 },
          { label: 'Reconstruction accuracy', value: reconstructionScore ?? 0, max: 100 },
        ].map((row) => (
          <div key={row.label} className="border border-white/[0.08] bg-ink-850 p-4">
            <div className="flex items-baseline justify-between font-mono text-[8px] uppercase tracking-[0.1em]">
              <span className="text-ash/55">{row.label}</span>
              <span className="text-bone/65">
                {row.value}/{row.max}
              </span>
            </div>
            <ProgressBar value={row.value} max={row.max} className="mt-2" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReportsPage() {
  const navigate = useNavigate()
  const verdict = useCaseStore((state) => state.verdict)
  const detectiveName = useCaseStore((state) => state.detectiveName)
  const startedAt = useCaseStore((state) => state.startedAt)
  const reviewed = useCaseStore((state) => state.reviewedEvidence)
  const viewedSuspects = useCaseStore((state) => state.viewedSuspects)
  const boardEdges = useCaseStore((state) => state.boardEdges)
  const expandedEvents = useCaseStore((state) => state.expandedEvents)
  const savedEvidence = useCaseStore((state) => state.savedEvidence)
  const flaggedEvidence = useCaseStore((state) => state.flaggedEvidence)
  const notes = useCaseStore((state) => state.notes)
  const resetCase = useCaseStore((state) => state.resetCase)
  const reconstructionScore = useCaseStore((state) => state.reconstructionScore)
  const pushToast = useUiStore((state) => state.pushToast)
  const [resetOpen, setResetOpen] = useState(false)

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

  if (!verdict) return <NoReport />

  const { answers, score, explanationAnalysis, outcome, submittedAt } = verdict
  const outcomeLabel = OUTCOME_LABEL[outcome]
  const duration = durationLabel(startedAt, submittedAt)
  const progress = caseProgress({
    reviewedEvidence: reviewed,
    viewedSuspects,
    boardEdges,
    expandedEvents,
    verdict,
    reconstructionScore,
  })

  const culpritLabel =
    CULPRIT_OPTIONS.find((option) => option.id === answers.culprit)?.label ?? 'No selection'
  const methodLabel =
    METHOD_OPTIONS.find((option) => option.id === answers.method)?.label ?? 'No selection'
  const motiveLabel =
    MOTIVE_OPTIONS.find((option) => option.id === answers.motive)?.label ?? 'No selection'

  const citedKey = answers.evidence.filter((id) => KEY_EVIDENCE_SET.has(id))
  const citedIncorrect = answers.evidence.filter((id) => !KEY_EVIDENCE_SET.has(id))
  const missedKey = SOLUTION.keyEvidence.filter((id) => !answers.evidence.includes(id))
  const hintsUsed = score.hintPenalty / 2
  const unlocked = achievements.filter((achievement) => achievement.unlocked)
  const annotated = Object.values(notes).filter((note) => note.trim().length > 0).length

  const reasoningRows = [
    { label: 'Culprit', earned: score.culprit.earned, max: score.culprit.max },
    { label: 'Method', earned: score.method.earned, max: score.method.max },
    { label: 'Motive', earned: score.motive.earned, max: score.motive.max },
    { label: 'Evidence cited', earned: score.evidence.earned, max: score.evidence.max },
    { label: 'Reasoning depth', earned: score.explanation.earned, max: score.explanation.max },
  ]

  const selections = [
    {
      label: 'Culprit',
      value: culpritLabel,
      correct: answers.culprit === SOLUTION.culpritId,
      expected: CULPRIT_OPTIONS.find((option) => option.id === SOLUTION.culpritId)?.label,
    },
    {
      label: 'Method',
      value: methodLabel,
      correct: answers.method === SOLUTION.methodId,
      expected: METHOD_OPTIONS.find((option) => option.id === SOLUTION.methodId)?.label,
    },
    {
      label: 'Motive',
      value: motiveLabel,
      correct: answers.motive === SOLUTION.motiveId,
      expected: MOTIVE_OPTIONS.find((option) => option.id === SOLUTION.motiveId)?.label,
    },
  ]

  const downloadReport = () => {
    const lines: string[] = [
      'BLACKBOX — INVESTIGATION NETWORK',
      'OFFICIAL CASE REPORT',
      '============================================================',
      '',
      `CASE:            ${CASE_FILE.code} — ${CASE_FILE.title}`,
      `CASE REFERENCE:  ${CASE_FILE.id.toUpperCase()}`,
      `CLASSIFICATION:  ${CASE_FILE.classification}`,
      `INCIDENT DATE:   ${CASE_FILE.date}`,
      `LOCATION:        ${CASE_FILE.location}`,
      `ISSUED TO:       Det. ${detectiveName}`,
      `REPORT FILED:    ${shortDate(submittedAt)}`,
      `INVESTIGATION:   ${duration}`,
      `OUTCOME:         ${outcomeLabel}`,
      `FINAL SCORE:     ${score.total} / 100 — ${scoreVerdictLabel(score.total)}`,
      '',
      '------------------------------------------------------------',
      'VERDICT',
      '------------------------------------------------------------',
      `Culprit:  ${culpritLabel} ${answers.culprit === SOLUTION.culpritId ? '[CORRECT]' : '[INCORRECT]'}`,
      `Method:   ${methodLabel} ${answers.method === SOLUTION.methodId ? '[CORRECT]' : '[INCORRECT]'}`,
      `Motive:   ${motiveLabel} ${answers.motive === SOLUTION.motiveId ? '[CORRECT]' : '[INCORRECT]'}`,
      '',
      '------------------------------------------------------------',
      'SCORE BREAKDOWN',
      '------------------------------------------------------------',
      ...reasoningRows.map(
        (row) => `${row.label.padEnd(20)} ${String(row.earned).padStart(2)} / ${row.max}`,
      ),
      `Hint penalty         -${score.hintPenalty} (${hintsUsed} hint${hintsUsed === 1 ? '' : 's'})`,
      `TOTAL                ${score.total} / 100`,
      '',
      '------------------------------------------------------------',
      'INVESTIGATOR REASONING',
      '------------------------------------------------------------',
      answers.explanation || '(No reasoning recorded)',
      '',
      `Words: ${explanationAnalysis.wordCount}`,
      `Concepts established: ${explanationAnalysis.matchedConcepts.join(', ') || 'none'}`,
      `Concepts not addressed: ${explanationAnalysis.missedConcepts.join(', ') || 'none'}`,
      '',
      '------------------------------------------------------------',
      'EVIDENCE CITED',
      '------------------------------------------------------------',
      `Key exhibits cited: ${citedKey.join(', ') || 'none'}`,
      `Missed key exhibits: ${missedKey.join(', ') || 'none'}`,
      `Cited but not decisive: ${citedIncorrect.join(', ') || 'none'}`,
      '',
      '------------------------------------------------------------',
      'INVESTIGATION ACTIVITY',
      '------------------------------------------------------------',
      `Exhibits reviewed:   ${reviewed.length} / ${EVIDENCE.length}`,
      `Dossiers read:       ${viewedSuspects.length} / ${SUSPECTS.length}`,
      `Timeline expanded:   ${Math.min(expandedEvents.length, TIMELINE.length)} / ${TIMELINE.length}`,
      `Board connections:   ${boardEdges.length}`,
      `Reconstruction:      ${reconstructionScore === null ? 'not validated' : `${reconstructionScore}% accuracy`}`,
      `Exhibits saved:      ${savedEvidence.length}`,
      `Exhibits flagged:    ${flaggedEvidence.length}`,
      `Notes written:       ${annotated}`,
      `Hints used:          ${hintsUsed} / 3`,
      `File completion:     ${progress}%`,
      `Decorations:         ${unlocked.length} / ${achievements.length}`,
      '',
      '------------------------------------------------------------',
      'SEALED SOLUTION — DISCLOSED AFTER FILING',
      '------------------------------------------------------------',
      SOLUTION.headline,
      '',
      ...SOLUTION.summary.map((entry) => `${entry.label.toUpperCase()}: ${entry.value}`),
      '',
      ...SOLUTION.narrative.flatMap((paragraph) => [paragraph, '']),
      'SEQUENCE',
      ...SOLUTION.sequence.map((step) => `${step.time}  ${step.text}`),
      '',
      SOLUTION.conclusion,
      '',
      '============================================================',
      `Filed by Det. ${detectiveName}`,
      `BLACKBOX archive · case ${CASE_FILE.id.toUpperCase()} · ${shortDate(submittedAt)}`,
      'This is a fictional investigation report.',
      '',
    ]

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `BLACKBOX_CASE-001_REPORT_${submittedAt.slice(0, 10)}.txt`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    pushToast('Report downloaded', 'A plain-text copy was saved to your device.', 'success')
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        className="no-print"
        eyebrow="Case 001 / issued report"
        title="Investigation Report"
        description="The official record of your investigation. Print it, export it, or keep it in the case archive. The sealed solution is disclosed below because a verdict has been filed."
        meta={
          <>
            <StatusBadge tone={outcome === 'SOLVED' ? 'green' : outcome === 'PARTIAL' ? 'amber' : 'red'} dot>
              {outcomeLabel}
            </StatusBadge>
            <StatusBadge tone="amber">Score {score.total}/100</StatusBadge>
            <StatusBadge tone="neutral">{scoreVerdictLabel(score.total)}</StatusBadge>
            <StatusBadge tone="neutral">Filed {shortDate(submittedAt)}</StatusBadge>
          </>
        }
        actions={
          <>
            <Button variant="primary" icon={<Printer size={13} />} onClick={() => window.print()}>
              Print report
            </Button>
            <Button variant="ghost" icon={<Download size={13} />} onClick={downloadReport}>
              Download .txt
            </Button>
            <Button
              variant="quiet"
              icon={<RotateCcw size={12} />}
              onClick={() => setResetOpen(true)}
            >
              Reset file
            </Button>
          </>
        }
      />

      <article className="print-sheet border border-white/[0.1] bg-ink-850">
        <header className="border-b border-white/10 px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="font-mono text-[8px] uppercase tracking-[0.28em] text-brass">
                BLACKBOX / Investigation network
              </div>
              <div className="mt-2 font-mono text-[7.5px] uppercase tracking-[0.16em] text-ash/50">
                Meridian Sound Labs · Building C · London E14
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-ash/55">
                Report reference
              </div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.06em] text-bone/70">
                BB-2026-001 / FINAL-IR
              </div>
              <div className="mt-2 inline-flex border border-blood/40 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-[#D97878]">
                {CASE_FILE.classification}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-ash/50">
                {CASE_FILE.code} / official report
              </div>
              <h1 className="mt-2 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-none">
                The Silent Frequency
              </h1>
              <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-ash">
                {CASE_FILE.synopsis}
              </p>
            </div>
            <div className="shrink-0 border border-white/[0.1] px-4 py-3">
              <div className="font-mono text-[7px] uppercase tracking-[0.14em] text-ash/45">
                Final score
              </div>
              <div className="mt-0.5 flex items-baseline gap-2">
                <span className="font-serif text-4xl leading-none text-brass print-accent">
                  {score.total}
                </span>
                <span className="font-mono text-[9px] text-ash/50">/ 100</span>
              </div>
              <div className="mt-1 font-mono text-[7.5px] uppercase tracking-[0.12em] text-ash/50">
                {scoreVerdictLabel(score.total)}
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-px border-b border-white/10 bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Issued to', `Det. ${detectiveName}`],
            ['Filed', shortDate(submittedAt)],
            ['Investigation', duration],
            ['Outcome', outcomeLabel],
          ].map(([label, value]) => (
            <div key={label} className="bg-ink-850 px-5 py-3.5">
              <div className="font-mono text-[7px] uppercase tracking-[0.14em] text-ash/40">
                {label}
              </div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.04em] text-bone/70">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8 px-5 py-7 sm:px-8">
          <section className="grid gap-6 lg:grid-cols-[1fr_200px]">
            <div>
              <div className="label text-brass">Verdict</div>
              <div className="mt-3 divide-y divide-white/[0.07] border-y border-white/[0.07]">
                {selections.map((selection) => (
                  <div key={selection.label} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <div className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-ash/40">
                        {selection.label}
                      </div>
                      <div className="mt-0.5 font-serif text-lg leading-tight">{selection.value}</div>
                      {!selection.correct && (
                        <div className="mt-0.5 text-[10.5px] text-ash/50">
                          File supports: <span className="text-brass">{selection.expected}</span>
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        'mt-1 flex shrink-0 items-center gap-1 border px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em]',
                        selection.correct
                          ? 'border-[#5F7D68]/50 text-[#9DB8A4]'
                          : 'border-blood/40 text-[#D97878]',
                      )}
                    >
                      {selection.correct ? <Check size={9} /> : <X size={9} />}
                      {selection.correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border border-white/[0.08] p-4">
              <ScoreRing value={score.total} size={132} label="Filed" />
              <div className="mt-3 text-center font-mono text-[8px] uppercase leading-relaxed tracking-[0.12em] text-ash/50">
                {outcomeLabel}
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <div className="label text-brass">Score breakdown</div>
              <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-ash/40">
                {score.total} / 100
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {reasoningRows.map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-baseline justify-between font-mono text-[8px] uppercase tracking-[0.1em]">
                    <span className="text-ash/60">{row.label}</span>
                    <span className="text-bone/65">
                      {row.earned} / {row.max}
                    </span>
                  </div>
                  <ProgressBar value={row.earned} max={row.max} color="#C69A55" />
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-white/[0.07] pt-3 font-mono text-[8px] uppercase tracking-[0.1em]">
                <span className="text-ash/60">
                  Hint penalty · {hintsUsed} of 3 hints used
                </span>
                <span className="text-[#D97878]">−{score.hintPenalty}</span>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <div className="label text-brass">Reconstruction cross-check</div>
              <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-ash/40">
                {reconstructionScore === null ? 'Not validated' : `${reconstructionScore}% accuracy`}
              </span>
            </div>
            <div className="mt-4 border border-white/[0.08] bg-ink-850 p-4">
              <p className="text-[11.5px] leading-relaxed text-ash">
                {reconstructionScore === null
                  ? 'The blackout sequence was never validated. A reconstruction would test whether your account of the eleven minutes holds together.'
                  : reconstructionScore === 100
                    ? 'Your reconstruction placed all eight beats in their true chronological position — the sequence corroborates the filed verdict.'
                    : 'Your reconstruction was partially correct. Review the discrepancy report and re-validate before the file is archived.'}
              </p>
              <ProgressBar
                value={reconstructionScore ?? 0}
                max={100}
                color={reconstructionScore === 100 ? '#5F7D68' : '#C69A55'}
                className="mt-3"
              />
              <Link
                to="/app/reconstruction"
                className="mt-3 inline-flex font-mono text-[8px] uppercase tracking-[0.14em] text-brass transition-colors hover:text-bone"
              >
                Open reconstruction room →
              </Link>
            </div>
          </section>

          <section>
            <div className="label text-brass">Investigator reasoning</div>
            <p className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed text-bone/75">
              {answers.explanation || 'No reasoning recorded.'}
            </p>
            <div className="mt-4 grid gap-3 border-t border-white/[0.07] pt-4 sm:grid-cols-2">
              <div>
                <div className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#9DB8A4]/80">
                  Concepts established
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {explanationAnalysis.matchedConcepts.length === 0 ? (
                    <span className="text-[11px] text-ash/40">None recognised.</span>
                  ) : (
                    explanationAnalysis.matchedConcepts.map((concept) => (
                      <span
                        key={concept}
                        className="border border-[#5F7D68]/40 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.08em] text-[#9DB8A4]"
                      >
                        {concept}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <div>
                <div className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-ash/40">
                  Concepts not addressed
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {explanationAnalysis.missedConcepts.length === 0 ? (
                    <span className="text-[11px] text-ash/40">None.</span>
                  ) : (
                    explanationAnalysis.missedConcepts.map((concept) => (
                      <span
                        key={concept}
                        className="border border-white/[0.08] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.08em] text-ash/50"
                      >
                        {concept}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="label text-brass">Evidence cited</div>
              <div className="mt-3 space-y-2 text-[11.5px] leading-relaxed">
                <div>
                  <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-[#9DB8A4]/80">
                    Key exhibits ·{' '}
                  </span>
                  <span className="text-bone/70">
                    {citedKey.length > 0 ? citedKey.join(', ') : 'none'}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-ash/45">
                    Missed ·{' '}
                  </span>
                  <span className="text-ash/70">{missedKey.length > 0 ? missedKey.join(', ') : 'none'}</span>
                </div>
                {citedIncorrect.length > 0 && (
                  <div>
                    <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-[#D97878]/80">
                      Not decisive ·{' '}
                    </span>
                    <span className="text-ash/70">{citedIncorrect.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="label text-brass">Investigation activity</div>
              <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2.5">
                {[
                  ['Exhibits', `${reviewed.length}/${EVIDENCE.length}`],
                  ['Dossiers', `${viewedSuspects.length}/${SUSPECTS.length}`],
                  ['Timeline', `${Math.min(expandedEvents.length, TIMELINE.length)}/${TIMELINE.length}`],
                  ['Connections', `${boardEdges.length}`],
                  ['Saved', `${savedEvidence.length}`],
                  ['Flagged', `${flaggedEvidence.length}`],
                  ['Notes', `${annotated}`],
                  ['Completion', `${progress}%`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-ash/40">
                      {label}
                    </div>
                    <div className="mt-0.5 font-mono text-[9px] text-bone/65">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={12} className="text-brass" />
                <span className="label text-brass">Decorations</span>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-ash/40">
                {unlocked.length}/{achievements.length}
              </span>
            </div>
            <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={cn(
                    'flex items-center gap-2 border px-2.5 py-1.5',
                    achievement.unlocked ? 'border-brass/25' : 'border-white/[0.07] opacity-55',
                  )}
                >
                  {achievement.unlocked ? (
                    <Check size={10} className="shrink-0 text-brass" />
                  ) : (
                    <Lock size={9} className="shrink-0 text-ash/40" />
                  )}
                  <span
                    className={cn(
                      'font-mono text-[7.5px] uppercase tracking-[0.08em]',
                      achievement.unlocked ? 'text-bone/70' : 'text-ash/40',
                    )}
                  >
                    {achievement.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-white/[0.08] pt-6">
            <div className="flex items-center gap-2">
              <Lock size={12} className="text-brass" />
              <span className="label text-brass">Appendix A · sealed solution disclosed</span>
            </div>

            <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight">
              {SOLUTION.headline}
            </h2>

            <div className="mt-4 grid gap-px border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2">
              {SOLUTION.summary.map((entry) => (
                <div key={entry.label} className="bg-ink-850 px-4 py-3">
                  <div className="font-mono text-[7px] uppercase tracking-[0.14em] text-ash/40">
                    {entry.label}
                  </div>
                  <div className="mt-1 text-[11.5px] leading-relaxed text-bone/75">{entry.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {SOLUTION.narrative.map((paragraph, index) => (
                <p key={index} className="text-[12.5px] leading-relaxed text-bone/70">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-6">
              <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-brass/70">
                The sequence
              </div>
              <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
                {SOLUTION.sequence.map((step) => (
                  <div
                    key={step.time}
                    className="flex gap-3 border-b border-white/[0.05] py-1.5 last:border-0"
                  >
                    <span className="w-12 shrink-0 font-mono text-[8.5px] text-brass/70">
                      {step.time}
                    </span>
                    <span className="text-[10.5px] leading-relaxed text-ash/70">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 border-l-2 border-brass/50 pl-4 font-serif text-[15px] italic leading-relaxed text-brass/85">
              {SOLUTION.conclusion}
            </p>
          </section>
        </div>

        <footer className="border-t border-white/10 px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="font-serif text-2xl italic text-bone/80">Det. {detectiveName}</div>
              <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.16em] text-ash/40">
                Filed by · {initials(detectiveName)} · lead investigator
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="flex items-center gap-2 font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#9DB8A4]/70 sm:justify-end">
                <ShieldCheck size={11} />
                Chain of custody verified
              </div>
              <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.14em] text-ash/35">
                BLACKBOX archive · {CASE_FILE.id.toUpperCase()} · {shortDate(submittedAt)}
              </div>
            </div>
          </div>
          <div className="mt-4 border-t border-white/[0.06] pt-3 font-mono text-[7px] uppercase leading-relaxed tracking-[0.12em] text-ash/30">
            This report is a work of fiction. Meridian Sound Labs, BLACKBOX and all named persons are
            invented.
          </div>
        </footer>
      </article>

      <div className="no-print flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash/35">
          Report reference BB-2026-001 / FINAL-IR
        </span>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" icon={<Printer size={12} />} onClick={() => window.print()}>
            Print
          </Button>
          <Button variant="ghost" size="sm" icon={<Download size={12} />} onClick={downloadReport}>
            Download
          </Button>
          <Link to="/app/verdict" className="btn btn-ghost btn-sm">
            View verdict
          </Link>
        </div>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset the entire investigation?"
        eyebrow="Destructive action"
        maxWidth="max-w-lg"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-blood" />
          <p className="text-sm leading-relaxed text-ash">
            This permanently clears your verdict, evidence notes, review flags, saved exhibits, hint
            usage, board connections and report from this browser. The case returns to its sealed
            state. This cannot be undone.
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setResetOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setResetOpen(false)
              resetCase()
              pushToast('Investigation reset', 'Case 001 has been restored to its sealed state.', 'warning')
              navigate('/app')
            }}
          >
            Reset everything
          </Button>
        </div>
      </Modal>
    </div>
  )
}
