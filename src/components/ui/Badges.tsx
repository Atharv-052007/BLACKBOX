import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { CATEGORY_META } from '@/utils/format'
import type { EvidenceCategory } from '@/types'

export function CategoryBadge({
  category,
  className,
  compact = false,
}: {
  category: EvidenceCategory | 'suspect'
  className?: string
  compact?: boolean
}) {
  const meta = CATEGORY_META[category]
  return (
    <span
      className={cn('inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-label', className)}
      style={{ color: meta.color }}
    >
      <span className="h-[5px] w-[5px]" style={{ backgroundColor: meta.color }} />
      {compact ? meta.short : meta.label}
    </span>
  )
}

type Tone = 'neutral' | 'red' | 'amber' | 'green' | 'bone' | 'steel'

const TONES: Record<Tone, string> = {
  neutral: 'border-white/10 text-ash bg-white/[0.02]',
  red: 'border-blood/45 text-[#D97878] bg-blood/[0.07]',
  amber: 'border-brass/40 text-brass bg-brass/[0.06]',
  green: 'border-[#5F7D68]/50 text-[#9DB8A4] bg-[#5F7D68]/[0.08]',
  bone: 'border-white/20 text-bone/85 bg-white/[0.03]',
  steel: 'border-steel/40 text-steel bg-steel/[0.06]',
}

export function StatusBadge({
  children,
  tone = 'neutral',
  dot = false,
  className,
}: {
  children: ReactNode
  tone?: Tone
  dot?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 border px-2 py-1 font-mono text-[8.5px] uppercase tracking-label',
        TONES[tone],
        className,
      )}
    >
      {dot && <span className="h-[4px] w-[4px] rounded-full bg-current" />}
      {children}
    </span>
  )
}

export function ClassificationMark({ label = 'RESTRICTED' }: { label?: string }) {
  return (
    <span className="stamp pointer-events-none select-none" aria-hidden="true">
      {label}
    </span>
  )
}
