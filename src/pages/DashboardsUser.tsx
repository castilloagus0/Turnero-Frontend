import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearUserProfile, getUserProfile } from '../lib/userProfileStorage'
import { cancelarTurno, finalizarTurno, getTurnoByUser } from '../service/turno.service'
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

function getTurnoDateTime(turno: TurnosI): Date | null {
  if (!turno.fecha || !turno.horario?.horaInicio) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(turno.fecha)
  if (!match) return null
  const [, y, m, d] = match
  const [h = '0', min = '0'] = String(turno.horario.horaInicio).split(':')
  const date = new Date(Number(y), Number(m) - 1, Number(d), Number(h), Number(min), 0, 0)
  return Number.isNaN(date.getTime()) ? null : date
}

function shouldAutoFinalizeTurno(turno: TurnosI, now: Date): boolean {
  if (isCompletedTurno(turno.estado) || isCancelledTurno(turno.estado)) return false
  const turnoDateTime = getTurnoDateTime(turno)
  if (!turnoDateTime) return false

  // Se auto-finaliza solo cuando el turno ya llegó o pasó.
  return now.getTime() > turnoDateTime.getTime()
}

export default function DashboardsUser() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<DashboardUserSection>('turnos')
  const [actividadMountKey, setActividadMountKey] = useState(0)
  const userName = getUserProfile().name ?? 'Invitado'
  const [turnos, setTurnos] = useState<TurnosI[]>([])
  const [turnosLoading, setTurnosLoading] = useState(false)
  const [turnosError, setTurnosError] = useState<string | null>(null)
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date())

  const userId = useMemo(() => {
    const raw = localStorage.getItem('userId')
    const n = Number(raw)
    return Number.isFinite(n) ? n : 0
  }, [])

  const loadTurnos = useCallback(async () => {
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
      setTurnos(list)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'No se pudieron cargar los turnos.'
      setTurnosError(message)
    } finally {
      setTurnosLoading(false)
    }
  }, [userId])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!mounted) return
      setCurrentDateTime(new Date())
      await loadTurnos()
    })()
    return () => {
      mounted = false
    }
  }, [loadTurnos])

  useEffect(() => {
    if (!userId || turnos.length === 0) return

    const now = currentDateTime
    const toFinalize = turnos.filter((turno) => shouldAutoFinalizeTurno(turno, now))
    if (toFinalize.length === 0) return

    ;(async () => {
      const results = await Promise.allSettled(
        toFinalize.map((turno) => finalizarTurno(Number(turno.id))),
      )
      const finalizedAny = results.some((result) => result.status === 'fulfilled')
      if (finalizedAny) {
        await loadTurnos()
      }
    })()
  }, [currentDateTime, loadTurnos, turnos, userId])

  async function handleCancelarTurno(idTurno: number) {
    await cancelarTurno(idTurno)
    await loadTurnos()
  }

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
            {activeSection === 'actividad'
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

      {activeSection === 'actividad' ? (
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
          onCancelarTurno={handleCancelarTurno}
        />
      )}
    </DashboardUserShell>
  )
}
