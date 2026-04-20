import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthPageShell, { authFieldClass, authLabelClass } from '../components/AuthPageShell'
import { saveUserProfile } from '../lib/userProfileStorage'
import { login } from '../service/auth.service'

export default function Login() {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    try {
      const loginUser = await login(email, password)
      console.log(loginUser)
      saveUserProfile(loginUser) //Llamo al metodo que almacena las credenciales en el localStorage.
      navigate(loginUser.user.rol === 'barbero' || loginUser.user.rol === 'admin' ? '/admin-dashboard' : '/user-dashboard')
    } catch {
      setError('Error al ingresar. Intentá de nuevo.')
    }
  }

  return (
    <AuthPageShell
      title="Iniciar"
      accent="sesión"
      subtitle="Accedé a tus turnos, historial y promociones exclusivas de la barbería."
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
            <label htmlFor="login-email" className={authLabelClass}>
              Correo electrónico
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="nombre@ejemplo.com"
              className={authFieldClass}
            />
          </div>
          <div>
            <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-500"
              >
                Contraseña
              </label>
              <a
                href="#"
                className="text-xs font-semibold text-[#0056b3] transition hover:text-[#004a9a] sm:shrink-0 sm:text-right"
                onClick={(e) => e.preventDefault()}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className={authFieldClass}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#0056b3] px-4 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#004a9a]"
          >
            Entrar
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-600">
          ¿Todavía no tenés cuenta?{' '}
          <Link to="/register" className="font-bold text-[#0056b3] transition hover:text-[#004a9a]">
            Registrate
          </Link>
        </p>
      </article>
    </AuthPageShell>
  )
}
