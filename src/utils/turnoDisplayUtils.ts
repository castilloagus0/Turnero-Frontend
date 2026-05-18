import type { TurnosI } from '../interface/turnos.interface'
import { barberoDelTurno, parsePrecio } from '../pages/DashboardUser/dashboardUserUtils'

export type ClaveEstadoTurno = 'confirmado' | 'en_curso' | 'completado' | 'cancelado' | 'pendiente'

export type ResumenTurnosAdmin = {
  total: number
  confirmados: number
  enCurso: number
  completados: number
  pendientes: number
  cancelados: number
  ingresos: number
}

/** Fecha calendario local (YYYY-MM-DD) a partir del datetime del API. */
export function normalizarFechaTurnoApi(fecha: string | Date | null | undefined): string {
  if (fecha == null || fecha === '') return ''
  if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha.trim())) {
    return fecha.trim()
  }
  const parsed = fecha instanceof Date ? fecha : new Date(fecha)
  if (Number.isNaN(parsed.getTime())) {
    return String(fecha).slice(0, 10)
  }
  const y = parsed.getFullYear()
  const m = String(parsed.getMonth() + 1).padStart(2, '0')
  const d = String(parsed.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function claveEstadoTurno(estado: string | null | undefined): ClaveEstadoTurno {
  const raw = String(estado ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
  if (raw.includes('confirm')) return 'confirmado'
  if (raw.includes('curso') || raw.includes('iniciad')) return 'en_curso'
  if (raw.includes('complet') || raw.includes('finaliz') || raw.includes('realiz')) return 'completado'
  if (raw.includes('cancel')) return 'cancelado'
  return 'pendiente'
}

const ETIQUETAS_ESTADO: Record<ClaveEstadoTurno, string> = {
  confirmado: 'Confirmado',
  en_curso: 'En curso',
  completado: 'Completado',
  cancelado: 'Cancelado',
  pendiente: 'Pendiente',
}

export function etiquetaPorClaveEstado(clave: ClaveEstadoTurno): string {
  return ETIQUETAS_ESTADO[clave]
}

export function formatoEstadoTurno(turno: TurnosI): string {
  const clave = claveEstadoTurno(turno.estado)
  return ETIQUETAS_ESTADO[clave] ?? String(turno.estado ?? '—')
}

/** Etiqueta alineada con los valores que envía el API (`INICIADO`, `FINALIZADO`, etc.). */
export function etiquetaEstadoTurnoApi(estado: string | null | undefined): string {
  const key = String(estado ?? '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
  if (!key) return '—'
  const etiquetas: Record<string, string> = {
    INICIADO: 'Iniciado',
    FINALIZADO: 'Finalizado',
    CANCELADO: 'Cancelado',
    REPROGRAMADO: 'Reprogramado',
    PENDIENTE: 'Pendiente',
    CONFIRMADO: 'Confirmado',
  }
  return etiquetas[key] ?? String(estado).trim()
}

export function clasesBadgeEstadoTurnoApi(estado: string | null | undefined): string {
  const key = String(estado ?? '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
  const map: Record<string, string> = {
    INICIADO: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
    FINALIZADO: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    CANCELADO: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    REPROGRAMADO: 'bg-sky-50 text-sky-800 ring-1 ring-sky-200',
    PENDIENTE: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    CONFIRMADO: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  }
  return map[key] ?? 'bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200'
}

export function clasesBadgeEstadoTurno(estado: string | null | undefined): string {
  const clave = claveEstadoTurno(estado)
  const map: Record<ClaveEstadoTurno, string> = {
    confirmado: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    en_curso: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
    completado: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    cancelado: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    pendiente: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  }
  return map[clave] ?? map.pendiente
}

export function formatoFechaTurno(turno: TurnosI): string {
  const iso = normalizarFechaTurnoApi(turno.fecha)
  if (!iso) return '—'
  const parsed = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return iso
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

export function formatoHoraTurno(turno: TurnosI): string {
  return String(turno.horario?.horaInicio ?? '--:--').slice(0, 5)
}

export function nombreClienteTurno(turno: TurnosI): string {
  return `${turno.usuario?.nombre ?? ''} ${turno.usuario?.apellido ?? ''}`.trim() || 'Cliente sin nombre'
}

export function nombreBarberoTurno(turno: TurnosI): string {
  const barbero = barberoDelTurno(turno)
  return `${barbero?.nombre ?? ''} ${barbero?.apellido ?? ''}`.trim() || 'Sin asignar'
}

export function nombreServicioTurno(turno: TurnosI): string {
  return String(turno.servicio?.nombre ?? 'Servicio sin nombre')
}

export function medioPagoTurno(turno: TurnosI): string {
  const raw = String((turno as TurnosI & { tipoPago?: { nombre?: string } }).tipoPago?.nombre ?? '').trim()
  if (raw) return raw
  return turno.preference_id ? 'Mercado Pago' : 'No especificado'
}

export function telefonoClienteTurno(turno: TurnosI): string {
  return turno.usuario?.telefono ?? '—'
}

export function precioTurno(turno: TurnosI): number {
  return parsePrecio(turno.servicio?.precio)
}

export function esTurnoActivo(turno: TurnosI): boolean {
  const clave = claveEstadoTurno(turno.estado)
  return clave !== 'completado' && clave !== 'cancelado'
}

export function esTurnoEnCurso(turno: TurnosI): boolean {
  return claveEstadoTurno(turno.estado) === 'en_curso'
}

export function turnoCoincideBusqueda(turno: TurnosI, termino: string): boolean {
  const t = termino.trim().toLowerCase()
  if (!t) return true
  return (
    nombreClienteTurno(turno).toLowerCase().includes(t) ||
    nombreBarberoTurno(turno).toLowerCase().includes(t) ||
    nombreServicioTurno(turno).toLowerCase().includes(t) ||
    formatoEstadoTurno(turno).toLowerCase().includes(t) ||
    medioPagoTurno(turno).toLowerCase().includes(t)
  )
}

export function construirResumenTurnosAdmin(turnos: TurnosI[]): ResumenTurnosAdmin {
  return {
    total: turnos.length,
    confirmados: turnos.filter((t) => claveEstadoTurno(t.estado) === 'confirmado').length,
    enCurso: turnos.filter((t) => claveEstadoTurno(t.estado) === 'en_curso').length,
    completados: turnos.filter((t) => claveEstadoTurno(t.estado) === 'completado').length,
    pendientes: turnos.filter((t) => claveEstadoTurno(t.estado) === 'pendiente').length,
    cancelados: turnos.filter((t) => claveEstadoTurno(t.estado) === 'cancelado').length,
    ingresos: turnos
      .filter((t) => claveEstadoTurno(t.estado) === 'completado')
      .reduce((acc, t) => acc + precioTurno(t), 0),
  }
}
