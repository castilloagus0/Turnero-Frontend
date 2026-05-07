import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserProfilePanel from '../components/UserProfilePanel'
import { clearUserProfile, getUserProfile } from '../lib/userProfileStorage'
import { getTurnoByUser } from '../service/turno.service'
import type { TurnosI } from '../interface/turnos.interface'
import DashboardUserActividad from './DashboardUserActividad'
import DashboardUserMisTurnos from './DashboardUserMisTurnos'
import DashboardUserShell, { type DashboardUserSection } from './DashboardUserShell'
import { isCancelledTurno, isCompletedTurno } from './dashboardUserUtils'

const PRIMARY = '#1D4ED8'

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

export default function DashboardsUser() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<DashboardUserSection>('turnos')
  const [actividadMountKey, setActividadMountKey] = useState(0)
  const [userName, setUserName] = useState(() => getUserProfile().name ?? 'Invitado')
  const [turnos, setTurnos] = useState<TurnosI[]>([])
  const [turnosLoading, setTurnosLoading] = useState(false)
  const [turnosError, setTurnosError] = useState<string | null>(null)

  const userId = useMemo(() => {
    const raw = localStorage.getItem('userId')
    const n = Number(raw)
    return Number.isFinite(n) ? n : 0
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadTurnos() {
      if (!userId) {
        setTurnos([])
        return
      }

      setTurnosLoading(true)
      setTurnosError(null)
      try {
        const response = await getTurnoByUser(userId, 1, 50)
        const list: TurnosI[] = Array.isArray(response)
          ? response
          : Array.isArray(response?.turnos)
            ? response.turnos
            : Array.isArray(response?.data)
              ? response.data
              : []

        if (!cancelled) setTurnos(list)
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'No se pudieron cargar los turnos.'
        if (!cancelled) setTurnosError(message)
      } finally {
        if (!cancelled) setTurnosLoading(false)
      }
    }

    loadTurnos()
    return () => {
      cancelled = true
    }
  }, [userId])

  const proximosTurnos = useMemo(
    () =>
      turnos.filter(
        (t) => !isCompletedTurno(t.estado) && !isCancelledTurno(t.estado),
      ),
    [turnos],
  )

  const historialTurnos = useMemo(
    () =>
      turnos.filter((t) => isCompletedTurno(t.estado) || isCancelledTurno(t.estado)),
    [turnos],
  )

  function handleLogout() {
    clearUserProfile()
    navigate('/login')
  }

  function handleCreateTurno(){
    navigate('/create-turno')
  }

  function handleProfileUpdated() {
    setUserName(getUserProfile()?.name ?? 'Invitado')
  }

  function navigateToActividad() {
    setActiveSection('actividad')
    setActividadMountKey((key) => key + 1)
  }

  return (
    <DashboardUserShell
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onNavigateActividad={navigateToActividad}
      onLogout={handleLogout}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Hola, {userName}</h1>
          <p className="mt-1 text-sm text-neutral-500 sm:text-base">
            {activeSection === 'perfil'
              ? 'Editá los datos de tu cuenta desde esta sección.'
              : activeSection === 'actividad'
                ? 'Consultá el historial de tus turnos con importes y detalles.'
                : 'Bienvenido de nuevo a tu panel de gestión.'}
          </p>
        </div>
        {activeSection === 'turnos' ? (
          <button
            type="button"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110 active:scale-[0.99] sm:w-auto"
            style={{ backgroundColor: PRIMARY }}
            onClick={handleCreateTurno}
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
      ) : activeSection === 'actividad' ? (
        <DashboardUserActividad
          key={actividadMountKey}
          turnos={turnos}
          turnosLoading={turnosLoading}
          turnosError={turnosError}
        />
      ) : (
        <DashboardUserMisTurnos
          proximosTurnos={proximosTurnos}
          historialTurnos={historialTurnos}
          turnosLoading={turnosLoading}
          turnosError={turnosError}
        />
      )}
    </DashboardUserShell>
  )
}
