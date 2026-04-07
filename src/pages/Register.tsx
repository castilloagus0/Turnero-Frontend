import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthPageShell, { authFieldClass, authLabelClass } from '../components/AuthPageShell'
import { registerUser } from '../service/user.service'

export default function Register() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 2. Actualizamos el estado con el valor 'checked'
    setIsAccepted(e.target.checked);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const nombre = (form.elements.namedItem('nombre') as HTMLInputElement).value
    const apellido = (form.elements.namedItem('apellido') as HTMLInputElement).value
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const telefono = (form.elements.namedItem('telefono') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const confirm = (form.elements.namedItem('confirm') as HTMLInputElement).value
    const nacimiento = new Date((form.elements.namedItem('nacimiento') as HTMLInputElement).value)

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    try {
      await registerUser(nombre, apellido, email, telefono, password, nacimiento)
      navigate('/login')
    } catch {
      setError('Error al registrar. Intentá de nuevo.')
    }
  }

  

  return (
    <AuthPageShell
      title="Crear"
      accent="cuenta"
      subtitle="Unite y reservá turnos online, con recordatorios y beneficios para clientes frecuentes."
    >
      <article className="rounded-xl border border-neutral-100 bg-white p-8 shadow-md shadow-neutral-200/60 sm:p-10">
        {error && (
          <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="nombre" className={authLabelClass}>Nombre</label>
            <input id="nombre" name="nombre" type="text" autoComplete="given-name" required placeholder="Ej. Juan" className={authFieldClass} />
          </div>
          <div>
            <label htmlFor="apellido" className={authLabelClass}>Apellido</label>
            <input id="apellido" name="apellido" type="text" autoComplete="family-name" required placeholder="Ej. Pérez" className={authFieldClass} />
          </div>
          <div>
            <label htmlFor="email" className={authLabelClass}>Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required placeholder="nombre@ejemplo.com" className={authFieldClass} />
          </div>
          <div>
            <label htmlFor="telefono" className={authLabelClass}>Teléfono</label>
            <input id="telefono" name="telefono" type="tel" autoComplete="tel" required placeholder="Ej. 1122334455" className={authFieldClass} />
          </div>
          <div>
            <label htmlFor="nacimiento" className={authLabelClass}>Fecha de nacimiento</label>
            <input id="nacimiento" name="nacimiento" type="date" required className={authFieldClass} />
          </div>
          <div>
            <label htmlFor="password" className={authLabelClass}>Contraseña</label>
            <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="Mínimo 8 caracteres" className={authFieldClass} />
          </div>
          <div>
            <label htmlFor="confirm" className={authLabelClass}>Confirmar contraseña</label>
            <input id="confirm" name="confirm" type="password" autoComplete="new-password" required placeholder="Repetí tu contraseña" className={authFieldClass} />
          </div>

          <div className="flex gap-3 rounded-lg border border-neutral-100 bg-neutral-50/80 p-4">
            <input id="terms" name="terms" type="checkbox" checked={isAccepted} onChange={handleCheckboxChange} required className="mt-0.5 size-4 shrink-0 rounded border-neutral-300 text-[#0056b3] focus:ring-[#0056b3]/30" />
            <label htmlFor="terms" className="text-sm leading-snug text-neutral-600">
              Acepto los{' '}
              <a href="#" className="font-semibold text-[#0056b3] hover:underline" onClick={(e) => e.preventDefault()}>términos</a>{' '}
              y la{' '}
              <a href="#" className="font-semibold text-[#0056b3] hover:underline" onClick={(e) => e.preventDefault()}>política de privacidad</a>.
            </label>
          </div>

          <div className='flex justify-center px-4' >
            <button
              disabled={!isAccepted}
              className={`px-4 py-2 rounded-md font-bold transition-all w-100 ${
                !isAccepted 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
              }`}
            >
              Crear cuenta
            </button>       
            
          </div>   
        
        </form>
        <p className="mt-8 text-center text-sm text-neutral-600">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-bold text-[#0056b3] transition hover:text-[#004a9a] disabled:terms">Iniciá sesión</Link>
        </p>
      </article>
    </AuthPageShell>
  )
}
