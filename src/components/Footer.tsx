import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from './ScrollReveal'

import { Logo } from '../utils/logo'


function SocialIcon({ children, label }: { children: ReactNode; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-500 transition hover:border-neutral-300 hover:text-[#0056b3]"
    >
      {children}
    </a>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div
        className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-8"
        style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <ScrollReveal variant="fade-up">
          <Link to="/" className="flex items-center gap-2.5 size-18">
            <Logo />
          </Link>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={80}>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-semibold tracking-widest text-neutral-500">
            <a href="#" className="transition hover:text-[#0056b3]">
              TÉRMINOS
            </a>
            <a href="#" className="transition hover:text-[#0056b3]">
              PRIVACIDAD
            </a>
            <Link to="/contact" className="transition hover:text-[#0056b3]">
              CONTACTO
            </Link>
            <a href="#" className="transition hover:text-[#0056b3]">
              UBICACIÓN
            </a>
          </nav>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={160}>
          <div className="flex items-center gap-3">
            <SocialIcon label="Redes sociales">
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M3 11v2h4l3 7 4-14 3 7h5v-2h-3.08L15 4l-4 14-3-7H3z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="Reconocimientos">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="10" r="6" />
                <path d="M8 21l4-3 4 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </SocialIcon>
            <SocialIcon label="Mensajes">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 6h16v10H7l-3 3V6z" strokeLinejoin="round" />
              </svg>
            </SocialIcon>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={240}>
          <div className="space-y-1">
            <p className="text-xs text-neutral-500">
              © {year} LC BARBER. TODOS LOS DERECHOS RESERVADOS.
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
              Designed by Agustín Castillo
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  )
}
