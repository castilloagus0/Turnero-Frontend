// Formulario de perfil: obtiene el usuario con getUser (id en localStorage), permite editar y guardar o cancelar.
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { getUser, updateUser } from '../../service/user.service'

type EstadoFormulario = {
  nombre: string
  apellido: string
  email: string
  telefono: string
  nacimiento: string
  nuevaPassword: string
}

const VACIO: EstadoFormulario = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  nacimiento: '',
  nuevaPassword: '',
}

function normalizarObjetoUsuarioApi(respuesta: unknown): Record<string, unknown> {
  if (!respuesta || typeof respuesta !== 'object') return {}
  const capa = respuesta as Record<string, unknown>
  const interno = capa.data ?? capa.user ?? capa
  return typeof interno === 'object' && interno !== null ? (interno as Record<string, unknown>) : {}
}

function fechaParaInputNacimiento(valor: unknown): string {
  if (valor == null || valor === '') return ''
  if (typeof valor === 'string') {
    const iso = /^(\d{4}-\d{2}-\d{2})/.exec(valor)
    if (iso) return iso[1]
  }
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    const y = valor.getFullYear()
    const m = String(valor.getMonth() + 1).padStart(2, '0')
    const d = String(valor.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  return ''
}

function mapaFormularioDesdeApi(u: Record<string, unknown>): EstadoFormulario {
  return {
    nombre: String(u.nombre ?? ''),
    apellido: String(u.apellido ?? ''),
    email: String(u.email ?? ''),
    telefono: String(u.telefono ?? ''),
    nacimiento: fechaParaInputNacimiento(u.nacimiento),
    nuevaPassword: '',
  }
}

function sincronizarNombreLocalEnSesion(nombre: string) {
  try {
    const raw = localStorage.getItem('user')
    const actual = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
    localStorage.setItem('user', JSON.stringify({ ...actual, name: nombre }))
    window.dispatchEvent(new Event('storage'))
  } catch {
    /* ignore */
  }
}

function mensajeDesdeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    if (data?.message) return data.message
    if (typeof error.response?.data === 'string') return error.response.data
    return error.message || 'Error de red.'
  }
  if (error instanceof Error) return error.message
  return 'Ocurrió un error inesperado.'
}

