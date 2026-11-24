import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Clock3, FileText, Fingerprint, Search, Users } from 'lucide-react'
import { EVIDENCE } from '@/data/evidence'
import { SUSPECTS } from '@/data/suspects'
import { TIMELINE } from '@/data/timeline'
import { useUiStore } from '@/store/useUiStore'
import { CATEGORY_META } from '@/utils/format'
import { cn } from '@/utils/cn'

interface Result {
  id: string
  group: string
  title: string
  subtitle: string
  code: string
  path: string
  color?: string
}

const PAGES: Result[] = [
  { id: 'p-overview', group: 'Navigate', title: 'Case Overview', subtitle: 'Directives, status and leads', code: '01', path: '/app' },
  { id: 'p-cases', group: 'Navigate', title: 'Case Files', subtitle: 'Active and sealed investigations', code: '02', path: '/app/cases' },
  { id: 'p-evidence', group: 'Navigate', title: 'Evidence Room', subtitle: 'All 15 exhibits', code: '03', path: '/app/evidence' },
  { id: 'p-suspects', group: 'Navigate', title: 'Suspects', subtitle: 'Four persons of interest', code: '04', path: '/app/suspects' },
  { id: 'p-board', group: 'Navigate', title: 'Investigation Board', subtitle: 'Connect evidence and theories', code: '05', path: '/app/board' },
  { id: 'p-timeline', group: 'Navigate', title: 'Timeline', subtitle: 'Chronology of the eleven minutes', code: '06', path: '/app/timeline' },
  { id: 'p-reconstruction', group: 'Navigate', title: 'Reconstruction Room', subtitle: 'Rebuild the blackout sequence', code: '07', path: '/app/reconstruction' },
  { id: 'p-verdict', group: 'Navigate', title: 'Final Verdict', subtitle: 'Submit your conclusion', code: '08', path: '/app/verdict' },
  { id: 'p-reports', group: 'Navigate', title: 'My Reports', subtitle: 'Investigation report and score', code: '09', path: '/app/reports' },
]

export function CommandPalette() {
  const open = useUiStore((state) => state.commandOpen)
  const setOpen = useUiStore((state) => state.setCommandOpen)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const results = useMemo(() => {
    const evidenceResults: Result[] = EVIDENCE.map((item) => ({
      id: `e-${item.id}`,
      group: 'Evidence',
      title: item.title,
      subtitle: item.summary,
      code: item.code,
      path: `/app/evidence/${item.id}`,
      color: CATEGORY_META[item.category].color,
    }))
    const suspectResults: Result[] = SUSPECTS.map((suspect) => ({
      id: `s-${suspect.id}`,
      group: 'Suspects',
      title: suspect.name,
      subtitle: `${suspect.occupation} · ${suspect.status}`,
      code: suspect.code,
      path: `/app/suspects/${suspect.id}`,
      color: '#B83232',
    }))
    const timelineResults: Result[] = TIMELINE.map((event) => ({
      id: `t-${event.id}`,
      group: 'Timeline',
      title: `${event.time} · ${event.title}`,
      subtitle: event.summary,
      code: event.time,
      path: '/app/timeline',
      color: '#7C93A8',
    }))

    const all = [...PAGES, ...evidenceResults, ...suspectResults, ...timelineResults]
    const normalized = query.trim().toLowerCase()
    if (!normalized) return all.slice(0, 11)

    const scored = all
      .map((result) => {
        const haystack = `${result.title} ${result.subtitle} ${result.code} ${result.group}`.toLowerCase()
        if (!haystack.includes(normalized)) return null
        const titleMatch = result.title.toLowerCase().includes(normalized)
        return { result, score: titleMatch ? 2 : 1 }
      })
      .filter((entry): entry is { result: Result; score: number } => Boolean(entry))
      .sort((a, b) => b.score - a.score)
      .slice(0, 16)
      .map((entry) => entry.result)

    return scored
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      window.setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  const choose = (result: Result | undefined) => {
    if (!result) return
    setOpen(false)
    navigate(result.path)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActive((current) => Math.min(results.length - 1, current + 1))
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActive((current) => Math.max(0, current - 1))
      } else if (event.key === 'Enter') {
        event.preventDefault()
        choose(results[active])
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  const grouped = results.reduce<Record<string, Result[]>>((accumulator, result) => {
    if (!accumulator[result.group]) accumulator[result.group] = []
    accumulator[result.group].push(result)
    return accumulator
  }, {})

  let flatIndex = -1

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search case file"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl border border-white/15 bg-ink-850 shadow-panel"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
              <Search size={17} className="text-ash" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search exhibits, suspects, events, sections…"
                className="flex-1 bg-transparent text-sm text-bone outline-none placeholder:text-ash/50"
                aria-label="Search query"
              />
              <span className="hidden border border-white/10 px-1.5 py-0.5 font-mono text-[8px] text-ash/50 sm:inline">
                ESC
              </span>
            </div>

            <div className="max-h-[55vh] overflow-y-auto">
              {results.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <div className="label mb-2 text-brass">No match</div>
                  <p className="text-sm text-ash">
                    Nothing in the file matches “{query}”. Try a name, exhibit code or timestamp.
                  </p>
                </div>
              )}

              {Object.entries(grouped).map(([group, groupResults]) => (
                <div key={group} className="border-b border-white/[0.05] last:border-0">
                  <div className="px-4 pb-1 pt-3 font-mono text-[8px] uppercase tracking-label text-ash/45">
                    {group}
                  </div>
                  {groupResults.map((result) => {
                    flatIndex += 1
                    const isActive = flatIndex === active
                    const Icon =
                      result.group === 'Evidence'
                        ? Fingerprint
                        : result.group === 'Suspects'
                          ? Users
                          : result.group === 'Timeline'
                            ? Clock3
                            : FileText
                    return (
                      <button
                        key={result.id}
                        onMouseEnter={() => setActive(flatIndex)}
                        onClick={() => choose(result)}
                        className={cn(
                          'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                          isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.035]',
                        )}
                      >
                        <Icon size={14} style={{ color: result.color ?? '#858991' }} className="shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] text-bone/90">{result.title}</span>
                          <span className="block truncate text-[10px] text-ash/60">{result.subtitle}</span>
                        </span>
                        <span className="hidden font-mono text-[8px] uppercase tracking-[0.1em] text-ash/40 sm:block">
                          {result.code}
                        </span>
                        <ArrowRight
                          size={13}
                          className={cn(
                            'shrink-0 transition-opacity',
                            isActive ? 'text-brass opacity-100' : 'opacity-0',
                          )}
                        />
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.12em] text-ash/40">
              <span>↑ ↓ navigate · enter open</span>
              <span>{results.length} records</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
