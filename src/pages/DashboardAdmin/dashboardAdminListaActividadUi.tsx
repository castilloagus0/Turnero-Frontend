import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { PRIMARY_ADMIN } from './adminDashboardUi'

const PRIMARY = PRIMARY_ADMIN

export const ADMIN_LIST_PAGE_SIZE = 10

// Paginación local sobre un array ya filtrado (misma idea que el historial de turnos del usuario).
export function usePaginaListaAdmin<T>(items: T[], pageSize: number = ADMIN_LIST_PAGE_SIZE) {
  const [pagina, setPagina] = useState(1)
  const totalPaginas = Math.max(1, Math.ceil(items.length / pageSize))

  useEffect(() => {
    setPagina((p) => Math.min(Math.max(1, p), totalPaginas))
  }, [totalPaginas])

  const trozo = useMemo(() => {
    const inicio = (pagina - 1) * pageSize
    return items.slice(inicio, inicio + pageSize)
  }, [items, pagina, pageSize])

  const etiquetaRango = useMemo(() => {
    const total = items.length
    if (total === 0) return '0 registros'
    const desde = (pagina - 1) * pageSize + 1
    const hasta = Math.min(pagina * pageSize, total)
    return `${desde}-${hasta} de ${total}`
  }, [items.length, pagina, pageSize])

  return { pagina, setPagina, totalPaginas, trozo, etiquetaRango }
}

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

export function FilaIconoAdmin({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 ${className ?? ''}`}
    >
      <ScissorsLogo className="h-4 w-4" />
    </span>
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

type PaginacionProps = {
  pagina: number
  totalPaginas: number
  etiquetaRango: string
  totalFiltrados: number
  onCambiarPagina: (pagina: number) => void
}

// Misma UX que el historial del usuario: anterior / siguiente y botones de página.
export function PaginacionEstiloHistorial({
  pagina,
  totalPaginas,
  etiquetaRango,
  totalFiltrados,
  onCambiarPagina,
}: PaginacionProps) {
  if (totalFiltrados <= 0) return null

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-neutral-500">
        Mostrando <span className="font-semibold text-neutral-700">{etiquetaRango}</span>
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Página anterior"
            disabled={pagina <= 1}
            onClick={() => onCambiarPagina(Math.max(1, pagina - 1))}
            className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-[#1D4ED8]/35 hover:bg-[#1D4ED8]/5 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>
          <button
            type="button"
            aria-label="Página siguiente"
            disabled={pagina >= totalPaginas}
            onClick={() => onCambiarPagina(Math.min(totalPaginas, pagina + 1))}
            className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-[#1D4ED8]/35 hover:bg-[#1D4ED8]/5 disabled:pointer-events-none disabled:opacity-40"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex flex-wrap items-center gap-1.5" aria-label="Paginación">
          {totalPaginas <= 8 ? (
            Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onCambiarPagina(p)}
                className={`min-h-11 min-w-11 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  pagina === p
                    ? 'text-white shadow-sm'
                    : 'border border-neutral-200 bg-white text-neutral-600 hover:border-[#1D4ED8]/40 hover:bg-[#1D4ED8]/5'
                }`}
                style={pagina === p ? { backgroundColor: PRIMARY } : undefined}
                aria-current={pagina === p ? 'page' : undefined}
              >
                {p}
              </button>
            ))
          ) : (
            <span className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-1.5 text-sm font-semibold text-neutral-700">
              Página {pagina} / {totalPaginas}
            </span>
          )}
        </nav>
      </div>
    </div>
  )
}

type EnvoltorioProps = {
  tituloSeccion: string
  cargando: boolean
  error: string | null
  filtros: ReactNode
  tabla: ReactNode
  piePaginacion: ReactNode | null
}

// Contenedor alineado a `DashboardUserActividad`: card blanca, título, estado y cuerpo.
export function SeccionListaEstiloHistorialAdmin({
  tituloSeccion,
  cargando,
  error,
  filtros,
  tabla,
  piePaginacion,
}: EnvoltorioProps) {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-1 border-b border-neutral-100 bg-gradient-to-r from-neutral-50/90 to-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h2 className="text-lg font-bold tracking-tight text-neutral-900">{tituloSeccion}</h2>
      </div>
      {cargando ? (
        <div className="px-4 py-10 text-center text-sm text-neutral-500 sm:px-6">Cargando...</div>
      ) : error ? (
        <div className="px-4 py-10 text-center text-sm text-red-600 sm:px-6">{error}</div>
      ) : (
        <>
          {filtros}
          {tabla}
          {piePaginacion}
        </>
      )}
    </section>
  )
}
