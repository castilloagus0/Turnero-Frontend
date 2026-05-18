import { useEffect, useMemo, useState } from 'react'
import type { Barbero } from '../../interface/barbero.interface'
import { getUserProfile } from '../../lib/userProfileStorage'
import { getBarberos } from '../../service/barbero.service'
import { SearchIcon } from './adminDashboardUi'
import {
  FilaIconoAdmin,
  PaginacionEstiloHistorial,
  SeccionListaEstiloHistorialAdmin,
  usePaginaListaAdmin,
} from './dashboardAdminListaActividadUi'

type EstadoCarga =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'ok'; usuarios: Barbero[] }

function textoBusquedaCoincide(barbero: Barbero, termino: string): boolean {
  const t = termino.trim().toLowerCase()
  if (!t) return true
  const bloque = [
    barbero.nombre,
    barbero.apellido,
    barbero.email,
    barbero.telefono,
    barbero.rol,
  ]
    .map((x) => String(x ?? '').toLowerCase())
    .join(' ')
  return bloque.includes(t) || bloque.split(/\s+/).some((p) => p.startsWith(t))
}

export default function DashboardAdminUsuariosActivos() {
  const nombreAdmin = getUserProfile()?.name ?? 'Administrador'
  const [estado, setEstado] = useState<EstadoCarga>({ tipo: 'cargando' })
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    let cancelado = false
    setEstado({ tipo: 'cargando' })
    getBarberos()
      .then((data) => {
        if (cancelado) return
        const usuarios = Array.isArray(data) ? (data as Barbero[]) : []
        setEstado({ tipo: 'ok', usuarios })
      })
      .catch((error: unknown) => {
        if (cancelado) return
        const mensaje = error instanceof Error ? error.message : 'No se pudo cargar el equipo.'
        setEstado({ tipo: 'error', mensaje })
      })
    return () => {
      cancelado = true
    }
  }, [])

  const usuariosFiltrados = useMemo(() => {
    if (estado.tipo !== 'ok') return []
    return estado.usuarios.filter((u) => textoBusquedaCoincide(u, busqueda))
  }, [estado, busqueda])

  const { pagina, setPagina, totalPaginas, trozo, etiquetaRango } = usePaginaListaAdmin(usuariosFiltrados)

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
            Revisá el equipo activo: barberos registrados, contacto y rol en el sistema.
          </p>
        </div>
      </div>

      <SeccionListaEstiloHistorialAdmin
        tituloSeccion="Usuarios activos (barberos)"
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
                  placeholder="Nombre, email, teléfono o rol..."
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 text-base text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15 sm:h-10 sm:text-sm"
                />
              </div>
            </label>
          </div>
        }
        tabla={
          <>
            <ul className="divide-y divide-neutral-100 md:hidden" aria-label="Profesionales en vista compacta">
              {!cargando && !error && trozo.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-neutral-500 sm:px-6">No hay registros para mostrar.</li>
              ) : (
                trozo.map((usuario) => (
                  <li key={String(usuario.id)} className="flex gap-3 px-4 py-4 sm:px-6">
                    <FilaIconoAdmin className="mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900">
                        {usuario.nombre} {usuario.apellido}
                      </p>
                      <p className="mt-1 break-all text-sm text-neutral-600">{usuario.email || '—'}</p>
                      <p className="mt-1 text-sm text-neutral-500">{usuario.telefono || '—'}</p>
                      <div className="mt-2">
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200">
                          {usuario.rol || 'Activo'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/90 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    <th className="px-4 py-3 sm:px-6">Profesional</th>
                    <th className="hidden px-2 py-3 sm:table-cell">Email</th>
                    <th className="hidden px-2 py-3 md:table-cell">Teléfono</th>
                    <th className="px-4 py-3 text-right sm:px-6">Rol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {!cargando && !error && trozo.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-sm text-neutral-500 sm:px-6">
                        No hay registros para mostrar.
                      </td>
                    </tr>
                  ) : (
                    trozo.map((usuario) => (
                      <tr key={String(usuario.id)} className="transition hover:bg-neutral-50/90">
                        <td className="px-4 py-3 sm:px-6">
                          <div className="flex items-center gap-3">
                            <FilaIconoAdmin />
                            <span className="font-semibold text-neutral-900">
                              {usuario.nombre} {usuario.apellido}
                            </span>
                          </div>
                        </td>
                        <td className="hidden whitespace-nowrap px-2 py-3 text-neutral-500 sm:table-cell">
                          {usuario.email || '—'}
                        </td>
                        <td className="hidden whitespace-nowrap px-2 py-3 text-neutral-500 md:table-cell">
                          {usuario.telefono || '—'}
                        </td>
                        <td className="px-4 py-3 text-right sm:px-6">
                          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200">
                            {usuario.rol || 'Activo'}
                          </span>
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
            totalFiltrados={usuariosFiltrados.length}
            onCambiarPagina={setPagina}
          />
        }
      />
    </>
  )
}
