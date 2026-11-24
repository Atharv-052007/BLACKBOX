import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center border border-dashed border-white/12 px-8 py-16 text-center',
        className,
      )}
    >
      {icon && <div className="mb-5 text-ash/60">{icon}</div>}
      <div className="label mb-3 text-brass">No record found</div>
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ash">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