export default function PerfilUsuario() {
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null)
  const [exitoGuardado, setExitoGuardado] = useState(false)
  const [formulario, setFormulario] = useState<EstadoFormulario>(VACIO)
  const [formularioOriginal, setFormularioOriginal] = useState<EstadoFormulario>(VACIO)

  const obtenerIdUsuarioDesdeAlmacenamiento = useCallback((): string | null => {
    const raw = localStorage.getItem('userId')
    if (raw == null || raw === '') return null
    return String(raw)
  }, [])

  const cargarDatosUsuarioDesdeApi = useCallback(async () => {
    const id = obtenerIdUsuarioDesdeAlmacenamiento()
    if (!id) {
      setErrorCarga('No hay sesión de usuario (falta userId).')
      setCargando(false)
      return
    }
    setCargando(true)
    setErrorCarga(null)
    try {
      const respuesta = await getUser(id)
      const u = normalizarObjetoUsuarioApi(respuesta)
      const inicial = mapaFormularioDesdeApi(u)
      setFormulario(inicial)
      setFormularioOriginal({ ...inicial, nuevaPassword: '' })
    } catch (e: unknown) {
      setErrorCarga(mensajeDesdeError(e))
    } finally {
      setCargando(false)
    }
  }, [obtenerIdUsuarioDesdeAlmacenamiento])

  useEffect(() => {
    void cargarDatosUsuarioDesdeApi()
  }, [cargarDatosUsuarioDesdeApi])

  function actualizarCampoFormulario<K extends keyof EstadoFormulario>(campo: K, valor: string) {
    setFormulario((prev) => ({ ...prev, [campo]: valor }))
    setExitoGuardado(false)
    setErrorGuardado(null)
  }

  function descartarCambiosYVolverAlOriginal() {
    setFormulario({ ...formularioOriginal, nuevaPassword: '' })
    setErrorGuardado(null)
    setExitoGuardado(false)
  }

  async function guardarCambiosPerfilEnServidor() {
    const id = obtenerIdUsuarioDesdeAlmacenamiento()
    if (!id) {
      setErrorGuardado('No hay sesión de usuario.')
      return
    }
    setGuardando(true)
    setErrorGuardado(null)
    setExitoGuardado(false)


    const nombre = formulario.nombre.trim()
    const apellido = formulario.apellido.trim()
    const email = formulario.email.trim()
    const telefono = formulario.telefono.trim()
    const nacimiento = formulario.nacimiento || undefined
    try {
      await updateUser(
        nombre,
        apellido,
        email,
        telefono,
        nacimiento,
      )
      const sinPassword: EstadoFormulario = { ...formulario, nuevaPassword: '' }
      setFormulario(sinPassword)
      setFormularioOriginal({ ...sinPassword })
      sincronizarNombreLocalEnSesion(formulario.nombre.trim())
      setExitoGuardado(true)
    } catch (e: unknown) {
      setErrorGuardado(mensajeDesdeError(e))
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <div className="mt-8 rounded-2xl border border-neutral-200/80 bg-white p-8 text-center text-sm text-neutral-500 shadow-sm">
        Cargando tu perfil...
      </div>
    )
  }

  if (errorCarga) {
    return (
      <div className="mt-8 space-y-4 rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-red-600">{errorCarga}</p>
        <button
          type="button"
          onClick={() => void cargarDatosUsuarioDesdeApi()}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <section className="mt-8 max-w-xl rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-bold text-neutral-900">Mis datos</h2>
      <p className="mt-1 text-sm text-neutral-500">Actualizá tu información personal. La contraseña solo se cambia si completás el campo.</p>

      {exitoGuardado ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Cambios guardados correctamente.
        </div>
      ) : null}
      {errorGuardado ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errorGuardado}</div>
      ) : null}

      <div className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Nombre</span>
          <input
            type="text"
            value={formulario.nombre}
            onChange={(e) => actualizarCampoFormulario('nombre', e.target.value)}
            className="h-11 rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-[#1D4ED8]"
            autoComplete="given-name"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Apellido</span>
          <input
            type="text"
            value={formulario.apellido}
            onChange={(e) => actualizarCampoFormulario('apellido', e.target.value)}
            className="h-11 rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-[#1D4ED8]"
            autoComplete="family-name"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Email</span>
          <input
            type="email"
            value={formulario.email}
            onChange={(e) => actualizarCampoFormulario('email', e.target.value)}
            className="h-11 rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-[#1D4ED8]"
            autoComplete="email"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Teléfono</span>
          <input
            type="tel"
            value={formulario.telefono}
            onChange={(e) => actualizarCampoFormulario('telefono', e.target.value)}
            className="h-11 rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-[#1D4ED8]"
            autoComplete="tel"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Fecha de nacimiento</span>
          <input
            type="date"
            value={formulario.nacimiento}
            onChange={(e) => actualizarCampoFormulario('nacimiento', e.target.value)}
            className="h-11 rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-[#1D4ED8]"
          />
        </label>
        {/* <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Nueva contraseña (opcional)</span>
          <input
            type="password"
            value={formulario.nuevaPassword}
            onChange={(e) => actualizarCampoFormulario('nuevaPassword', e.target.value)}
            placeholder="Dejar vacío para no cambiar"
            className="h-11 rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-[#1D4ED8]"
            autoComplete="new-password"
          />
        </label> */}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={descartarCambiosYVolverAlOriginal}
          disabled={guardando}
          className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => void guardarCambiosPerfilEnServidor()}
          disabled={guardando}
          className="rounded-xl bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </section>
  )
}
