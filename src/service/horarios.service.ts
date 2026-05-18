import axios from 'axios'
import type { Horarios } from '../interface/horarios.interface'

export function normalizarListaHorarios(data: unknown): Horarios[] {
  if (Array.isArray(data)) return data as Horarios[]
  if (data && typeof data === 'object') {
    const o = data as { data?: unknown; horarios?: unknown }
    if (Array.isArray(o.data)) return o.data as Horarios[]
    if (Array.isArray(o.horarios)) return o.horarios as Horarios[]
  }
  return []
}

export async function getHorarios(): Promise<Horarios[]> {
  try {
    const response = await axios.get(`${import.meta.env.VITE_URL_API}horarios`)
    return normalizarListaHorarios(response.data)
  } catch (error) {
    console.error('Error al obtener los horarios:', error)
    throw error
  }
}

export async function createHorario(payload: Pick<Horarios, 'horaInicio' | 'horaFin' | 'activo'>) {
  try {
    const response = await axios.post(`${import.meta.env.VITE_URL_API}horarios`, payload)
    return response.data
  } catch (error: unknown) {
    console.error('Error al crear el horario:', error)
    const err = error as { response?: { data?: { message?: string; error?: string } }; message?: string }
    const message =
      err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? 'No se pudo crear el horario.'
    throw new Error(String(message))
  }
}

export async function updateHorario(
  id: string | number,
  payload: Pick<Horarios, 'horaInicio' | 'horaFin' | 'activo'>,
) {
  try {
    const response = await axios.put(`${import.meta.env.VITE_URL_API}horarios/${id}`, payload)
    return response.data
  } catch (error: unknown) {
    console.error('Error al actualizar el horario:', error)
    const err = error as { response?: { data?: { message?: string; error?: string } }; message?: string }
    const message =
      err?.response?.data?.message ??
      err?.response?.data?.error ??
      err?.message ??
      'No se pudo actualizar el horario.'
    throw new Error(String(message))
  }
}
