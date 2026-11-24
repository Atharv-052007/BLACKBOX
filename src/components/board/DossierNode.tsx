import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Camera, FileText, Fingerprint, Mail, ScrollText, User, Volume2 } from 'lucide-react'
import type { DossierNode as DossierNodeType } from '@/store/useCaseStore'
import { CATEGORY_META } from '@/utils/format'
import { cn } from '@/utils/cn'

const ICONS: Record<string, typeof User> = {
  suspect: User,
  physical: Fingerprint,
  digital: Mail,
  document: FileText,
  cctv: Camera,
  audio: Volume2,
  witness: ScrollText,
}

export function DossierNode({ data, selected }: NodeProps<DossierNodeType>) {
  const meta = CATEGORY_META[data.category as keyof typeof CATEGORY_META] ?? CATEGORY_META.digital
  const Icon = ICONS[data.category] ?? FileText

  return (
    <div
      className={cn(
        'group relative w-[236px] border bg-ink-850 transition-shadow',
        selected ? 'shadow-[0_0_0_1px_rgba(242,240,234,0.25)]' : 'hover:border-white/25',
      )}
      style={{
        borderColor: selected ? meta.color : 'rgba(255,255,255,0.12)',
        boxShadow: selected ? `0 0 28px -8px ${meta.color}66` : undefined,
      }}
    >
      <span className="absolute inset-x-0 top-0 h-[2px]" style={{ backgroundColor: meta.color }} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <div className="px-3.5 pb-3 pt-3.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[8px] tracking-[0.12em]" style={{ color: meta.color }}>
            {data.code}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.12em] text-ash/50">
            <Icon size={9} />
            {meta.short}
          </span>
        </div>
        <div className="mt-2 font-serif text-[17px] leading-[1.12] text-bone">{data.title}</div>
        <div className="mt-1.5 truncate font-mono text-[7.5px] uppercase tracking-[0.08em] text-ash/55">
          {data.subtitle}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.06] px-3.5 py-1.5">
        <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-ash/35">
          {data.kind === 'suspect' ? 'Person of interest' : 'Linked exhibit'}
        </span>
        <span className="h-[4px] w-[4px]" style={{ backgroundColor: meta.color, opacity: 0.7 }} />
      </div>
    </div>
  )
}
