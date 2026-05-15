import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Services
import { getServicios } from '../service/servicios.service'
import { getBarberos } from '../service/barbero.service'
import { getHorarios } from '../service/horarios.service'
import { getTipoPagos } from '../service/tipoPagos.service'
import { createOrder } from '../service/pago.service'
import { createTurno } from '../service/turno.service'

// Interfaces
import { Horarios } from '../interface/horarios.interface'
import { Barbero } from '../interface/barbero.interface'
import { Servicios } from '../interface/servicios.interface'
import { tipoPagos } from '../interface/tipoPagos.interface'

// Assets
import mercadoPagoIcon from '../assets/mercadoPago.webp'

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

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function isSameCalendarDay(ymd: { y: number; m: number; d: number }, date: Date): boolean {
  return ymd.y === date.getFullYear() && ymd.m === date.getMonth() && ymd.d === date.getDate()
}

/** True si el día elegido es "hoy" y el inicio del turno ya ocurrió (hora local). */
function isHorarioInPastForSelectedDate(
  ymd: { y: number; m: number; d: number },
  horaInicio: string,
  at: Date,
): boolean {
  if (!isSameCalendarDay(ymd, at)) return false
  const [hh, mm] = horaInicio.split(':').map((x) => Number(x))
  const start = new Date(ymd.y, ymd.m, ymd.d, hh, mm ?? 0, 0, 0)
  return start.getTime() < at.getTime()
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

const STEPS = [
  { label: 'Servicio',      description: 'Elegí tu corte'         },
  { label: 'Barbero',       description: 'Quién te atiende'        },
  { label: 'Fecha y hora',  description: 'Cuándo venís'            },
  { label: 'Pago',          description: 'Cómo abonás'             },
] as const

function StepperBar({
  serviceId, barberId, horarioId, paymentId,
}: { serviceId: string; barberId: string; horarioId: string; paymentId: string }) {
  const completed = [
    !!serviceId,
    !!serviceId && !!barberId,
    !!serviceId && !!barberId && !!horarioId,
    !!serviceId && !!barberId && !!horarioId && !!paymentId,
  ]
  const currentStep = completed.filter(Boolean).length

  return (
      <div className="mt-6 -mx-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
      <div className="flex min-w-[min(100%,20rem)] items-start sm:min-w-0">
        {STEPS.map((step, i) => {
          const done = completed[i]
          const active = i === currentStep
          const isLast = i === STEPS.length - 1
          return (
            <div key={step.label} className="flex min-w-0 flex-1 items-start">
              {/* Circle + text */}
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors sm:h-9 sm:w-9 ${
                    done
                      ? 'bg-[#1d6bff] text-white'
                      : active
                      ? 'border-2 border-[#1d6bff] bg-white text-[#1d6bff]'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {done ? <CheckIcon className="h-4 w-4" /> : i + 1}
                </span>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-semibold leading-tight ${
                    done || active ? 'text-neutral-900' : 'text-neutral-400'
                  }`}>
                    {step.label}
                  </p>
                  <p className={`mt-0.5 hidden text-[11px] leading-tight sm:block ${
                    done || active ? 'text-neutral-500' : 'text-neutral-300'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
              {/* Connector line */}
              {!isLast && (
                <div className="mx-1 mt-4 h-0.5 min-w-[0.5rem] flex-1 rounded-full transition-colors sm:mx-2" style={{
                  backgroundColor: done ? '#1d6bff' : '#e5e7eb',
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CreateTurno() {
  const navigate = useNavigate()
  const [services, setServices] = useState<Servicios[]>([])
  const [barbers, setBarbers] = useState<Barbero[]>([])
  const [horarios, setHorarios] = useState<Horarios[]>([])
  const [tipoPagos, setTipoPagos] = useState<tipoPagos[]>([])


  const [serviceId, setServiceId] = useState<string>('')
  const [barberId, setBarberId] = useState<string>('')
  const [horarioId, setHorarioId] = useState<string>('')
  const [paymentId, setPaymentId] = useState<string>('')
  const [confirmandoTurno, setConfirmandoTurno] = useState(false)
  const [modalExitoReserva, setModalExitoReserva] = useState<{ open: boolean; mensaje: string }>({
    open: false,
    mensaje: '',
  })

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
        if (data.length > 0) setBarberId(String(data[0].id))
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

  useEffect(() => {
    getTipoPagos()
      .then((data: tipoPagos[]) => {
        setTipoPagos(data)
      })
      .catch(() => { })
  }, [])

  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
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

  const todayStart = useMemo(() => startOfDay(new Date()), [])
  const minYear = todayStart.getFullYear()
  const minMonth = todayStart.getMonth()

  const [calYear, setCalYear] = useState(initialCal.year)
  const [calMonth, setCalMonth] = useState(initialCal.month)
  const [selectedYmd, setSelectedYmd] = useState<{ y: number; m: number; d: number }>(() => {
    const d = new Date()
    return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() }
  })

  const service = services.find((s) => String(s.id) === serviceId)
  const barber = barbers.find((b) => String(b.id) === barberId)
  const horario = horarios.find((h) => String(h.id) === horarioId)

  useEffect(() => {
    if (!horarioId) return
    const h = horarios.find((x) => String(x.id) === horarioId)
    if (h && isHorarioInPastForSelectedDate(selectedYmd, h.horaInicio, now)) {
      setHorarioId('')
    }
  }, [selectedYmd, horarioId, horarios, now])

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

  const selectedHorarioPast = horario
    ? isHorarioInPastForSelectedDate(selectedYmd, horario.horaInicio, now)
    : false
  const isComplete = !!serviceId && !!barberId && !!horarioId && !selectedHorarioPast && !!paymentId

  function onPickHorario(h: Horarios) {
    if (isHorarioInPastForSelectedDate(selectedYmd, h.horaInicio, now)) return
    setHorarioId(String(h.id))
  }

  function horarioSlotClassName(h: Horarios): string {
    const base =
      'touch-manipulation min-h-11 rounded-xl border px-4 py-2.5 text-sm font-medium transition sm:min-h-0'
    const unavailable = isHorarioInPastForSelectedDate(selectedYmd, h.horaInicio, now)
    if (unavailable) {
      return `${base} border-neutral-200 text-neutral-400 bg-neutral-100/90 cursor-not-allowed`
    }
    if (horarioId === String(h.id)) {
      return `${base} border-[#1d6bff] bg-[#e8f1ff] text-[#1d6bff]`
    }
    return `${base} border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300`
  }

  // Detect which payment option is Mercado Pago by name (case-insensitive)
  const isMercadoPago = (nombre: string) =>
    nombre.toLowerCase().includes('mercado')

  const selectedPayment = tipoPagos.find((p) => p.id === paymentId)

  const canGoPrevMonth = !(calYear === minYear && calMonth === minMonth)

  function shiftMonth(delta: number) {
    const d = new Date(calYear, calMonth + delta, 1)
    const ny = d.getFullYear()
    const nm = d.getMonth()
    const isBeforeMin = ny < minYear || (ny === minYear && nm < minMonth)
    if (isBeforeMin) {
      setCalYear(minYear)
      setCalMonth(minMonth)
      return
    }
    setCalYear(ny)
    setCalMonth(nm)
  }

  function dateForCell(cell: CalendarCell): Date {
    if (cell.inMonth === 'current') return new Date(calYear, calMonth, cell.day)
    if (cell.inMonth === 'prev') {
      const prevM = calMonth - 1
      const prevY = prevM < 0 ? calYear - 1 : calYear
      const m = prevM < 0 ? 11 : prevM
      return new Date(prevY, m, cell.day)
    }
    const nextM = calMonth + 1
    const nextY = nextM > 11 ? calYear + 1 : calYear
    const m = nextM > 11 ? 0 : nextM
    return new Date(nextY, m, cell.day)
  }

  function isUnavailableCell(cell: CalendarCell): boolean {
    const dt = startOfDay(dateForCell(cell))
    return dt < todayStart
  }

  function onPickDay(cell: CalendarCell) {
    if (isUnavailableCell(cell)) return
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

  async function crearTurnoPagoLocalYDevolverMensaje(
    fecha: string,
    horarioIdNum: number,
    usuarioId: number,
    servicioId: number,
    tipoPagoId: number,
    barberoId: number,
  ): Promise<string> {
    const createTurnoResponse = await createTurno(fecha, horarioIdNum, usuarioId, servicioId, tipoPagoId, barberoId, 'null')
    const msg = createTurnoResponse?.message
    if (typeof msg === 'string' && msg.trim().length > 0) return msg
    return 'Tu turno fue registrado correctamente.'
  }

  async function handleConfirmarTurno() {
    const userId = localStorage.getItem('userId') ?? ''
    if (!userId) {
      console.error('No se encontró el userId en localStorage')
      return
    }
    const metodoPago = tipoPagos.find((p) => p.id === paymentId)
    if (!metodoPago) {
      console.error('No hay método de pago seleccionado')
      return
    }

    /** Misma lógica que en la grilla de medios de pago: no usar id fijo (p. ej. 1), el backend puede tener otro orden. */
    const esMercadoPagoSeleccionado = isMercadoPago(metodoPago.nombre)

    setConfirmandoTurno(true)
    try {
      const fecha = new Date(selectedYmd.y, selectedYmd.m, selectedYmd.d).toISOString().slice(0, 10)

      if (esMercadoPagoSeleccionado) {
        localStorage.setItem(
          'pendingTurno',
          JSON.stringify({
            fecha,
            horarioId,
            usuarioId: userId,
            servicioId: serviceId.toString(),
            tipoPagoId: paymentId.toString(),
            barberoId: barberId.toString(),
          }),
        )
        const response = await createOrder(userId, serviceId.toString(), '0')
        const initPoint = response?.init_point
        if (typeof initPoint === 'string' && initPoint.length > 0) {
          window.location.href = initPoint
          return
        }
        console.error('Respuesta sin init_point para pago Mercado Pago:', response)
        return
      }

      const inicio = Date.now()
      localStorage.removeItem('pendingTurno')
      const tipoPagoId = Number(paymentId)
      const mensaje = await crearTurnoPagoLocalYDevolverMensaje(
        fecha,
        Number(horarioId),
        Number(userId),
        Number(serviceId),
        tipoPagoId,
        Number(barberId),
      )
      const transcurrido = Date.now() - inicio
      const restante = Math.max(0, 2000 - transcurrido)
      if (restante > 0) {
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, restante)
        })
      }
      setModalExitoReserva({ open: true, mensaje: mensaje })
    } catch (error) {
      console.error('Error al confirmar el turno:', error)
    } finally {
      setConfirmandoTurno(false)
    }
  }

  return (
    <div className="bg-white pb-8 text-neutral-800 sm:pb-10">
      <main className="mx-auto max-w-6xl min-w-0 px-3 py-5 sm:px-4 sm:py-8 md:px-6 md:py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            Reservar Turno
          </h1>
          <p className="mt-2 text-neutral-500">
            Personaliza tu experiencia y asegura tu lugar en segundos.
          </p>

            <StepperBar serviceId={serviceId} barberId={barberId} horarioId={horarioId} paymentId={paymentId} />
        </div>

        {/* Servicios */}
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-neutral-900">1. Elige un Servicio</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const sel = String(s.id) === serviceId
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(String(s.id))}
                  className={`group relative touch-manipulation overflow-hidden rounded-2xl border bg-white text-left shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition active:scale-[0.99] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] ${sel ? 'border-[#1d6bff] ring-1 ring-[#1d6bff]' : 'border-neutral-100'}`}
                >
                  {sel && (
                    <span className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#1d6bff] text-white shadow-md">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  )}
                  {s.imagen && (
                    <div className="aspect-4/3 overflow-hidden bg-neutral-800">
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
          <div className="grid grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:justify-start sm:gap-6 md:gap-8">
            {barbers.map((b) => {
              const sel = String(b.id) === barberId
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBarberId(String(b.id))}
                  className="flex min-w-0 flex-col items-center text-center touch-manipulation"
                >
                  <span className="relative">
                    <span className={`flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-neutral-100 text-xl font-bold text-neutral-500 ring-4 transition sm:h-20 sm:w-20 sm:text-2xl ${sel ? 'ring-[#1d6bff]' : 'ring-transparent'}`}>
                      {b.nombre.charAt(0)}{b.apellido.charAt(0)}
                    </span>
                  </span>
                  <span className="mt-2 line-clamp-2 max-w-full px-0.5 text-sm font-semibold leading-tight text-neutral-900">
                    {b.nombre}
                  </span>
                  <span className="mt-1 line-clamp-1 max-w-full text-[11px] font-medium uppercase tracking-wide text-neutral-500 sm:text-xs">
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
                    disabled={!canGoPrevMonth}
                    className={`touch-manipulation flex min-h-11 min-w-11 items-center justify-center rounded-lg sm:min-h-0 sm:min-w-0 sm:p-2 ${canGoPrevMonth ? 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800' : 'cursor-not-allowed text-neutral-300'}`}
                    aria-label="Mes anterior"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => shiftMonth(1)}
                    className="touch-manipulation flex min-h-11 min-w-11 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 sm:min-h-0 sm:min-w-0 sm:p-2"
                    aria-label="Mes siguiente"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
                <div className="mb-2 grid grid-cols-7 gap-0.5 text-center text-[11px] font-semibold text-neutral-400 sm:gap-1 sm:text-xs">
                {WEEKDAYS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                {grid.map((cell, i) => {
                  const muted = cell.inMonth !== 'current'
                  const selected = isSelectedCell(cell)
                  const unavailable = isUnavailableCell(cell)
                  const dayClass = unavailable
                    ? 'text-neutral-400  cursor-not-allowed pointer-events-none'
                    : selected
                      ? 'bg-[#1d6bff] text-white hover:bg-[#155eea]'
                      : muted
                        ? 'text-neutral-300'
                        : 'text-neutral-800 hover:bg-neutral-100'
                  return (
                    <button
                      key={`${cell.inMonth}-${cell.day}-${i}`}
                      type="button"
                      onClick={() => onPickDay(cell)}
                      disabled={unavailable}
                      className={`flex aspect-square min-h-10 w-full max-w-[2.75rem] items-center justify-center justify-self-center rounded-full text-sm font-medium transition sm:max-w-none ${dayClass}`}
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
                        disabled={isHorarioInPastForSelectedDate(selectedYmd, h.horaInicio, now)}
                        onClick={() => onPickHorario(h)}
                        className={horarioSlotClassName(h)}
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
                        disabled={isHorarioInPastForSelectedDate(selectedYmd, h.horaInicio, now)}
                        onClick={() => onPickHorario(h)}
                        className={horarioSlotClassName(h)}
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

        {/* Método de Pago */}
        <section className="mt-12 mb-4">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">5. Método de Pago</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {tipoPagos.length === 0
              ? (
                <p className="text-sm text-neutral-400">Cargando métodos de pago...</p>
              )
              : tipoPagos.map((p) => {
                const sel = p.id === paymentId
                const esMp = isMercadoPago(p.nombre)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentId(p.id)}
                    className={`group relative flex touch-manipulation items-center gap-4 rounded-2xl border bg-white p-4 text-left shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition active:scale-[0.99] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] sm:p-5 ${sel
                      ? 'border-[#1d6bff] ring-1 ring-[#1d6bff]'
                      : 'border-neutral-100'
                      }`}
                  >
                    {sel && (
                      <span className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#1d6bff] text-white shadow-md">
                        <CheckIcon className="h-4 w-4" />
                      </span>
                    )}

                    {/* Icon */}
                    {esMp ? (
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#009ee3]/10 p-1">
                        <img
                          src={mercadoPagoIcon}
                          alt="Mercado Pago"
                          className="h-full w-full object-contain"
                        />
                      </span>
                    ) : (
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <rect x="2" y="6" width="20" height="13" rx="2" />
                          <path d="M2 10h20" />
                          <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none" />
                        </svg>
                      </span>
                    )}

                    {/* Text */}
                    <div>
                      <p className="font-semibold text-neutral-900">{p.nombre}</p>
                      <p className="mt-0.5 text-sm text-neutral-500">
                        {esMp
                          ? 'Paga online de forma segura'
                          : 'Abonás directamente en el local'}
                      </p>
                    </div>
                  </button>
                )
              })
            }
          </div>
        </section>

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
              {selectedPayment && (
                <p className="mt-1 text-xs font-medium text-neutral-400">
                  Pago: {selectedPayment.nombre}
                </p>
              )}
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
              disabled={!isComplete || confirmandoTurno}
              className={`inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-md transition active:scale-[0.99] sm:w-auto sm:min-w-[12rem] ${isComplete && !confirmandoTurno
                ? 'bg-[#1d6bff] hover:bg-[#155eea] cursor-pointer'
                : 'bg-neutral-300 cursor-not-allowed'
                }`}
              onClick={handleConfirmarTurno}
            >
              {confirmandoTurno ? (
                <>
                  <span
                    className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white border-r-transparent"
                    aria-hidden
                  />
                  <span>Procesando…</span>
                </>
              ) : (
                <>
                  Confirmar Turno
                  <svg className="ml-0.5 h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {modalExitoReserva.open ? (
        <div
          className="fixed inset-0 z-100 flex items-end justify-center bg-black/45 px-0 pb-0 backdrop-blur-[2px] sm:items-center sm:px-4 sm:pb-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exito-reserva-titulo"
        >
          <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-neutral-200/90 bg-white px-6 pt-6 shadow-[0_20px_50px_rgb(0,0,0,0.12)] sm:rounded-2xl sm:px-8 sm:pt-8 sm:pb-8 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f1ff] text-[#1d6bff]">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden>
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 id="exito-reserva-titulo" className="mt-5 text-center text-xl font-bold tracking-tight text-neutral-900">
              ¡Reserva confirmada!
            </h2>
            <p className="mt-3 text-center text-sm leading-relaxed text-neutral-600">{modalExitoReserva.mensaje}</p>
            <button
              type="button"
              className="mt-8 min-h-12 w-full touch-manipulation rounded-xl bg-[#1d6bff] px-5 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#155eea] active:scale-[0.99]"
              onClick={() => {
                setModalExitoReserva({ open: false, mensaje: '' })
                navigate('/user-dashboard')
              }}
            >
              Ir a mi panel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
