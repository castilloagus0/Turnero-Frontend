import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { finalizarTurno } from '../../service/turno.service'
import type { TurnosI } from '../../interface/turnos.interface'
import { getUserProfile } from '../../lib/userProfileStorage'
import TurnosUser from './TurnosUser'
import { isCancelledTurno, isCompletedTurno, obtenerFechaHoraInicioTurno } from './dashboardUserUtils'
import { useUsuarioTurnos } from './useUsuarioTurnos'

const COLOR_PRIMARIO = '#1D4ED8'

function obtenerFechaHoraDelTurno(turno: TurnosI): Date | null {
  return obtenerFechaHoraInicioTurno(turno)
}

/** Fecha/hora local del inicio del turno, al minuto (sin segundos). */
function truncarFechaHoraAlMinuto(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0, 0)
}

/**
 * Indica si el turno sigue vigente y su fecha + hora de inicio ya llegó o coincide con el momento actual
 * (comparación al minuto: mismo minuto calendario o posterior).
 */
function turnoPendienteCoincideOYaPasoSuFechaYHora(turno: TurnosI, fechaHoraActual: Date): boolean {
  if (isCompletedTurno(turno.estado) || isCancelledTurno(turno.estado)) return false
  const inicioTurno = obtenerFechaHoraDelTurno(turno)
  if (!inicioTurno) return false
  const ahora = truncarFechaHoraAlMinuto(fechaHoraActual)
  const inicio = truncarFechaHoraAlMinuto(inicioTurno)
  return ahora.getTime() >= inicio.getTime()
}

function IconoMas({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

export default function UserDashboardTurnos() {
  const navigate = useNavigate()
  const nombreUsuario = getUserProfile().name ?? 'Invitado'
  const { idUsuario, listaTurnos, cargandoTurnos, errorCargaTurnos, cargarTurnosDelUsuario } = useUsuarioTurnos()
  const [fechaHoraActual, setFechaHoraActual] = useState(() => new Date())

  useEffect(() => {
    let montado = true
    ;(async () => {
      if (!montado) return
      setFechaHoraActual(new Date())
      await cargarTurnosDelUsuario()
    })()
    return () => {
      montado = false
    }
  }, [cargarTurnosDelUsuario])

  useEffect(() => {
    const id = window.setInterval(() => setFechaHoraActual(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const finalizarTurnosSegunFechaYHoraActual = useCallback(
    async (ahora: Date) => {
      if (!idUsuario || listaTurnos.length === 0) return
      const turnosParaFinalizar = listaTurnos.filter((turno) =>
        turnoPendienteCoincideOYaPasoSuFechaYHora(turno, ahora),
      )
      if (turnosParaFinalizar.length === 0) return
      const resultados = await Promise.allSettled(
        turnosParaFinalizar.map((turno) => finalizarTurno(Number(turno.id))),
      )
      const huboAlgunoExitoso = resultados.some((resultado) => resultado.status === 'fulfilled')
      if (huboAlgunoExitoso) {
        await cargarTurnosDelUsuario()
      }
    },
    [cargarTurnosDelUsuario, idUsuario, listaTurnos],
  )

  useEffect(() => {
    void finalizarTurnosSegunFechaYHoraActual(fechaHoraActual)
  }, [finalizarTurnosSegunFechaYHoraActual, fechaHoraActual])

  const turnosProximos = useMemo(
    () => listaTurnos.filter((t) => !isCompletedTurno(t.estado) && !isCancelledTurno(t.estado)),
    [listaTurnos],
  )

  function navegarAPantallaCrearTurno() {
    navigate('/create-turno')
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Hola, {nombreUsuario}</h1>
          <p className="mt-1 text-sm text-neutral-500 sm:text-base">Bienvenido de nuevo a tu panel de gestión.</p>
        </div>
        <button
          type="button"
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110 active:scale-[0.99] sm:w-auto"
          style={{ backgroundColor: COLOR_PRIMARIO }}
          onClick={navegarAPantallaCrearTurno}
        >
          <IconoMas className="h-5 w-5" />
          Agendar nuevo turno
        </button>
      </div>

      <div className="mt-8 border-b border-neutral-200">
        <div className="flex gap-8">
          <span className="relative pb-3 text-sm font-semibold text-[#1D4ED8]">
            Próximos turnos
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1D4ED8]" />
          </span>
        </div>
      </div>

      <TurnosUser
        proximosTurnos={turnosProximos}
        turnosLoading={cargandoTurnos}
        turnosError={errorCargaTurnos}
        despuesDeCancelarTurno={cargarTurnosDelUsuario}
      />
    </>
  )
}
