import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  maxWidth = 'max-w-2xl',
  className,
}: {
  open: boolean
  onClose: () => void
  title: string
  eyebrow?: string
  children: ReactNode
  maxWidth?: string
  className?: string
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => closeRef.current?.focus(), 50)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative z-10 max-h-[88vh] w-full overflow-y-auto border border-white/12 bg-ink-850 shadow-panel',
              maxWidth,
              className,
            )}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-white/[0.08] bg-ink-850/95 px-6 py-5 backdrop-blur">
              <div>
                {eyebrow && <div className="label mb-2 text-brass">{eyebrow}</div>}
                <h2 className="font-serif text-2xl leading-tight">{title}</h2>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                className="mt-1 p-1 text-ash transition-colors hover:text-bone"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
