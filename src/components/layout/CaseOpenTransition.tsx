import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Fingerprint, ShieldAlert } from 'lucide-react'
import { CASE_FILE } from '@/data/case'
import { EVIDENCE } from '@/data/evidence'
import { SUSPECTS } from '@/data/suspects'
import { Button } from '@/components/ui/Button'

const SEEN_KEY = 'blackbox-case-intake-shown'

export function CaseOpenTransition() {
  const location = useLocation()
  const navigate = useNavigate()
  const forced = Boolean((location.state as { openCase?: boolean } | null)?.openCase)

  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    return forced || !window.sessionStorage.getItem(SEEN_KEY)
  })
  const [progress, setProgress] = useState(0)

  const close = useCallback(() => {
    window.sessionStorage.setItem(SEEN_KEY, '1')
    setOpen(false)
    if ((location.state as { openCase?: boolean } | null)?.openCase) {
      navigate(location.pathname + location.search, { replace: true, state: null })
    }
  }, [location.pathname, location.search, location.state, navigate])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter') close()
    }
    document.addEventListener('keydown', onKey)
    const interval = window.setInterval(() => {
      setProgress((value) => (value >= 100 ? 100 : value + 4))
    }, 55)
    const timeout = window.setTimeout(close, 4200)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.clearInterval(interval)
      window.clearTimeout(timeout)
      document.body.style.overflow = previous
    }
  }, [open, close])

  const bootLines = useMemo(
    () => [
      { label: 'Case file', value: `${CASE_FILE.code} · ${CASE_FILE.classification}` },
      { label: 'Exhibits logged', value: `${EVIDENCE.length} sealed records` },
      { label: 'Persons of interest', value: `${SUSPECTS.length} dossiers` },
      { label: 'Blackout window', value: '660 seconds' },
    ],
    [],
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="case-intake"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-ink-950 px-5"
          role="dialog"
          aria-modal="true"
          aria-label="Opening case file"
        >
          <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
          <div className="pointer-events-none absolute inset-0 vignette" />
          <div className="grain" />

          <div className="absolute inset-x-5 top-5 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-ash/55 sm:inset-x-8">
            <span className="flex items-center gap-2">
              <ShieldAlert size={12} className="text-brass" />
              BLACKBOX secure intake
            </span>
            <span>{CASE_FILE.id.toUpperCase()}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl"
          >
            <div className="flex items-center gap-3">
              <span className="h-[5px] w-[5px] bg-blood" />
              <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-brass">
                Case opened · restricted
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.16em] text-ash/60">
              <span>{CASE_FILE.code}</span>
              <span className="h-px w-8 bg-white/20" />
              <span>{CASE_FILE.date}</span>
            </div>

            <h1 className="display mt-2 text-[clamp(3rem,9vw,5.5rem)] text-bone">{CASE_FILE.title}</h1>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {[CASE_FILE.classification, CASE_FILE.difficulty, 'SOLO INVESTIGATION'].map((tag) => (
                <span
                  key={tag}
                  className="border border-white/12 px-2 py-1 font-mono text-[7.5px] uppercase tracking-[0.16em] text-ash/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-x-6 gap-y-2 border-y border-white/[0.08] py-4 sm:grid-cols-2">
              {bootLines.map((line, index) => (
                <motion.div
                  key={line.label}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.12, duration: 0.4 }}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-ash/45">
                    {line.label}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.06em] text-bone/70">
                    {line.value}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-ash/55">
                <span className="flex items-center gap-2">
                  <Fingerprint size={11} className="text-brass" />
                  {progress >= 100 ? 'File decrypted' : 'Decrypting case file'}
                </span>
                <span className="text-brass">{progress}%</span>
              </div>
              <div className="mt-2 h-[2px] w-full bg-white/10">
                <div
                  className="h-full bg-brass transition-[width] duration-150 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                icon={<ArrowRight size={13} />}
                onClick={close}
                autoFocus
              >
                Enter the investigation
              </Button>
              <Button variant="quiet" onClick={close}>
                Skip intake
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
