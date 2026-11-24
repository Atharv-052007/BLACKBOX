import type { EvidenceCategory } from '@/types'

export const CATEGORY_META: Record<
  EvidenceCategory | 'suspect',
  { label: string; short: string; color: string; dim: string }
> = {
  physical: {
    label: 'Physical Evidence',
    short: 'PHYSICAL',
    color: '#E7E2D6',
    dim: 'rgba(231,226,214,0.12)',
  },
  digital: {
    label: 'Digital Evidence',
    short: 'DIGITAL',
    color: '#9AA1AA',
    dim: 'rgba(154,161,170,0.12)',
  },
  document: {
    label: 'Document',
    short: 'DOCUMENT',
    color: '#C69A55',
    dim: 'rgba(198,154,85,0.13)',
  },
  cctv: {
    label: 'CCTV Record',
    short: 'CCTV',
    color: '#7C93A8',
    dim: 'rgba(124,147,168,0.13)',
  },
  audio: {
    label: 'Audio Record',
    short: 'AUDIO',
    color: '#8FA69A',
    dim: 'rgba(143,166,154,0.13)',
  },
  witness: {
    label: 'Witness Statement',
    short: 'STATEMENT',
    color: '#B9A58C',
    dim: 'rgba(185,165,140,0.13)',
  },
  suspect: {
    label: 'Suspect',
    short: 'SUSPECT',
    color: '#B83232',
    dim: 'rgba(184,50,50,0.14)',
  },
}

export const RELATIONSHIP_META = {
  connected: { label: 'CONNECTED TO', color: '#C69A55', dashed: false },
  contradicts: { label: 'CONTRADICTS', color: '#B83232', dashed: true },
  confirms: { label: 'CONFIRMS', color: '#8FA69A', dashed: false },
  present: { label: 'PRESENT AT', color: '#7C93A8', dashed: false },
  motive: { label: 'POSSIBLE MOTIVE', color: '#C69A55', dashed: true },
} as const

export type RelationshipKey = keyof typeof RELATIONSHIP_META

export function initials(name: string): string {
  return name
    .replace(/^Dr\s+/i, '')
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function durationLabel(startedAt: string | null, endedAt?: string): string {
  if (!startedAt) return '—'
  const start = new Date(startedAt).getTime()
  const end = endedAt ? new Date(endedAt).getTime() : Date.now()
  const minutes = Math.max(0, Math.round((end - start) / 60000))
  if (minutes < 1) return 'less than a minute'
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return `${hours}h ${remainder.toString().padStart(2, '0')}m`
}

export function shortDate(iso: string): string {
  return new Date(iso)
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .toUpperCase()
}

export function pad(value: number, size = 2): string {
  return value.toString().padStart(size, '0')
}
