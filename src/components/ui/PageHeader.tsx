import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  className,
}: {
  eyebrow: string
  title: string
  description?: string
  actions?: ReactNode
  meta?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('border-b border-white/[0.08] pb-8', className)}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="label mb-3 text-brass">{eyebrow}</div>
          <h1 className="display text-[clamp(2.5rem,5vw,4.2rem)]">{title}</h1>
          {description && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ash">{description}</p>
          )}
          {meta && <div className="mt-5 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
