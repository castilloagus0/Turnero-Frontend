import { useMemo, useState, useEffect } from 'react'
import { getAdminAnalytics } from '../service/adminAnalytics.service'
import type { AdminAnalyticsData, AnalyticsPeriod, BarberPerformance, PaymentMethodStat, RevenuePoint, ServiceStat } from '../mocks/adminAnalytics.mock'

const PRIMARY = '#2563EB'

type AsyncState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: AdminAnalyticsData }

const PERIOD_LABEL: Record<AnalyticsPeriod, string> = {
  week: 'Semana',
  month: 'Mes',
  quarter: 'Trimestre',
}

const PAYMENT_COLORS = ['#2563EB', '#14B8A6', '#F59E0B', '#8B5CF6']

function formatValue(value: number, format: 'currency' | 'number' | 'percent'): string {
  if (format === 'currency') {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(value)
  }
  if (format === 'percent') {
    return `${value.toFixed(0)}%`
  }
  return new Intl.NumberFormat('es-AR').format(value)
}

function buildLinePath(points: RevenuePoint[], width: number, height: number): string {
  if (!points.length) return ''
  const maxValue = Math.max(...points.map((point) => point.value), 1)
  const stepX = points.length > 1 ? width / (points.length - 1) : 0

  return points
    .map((point, index) => {
      const x = index * stepX
      const y = height - (point.value / maxValue) * height
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

function PaymentDonut({ items, activeIndex }: { items: PaymentMethodStat[]; activeIndex: number }) {
  const background = useMemo(() => {
    let accumulator = 0
    const slices = items.map((item, index) => {
      const start = accumulator
      accumulator += item.percentage
      const color = PAYMENT_COLORS[index % PAYMENT_COLORS.length]
      return `${color} ${start}% ${accumulator}%`
    })
    return `conic-gradient(${slices.join(', ')})`
  }, [items])

  return (
    <div className="relative mx-auto h-48 w-48">
      <div
        className="h-full w-full rounded-full shadow-inner"
        style={{
          background,
        }}
      />
      <div className="absolute inset-7 rounded-full bg-white" />
      <div className="absolute inset-0 grid place-content-center text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Top Método</p>
        <p className="text-sm font-bold text-neutral-900">{items[activeIndex]?.label ?? '-'}</p>
        <p className="text-xs text-neutral-500">{items[activeIndex]?.percentage ?? 0}% del total</p>
      </div>
    </div>
  )
}

function LineChart({
  points,
  activePoint,
  onHoverPoint,
}: {
  points: RevenuePoint[]
  activePoint: number
  onHoverPoint: (index: number) => void
}) {
  const chartWidth = 560
  const chartHeight = 220
  const maxValue = Math.max(...points.map((point) => point.value), 1)
  const stepX = points.length > 1 ? chartWidth / (points.length - 1) : 0
  const path = buildLinePath(points, chartWidth, chartHeight)

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 35}`} className="min-w-[560px] w-full" role="img" aria-label="Tendencia de ingresos">
        {Array.from({ length: 5 }).map((_, idx) => {
          const y = (chartHeight / 4) * idx
          return (
            <line
              key={`grid-${idx}`}
              x1="0"
              y1={y}
              x2={chartWidth}
              y2={y}
              stroke="#E5E7EB"
              strokeDasharray="4 5"
            />
          )
        })}
        <path d={path} fill="none" stroke={PRIMARY} strokeWidth="3" strokeLinecap="round" />
        {points.map((point, index) => {
          const cx = index * stepX
          const cy = chartHeight - (point.value / maxValue) * chartHeight
          const active = activePoint === index
          return (
            <g key={point.label}>
              <circle
                cx={cx}
                cy={cy}
                r={active ? 8 : 5}
                fill={active ? '#1D4ED8' : '#93C5FD'}
                stroke="#fff"
                strokeWidth="2"
                className="cursor-pointer transition-all"
                onMouseEnter={() => onHoverPoint(index)}
              />
              <text x={cx} y={chartHeight + 24} textAnchor="middle" className="fill-neutral-500 text-[11px]">
                {point.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function AdminAnalytics() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('week')
  const [state, setState] = useState<AsyncState>({ status: 'loading' })
  const [activeRevenuePoint, setActiveRevenuePoint] = useState(0)
  const [activePaymentMethod, setActivePaymentMethod] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    getAdminAnalytics(period)
      .then((data) => {
        if (cancelled) return
        setState({ status: 'success', data })
        setActiveRevenuePoint(data.revenueHistory.length > 0 ? data.revenueHistory.length - 1 : 0)
        setActivePaymentMethod(0)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        const message = error instanceof Error ? error.message : 'No se pudo cargar la información de analíticas.'
        setState({ status: 'error', message })
      })

    return () => {
      cancelled = true
    }
  }, [period])

  const topBarber: BarberPerformance | null = useMemo(() => {
    if (state.status !== 'success' || state.data.barberPerformance.length === 0) return null
    return [...state.data.barberPerformance].sort((a, b) => b.revenue - a.revenue)[0]
  }, [state])

  if (state.status === 'loading') {
    return (
      <section className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-neutral-500">Cargando analíticas del negocio...</p>
        </div>
      </section>
    )
  }

  if (state.status === 'error') {
    return (
      <section className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
          <h1 className="text-lg font-bold text-red-800">Error al cargar analíticas</h1>
          <p className="mt-2 text-sm text-red-700">{state.message}</p>
        </div>
      </section>
    )
  }

  const data = state.data
  const activeRevenue = data.revenueHistory[activeRevenuePoint]

  return (
    <section className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Analíticas del Negocio</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Vista detallada de rendimiento por barbero, ingresos, volumen de cortes y medios de pago.
            </p>
          </div>
          <div className="inline-flex rounded-xl bg-neutral-100 p-1">
            {(Object.keys(PERIOD_LABEL) as AnalyticsPeriod[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPeriod(option)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  period === option ? 'bg-white text-[#2563EB] shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {PERIOD_LABEL[option]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => {
          const isPositive = kpi.variation >= 0
          return (
            <article key={kpi.id} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-neutral-500">{kpi.label}</p>
              <p className="mt-2 text-2xl font-bold text-neutral-900">{formatValue(kpi.value, kpi.format)}</p>
              <p className={`mt-2 text-sm font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}
                {kpi.variation.toFixed(1)}% vs período anterior
              </p>
            </article>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <article className="xl:col-span-3 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-neutral-900">Evolución de ingresos</h2>
            <div className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-[#2563EB]">
              {activeRevenue ? `${activeRevenue.label}: ${formatValue(activeRevenue.value, 'currency')}` : '-'}
            </div>
          </div>
          <div className="mt-4">
            <LineChart points={data.revenueHistory} activePoint={activeRevenuePoint} onHoverPoint={setActiveRevenuePoint} />
          </div>
        </article>

        <article className="xl:col-span-2 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900">Medios de pago más usados</h2>
          <p className="mt-1 text-sm text-neutral-500">Distribución por monto cobrado en el período seleccionado.</p>
          <div className="mt-4">
            <PaymentDonut items={data.paymentMethods} activeIndex={activePaymentMethod} />
          </div>
          <ul className="mt-4 space-y-2">
            {data.paymentMethods.map((method, index) => (
              <li key={method.paymentTypeId}>
                <button
                  type="button"
                  onClick={() => setActivePaymentMethod(index)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                    activePaymentMethod === index
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: PAYMENT_COLORS[index % PAYMENT_COLORS.length] }}
                    />
                    <span className="font-medium text-neutral-700">{method.label}</span>
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {method.percentage}% - {formatValue(method.amount, 'currency')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <article className="xl:col-span-2 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-neutral-900">Rendimiento por barbero</h2>
            {topBarber ? (
              <p className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                Top ingreso: {topBarber.barberName}
              </p>
            ) : null}
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] uppercase tracking-wide text-neutral-400">
                  <th className="px-2 py-3">Barbero</th>
                  <th className="px-2 py-3 text-right">Cortes</th>
                  <th className="px-2 py-3 text-right">Ingresos</th>
                  <th className="px-2 py-3 text-right">Ticket promedio</th>
                  <th className="px-2 py-3 text-right">Ocupación</th>
                  <th className="px-2 py-3 text-right">Cancelaciones</th>
                </tr>
              </thead>
              <tbody>
                {data.barberPerformance.map((row) => (
                  <tr key={row.barberId} className="border-b border-neutral-50 last:border-0">
                    <td className="px-2 py-3 font-semibold text-neutral-900">{row.barberName}</td>
                    <td className="px-2 py-3 text-right text-neutral-700">{formatValue(row.cuts, 'number')}</td>
                    <td className="px-2 py-3 text-right font-semibold text-neutral-900">{formatValue(row.revenue, 'currency')}</td>
                    <td className="px-2 py-3 text-right text-neutral-700">{formatValue(row.avgTicket, 'currency')}</td>
                    <td className="px-2 py-3 text-right text-neutral-700">{formatValue(row.occupancy, 'percent')}</td>
                    <td className="px-2 py-3 text-right text-neutral-700">{row.cancellationRate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900">Servicios más vendidos</h2>
          <p className="mt-1 text-sm text-neutral-500">Cantidad de cortes y facturación por servicio.</p>
          <div className="mt-4 space-y-3">
            {data.serviceStats.map((service: ServiceStat) => {
              const maxCuts = Math.max(...data.serviceStats.map((item) => item.cuts), 1)
              const ratio = (service.cuts / maxCuts) * 100
              return (
                <div key={service.serviceId} className="rounded-xl border border-neutral-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-neutral-800">{service.serviceName}</p>
                    <p className="text-sm font-bold text-neutral-900">{service.cuts} cortes</p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${ratio}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">Facturación: {formatValue(service.revenue, 'currency')}</p>
                </div>
              )
            })}
          </div>
        </article>
      </div>
    </section>
  )
}
