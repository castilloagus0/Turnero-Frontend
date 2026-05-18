import { useEffect, useState } from 'react'
import { getAnaliticas } from '../../service/analiticas.service'
import type { AdminAnalyticsData, AnalyticsPeriod } from '../../types/adminAnalytics.types'
import { AdminAnalyticsView } from '../AdminAnalytics'
import { mapMetricasApiToAdminAnalytics } from './adminAnalyticsMapper'

type EstadoCarga =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'ok'; datos: AdminAnalyticsData }

export default function DashboardAdminAnaliticas() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('week')
  const [estado, setEstado] = useState<EstadoCarga>({ tipo: 'cargando' })

  useEffect(() => {
    let cancelado = false
    setEstado({ tipo: 'cargando' })

    getAnaliticas()
      .then((raw) => {
        if (cancelado) return
        setEstado({ tipo: 'ok', datos: mapMetricasApiToAdminAnalytics(raw, period) })
      })
      .catch((error: unknown) => {
        if (cancelado) return
        const mensaje = error instanceof Error ? error.message : 'No se pudieron cargar las analíticas.'
        setEstado({ tipo: 'error', mensaje })
      })

    return () => {
      cancelado = true
    }
  }, [period])

  if (estado.tipo === 'cargando') {
    return (
      <section className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-neutral-500">Cargando analíticas del negocio...</p>
        </div>
      </section>
    )
  }

  if (estado.tipo === 'error') {
    return (
      <section className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
          <h1 className="text-lg font-bold text-red-800">Error al cargar analíticas</h1>
          <p className="mt-2 text-sm text-red-700">{estado.mensaje}</p>
        </div>
      </section>
    )
  }

  return <AdminAnalyticsView data={estado.datos} period={period} onPeriodChange={setPeriod} />
}
