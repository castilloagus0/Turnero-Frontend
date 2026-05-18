import { useCallback, useEffect, useMemo, useState } from 'react'
import type { TurnosI } from '../../interface/turnos.interface'
import { getTurnosProximos } from '../../service/turno.service'
import { ADMIN_LIST_PAGE_SIZE } from './dashboardAdminListaActividadUi'

export function useAdminTurnosProximos(pageSize: number = ADMIN_LIST_PAGE_SIZE) {
  const [pagina, setPagina] = useState(1)
  const [turnos, setTurnos] = useState<TurnosI[]>([])
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [cargandoTurnos, setCargandoTurnos] = useState(false)
  const [errorCargaTurnos, setErrorCargaTurnos] = useState<string | null>(null)

  const cargarTurnos = useCallback(async () => {
    setCargandoTurnos(true)
    setErrorCargaTurnos(null)
    try {
      const { turnos: lista, meta } = await getTurnosProximos(pagina, pageSize)
      setTurnos(lista)
      setTotalPaginas(meta.totalPages)
      setTotalRegistros(meta.total)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'No se pudieron cargar los turnos próximos.'
      setErrorCargaTurnos(message)
      setTurnos([])
      setTotalRegistros(0)
      setTotalPaginas(1)
    } finally {
      setCargandoTurnos(false)
    }
  }, [pagina, pageSize])

  useEffect(() => {
    void cargarTurnos()
  }, [cargarTurnos])

  const etiquetaRango = useMemo(() => {
    if (totalRegistros === 0) return '0 registros'
    const desde = (pagina - 1) * pageSize + 1
    const hasta = Math.min(pagina * pageSize, totalRegistros)
    return `${desde}-${hasta} de ${totalRegistros}`
  }, [pagina, pageSize, totalRegistros])

  return {
    pagina,
    setPagina,
    turnos,
    totalPaginas,
    totalRegistros,
    etiquetaRango,
    cargandoTurnos,
    errorCargaTurnos,
    cargarTurnos,
  }
}
