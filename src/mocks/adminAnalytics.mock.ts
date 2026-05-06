export type AnalyticsPeriod = 'week' | 'month' | 'quarter'

export type KpiMetric = {
  id: string
  label: string
  value: number
  variation: number
  format: 'currency' | 'number' | 'percent'
}

export type RevenuePoint = {
  label: string
  value: number
}

export type BarberPerformance = {
  barberId: number
  barberName: string
  cuts: number
  revenue: number
  avgTicket: number
  occupancy: number
  cancellationRate: number
}

export type PaymentMethodStat = {
  paymentTypeId: number
  label: string
  amount: number
  percentage: number
}

export type ServiceStat = {
  serviceId: number
  serviceName: string
  cuts: number
  revenue: number
}

export type AdminAnalyticsData = {
  period: AnalyticsPeriod
  generatedAt: string
  kpis: KpiMetric[]
  revenueHistory: RevenuePoint[]
  barberPerformance: BarberPerformance[]
  paymentMethods: PaymentMethodStat[]
  serviceStats: ServiceStat[]
}

const WEEK_DATA: AdminAnalyticsData = {
  period: 'week',
  generatedAt: new Date().toISOString(),
  kpis: [
    { id: 'income', label: 'Ingresos Totales', value: 896000, variation: 12.3, format: 'currency' },
    { id: 'cuts', label: 'Cortes Realizados', value: 312, variation: 8.1, format: 'number' },
    { id: 'avgTicket', label: 'Ticket Promedio', value: 2872, variation: 3.4, format: 'currency' },
    { id: 'occupancy', label: 'Ocupación', value: 84, variation: 2.7, format: 'percent' },
  ],
  revenueHistory: [
    { label: 'Lun', value: 116000 },
    { label: 'Mar', value: 123500 },
    { label: 'Mié', value: 129000 },
    { label: 'Jue', value: 132500 },
    { label: 'Vie', value: 142000 },
    { label: 'Sáb', value: 156000 },
    { label: 'Dom', value: 97000 },
  ],
  barberPerformance: [
    { barberId: 1, barberName: 'Marco Polo', cuts: 102, revenue: 307000, avgTicket: 3010, occupancy: 91, cancellationRate: 4.1 },
    { barberId: 2, barberName: 'Julián Ortega', cuts: 88, revenue: 241000, avgTicket: 2738, occupancy: 82, cancellationRate: 5.7 },
    { barberId: 3, barberName: 'Franco Ruiz', cuts: 74, revenue: 196000, avgTicket: 2648, occupancy: 78, cancellationRate: 6.3 },
    { barberId: 4, barberName: 'Tomás Vera', cuts: 48, revenue: 152000, avgTicket: 3166, occupancy: 67, cancellationRate: 3.8 },
  ],
  paymentMethods: [
    { paymentTypeId: 1, label: 'Mercado Pago', amount: 412000, percentage: 46 },
    { paymentTypeId: 2, label: 'Efectivo', amount: 296000, percentage: 33 },
    { paymentTypeId: 3, label: 'Transferencia', amount: 188000, percentage: 21 },
  ],
  serviceStats: [
    { serviceId: 1, serviceName: 'Corte Clásico', cuts: 132, revenue: 316800 },
    { serviceId: 2, serviceName: 'Corte + Barba', cuts: 89, revenue: 302600 },
    { serviceId: 3, serviceName: 'Arreglo de Barba', cuts: 61, revenue: 134200 },
    { serviceId: 4, serviceName: 'Corte Premium', cuts: 30, revenue: 142400 },
  ],
}

const MONTH_DATA: AdminAnalyticsData = {
  ...WEEK_DATA,
  period: 'month',
  generatedAt: new Date().toISOString(),
  kpis: [
    { id: 'income', label: 'Ingresos Totales', value: 3759000, variation: 9.8, format: 'currency' },
    { id: 'cuts', label: 'Cortes Realizados', value: 1268, variation: 6.2, format: 'number' },
    { id: 'avgTicket', label: 'Ticket Promedio', value: 2964, variation: 2.1, format: 'currency' },
    { id: 'occupancy', label: 'Ocupación', value: 81, variation: 1.4, format: 'percent' },
  ],
  revenueHistory: [
    { label: 'Sem 1', value: 872000 },
    { label: 'Sem 2', value: 906000 },
    { label: 'Sem 3', value: 961000 },
    { label: 'Sem 4', value: 1020000 },
  ],
}

const QUARTER_DATA: AdminAnalyticsData = {
  ...MONTH_DATA,
  period: 'quarter',
  generatedAt: new Date().toISOString(),
  kpis: [
    { id: 'income', label: 'Ingresos Totales', value: 10845000, variation: 14.5, format: 'currency' },
    { id: 'cuts', label: 'Cortes Realizados', value: 3696, variation: 10.3, format: 'number' },
    { id: 'avgTicket', label: 'Ticket Promedio', value: 2933, variation: 2.8, format: 'currency' },
    { id: 'occupancy', label: 'Ocupación', value: 79, variation: -1.2, format: 'percent' },
  ],
  revenueHistory: [
    { label: 'Ene', value: 3389000 },
    { label: 'Feb', value: 3521000 },
    { label: 'Mar', value: 3935000 },
  ],
}

const DATA_BY_PERIOD: Record<AnalyticsPeriod, AdminAnalyticsData> = {
  week: WEEK_DATA,
  month: MONTH_DATA,
  quarter: QUARTER_DATA,
}

export function getMockAdminAnalytics(period: AnalyticsPeriod): AdminAnalyticsData {
  return DATA_BY_PERIOD[period]
}
