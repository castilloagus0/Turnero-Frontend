import { type ReactNode, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { getUserProfile } from '../../lib/userProfileStorage'
import {
  CalendarIcon,
  ChartIcon,
  GridIcon,
  PRIMARY_ADMIN,
  ScissorsIcon,
  UserCircleOutlineIcon,
  UsersIcon,
} from './adminDashboardUi'

function GearIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path
        d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        strokeLinecap="round"
      />
    </svg>
  )
}

function tituloVistaAdmin(pathname: string): string {
  if (pathname.includes('/admin-turnos')) return 'Gestión de turnos'
  if (pathname.includes('/usuarios-activos')) return 'Usuarios activos'
  if (pathname.includes('/servicios-activos')) return 'Servicios activos'
  if (pathname.includes('/analiticas')) return 'Analíticas'
  return 'Próximos turnos'
}

type Props = {
  basePath: string
  navOpen: boolean
  onNavOpenChange: (open: boolean) => void
  onLogout: () => void
  children: ReactNode
}

function navClassName({ isActive }: { isActive: boolean }): string {
  return `flex w-full min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors sm:py-2.5 ${
    isActive ? 'bg-[#1D4ED8] text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
  }`
}

function useNombreUsuarioLogueado(): string {
  const [nombre, setNombre] = useState(() => getUserProfile()?.name ?? 'Usuario')

  useEffect(() => {
    const sync = () => setNombre(getUserProfile()?.name ?? 'Usuario')
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  return nombre
}

export default function AdminDashboardShell({ basePath, navOpen, onNavOpenChange, onLogout, children }: Props) {
  const location = useLocation()
  const tituloVista = tituloVistaAdmin(location.pathname)
  const nombreUsuario = useNombreUsuarioLogueado()

  useEffect(() => {
    if (!navOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [navOpen])

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 md:flex">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-neutral-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur supports-backdrop-filter:bg-white/90 md:hidden">
        <button
          type="button"
          className="touch-manipulation flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition hover:bg-neutral-50"
          aria-expanded={navOpen}
          aria-label="Abrir menú"
          onClick={() => onNavOpenChange(true)}
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-bold text-neutral-900">Panel de control</p>
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-neutral-500">{tituloVista}</p>
        </div>
        <span className="size-11 shrink-0" aria-hidden />
      </header>

      {navOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-neutral-900/40 md:hidden"
          aria-label="Cerrar menú"
          onClick={() => onNavOpenChange(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(100vw-3rem,260px)] max-w-[280px] flex-col border-r border-neutral-200 bg-white px-4 py-6 shadow-sm transition-transform duration-200 ease-out md:static md:z-0 md:w-[260px] md:max-w-none md:shrink-0 md:translate-x-0 md:shadow-none ${
          navOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-4 flex items-center justify-end md:hidden">
          <button
            type="button"
            className="touch-manipulation flex h-11 w-11 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100"
            aria-label="Cerrar menú"
            onClick={() => onNavOpenChange(false)}
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-neutral-50 to-white p-3.5 shadow-sm">
          <div className="flex items-center gap-3">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-inner ring-2 ring-white/60"
              style={{ backgroundColor: PRIMARY_ADMIN }}
              aria-hidden
            >
              <UserCircleOutlineIcon className="h-7 w-7 text-white/95" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Conectado como</p>
              <p className="mt-0.5 truncate text-sm font-bold leading-tight text-neutral-900">{nombreUsuario}</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1" onClick={() => onNavOpenChange(false)}>
          <NavLink to={basePath} end className={navClassName}>
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-white' : 'text-neutral-500'}>
                  <GridIcon className="h-5 w-5" />
                </span>
                Próximos turnos
              </>
            )}
          </NavLink>
          <NavLink to={`${basePath}/usuarios-activos`} className={navClassName}>
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-white' : 'text-neutral-500'}>
                  <UsersIcon className="h-5 w-5" />
                </span>
                Usuarios activos
              </>
            )}
          </NavLink>
          <NavLink to={`${basePath}/servicios-activos`} className={navClassName}>
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-white' : 'text-neutral-500'}>
                  <ScissorsIcon className="h-5 w-5" />
                </span>
                Servicios activos
              </>
            )}
          </NavLink>
          <NavLink to={`${basePath}/analiticas`} className={navClassName}>
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-white' : 'text-neutral-500'}>
                  <ChartIcon className="h-5 w-5" />
                </span>
                Analíticas
              </>
            )}
          </NavLink>
          <NavLink to={`${basePath}/admin-turnos`} className={navClassName}>
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-white' : 'text-neutral-500'}>
                  <CalendarIcon className="h-5 w-5" />
                </span>
                Gestión de turnos
              </>
            )}
          </NavLink>
        </nav>

        <div className="mt-auto space-y-2 border-t border-neutral-100 pt-6">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
          >
            <GearIcon className="h-5 w-5 text-neutral-500" />
            Configuración
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col md:min-h-screen">{children}</div>
    </div>
  )
}
