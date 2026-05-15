import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { AgendaDiaAdmin } from '../../service/dashboardAdmin.service'
import { obtenerAgendaDelDiaParaPanelAdmin } from '../../service/dashboardAdmin.service'
import type { TurnoItem } from '../../mocks/adminTurnos.mock'
import {
  AgendaRow,
  BanknoteIcon,
  CalendarIcon,
  etiquetaEstadoParaAgenda,
  formatFechaHora24hEsAr,
  formatMonedaArs,
  inicialesDesdeNombreCompleto,
  PRIMARY_ADMIN,
  ScissorsIcon,
  TarjetaStatAdmin,
  WalletIcon,
} from './adminDashboardUi'

type EstadoCarga = { tipo: 'cargando' } | { tipo: 'error'; mensaje: string } | { tipo: 'ok'; datos: AgendaDiaAdmin }

// Ubica el turno en curso o, si no hay, el primero de la cola para el bloque lateral "siguiente".
function resolverTurnoDestacado(turnos: TurnoItem[]): TurnoItem | null {
  const enCurso = turnos.find((t) => t.status === 'en_curso')
  if (enCurso) return enCurso
  return turnos[0] ?? null
}

export default function DashboardAdminProximosTurnos() {
  const location = useLocation()
  const [estado, setEstado] = useState<EstadoCarga>({ tipo: 'cargando' })

  const basePath = useMemo(
    () => (location.pathname.startsWith('/admin/dashboard') ? '/admin/dashboard' : '/admin-dashboard'),
    [location.pathname],
  )

  useEffect(() => {
    let cancelado = false
    setEstado({ tipo: 'cargando' })
    obtenerAgendaDelDiaParaPanelAdmin()
      .then((datos) => {
        if (cancelado) return
        setEstado({ tipo: 'ok', datos })
      })
      .catch((error: unknown) => {
        if (cancelado) return
        const mensaje = error instanceof Error ? error.message : 'No se pudo cargar la agenda del día.'
        setEstado({ tipo: 'error', mensaje })
      })
    return () => {
      cancelado = true
    }
  }, [])

  const destacado = useMemo(() => {
    if (estado.tipo !== 'ok') return null
    return resolverTurnoDestacado(estado.datos.proximosTurnos)
  }, [estado])

  if (estado.tipo === 'cargando') {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-neutral-500">Cargando próximos turnos...</p>
      </div>
    )
  }

  if (estado.tipo === 'error') {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
        <p className="text-sm font-semibold text-red-800">No se pudo cargar la agenda</p>
        <p className="mt-1 text-sm text-red-700">{estado.mensaje}</p>
      </div>
    )
  }

  const { resumenDelDia, proximosTurnos, generadoEn } = estado.datos
  const citasActivas = resumenDelDia.confirmados + resumenDelDia.enCurso + resumenDelDia.pendientes

  return (
    <div className="flex flex-1 flex-col gap-6 lg:flex-row">
      <main className="min-w-0 flex-1 space-y-6">
        <p className="text-xs font-medium text-neutral-500">
          Última actualización:{' '}
          <time dateTime={generadoEn} className="text-neutral-600">
            {formatFechaHora24hEsAr(generadoEn)}
          </time>
        </p>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <TarjetaStatAdmin
            titulo="Turnos del día"
            valor={String(resumenDelDia.total)}
            detalle={`${resumenDelDia.completados} hechos`}
            variante="emerald"
            icono={<BanknoteIcon className="h-6 w-6" />}
          />
          <TarjetaStatAdmin
            titulo="En agenda activa"
            valor={String(citasActivas)}
            detalle={`${resumenDelDia.enCurso} en curso`}
            variante="blue"
            icono={<CalendarIcon className="h-6 w-6" />}
          />
          <TarjetaStatAdmin
            titulo="Ingresos cerrados (hoy)"
            valor={formatMonedaArs(resumenDelDia.ingresos)}
            variante="orange"
            icono={<WalletIcon className="h-6 w-6" />}
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
          <div className="flex flex-col gap-4 border-b border-neutral-100 bg-gradient-to-r from-neutral-50/90 to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold tracking-tight text-neutral-900">Cola del día</h2>
            <Link
              to={`${basePath}/admin-turnos`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#1D4ED8] transition hover:underline"
            >
              Ver gestión completa
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div>
            {proximosTurnos.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-neutral-500">No hay turnos pendientes para hoy.</p>
            ) : (
              proximosTurnos.map((turno) => (
                <AgendaRow
                  key={turno.id}
                  time={turno.hora}
                  duration={`${turno.duracionMin} MIN`}
                  client={turno.cliente}
                  clientInitials={inicialesDesdeNombreCompleto(turno.cliente)}
                  service={turno.servicio}
                  status={etiquetaEstadoParaAgenda(turno.status)}
                  barber={turno.barbero}
                  highlight={turno.status === 'en_curso'}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <aside className="flex w-full shrink-0 flex-col gap-5 lg:w-[300px] xl:w-[320px]">
        <section
          className="overflow-hidden rounded-2xl p-5 text-white shadow-lg shadow-blue-900/15"
          style={{ backgroundColor: PRIMARY_ADMIN }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">ATENCIÓN INMEDIATA</p>
          {destacado ? (
            <>
              <p className="mt-3 text-xl font-bold">{destacado.cliente}</p>
              <div className="mt-3 flex items-start gap-2 text-sm text-white/95">
                <ScissorsIcon className="mt-0.5 h-5 w-5 shrink-0 text-white/90" />
                <span>{destacado.servicio}</span>
              </div>
              <p className="mt-2 text-sm text-white/90">
                {destacado.hora} · {destacado.barbero}
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm text-white/90">No hay turnos en cola por ahora.</p>
          )}
        </section>

        <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">RESUMEN RÁPIDO</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Pendientes</span>
              <span className="font-bold text-neutral-900">{resumenDelDia.pendientes}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Confirmados</span>
              <span className="font-bold text-neutral-900">{resumenDelDia.confirmados}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Analíticas</span>
              <Link to={`${basePath}/analiticas`} className="font-semibold text-[#1D4ED8] transition hover:underline">
                Abrir
              </Link>
            </div>
          </div>
        </section>
      </aside>
    </div>
  )
}
