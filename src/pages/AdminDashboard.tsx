import { useEffect, useState, type ReactNode } from 'react'

const PRIMARY = '#2563EB'

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  )
}

function ScissorsIcon({ className }: { className?: string }) {
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

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M3 3v18h18M7 16l4-4 4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

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
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  )
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BanknoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 10h.01M18 14h.01" strokeLinecap="round" />
    </svg>
  )
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M21 12V7H5a2 2 0 010-4h14v4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 5v14a2 2 0 002 2h16v-5M18 12a2 2 0 100 4h4v-4h-4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DotsVerticalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  )
}

type NavItemProps = {
  icon: ReactNode
  label: string
  active?: boolean
}

function NavItem({ icon, label, active }: NavItemProps) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
        active
          ? 'bg-[#2563EB] text-white shadow-sm'
          : 'text-neutral-600 hover:bg-neutral-100'
      }`}
    >
      <span className={active ? 'text-white' : 'text-neutral-500'}>{icon}</span>
      {label}
    </button>
  )
}

type AgendaRowProps = {
  time: string
  duration: string
  client: string
  clientInitials: string
  clientImage?: string
  service: string
  status: 'Confirmada' | 'En Curso' | 'Pendiente'
  barber: string
  highlight?: boolean
}

function AgendaRow({
  time,
  duration,
  client,
  clientInitials,
  clientImage,
  service,
  status,
  barber,
  highlight,
}: AgendaRowProps) {
  const statusStyles = {
    Confirmada: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    'En Curso': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    Pendiente: 'bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200',
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-3 border-b border-neutral-100 px-4 py-4 last:border-0 sm:flex-nowrap ${
        highlight ? 'border-l-4 border-l-[#2563EB] bg-blue-50/40 pl-3' : ''
      }`}
    >
      <div className={`min-w-[88px] text-sm font-semibold ${highlight ? 'text-[#2563EB]' : 'text-neutral-900'}`}>
        {time}
        <span className="mt-0.5 block text-xs font-normal text-neutral-500">{duration}</span>
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {clientImage ? (
          <img
            src={clientImage}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600">
            {clientInitials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-neutral-900">{client}</p>
          <p className="truncate text-sm text-neutral-500">{service}</p>
          <p className="mt-1 text-xs text-neutral-500 sm:hidden">
            Barbero: <span className="font-medium text-neutral-700">{barber}</span>
          </p>
        </div>
      </div>
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>{status}</span>
      <p className="hidden w-28 shrink-0 text-sm text-neutral-600 sm:block">
        Barbero: <span className="font-medium text-neutral-800">{barber}</span>
      </p>
      <button
        type="button"
        className="shrink-0 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
        aria-label="Más opciones"
      >
        <DotsVerticalIcon className="h-5 w-5" />
      </button>
    </div>
  )
}

export default function AdminDashboard() {
  const [navOpen, setNavOpen] = useState(false)

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
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-3 shadow-sm md:hidden">
        <button
          type="button"
          className="touch-manipulation flex size-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700"
          aria-expanded={navOpen}
          aria-label="Abrir menú"
          onClick={() => setNavOpen(true)}
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-bold text-neutral-900">Panel de control</p>
          <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Barbería Elite</p>
        </div>
        <span className="size-10 shrink-0" aria-hidden />
      </header>

      {navOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-neutral-900/40 md:hidden"
          aria-label="Cerrar menú"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(100vw-3rem,260px)] max-w-[280px] flex-col border-r border-neutral-200 bg-white px-4 py-6 transition-transform duration-200 ease-out md:static md:z-0 md:w-[260px] md:max-w-none md:shrink-0 md:translate-x-0 ${
          navOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-4 flex items-center justify-end md:hidden">
          <button
            type="button"
            className="touch-manipulation flex size-10 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"
            aria-label="Cerrar menú"
            onClick={() => setNavOpen(false)}
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3 px-2">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&q=80"
            alt=""
            className="h-12 w-12 rounded-full object-cover ring-2 ring-neutral-100"
          />
          <div className="min-w-0">
            <p className="truncate font-bold text-neutral-900">Admin Barbero</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Barbería Elite</p>
          </div>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          <NavItem
            active
            label="Dashboard"
            icon={<GridIcon className="h-5 w-5" />}
          />
          <NavItem label="Citas" icon={<CalendarIcon className="h-5 w-5" />} />
          <NavItem label="Servicios" icon={<ScissorsIcon className="h-5 w-5" />} />
          <NavItem label="Equipo" icon={<UsersIcon className="h-5 w-5" />} />
          <NavItem label="Reportes" icon={<ChartIcon className="h-5 w-5" />} />
        </nav>

        <div className="mt-auto space-y-4 pt-6">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-600"
          >
            <PlusIcon className="h-5 w-5" />
            Nueva Cita
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
          >
            <GearIcon className="h-5 w-5 text-neutral-500" />
            Configuración
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 min-h-0 flex-1 flex-col md:min-h-screen">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-neutral-200 bg-white px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
              style={{ backgroundColor: PRIMARY }}
            >
              <GridIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-neutral-900">Panel de Control</h1>
            </div>
          </div>

          <div className="relative flex-1 lg:max-w-xl">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Buscar cliente o servicio..."
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none ring-[#2563EB]/20 transition focus:border-[#2563EB] focus:bg-white focus:ring-2"
            />
          </div>

          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <button
              type="button"
              className="relative rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Notificaciones"
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-3 border-l border-neutral-200 pl-4">
              <div className="text-right">
                <p className="text-sm font-bold text-neutral-900">Carlos Méndez</p>
                <p className="text-xs text-neutral-500">Administrador</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&q=80"
                alt=""
                className="h-10 w-10 rounded-full object-cover ring-2 ring-neutral-100"
              />
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 overflow-auto p-4 sm:p-6 lg:flex-row">
          <main className="min-w-0 flex-1 space-y-6">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <BanknoteIcon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">+15.2%</span>
                </div>
                <p className="mt-4 text-sm text-neutral-500">Ingresos Hoy</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">$1,245.00</p>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                    <CalendarIcon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-[#2563EB]">+4</span>
                </div>
                <p className="mt-4 text-sm text-neutral-500">Citas Activas</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">18</p>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <WalletIcon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-orange-600">-2%</span>
                </div>
                <p className="mt-4 text-sm text-neutral-500">Pendientes de Pago</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">3</p>
              </div>
            </div>

            {/* Agenda */}
            <section className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold text-neutral-900">Agenda del Día</h2>
                <div className="inline-flex max-w-full flex-wrap rounded-xl bg-neutral-100 p-1">
                  <button
                    type="button"
                    className="touch-manipulation rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#2563EB] shadow-sm sm:px-4 sm:text-sm"
                  >
                    Hoy
                  </button>
                  <button
                    type="button"
                    className="touch-manipulation rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:text-neutral-700 sm:px-4 sm:text-sm"
                  >
                    Semana
                  </button>
                  <button
                    type="button"
                    className="touch-manipulation rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:text-neutral-700 sm:px-4 sm:text-sm"
                  >
                    Mes
                  </button>
                </div>
              </div>
              <div>
                <AgendaRow
                  time="09:00 AM"
                  duration="45 MIN"
                  client="Luis Ramírez"
                  clientInitials="LR"
                  clientImage="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&q=80"
                  service="Corte Clásico + Barba"
                  status="Confirmada"
                  barber="Marco"
                />
                <AgendaRow
                  time="10:30 AM"
                  duration="60 MIN"
                  client="Diego Fernández"
                  clientInitials="DF"
                  clientImage="https://images.unsplash.com/photo-1599566150163-64194ac296a7?w=96&h=96&fit=crop&q=80"
                  service="Corte de Autor + Hidratación"
                  status="En Curso"
                  barber="Tú"
                  highlight
                />
                <AgendaRow
                  time="12:00 PM"
                  duration="30 MIN"
                  client="Andrés Silva"
                  clientInitials="AS"
                  service="Arreglo de barba"
                  status="Pendiente"
                  barber="Marco"
                />
              </div>
              <div className="border-t border-neutral-100 px-5 py-4 text-center">
                <button type="button" className="text-sm font-semibold text-[#2563EB] hover:underline">
                  Ver horario completo
                </button>
              </div>
            </section>

            {/* Bottom grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
                  <h3 className="font-bold text-neutral-900">Servicios Activos</h3>
                  <button type="button" className="text-sm font-semibold text-[#2563EB] hover:underline">
                    Gestionar
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-neutral-100 text-[11px] font-bold uppercase tracking-wide text-neutral-400">
                        <th className="px-5 py-3">SERVICIO</th>
                        <th className="px-5 py-3">DURACIÓN</th>
                        <th className="px-5 py-3 text-right">PRECIO</th>
                      </tr>
                    </thead>
                    <tbody className="text-neutral-700">
                      <tr className="border-b border-neutral-50">
                        <td className="px-5 py-3.5 font-medium text-neutral-900">Corte de Pelo</td>
                        <td className="px-5 py-3.5 text-neutral-500">30 min</td>
                        <td className="px-5 py-3.5 text-right font-semibold text-neutral-900">$25</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-3.5 font-medium text-neutral-900">Arreglo de barba</td>
                        <td className="px-5 py-3.5 text-neutral-500">15 min</td>
                        <td className="px-5 py-3.5 text-right font-semibold text-neutral-900">$15</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
                  <h3 className="font-bold text-neutral-900">Equipo en Turno</h3>
                  <button type="button" className="text-sm font-semibold text-[#2563EB] hover:underline">
                    Editar Turnos
                  </button>
                </div>
                <ul className="divide-y divide-neutral-100 px-5 py-2">
                  <li className="flex items-center gap-3 py-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                      M
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900">Marco Polo</p>
                      <p className="text-xs text-neutral-500">8 citas Hoy</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
                      Disponible
                    </span>
                  </li>
                  <li className="flex items-center gap-3 py-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      T
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900">Tú (Admin)</p>
                      <p className="text-xs text-neutral-500">En servicio</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-orange-700 ring-1 ring-orange-200">
                      Ocupado
                    </span>
                  </li>
                </ul>
              </section>
            </div>
          </main>

          {/* Right panel */}
          <aside className="flex w-full shrink-0 flex-col gap-5 lg:w-[300px] xl:w-[320px]">
            <section
              className="overflow-hidden rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20"
              style={{ backgroundColor: PRIMARY }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">SIGUIENTE EN LISTA</p>
              <p className="mt-3 text-sm font-semibold tracking-wide text-white/90">EN 15 MINUTOS</p>
              <p className="mt-2 text-xl font-bold">Carlos Ortega</p>
              <div className="mt-3 flex items-start gap-2 text-sm text-white/95">
                <ScissorsIcon className="mt-0.5 h-5 w-5 shrink-0 text-white/90" />
                <span>Corte de Autor + Hidratación</span>
              </div>
              <button
                type="button"
                className="mt-5 w-full rounded-xl bg-white py-3 text-sm font-bold tracking-wide text-[#2563EB] shadow-sm transition hover:bg-neutral-50"
              >
                REGISTRAR LLEGADA
              </button>
            </section>

            <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                RESUMEN DEL DÍA
              </h3>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Citas completadas</span>
                  <span className="font-bold text-neutral-900">14 / 28</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full w-1/2 rounded-full bg-[#2563EB]" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
                <span className="text-sm text-neutral-600">Tasa de ocupación</span>
                <span className="text-lg font-bold text-neutral-900">85%</span>
              </div>
            </section>

            <section className="rounded-2xl border border-amber-200/80 bg-amber-50/90 p-5 shadow-sm ring-1 ring-amber-100">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-800/70">NOTAS RÁPIDAS</h3>
              <p className="mt-3 text-sm leading-relaxed text-amber-950/90">
                Pedir loción de afeitar antes del fin de semana — stock bajo en depósito.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
