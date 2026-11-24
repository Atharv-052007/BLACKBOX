import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronRight, Lightbulb, Menu, Search } from 'lucide-react'
import { useCaseStore } from '@/store/useCaseStore'
import { useUiStore } from '@/store/useUiStore'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { initials } from '@/utils/format'

function breadcrumbFor(pathname: string): string {
  if (pathname === '/app') return 'Overview'
  if (pathname.startsWith('/app/cases')) return 'Case Files'
  if (pathname.startsWith('/app/evidence/')) return 'Evidence Examination'
  if (pathname.startsWith('/app/evidence')) return 'Evidence Room'
  if (pathname.startsWith('/app/suspects/')) return 'Suspect Dossier'
  if (pathname.startsWith('/app/suspects')) return 'Suspects'
  if (pathname.startsWith('/app/board')) return 'Investigation Board'
  if (pathname.startsWith('/app/timeline')) return 'Timeline'
  if (pathname.startsWith('/app/reconstruction')) return 'Reconstruction Room'
  if (pathname.startsWith('/app/verdict')) return 'Final Verdict'
  if (pathname.startsWith('/app/reports')) return 'My Reports'
  return 'Case File'
}

export function Topbar() {
  const location = useLocation()
  const detectiveName = useCaseStore((state) => state.detectiveName)
  const setDetectiveName = useCaseStore((state) => state.setDetectiveName)
  const setCommandOpen = useUiStore((state) => state.setCommandOpen)
  const setHintsOpen = useUiStore((state) => state.setHintsOpen)
  const setNavOpen = useUiStore((state) => state.setNavOpen)
  const pushToast = useUiStore((state) => state.pushToast)

  const [nameOpen, setNameOpen] = useState(false)
  const [draftName, setDraftName] = useState(detectiveName)

  useEffect(() => {
    setDraftName(detectiveName)
  }, [detectiveName])

  const saveName = () => {
    setDetectiveName(draftName)
    setNameOpen(false)
    pushToast('Detective identity updated', `Report will be issued to Det. ${draftName.trim() || 'A. Morgan'}.`)
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/[0.07] bg-ink-950/90 px-4 backdrop-blur-md sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            className="p-1.5 text-ash transition-colors hover:text-bone lg:hidden"
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="flex min-w-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em]">
            <span className="hidden text-ash/50 sm:inline">Case 001</span>
            <ChevronRight size={11} className="hidden text-ash/30 sm:inline" />
            <span className="truncate text-bone/80">{breadcrumbFor(location.pathname)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCommandOpen(true)}
            className="group flex h-9 items-center gap-2.5 border border-white/[0.1] bg-white/[0.02] px-3 text-ash transition-colors hover:border-white/20 hover:text-bone"
          >
            <Search size={13} />
            <span className="hidden font-mono text-[8.5px] uppercase tracking-[0.14em] sm:inline">
              Search file
            </span>
            <span className="hidden border border-white/10 px-1.5 py-0.5 font-mono text-[8px] text-ash/50 md:inline">
              ⌘K
            </span>
          </button>

          <button
            onClick={() => setHintsOpen(true)}
            className="grid h-9 w-9 place-items-center border border-white/[0.1] text-ash transition-colors hover:border-brass/40 hover:text-brass"
            aria-label="Open hints"
            title="Request a hint"
          >
            <Lightbulb size={14} />
          </button>

          <div className="mx-1 hidden items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-ash/60 xl:flex">
            <span className="h-[5px] w-[5px] animate-pulse-dot rounded-full bg-[#5F7D68]" />
            System online
          </div>

          <button
            onClick={() => setNameOpen(true)}
            className="flex items-center gap-2 border-l border-white/10 pl-3 text-left"
            aria-label="Edit detective identity"
          >
            <span className="grid h-8 w-8 place-items-center border border-white/15 bg-ink-800 font-mono text-[9px] text-bone/70">
              {initials(detectiveName)}
            </span>
            <span className="hidden sm:block">
              <span className="block font-mono text-[8.5px] uppercase tracking-[0.08em] text-bone/70">
                Det. {detectiveName}
              </span>
              <span className="block font-mono text-[7px] uppercase tracking-[0.14em] text-ash/50">
                Identity · edit
              </span>
            </span>
          </button>
        </div>
      </header>

      <Modal
        open={nameOpen}
        onClose={() => setNameOpen(false)}
        title="Investigator identity"
        eyebrow="Access credential"
        maxWidth="max-w-md"
      >
        <p className="text-sm leading-relaxed text-ash">
          This name is written to the case log and printed on the final investigation report.
        </p>
        <label className="mt-6 block">
          <span className="label mb-2 block">Detective name</span>
          <input
            className="input input-mono"
            value={draftName}
            maxLength={40}
            onChange={(event) => setDraftName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') saveName()
            }}
            autoFocus
          />
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setNameOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveName} disabled={!draftName.trim()}>
            Authorise
          </Button>
        </div>
      </Modal>
    </>
  )
}
