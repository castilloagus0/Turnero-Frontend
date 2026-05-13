import { useCallback, useMemo, useState } from 'react'
import { getTurnoByUser } from '../../service/turno.service'
import type { TurnosI } from '../../interface/turnos.interface'

function normalizarListaDesdeRespuestaApi(response: unknown): TurnosI[] {
  if (Array.isArray(response)) return response
  if (response && typeof response === 'object') {
    const r = response as { turnos?: unknown; data?: unknown }
    if (Array.isArray(r.turnos)) return r.turnos
    if (Array.isArray(r.data)) return r.data
  }
  return []
}

export function useUsuarioTurnos() {
  const idUsuario = useMemo(() => {
    const raw = localStorage.getItem('userId')
    const n = Number(raw)
    return Number.isFinite(n) ? n : 0
  }, [])

  const [listaTurnos, setListaTurnos] = useState<TurnosI[]>([])
  const [cargandoTurnos, setCargandoTurnos] = useState(false)
  const [errorCargaTurnos, setErrorCargaTurnos] = useState<string | null>(null)

  const cargarTurnosDelUsuario = useCallback(async () => {
    if (!idUsuario) {
      setListaTurnos([])
      return
    }
    setCargandoTurnos(true)
    setErrorCargaTurnos(null)
    try {
      const response = await getTurnoByUser(idUsuario, 1, 50)
      setListaTurnos(normalizarListaDesdeRespuestaApi(response))
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'No se pudieron cargar los turnos.'
      setErrorCargaTurnos(message)
    } finally {
      setCargandoTurnos(false)
    }
  }, [idUsuario])

  return {
    idUsuario,
    listaTurnos,
    cargandoTurnos,
    errorCargaTurnos,
    cargarTurnosDelUsuario,
  }
}
