import { create } from 'zustand'

export type ToastTone = 'default' | 'success' | 'warning' | 'danger'

export interface ToastItem {
  id: string
  message: string
  detail?: string
  tone: ToastTone
}

interface UiStore {
  toasts: ToastItem[]
  commandOpen: boolean
  hintsOpen: boolean
  navOpen: boolean
  pushToast: (message: string, detail?: string, tone?: ToastTone) => void
  dismissToast: (id: string) => void
  setCommandOpen: (open: boolean) => void
  setHintsOpen: (open: boolean) => void
  setNavOpen: (open: boolean) => void
}

export const useUiStore = create<UiStore>((set) => ({
  toasts: [],
  commandOpen: false,
  hintsOpen: false,
  navOpen: false,
  pushToast: (message, detail, tone = 'default') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    set((state) => ({
      toasts: [...state.toasts.slice(-2), { id, message, detail, tone }],
    }))
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
    }, 3600)
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setHintsOpen: (hintsOpen) => set({ hintsOpen }),
  setNavOpen: (navOpen) => set({ navOpen }),
}))
