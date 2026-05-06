import { getBarberos } from './barbero.service'
import { getServicios } from './servicios.service'
import { getTipoPagos } from './tipoPagos.service'
import { type AdminAnalyticsData, type AnalyticsPeriod, getMockAdminAnalytics } from '../mocks/adminAnalytics.mock'

export async function getAdminAnalytics(period: AnalyticsPeriod): Promise<AdminAnalyticsData> {
  await Promise.allSettled([
    getBarberos(),
    getServicios(),
    getTipoPagos(),
  ])

  await new Promise((resolve) => {
    setTimeout(resolve, 350)
  })

  return getMockAdminAnalytics(period)
}
