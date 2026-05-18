import type { TurnosI } from '../../interface/turnos.interface'
import {
  construirResumenTurnosAdmin,
  esTurnoActivo,
  formatoHoraTurno,
  normalizarFechaTurnoApi,
  type ResumenTurnosAdmin,
} from '../../utils/turnoDisplayUtils'

export type AgendaDiaAdmin = {
  generadoEn: string
  resumenDelDia: ResumenTurnosAdmin
  proximosTurnos: TurnosI[]
}

export function obtenerFechaLocalIso(referencia: Date = new Date()): string {
  const y = referencia.getFullYear()
  const m = String(referencia.getMonth() + 1).padStart(2, '0')
  const d = String(referencia.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function ordenarTurnosPorHora(a: TurnosI, b: TurnosI): number {
  return formatoHoraTurno(a).localeCompare(formatoHoraTurno(b), 'es', { numeric: true })
}

function esProximoEnAgenda(turno: TurnosI, fechaIso: string): boolean {
  if (normalizarFechaTurnoApi(turno.fecha) !== fechaIso) return false
  return esTurnoActivo(turno)
}

function ordenarTurnosPorFechaYHora(a: TurnosI, b: TurnosI): number {
  const cmpFecha = normalizarFechaTurnoApi(a.fecha).localeCompare(normalizarFechaTurnoApi(b.fecha))
  if (cmpFecha !== 0) return cmpFecha
  return ordenarTurnosPorHora(a, b)
}

export function construirAgendaDelDia(turnos: TurnosI[], generadoEn = new Date().toISOString()): AgendaDiaAdmin {
  const hoy = obtenerFechaLocalIso()
  const turnosDelDia = turnos.filter((t) => normalizarFechaTurnoApi(t.fecha) === hoy)
  let proximos = turnosDelDia.filter((t) => esProximoEnAgenda(t, hoy)).sort(ordenarTurnosPorHora)

  if (proximos.length === 0) {
    proximos = turnos.filter(esTurnoActivo).sort(ordenarTurnosPorFechaYHora)
  }

  return {
    generadoEn,
    resumenDelDia: construirResumenTurnosAdmin(turnosDelDia),
    proximosTurnos: proximos,
  }
}
