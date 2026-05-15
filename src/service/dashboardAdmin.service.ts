import type { Barbero } from '../interface/barbero.interface'
import type { Servicios } from '../interface/servicios.interface'
import type { TurnoItem, TurnoSummary } from '../mocks/adminTurnos.mock'
import { getAdminTurnos } from './adminTurnos.service'
import { getBarberos } from './barbero.service'
import { getServicios } from './servicios.service'

export type AgendaDiaAdmin = {
  generadoEn: string
  resumenDelDia: TurnoSummary
  proximosTurnos: TurnoItem[]
}

// Devuelve la fecha local del dispositivo en formato ISO YYYY-MM-DD para cruzar con turno.fecha.
function obtenerFechaLocalIso(referencia: Date = new Date()): string {
  const y = referencia.getFullYear()
  const m = String(referencia.getMonth() + 1).padStart(2, '0')
  const d = String(referencia.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Arma el conteo de estados solo para la lista de turnos recibida (típicamente los del día).
function construirResumenTurnos(turnos: TurnoItem[]): TurnoSummary {
  return {
    total: turnos.length,
    confirmados: turnos.filter((t) => t.status === 'confirmado').length,
    enCurso: turnos.filter((t) => t.status === 'en_curso').length,
    completados: turnos.filter((t) => t.status === 'completado').length,
    pendientes: turnos.filter((t) => t.status === 'pendiente').length,
    cancelados: turnos.filter((t) => t.status === 'cancelado').length,
    ingresos: turnos.filter((t) => t.status === 'completado').reduce((acc, t) => acc + t.precio, 0),
  }
}

// Ordena por hora de inicio ascendente para mostrar la cola del día.
function ordenarTurnosPorHora(a: TurnoItem, b: TurnoItem): number {
  return a.hora.localeCompare(b.hora, 'es', { numeric: true })
}

// Indica si el turno sigue en agenda (no finalizado ni anulado) y corresponde al día indicado.
function esProximoEnAgenda(turno: TurnoItem, fechaIso: string): boolean {
  if (turno.fecha.slice(0, 10) !== fechaIso) return false
  if (turno.status === 'completado' || turno.status === 'cancelado') return false
  return true
}

// Consulta la API de turnos y devuelve resumen del día más la cola ordenada de próximos turnos.
export async function obtenerAgendaDelDiaParaPanelAdmin(): Promise<AgendaDiaAdmin> {
  const data = await getAdminTurnos()
  const hoy = obtenerFechaLocalIso()
  const turnosDelDia = data.turnos.filter((t) => t.fecha.slice(0, 10) === hoy)
  const proximos = turnosDelDia.filter((t) => esProximoEnAgenda(t, hoy)).sort(ordenarTurnosPorHora)
  return {
    generadoEn: data.generatedAt,
    resumenDelDia: construirResumenTurnos(turnosDelDia),
    proximosTurnos: proximos,
  }
}

// Trae la plantilla de barberos desde la API; en el panel se muestran como usuarios activos del negocio.
export async function obtenerUsuariosActivos(): Promise<Barbero[]> {
  const list = await getBarberos()
  return Array.isArray(list) ? (list as Barbero[]) : []
}

// Devuelve servicios del catálogo que están marcados como activos para ofrecer al cliente.
export async function obtenerServicios(): Promise<Servicios[]> {
  const data = await getServicios()
  const list = Array.isArray(data) ? (data as Servicios[]) : []
  return list.filter((s) => s.activo)
}
