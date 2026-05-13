import type { TurnosI } from '../../interface/turnos.interface'

export type AppointmentStatus =
  | 'CONFIRMADO'
  | 'PENDIENTE'
  | 'EN_CURSO'
  | 'COMPLETADO'
  | 'CANCELADO'
  | 'REPROGRAMADO'

/** Estados mostrados en `/user-dashboard/historial` (tabla y filtro). */
export type HistorialEstado = 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO' | 'REPROGRAMADO'

/** El API envía `barbero`; algunos payloads viejos podrían usar `barbero_id`. */
export function barberoDelTurno(turno: TurnosI) {
  return turno.barbero ?? turno.barbero_id
}

/**
 * Normaliza el `estado` del turno para el historial del usuario.
 * Etiquetas de UI: En curso, Finalizado, Cancelado, Reprogramado.
 */
export function normalizeHistorialEstado(estado: unknown): HistorialEstado {
  const e = String(estado ?? '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
  if (e.includes('CANCEL')) return 'CANCELADO'
  if (e.includes('REPROGRAM') || e.includes('REAGEND') || e.includes('RESCHEDUL')) return 'REPROGRAMADO'
  if (e.includes('COMPLET') || e.includes('FINALIZ') || e.includes('REALIZ')) return 'COMPLETADO'
  return 'EN_CURSO'
}

export function normalizeStatus(estado: unknown): AppointmentStatus {
  const e = String(estado ?? '').toUpperCase()
  if (e.includes('CANCEL')) return 'CANCELADO'
  if (e.includes('COMPLET') || e.includes('FINALIZ') || e.includes('REALIZ')) return 'COMPLETADO'
  if (e.includes('EN_CURSO') || e.includes('EN CURSO') || e.includes('INICIAD')) return 'EN_CURSO'
  if (e.includes('CONFIRM')) return 'CONFIRMADO'
  if (e.includes('PEND')) return 'PENDIENTE'
  if (e.includes('REPROGRAM')) return 'REPROGRAMADO'
  return 'PENDIENTE'
}

export function isCompletedTurno(estado: unknown): boolean {
  const e = String(estado ?? '').toUpperCase()
  return e.includes('COMPLET') || e.includes('FINALIZ') || e.includes('REALIZ')
}

export function isCancelledTurno(estado: unknown): boolean {
  return String(estado ?? '').toUpperCase().includes('CANCEL')
}

/** Fecha/hora local de inicio del turno (`fecha` ISO + `horario.horaInicio`). */
export function obtenerFechaHoraInicioTurno(turno: TurnosI): Date | null {
  if (!turno.fecha || !turno.horario?.horaInicio) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(turno.fecha)
  if (!match) return null
  const [, y, m, d] = match
  const [h = '0', min = '0'] = String(turno.horario.horaInicio).split(':')
  const date = new Date(Number(y), Number(m) - 1, Number(d), Number(h), Number(min), 0, 0)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * True si entre `ahora` y el inicio del turno hay al menos `horasMinimas` de diferencia
 * (p. ej. para permitir reagendar solo con ≥ 1 h de anticipación).
 */
export function turnoTieneAnticipacionMinimaHoras(turno: TurnosI, ahora: Date, horasMinimas = 1): boolean {
  const inicio = obtenerFechaHoraInicioTurno(turno)
  if (!inicio) return false
  return inicio.getTime() - ahora.getTime() >= horasMinimas * 60 * 60 * 1000
}

/** `YYYY-MM-DD` desde `turno.fecha` o hoy si no se puede parsear. */
export function fechaIsoDiaDesdeTurno(turno: TurnosI): string {
  const match = turno.fecha && /^(\d{4}-\d{2}-\d{2})/.exec(turno.fecha)
  if (match) return match[1]
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
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
