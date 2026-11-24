import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Lightbulb, Lock, X } from 'lucide-react'
import { HINTS } from '@/data/solution'
import { useCaseStore } from '@/store/useCaseStore'
import { useUiStore } from '@/store/useUiStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export function HintDrawer() {
  const open = useUiStore((state) => state.hintsOpen)
  const setOpen = useUiStore((state) => state.setHintsOpen)
  const hintsRevealed = useCaseStore((state) => state.hintsRevealed)
  const revealHint = useCaseStore((state) => state.revealHint)
  const pushToast = useUiStore((state) => state.pushToast)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, setOpen])

  const handleReveal = () => {
    revealHint()
    pushToast(
      `Hint 0${hintsRevealed + 1} unlocked`,
      'Hints are deducted from the final score at 2 points each.',
      'warning',
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[125]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Investigation hints"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-white/12 bg-ink-900 shadow-panel"
          >
            <div className="flex items-start justify-between border-b border-white/[0.08] px-6 py-5">
              <div>
                <div className="label mb-2 text-brass">Analyst support</div>
                <h2 className="font-serif text-2xl">Progressive hints</h2>
                <p className="mt-1 text-xs text-ash">Three levels. Each one costs 2 points.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-ash transition-colors hover:text-bone"
                aria-label="Close hints"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mb-6 flex items-center gap-3 border border-brass/20 bg-brass/[0.04] px-3 py-2.5">
                <Lightbulb size={15} className="text-brass" />
                <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.08em] text-ash">
                  Hints never name the culprit. They point at the part of the file you have not
                  reconciled.
                </p>
              </div>

              <div className="space-y-4">
                {HINTS.map((hint) => {
                  const unlocked = hint.level <= hintsRevealed
                  return (
                    <div
                      key={hint.level}
                      className={cn(
                        'border p-4 transition-colors',
                        unlocked
                          ? 'border-brass/25 bg-ink-850'
                          : 'border-white/[0.08] bg-ink-950/40',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-label text-ash/60">
                          Hint 0{hint.level}
                        </span>
                        {unlocked ? (
                          <span className="font-mono text-[8px] uppercase tracking-label text-brass">
                            Unlocked
                          </span>
                        ) : (
                          <Lock size={11} className="text-ash/40" />
                        )}
                      </div>
                      <h3 className={cn('mt-2 font-serif text-xl', !unlocked && 'text-ash/50')}>
                        {unlocked ? hint.title : 'Sealed guidance'}
                      </h3>
                      {unlocked ? (
                        <p className="mt-2 text-[13px] leading-relaxed text-ash">{hint.body}</p>
                      ) : (
                        <div className="mt-3 space-y-2" aria-hidden="true">
                          <div className="h-2 w-full bg-white/[0.05]" />
                          <div className="h-2 w-11/12 bg-white/[0.04]" />
                          <div className="h-2 w-8/12 bg-white/[0.035]" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="border-t border-white/[0.08] px-6 py-5">
              <div className="mb-3 flex items-center justify-between font-mono text-[8.5px] uppercase tracking-label text-ash/60">
                <span>{hintsRevealed} of 3 revealed</span>
                <span>Penalty −{hintsRevealed * 2} pts</span>
              </div>
              {hintsRevealed < 3 ? (
                <Button variant="brass" className="w-full" onClick={handleReveal}>
                  <Lightbulb size={13} />
                  Reveal hint 0{hintsRevealed + 1} · −2 pts
                </Button>
              ) : (
                <div className="border border-white/10 px-3 py-2.5 text-center font-mono text-[9px] uppercase tracking-label text-ash">
                  All hints revealed
                </div>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
