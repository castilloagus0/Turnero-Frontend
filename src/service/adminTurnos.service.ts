import { getBarberos } from './barbero.service'
import { getServicios } from './servicios.service'
import { getTipoPagos } from './tipoPagos.service'
import { getMockAdminTurnos, type AdminTurnosData } from '../mocks/adminTurnos.mock'

export async function getAdminTurnos(): Promise<AdminTurnosData> {
  await Promise.allSettled([
    getBarberos(),
    getServicios(),
    getTipoPagos(),
  ])

  await new Promise((resolve) => {
    setTimeout(resolve, 300)
  })

  return getMockAdminTurnos()
}
