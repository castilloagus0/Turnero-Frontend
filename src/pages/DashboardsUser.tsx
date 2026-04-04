import { useState, type ComponentType } from 'react'
import { useNavigate } from 'react-router-dom'
import UserProfilePanel from '../components/UserProfilePanel'
import { clearUserProfile, getUserProfile } from '../lib/userProfileStorage'

const PRIMARY = '#1D4ED8'

type AppointmentStatus = 'CONFIRMADO' | 'PENDIENTE'

type UpcomingAppointment = {
  id: string
  service: string
  status: AppointmentStatus
  barber: string
  dateLabel: string
  timeLabel: string
  image: string
}

type ActivityRow = {
  id: string
  service: string
  dateLabel: string
  barber: string
  amount: number
}

const UPCOMING: UpcomingAppointment[] = [
  {
    id: '1',
    service: 'Corte + Barba Premium',
    status: 'CONFIRMADO',
    barber: 'Marcos',
    dateLabel: '12 Abr 2026',
    timeLabel: '10:30',
    image:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=640&q=80',
  },
  {
    id: '2',
    service: 'Corte Clásico',
    status: 'PENDIENTE',
    barber: 'Julián',
    dateLabel: '18 Abr 2026',
    timeLabel: '16:00',
    image:
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=640&q=80',
  },
]

const ACTIVITY: ActivityRow[] = [
  {
    id: 'a1',
    service: 'Corte + Barba',
    dateLabel: '03 Abr 2026',
    barber: 'Marcos',
    amount: 2500,
  },
  {
    id: 'a2',
    service: 'Barba clásica',
    dateLabel: '28 Mar 2026',
    barber: 'Enzo',
    amount: 1800,
  },
  {
    id: 'a3',
    service: 'Combo Imperial',
    dateLabel: '15 Mar 2026',
    barber: 'Julián',
    amount: 4000,
  },
]

