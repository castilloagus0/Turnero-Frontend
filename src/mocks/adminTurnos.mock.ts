export type TurnoStatus = 'confirmado' | 'en_curso' | 'completado' | 'cancelado' | 'pendiente'

export type TurnoItem = {
  id: number
  fecha: string
  hora: string
  cliente: string
  clienteTelefono: string
  barberoId: number
  barbero: string
  servicioId: number
  servicio: string
  duracionMin: number
  precio: number
  medioPagoId: number
  medioPago: string
  status: TurnoStatus
  observaciones?: string
}

export type TurnoSummary = {
  total: number
  confirmados: number
  enCurso: number
  completados: number
  pendientes: number
  cancelados: number
  ingresos: number
}

export type AdminTurnosData = {
  generatedAt: string
  summary: TurnoSummary
  turnos: TurnoItem[]
}

const TURNOS: TurnoItem[] = [
  {
    id: 101,
    fecha: '2026-05-06',
    hora: '09:00',
    cliente: 'Luis Ramírez',
    clienteTelefono: '+54 9 11 5566 7788',
    barberoId: 1,
    barbero: 'Marco Polo',
    servicioId: 1,
    servicio: 'Corte Clásico',
    duracionMin: 30,
    precio: 19000,
    medioPagoId: 2,
    medioPago: 'Efectivo',
    status: 'confirmado',
    observaciones: 'Prefiere tijera en laterales.',
  },
  {
    id: 102,
    fecha: '2026-05-06',
    hora: '09:45',
    cliente: 'Diego Fernández',
    clienteTelefono: '+54 9 11 3344 9988',
    barberoId: 2,
    barbero: 'Julián Ortega',
    servicioId: 2,
    servicio: 'Corte + Barba',
    duracionMin: 60,
    precio: 32000,
    medioPagoId: 1,
    medioPago: 'Mercado Pago',
    status: 'en_curso',
  },
  {
    id: 103,
    fecha: '2026-05-06',
    hora: '10:30',
    cliente: 'Andrés Silva',
    clienteTelefono: '+54 9 11 2211 3344',
    barberoId: 1,
    barbero: 'Marco Polo',
    servicioId: 3,
    servicio: 'Arreglo de Barba',
    duracionMin: 20,
    precio: 14000,
    medioPagoId: 3,
    medioPago: 'Transferencia',
    status: 'pendiente',
  },
  {
    id: 104,
    fecha: '2026-05-06',
    hora: '11:00',
    cliente: 'Carlos Ortega',
    clienteTelefono: '+54 9 11 9988 7766',
    barberoId: 3,
    barbero: 'Franco Ruiz',
    servicioId: 4,
    servicio: 'Corte Premium',
    duracionMin: 45,
    precio: 36000,
    medioPagoId: 1,
    medioPago: 'Mercado Pago',
    status: 'confirmado',
  },
  {
    id: 105,
    fecha: '2026-05-06',
    hora: '12:00',
    cliente: 'Matías López',
    clienteTelefono: '+54 9 11 7878 1212',
    barberoId: 4,
    barbero: 'Tomás Vera',
    servicioId: 1,
    servicio: 'Corte Clásico',
    duracionMin: 30,
    precio: 19000,
    medioPagoId: 2,
    medioPago: 'Efectivo',
    status: 'completado',
  },
  {
    id: 106,
    fecha: '2026-05-06',
    hora: '13:15',
    cliente: 'Nicolás Pérez',
    clienteTelefono: '+54 9 11 5656 1010',
    barberoId: 2,
    barbero: 'Julián Ortega',
    servicioId: 2,
    servicio: 'Corte + Barba',
    duracionMin: 60,
    precio: 32000,
    medioPagoId: 1,
    medioPago: 'Mercado Pago',
    status: 'cancelado',
    observaciones: 'Canceló por viaje de último momento.',
  },
]

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

export function getMockAdminTurnos(): AdminTurnosData {
  return {
    generatedAt: new Date().toISOString(),
    summary: buildSummary(TURNOS),
    turnos: TURNOS,
  }
}
