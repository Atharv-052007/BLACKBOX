import { NavLink, Link } from 'react-router-dom'
import {
  Clock3,
  FileText,
  Fingerprint,
  FolderLock,
  Gavel,
  LayoutGrid,
  Network,
  ScanLine,
  Users,
  X,
} from 'lucide-react'
import { useCaseStore } from '@/store/useCaseStore'
import { useUiStore } from '@/store/useUiStore'
import { EVIDENCE } from '@/data/evidence'
import { CASE_FILE } from '@/data/case'
import { ProgressBar } from '@/components/ui/Progress'
import { cn } from '@/utils/cn'
import { initials } from '@/utils/format'

const MAIN_NAV = [
  { to: '/app', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/app/cases', label: 'Case Files', icon: FolderLock },
  { to: '/app/evidence', label: 'Evidence Room', icon: Fingerprint },
  { to: '/app/suspects', label: 'Suspects', icon: Users },
  { to: '/app/board', label: 'Investigation Board', icon: Network },
  { to: '/app/timeline', label: 'Timeline', icon: Clock3 },
  { to: '/app/reconstruction', label: 'Reconstruction Room', icon: ScanLine },
  { to: '/app/reports', label: 'My Reports', icon: FileText },
]

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="BLACKBOX home">
      <span className="relative grid h-9 w-9 place-items-center border border-white/20 bg-ink-950">
        <span className="font-serif text-xl leading-none text-bone">B</span>
        <span className="absolute -right-[3px] -top-[3px] h-[6px] w-[6px] bg-blood" />
      </span>
      {!compact && (
        <span>
          <span className="block font-serif text-[1.3rem] leading-none tracking-[0.2em] text-bone">
            BLACKBOX
          </span>
          <span className="mt-1 block font-mono text-[7.5px] uppercase tracking-[0.28em] text-ash">
            Investigation network
          </span>
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  const reviewed = useCaseStore((state) => state.reviewedEvidence)
  const viewedSuspects = useCaseStore((state) => state.viewedSuspects)
  const boardEdges = useCaseStore((state) => state.boardEdges)
  const reconstructionOrder = useCaseStore((state) => state.reconstructionOrder)
  const hintsRevealed = useCaseStore((state) => state.hintsRevealed)
  const detectiveName = useCaseStore((state) => state.detectiveName)
  const navOpen = useUiStore((state) => state.navOpen)
  const setNavOpen = useUiStore((state) => state.setNavOpen)
  const setHintsOpen = useUiStore((state) => state.setHintsOpen)

  const counts: Record<string, string> = {
    '/app/evidence': `${reviewed.length}/${EVIDENCE.length}`,
    '/app/suspects': `${viewedSuspects.length}/4`,
    '/app/board': boardEdges.length > 0 ? `${boardEdges.length}` : '—',
    '/app/timeline': '14',
    '/app/reconstruction': `${reconstructionOrder.filter(Boolean).length}/8`,
  }

  const content = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/[0.07] px-5 py-5">
        <Logo />
      </div>

      <div className="border-b border-white/[0.07] px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="micro text-brass">Active file</span>
          <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-label text-ash">
            <span className="h-[4px] w-[4px] animate-pulse-dot rounded-full bg-blood" />
            Open
          </span>
        </div>
        <div className="mt-2 font-serif text-lg leading-tight">{CASE_FILE.title}</div>
        <div className="mt-1 font-mono text-[8px] uppercase tracking-label text-ash">
          {CASE_FILE.code} · {CASE_FILE.classification}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Case navigation">
        <div className="mb-2 px-3 font-mono text-[8px] uppercase tracking-label text-ash/50">
          Case file
        </div>
        <div className="space-y-0.5">
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setNavOpen(false)}
              className={({ isActive }) => cn('nav-item', isActive && 'nav-item-active')}
            >
              <item.icon size={15} strokeWidth={1.5} className="shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {counts[item.to] && (
                <span className="font-mono text-[8px] tracking-[0.08em] text-ash/55">
                  {counts[item.to]}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <div className="mb-2 mt-7 px-3 font-mono text-[8px] uppercase tracking-label text-ash/50">
          Resolution
        </div>
        <NavLink
          to="/app/verdict"
          onClick={() => setNavOpen(false)}
          className={({ isActive }) => cn('nav-item', isActive && 'nav-item-active')}
        >
          <Gavel size={15} strokeWidth={1.5} className="shrink-0" />
          <span className="flex-1">Final Verdict</span>
          <span className="font-mono text-[8px] text-blood/70">→</span>
        </NavLink>

        <div className="mt-6 border border-white/[0.08] bg-ink-950/60 p-3">
          <div className="flex items-center justify-between">
            <span className="micro">File progress</span>
            <span className="font-mono text-[9px] text-bone/70">
              {Math.round((reviewed.length / EVIDENCE.length) * 100)}%
            </span>
          </div>
          <ProgressBar value={reviewed.length} max={EVIDENCE.length} className="mt-2" />
          <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.08em] text-ash/50">
            {reviewed.length} of {EVIDENCE.length} exhibits examined
          </div>
        </div>
      </nav>

      <div className="border-t border-white/[0.07] px-4 py-4">
        <button
          onClick={() => {
            setHintsOpen(true)
            setNavOpen(false)
          }}
          className="mb-3 flex w-full items-center justify-between border border-brass/25 bg-brass/[0.04] px-3 py-2.5 text-left transition-colors hover:border-brass/50 hover:bg-brass/[0.08]"
        >
          <span>
            <span className="block font-mono text-[8px] uppercase tracking-label text-brass">
              Request hint
            </span>
            <span className="mt-0.5 block font-mono text-[8px] text-ash/60">
              {3 - hintsRevealed} remaining · −2 pts each
            </span>
          </span>
          <span className="font-serif text-lg text-brass">{hintsRevealed}/3</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center border border-white/15 bg-ink-800 font-mono text-[10px] text-bone/70">
            {initials(detectiveName)}
          </span>
          <div className="min-w-0">
            <div className="truncate font-mono text-[9px] uppercase tracking-[0.1em] text-bone/75">
              Det. {detectiveName}
            </div>
            <div className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-ash/55">
              Lead investigator
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-white/[0.07] bg-ink-900 lg:block">
        {content}
      </aside>

      {navOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
            onClick={() => setNavOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[290px] max-w-[86vw] border-r border-white/10 bg-ink-900 shadow-panel">
            <button
              onClick={() => setNavOpen(false)}
              className="absolute right-3 top-3 z-10 p-2 text-ash hover:text-bone"
              aria-label="Close navigation"
            >
              <X size={16} />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  )
}
