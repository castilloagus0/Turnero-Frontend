import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { Logo } from '../utils/logo'

import { getUserProfile, clearUserProfile } from '../lib/userProfileStorage'

const desktopNavLink = ({ isActive }: { isActive: boolean }) =>
  `text-xs font-semibold tracking-widest transition hover:text-[#0056b3] ${
    isActive ? 'text-[#0056b3]' : 'text-neutral-600'
  }`

const mobileNavLink = ({ isActive }: { isActive: boolean }) =>
  `block border-b border-neutral-100 py-4 text-sm font-semibold tracking-widest transition hover:text-[#0056b3] last:border-b-0 ${
    isActive ? 'text-[#0056b3]' : 'text-neutral-600'
  }`

const mobileNavAnchorClass =
  'block border-b border-neutral-100 py-4 text-sm font-semibold tracking-widest text-neutral-600 transition hover:text-[#0056b3]'

export default function Navbar() {
  const [isLogged, setLogged] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    setLogged(!!getUserProfile())
    const sync = () => setLogged(!!getUserProfile())
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

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
        className="mx-auto flex max-w-6xl min-w-0 items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:gap-6 lg:px-8"
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
          {isLogged ? (
            /* --- DISEÑO LOGUEADO CON DROPDOWN --- */
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="touch-manipulation flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-[#003d82] shadow-sm transition hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056b3]"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                {/* Icono de Personita */}
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </button>

              {/* Menú Desplegable */}
              {userMenuOpen && (
                <>
                  {/* Overlay transparente para cerrar al hacer clic fuera */}
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)}></div>
                  
                  <div className="absolute right-0 z-20 mt-2 w-[min(calc(100vw-2rem),14rem)] overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg ring-1 ring-black/5">
                    <Link
                      to={getUserProfile()?.rol === 'user' ? '/user-dashboard' : '/admin-dashboard'}
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-3.5 text-sm font-medium text-[#003d82] transition hover:bg-neutral-50"
                    >
                      Ver perfil
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        clearUserProfile()
                        setLogged(false)
                        setUserMenuOpen(false)
                        navigate('/')
                      }}
                      className="block w-full border-t border-neutral-100 px-4 py-3.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* --- DISEÑO NO LOGUEADO (BOTONES ORIGINALES) --- */
            <>
              <Link
                to="/login"
                className="touch-manipulation inline-flex min-h-11 min-w-[5.5rem] items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm font-semibold text-[#003d82] transition hover:border-neutral-400 sm:px-4"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="touch-manipulation inline-flex min-h-11 min-w-[5.5rem] items-center justify-center rounded-lg bg-[#0056b3] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004a9a] sm:px-4"
              >
                Registrarse
              </Link>
            </>
          )}

          {/* BOTÓN MENÚ MÓVIL (HAMBURGUESA) */}
          <button
            type="button"
            className="touch-manipulation flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            className="absolute inset-x-0 top-full z-50 max-h-[min(75dvh,26rem)] overflow-y-auto overscroll-contain border-b border-neutral-200 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-2 shadow-lg md:hidden"
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
