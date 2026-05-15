import { useEffect, useMemo, useState } from 'react'
import type { Servicios } from '../../interface/servicios.interface'
import { getUserProfile } from '../../lib/userProfileStorage'
import { obtenerServicios } from '../../service/dashboardAdmin.service'
import { formatMonedaArs, SearchIcon } from './adminDashboardUi'
import {
  FilaIconoAdmin,
  PaginacionEstiloHistorial,
  SeccionListaEstiloHistorialAdmin,
  usePaginaListaAdmin,
} from './dashboardAdminListaActividadUi'

type EstadoCarga =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'ok'; servicios: Servicios[] }

function servicioCoincideBusqueda(servicio: Servicios, termino: string): boolean {
  const t = termino.trim().toLowerCase()
  if (!t) return true
  const nombre = String(servicio.nombre ?? '').toLowerCase()
  const desc = String(servicio.descripcion ?? '').toLowerCase()
  return nombre.includes(t) || desc.includes(t)
}

export default function DashboardAdminServiciosActivos() {
  const nombreAdmin = getUserProfile()?.name ?? 'Administrador'
  const [estado, setEstado] = useState<EstadoCarga>({ tipo: 'cargando' })
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    let cancelado = false
    setEstado({ tipo: 'cargando' })
    obtenerServicios()
      .then((servicios) => {
        if (cancelado) return
        setEstado({ tipo: 'ok', servicios })
      })
      .catch((error: unknown) => {
        if (cancelado) return
        const mensaje = error instanceof Error ? error.message : 'No se pudo cargar el catálogo.'
        setEstado({ tipo: 'error', mensaje })
      })
    return () => {
      cancelado = true
    }
  }, [])

  const serviciosFiltrados = useMemo(() => {
    if (estado.tipo !== 'ok') return []
    return estado.servicios.filter((s) => servicioCoincideBusqueda(s, busqueda))
  }, [estado, busqueda])

  const { pagina, setPagina, totalPaginas, trozo, etiquetaRango } = usePaginaListaAdmin(serviciosFiltrados)

  useEffect(() => {
    setPagina(1)
  }, [busqueda, setPagina])

  const cargando = estado.tipo === 'cargando'
  const error = estado.tipo === 'error' ? estado.mensaje : null

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Hola, {nombreAdmin}</h1>
          <p className="mt-1 text-sm text-neutral-500 sm:text-base">
            Consultá los servicios activos del catálogo con duración y precio actualizado.
          </p>
        </div>
      </div>

      <SeccionListaEstiloHistorialAdmin
        tituloSeccion="Servicios activos"
        cargando={cargando}
        error={error}
        filtros={
          <div className="flex flex-col gap-3 border-b border-neutral-100 bg-neutral-50/40 px-4 py-4 sm:flex-row sm:items-end sm:gap-4 sm:px-6">
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Buscar</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <SearchIcon className="h-4 w-4" />
                </span>
                <input
                  type="search"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre o descripción del servicio..."
                  className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
                />
              </div>
            </label>
          </div>
        }
        tabla={
          <>
            <ul className="divide-y divide-neutral-100 md:hidden" aria-label="Servicios en vista tarjeta">
              {!cargando && !error && trozo.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-neutral-500 sm:px-6">No hay registros para mostrar.</li>
              ) : (
                trozo.map((servicio) => (
                  <li
                    key={String(servicio.id)}
                    className="flex gap-3 px-4 py-4 transition hover:bg-neutral-50/90 sm:px-6"
                  >
                    <FilaIconoAdmin className="mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900">{servicio.nombre}</p>
                      {servicio.descripcion ? (
                        <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{servicio.descripcion}</p>
                      ) : null}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-600">
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-neutral-700">
                          {servicio.duracionAproximada} min
                        </span>
                        <span className="font-bold text-neutral-900">{formatMonedaArs(Number(servicio.precio) || 0)}</span>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/90 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    <th className="px-4 py-3 sm:px-6">Servicio</th>
                    <th className="hidden px-2 py-3 md:table-cell">Duración</th>
                    <th className="px-2 py-3 text-right sm:px-6">Precio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {!cargando && !error && trozo.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-10 text-center text-sm text-neutral-500 sm:px-6">
                        No hay registros para mostrar.
                      </td>
                    </tr>
                  ) : (
                    trozo.map((servicio) => (
                      <tr key={String(servicio.id)} className="transition hover:bg-neutral-50/90">
                        <td className="px-4 py-3 sm:px-6">
                          <div className="flex items-start gap-3">
                            <FilaIconoAdmin className="mt-0.5" />
                            <div className="min-w-0">
                              <span className="font-semibold text-neutral-900">{servicio.nombre}</span>
                              {servicio.descripcion ? (
                                <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">{servicio.descripcion}</p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="hidden whitespace-nowrap px-2 py-3 text-neutral-600 md:table-cell">
                          {servicio.duracionAproximada} min
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-right text-base font-bold tabular-nums text-neutral-900 sm:px-6">
                          {formatMonedaArs(Number(servicio.precio) || 0)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        }
        piePaginacion={
          <PaginacionEstiloHistorial
            pagina={pagina}
            totalPaginas={totalPaginas}
            etiquetaRango={etiquetaRango}
            totalFiltrados={serviciosFiltrados.length}
            onCambiarPagina={setPagina}
          />
        }
      />
    </>
  )
}
