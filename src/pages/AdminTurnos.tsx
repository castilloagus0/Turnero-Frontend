import { useEffect, useMemo, useState } from 'react'
import { getAdminTurnos } from '../service/adminTurnos.service'
import type { AdminTurnosData, TurnoItem, TurnoStatus } from '../mocks/adminTurnos.mock'

type AsyncState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: AdminTurnosData }

const STATUS_LABEL: Record<TurnoStatus, string> = {
  confirmado: 'Confirmado',
  en_curso: 'En curso',
  completado: 'Completado',
  cancelado: 'Cancelado',
  pendiente: 'Pendiente',
}

const STATUS_STYLE: Record<TurnoStatus, string> = {
  confirmado: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  en_curso: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  completado: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  cancelado: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  pendiente: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function matchesSearch(turno: TurnoItem, search: string): boolean {
  const term = search.trim().toLowerCase()
  if (!term) return true
  return (
    turno.cliente.toLowerCase().includes(term) ||
    turno.barbero.toLowerCase().includes(term) ||
    turno.servicio.toLowerCase().includes(term) ||
    turno.medioPago.toLowerCase().includes(term)
  )
}

export default function AdminTurnos() {
  const [state, setState] = useState<AsyncState>({ status: 'loading' })
  const [selectedStatus, setSelectedStatus] = useState<TurnoStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selectedTurnoId, setSelectedTurnoId] = useState<number | null>(null)
  const turnos = state.status === 'success' ? state.data.turnos : []

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    getAdminTurnos()
      .then((data) => {
        if (cancelled) return
        setState({ status: 'success', data })
        setSelectedTurnoId(data.turnos[0]?.id ?? null)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        const message = error instanceof Error ? error.message : 'No fue posible cargar los turnos.'
        setState({ status: 'error', message })
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredTurnos = useMemo(
    () =>
      turnos.filter((turno) => {
        const matchStatus = selectedStatus === 'all' || turno.status === selectedStatus
        return matchStatus && matchesSearch(turno, search)
      }),
    [turnos, selectedStatus, search],
  )

  if (state.status === 'loading') {
    return (
      <section className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-neutral-500">Cargando turnos del negocio...</p>
        </div>
      </section>
    )
  }

  if (state.status === 'error') {
    return (
      <section className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
          <h1 className="text-lg font-bold text-red-800">Error al cargar turnos</h1>
          <p className="mt-2 text-sm text-red-700">{state.message}</p>
        </div>
      </section>
    )
  }

  const { summary, generatedAt } = state.data

  const selectedTurno = filteredTurnos.find((turno) => turno.id === selectedTurnoId) ?? filteredTurnos[0] ?? null

  return (
    <section className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Gestión de Turnos</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Plantilla de control de agenda con toda la información de turnos, clientes, servicio, barbero y estado.
        </p>
        <p className="mt-2 text-xs text-neutral-400">
          Última actualización: {new Date(generatedAt).toLocaleString('es-AR')}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Turnos del día</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{summary.total}</p>
        </article>
        <article className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Confirmados + En curso</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{summary.confirmados + summary.enCurso}</p>
        </article>
        <article className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Completados</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{summary.completados}</p>
        </article>
        <article className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Ingresos cerrados</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{formatCurrency(summary.ingresos)}</p>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <article className="xl:col-span-3 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedStatus('all')}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  selectedStatus === 'all' ? 'bg-[#2563EB] text-white' : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                Todos ({summary.total})
              </button>
              {(Object.keys(STATUS_LABEL) as TurnoStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    selectedStatus === status ? 'bg-[#2563EB] text-white' : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {STATUS_LABEL[status]}
                </button>
              ))}
            </div>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar cliente, barbero, servicio o pago..."
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none ring-[#2563EB]/20 transition focus:border-[#2563EB] focus:bg-white focus:ring-2 lg:max-w-md"
            />
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] uppercase tracking-wide text-neutral-400">
                  <th className="px-3 py-3">Horario</th>
                  <th className="px-3 py-3">Cliente</th>
                  <th className="px-3 py-3">Servicio</th>
                  <th className="px-3 py-3">Barbero</th>
                  <th className="px-3 py-3">Pago</th>
                  <th className="px-3 py-3 text-right">Precio</th>
                  <th className="px-3 py-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredTurnos.map((turno) => (
                  <tr
                    key={turno.id}
                    onClick={() => setSelectedTurnoId(turno.id)}
                    className={`cursor-pointer border-b border-neutral-50 transition hover:bg-neutral-50 ${
                      selectedTurno?.id === turno.id ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <td className="px-3 py-3 font-medium text-neutral-800">
                      {turno.hora}
                      <span className="mt-0.5 block text-xs text-neutral-500">{turno.duracionMin} min</span>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-neutral-900">{turno.cliente}</p>
                      <p className="text-xs text-neutral-500">{turno.clienteTelefono}</p>
                    </td>
                    <td className="px-3 py-3 text-neutral-700">{turno.servicio}</td>
                    <td className="px-3 py-3 text-neutral-700">{turno.barbero}</td>
                    <td className="px-3 py-3 text-neutral-700">{turno.medioPago}</td>
                    <td className="px-3 py-3 text-right font-semibold text-neutral-900">{formatCurrency(turno.precio)}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[turno.status]}`}>
                        {STATUS_LABEL[turno.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTurnos.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-neutral-500">
                No hay turnos que coincidan con los filtros aplicados.
              </div>
            ) : null}
          </div>
        </article>

        <aside className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900">Detalle del turno</h2>
          {selectedTurno ? (
            <div className="mt-4 space-y-4 text-sm">
              <div className="rounded-xl bg-neutral-50 p-3">
                <p className="text-xs uppercase tracking-wide text-neutral-500">Fecha</p>
                <p className="mt-1 font-semibold text-neutral-900">{formatDate(selectedTurno.fecha)}</p>
                <p className="text-neutral-600">
                  {selectedTurno.hora} - {selectedTurno.duracionMin} min
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">Cliente</p>
                <p className="mt-1 font-semibold text-neutral-900">{selectedTurno.cliente}</p>
                <p className="text-neutral-600">{selectedTurno.clienteTelefono}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">Servicio</p>
                <p className="mt-1 font-semibold text-neutral-900">{selectedTurno.servicio}</p>
                <p className="text-neutral-600">Precio: {formatCurrency(selectedTurno.precio)}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">Barbero asignado</p>
                <p className="mt-1 font-semibold text-neutral-900">{selectedTurno.barbero}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">Medio de pago</p>
                <p className="mt-1 font-semibold text-neutral-900">{selectedTurno.medioPago}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">Estado</p>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[selectedTurno.status]}`}>
                  {STATUS_LABEL[selectedTurno.status]}
                </span>
              </div>

              {selectedTurno.observaciones ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-amber-700">Observaciones</p>
                  <p className="mt-1 text-amber-900">{selectedTurno.observaciones}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-neutral-500">Seleccioná un turno para visualizar el detalle completo.</p>
          )}
        </aside>
      </div>
    </section>
  )
}
