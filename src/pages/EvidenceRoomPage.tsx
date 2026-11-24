import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/components/ui/Badges'
import { EvidenceCard } from '@/components/evidence/EvidenceCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { EVIDENCE, EVIDENCE_CATEGORIES } from '@/data/evidence'
import { useCaseStore } from '@/store/useCaseStore'
import type { EvidenceCategory } from '@/types'
import { cn } from '@/utils/cn'

type StatusFilter = 'all' | 'unreviewed' | 'reviewed' | 'flagged' | 'saved'
type SortMode = 'file' | 'title' | 'category'

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unreviewed', label: 'Unexamined' },
  { id: 'reviewed', label: 'Reviewed' },
  { id: 'flagged', label: 'Flagged' },
  { id: 'saved', label: 'Saved' },
]

export function EvidenceRoomPage() {
  const [category, setCategory] = useState<'all' | EvidenceCategory>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<SortMode>('file')
  const [query, setQuery] = useState('')

  const reviewed = useCaseStore((state) => state.reviewedEvidence)
  const flagged = useCaseStore((state) => state.flaggedEvidence)
  const saved = useCaseStore((state) => state.savedEvidence)

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const result = EVIDENCE.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (status === 'unreviewed' && reviewed.includes(item.id)) return false
      if (status === 'reviewed' && !reviewed.includes(item.id)) return false
      if (status === 'flagged' && !flagged.includes(item.id)) return false
      if (status === 'saved' && !saved.includes(item.id)) return false
      if (normalized) {
        const haystack = `${item.title} ${item.summary} ${item.code} ${item.location} ${item.tags.join(' ')}`.toLowerCase()
        if (!haystack.includes(normalized)) return false
      }
      return true
    })

    return [...result].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      if (sort === 'category') return a.category.localeCompare(b.category) || a.code.localeCompare(b.code)
      return a.code.localeCompare(b.code)
    })
  }, [category, status, sort, query, reviewed, flagged, saved])

  const hasFilters = category !== 'all' || status !== 'all' || query.trim().length > 0

  const reset = () => {
    setCategory('all')
    setStatus('all')
    setQuery('')
  }

  return (
    <div className="space-y-7 pb-6">
      <PageHeader
        eyebrow="Forensic archive / Building C"
        title="Evidence Room"
        description="Fifteen exhibits recovered from Meridian Sound Labs. Every item is catalogued, timestamped and held under chain of custody. Examine the source, not the summary."
        meta={
          <>
            <StatusBadge tone="bone">{EVIDENCE.length} exhibits</StatusBadge>
            <StatusBadge tone="green">{reviewed.length} reviewed</StatusBadge>
            <StatusBadge tone="red">{flagged.length} flagged</StatusBadge>
            <StatusBadge tone="amber">{saved.length} saved</StatusBadge>
          </>
        }
      />

      <section className="border border-white/[0.09] bg-ink-850">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.07] px-4 py-3">
          <SlidersHorizontal size={13} className="mr-1 text-ash/50" />
          <div className="flex flex-wrap gap-1.5">
            {EVIDENCE_CATEGORIES.map((entry) => {
              const count =
                entry.id === 'all'
                  ? EVIDENCE.length
                  : EVIDENCE.filter((item) => item.category === entry.id).length
              return (
                <button
                  key={entry.id}
                  onClick={() => setCategory(entry.id as 'all' | EvidenceCategory)}
                  className={cn(
                    'border px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.12em] transition-colors',
                    category === entry.id
                      ? 'border-brass/50 bg-brass/[0.08] text-brass'
                      : 'border-white/[0.08] text-ash/60 hover:border-white/20 hover:text-bone',
                  )}
                >
                  {entry.label}
                  <span className="ml-1.5 text-[7px] opacity-50">{count}</span>
                </button>
              )
            })}
          </div>

          <div className="relative ml-auto min-w-[200px] flex-1 sm:max-w-[260px]">
            <Search size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ash/50" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search exhibits…"
              className="input input-mono h-9 py-2 pl-8 pr-8 text-[11px]"
              aria-label="Search exhibits"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ash/50 hover:text-bone"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-1">
            {STATUS_FILTERS.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setStatus(entry.id)}
                className={cn(
                  'px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] transition-colors',
                  status === entry.id ? 'text-bone' : 'text-ash/45 hover:text-bone/80',
                )}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash/40">
              Sort
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
              className="border border-white/[0.1] bg-ink-900 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-ash outline-none focus:border-brass/50"
              aria-label="Sort exhibits"
            >
              <option value="file">File order</option>
              <option value="title">Title A–Z</option>
              <option value="category">Category</option>
            </select>
            {hasFilters && (
              <button
                onClick={reset}
                className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.1em] text-ash/50 hover:text-bone"
              >
                <X size={10} />
                Reset
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-ash/50">
          {filtered.length} {filtered.length === 1 ? 'record' : 'records'} in view
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-ash/30">
          Click an exhibit to examine
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={28} />}
          title="No exhibits match this filter"
          description="The archive returned no records for the current combination. Clear the filters or search a different term."
          action={
            <Button variant="ghost" onClick={reset}>
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <EvidenceCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5 font-mono text-[8px] uppercase tracking-[0.12em] text-ash/35">
        <span>Chain of custody verified · all exhibits fictional</span>
        <span>Archive BB-2026-001 / 15 records</span>
      </div>
    </div>
  )
}
