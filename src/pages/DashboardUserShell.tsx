import { type ComponentType, type ReactNode } from 'react'

const PRIMARY = '#1D4ED8'

export type DashboardUserSection = 'turnos' | 'perfil' | 'actividad'

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
      <path
        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ActivityNavIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 7a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zM10 7h10v2H10V7zm0 5h10v2H10v-2zm0 5h10v2H10v-2zm-8.05-8.25a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zm0 5a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zm0 5a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z" />
    </svg>
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

type Props = {
  activeSection: DashboardUserSection
  onSectionChange: (section: DashboardUserSection) => void
  onNavigateActividad: () => void
  onLogout: () => void
  children: ReactNode
}

export default function DashboardUserShell({
  activeSection,
  onSectionChange,
  onNavigateActividad,
  onLogout,
  children,
}: Props) {
  return (
    <div className="flex min-h-screen bg-neutral-100/80 text-neutral-800">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-neutral-200/80 bg-white px-4 py-6 shadow-sm md:flex lg:w-64">
        <nav className="mt-25 flex flex-1 flex-col gap-1">
          <SidebarNavItem
            active={activeSection === 'turnos'}
            icon={GridIcon}
            label="Próximos Turnos"
            onClick={() => onSectionChange('turnos')}
          />
          <SidebarNavItem
            active={activeSection === 'actividad'}
            icon={ActivityNavIcon}
            label="Historial de Turnos"
            onClick={onNavigateActividad}
          />
          <SidebarNavItem
            active={activeSection === 'perfil'}
            icon={UserIcon}
            label="Perfil"
            onClick={() => onSectionChange('perfil')}
          />
        </nav>
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
              onClick={onLogout}
              className="rounded-lg px-2 py-1 text-sm font-medium text-red-600"
            >
              Salir
            </button>
          </div>
          <nav
            className="mt-3 grid grid-cols-3 gap-1.5 border-t border-neutral-100 pt-3"
            aria-label="Secciones del panel"
          >
            <button
              type="button"
              onClick={() => onSectionChange('turnos')}
              className={`rounded-lg py-2 text-center text-[10px] font-bold uppercase leading-tight tracking-wide transition sm:text-xs ${
                activeSection === 'turnos'
                  ? 'bg-[#1D4ED8] text-white'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              Próximos
            </button>
            <button
              type="button"
              onClick={onNavigateActividad}
              className={`rounded-lg py-2 text-center text-[10px] font-bold uppercase leading-tight tracking-wide transition sm:text-xs ${
                activeSection === 'actividad'
                  ? 'bg-[#1D4ED8] text-white'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              Historial
            </button>
            <button
              type="button"
              onClick={() => onSectionChange('perfil')}
              className={`rounded-lg py-2 text-center text-[10px] font-bold uppercase leading-tight tracking-wide transition sm:text-xs ${
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
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
