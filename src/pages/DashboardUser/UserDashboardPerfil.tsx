import { getUserProfile } from '../../lib/userProfileStorage'
import PerfilUsuario from './PerfilUsuario'

export default function UserDashboardPerfil() {
  const nombreUsuario = getUserProfile().name ?? 'Invitado'

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Hola, {nombreUsuario}</h1>
          <p className="mt-1 text-sm text-neutral-500 sm:text-base">Editá tus datos personales cuando lo necesites.</p>
        </div>
      </div>

      <PerfilUsuario />
    </>
  )
}
