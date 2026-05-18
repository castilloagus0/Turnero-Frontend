import type { ReactNode } from 'react'

export const PRIMARY_ADMIN = '#1D4ED8'

/** Fecha y hora local en 24 h (coherente con paneles de la app). */
export function formatFechaHora24hEsAr(iso: string | number | Date): string {
  const d = iso instanceof Date ? iso : new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}

export function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
    </svg>
  )
}

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  )
}

export function ScissorsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M3 3v18h18M7 16l4-4 4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  )
}

export function UserCircleOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BanknoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 10h.01M18 14h.01" strokeLinecap="round" />
    </svg>
  )
}

export function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M21 12V7H5a2 2 0 010-4h14v4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 5v14a2 2 0 002 2h16v-5M18 12a2 2 0 100 4h4v-4h-4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type AgendaRowProps = {
  fecha: string
  hora: string
  estado: string
  estadoClassName?: string
  client: string
  clientInitials: string
  clientImage?: string
  service: string
  barber: string
  highlight?: boolean
  className?: string
}

export function AgendaRow({
  fecha,
  hora,
  estado,
  estadoClassName = 'bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200',
  client,
  clientInitials,
  clientImage,
  service,
  barber,
  highlight,
  className = '',
}: AgendaRowProps) {

  return (
    <div
      className={`flex flex-wrap items-center gap-3 border-b border-neutral-100 px-4 py-4 last:border-0 sm:flex-nowrap ${
        highlight ? 'border-l-4 border-l-[#1D4ED8] bg-blue-50/40 pl-3' : ''
      } ${className}`}
    >
      <div className="min-w-[6.5rem] shrink-0 text-sm sm:min-w-[7.5rem] lg:min-w-0 lg:w-full">
        <p className={`font-semibold ${highlight ? 'text-[#1D4ED8]' : 'text-neutral-900'}`}>{fecha}</p>
        <p className="mt-0.5 text-xs font-medium text-neutral-600">{hora}</p>
      </div>
      <div className="flex min-w-0 flex-1 basis-0 items-center gap-3 lg:w-full">
        {clientImage ? (
          <img
            src={clientImage}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600">
            {clientInitials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-neutral-900">{client}</p>
          <p className="truncate text-sm text-neutral-500">{service}</p>
          <p className="mt-1 text-xs text-neutral-500 sm:hidden">
            Barbero: <span className="font-medium text-neutral-700">{barber}</span>
          </p>
        </div>
      </div>
      <span
        className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:min-w-[5.5rem] sm:text-center lg:min-w-[12rem] ${estadoClassName}`}
      >
        {estado}
      </span>
      <p className="hidden min-w-[7rem] shrink-0 text-sm text-neutral-600 sm:block lg:min-w-0 lg:w-full">
        <span className="text-neutral-500 lg:hidden">Barbero: </span>
        <span className="font-medium text-neutral-800">{barber}</span>
      </p>
    </div>
  )
}

// Genera iniciales (máx. 2 letras) a partir del nombre del cliente para el avatar textual.
export function inicialesDesdeNombreCompleto(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return `${partes[0][0] ?? ''}${partes[partes.length - 1][0] ?? ''}`.toUpperCase()
}

export function formatMonedaArs(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

type StatCardProps = {
  titulo: string
  valor: string
  icono: ReactNode
  variante?: 'emerald' | 'blue' | 'orange'
  detalle?: string
}

export function TarjetaStatAdmin({ titulo, valor, icono, variante = 'blue', detalle }: StatCardProps) {
  const ringIcono =
    variante === 'emerald'
      ? 'bg-emerald-50 text-emerald-600'
      : variante === 'orange'
        ? 'bg-orange-50 text-orange-600'
        : 'bg-blue-50 text-[#1D4ED8]'

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${ringIcono}`}>{icono}</div>
        {detalle ? <span className="text-sm font-semibold text-neutral-600">{detalle}</span> : null}
      </div>
      <p className="mt-4 text-sm text-neutral-500">{titulo}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">{valor}</p>
    </div>
  )
}
