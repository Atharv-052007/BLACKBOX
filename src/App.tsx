import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LandingPage } from '@/pages/LandingPage'

const OverviewPage = lazy(() =>
  import('@/pages/OverviewPage').then((module) => ({ default: module.OverviewPage })),
)
const CaseFilesPage = lazy(() =>
  import('@/pages/CaseFilesPage').then((module) => ({ default: module.CaseFilesPage })),
)
const EvidenceRoomPage = lazy(() =>
  import('@/pages/EvidenceRoomPage').then((module) => ({ default: module.EvidenceRoomPage })),
)
const EvidenceDetailPage = lazy(() =>
  import('@/pages/EvidenceDetailPage').then((module) => ({ default: module.EvidenceDetailPage })),
)
const SuspectsPage = lazy(() =>
  import('@/pages/SuspectsPage').then((module) => ({ default: module.SuspectsPage })),
)
const SuspectDetailPage = lazy(() =>
  import('@/pages/SuspectDetailPage').then((module) => ({ default: module.SuspectDetailPage })),
)
const BoardPage = lazy(() =>
  import('@/pages/BoardPage').then((module) => ({ default: module.BoardPage })),
)
const TimelinePage = lazy(() =>
  import('@/pages/TimelinePage').then((module) => ({ default: module.TimelinePage })),
)
const ReconstructionPage = lazy(() =>
  import('@/pages/ReconstructionPage').then((module) => ({ default: module.ReconstructionPage })),
)
const VerdictPage = lazy(() =>
  import('@/pages/VerdictPage').then((module) => ({ default: module.VerdictPage })),
)
const ReportsPage = lazy(() =>
  import('@/pages/ReportsPage').then((module) => ({ default: module.ReportsPage })),
)

function BootLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-950">
      <div className="w-64">
        <div className="text-center font-serif text-2xl tracking-[0.24em] text-bone">BLACKBOX</div>
        <div className="mt-5 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-ash/60">
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

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<BootLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<OverviewPage />} />
            <Route path="cases" element={<CaseFilesPage />} />
            <Route path="evidence" element={<EvidenceRoomPage />} />
            <Route path="evidence/:id" element={<EvidenceDetailPage />} />
            <Route path="suspects" element={<SuspectsPage />} />
            <Route path="suspects/:id" element={<SuspectDetailPage />} />
            <Route path="board" element={<BoardPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="reconstruction" element={<ReconstructionPage />} />
            <Route path="verdict" element={<VerdictPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
