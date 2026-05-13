// Pantalla para cambiar contraseña (solo UI). Vinculá ací tu llamada al servicio en el handler de Guardar.
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ResetPasswordUsuario() {
  const navigate = useNavigate()
  const [contrasenaActual, setContrasenaActual] = useState('')
  const [contrasenaNueva, setContrasenaNueva] = useState('')
  const [error, setError] = useState<string | null>(null)

  const volverAlPerfil = useCallback(() => {
    navigate('/user-dashboard/perfil')
  }, [navigate])

  function manejarClickGuardar() {
    setError(null)
    if (!contrasenaActual.trim()) {
      setError('Ingresá tu contraseña actual.')
      return
    }
    if (!contrasenaNueva.trim()) {
      setError('Ingresá la nueva contraseña.')
      return
    }
    if (contrasenaNueva.trim().length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (contrasenaActual === contrasenaNueva) {
      setError('La nueva contraseña debe ser distinta de la actual.')
      return
    }

    // TODO: llamar a tu servicio (p. ej. updatePassword) con contrasenaActual y contrasenaNueva
  }

  return (
    <div className="mx-auto max-w-xl">
      <button
        type="button"
        onClick={volverAlPerfil}
        className="mb-4 text-sm font-semibold text-[#1D4ED8] hover:underline"
      >
        ← Volver al perfil
      </button>

      <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-lg font-bold text-neutral-900">Cambiar contraseña</h1>
        <p className="mt-1 text-sm text-neutral-500">Ingresá tu contraseña actual y elegí una nueva.</p>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Contraseña actual</span>
            <input
              type="password"
              value={contrasenaActual}
              onChange={(e) => {
                setContrasenaActual(e.target.value)
                setError(null)
              }}
              className="h-11 rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-[#1D4ED8]"
              autoComplete="current-password"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Nueva contraseña</span>
            <input
              type="password"
              value={contrasenaNueva}
              onChange={(e) => {
                setContrasenaNueva(e.target.value)
                setError(null)
              }}
              className="h-11 rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-[#1D4ED8]"
              autoComplete="new-password"
            />
          </label>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={manejarClickGuardar}
            className="w-full rounded-xl bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 sm:w-auto"
          >
            Guardar
          </button>
        </div>
      </section>
    </div>
  )
}
