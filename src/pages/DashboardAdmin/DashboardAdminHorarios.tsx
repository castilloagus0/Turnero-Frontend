import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Horarios } from '../../interface/horarios.interface'
import { getUserProfile } from '../../lib/userProfileStorage'
import {
  createHorario,
  getHorarios,
  updateHorario,
} from '../../service/horarios.service'
import {
  clasesBadgeEstadoHorario,
  etiquetaEstadoHorario,
  formatoHoraHorario,
} from '../../utils/horariosDisplayUtils'
import { validarFormularioHorario, type HorarioFormPayload } from '../../utils/horariosValidation'
import { PRIMARY_ADMIN } from './adminDashboardUi'

const INPUT =
  'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20'

type ModoFormulario = 'crear' | 'editar' | null

const FORM_VACIO: HorarioFormPayload = {
  horaInicio: '',
  horaFin: '',
  activo: true,
}

function ordenarPorInicio(a: Horarios, b: Horarios): number {
  return String(a.horaInicio).localeCompare(String(b.horaInicio), 'es', { numeric: true })
}

export default function DashboardAdminHorarios() {
  const nombreAdmin = getUserProfile()?.name ?? 'Administrador'
  const [horarios, setHorarios] = useState<Horarios[]>([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [modo, setModo] = useState<ModoFormulario>(null)
  const [editandoId, setEditandoId] = useState<string | number | null>(null)
  const [form, setForm] = useState<HorarioFormPayload>(FORM_VACIO)
  const [errorForm, setErrorForm] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  const cargarHorarios = useCallback(async () => {
    setCargando(true)
    setErrorCarga(null)
    try {
      const data = await getHorarios()
      setHorarios(data.sort(ordenarPorInicio))
    } catch (e: unknown) {
      const mensaje = e instanceof Error ? e.message : 'No se pudieron cargar los horarios.'
      setErrorCarga(mensaje)
      setHorarios([])
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    void cargarHorarios()
  }, [cargarHorarios])

  const horariosActivos = useMemo(() => horarios.filter((h) => h.activo !== false), [horarios])

  function abrirCrear() {
    setModo('crear')
    setEditandoId(null)
    setForm(FORM_VACIO)
    setErrorForm(null)
  }

  function abrirEditar(h: Horarios) {
    setModo('editar')
    setEditandoId(h.id)
    setForm({
      horaInicio: String(h.horaInicio ?? '').slice(0, 5),
      horaFin: String(h.horaFin ?? '').slice(0, 5),
      activo: h.activo !== false,
    })
    setErrorForm(null)
  }

  function cerrarFormulario() {
    setModo(null)
    setEditandoId(null)
    setForm(FORM_VACIO)
    setErrorForm(null)
  }

  async function enviarFormulario(event: React.FormEvent) {
    event.preventDefault()
    const validacion = validarFormularioHorario(form, horarios, editandoId)
    if (validacion) {
      setErrorForm(validacion)
      return
    }

    setGuardando(true)
    setErrorForm(null)
    try {
      if (modo === 'editar' && editandoId != null) {
        await updateHorario(editandoId, form)
      } else {
        await createHorario(form)
      }
      cerrarFormulario()
      await cargarHorarios()
    } catch (e: unknown) {
      setErrorForm(e instanceof Error ? e.message : 'No se pudo guardar el horario.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Hola, {nombreAdmin}</h1>
          <p className="mt-1 max-w-2xl text-sm text-neutral-600 sm:text-base">
            Configurá los bloques horarios disponibles para reservas. Los cambios se validan para evitar solapamientos.
          </p>
        </div>
        <button
          type="button"
          onClick={abrirCrear}
          className="inline-flex shrink-0 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
          style={{ backgroundColor: PRIMARY_ADMIN }}
        >
          Nuevo horario
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Total de bloques</p>
          <p className="mt-2 text-2xl font-bold text-neutral-900">{horarios.length}</p>
        </article>
        <article className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Activos</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{horariosActivos.length}</p>
        </article>
        <article className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Inactivos</p>
          <p className="mt-2 text-2xl font-bold text-neutral-600">{horarios.length - horariosActivos.length}</p>
        </article>
      </div>

      {modo ? (
        <section className="rounded-2xl border border-[#1D4ED8]/20 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-neutral-900">
            {modo === 'crear' ? 'Crear horario' : 'Editar horario'}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">Formato 24 h (HH:mm). La hora de fin debe ser posterior al inicio.</p>
          <form onSubmit={enviarFormulario} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Hora inicio</span>
              <input
                type="time"
                required
                value={form.horaInicio}
                onChange={(e) => setForm((prev) => ({ ...prev, horaInicio: e.target.value }))}
                className={INPUT}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Hora fin</span>
              <input
                type="time"
                required
                value={form.horaFin}
                onChange={(e) => setForm((prev) => ({ ...prev, horaFin: e.target.value }))}
                className={INPUT}
              />
            </label>
            <label className="flex items-center gap-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) => setForm((prev) => ({ ...prev, activo: e.target.checked }))}
                className="h-4 w-4 rounded border-neutral-300 text-[#1D4ED8] focus:ring-[#1D4ED8]/30"
              />
              <span className="text-sm font-medium text-neutral-700">Horario activo para reservas</span>
            </label>
            {errorForm ? (
              <p className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {errorForm}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="submit"
                disabled={guardando}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
                style={{ backgroundColor: PRIMARY_ADMIN }}
              >
                {guardando ? 'Guardando…' : modo === 'crear' ? 'Crear' : 'Guardar cambios'}
              </button>
              <button
                type="button"
                onClick={cerrarFormulario}
                disabled={guardando}
                className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
        <div className="border-b border-neutral-100 bg-linear-to-r from-neutral-50/90 to-white px-5 py-4">
          <h2 className="text-lg font-bold tracking-tight text-neutral-900">Horarios configurados</h2>
        </div>

        {cargando ? (
          <p className="px-5 py-10 text-center text-sm text-neutral-500">Cargando horarios…</p>
        ) : errorCarga ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-semibold text-red-800">{errorCarga}</p>
            <button
              type="button"
              onClick={() => void cargarHorarios()}
              className="mt-3 text-sm font-semibold text-[#1D4ED8] hover:underline"
            >
              Reintentar
            </button>
          </div>
        ) : horarios.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-neutral-500">
            No hay horarios cargados. Creá el primero con el botón superior.
          </p>
        ) : (
          <>
            <ul className="divide-y divide-neutral-100 md:hidden">
              {horarios.map((h) => (
                <li key={String(h.id)} className="flex items-center justify-between gap-3 px-4 py-4">
                  <div>
                    <p className="text-xs text-neutral-500">Inicio · Fin</p>
                    <p className="font-semibold text-neutral-900">
                      {formatoHoraHorario(h.horaInicio)} – {formatoHoraHorario(h.horaFin)}
                    </p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${clasesBadgeEstadoHorario(h)}`}
                    >
                      {etiquetaEstadoHorario(h)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => abrirEditar(h)}
                    className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-[#1D4ED8] transition hover:bg-[#1D4ED8]/5"
                  >
                    Editar
                  </button>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/90 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    <th className="px-5 py-3">Hora inicio</th>
                    <th className="px-5 py-3">Hora fin</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {horarios.map((h) => (
                    <tr key={String(h.id)} className="transition hover:bg-neutral-50/80">
                      <td className="px-5 py-3 font-semibold text-neutral-900">{formatoHoraHorario(h.horaInicio)}</td>
                      <td className="px-5 py-3 font-semibold text-neutral-900">{formatoHoraHorario(h.horaFin)}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${clasesBadgeEstadoHorario(h)}`}
                        >
                          {etiquetaEstadoHorario(h)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => abrirEditar(h)}
                          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#1D4ED8] transition hover:bg-[#1D4ED8]/5"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
