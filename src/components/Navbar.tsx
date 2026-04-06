import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { Logo } from '../utils/logo'

const desktopNavLink = ({ isActive }: { isActive: boolean }) =>
  `text-xs font-semibold tracking-widest transition hover:text-[#0056b3] ${
    isActive ? 'text-[#0056b3]' : 'text-neutral-600'
  }`

const mobileNavLink = ({ isActive }: { isActive: boolean }) =>
  `block border-b border-neutral-100 py-3.5 text-xs font-semibold tracking-widest transition hover:text-[#0056b3] last:border-b-0 ${
    isActive ? 'text-[#0056b3]' : 'text-neutral-600'
  }`

const mobileNavAnchorClass =
  'block border-b border-neutral-100 py-3.5 text-xs font-semibold tracking-widest text-neutral-600 transition hover:text-[#0056b3]'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const [pathSynced, setPathSynced] = useState(location.pathname)

  if (location.pathname !== pathSynced) {
    setPathSynced(location.pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-white/80">
      <div
        className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:gap-6 lg:px-8"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))' }}
      >
        <Link to="/" className="flex size-18 shrink-0 items-center justify-center rounded">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex lg:gap-10" aria-label="Principal">
          <NavLink to="/" end className={desktopNavLink}>
            HOME
          </NavLink>
          <a href="/#servicios" className="text-xs font-semibold tracking-widest text-neutral-600 transition hover:text-[#0056b3]">
            SERVICIOS
          </a>
          <a href="/#experiencias" className="text-xs font-semibold tracking-widest text-neutral-600 transition hover:text-[#0056b3]">
            EXPERIENCIAS
          </a>
          <NavLink to="/contact" className={desktopNavLink}>
            CONTACTO
          </NavLink>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <Link
            to="/login"
            className="touch-manipulation rounded-md border border-neutral-300 bg-white px-2.5 py-2 text-xs font-semibold text-[#003d82] transition hover:border-neutral-400 sm:px-4 sm:text-sm"
          >
            Ingresar
          </Link>
          <Link
            to="/register"
            className="touch-manipulation rounded-md bg-[#0056b3] px-2.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#004a9a] sm:px-4 sm:text-sm"
          >
            Registrarse
          </Link>

          <button
            type="button"
            className="touch-manipulation flex size-10 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-700 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-neutral-900/40 md:hidden"
            aria-hidden
            tabIndex={-1}
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="mobile-nav"
            className="absolute inset-x-0 top-full z-50 max-h-[min(70vh,28rem)] overflow-y-auto border-b border-neutral-200 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-2 shadow-lg md:hidden"
          >
            <nav className="flex flex-col" aria-label="Móvil">
              <NavLink to="/" end className={mobileNavLink}>
                HOME
              </NavLink>
              <a href="/#servicios" className={mobileNavAnchorClass} onClick={() => setMenuOpen(false)}>
                SERVICIOS
              </a>
              <a href="/#experiencias" className={mobileNavAnchorClass} onClick={() => setMenuOpen(false)}>
                EXPERIENCIAS
              </a>
              <NavLink to="/contact" className={mobileNavLink}>
                CONTACTO
              </NavLink>
            </nav>
          </div>
        </>
      ) : null}
    </header>
  )
}
