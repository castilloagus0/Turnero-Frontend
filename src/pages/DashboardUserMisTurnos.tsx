import { useState } from 'react'
import type { TurnosI } from '../interface/turnos.interface'
import type { AppointmentStatus } from './dashboardUserUtils'
import {
  barberoDelTurno,
  formatDateLabel,
  formatTimeLabel,
  isCancelledTurno,
  isCompletedTurno,
  normalizeStatus,
} from './dashboardUserUtils'

function UserIcon({ className }: { className?: string }) {
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

function StatusBadge({ status }: { status: AppointmentStatus }) {
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
  return (
    <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700">
      Pendiente
    </span>
  )
}

type Props = {
  proximosTurnos: TurnosI[]
  historialTurnos: TurnosI[]
  turnosLoading: boolean
  turnosError: string | null
  onCancelarTurno: (idTurno: number) => void | Promise<void>
}

export default function DashboardUserMisTurnos({
  proximosTurnos,
  historialTurnos,
  turnosLoading,
  turnosError,
  onCancelarTurno,
}: Props) {
  const [mainTab, setMainTab] = useState<'proximos' | 'historial'>('proximos')
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const [confirmCancelarId, setConfirmCancelarId] = useState<number | null>(null)
  const [confirmCancelarError, setConfirmCancelarError] = useState<string | null>(null)

  function openConfirmCancelar(turnoId: unknown) {
    const id = Number(turnoId)
    if (!Number.isFinite(id)) return
    setConfirmCancelarId(id)
    setConfirmCancelarError(null)
  }

  function closeConfirmCancelar() {
    setConfirmCancelarId(null)
    setConfirmCancelarError(null)
  }

  async function confirmCancelar() {
    if (confirmCancelarId == null) return
    const id = confirmCancelarId
    setCancellingId(id)
    try {
      await onCancelarTurno(id)
      setConfirmCancelarId(null)
      setConfirmCancelarError(null)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'No se pudo cancelar el turno.'
      setConfirmCancelarError(message)
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <>
      {confirmCancelarId != null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-bold text-neutral-900">¿Desea cancelar este turno?</h3>
            <p className="mt-2 text-sm text-neutral-500">
              Esta acción cancelará el turno seleccionado.
            </p>

            {confirmCancelarError ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {confirmCancelarError}
              </div>
            ) : null}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl border border-neutral-200 bg-white py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
                onClick={closeConfirmCancelar}
                disabled={cancellingId === confirmCancelarId}
              >
                Volver
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border-2 border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                onClick={confirmCancelar}
                disabled={cancellingId === confirmCancelarId}
              >
                {cancellingId === confirmCancelarId ? 'Cancelando...' : 'Cancelar turno'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-8 border-b border-neutral-200">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => setMainTab('proximos')}
            className={`relative pb-3 text-sm font-semibold transition ${
              mainTab === 'proximos' ? 'text-[#1D4ED8]' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Próximos turnos
            {mainTab === 'proximos' ? (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1D4ED8]" />
            ) : null}
          </button>
        </div>
      </div>

      {mainTab === 'proximos' ? (
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
              <p className="text-neutral-500">No tenés turnos próximos para mostrar.</p>
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
                    <StatusBadge status={normalizeStatus(turno.estado)} />
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
                    <UserIcon className="h-4 w-4 shrink-0 text-neutral-400" />
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
                      const actionsDisabled = isCompletedTurno(turno.estado) || isCancelledTurno(turno.estado)
                      const isCancelling = cancellingId === Number(turno.id)
                      const isConfirming = confirmCancelarId === Number(turno.id)
                      return (
                        <>
                    <button
                      type="button"
                      className="flex-1 rounded-xl border border-neutral-200 bg-white py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
                      disabled={actionsDisabled || isCancelling || isConfirming}
                    >
                      Reagendar
                    </button>
                    <button
                      type="button"
                      className="flex-1 rounded-xl border-2 border-red-200 bg-white py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      onClick={() => openConfirmCancelar(turno.id)}
                      disabled={actionsDisabled || isCancelling || isConfirming}
                    >
                      {isCancelling ? 'Cancelando...' : 'Cancelar'}
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
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {historialTurnos.map((turno) => (
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
                  <StatusBadge status={normalizeStatus(turno.estado)} />
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
                  <UserIcon className="h-4 w-4 shrink-0 text-neutral-400" />
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
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
