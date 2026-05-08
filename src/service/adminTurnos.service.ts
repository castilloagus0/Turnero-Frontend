import axios from 'axios'
import type { TurnosI } from '../interface/turnos.interface'
import type { AdminTurnosData, TurnoItem, TurnoStatus, TurnoSummary } from '../mocks/adminTurnos.mock'

function normalizeStatus(estado: string | null | undefined): TurnoStatus {
  const raw = String(estado ?? '').trim().toLowerCase()
  if (raw === 'confirmado' || raw === 'confirmada') return 'confirmado'
  if (raw === 'en_curso' || raw === 'en curso') return 'en_curso'
  if (raw === 'completado' || raw === 'completada' || raw === 'finalizado' || raw === 'finalizada') return 'completado'
  if (raw === 'cancelado' || raw === 'cancelada') return 'cancelado'
  return 'pendiente'
}

function getResponseList(response: unknown): TurnosI[] {
  if (Array.isArray(response)) return response as TurnosI[]
  if (response && typeof response === 'object') {
    const maybe = response as { turnos?: unknown; data?: unknown; rows?: unknown }
    if (Array.isArray(maybe.turnos)) return maybe.turnos as TurnosI[]
    if (Array.isArray(maybe.data)) return maybe.data as TurnosI[]
    if (Array.isArray(maybe.rows)) return maybe.rows as TurnosI[]
  }
  return []
}

function buildSummary(turnos: TurnoItem[]): TurnoSummary {
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

function buildPhone(turno: TurnosI): string {
  return turno.usuario?.telefono ?? '-'
}

function buildPaymentLabel(turno: TurnosI): string {
  const raw = String((turno as TurnosI & { tipoPago?: { nombre?: string } }).tipoPago?.nombre ?? '').trim()
  if (raw) return raw
  return turno.preference_id ? 'Mercado Pago' : 'No especificado'
}

function toTurnoItem(turno: TurnosI): TurnoItem {
  const barbero = turno.barbero ?? turno.barbero_id
  const precio = Number(turno.servicio?.precio ?? 0)
  return {
    id: Number(turno.id),
    fecha: String(turno.fecha ?? ''),
    hora: String(turno.horario?.horaInicio ?? '--:--').slice(0, 5),
    cliente: `${turno.usuario?.nombre ?? ''} ${turno.usuario?.apellido ?? ''}`.trim() || 'Cliente sin nombre',
    clienteTelefono: buildPhone(turno),
    barberoId: Number(barbero?.id ?? 0),
    barbero: `${barbero?.nombre ?? ''} ${barbero?.apellido ?? ''}`.trim() || 'Sin asignar',
    servicioId: Number(turno.servicio?.id ?? 0),
    servicio: turno.servicio?.nombre ?? 'Servicio sin nombre',
    duracionMin: Number(turno.servicio?.duracionAproximada ?? 0),
    precio: Number.isFinite(precio) ? precio : 0,
    medioPagoId: 0,
    medioPago: buildPaymentLabel(turno),
    status: normalizeStatus(turno.estado),
    observaciones: turno.resenia ?? undefined,
  }
}

export async function getAdminTurnos(): Promise<AdminTurnosData> {
  const response = await axios.get(`${import.meta.env.VITE_URL_API}turno`)
  const sourceTurnos = getResponseList(response.data)
  const turnos = sourceTurnos.map(toTurnoItem)
  return {
    generatedAt: new Date().toISOString(),
    summary: buildSummary(turnos),
    turnos,
  }
}
