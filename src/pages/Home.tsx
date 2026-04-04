import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import heroBarber from '../assets/hero-barber.png'
import Experiences from '../components/Experiences'
import ScrollReveal from '../components/ScrollReveal'

function ServiceCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <article className="rounded-xl border border-neutral-100 bg-white p-6 shadow-md shadow-neutral-200/60 sm:p-8">
      <div className="mb-5 flex size-14 items-center justify-center rounded-lg bg-sky-100 text-[#0056b3]">
        {icon}
      </div>
      <h3 className="mb-3 text-lg font-extrabold uppercase italic tracking-wide text-neutral-900">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-neutral-600">{children}</p>
    </article>
  )
}

export default function Home() {
  return (
    <>
      <section className="relative flex min-h-[min(88dvh,820px)] items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBarber})` }}
        />
        <div className="absolute inset-0 bg-neutral-900/75 backdrop-blur-[2px]" />
        <div className="relative z-10 mx-auto max-w-3xl space-y-6">
          <ScrollReveal variant="fade" delay={0}>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-sky-400">Since 1985</p>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={90}>
            <h1 className="text-[1.65rem] font-extrabold uppercase italic leading-tight text-white min-[400px]:text-4xl sm:text-5xl md:text-6xl">
              Estilo y tradición
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={180}>
            <p className="mx-auto max-w-xl text-base text-white/90 sm:text-lg">
              Experimenta el arte del cuidado masculino en el ambiente más exclusivo de la ciudad.
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={260}>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/create-turno"
                className="rounded-md bg-[#0056b3] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:bg-[#004a9a]"
              >
                Reservar turno
              </Link>
              <a
                href="#servicios"
                className="rounded-md border border-white/40 bg-black/25 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white backdrop-blur-sm transition hover:bg-black/35"
              >
                Ver servicios
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="servicios" className="scroll-mt-20 bg-neutral-50 px-4 py-14 sm:scroll-mt-24 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="mx-auto mb-14 max-w-2xl text-center" variant="fade-up">
            <header>
              <h2 className="text-3xl font-extrabold uppercase italic text-neutral-900 sm:text-4xl">
                Nuestros <span className="text-[#0056b3] not-italic">servicios</span>
              </h2>
              <p className="mt-4 text-neutral-600">
                Más de tres décadas perfeccionando cada detalle para que salgas con la confianza de quien
                domina su estilo.
              </p>
            </header>
          </ScrollReveal>
          <div className="grid gap-8 md:grid-cols-3">
            <ScrollReveal variant="fade-up" delay={0}>
              <ServiceCard
                title="Corte de autor"
                icon={
                  <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="7" cy="7" r="2.5" />
                    <circle cx="17" cy="17" r="2.5" />
                    <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
                  </svg>
                }
              >
                Diseños personalizados que respetan tu rostro y tu personalidad, con técnicas clásicas y
                tendencia.
              </ServiceCard>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={110}>
              <ServiceCard
                title="Barba tradicional"
                icon={
                  <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path
                      d="M8 10c0 4 2 8 4 8s4-4 4-8V8a4 4 0 00-8 0v2z"
                      strokeLinejoin="round"
                    />
                    <path d="M8 12h8M10 14h4" strokeLinecap="round" />
                  </svg>
                }
              >
                Perfilado con navaja, toallas calientes y productos premium para un acabado impecable.
              </ServiceCard>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={220}>
              <ServiceCard
                title="Cuidado facial"
                icon={
                  <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path
                      d="M12 3c-4 4-6 7-6 10a6 6 0 1012 0c0-3-2-6-6-10z"
                      strokeLinejoin="round"
                    />
                    <path d="M12 14v4M10 18h4" strokeLinecap="round" />
                  </svg>
                }
              >
                Limpieza profunda e hidratación para una piel fresca y lista para cualquier ocasión.
              </ServiceCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Experiences />

      <section className="bg-slate-200/50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal variant="fade-up">
            <h2 className="text-2xl font-extrabold uppercase italic text-neutral-900 sm:text-3xl md:text-4xl">
              ¿Listo para un cambio de look?
            </h2>
            <p className="mt-4 text-neutral-600">
              Sumate a nuestros miembros y accedé a promociones exclusivas, recordatorios de turno y
              prioridad en fechas clave.
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={120} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-md bg-[#0056b3] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#004a9a]"
            >
              Empezar ahora
            </Link>
            <a
              href="#servicios"
              className="rounded-md border border-neutral-400 bg-white px-8 py-3 text-sm font-bold text-neutral-800 transition hover:border-neutral-500"
            >
              Consultar precios
            </a>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
