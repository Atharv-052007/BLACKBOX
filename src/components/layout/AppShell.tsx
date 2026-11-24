import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { HintDrawer } from '@/components/layout/HintDrawer'
import { CaseOpenTransition } from '@/components/layout/CaseOpenTransition'
import { Toaster } from '@/components/ui/Toast'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { useCaseStore } from '@/store/useCaseStore'
import { useUiStore } from '@/store/useUiStore'
import { cn } from '@/utils/cn'

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="w-56">
        <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-ash/60">
          <span>Decrypting file</span>
          <span className="animate-pulse">•••</span>
        </div>
        <div className="mt-3 h-px w-full bg-white/10">
          <div className="h-px w-1/2 animate-pulse bg-brass" />
        </div>
      </div>
    </div>
  )
}

export function AppShell() {
  const location = useLocation()
  const startCase = useCaseStore((state) => state.startCase)
  const setCommandOpen = useUiStore((state) => state.setCommandOpen)
  const isBoard = location.pathname.startsWith('/app/board')

  useEffect(() => {
    startCase()
  }, [startCase])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [setCommandOpen])

  useEffect(() => {
    if (!isBoard) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, isBoard])

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="grain" />
      <Sidebar />
      <div
        className={cn(
          'flex min-h-screen flex-col lg:pl-[260px]',
          isBoard && 'h-screen overflow-hidden',
        )}
      >
        <Topbar />
        <main className={cn('flex-1', isBoard ? 'min-h-0 overflow-hidden' : 'px-4 py-6 sm:px-6 lg:px-8 lg:py-8')}>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className={isBoard ? 'h-full' : 'mx-auto max-w-[1280px]'}
              >
                <Outlet />
              </motion.div>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <CommandPalette />
      <HintDrawer />
      <CaseOpenTransition />
      <Toaster />
    </div>
  )
}
