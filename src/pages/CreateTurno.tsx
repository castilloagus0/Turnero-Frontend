import { useEffect, useMemo, useState } from 'react'

// Services
import { getServicios } from '../service/servicios.service'
import { getBarberos } from '../service/barbero.service'
import { getHorarios } from '../service/horarios.service'

// Interfaces
import { Horarios } from '../interface/horarios.interface'
import { Barbero } from '../interface/barbero.interface'
import { Servicios } from '../interface/servicios.interface'

const WEEKDAYS = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'] as const

const MONTHS_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
] as const

const MONTHS_LONG = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
] as const

function formatSlotLabel(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const hour12 = h % 12 === 0 ? 12 : h % 12
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${hour12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`
}

function formatPriceARS(n: string | number): string {
  return Number(n).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

type CalendarCell = { day: number; inMonth: 'prev' | 'current' | 'next' }

function buildCalendar(year: number, month: number): CalendarCell[] {
  const firstDow = new Date(year, month, 1).getDay()
  const daysThis = new Date(year, month + 1, 0).getDate()
  const daysPrev = new Date(year, month, 0).getDate()
  const cells: CalendarCell[] = []
  for (let i = firstDow - 1; i >= 0; i--) {
    cells.push({ day: daysPrev - i, inMonth: 'prev' })
  }
  for (let d = 1; d <= daysThis; d++) {
    cells.push({ day: d, inMonth: 'current' })
  }
  let next = 1
  while (cells.length % 7 !== 0) {
    cells.push({ day: next++, inMonth: 'next' })
  }
  return cells
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarSummaryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M9 16l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CreateTurno() {
  const [services, setServices] = useState<Servicios[]>([])
  const [barbers, setBarbers] = useState<Barbero[]>([])
  const [horarios, setHorarios] = useState<Horarios[]>([])

  const [serviceId, setServiceId] = useState<string>('')
  const [barberId, setBarberId] = useState<string>('')
  const [horarioId, setHorarioId] = useState<string>('')

  useEffect(() => {
    getServicios()
      .then((data: Servicios[]) => {
        const activos = data.filter((s) => s.activo)
        setServices(activos)
      })
      .catch(() => { })
  }, [])

  useEffect(() => {
    getBarberos()
      .then((data: Barbero[]) => {
        setBarbers(data)
        if (data.length > 0) setBarberId(data[0].id)
      })
      .catch(() => { })
  }, [])

  useEffect(() => {
    getHorarios()
      .then((data: Horarios[]) => {
        setHorarios(data)
      })
      .catch(() => { })
  }, [])

  const morningHorarios = horarios.filter((h) => {
    const hour = parseInt(h.horaInicio.split(':')[0], 10)
    return hour < 12
  })

  const afternoonHorarios = horarios.filter((h) => {
    const hour = parseInt(h.horaInicio.split(':')[0], 10)
    return hour >= 12
  })

  const initialCal = useMemo(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  }, [])

  const [calYear, setCalYear] = useState(initialCal.year)
  const [calMonth, setCalMonth] = useState(initialCal.month)
  const [selectedYmd, setSelectedYmd] = useState<{ y: number; m: number; d: number }>(() => {
    const d = new Date()
    return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() }
  })

  const service = services.find((s) => s.id === serviceId)
  const barber = barbers.find((b) => b.id === barberId)
  const horario = horarios.find((h) => h.id === horarioId)

  const grid = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth])

  const summaryDate = useMemo(() => {
    const dt = new Date(selectedYmd.y, selectedYmd.m, selectedYmd.d)
    const wd = WEEKDAYS[dt.getDay()]
    const mon = MONTHS_SHORT[selectedYmd.m]
    return `${wd} ${selectedYmd.d} ${mon}`
  }, [selectedYmd])

  const summaryLine = service && barber && horario
    ? `${service.nombre} con ${barber.nombre} ${barber.apellido} el ${summaryDate}, ${formatSlotLabel(horario.horaInicio)}`
    : ''

  const isComplete = !!serviceId && !!barberId && !!horarioId

  function shiftMonth(delta: number) {
    const d = new Date(calYear, calMonth + delta, 1)
    setCalYear(d.getFullYear())
    setCalMonth(d.getMonth())
  }

  function onPickDay(cell: CalendarCell) {
    if (cell.inMonth === 'prev') {
      const prevM = calMonth - 1
      const prevY = prevM < 0 ? calYear - 1 : calYear
      const m = prevM < 0 ? 11 : prevM
      setCalYear(prevY)
      setCalMonth(m)
      setSelectedYmd({ y: prevY, m, d: cell.day })
      return
    }
    if (cell.inMonth === 'next') {
      const nextM = calMonth + 1
      const nextY = nextM > 11 ? calYear + 1 : calYear
      const m = nextM > 11 ? 0 : nextM
      setCalYear(nextY)
      setCalMonth(m)
      setSelectedYmd({ y: nextY, m, d: cell.day })
      return
    }
    setSelectedYmd({ y: calYear, m: calMonth, d: cell.day })
  }

  function isSelectedCell(cell: CalendarCell): boolean {
    if (cell.inMonth !== 'current') return false
    return selectedYmd.y === calYear && selectedYmd.m === calMonth && selectedYmd.d === cell.day
  }

  return (
    <div className="bg-white pb-8 text-neutral-800 sm:pb-10">
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8 md:px-6 md:py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            Reservar Turno
          </h1>
          <p className="mt-2 text-neutral-500">
            Personaliza tu experiencia y asegura tu lugar en segundos.
          </p>

          <div className="mt-8 rounded-2xl border border-neutral-100 bg-neutral-50/80 px-4 py-4 md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1d6bff] text-sm font-semibold text-white">
                  1
                </span>
                <span className="font-semibold text-neutral-900">Selección de Servicio</span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Paso 1 de 3
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-200">
              <div className="h-full w-1/3 rounded-full bg-[#1d6bff]" />
            </div>
          </div>
        </div>

        {/* Servicios */}
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-neutral-900">1. Elige un Servicio</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const sel = s.id === serviceId
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(s.id)}
                  className={`group relative overflow-hidden rounded-2xl border bg-white text-left shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] ${sel ? 'border-[#1d6bff] ring-1 ring-[#1d6bff]' : 'border-neutral-100'}`}
                >
                  {sel && (
                    <span className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#1d6bff] text-white shadow-md">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  )}
                  {s.imagen && (
                    <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                      <img
                        src={s.imagen}
                        alt={s.descripcion}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-semibold text-neutral-900">{s.descripcion}</p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {s.duracionAproximada} min • ${formatPriceARS(s.precio)}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Barberos */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">2. Elige un Barbero</h2>
          <div className="flex flex-wrap gap-6 md:gap-8">
            {barbers.map((b) => {
              const sel = b.id === barberId
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBarberId(b.id)}
                  className="flex w-[100px] flex-col items-center text-center"
                >
                  <span className="relative">
                    <span className={`flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 ring-4 transition text-2xl font-bold text-neutral-500 ${sel ? 'ring-[#1d6bff]' : 'ring-transparent'}`}>
                      {b.nombre.charAt(0)}{b.apellido.charAt(0)}
                    </span>
                  </span>
                  <span className="mt-3 font-semibold text-neutral-900">{b.nombre}</span>
                  <span className="mt-0.5 text-[10px] font-medium uppercase text-neutral-500">
                    {b.rol}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2 lg:grid-rows-1">
          {/* Calendario */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">3. Fecha</h2>
            <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-base font-semibold capitalize text-neutral-900">
                  {MONTHS_LONG[calMonth]} {calYear}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => shiftMonth(-1)}
                    className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                    aria-label="Mes anterior"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => shiftMonth(1)}
                    className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                    aria-label="Mes siguiente"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-400">
                {WEEKDAYS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {grid.map((cell, i) => {
                  const muted = cell.inMonth !== 'current'
                  const selected = isSelectedCell(cell)
                  return (
                    <button
                      key={`${cell.inMonth}-${cell.day}-${i}`}
                      type="button"
                      onClick={() => onPickDay(cell)}
                      className={`flex h-10 items-center justify-center rounded-full text-sm font-medium transition ${muted ? 'text-neutral-300' : 'text-neutral-800 hover:bg-neutral-100'} ${selected ? 'bg-[#1d6bff] text-white hover:bg-[#155eea]' : ''}`}
                    >
                      {cell.day}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Horarios */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">4. Horario</h2>
            <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:p-6">
              {morningHorarios.length > 0 && (
                <>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Mañana
                  </p>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {morningHorarios.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setHorarioId(h.id)}
                        className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${horarioId === h.id
                          ? 'border-[#1d6bff] bg-[#e8f1ff] text-[#1d6bff]'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                          }`}
                      >
                        {formatSlotLabel(h.horaInicio)}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {afternoonHorarios.length > 0 && (
                <>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Tarde
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {afternoonHorarios.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setHorarioId(h.id)}
                        className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${horarioId === h.id
                          ? 'border-[#1d6bff] bg-[#e8f1ff] text-[#1d6bff]'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                          }`}
                      >
                        {formatSlotLabel(h.horaInicio)}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {horarios.length === 0 && (
                <p className="text-sm text-neutral-400">Cargando horarios...</p>
              )}
            </div>
          </section>
        </div>

        {/* Resumen */}
        <div
          className={`mt-12 rounded-2xl border bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 md:flex md:items-center md:justify-between md:gap-6 md:p-6 ${isComplete
              ? 'border-neutral-100 opacity-100'
              : 'border-neutral-100 opacity-40 pointer-events-none select-none'
            }`}
        >
          <div className="flex flex-1 gap-4">
            <span className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#1d6bff] md:h-14 md:w-14">
              <CalendarSummaryIcon className="h-7 w-7 md:h-8 md:w-8" />
            </span>
            <div>
              <p className="font-bold text-neutral-900">Resumen de tu Turno</p>
              <p className="mt-1 text-sm text-neutral-500 md:text-base">{summaryLine}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center md:mt-0 md:shrink-0">
            <div className="text-right sm:mr-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Total a pagar
              </p>
              <p className="text-2xl font-bold text-[#1d6bff] md:text-3xl">
                {service ? `$${formatPriceARS(service.precio)}` : '-'}
              </p>
            </div>
            <button
              type="button"
              disabled={!isComplete}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-md transition ${isComplete
                  ? 'bg-[#1d6bff] hover:bg-[#155eea] cursor-pointer'
                  : 'bg-neutral-300 cursor-not-allowed'
                }`}
            >
              Confirmar Turno
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
