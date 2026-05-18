import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  clasesBadgeEstadoTurnoApi,
  etiquetaEstadoTurnoApi,
  formatoFechaTurno,
  formatoHoraTurno,
  nombreBarberoTurno,
  nombreClienteTurno,
  nombreServicioTurno,
} from '../../utils/turnoDisplayUtils'
import { PaginacionEstiloHistorial } from './dashboardAdminListaActividadUi'
import { useAdminTurnosProximos } from './useAdminTurnosProximos'
import {
  AgendaRow,
  CalendarIcon,
  formatFechaHora24hEsAr,
  inicialesDesdeNombreCompleto,
  PRIMARY_ADMIN,
  ScissorsIcon,
} from './adminDashboardUi'

export default function DashboardAdminProximosTurnos() {
  const location = useLocation()
  const {
    pagina,
    setPagina,
    turnos,
    totalPaginas,
    totalRegistros,
    etiquetaRango,
    cargandoTurnos,
    errorCargaTurnos,
  } = useAdminTurnosProximos()

  const basePath = useMemo(
    () => (location.pathname.startsWith('/admin/dashboard') ? '/admin/dashboard' : '/admin-dashboard'),
    [location.pathname],
  )

  const generadoEn = useMemo(() => new Date().toISOString(), [turnos])
  const primerTurno = turnos[0] ?? null

  if (cargandoTurnos) {
    return (
      <div className="flex min-h-[240px] w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-neutral-500">Cargando próximos turnos...</p>
      </div>
    )
  }

  if (errorCargaTurnos) {
    return (
      <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-red-800">No se pudo cargar la agenda</p>
        <p className="mt-1 text-sm text-red-700">{errorCargaTurnos}</p>
      </div>
    )
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-neutral-500">
          Última actualización:{' '}
          <time dateTime={generadoEn} className="text-neutral-600">
            {formatFechaHora24hEsAr(generadoEn)}
          </time>
        </p>
        <Link
          to={`${basePath}/admin-turnos`}
          className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-[#1D4ED8] transition hover:underline"
        >
          Ver gestión completa
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Tarjetas superiores: móvil apiladas, desktop en fila */}
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Total próximos */}
        <article className="flex h-full min-h-[148px] flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm ring-1 ring-neutral-100/80 transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1D4ED8]">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600">
              {etiquetaRango}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Próximos turnos</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-neutral-900 tabular-nums">{totalRegistros}</p>
          </div>
        </article>

        {/* Resumen */}

        {/* Siguiente en cola */}
        <article
          className="flex h-full min-h-[148px] flex-col rounded-2xl p-5 text-white shadow-md shadow-blue-900/20 md:col-span-2 xl:col-span-1"
          style={{ backgroundColor: PRIMARY_ADMIN }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">Siguiente en cola</p>
          {primerTurno ? (
            <div className="mt-3 flex min-h-0 flex-1 flex-col justify-center">
              <p className="truncate text-lg font-bold sm:text-xl">{nombreClienteTurno(primerTurno)}</p>
              <div className="mt-2 flex items-start gap-2 text-sm text-white/95">
                <ScissorsIcon className="mt-0.5 h-4 w-4 shrink-0 text-white/90 sm:h-5 sm:w-5" />
                <span className="line-clamp-2">{nombreServicioTurno(primerTurno)}</span>
              </div>
              <p className="mt-2 text-xs text-white/90 sm:text-sm">
                <span className="font-medium">{formatoFechaTurno(primerTurno)}</span>
                <span className="mx-1.5 text-white/50">·</span>
                <span>{formatoHoraTurno(primerTurno)}</span>
                <span className="mx-1.5 text-white/50">·</span>
                <span>{etiquetaEstadoTurnoApi(primerTurno.estado)}</span>
              </p>
              <p className="mt-1 truncate text-xs text-white/75">{nombreBarberoTurno(primerTurno)}</p>
            </div>
          ) : (
            <p className="mt-4 flex flex-1 items-center text-sm text-white/90">No hay turnos en cola por ahora.</p>
          )}
        </article>
      </div>

      {/* Tabla / lista a ancho completo */}
      <section className="w-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm ring-1 ring-neutral-100/80">
        <header className="border-b border-neutral-100 bg-linear-to-r from-neutral-50/90 to-white px-4 py-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold tracking-tight text-neutral-900">Listado de próximos turnos</h2>
          <p className="mt-0.5 text-xs text-neutral-500">Ordenados por fecha y hora según el servidor.</p>
        </header>

        {/* Cabecera de columnas (desktop) */}
        <div
          className="hidden border-b border-neutral-100 bg-neutral-50/80 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 lg:grid lg:grid-cols-4 lg:items-center lg:gap-8 lg:px-8"
          aria-hidden
        >
          <span>Fecha / hora</span>
          <span>Cliente y servicio</span>
          <span>Estado</span>
          <span>Barbero</span>
        </div>

        <div className="divide-y divide-neutral-100">
          {turnos.length === 0 ? (
            <p className="px-4 py-12 text-center text-sm text-neutral-500 sm:px-6 lg:px-8">
              {totalRegistros === 0
                ? 'No hay turnos próximos en el negocio.'
                : 'No hay turnos en esta página.'}
            </p>
          ) : (
            turnos.map((turno) => (
              <AgendaRow
                key={turno.id}
                className="border-b-0 px-4 sm:px-6 lg:grid lg:grid-cols-4 lg:items-center lg:gap-8 lg:px-8"
                fecha={formatoFechaTurno(turno)}
                hora={formatoHoraTurno(turno)}
                estado={etiquetaEstadoTurnoApi(turno.estado)}
                estadoClassName={clasesBadgeEstadoTurnoApi(turno.estado)}
                client={nombreClienteTurno(turno)}
                clientInitials={inicialesDesdeNombreCompleto(nombreClienteTurno(turno))}
                service={nombreServicioTurno(turno)}
                barber={nombreBarberoTurno(turno)}
              />
            ))
          )}
        </div>

        <PaginacionEstiloHistorial
          pagina={pagina}
          totalPaginas={totalPaginas}
          etiquetaRango={etiquetaRango}
          totalFiltrados={totalRegistros}
          onCambiarPagina={setPagina}
        />
      </section>
    </div>
  )
}
