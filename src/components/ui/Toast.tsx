import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, Info, X } from 'lucide-react'
import { useUiStore } from '@/store/useUiStore'
import { cn } from '@/utils/cn'

const TONE_STYLES = {
  default: { border: 'border-white/15', icon: <Info size={14} />, color: 'text-bone' },
  success: { border: 'border-[#5F7D68]/60', icon: <Check size={14} />, color: 'text-[#A9C2AE]' },
  warning: { border: 'border-brass/60', icon: <AlertTriangle size={14} />, color: 'text-brass' },
  danger: { border: 'border-blood/60', icon: <AlertTriangle size={14} />, color: 'text-[#D97878]' },
}

export function Toaster() {
  const toasts = useUiStore((state) => state.toasts)
  const dismiss = useUiStore((state) => state.dismissToast)

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[140] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const tone = TONE_STYLES[toast.tone]
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 24, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 border bg-ink-850/95 px-4 py-3 shadow-panel backdrop-blur',
                tone.border,
              )}
              role="status"
            >
              <span className={cn('mt-0.5', tone.color)}>{tone.icon}</span>
              <div className="min-w-0 flex-1">
                <div className={cn('font-mono text-[9.5px] uppercase tracking-label', tone.color)}>
                  {toast.message}
                </div>
                {toast.detail && <p className="mt-1 text-xs leading-relaxed text-ash">{toast.detail}</p>}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-ash/60 transition-colors hover:text-bone"
                aria-label="Dismiss notification"
              >
                <X size={13} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
