import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Fingerprint,
  Quote,
  ShieldQuestion,
  TriangleAlert,
  Users,
} from 'lucide-react'
import { SUSPECTS, SUSPECTS_BY_ID } from '@/data/suspects'
import { EVIDENCE_BY_ID } from '@/data/evidence'
import { useCaseStore } from '@/store/useCaseStore'
import { useUiStore } from '@/store/useUiStore'
import { Portrait } from '@/components/ui/Portrait'
import { EvidenceCard } from '@/components/evidence/EvidenceCard'
import { StatusBadge } from '@/components/ui/Badges'
import { RiskBar } from '@/components/ui/Progress'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/utils/cn'

export function SuspectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const suspect = id ? SUSPECTS_BY_ID[id] : undefined
  const markViewed = useCaseStore((state) => state.markSuspectViewed)
  const pushToast = useUiStore((state) => state.pushToast)
  const viewed = useCaseStore((state) => state.viewedSuspects)

  useEffect(() => {
    if (!suspect) return
    if (!useCaseStore.getState().viewedSuspects.includes(suspect.id)) {
      markViewed(suspect.id)
      pushToast('Dossier opened', `${suspect.name} added to the interview log.`, 'success')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suspect?.id])

  if (!suspect) {
    return (
      <EmptyState
        icon={<Users size={28} />}
        title="Dossier not found"
        description="This person of interest is not in the active case file."
        action={
          <Link to="/app/suspects" className="btn btn-ghost">
            Return to suspects
          </Link>
        }
      />
    )
  }

  const evidence = suspect.evidence.map((entry) => EVIDENCE_BY_ID[entry]).filter(Boolean)
  const index = SUSPECTS.findIndex((entry) => entry.id === suspect.id)
  const next = SUSPECTS[(index + 1) % SUSPECTS.length]
  const isViewed = viewed.includes(suspect.id)
  const alibiTone =
    suspect.alibiStatus === 'CORROBORATED' ? 'green' : suspect.alibiStatus === 'CONTESTED' ? 'red' : 'amber'

  return (
    <div className="space-y-7 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/app/suspects"
          className="inline-flex items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.16em] text-ash transition-colors hover:text-bone"
        >
          <ArrowLeft size={12} />
          Suspect files
        </Link>
        <Link
          to={`/app/suspects/${next.id}`}
          className="group inline-flex items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.16em] text-ash/60 transition-colors hover:text-bone"
        >
          Next dossier · {next.name}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <header className="border-b border-white/[0.08] pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-brass">{suspect.code}</span>
          <span className="h-3 w-px bg-white/15" />
          <StatusBadge tone={suspect.status === 'WITNESS' ? 'neutral' : 'red'} dot>
            {suspect.status}
          </StatusBadge>
          <StatusBadge tone={alibiTone}>Alibi {suspect.alibiStatus}</StatusBadge>
          {isViewed && <StatusBadge tone="green">Dossier read</StatusBadge>}
        </div>
        <h1 className="display mt-4 text-[clamp(2.8rem,6vw,5rem)]">{suspect.name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.1em] text-ash">
          <span>{suspect.age} years old</span>
          <span className="h-3 w-px bg-white/10" />
          <span>{suspect.occupation}</span>
          <span className="h-3 w-px bg-white/10" />
          <span>{suspect.evidence.length} linked exhibits</span>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <aside className="space-y-4">
          <div className="border border-white/[0.09] bg-ink-850">
            <Portrait variant={suspect.portrait} code={suspect.code} className="aspect-[4/5] w-full" />
            <div className="border-t border-white/[0.08] px-4 py-3">
              <div className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-ash/45">
                Identification plate
              </div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.06em] text-bone/60">
                Meridian Sound Labs · Building C
              </div>
            </div>
          </div>

          <div className="border border-white/[0.09] bg-ink-850 p-4">
            <div className="label mb-3 text-brass">Risk assessment</div>
            <div className="space-y-3">
              {suspect.risk.map((risk) => (
                <RiskBar key={risk.label} label={risk.label} value={risk.value} />
              ))}
            </div>
          </div>

          <div className="border border-white/[0.09] bg-ink-850 p-4">
            <div className="label mb-3 text-brass">Known connections</div>
            <div className="space-y-3">
              {suspect.connections.map((connection) => (
                <div key={connection.name} className="border-l border-white/10 pl-3">
                  <div className="font-serif text-base leading-tight">{connection.name}</div>
                  <div className="mt-0.5 text-[10.5px] leading-relaxed text-ash/60">
                    {connection.relation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/[0.09] bg-ink-850 p-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={12} className="text-ash/50" />
              <span className="label text-brass">Interview status</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-ash">
              {suspect.interview.length} questions on record. Statement taken under caution.
            </p>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="border border-white/[0.09] bg-ink-850 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <ShieldQuestion size={14} className="text-brass" />
              <span className="label text-brass">Profile assessment</span>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-bone/80">{suspect.summary}</p>
          </section>

          {suspect.contradictions && suspect.contradictions.length > 0 ? (
            <section className="border border-blood/30 bg-blood/[0.035]">
              <div className="flex items-center gap-2 border-b border-blood/25 px-5 py-3.5">
                <TriangleAlert size={14} className="text-[#D97878]" />
                <span className="label text-[#D97878]">Consistency conflicts</span>
              </div>
              <ul className="divide-y divide-blood/15">
                {suspect.contradictions.map((entry, index) => {
                  const evidence = entry.evidenceId ? EVIDENCE_BY_ID[entry.evidenceId] : undefined
                  return (
                    <li key={`${entry.claim}-${index}`} className="space-y-1.5 px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[#D97878]">Cited claim</span>
                        {evidence ? (
                          <Link
                            to={`/app/evidence/${entry.evidenceId}`}
                            className="border border-blood/40 px-1.5 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#D97878] hover:text-bone"
                          >
                            {evidence.code} ↗
                          </Link>
                        ) : null}
                      </div>
                      <p className="font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.02em] text-bone/80">
                        {entry.claim}
                      </p>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-ash">{entry.note}</p>
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : (
            <section className="border border-white/[0.09] bg-ink-850 p-5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={13} className="text-brass" />
                <span className="label text-brass">Consistency</span>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-ash">
                No contradictions are tracked on this dossier. Compare the account with the controller audit
                trail and use the related exhibits below.
              </p>
            </section>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <section className="border border-white/[0.09] bg-ink-850 p-5">
              <div className="label mb-2 text-brass">Relationship to case</div>
              <p className="text-[13px] leading-relaxed text-bone/75">{suspect.relationship}</p>
            </section>
            <section className="border border-white/[0.09] bg-ink-850 p-5">
              <div className="label mb-2 text-brass">Possible motive</div>
              <p className="text-[13px] leading-relaxed text-bone/75">{suspect.motive}</p>
            </section>
            <section className="border border-white/[0.09] bg-ink-850 p-5 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="label text-brass">Stated alibi</div>
                <StatusBadge tone={alibiTone} className="px-1.5 py-0.5 text-[7px]">
                  {suspect.alibiStatus}
                </StatusBadge>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-bone/75">{suspect.alibi}</p>
            </section>
          </div>

          <section className="border border-white/[0.09] bg-ink-850">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Quote size={13} className="text-brass" />
                <span className="label text-brass">Interview transcript</span>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash/40">
                {suspect.interview.length} exchanges
              </span>
            </div>
            <div>
              {suspect.interview.map((entry, entryIndex) => (
                <div
                  key={entryIndex}
                  className="border-b border-white/[0.055] px-5 py-4 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-[8px] text-ash/35">
                      Q{String(entryIndex + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.04em] text-ash">
                          {entry.question}
                        </p>
                        {entry.flag === 'inconsistency' && (
                          <span className="flex items-center gap-1 border border-blood/40 bg-blood/[0.07] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-[#D97878]">
                            <AlertTriangle size={8} />
                            Inconsistency
                          </span>
                        )}
                        {entry.flag === 'notable' && (
                          <span className="border border-brass/30 bg-brass/[0.05] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-brass">
                            Notable
                          </span>
                        )}
                      </div>
                      <p
                        className={cn(
                          'mt-2 font-serif text-[17px] leading-[1.55]',
                          entry.flag === 'inconsistency' ? 'text-bone' : 'text-bone/75',
                        )}
                      >
                        “{entry.answer}”
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.08] bg-ink-950/40 px-5 py-2.5 font-mono text-[7.5px] uppercase tracking-[0.12em] text-ash/35">
              Transcript recorded under caution · Det. A. Morgan
            </div>
          </section>

          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="flex items-center gap-2">
              <Fingerprint size={14} className="text-brass" />
              <span className="label text-brass">Pressure points</span>
            </div>
            <div className="mt-3 space-y-2.5">
              {suspect.pressurePoints.map((point) => (
                <div key={point} className="flex items-start gap-3 border-l border-blood/30 pl-3">
                  <span className="mt-2 h-[4px] w-[4px] shrink-0 bg-blood" />
                  <p className="text-[12.5px] leading-relaxed text-ash">{point}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="label mb-1 text-brass">Associated evidence</div>
                <h2 className="font-serif text-2xl">Exhibits naming {suspect.name.split(' ')[0]}</h2>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash/40">
                {evidence.length} records
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {evidence.map((item) => (
                <EvidenceCard key={item.id} item={item} compact />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
