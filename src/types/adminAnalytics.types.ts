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
