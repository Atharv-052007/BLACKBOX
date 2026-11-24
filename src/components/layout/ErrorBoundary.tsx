import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('BLACKBOX system error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center px-6">
          <div className="max-w-lg border border-blood/30 bg-ink-850 p-8 text-center">
            <AlertTriangle size={26} className="mx-auto text-blood" />
            <div className="label mt-5 text-brass">System fault</div>
            <h1 className="mt-3 font-serif text-3xl">The file failed to open.</h1>
            <p className="mt-3 text-sm leading-relaxed text-ash">
              An unexpected error interrupted the investigation. Your saved progress is intact.
              Reload the module to continue.
            </p>
            {this.state.message && (
              <p className="mt-4 break-words border border-white/10 bg-ink-950 px-3 py-2 font-mono text-[9px] text-ash/60">
                {this.state.message}
              </p>
            )}
            <div className="mt-6 flex justify-center gap-2">
              <Button variant="primary" onClick={() => window.location.reload()}>
                Reload module
              </Button>
              <Button variant="ghost" onClick={() => window.location.assign('/app')}>
                Return to overview
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
