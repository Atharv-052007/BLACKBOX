import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Scale, ShieldQuestion } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/components/ui/Badges'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Portrait } from '@/components/ui/Portrait'
import { RiskBar } from '@/components/ui/Progress'
import { SUSPECTS } from '@/data/suspects'
import { useCaseStore } from '@/store/useCaseStore'
import { cn } from '@/utils/cn'

export function SuspectsPage() {
  const [compareOpen, setCompareOpen] = useState(false)
  const viewed = useCaseStore((state) => state.viewedSuspects)

  const alibiTone = (status: string): 'green' | 'red' | 'amber' =>
    status === 'CORROBORATED' ? 'green' : status === 'CONTESTED' ? 'red' : 'amber'

  const compareRows = useMemo(
    () =>
      SUSPECTS.map((suspect) => ({
        suspect,
        access: suspect.risk.find((risk) => risk.label === 'ACCESS')?.value ?? 0,
        opportunity: suspect.risk.find((risk) => risk.label === 'OPPORTUNITY')?.value ?? 0,
      })),
    [],
  )

  return (
    <div className="space-y-7 pb-6">
      <PageHeader
        eyebrow="Persons of interest / 04"
        title="Suspects"
        description="Four people held authorised access to the restricted wing. Read the interviews against the exhibits. Suspicion is not evidence; an alibi is not innocence."
        meta={
          <>
            <StatusBadge tone="red">04 persons of interest</StatusBadge>
            <StatusBadge tone="green">{viewed.length} dossiers read</StatusBadge>
            <StatusBadge tone="amber">01 alibi contested</StatusBadge>
          </>
        }
        actions={
          <Button variant="brass" icon={<Scale size={13} />} onClick={() => setCompareOpen(true)}>
            Compare alibis
          </Button>
        }
      />

      <div className="flex items-start gap-3 border border-white/[0.08] bg-ink-850/60 px-4 py-3">
        <ShieldQuestion size={14} className="mt-0.5 shrink-0 text-brass" />
        <p className="text-xs leading-relaxed text-ash">
          <span className="text-bone/75">Investigative caution:</span> several details in this file
          are designed to look incriminating. Only a chain of corroborated evidence should carry a
          verdict.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {SUSPECTS.map((suspect) => {
          const isViewed = viewed.includes(suspect.id)
          return (
            <Link
              key={suspect.id}
              to={`/app/suspects/${suspect.id}`}
              className="group grid grid-cols-[124px_1fr] border border-white/[0.09] bg-ink-850 transition-all duration-300 hover:border-white/20 hover:bg-ink-800 sm:grid-cols-[190px_1fr]"
            >
              <div className="relative border-r border-white/[0.07]">
                <Portrait
                  variant={suspect.portrait}
                  code={suspect.code}
                  className="h-full min-h-[240px] w-full"
                />
                <div className="absolute left-2.5 top-2.5 flex flex-col gap-1">
                  <span className="bg-ink-950/80 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em] text-bone/70 backdrop-blur">
                    {suspect.code}
                  </span>
                  {isViewed && (
                    <span className="bg-ink-950/80 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-[#9DB8A4] backdrop-blur">
                      Read
                    </span>
                  )}
                </div>
              </div>

              <div className="flex min-w-0 flex-col p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-[#D97878]">
                    {suspect.status}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="shrink-0 text-ash/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                  />
                </div>

                <h2 className="mt-1.5 font-serif text-[clamp(1.4rem,2.4vw,1.9rem)] leading-tight">
                  {suspect.name}
                </h2>
                <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.08em] text-ash/60">
                  {suspect.age} · {suspect.occupation}
                </div>

                <p className="mt-3 line-clamp-2 text-[11.5px] leading-relaxed text-ash">
                  {suspect.relationship}
                </p>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-ash/45">
                      Alibi
                    </span>
                    <span
                      className={cn(
                        'font-mono text-[7px] uppercase tracking-[0.1em]',
                        suspect.alibiStatus === 'CORROBORATED'
                          ? 'text-[#9DB8A4]'
                          : suspect.alibiStatus === 'CONTESTED'
                            ? 'text-[#D97878]'
                            : 'text-brass',
                      )}
                    >
                      {suspect.alibiStatus}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-[10.5px] leading-relaxed text-ash/60">{suspect.alibi}</p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-3">
                  <RiskBar label="Access" value={suspect.risk.find((risk) => risk.label === 'ACCESS')?.value ?? 0} />
                  <RiskBar
                    label="Opportunity"
                    value={suspect.risk.find((risk) => risk.label === 'OPPORTUNITY')?.value ?? 0}
                  />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 border border-white/[0.08] bg-ink-850/50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="label text-brass">Next step</div>
          <p className="mt-1 text-xs leading-relaxed text-ash">
            Compare what each suspect claims against the access log and the controller audit trail.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/app/evidence/e-03" className="btn btn-ghost btn-sm">
            Access log
          </Link>
          <Link to="/app/board" className="btn btn-primary btn-sm">
            Open board
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <Modal
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        title="Alibi comparison"
        eyebrow="Cross-reference / four accounts"
        maxWidth="max-w-5xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.1]">
                {['Suspect', 'Status', 'Alibi', 'Alibi status', 'Motive', 'Access', 'Evidence'].map((header) => (
                  <th
                    key={header}
                    className="px-3 py-2.5 font-mono text-[8px] font-normal uppercase tracking-[0.14em] text-ash/50"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map(({ suspect, access }) => (
                <tr key={suspect.id} className="border-b border-white/[0.06] last:border-0">
                  <td className="px-3 py-3">
                    <Link
                      to={`/app/suspects/${suspect.id}`}
                      onClick={() => setCompareOpen(false)}
                      className="font-serif text-lg hover:text-brass"
                    >
                      {suspect.name}
                    </Link>
                    <div className="font-mono text-[7px] uppercase tracking-[0.1em] text-ash/40">
                      {suspect.code}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge tone={suspect.status === 'WITNESS' ? 'neutral' : 'red'} className="px-1.5 py-0.5 text-[7px]">
                      {suspect.status}
                    </StatusBadge>
                  </td>
                  <td className="max-w-[240px] px-3 py-3 text-[11px] leading-relaxed text-ash">
                    {suspect.alibi}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge tone={alibiTone(suspect.alibiStatus)} className="px-1.5 py-0.5 text-[7px]">
                      {suspect.alibiStatus}
                    </StatusBadge>
                  </td>
                  <td className="max-w-[220px] px-3 py-3 text-[11px] leading-relaxed text-ash">
                    {suspect.motive}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-[3px] w-14 bg-white/10">
                        <div className="h-full bg-brass" style={{ width: `${access}%` }} />
                      </div>
                      <span className="font-mono text-[8px] text-ash/50">{access}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono text-[9px] text-ash/60">
                    {suspect.evidence.length} linked
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex items-start gap-3 border-t border-white/[0.08] pt-4">
          <Scale size={14} className="mt-0.5 shrink-0 text-brass" />
          <p className="text-xs leading-relaxed text-ash">
            A corroborated alibi requires independent records, not a character reference. A contested
            alibi is not proof of guilt — it is an invitation to read the source documents.
          </p>
        </div>
      </Modal>
    </div>
  )
}
