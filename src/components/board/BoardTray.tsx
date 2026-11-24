import { useMemo, useState } from 'react'
import { Check, Fingerprint, Plus, Search, Users, X } from 'lucide-react'
import { EVIDENCE } from '@/data/evidence'
import { SUSPECTS } from '@/data/suspects'
import { useCaseStore } from '@/store/useCaseStore'
import { CATEGORY_META } from '@/utils/format'
import { cn } from '@/utils/cn'

export const BOARD_DRAG_TYPE = 'application/x-blackbox-node'

interface TrayProps {
  onAddEvidence: (id: string) => void
  onAddSuspect: (id: string) => void
  onClose?: () => void
}

export function BoardTray({ onAddEvidence, onAddSuspect, onClose }: TrayProps) {
  const [tab, setTab] = useState<'evidence' | 'suspects'>('evidence')
  const [query, setQuery] = useState('')
  const nodes = useCaseStore((state) => state.boardNodes)

  const existing = useMemo(() => new Set(nodes.map((node) => node.id)), [nodes])

  const evidence = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return EVIDENCE.filter((item) =>
      normalized
        ? `${item.code} ${item.title} ${item.summary} ${item.tags.join(' ')}`
            .toLowerCase()
            .includes(normalized)
        : true,
    )
  }, [query])

  const suspects = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return SUSPECTS.filter((suspect) =>
      normalized
        ? `${suspect.code} ${suspect.name} ${suspect.occupation}`.toLowerCase().includes(normalized)
        : true,
    )
  }, [query])

  return (
    <div className="flex h-full w-full flex-col border border-white/[0.1] bg-ink-900/95 shadow-panel backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-3 py-2.5">
        <span className="label text-brass">Case tray</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-ash/40">
            Drag to canvas
          </span>
          {onClose && (
            <button onClick={onClose} className="text-ash/50 hover:text-bone" aria-label="Close tray">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 border-b border-white/[0.08]">
        <button
          onClick={() => setTab('evidence')}
          className={cn(
            'flex items-center justify-center gap-2 py-2.5 font-mono text-[8px] uppercase tracking-[0.12em] transition-colors',
            tab === 'evidence' ? 'bg-white/[0.04] text-bone' : 'text-ash/50 hover:text-bone',
          )}
        >
          <Fingerprint size={11} />
          Evidence
        </button>
        <button
          onClick={() => setTab('suspects')}
          className={cn(
            'flex items-center justify-center gap-2 border-l border-white/[0.07] py-2.5 font-mono text-[8px] uppercase tracking-[0.12em] transition-colors',
            tab === 'suspects' ? 'bg-white/[0.04] text-bone' : 'text-ash/50 hover:text-bone',
          )}
        >
          <Users size={11} />
          Suspects
        </button>
      </div>

      <div className="border-b border-white/[0.07] p-2.5">
        <div className="relative">
          <Search size={11} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ash/40" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter tray…"
            className="input input-mono h-8 py-1.5 pl-7 pr-2 text-[10px]"
            aria-label="Filter board tray"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {tab === 'evidence'
          ? evidence.map((item) => {
              const meta = CATEGORY_META[item.category]
              const onBoard = existing.has(`evidence-${item.id}`)
              return (
                <div
                  key={item.id}
                  draggable={!onBoard}
                  onDragStart={(event) => {
                    if (onBoard) return
                    event.dataTransfer.setData(
                      BOARD_DRAG_TYPE,
                      JSON.stringify({ kind: 'evidence', id: item.id }),
                    )
                    event.dataTransfer.effectAllowed = 'move'
                  }}
                  className={cn(
                    'group mb-1 flex items-center gap-2 border border-transparent px-2 py-2 transition-colors',
                    onBoard
                      ? 'opacity-40'
                      : 'cursor-grab hover:border-white/[0.09] hover:bg-white/[0.03] active:cursor-grabbing',
                  )}
                >
                  <span
                    className="h-6 w-[2px] shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[7px] tracking-[0.1em]" style={{ color: meta.color }}>
                      {item.code}
                    </div>
                    <div className="truncate text-[10.5px] leading-tight text-bone/75">{item.title}</div>
                  </div>
                  <button
                    onClick={() => onAddEvidence(item.id)}
                    disabled={onBoard}
                    className={cn(
                      'grid h-5 w-5 shrink-0 place-items-center border transition-colors',
                      onBoard
                        ? 'border-transparent text-[#9DB8A4]'
                        : 'border-white/10 text-ash/50 hover:border-brass/50 hover:text-brass',
                    )}
                    aria-label={onBoard ? `${item.title} already on board` : `Add ${item.title} to board`}
                  >
                    {onBoard ? <Check size={10} /> : <Plus size={10} />}
                  </button>
                </div>
              )
            })
          : suspects.map((suspect) => {
              const onBoard = existing.has(`suspect-${suspect.id}`)
              return (
                <div
                  key={suspect.id}
                  draggable={!onBoard}
                  onDragStart={(event) => {
                    if (onBoard) return
                    event.dataTransfer.setData(
                      BOARD_DRAG_TYPE,
                      JSON.stringify({ kind: 'suspect', id: suspect.id }),
                    )
                    event.dataTransfer.effectAllowed = 'move'
                  }}
                  className={cn(
                    'group mb-1 flex items-center gap-2 border border-transparent px-2 py-2 transition-colors',
                    onBoard
                      ? 'opacity-40'
                      : 'cursor-grab hover:border-white/[0.09] hover:bg-white/[0.03] active:cursor-grabbing',
                  )}
                >
                  <span className="h-6 w-[2px] shrink-0 bg-blood" />
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[7px] tracking-[0.1em] text-[#D97878]">
                      {suspect.code}
                    </div>
                    <div className="truncate text-[10.5px] leading-tight text-bone/75">
                      {suspect.name}
                    </div>
                  </div>
                  <button
                    onClick={() => onAddSuspect(suspect.id)}
                    disabled={onBoard}
                    className={cn(
                      'grid h-5 w-5 shrink-0 place-items-center border transition-colors',
                      onBoard
                        ? 'border-transparent text-[#9DB8A4]'
                        : 'border-white/10 text-ash/50 hover:border-brass/50 hover:text-brass',
                    )}
                    aria-label={onBoard ? `${suspect.name} already on board` : `Add ${suspect.name} to board`}
                  >
                    {onBoard ? <Check size={10} /> : <Plus size={10} />}
                  </button>
                </div>
              )
            })}
      </div>

      <div className="border-t border-white/[0.08] px-3 py-2.5">
        <div className="flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.1em] text-ash/35">
          <span>Local autosave</span>
          <span className="flex items-center gap-1.5 text-[#9DB8A4]/70">
            <span className="h-[4px] w-[4px] rounded-full bg-[#5F7D68]" />
            Synced
          </span>
        </div>
      </div>
    </div>
  )
}
