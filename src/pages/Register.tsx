import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthPageShell, { authFieldClass, authLabelClass } from '../components/AuthPageShell'
import { saveUserProfile } from '../lib/userProfileStorage'

export default function Register() {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const data = new FormData(form)
    const fullName = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const password = String(data.get('password') ?? '')
    const confirm = String(data.get('confirm') ?? '')
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    const terms = data.get('terms')
    if (!terms) {
      setError('Tenés que aceptar los términos para continuar.')
      return
    }
    saveUserProfile({ fullName, email })
    // Conectar con tu API de registro
    navigate('/login')
  }

  return (
    <AuthPageShell
      title="Crear"
      accent="cuenta"
      subtitle="Unite y reservá turnos online, con recordatorios y beneficios para clientes frecuentes."
    >
      <article className="rounded-xl border border-neutral-100 bg-white p-8 shadow-md shadow-neutral-200/60 sm:p-10">
        {error ? (
          <p
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="register-name" className={authLabelClass}>
              Nombre completo
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Ej. Juan Pérez"
              className={authFieldClass}
            />
          </div>
          <div>
            <label htmlFor="register-email" className={authLabelClass}>
              Correo electrónico
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="nombre@ejemplo.com"
              className={authFieldClass}
            />
          </div>
          <div>
            <label htmlFor="register-password" className={authLabelClass}>
              Contraseña
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
              className={authFieldClass}
            />
          </div>
          <div>
            <label htmlFor="register-confirm" className={authLabelClass}>
              Confirmar contraseña
            </label>
            <input
              id="register-confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Repetí tu contraseña"
              className={authFieldClass}
            />
          </div>

          <div className="flex gap-3 rounded-lg border border-neutral-100 bg-neutral-50/80 p-4">
            <input
              id="register-terms"
              name="terms"
              type="checkbox"
              required
              className="mt-0.5 size-4 shrink-0 rounded border-neutral-300 text-[#0056b3] focus:ring-[#0056b3]/30"
            />
            <label htmlFor="register-terms" className="text-sm leading-snug text-neutral-600">
              Acepto los{' '}
              <a href="#" className="font-semibold text-[#0056b3] hover:underline" onClick={(e) => e.preventDefault()}>
                términos
              </a>{' '}
              y la{' '}
              <a href="#" className="font-semibold text-[#0056b3] hover:underline" onClick={(e) => e.preventDefault()}>
                política de privacidad
              </a>
              .
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#0056b3] px-4 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#004a9a]"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-600">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-bold text-[#0056b3] transition hover:text-[#004a9a]">
            Iniciá sesión
          </Link>
        </p>
      </article>
    </AuthPageShell>
  )
}
