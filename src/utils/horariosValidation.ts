import type { Horarios } from '../interface/horarios.interface'

const HORA_REGEX = /^([01]?\d|2[0-3]):([0-5]\d)$/

export function parseHoraAMinutos(hora: string): number | null {
  const trimmed = hora.trim()
  const match = HORA_REGEX.exec(trimmed)
  if (!match) return null
  return Number(match[1]) * 60 + Number(match[2])
}

export function esHoraValida(hora: string): boolean {
  return parseHoraAMinutos(hora) !== null
}

function intervalosSeSolapan(inicioA: number, finA: number, inicioB: number, finB: number): boolean {
  return inicioA < finB && inicioB < finA
}

export type HorarioFormPayload = {
  horaInicio: string
  horaFin: string
  activo: boolean
}

export function validarFormularioHorario(
  payload: HorarioFormPayload,
  existentes: Horarios[],
  editingId?: string | number | null,
): string | null {
  const inicio = payload.horaInicio.trim()
  const fin = payload.horaFin.trim()

  if (!inicio || !fin) {
    return 'Completá hora de inicio y hora de fin.'
  }

  const minInicio = parseHoraAMinutos(inicio)
  const minFin = parseHoraAMinutos(fin)

  if (minInicio === null || minFin === null) {
    return 'Usá un formato de hora válido (HH:mm, 24 h).'
  }

  if (minFin <= minInicio) {
    return 'La hora de fin debe ser posterior a la de inicio.'
  }

  const idEdit = editingId != null ? String(editingId) : null
  const conflicto = existentes.some((h) => {
    if (idEdit && String(h.id) === idEdit) return false
    if (h.activo === false && payload.activo) {
      // slots inactivos no bloquean si estamos creando otro activo
    }
    const existInicio = parseHoraAMinutos(String(h.horaInicio ?? ''))
    const existFin = parseHoraAMinutos(String(h.horaFin ?? ''))
    if (existInicio === null || existFin === null) return false
    return intervalosSeSolapan(minInicio, minFin, existInicio, existFin)
  })

  if (conflicto) {
    return 'Este horario se solapa con otro existente. Elegí otro rango.'
  }

  return null
}
