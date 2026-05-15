import { useEffect, useMemo, useState } from 'react'
import { getAdminTurnos } from '../service/adminTurnos.service'
import type { AdminTurnosData, TurnoItem, TurnoStatus } from '../mocks/adminTurnos.mock'
import {
  BanknoteIcon,
  CalendarIcon,
  formatFechaHora24hEsAr,
  formatMonedaArs,
  ScissorsIcon,
  SearchIcon,
  TarjetaStatAdmin,
  WalletIcon,
} from './DashboardAdmin/adminDashboardUi'
import { getUserProfile } from '../lib/userProfileStorage'

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

function clasesEstadoTurno(status: TurnoStatus): string {
  return STATUS_STYLE[status] ?? STATUS_STYLE.pendiente
}

function textoEstadoTurno(status: TurnoStatus): string {
  return STATUS_LABEL[status] ?? STATUS_LABEL.pendiente
}

function formatDate(date: string): string {
  const base = String(date ?? '').slice(0, 10)
  const parsed = new Date(`${base || '1970-01-01'}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return '—'
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

function matchesSearch(turno: TurnoItem, search: string): boolean {
  const term = search.trim().toLowerCase()
  if (!term) return true
  return (
    String(turno.cliente ?? '').toLowerCase().includes(term) ||
    String(turno.barbero ?? '').toLowerCase().includes(term) ||
    String(turno.servicio ?? '').toLowerCase().includes(term) ||
    String(turno.medioPago ?? '').toLowerCase().includes(term)
  )
}

const FILTRO_ACTIVO = 'bg-[#1D4ED8] text-white shadow-sm'
const FILTRO_INACTIVO =
  'border border-neutral-200/80 bg-white text-neutral-700 shadow-sm hover:border-[#1D4ED8]/30 hover:bg-[#1D4ED8]/5'

const INPUT_BASE =
  'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20'

export default function AdminTurnos() {
  const nombreAdmin = getUserProfile()?.name ?? 'Administrador'

  const [state, setState] = useState<AsyncState>({ status: 'loading' })
  const [selectedStatus, setSelectedStatus] = useState<TurnoStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selectedBarber, setSelectedBarber] = useState('all')
  const [selectedService, setSelectedService] = useState('all')
  const [selectedPayment, setSelectedPayment] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
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

  const availableBarbers = useMemo(
    () => [...new Set(turnos.map((turno) => turno.barbero).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')),
    [turnos],
  )

  const availableServices = useMemo(
    () => [...new Set(turnos.map((turno) => turno.servicio).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')),
    [turnos],
  )

  const availablePaymentMethods = useMemo(
    () => [...new Set(turnos.map((turno) => turno.medioPago).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')),
    [turnos],
  )

  const filteredTurnos = useMemo(
    () =>
      turnos.filter((turno) => {
        const matchStatus = selectedStatus === 'all' || turno.status === selectedStatus
        const matchBarber = selectedBarber === 'all' || turno.barbero === selectedBarber
        const matchService = selectedService === 'all' || turno.servicio === selectedService
        const matchPayment = selectedPayment === 'all' || turno.medioPago === selectedPayment
        const matchDate = !selectedDate || turno.fecha.startsWith(selectedDate)
        return matchStatus && matchBarber && matchService && matchPayment && matchDate && matchesSearch(turno, search)
      }),
    [turnos, selectedStatus, selectedBarber, selectedService, selectedPayment, selectedDate, search],
  )

  if (state.status === 'loading') {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-neutral-500">Cargando turnos del negocio...</p>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
        <h1 className="text-lg font-bold text-red-800">Error al cargar turnos</h1>
        <p className="mt-2 text-sm text-red-700">{state.message}</p>
      </div>
    )
  }

  const { summary, generatedAt } = state.data
  const selectedTurno = filteredTurnos.find((turno) => turno.id === selectedTurnoId) ?? filteredTurnos[0] ?? null

  return (
    <div className="space-y-6">
      <header className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-white via-white to-neutral-50/80 p-5 shadow-sm sm:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Hola, {nombreAdmin}</h1>
          <p className="mt-1 max-w-2xl text-sm text-neutral-600 sm:text-base">
            Gestioná la agenda: filtrá por estado, profesional, servicio o fecha. Los cambios se reflejan en la vista
            en vivo del negocio.
          </p>
          <p className="mt-3 text-xs font-medium text-neutral-500">
            Última actualización:{' '}
            <time dateTime={generatedAt} className="text-neutral-600">
              {formatFechaHora24hEsAr(generatedAt)}
            </time>
          </p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaStatAdmin
          titulo="Turnos del día"
          valor={String(summary.total)}
          detalle="En agenda"
          variante="emerald"
          icono={<BanknoteIcon className="h-6 w-6" />}
        />
        <TarjetaStatAdmin
          titulo="Confirmados + En curso"
          valor={String(summary.confirmados + summary.enCurso)}
          detalle="Activos"
          variante="blue"
          icono={<CalendarIcon className="h-6 w-6" />}
        />
        <TarjetaStatAdmin
          titulo="Completados"
          valor={String(summary.completados)}
          detalle="Cerrados"
          variante="orange"
          icono={<ScissorsIcon className="h-6 w-6" />}
        />
        <TarjetaStatAdmin
          titulo="Ingresos cerrados"
          valor={formatMonedaArs(summary.ingresos)}
          variante="emerald"
          icono={<WalletIcon className="h-6 w-6" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <article className="space-y-5 xl:col-span-3">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Filtros</h2>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStatus('all')}
                  className={`rounded-full px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                    selectedStatus === 'all' ? FILTRO_ACTIVO : FILTRO_INACTIVO
                  }`}
                >
                  Todos ({summary.total})
                </button>
                {(Object.keys(STATUS_LABEL) as TurnoStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`rounded-full px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                      selectedStatus === status ? FILTRO_ACTIVO : FILTRO_INACTIVO
                    }`}
                  >
                    {STATUS_LABEL[status]}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <SearchIcon className="h-5 w-5" />
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar cliente, barbero, servicio o pago..."
                  className={`${INPUT_BASE} pl-10`}
                  aria-label="Buscar en turnos"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Barbero</span>
                  <select
                    value={selectedBarber}
                    onChange={(event) => setSelectedBarber(event.target.value)}
                    className={INPUT_BASE}
                  >
                    <option value="all">Todos los barberos</option>
                    {availableBarbers.map((barbero) => (
                      <option key={barbero} value={barbero}>
                        {barbero}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Servicio</span>
                  <select
                    value={selectedService}
                    onChange={(event) => setSelectedService(event.target.value)}
                    className={INPUT_BASE}
                  >
                    <option value="all">Todos los servicios</option>
                    {availableServices.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Pago</span>
                  <select
                    value={selectedPayment}
                    onChange={(event) => setSelectedPayment(event.target.value)}
                    className={INPUT_BASE}
                  >
                    <option value="all">Todos los medios</option>
                    {availablePaymentMethods.map((paymentMethod) => (
                      <option key={paymentMethod} value={paymentMethod}>
                        {paymentMethod}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Fecha</span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className={INPUT_BASE}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="border-b border-neutral-100 bg-gradient-to-r from-neutral-50/90 to-white px-4 py-3 sm:px-5">
              <h2 className="text-base font-bold tracking-tight text-neutral-900">Listado de turnos</h2>
              <p className="mt-0.5 text-xs text-neutral-500">
                {filteredTurnos.length} resultado{filteredTurnos.length === 1 ? '' : 's'}
              </p>
            </div>

            <ul className="divide-y divide-neutral-100 md:hidden" aria-label="Turnos en vista compacta">
              {filteredTurnos.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-neutral-500">No hay turnos con estos filtros.</li>
              ) : (
                filteredTurnos.map((turno) => (
                  <li key={turno.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedTurnoId(turno.id)}
                      className={`flex w-full flex-col gap-2 px-4 py-4 text-left transition ${
                        selectedTurno?.id === turno.id ? 'bg-[#1D4ED8]/6' : 'active:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{turno.cliente}</p>
                          <p className="text-xs text-neutral-500">{turno.hora}</p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${clasesEstadoTurno(turno.status)}`}
                        >
                          {textoEstadoTurno(turno.status)}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600">{turno.servicio}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                        <span>{turno.barbero}</span>
                        <span>{formatMonedaArs(turno.precio)}</span>
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/90 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    <th className="px-4 py-3">Horario</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Servicio</th>
                    <th className="px-4 py-3">Barbero</th>
                    <th className="px-4 py-3">Pago</th>
                    <th className="px-4 py-3 text-right">Precio</th>
                    <th className="px-4 py-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredTurnos.map((turno) => (
                    <tr
                      key={turno.id}
                      onClick={() => setSelectedTurnoId(turno.id)}
                      className={`cursor-pointer transition hover:bg-neutral-50/90 ${
                        selectedTurno?.id === turno.id ? 'bg-[#1D4ED8]/8' : ''
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-neutral-800">
                        {turno.hora}
                        <span className="mt-0.5 block text-xs font-normal text-neutral-500">{turno.duracionMin} min</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-neutral-900">{turno.cliente}</p>
                        <p className="text-xs text-neutral-500">{turno.clienteTelefono}</p>
                      </td>
                      <td className="max-w-[10rem] truncate px-4 py-3 text-neutral-700" title={turno.servicio}>
                        {turno.servicio}
                      </td>
                      <td className="px-4 py-3 text-neutral-700">{turno.barbero}</td>
                      <td className="px-4 py-3 text-neutral-700">{turno.medioPago}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-neutral-900">
                        {formatMonedaArs(turno.precio)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${clasesEstadoTurno(turno.status)}`}
                        >
                          {textoEstadoTurno(turno.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTurnos.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-neutral-500">
                  No hay turnos que coincidan con los filtros.
                </div>
              ) : null}
            </div>
          </div>
        </article>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
            <div className="border-b border-neutral-100 bg-gradient-to-r from-neutral-50/90 to-white px-4 py-3">
              <h2 className="text-base font-bold tracking-tight text-neutral-900">Detalle del turno</h2>
              <p className="text-xs text-neutral-500">Seleccioná una fila o tarjeta</p>
            </div>
            <div className="p-4 sm:p-5">
              {selectedTurno ? (
                <div className="space-y-4 text-sm">
                  <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Fecha y horario</p>
                    <p className="mt-1 font-semibold text-neutral-900">{formatDate(selectedTurno.fecha)}</p>
                    <p className="text-neutral-600">
                      {selectedTurno.hora} · {selectedTurno.duracionMin} min
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Cliente</p>
                    <p className="mt-1 font-semibold text-neutral-900">{selectedTurno.cliente}</p>
                    <p className="text-neutral-600">{selectedTurno.clienteTelefono}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Servicio</p>
                    <p className="mt-1 font-semibold text-neutral-900">{selectedTurno.servicio}</p>
                    <p className="text-neutral-600">{formatMonedaArs(selectedTurno.precio)}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Barbero</p>
                    <p className="mt-1 font-semibold text-neutral-900">{selectedTurno.barbero}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Medio de pago</p>
                    <p className="mt-1 font-semibold text-neutral-900">{selectedTurno.medioPago}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Estado</p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${clasesEstadoTurno(selectedTurno.status)}`}
                    >
                      {textoEstadoTurno(selectedTurno.status)}
                    </span>
                  </div>

                  {selectedTurno.observaciones ? (
                    <div className="rounded-xl border border-amber-200/80 bg-amber-50/90 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-amber-800">Observaciones</p>
                      <p className="mt-1 text-amber-950">{selectedTurno.observaciones}</p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">Seleccioná un turno para ver el detalle completo.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
