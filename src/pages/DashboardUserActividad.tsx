import { useEffect, useMemo, useState } from 'react'
import type { TurnosI } from '../interface/turnos.interface'
import { barberoDelTurno, formatDateLabel, formatPriceARS, normalizeStatus, parsePrecio } from './dashboardUserUtils'

const PRIMARY = '#1D4ED8'
const ACTIVITY_PAGE_SIZE = 10

function ScissorsLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ReceiptIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ServiceRowIcon({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 ${className ?? ''}`}
    >
      <ScissorsLogo className="h-4 w-4" />
    </span>
  )
}

type Props = {
  turnos: TurnosI[]
  turnosLoading: boolean
  turnosError: string | null
}

type ActivityStatusFilter = 'TODOS' | 'PENDIENTE' | 'CONFIRMADO' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO'

function getTurnoDateKey(fecha: string | undefined): string {
  if (!fecha) return ''
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(fecha)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`
  const parsed = new Date(fecha)
  if (Number.isNaN(parsed.getTime())) return ''
  const y = parsed.getFullYear()
  const m = String(parsed.getMonth() + 1).padStart(2, '0')
  const d = String(parsed.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function StatusPill({ estado }: { estado: unknown }) {
  const status = normalizeStatus(estado)

  if (status === 'CONFIRMADO') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
        <ReceiptIcon className="h-3 w-3" />
        Confirmado
      </span>
    )
  }

  if (status === 'PENDIENTE') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-800">
        <ReceiptIcon className="h-3 w-3" />
        Pendiente
      </span>
    )
  }

  if (status === 'EN_CURSO') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
        <ReceiptIcon className="h-3 w-3" />
        En curso
      </span>
    )
  }

  if (status === 'COMPLETADO') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        <ReceiptIcon className="h-3 w-3" />
        Finalizado
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
      <ReceiptIcon className="h-3 w-3" />
      Cancelado
    </span>
  )
}

export default function DashboardUserActividad({ turnos, turnosLoading, turnosError }: Props) {
  const [activityPage, setActivityPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<ActivityStatusFilter>('TODOS')
  const [dateFilter, setDateFilter] = useState('')

  const filteredTurnos = useMemo(() => {
    return turnos.filter((turno) => {
      const statusOk = statusFilter === 'TODOS' || normalizeStatus(turno.estado) === statusFilter
      const dateOk = !dateFilter || getTurnoDateKey(turno.fecha) === dateFilter
      return statusOk && dateOk
    })
  }, [dateFilter, statusFilter, turnos])

  const activityTotalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredTurnos.length / ACTIVITY_PAGE_SIZE)),
    [filteredTurnos.length],
  )

  useEffect(() => {
    setActivityPage((page) => Math.min(Math.max(1, page), activityTotalPages))
  }, [activityTotalPages])

  useEffect(() => {
    setActivityPage(1)
  }, [statusFilter, dateFilter])

  const activityPageSlice = useMemo(() => {
    const start = (activityPage - 1) * ACTIVITY_PAGE_SIZE
    return filteredTurnos.slice(start, start + ACTIVITY_PAGE_SIZE)
  }, [activityPage, filteredTurnos])

  const activityRangeLabel = useMemo(() => {
    const total = filteredTurnos.length
    if (total === 0) return '0 registros'
    const from = (activityPage - 1) * ACTIVITY_PAGE_SIZE + 1
    const to = Math.min(activityPage * ACTIVITY_PAGE_SIZE, total)
    return `${from}-${to} de ${total}`
  }, [activityPage, filteredTurnos.length])

  return (
    <section className="mt-8 rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
      <div className="flex flex-col gap-1 border-b border-neutral-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h2 className="text-lg font-bold text-neutral-900">Historial de turnos</h2>
      </div>
      {turnosLoading ? (
        <div className="px-4 py-10 text-center text-sm text-neutral-500 sm:px-6">Cargando historial...</div>
      ) : turnosError ? (
        <div className="px-4 py-10 text-center text-sm text-red-600 sm:px-6">{turnosError}</div>
      ) : (
        <>
          <div className="flex flex-col gap-3 border-b border-neutral-100 px-4 py-4 sm:flex-row sm:items-end sm:gap-4 sm:px-6">
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Estado</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ActivityStatusFilter)}
                className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#1D4ED8]"
              >
                <option value="TODOS">Todos</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="CONFIRMADO">Confirmado</option>
                <option value="EN_CURSO">En curso</option>
                <option value="COMPLETADO">Finalizado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </label>
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Fecha</span>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#1D4ED8]"
              />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  <th className="px-4 py-3 sm:px-6">Servicio</th>
                  <th className="hidden px-2 py-3 sm:table-cell">Fecha</th>
                  <th className="hidden px-2 py-3 md:table-cell">Barbero</th>
                  <th className="px-2 py-3">Monto</th>
                  <th className="px-4 py-3 text-right sm:px-6">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {activityPageSlice.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-neutral-500 sm:px-6">
                      No hay turnos para mostrar.
                    </td>
                  </tr>
                ) : (
                  activityPageSlice.map((turno) => (
                    <tr key={turno.id} className="hover:bg-neutral-50/80">
                      <td className="px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-3">
                          <ServiceRowIcon />
                          <span className="font-semibold text-neutral-900">{turno.servicio?.nombre}</span>
                        </div>
                      </td>
                      <td className="hidden whitespace-nowrap px-2 py-3 text-neutral-500 sm:table-cell">
                        {formatDateLabel(turno.fecha)}
                      </td>
                      <td className="hidden whitespace-nowrap px-2 py-3 text-neutral-500 md:table-cell">
                        {barberoDelTurno(turno)?.nombre} {barberoDelTurno(turno)?.apellido}
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 font-bold text-neutral-900">
                        ${formatPriceARS(parsePrecio(turno.servicio?.precio))}
                      </td>
                      <td className="px-4 py-3 text-right sm:px-6">
                        <StatusPill estado={turno.estado} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredTurnos.length > 0 ? (
            <div className="flex flex-col gap-3 border-t border-neutral-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-neutral-500">
                Mostrando <span className="font-semibold text-neutral-700">{activityRangeLabel}</span>
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Página anterior"
                    disabled={activityPage <= 1}
                    onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-[#1D4ED8]/35 hover:bg-[#1D4ED8]/5 disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Página siguiente"
                    disabled={activityPage >= activityTotalPages}
                    onClick={() => setActivityPage((p) => Math.min(activityTotalPages, p + 1))}
                    className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-[#1D4ED8]/35 hover:bg-[#1D4ED8]/5 disabled:pointer-events-none disabled:opacity-40"
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
                <nav className="flex flex-wrap items-center gap-1.5" aria-label="Paginación">
                  {activityTotalPages <= 8 ? (
                    Array.from({ length: activityTotalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setActivityPage(page)}
                        className={`min-w-9 rounded-lg px-2 py-1.5 text-sm font-semibold transition ${
                          activityPage === page
                            ? 'text-white shadow-sm'
                            : 'border border-neutral-200 bg-white text-neutral-600 hover:border-[#1D4ED8]/40 hover:bg-[#1D4ED8]/5'
                        }`}
                        style={activityPage === page ? { backgroundColor: PRIMARY } : undefined}
                        aria-current={activityPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    ))
                  ) : (
                    <span className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-1.5 text-sm font-semibold text-neutral-700">
                      Página {activityPage} / {activityTotalPages}
                    </span>
                  )}
                </nav>
              </div>
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}
