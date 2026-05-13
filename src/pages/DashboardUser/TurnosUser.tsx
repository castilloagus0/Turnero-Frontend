// Lista en tarjetas los turnos próximos (no completados ni cancelados) y gestiona cancelación y reagendar.
import { useCallback, useEffect, useState } from 'react'
import type { TurnosI } from '../../interface/turnos.interface'
import type { Horarios } from '../../interface/horarios.interface'
import type { AppointmentStatus } from './dashboardUserUtils'
import {
  barberoDelTurno,
  fechaIsoDiaDesdeTurno,
  formatDateLabel,
  formatTimeLabel,
  isCancelledTurno,
  isCompletedTurno,
  normalizeStatus,
  turnoTieneAnticipacionMinimaHoras,
} from './dashboardUserUtils'
import { cancelarTurno, reagendarTurno } from '../../service/turno.service'
import { getHorarios } from '../../service/horarios.service'

const PRIMARY = '#1D4ED8'

function IconoUsuario({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EtiquetaEstadoTurno({ status }: { status: AppointmentStatus }) {
  if (status === 'CONFIRMADO') {
    return (
      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
        Confirmado
      </span>
    )
  }
  if (status === 'EN_CURSO') {
    return (
      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
        Iniciado
      </span>
    )
  }
  if (status === 'COMPLETADO') {
    return (
      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-700">
        Completado
      </span>
    )
  }
  if (status === 'CANCELADO') {
    return (
      <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700">
        Cancelado
      </span>
    )
  }
  if (status === 'REPROGRAMADO') {
    return (
      <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700">
        Reprogramado
      </span>
    )
  }
  return (
    <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700">
      Pendiente
    </span>
  )
}

function etiquetaSlotAmPm(horaInicio: string): string {
  const [hRaw, mRaw] = horaInicio.split(':')
  const h = Number(hRaw)
  const m = Number(mRaw ?? 0)
  if (!Number.isFinite(h)) return horaInicio
  const hour12 = h % 12 === 0 ? 12 : h % 12
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${hour12.toString().padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`
}

function hoyIsoLocal(): string {
  const d = new Date()
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${mo}-${day}`
}

function esHorarioPasadoParaDia(isoDia: string, horaInicio: string, at: Date): boolean {
  const mat = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDia)
  if (!mat) return true
  const y = Number(mat[1])
  const mo = Number(mat[2]) - 1
  const da = Number(mat[3])
  const [hh, mm] = horaInicio.split(':').map((x) => Number(x))
  const start = new Date(y, mo, da, hh, Number.isFinite(mm) ? mm : 0, 0, 0)
  return start.getTime() < at.getTime()
}

function normalizarListaHorariosApi(data: unknown): Horarios[] {
  if (Array.isArray(data)) return data as Horarios[]
  if (data && typeof data === 'object') {
    const o = data as { data?: unknown; horarios?: unknown }
    if (Array.isArray(o.data)) return o.data as Horarios[]
    if (Array.isArray(o.horarios)) return o.horarios as Horarios[]
  }
  return []
}

type AlertaTurno = {
  variant: 'error' | 'success'
  titulo: string
  mensaje: string
}

type Props = {
  proximosTurnos: TurnosI[]
  turnosLoading: boolean
  turnosError: string | null
  /** Tras cancelar o reagendar con éxito. */
  despuesDeCancelarTurno?: () => void | Promise<void>
}

export default function TurnosUser({
  proximosTurnos,
  turnosLoading,
  turnosError,
  despuesDeCancelarTurno,
}: Props) {
  const [idTurnoCancelando, setIdTurnoCancelando] = useState<number | null>(null)
  const [idTurnoEnDialogoCancelar, setIdTurnoEnDialogoCancelar] = useState<number | null>(null)
  const [mensajeErrorCancelacion, setMensajeErrorCancelacion] = useState<string | null>(null)

  const [alerta, setAlerta] = useState<AlertaTurno | null>(null)
  const [turnoModalReagendar, setTurnoModalReagendar] = useState<TurnosI | null>(null)
  const [fechaReagendar, setFechaReagendar] = useState('')
  const [horarioIdReagendar, setHorarioIdReagendar] = useState('')
  const [horariosLista, setHorariosLista] = useState<Horarios[]>([])
  const [cargandoHorariosReagendar, setCargandoHorariosReagendar] = useState(false)
  const [errorFormReagendar, setErrorFormReagendar] = useState<string | null>(null)
  const [idTurnoReagendando, setIdTurnoReagendando] = useState<number | null>(null)
  const [relojModal, setRelojModal] = useState(() => new Date())

  const cerrarModalReagendar = useCallback(() => {
    setTurnoModalReagendar(null)
    setFechaReagendar('')
    setHorarioIdReagendar('')
    setHorariosLista([])
    setErrorFormReagendar(null)
    setCargandoHorariosReagendar(false)
  }, [])

  useEffect(() => {
    if (!turnoModalReagendar) return
    setRelojModal(new Date())
    const id = window.setInterval(() => setRelojModal(new Date()), 30_000)
    return () => clearInterval(id)
  }, [turnoModalReagendar])

  useEffect(() => {
    if (!turnoModalReagendar) return
    let montado = true
    setCargandoHorariosReagendar(true)
    setErrorFormReagendar(null)
    getHorarios()
      .then((raw) => {
        if (!montado) return
        const list = normalizarListaHorariosApi(raw).filter((h) => h.activo !== false)
        setHorariosLista(list)
      })
      .catch(() => {
        if (!montado) return
        setHorariosLista([])
        setErrorFormReagendar('No se pudieron cargar los horarios. Intentá de nuevo.')
      })
      .finally(() => {
        if (montado) setCargandoHorariosReagendar(false)
      })
    return () => {
      montado = false
    }
  }, [turnoModalReagendar])

  function abrirDialogoConfirmarCancelacion(idTurnoDesconocido: unknown) {
    const id = Number(idTurnoDesconocido)
    if (!Number.isFinite(id)) return
    setIdTurnoEnDialogoCancelar(id)
    setMensajeErrorCancelacion(null)
  }

  function cerrarDialogoConfirmarCancelacion() {
    setIdTurnoEnDialogoCancelar(null)
    setMensajeErrorCancelacion(null)
  }

  async function ejecutarCancelacionDelTurnoEnDialogo() {
    if (idTurnoEnDialogoCancelar == null) return
    const id = idTurnoEnDialogoCancelar
    setIdTurnoCancelando(id)
    try {
      await cancelarTurno(id)
      await despuesDeCancelarTurno?.()
      setIdTurnoEnDialogoCancelar(null)
      setMensajeErrorCancelacion(null)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'No se pudo cancelar el turno.'
      setMensajeErrorCancelacion(message)
    } finally {
      setIdTurnoCancelando(null)
    }
  }

  function abrirReagendar(turno: TurnosI) {
    const ahora = new Date()
    if (!turnoTieneAnticipacionMinimaHoras(turno, ahora, 1)) {
      setAlerta({
        variant: 'error',
        titulo: 'No podés reagendar',
        mensaje:
          'Solo podés reagendar si falta al menos 1 hora hasta el inicio del turno (fecha y hora del turno vs. ahora).',
      })
      return
    }
    setTurnoModalReagendar(turno)
    setFechaReagendar(fechaIsoDiaDesdeTurno(turno))
    setHorarioIdReagendar('')
    setErrorFormReagendar(null)
  }

  async function ejecutarReagendar() {
    if (!turnoModalReagendar) return
    if (!fechaReagendar || !horarioIdReagendar) {
      setErrorFormReagendar('Elegí una fecha y un horario.')
      return
    }
    const ahora = new Date()
    if (!turnoTieneAnticipacionMinimaHoras(turnoModalReagendar, ahora, 1)) {
      setErrorFormReagendar('Ya no se cumple la anticipación mínima de 1 hora respecto del turno actual.')
      return
    }
    if (esHorarioPasadoParaDia(fechaReagendar, horariosLista.find((h) => String(h.id) === horarioIdReagendar)?.horaInicio ?? '', ahora)) {
      setErrorFormReagendar('Ese horario ya no está disponible. Elegí otro.')
      return
    }

    const id = Number(turnoModalReagendar.id)
    setIdTurnoReagendando(id)
    setErrorFormReagendar(null)
    try {
      await reagendarTurno(id, fechaReagendar, Number(horarioIdReagendar))
      cerrarModalReagendar()
      await despuesDeCancelarTurno?.()
      setAlerta({
        variant: 'success',
        titulo: 'Turno reagendado',
        mensaje: 'Tu turno se actualizó con la nueva fecha y horario.',
      })
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'No se pudo reagendar el turno.'
      setErrorFormReagendar(message)
    } finally {
      setIdTurnoReagendando(null)
    }
  }

  const minFechaInput = hoyIsoLocal()

  return (
    <>
      {alerta ? (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="alerta-turno-titulo"
        >
          <div className="w-full max-w-md rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xl sm:p-8">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                alerta.variant === 'error' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              {alerta.variant === 'error' ? (
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden>
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <h3 id="alerta-turno-titulo" className="mt-5 text-center text-lg font-bold text-neutral-900">
              {alerta.titulo}
            </h3>
            <p className="mt-2 text-center text-sm leading-relaxed text-neutral-600">{alerta.mensaje}</p>
            <button
              type="button"
              className="mt-8 w-full rounded-xl px-5 py-3.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 active:scale-[0.99]"
              style={{ backgroundColor: PRIMARY }}
              onClick={() => setAlerta(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      ) : null}

      {turnoModalReagendar ? (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reagendar-titulo"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xl sm:p-6">
            <h3 id="reagendar-titulo" className="text-lg font-bold text-neutral-900">
              Reagendar turno
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              {turnoModalReagendar.servicio?.nombre} — actualmente el {formatDateLabel(turnoModalReagendar.fecha)} a{' '}
              {formatTimeLabel(turnoModalReagendar)}
            </p>

            <label className="mt-5 flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Nueva fecha</span>
              <input
                type="date"
                min={minFechaInput}
                value={fechaReagendar}
                onChange={(e) => {
                  setFechaReagendar(e.target.value)
                  setHorarioIdReagendar('')
                  setErrorFormReagendar(null)
                }}
                className="h-11 rounded-xl border border-neutral-200 px-3 text-sm text-neutral-800 outline-none transition focus:border-[#1D4ED8]"
              />
            </label>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">Nuevo horario</p>
            {cargandoHorariosReagendar ? (
              <p className="mt-2 text-sm text-neutral-500">Cargando horarios...</p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {horariosLista.map((h) => {
                  const idStr = String(h.id)
                  const pasado = esHorarioPasadoParaDia(fechaReagendar || minFechaInput, h.horaInicio, relojModal)
                  const sel = horarioIdReagendar === idStr
                  return (
                    <button
                      key={idStr}
                      type="button"
                      disabled={pasado || idTurnoReagendando != null}
                      onClick={() => {
                        setHorarioIdReagendar(idStr)
                        setErrorFormReagendar(null)
                      }}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                        pasado
                          ? 'cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-300'
                          : sel
                            ? 'border-[#1D4ED8] bg-[#eff6ff] text-[#1D4ED8]'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-[#1D4ED8]/40'
                      }`}
                    >
                      {etiquetaSlotAmPm(h.horaInicio)}
                    </button>
                  )
                })}
              </div>
            )}

            {errorFormReagendar ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errorFormReagendar}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
                onClick={cerrarModalReagendar}
                disabled={idTurnoReagendando != null}
              >
                Volver
              </button>
              <button
                type="button"
                className="rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ backgroundColor: PRIMARY }}
                onClick={() => void ejecutarReagendar()}
                disabled={idTurnoReagendando != null || !horarioIdReagendar || cargandoHorariosReagendar}
              >
                {idTurnoReagendando != null ? 'Guardando...' : 'Confirmar cambio'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {idTurnoEnDialogoCancelar != null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-bold text-neutral-900">¿Desea cancelar este turno?</h3>
            <p className="mt-2 text-sm text-neutral-500">Esta acción cancelará el turno seleccionado.</p>

            {mensajeErrorCancelacion ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {mensajeErrorCancelacion}
              </div>
            ) : null}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl border border-neutral-200 bg-white py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
                onClick={cerrarDialogoConfirmarCancelacion}
                disabled={idTurnoCancelando === idTurnoEnDialogoCancelar}
              >
                Volver
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border-2 border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                onClick={ejecutarCancelacionDelTurnoEnDialogo}
                disabled={idTurnoCancelando === idTurnoEnDialogoCancelar}
              >
                {idTurnoCancelando === idTurnoEnDialogoCancelar ? 'Cancelando...' : 'Cancelar turno'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {turnosLoading ? (
          <div className="col-span-full rounded-2xl border border-neutral-200/80 bg-white p-6 text-sm text-neutral-500 shadow-sm">
            Cargando turnos...
          </div>
        ) : turnosError ? (
          <div className="col-span-full rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-600 shadow-sm">
            {turnosError}
          </div>
        ) : proximosTurnos.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-neutral-200/80 bg-white p-8 text-center shadow-sm">
            <p className="text-neutral-500">No tenés turnos próximos para mostrar...</p>
          </div>
        ) : (
          proximosTurnos.map((turno) => (
            <article
              key={turno.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm"
            >
              <div className="aspect-16/10 overflow-hidden bg-neutral-100">
                <img src={turno.servicio?.imagen} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-bold text-neutral-900">{turno.servicio?.nombre}</h2>
                  <EtiquetaEstadoTurno status={normalizeStatus(turno.estado)} />
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
                  <IconoUsuario className="h-4 w-4 shrink-0 text-neutral-400" />
                  <span>
                    Barbero:{' '}
                    <span className="font-medium text-neutral-700">
                      {barberoDelTurno(turno)?.nombre} {barberoDelTurno(turno)?.apellido}
                    </span>
                  </span>
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-neutral-50 px-3 py-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Fecha</p>
                    <p className="mt-0.5 text-sm font-bold text-neutral-900">{formatDateLabel(turno.fecha)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Hora</p>
                    <p className="mt-0.5 text-sm font-bold text-neutral-900">{formatTimeLabel(turno)}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  {(() => {
                    const accionesDeshabilitadas = isCompletedTurno(turno.estado) || isCancelledTurno(turno.estado)
                    const estaCancelando = idTurnoCancelando === Number(turno.id)
                    const estaEnDialogo = idTurnoEnDialogoCancelar === Number(turno.id)
                    const estaReagendando = idTurnoReagendando === Number(turno.id)
                    const modalReagendarEste = turnoModalReagendar?.id === turno.id
                    return (
                      <>
                        <button
                          type="button"
                          className="flex-1 rounded-xl border border-neutral-200 bg-white py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
                          disabled={
                            accionesDeshabilitadas || estaCancelando || estaEnDialogo || estaReagendando || modalReagendarEste
                          }
                          onClick={() => abrirReagendar(turno)}
                        >
                          {estaReagendando ? 'Guardando...' : 'Reagendar'}
                        </button>
                        <button
                          type="button"
                          className="flex-1 rounded-xl border-2 border-red-200 bg-white py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          onClick={() => abrirDialogoConfirmarCancelacion(turno.id)}
                          disabled={
                            accionesDeshabilitadas || estaCancelando || estaEnDialogo || estaReagendando || modalReagendarEste
                          }
                        >
                          {estaCancelando ? 'Cancelando...' : 'Cancelar'}
                        </button>
                      </>
                    )
                  })()}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  )
}
