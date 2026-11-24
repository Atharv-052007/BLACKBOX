import { Link } from 'react-router-dom'
import { ArrowUpRight, Bookmark, Check, Flag } from 'lucide-react'
import type { EvidenceItem } from '@/types'
import { CATEGORY_META } from '@/utils/format'
import { cn } from '@/utils/cn'
import { useCaseStore } from '@/store/useCaseStore'

export function EvidenceCard({
  item,
  compact = false,
  className,
}: {
  item: EvidenceItem
  compact?: boolean
  className?: string
}) {
  const reviewed = useCaseStore((state) => state.reviewedEvidence.includes(item.id))
  const flagged = useCaseStore((state) => state.flaggedEvidence.includes(item.id))
  const saved = useCaseStore((state) => state.savedEvidence.includes(item.id))
  const meta = CATEGORY_META[item.category]

  return (
    <Link
      to={`/app/evidence/${item.id}`}
      className={cn(
        'group relative flex flex-col border border-white/[0.09] bg-ink-850 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-ink-800',
        compact && 'p-4',
        className,
      )}
    >
      <span
        className="absolute left-0 right-0 top-0 h-[2px] opacity-70 transition-opacity group-hover:opacity-100"
        style={{ backgroundColor: meta.color }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[9px] tracking-[0.14em] text-bone/45">{item.code}</span>
          <span className="h-3 w-px bg-white/10" />
          <span className="font-mono text-[8px] uppercase tracking-label" style={{ color: meta.color }}>
            {meta.short}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {saved && <Bookmark size={11} className="text-brass" />}
          {flagged && <Flag size={11} className="text-blood" />}
          {reviewed && <Check size={12} className="text-[#9DB8A4]" />}
          <ArrowUpRight
            size={13}
            className="text-ash/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
          />
        </div>
      </div>

      <h3
        className={cn(
          'mt-4 font-serif leading-[1.08] text-bone',
          compact ? 'text-lg' : 'text-[1.45rem]',
        )}
      >
        {item.title}
      </h3>

      {!compact && (
        <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-ash">{item.summary}</p>
      )}

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-ash/60">
          {item.discoveredAt.split('·')[0].trim()}
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-ash/40">
          {item.tags[0]}
        </span>
      </div>
    </Link>
  )
}