function formatPriceARS(n: number): string {
  return n.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
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

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M12 8v4l3 3M3.05 11a9 9 0 101.88-4.5M3.05 11H7" strokeLinecap="round" strokeLinejoin="round" />
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
      <path
        d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.14.31.22.65.22 1v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
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
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
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

function ServiceRowIcon({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 ${className ?? ''}`}
    >
      <ScissorsLogo className="h-4 w-4" />
    </span>
  )
}

function SidebarNavItem({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active?: boolean
  icon: ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
        active
          ? 'bg-[#1D4ED8] text-white shadow-sm'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
      }`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-white' : 'text-neutral-500'}`} />
      {label}
    </button>
  )
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  if (status === 'CONFIRMADO') {
    return (
      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
        Confirmado
      </span>
    )
  }
  return (
    <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700">
      Pendiente
    </span>
  )
}

export default function DashboardsUser() {
  const navigate = useNavigate()
  const [mainTab, setMainTab] = useState<'proximos' | 'historial'>('proximos')
  const [activeSection, setActiveSection] = useState<'turnos' | 'perfil'>('turnos')
  const [userName, setUserName] = useState(() => getUserProfile()?.fullName ?? 'Invitado')

  function handleLogout() {
    clearUserProfile()
    navigate('/login')
  }

  function handleProfileUpdated() {
    setUserName(getUserProfile()?.fullName ?? 'Invitado')
  }

  return (
    <div className="flex min-h-screen bg-neutral-100/80 text-neutral-800">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-neutral-200/80 bg-white px-4 py-6 shadow-sm md:flex lg:w-64">
        <div className="flex items-center gap-3 px-1">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ backgroundColor: PRIMARY }}
          >
            <ScissorsLogo className="h-6 w-6" />
          </span>
          <div>
            <p className="text-base font-bold leading-tight text-neutral-900">Barbería Pro</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Dashboard</p>
          </div>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          <SidebarNavItem
            active={activeSection === 'turnos'}
            icon={GridIcon}
            label="Mis Turnos"
            onClick={() => setActiveSection('turnos')}
          />
          <SidebarNavItem
            active={activeSection === 'perfil'}
            icon={UserIcon}
            label="Perfil"
            onClick={() => setActiveSection('perfil')}
          />
          <SidebarNavItem icon={HistoryIcon} label="Mis Consumos" />
          <SidebarNavItem icon={GearIcon} label="Preferencias" />
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOutIcon className="h-5 w-5 shrink-0" />
          Cerrar sesión
        </button>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:pl-60 lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-neutral-200/80 bg-white/95 px-4 py-4 backdrop-blur md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: PRIMARY }}
              >
                <ScissorsLogo className="h-4 w-4" />
              </span>
              <span className="font-bold text-neutral-900">Barbería Pro</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-2 py-1 text-sm font-medium text-red-600"
            >
              Salir
            </button>
          </div>
          <nav className="mt-3 flex gap-2 border-t border-neutral-100 pt-3" aria-label="Secciones del panel">
            <button
              type="button"
              onClick={() => setActiveSection('turnos')}
              className={`flex-1 rounded-lg py-2 text-center text-xs font-bold uppercase tracking-wide transition ${
                activeSection === 'turnos'
                  ? 'bg-[#1D4ED8] text-white'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              Mis turnos
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('perfil')}
              className={`flex-1 rounded-lg py-2 text-center text-xs font-bold uppercase tracking-wide transition ${
                activeSection === 'perfil'
                  ? 'bg-[#1D4ED8] text-white'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              Perfil
            </button>
          </nav>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                  Hola, {userName}
                </h1>
                <p className="mt-1 text-sm text-neutral-500 sm:text-base">
                  {activeSection === 'perfil'
                    ? 'Editá los datos de tu cuenta desde esta sección.'
                    : 'Bienvenido de nuevo a tu panel de gestión.'}
                </p>
              </div>
              {activeSection === 'turnos' ? (
                <button
                  type="button"
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110 active:scale-[0.99] sm:w-auto"
                  style={{ backgroundColor: PRIMARY }}
                >
                  <PlusIcon className="h-5 w-5" />
                  Agendar nuevo turno
                </button>
              ) : null}
            </div>

            {activeSection === 'perfil' ? (
              <div className="mt-8 max-w-3xl">
                <UserProfilePanel onProfileUpdated={handleProfileUpdated} />
              </div>
            ) : (
              <>
                <div className="mt-8 border-b border-neutral-200">
                  <div className="flex gap-8">
                    <button
                      type="button"
                      onClick={() => setMainTab('proximos')}
                      className={`relative pb-3 text-sm font-semibold transition ${
                        mainTab === 'proximos'
                          ? 'text-[#1D4ED8]'
                          : 'text-neutral-400 hover:text-neutral-600'
                      }`}
                    >
                      Próximos turnos
                      {mainTab === 'proximos' ? (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1D4ED8]" />
                      ) : null}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMainTab('historial')}
                      className={`relative pb-3 text-sm font-semibold transition ${
                        mainTab === 'historial'
                          ? 'text-[#1D4ED8]'
                          : 'text-neutral-400 hover:text-neutral-600'
                      }`}
                    >
                      Historial completado
                      {mainTab === 'historial' ? (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1D4ED8]" />
                      ) : null}
                    </button>
                  </div>
                </div>

                {mainTab === 'proximos' ? (
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {UPCOMING.map((apt) => (
                      <article
                        key={apt.id}
                        className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                          <img src={apt.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col p-4 sm:p-5">
                          <div className="flex items-start justify-between gap-2">
                            <h2 className="text-base font-bold text-neutral-900">{apt.service}</h2>
                            <StatusBadge status={apt.status} />
                          </div>
                          <p className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
                            <UserIcon className="h-4 w-4 shrink-0 text-neutral-400" />
                            <span>
                              Barbero: <span className="font-medium text-neutral-700">{apt.barber}</span>
                            </span>
                          </p>
                          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-neutral-50 px-3 py-3">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Fecha</p>
                              <p className="mt-0.5 text-sm font-bold text-neutral-900">{apt.dateLabel}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Hora</p>
                              <p className="mt-0.5 text-sm font-bold text-neutral-900">{apt.timeLabel}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <button
                              type="button"
                              className="flex-1 rounded-xl border border-neutral-200 bg-white py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
                            >
                              Reagendar
                            </button>
                            <button
                              type="button"
                              className="flex-1 rounded-xl border-2 border-red-200 bg-white py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}

                    <button
                      type="button"
                      className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neutral-300 bg-white/60 px-6 py-8 text-center transition hover:border-[#1D4ED8]/40 hover:bg-white"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
                        <CalendarIcon className="h-7 w-7" />
                      </span>
                      <p className="max-w-[220px] text-sm text-neutral-600">
                        ¿Necesitás otro turno? Agendalo en segundos.
                      </p>
                      <span className="text-sm font-semibold" style={{ color: PRIMARY }}>
                        Click para empezar
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-8 rounded-2xl border border-neutral-200/80 bg-white p-8 text-center shadow-sm">
                    <p className="text-neutral-500">No hay turnos completados para mostrar en esta vista.</p>
                  </div>
                )}

                <section className="mt-12 rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-4 sm:px-6">
                    <h2 className="text-lg font-bold text-neutral-900">Actividad reciente</h2>
                    <button type="button" className="text-sm font-semibold" style={{ color: PRIMARY }}>
                      Ver todo
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <thead>
                        <tr className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          <th className="px-4 py-3 sm:px-6">Servicio</th>
                          <th className="hidden px-2 py-3 sm:table-cell">Fecha</th>
                          <th className="hidden px-2 py-3 md:table-cell">Barbero</th>
                          <th className="px-2 py-3">Monto</th>
                          <th className="px-4 py-3 text-right sm:px-6">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {ACTIVITY.map((row) => (
                          <tr key={row.id} className="hover:bg-neutral-50/80">
                            <td className="px-4 py-3 sm:px-6">
                              <div className="flex items-center gap-3">
                                <ServiceRowIcon />
                                <span className="font-semibold text-neutral-900">{row.service}</span>
                              </div>
                            </td>
                            <td className="hidden whitespace-nowrap px-2 py-3 text-neutral-500 sm:table-cell">
                              {row.dateLabel}
                            </td>
                            <td className="hidden whitespace-nowrap px-2 py-3 text-neutral-500 md:table-cell">
                              {row.barber}
                            </td>
                            <td className="whitespace-nowrap px-2 py-3 font-bold text-neutral-900">
                              ${formatPriceARS(row.amount)}
                            </td>
                            <td className="px-4 py-3 text-right sm:px-6">
                              <button
                                type="button"
                                className="inline-flex rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-[#1D4ED8]"
                                aria-label="Ver comprobante"
                              >
                                <ReceiptIcon className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
