import type { TurnosI } from '../interface/turnos.interface'

export type AppointmentStatus =
  | 'CONFIRMADO'
  | 'PENDIENTE'
  | 'EN_CURSO'
  | 'COMPLETADO'
  | 'CANCELADO'

/** El API envía `barbero`; algunos payloads viejos podrían usar `barbero_id`. */
export function barberoDelTurno(turno: TurnosI) {
  return turno.barbero ?? turno.barbero_id
}

export function normalizeStatus(estado: unknown): AppointmentStatus {
  const e = String(estado ?? '').toUpperCase()
  if (e.includes('CANCEL')) return 'CANCELADO'
  if (e.includes('COMPLET') || e.includes('FINALIZ') || e.includes('REALIZ')) return 'COMPLETADO'
  if (e.includes('CONFIRM')) return 'CONFIRMADO'
  if (e.includes('INICIAD')) return 'EN_CURSO'
  if (e.includes('PEND')) return 'PENDIENTE'
  return 'PENDIENTE'
}

export function isCompletedTurno(estado: unknown): boolean {
  const e = String(estado ?? '').toUpperCase()
  return e.includes('COMPLET') || e.includes('FINALIZ') || e.includes('REALIZ')
}

export function isCancelledTurno(estado: unknown): boolean {
  return String(estado ?? '').toUpperCase().includes('CANCEL')
}

export function formatDateLabel(dateStr: string | undefined): string {
  if (!dateStr) return '-'
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr)
  if (iso) {
    const y = Number(iso[1])
    const mo = Number(iso[2])
    const d = Number(iso[3])
    const local = new Date(y, mo - 1, d)
    return local.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  const parsed = new Date(dateStr)
  if (Number.isNaN(parsed.getTime())) return dateStr
  return parsed.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatHora(horaISO: string | undefined): string {
  if (!horaISO) return '-'
  const parts = horaISO.split(':')
  if (parts.length >= 2) {
    const h = parts[0].padStart(2, '0')
    const m = parts[1].padStart(2, '0')
    return `${h}:${m}`
  }
  return horaISO
}

export function formatTimeLabel(turno: TurnosI): string {
  return formatHora(turno.horario?.horaInicio)
}

export function parsePrecio(precio: unknown): number {
  if (typeof precio === 'number') return precio
  const raw = String(precio ?? '')
  const normalized = raw.replace(/[^\d.-]/g, '')
  const n = Number(normalized)
  return Number.isFinite(n) ? n : 0
}

export function formatPriceARS(n: number): string {
  return n.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
