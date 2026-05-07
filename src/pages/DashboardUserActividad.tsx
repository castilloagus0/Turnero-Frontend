import { useEffect, useMemo, useState } from 'react'
import type { TurnosI } from '../interface/turnos.interface'
import { barberoDelTurno, formatDateLabel, formatPriceARS, parsePrecio } from './dashboardUserUtils'

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

export default function DashboardUserActividad({ turnos, turnosLoading, turnosError }: Props) {
  const [activityPage, setActivityPage] = useState(1)

  const activityTotalPages = useMemo(
    () => Math.max(1, Math.ceil(turnos.length / ACTIVITY_PAGE_SIZE)),
    [turnos.length],
  )

  useEffect(() => {
    setActivityPage((page) => Math.min(Math.max(1, page), activityTotalPages))
  }, [activityTotalPages])

  const activityPageSlice = useMemo(() => {
    const start = (activityPage - 1) * ACTIVITY_PAGE_SIZE
    return turnos.slice(start, start + ACTIVITY_PAGE_SIZE)
  }, [activityPage, turnos])

  const activityRangeLabel = useMemo(() => {
    const total = turnos.length
    if (total === 0) return '0 registros'
    const from = (activityPage - 1) * ACTIVITY_PAGE_SIZE + 1
    const to = Math.min(activityPage * ACTIVITY_PAGE_SIZE, total)
    return `${from}-${to} de ${total}`
  }, [activityPage, turnos.length])

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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  <th className="px-4 py-3 sm:px-6">Servicio</th>
                  <th className="hidden px-2 py-3 sm:table-cell">Fecha</th>
                  <th className="hidden px-2 py-3 md:table-cell">Barbero</th>
                  <th className="px-2 py-3">Monto</th>
                  {/* <th className="px-4 py-3 text-right sm:px-6">Acción</th> */}
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
                      {/* <td className="px-4 py-3 text-right sm:px-6">
                        <button
                          type="button"
                          className="inline-flex rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-[#1D4ED8]"
                          aria-label="Ver comprobante"
                        >
                          <ReceiptIcon className="h-5 w-5" />
                        </button>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {turnos.length > 0 ? (
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
