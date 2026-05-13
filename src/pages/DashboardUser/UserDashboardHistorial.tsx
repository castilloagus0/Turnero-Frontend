import { useEffect } from 'react'
import { getUserProfile } from '../../lib/userProfileStorage'
import DashboardUserActividad from './DashboardUserActividad'
import { useUsuarioTurnos } from './useUsuarioTurnos'

export default function UserDashboardHistorial() {
  const nombreUsuario = getUserProfile().name ?? 'Invitado'
  const { listaTurnos, cargandoTurnos, errorCargaTurnos, cargarTurnosDelUsuario } = useUsuarioTurnos()

  useEffect(() => {
    let montado = true
    ;(async () => {
      if (!montado) return
      await cargarTurnosDelUsuario()
    })()
    return () => {
      montado = false
    }
  }, [cargarTurnosDelUsuario])

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Hola, {nombreUsuario}</h1>
          <p className="mt-1 text-sm text-neutral-500 sm:text-base">
            Consultá el historial de tus turnos con importes y detalles.
          </p>
        </div>
      </div>

      <DashboardUserActividad turnos={listaTurnos} turnosLoading={cargandoTurnos} turnosError={errorCargaTurnos} />
    </>
  )
}
