import type { AdminAnalyticsData, AnalyticsPeriod } from '../../types/adminAnalytics.types'

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

const ANALYTICS_VACIO = (period: AnalyticsPeriod): AdminAnalyticsData => ({
  period,
  generatedAt: new Date().toISOString(),
  kpis: [],
  revenueHistory: [],
  barberPerformance: [],
  paymentMethods: [],
  serviceStats: [],
})

/** Adapta la respuesta de `GET metricas` al modelo que consume la UI de analíticas. */
export function mapMetricasApiToAdminAnalytics(raw: unknown, period: AnalyticsPeriod): AdminAnalyticsData {
  if (!raw || typeof raw !== 'object') {
    return ANALYTICS_VACIO(period)
  }

  const data = raw as Record<string, unknown>

  const kpis = asArray<Record<string, unknown>>(data.kpis ?? data.metricas ?? data.indicadores)
  const revenueHistory = asArray<Record<string, unknown>>(data.revenueHistory ?? data.ingresos ?? data.evolucionIngresos)
  const barberPerformance = asArray<Record<string, unknown>>(
    data.barberPerformance ?? data.barberos ?? data.rendimientoBarberos,
  )
  const paymentMethods = asArray<Record<string, unknown>>(data.paymentMethods ?? data.mediosPago ?? data.pagos)
  const serviceStats = asArray<Record<string, unknown>>(data.serviceStats ?? data.servicios ?? data.serviciosVendidos)

  return {
    period: (String(data.period ?? period) as AnalyticsPeriod) || period,
    generatedAt: String(data.generatedAt ?? data.generadoEn ?? new Date().toISOString()),
    kpis: kpis.map((kpi, index) => ({
      id: String(kpi.id ?? `kpi-${index}`),
      label: String(kpi.label ?? kpi.nombre ?? 'Indicador'),
      value: asNumber(kpi.value ?? kpi.valor),
      variation: asNumber(kpi.variation ?? kpi.variacion),
      format: (kpi.format as AdminAnalyticsData['kpis'][0]['format']) ?? 'number',
    })),
    revenueHistory: revenueHistory.map((point) => ({
      label: String(point.label ?? point.etiqueta ?? ''),
      value: asNumber(point.value ?? point.valor),
    })),
    barberPerformance: barberPerformance.map((row, index) => ({
      barberId: asNumber(row.barberId ?? row.id ?? index + 1),
      barberName: String(row.barberName ?? row.nombre ?? row.barbero ?? 'Barbero'),
      cuts: asNumber(row.cuts ?? row.cortes),
      revenue: asNumber(row.revenue ?? row.ingresos),
      avgTicket: asNumber(row.avgTicket ?? row.ticketPromedio),
      occupancy: asNumber(row.occupancy ?? row.ocupacion),
      cancellationRate: asNumber(row.cancellationRate ?? row.tasaCancelacion),
    })),
    paymentMethods: paymentMethods.map((method, index) => ({
      paymentTypeId: asNumber(method.paymentTypeId ?? method.id ?? index + 1),
      label: String(method.label ?? method.nombre ?? 'Pago'),
      amount: asNumber(method.amount ?? method.monto),
      percentage: asNumber(method.percentage ?? method.porcentaje),
    })),
    serviceStats: serviceStats.map((service, index) => ({
      serviceId: asNumber(service.serviceId ?? service.id ?? index + 1),
      serviceName: String(service.serviceName ?? service.nombre ?? 'Servicio'),
      cuts: asNumber(service.cuts ?? service.cortes),
      revenue: asNumber(service.revenue ?? service.ingresos),
    })),
  }
}
