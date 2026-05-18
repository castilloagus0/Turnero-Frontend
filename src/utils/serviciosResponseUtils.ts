import type { Servicios } from '../interface/servicios.interface'

export function normalizarListaServicios(data: unknown): Servicios[] {
  if (data == null) return []
  if (Array.isArray(data)) return data as Servicios[]
  if (typeof data === 'object') {
    const o = data as { data?: unknown; servicios?: unknown }
    if (Array.isArray(o.data)) return o.data as Servicios[]
    if (Array.isArray(o.servicios)) return o.servicios as Servicios[]
  }
  return []
}
