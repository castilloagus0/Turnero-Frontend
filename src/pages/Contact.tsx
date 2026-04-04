import type { FormEvent, ReactNode } from 'react'
import { useState } from 'react'
import ScrollReveal from '../components/ScrollReveal'

const MAPS_SEARCH =
  'https://www.google.com/maps/search/?api=1&query=Calle+de+la+Elegancia+123,+Madrid,+España'
const OSM_EMBED =
  'https://www.openstreetmap.org/export/embed.html?bbox=-3.735%2C40.400%2C-3.675%2C40.435&layer=mapnik'

function InfoRow({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex gap-4">
      <div
        className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-[#0056b3]"
        aria-hidden
      >
        {icon}
      </div>
      <div className="min-w-0 pt-0.5">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-neutral-900">{title}</h3>
        <div className="mt-1 text-sm leading-relaxed text-neutral-600">{children}</div>
      </div>
    </div>
  )
}

function SocialButton({ children, label }: { children: ReactNode; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500 transition hover:border-[#0056b3]/40 hover:bg-sky-50 hover:text-[#0056b3]"
    >
      {children}
    </a>
  )
}

export default function Contact() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="bg-neutral-50">
      <section className="border-b border-neutral-200/80 bg-white px-6 py-14 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal variant="fade-up">
            <h1 className="text-3xl font-extrabold uppercase italic text-neutral-900 sm:text-4xl md:text-5xl">
              Contacto y <span className="text-[#0056b3] not-italic">ubicación</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              Estamos aquí para atenderte. Visítanos en nuestro local o envíanos un mensaje para
              cualquier consulta sobre nuestros servicios premium.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-6 py-14 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-12">
          <ScrollReveal variant="fade-left" className="min-w-0">
            <article className="rounded-xl border border-neutral-100 bg-white p-8 shadow-md shadow-neutral-200/60 md:p-10">
            <h2 className="text-xl font-extrabold uppercase italic tracking-tight text-neutral-900">
              Enviarnos un mensaje
            </h2>

            {sent ? (
              <p className="mt-8 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-neutral-700">
                ¡Gracias! Recibimos tu mensaje y te responderemos a la brevedad.
              </p>
            ) : null}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Nombre completo
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Ej. Juan Pérez"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/20"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Correo electrónico
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="nombre@ejemplo.com"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/20"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Tu mensaje
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Contanos en qué podemos ayudarte…"
                  className="w-full resize-y rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/20"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0056b3] px-4 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#004a9a]"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Enviar mensaje
              </button>
            </form>
            </article>
          </ScrollReveal>

          <div className="min-w-0 space-y-10">
            <ScrollReveal variant="fade-right" delay={80}>
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-md shadow-neutral-200/40">
              <div className="relative aspect-[16/10] w-full">
                <iframe
                  title="Ubicación aproximada en Madrid"
                  src={OSM_EMBED}
                  className="absolute inset-0 h-full w-full border-0 grayscale-[20%] contrast-[1.05]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] text-[#0056b3] drop-shadow-md"
                  aria-hidden
                >
                  <svg className="size-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-neutral-900/80 to-transparent p-4 pt-16">
                  <a
                    href={MAPS_SEARCH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-auto flex w-fit rounded-md bg-white/95 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-900 shadow-sm transition hover:bg-white"
                  >
                    Abrir en Google Maps
                  </a>
                </div>
              </div>
            </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-right" delay={180}>
            <div className="space-y-8 rounded-xl border border-neutral-100 bg-white p-8 shadow-md shadow-neutral-200/60">
              <InfoRow
                title="Dirección"
                icon={
                  <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                }
              >
                <p>Calle de la Elegancia 123, Madrid, España</p>
              </InfoRow>

              <InfoRow
                title="Horario de atención"
                icon={
                  <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v6l3 2" strokeLinecap="round" />
                  </svg>
                }
              >
                <p>Lun — Vie: 10:00 — 20:00</p>
                <p>Sábados: 09:00 — 15:00</p>
              </InfoRow>

              <InfoRow
                title="Teléfono"
                icon={
                  <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path
                      d="M6.5 4h3l1.5 4-2 1.5c1 2 2.5 3.5 4.5 4.5l1.5-2 4 1.5v3c0 .5-.5 1-1 1C9.4 17 4 11.6 4 5.5c0-.5.5-1 1-1z"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              >
                <a href="tel:+34900123456" className="font-semibold text-[#0056b3] hover:underline">
                  +34 900 123 456
                </a>
              </InfoRow>
            </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-right" delay={280}>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-neutral-900">Síguenos en redes</h3>
              <div className="mt-4 flex gap-3">
                <SocialButton label="Instagram">
                  <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M3 11v2h4l3 7 4-14 3 7h5v-2h-3.08L15 4l-4 14-3-7H3z" />
                  </svg>
                </SocialButton>
                <SocialButton label="WhatsApp">
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M4 6h16v10H7l-3 3V6z" strokeLinejoin="round" />
                  </svg>
                </SocialButton>
                <SocialButton label="Web">
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3a15 15 0 000 18M12 3a15 15 0 010 18" strokeLinecap="round" />
                  </svg>
                </SocialButton>
              </div>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  )
}
