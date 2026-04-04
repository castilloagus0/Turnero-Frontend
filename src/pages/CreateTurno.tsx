import { useMemo, useState } from 'react'

type Service = {
  id: string
  name: string
  durationMin: number
  price: number
  image: string
}

type Barber = {
  id: string
  name: string
  role: string
  image?: string
  available?: boolean
  isAny?: boolean
}

const SERVICES: Service[] = [
  {
    id: 'corte',
    name: 'Corte de Pelo',
    durationMin: 45,
    price: 2500,
    image:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=640&q=80',
  },
  {
    id: 'barba',
    name: 'Barba Clásica',
    durationMin: 30,
    price: 1800,
    image:
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=640&q=80',
  },
  {
    id: 'combo',
    name: 'Combo Imperial',
    durationMin: 75,
    price: 4000,
    image:
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=640&q=80',
  },
]

const BARBERS: Barber[] = [
  {
    id: 'marcos',
    name: 'Marcos',
    role: 'MASTER BARBER',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&q=80',
    available: true,
  },
  {
    id: 'julian',
    name: 'Julian',
    role: 'SENIOR STYLIST',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&q=80',
  },
  {
    id: 'enzo',
    name: 'Enzo',
    role: 'FADING EXPERT',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&q=80',
  },
  {
    id: 'cualquiera',
    name: 'Cualquiera',
    role: 'MAYOR DISPONIBILIDAD',
    isAny: true,
  },
]

const WEEKDAYS = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'] as const

const MONTHS_SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
] as const

const MONTHS_LONG = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const

const MORNING_SLOTS = ['09:00', '10:00', '11:00']
const AFTERNOON_SLOTS = ['14:00', '15:30', '17:00', '18:30', '19:30']

function formatSlotLabel(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const hour12 = h % 12 === 0 ? 12 : h % 12
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${hour12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`
}

function formatPriceARS(n: number): string {
  return n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
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

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
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
  const [serviceId, setServiceId] = useState(SERVICES[0].id)
  const [barberId, setBarberId] = useState('enzo')

  const initialCal = useMemo(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  }, [])

  const [calYear, setCalYear] = useState(initialCal.year)
  const [calMonth, setCalMonth] = useState(initialCal.month)
  const [selectedYmd, setSelectedYmd] = useState<{
    y: number
    m: number
    d: number
  }>(() => {
    const d = new Date()
    return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() }
  })

  const [timeSlot, setTimeSlot] = useState('11:00')

  const service = SERVICES.find((s) => s.id === serviceId) ?? SERVICES[0]
  const barber = BARBERS.find((b) => b.id === barberId) ?? BARBERS[0]

  const grid = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth])

  const summaryDate = useMemo(() => {
    const dt = new Date(selectedYmd.y, selectedYmd.m, selectedYmd.d)
    const wd = WEEKDAYS[dt.getDay()]
    const mon = MONTHS_SHORT[selectedYmd.m]
    return `${wd} ${selectedYmd.d} ${mon}`
  }, [selectedYmd])

  const summaryLine = `${service.name} con ${barber.name} el ${summaryDate}, ${formatSlotLabel(timeSlot)}`

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
    return (
      selectedYmd.y === calYear && selectedYmd.m === calMonth && selectedYmd.d === cell.day
    )
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

        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-neutral-900">1. Elige un Servicio</h2>
            <button type="button" className="text-sm font-medium text-[#1d6bff] hover:underline">
              Ver detalles
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => {
              const sel = s.id === serviceId
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(s.id)}
                  className={`group relative overflow-hidden rounded-2xl border bg-white text-left shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] ${
                    sel ? 'border-[#1d6bff] ring-1 ring-[#1d6bff]' : 'border-neutral-100'
                  }`}
                >
                  {sel && (
                    <span className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#1d6bff] text-white shadow-md">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  )}
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img
                      src={s.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-neutral-900">{s.name}</p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {s.durationMin} min • ${formatPriceARS(s.price)}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">2. Elige un Barbero</h2>
          <div className="flex flex-wrap gap-6 md:gap-8">
            {BARBERS.map((b) => {
              const sel = b.id === barberId
              if (b.isAny) {
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBarberId(b.id)}
                    className={`flex w-[140px] flex-col items-center rounded-2xl border-2 px-3 pb-4 pt-5 transition ${
                      sel
                        ? 'border-[#1d6bff] bg-[#e8f1ff]'
                        : 'border-transparent bg-[#f0f6ff] hover:border-[#1d6bff]/40'
                    }`}
                  >
                    <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#1d6bff] shadow-inner">
                      <UsersIcon className="h-8 w-8" />
                    </span>
                    <span className="font-semibold text-neutral-900">{b.name}</span>
                    <span className="mt-1 text-center text-[10px] font-medium uppercase leading-tight text-neutral-500">
                      {b.role}
                    </span>
                  </button>
                )
              }
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBarberId(b.id)}
                  className="flex w-[100px] flex-col items-center text-center"
                >
                  <span className="relative">
                    <img
                      src={b.image}
                      alt=""
                      className={`h-20 w-20 rounded-full object-cover ring-4 transition ${
                        sel ? 'ring-[#1d6bff]' : 'ring-transparent'
                      }`}
                    />
                    {b.available ? (
                      <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                    ) : null}
                  </span>
                  <span className="mt-3 font-semibold text-neutral-900">{b.name}</span>
                  <span className="mt-0.5 text-[10px] font-medium uppercase text-neutral-500">
                    {b.role}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2 lg:grid-rows-1">
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
                      className={`flex h-10 items-center justify-center rounded-full text-sm font-medium transition ${
                        muted ? 'text-neutral-300' : 'text-neutral-800 hover:bg-neutral-100'
                      } ${
                        selected
                          ? 'bg-[#1d6bff] text-white hover:bg-[#155eea]'
                          : ''
                      }`}
                    >
                      {cell.day}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">4. Horario</h2>
            <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:p-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                Mañana
              </p>
              <div className="mb-6 flex flex-wrap gap-2">
                {MORNING_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeSlot(t)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                      timeSlot === t
                        ? 'border-[#1d6bff] bg-[#e8f1ff] text-[#1d6bff]'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    {formatSlotLabel(t)}
                  </button>
                ))}
              </div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                Tarde
              </p>
              <div className="flex flex-wrap gap-2">
                {AFTERNOON_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeSlot(t)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                      timeSlot === t
                        ? 'border-[#1d6bff] bg-[#e8f1ff] text-[#1d6bff]'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    {formatSlotLabel(t)}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 rounded-2xl border border-neutral-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:flex md:items-center md:justify-between md:gap-6 md:p-6">
          <div className="flex flex-1 gap-4">
            <span className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#1d6bff] md:h-14 md:w-14">
              <CalendarSummaryIcon className="h-7 w-7 md:h-8 md:w-8" />
            </span>
            <div>
              <p className="font-bold text-neutral-900">Resumen de tu Cita</p>
              <p className="mt-1 text-sm text-neutral-500 md:text-base">{summaryLine}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center md:mt-0 md:shrink-0">
            <div className="text-right sm:mr-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Total a pagar
              </p>
              <p className="text-2xl font-bold text-[#1d6bff] md:text-3xl">
                ${formatPriceARS(service.price)}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1d6bff] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#155eea]"
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
