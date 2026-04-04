import { useState, type FormEvent } from 'react'
import { authLabelClass } from './AuthPageShell'
import { getUserProfile, saveUserProfile } from '../lib/userProfileStorage'

const PRIMARY = '#1D4ED8'

const fieldClass =
  'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20'

type UserProfilePanelProps = {
  onProfileUpdated?: () => void
}

export default function UserProfilePanel({ onProfileUpdated }: UserProfilePanelProps) {
  const [fullName, setFullName] = useState(() => getUserProfile()?.fullName ?? '')
  const [email, setEmail] = useState(() => getUserProfile()?.email ?? '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const nameTrim = fullName.trim()
    const emailTrim = email.trim()
    if (!nameTrim || !emailTrim) {
      setError('Completá nombre y correo.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setError('Ingresá un correo válido.')
      return
    }

    if (newPassword || confirmPassword) {
      if (newPassword.length < 8) {
        setError('La nueva contraseña debe tener al menos 8 caracteres.')
        return
      }
      if (newPassword !== confirmPassword) {
        setError('Las contraseñas nuevas no coinciden.')
        return
      }
    }

    saveUserProfile({ fullName: nameTrim, email: emailTrim })
    onProfileUpdated?.()

    if (newPassword) {
      setSuccess('Datos guardados. La contraseña se actualizará cuando conectes el backend de autenticación.')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setSuccess('Tus datos se guardaron correctamente.')
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
      <header className="mb-8">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">Mi perfil</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Revisá y actualizá tus datos de cuenta. El correo es tu usuario para iniciar sesión.
        </p>
      </header>

      {error ? (
        <p
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {success ? (
        <p
          className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          role="status"
        >
          {success}
        </p>
      ) : null}

      <form className="space-y-8" onSubmit={handleSubmit} noValidate>
        <section>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-neutral-400">
            Datos personales
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="profile-name" className={authLabelClass}>
                Nombre completo
              </label>
              <input
                id="profile-name"
                name="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(ev) => setFullName(ev.target.value)}
                required
                className={fieldClass}
                placeholder="Tu nombre"
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="profile-email" className={authLabelClass}>
                Correo electrónico
              </label>
              <input
                id="profile-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                required
                className={fieldClass}
                placeholder="nombre@ejemplo.com"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-100 pt-8">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-neutral-400">
            Seguridad
          </h3>
          <p className="mb-4 text-sm text-neutral-500">
            Por seguridad no mostramos tu contraseña actual. Dejá los campos vacíos si no querés cambiarla.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-new-password" className={authLabelClass}>
                Nueva contraseña
              </label>
              <input
                id="profile-new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(ev) => setNewPassword(ev.target.value)}
                minLength={8}
                className={fieldClass}
                placeholder="Opcional · mín. 8 caracteres"
              />
            </div>
            <div>
              <label htmlFor="profile-confirm-password" className={authLabelClass}>
                Confirmar nueva contraseña
              </label>
              <input
                id="profile-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(ev) => setConfirmPassword(ev.target.value)}
                className={fieldClass}
                placeholder="Repetí la nueva contraseña"
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 active:scale-[0.99] sm:w-auto"
            style={{ backgroundColor: PRIMARY }}
          >
            Guardar cambios
          </button>
        </div>
      </form>

      <p className="mt-6 text-xs text-neutral-400">
        Los datos se guardan en este dispositivo hasta que integres tu API. El cambio de contraseña requiere
        endpoint seguro en el servidor.
      </p>
    </div>
  )
}
