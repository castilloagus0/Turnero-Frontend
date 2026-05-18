import type { Horarios } from '../interface/horarios.interface'

export function formatoHoraHorario(valor: string | null | undefined): string {
  return String(valor ?? '').slice(0, 5) || '—'
}

export function etiquetaEstadoHorario(horario: Horarios): string {
  return horario.activo !== false ? 'Activo' : 'Inactivo'
}

export function clasesBadgeEstadoHorario(horario: Horarios): string {
  return horario.activo !== false
    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    : 'bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200'
}
