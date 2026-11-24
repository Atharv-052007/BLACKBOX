import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCheck,
  Flag,
  MapPin,
  Network,
  NotebookPen,
  ShieldCheck,
} from 'lucide-react'
import { EVIDENCE, EVIDENCE_BY_ID } from '@/data/evidence'
import { SUSPECTS_BY_ID } from '@/data/suspects'
import { useCaseStore } from '@/store/useCaseStore'
import { useUiStore } from '@/store/useUiStore'
import { EvidenceArtifact } from '@/components/evidence/EvidenceArtifact'
import { EvidenceCard } from '@/components/evidence/EvidenceCard'
import { Portrait } from '@/components/ui/Portrait'
import { CategoryBadge, StatusBadge } from '@/components/ui/Badges'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { CATEGORY_META } from '@/utils/format'
import { cn } from '@/utils/cn'

export function EvidenceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const item = id ? EVIDENCE_BY_ID[id] : undefined
  const notes = useCaseStore((state) => state.notes)
  const reviewed = useCaseStore((state) => state.reviewedEvidence)
  const flagged = useCaseStore((state) => state.flaggedEvidence)
  const saved = useCaseStore((state) => state.savedEvidence)
  const reviewEvidence = useCaseStore((state) => state.reviewEvidence)
  const unreviewEvidence = useCaseStore((state) => state.unreviewEvidence)
  const toggleFlag = useCaseStore((state) => state.toggleFlag)
  const toggleSave = useCaseStore((state) => state.toggleSave)
  const setNote = useCaseStore((state) => state.setNote)
  const boardNodes = useCaseStore((state) => state.boardNodes)
  const addEvidenceToBoard = useCaseStore((state) => state.addEvidenceToBoard)
  const pushToast = useUiStore((state) => state.pushToast)

  const [note, setNoteValue] = useState(item ? notes[item.id] ?? '' : '')

  useEffect(() => {
    setNoteValue(item ? notes[item.id] ?? '' : '')
    // notes intentionally omitted: only rehydrate when the exhibit changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id])

  useEffect(() => {
    if (!item) return
    if (!useCaseStore.getState().reviewedEvidence.includes(item.id)) {
      reviewEvidence(item.id)
      pushToast('Exhibit logged as reviewed', `${item.code} — ${item.title}`, 'success')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id])

  if (!item) {
    return (
      <EmptyState
        icon={<ShieldCheck size={28} />}
        title="Exhibit not found"
        description="This evidence ID does not exist in the active case file. It may have been sealed or removed from the archive."
        action={
          <Link to="/app/evidence" className="btn btn-ghost">
            Return to evidence room
          </Link>
        }
      />
    )
  }

  const isReviewed = reviewed.includes(item.id)
  const isFlagged = flagged.includes(item.id)
  const isSaved = saved.includes(item.id)
  const meta = CATEGORY_META[item.category]
  const index = EVIDENCE.findIndex((entry) => entry.id === item.id)
  const previous = EVIDENCE[index - 1]
  const next = EVIDENCE[index + 1]
  const related = item.relatedEvidence.map((entry) => EVIDENCE_BY_ID[entry]).filter(Boolean)
  const suspects = item.suspects.map((entry) => SUSPECTS_BY_ID[entry]).filter(Boolean)
  const onBoard = boardNodes.some((node) => node.id === `evidence-${item.id}`)

  const handlePin = () => {
    if (onBoard) {
      pushToast('Already pinned', `${item.code} is on the investigation board.`, 'warning')
      return
    }
    const count = boardNodes.length
    addEvidenceToBoard(item.id, {
      x: 40 + (count % 4) * 280,
      y: 300 + Math.floor(count / 4) * 160,
    })
    pushToast('Pinned to investigation board', `${item.code} added as a new node.`, 'success')
  }

  const handleNote = (value: string) => {
    setNoteValue(value)
    setNote(item.id, value)
  }

  return (
    <div className="space-y-7 pb-8">
      <div>
        <Link
          to="/app/evidence"
          className="inline-flex items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.16em] text-ash transition-colors hover:text-bone"
        >
          <ArrowLeft size={12} />
          Evidence room
        </Link>
      </div>

      <header className="border-b border-white/[0.08] pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-brass">{item.code}</span>
          <span className="h-3 w-px bg-white/15" />
          <CategoryBadge category={item.category} />
          <StatusBadge tone={isReviewed ? 'green' : 'neutral'} dot>
            {isReviewed ? 'Reviewed' : 'Unreviewed'}
          </StatusBadge>
          {isFlagged && <StatusBadge tone="red">Suspicious</StatusBadge>}
          {isSaved && <StatusBadge tone="amber">Saved</StatusBadge>}
        </div>

        <div className="mt-4 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <h1 className="display text-[clamp(2.2rem,4.5vw,3.6rem)]">{item.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ash">{item.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={isReviewed ? 'ghost' : 'primary'}
              size="sm"
              icon={isReviewed ? <CheckCheck size={13} /> : <Check size={13} />}
              onClick={() => {
                if (isReviewed) {
                  unreviewEvidence(item.id)
                  pushToast('Review status cleared', `${item.code} returned to the unexamined queue.`)
                } else {
                  reviewEvidence(item.id)
                  pushToast('Exhibit marked reviewed', `${item.code} logged in the case file.`, 'success')
                }
              }}
            >
              {isReviewed ? 'Reviewed' : 'Mark reviewed'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<Flag size={12} />}
              className={cn(isFlagged && 'border-blood/50 text-[#D97878]')}
              onClick={() => {
                toggleFlag(item.id)
                pushToast(isFlagged ? 'Flag removed' : 'Marked as suspicious', item.code, isFlagged ? 'default' : 'danger')
              }}
            >
              {isFlagged ? 'Flagged' : 'Flag'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={isSaved ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
              className={cn(isSaved && 'border-brass/50 text-brass')}
              onClick={() => {
                toggleSave(item.id)
                pushToast(isSaved ? 'Removed from saved' : 'Saved for later', item.code, 'default')
              }}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="brass" size="sm" icon={<Network size={12} />} onClick={handlePin}>
              {onBoard ? 'On board' : 'Pin to board'}
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-x-6 gap-y-3 border-t border-white/[0.07] pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Discovered', item.discoveredAt],
            ['Location', item.location],
            ['Chain of custody', item.custody],
            ['Category', meta.label],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-ash/40">{label}</div>
              <div className="mt-1 font-mono text-[9px] leading-relaxed tracking-[0.03em] text-bone/65">
                {value}
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          <section className="border border-white/[0.09] bg-ink-850">
            <EvidenceArtifact item={item} />
          </section>

          <section className="border border-white/[0.09] bg-ink-850 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <NotebookPen size={14} className="text-brass" />
              <span className="label text-brass">Detailed examination</span>
            </div>
            <div className="prose-detective mt-4 space-y-3">
              {item.examination.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/[0.07] pt-4">
              {item.tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-6">
          <section className="relative border border-brass/25 bg-brass/[0.035] p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-brass" />
              <span className="label text-brass">Investigative significance</span>
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-bone/80">{item.significance}</p>
          </section>

          <section className="border border-white/[0.09] bg-ink-850 p-5">
            <div className="flex items-center justify-between">
              <span className="label text-brass">Personal notes</span>
              <span className="flex items-center gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#9DB8A4]">
                <span className="h-[4px] w-[4px] rounded-full bg-[#5F7D68]" />
                Autosaved
              </span>
            </div>
            <textarea
              value={note}
              onChange={(event) => handleNote(event.target.value)}
              placeholder="Record what you notice. Timestamps, contradictions, names…"
              rows={6}
              maxLength={2000}
              className="input mt-3 resize-none text-[13px] leading-relaxed"
            />
            <div className="mt-2 flex items-center justify-between font-mono text-[7.5px] uppercase tracking-[0.1em] text-ash/35">
              <span>Stored locally in this browser</span>
              <span>{note.length}/2000</span>
            </div>
          </section>

          <section className="border border-white/[0.09] bg-ink-850">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3">
              <span className="label text-brass">Associated suspects</span>
              <span className="font-mono text-[8px] text-ash/40">{suspects.length}</span>
            </div>
            <div>
              {suspects.map((suspect) => (
                <Link
                  key={suspect.id}
                  to={`/app/suspects/${suspect.id}`}
                  className="group flex items-center gap-3 border-b border-white/[0.05] px-4 py-3 last:border-0 hover:bg-white/[0.02]"
                >
                  <Portrait variant={suspect.portrait} code={suspect.code} compact className="h-12 w-10 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-serif text-base">{suspect.name}</div>
                    <div className="truncate font-mono text-[7.5px] uppercase tracking-[0.08em] text-ash/55">
                      {suspect.occupation}
                    </div>
                  </div>
                  <ArrowRight size={12} className="shrink-0 text-ash/30 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <span className="label text-brass">Related exhibits</span>
                <span className="font-mono text-[8px] text-ash/40">{related.length}</span>
              </div>
              <div className="grid gap-2">
                {related.map((entry) => (
                  <EvidenceCard key={entry.id} item={entry} compact />
                ))}
              </div>
            </section>
          )}

          <section className="border border-white/[0.09] bg-ink-850 p-4">
            <div className="flex items-start gap-3">
              <MapPin size={13} className="mt-0.5 shrink-0 text-ash/50" />
              <div>
                <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-ash/45">
                  Recovery location
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ash">{item.location}</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <nav className="flex flex-col gap-2 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
        {previous ? (
          <Link
            to={`/app/evidence/${previous.id}`}
            className="group flex items-center gap-3 border border-white/[0.08] px-4 py-3 transition-colors hover:border-white/20"
          >
            <ArrowLeft size={13} className="text-ash/50 transition-transform group-hover:-translate-x-0.5" />
            <span>
              <span className="block font-mono text-[7.5px] uppercase tracking-[0.12em] text-ash/40">
                Previous · {previous.code}
              </span>
              <span className="mt-0.5 block font-serif text-base">{previous.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/app/evidence/${next.id}`}
            className="group flex items-center justify-end gap-3 border border-white/[0.08] px-4 py-3 text-right transition-colors hover:border-white/20 sm:ml-auto"
          >
            <span>
              <span className="block font-mono text-[7.5px] uppercase tracking-[0.12em] text-ash/40">
                Next · {next.code}
              </span>
              <span className="mt-0.5 block font-serif text-base">{next.title}</span>
            </span>
            <ArrowRight size={13} className="text-ash/50 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : null}
      </nav>
    </div>
  )
}
