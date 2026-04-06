import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from './ScrollReveal'

import { Logo } from '../utils/logo'
export const authFieldClass =
  'w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/20'

export const authLabelClass =
  'mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500'

type AuthPageShellProps = {
  title: string
  accent: string
  subtitle: string
  children: ReactNode
}

// Esto se utiliza en /pages/Login.tsx y /pages/Register.tsx

export default function AuthPageShell({ title, accent, subtitle, children }: AuthPageShellProps) {
  return (
    <div className="min-h-full flex-1 bg-neutral-50 px-4 py-10 sm:px-6 sm:py-12 lg:py-16">
      <div className="mx-auto w-full max-w-md">
        <ScrollReveal variant="fade" className="mb-10 flex justify-center">
          <Link to="/" className="flex items-center justify-center gap-3 transition hover:opacity-90 size-18">
            <Logo />
          </Link>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={70} className="mb-8 text-center">
          <header>
            <h1 className="text-3xl font-extrabold uppercase italic text-neutral-900 sm:text-4xl">
              {title}{' '}
              <span className="text-[#0056b3] not-italic">{accent}</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">{subtitle}</p>
          </header>
        </ScrollReveal>

        <ScrollReveal variant="scale" delay={140}>
          {children}
        </ScrollReveal>
      </div>
    </div>
  )
}
