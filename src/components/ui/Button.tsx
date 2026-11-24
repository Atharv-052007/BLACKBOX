import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'ghost' | 'brass' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

const VARIANT: Record<Variant, string> = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  brass: 'btn-brass',
  quiet: 'btn-quiet',
}

const SIZE: Record<Size, string> = {
  sm: 'px-3 py-2 text-[9px]',
  md: '',
  lg: 'px-6 py-4 text-[11px]',
}

export function buttonStyles(variant: Variant = 'ghost', size: Size = 'md', className?: string) {
  return cn('btn', VARIANT[variant], SIZE[size], className)
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconRight?: ReactNode
}

export function Button({
  variant = 'ghost',
  size = 'md',
  icon,
  iconRight,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonStyles(variant, size, className)} {...props}>
      {icon}
      {children}
      {iconRight}
    </button>
  )
}
