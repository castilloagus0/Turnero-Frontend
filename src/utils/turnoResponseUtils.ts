import type { TurnosI } from '../interface/turnos.interface'

export type MetaPaginacionTurnos = {
  page: number
  limit: number
  total: number
  totalPages: number
}

/** Normaliza la respuesta del GET de turnos (misma forma en user-dashboard y admin). */
export function normalizarListaTurnosDesdeRespuestaApi(response: unknown): TurnosI[] {
  if (response == null) return []
  if (Array.isArray(response)) return response as TurnosI[]
  if (typeof response === 'object') {
    const r = response as { turnos?: unknown; data?: unknown; rows?: unknown }
    if (Array.isArray(r.turnos)) return r.turnos as TurnosI[]
    if (Array.isArray(r.data)) return r.data as TurnosI[]
    if (Array.isArray(r.rows)) return r.rows as TurnosI[]
  }
  return []
}

function asPositiveInt(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

/** Extrae metadatos de paginación cuando el backend los envía junto al listado. */
export function extraerMetaPaginacionDesdeRespuestaApi(
  response: unknown,
  page: number,
  limit: number,
): MetaPaginacionTurnos {
  const lista = normalizarListaTurnosDesdeRespuestaApi(response)
  if (!response || typeof response !== 'object' || Array.isArray(response)) {
    const total = lista.length
    return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
  }

  const r = response as Record<string, unknown>
  const total = asPositiveInt(r.total ?? r.totalCount ?? r.count, lista.length)
  const totalPages = asPositiveInt(
    r.totalPages ?? r.totalPaginas ?? r.pages,
    Math.max(1, Math.ceil(total / limit)),
  )
  const currentPage = asPositiveInt(r.page ?? r.currentPage ?? r.pagina, page)

  return { page: currentPage, limit, total, totalPages }
}
