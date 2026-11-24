import { cn } from '@/utils/cn'

export function ProgressBar({
  value,
  max,
  color = '#B83232',
  className,
  trackClassName,
}: {
  value: number
  max: number
  color?: string
  className?: string
  trackClassName?: string
}) {
  const percent = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100))
  return (
    <div
      className={cn('h-[3px] w-full bg-white/[0.08]', trackClassName)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={cn('h-full transition-[width] duration-700 ease-out', className)}
        style={{ width: `${percent}%`, backgroundColor: color }}
      />
    </div>
  )
}

export function RiskBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="font-mono text-[9px] uppercase tracking-label text-ash">{label}</span>
        <span className="font-mono text-[10px] text-bone/70">{value}</span>
      </div>
      <div className="h-[2px] w-full bg-white/[0.07]">
        <div
          className="h-full"
          style={{
            width: `${value}%`,
            backgroundColor: value >= 80 ? '#B83232' : value >= 55 ? '#C69A55' : '#5F7D68',
          }}
        />
      </div>
    </div>
  )
}

export function ScoreRing({
  value,
  size = 148,
  label = 'SCORE',
}: {
  value: number
  size?: number
  label?: string
}) {
  const radius = size / 2 - 7
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={value >= 85 ? '#C69A55' : value >= 60 ? '#B83232' : '#7C93A8'}
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="butt"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="display text-5xl leading-none">{value}</span>
        <span className="mt-1 font-mono text-[8px] uppercase tracking-label text-ash">{label}</span>
      </div>
    </div>
  )
}
