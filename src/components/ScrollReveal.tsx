import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'

const variants = {
  'fade-up': {
    hidden: 'translate-y-6 opacity-0',
    show: 'translate-y-0 opacity-100',
  },
  fade: {
    hidden: 'opacity-0',
    show: 'opacity-100',
  },
  'fade-left': {
    hidden: '-translate-x-6 opacity-0',
    show: 'translate-x-0 opacity-100',
  },
  'fade-right': {
    hidden: 'translate-x-6 opacity-0',
    show: 'translate-x-0 opacity-100',
  },
  scale: {
    hidden: 'scale-[0.97] opacity-0',
    show: 'scale-100 opacity-100',
  },
} as const

export type ScrollRevealVariant = keyof typeof variants

export type ScrollRevealProps = {
  children: ReactNode
  className?: string
  /** Retraso al aparecer (útil para escalonar hijos) */
  delay?: number
  variant?: ScrollRevealVariant
  /** Dejar de observar tras la primera aparición */
  once?: boolean
  threshold?: number
  rootMargin?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  variant = 'fade-up',
  once = true,
  threshold = 0.1,
  rootMargin = '0px 0px -24px 0px',
  ...rest
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) obs.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold, rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [once, threshold, rootMargin])

  const v = variants[variant]

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={`transform-gpu transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? v.show : v.hidden} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
