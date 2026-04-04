import ScrollReveal from './ScrollReveal'

type GalleryItem = {
  src: string
  alt: string
  caption: string
  /** Destaca la pieza en el layout tipo bento */
  featured?: boolean
}

const trabajos: GalleryItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
    alt: 'Barbero realizando un corte con máquina y peine',
    caption: 'Corte con degradé',
    featured: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1585747860715-2ba73a775ef9?auto=format&fit=crop&w=900&q=80',
    alt: 'Interior de barbería con sillones y espejos',
    caption: 'Nuestro salón',
  },
  {
    src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80',
    alt: 'Detalle de corte de pelo moderno',
    caption: 'Estilo contemporáneo',
  },
  {
    src: 'https://images.unsplash.com/photo-1599351431202-1e0b70cd2720?auto=format&fit=crop&w=900&q=80',
    alt: 'Cliente con corte fade y línea definida',
    caption: 'Fade y diseño',
  },
  {
    src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80',
    alt: 'Trabajo de barba perfilada con navaja',
    caption: 'Barba y contornos',
  },
  {
    src: 'https://images.unsplash.com/photo-1521498675441-243be32beaf2?auto=format&fit=crop&w=900&q=80',
    alt: 'Sillón de barbero y herramientas',
    caption: 'Oficio y detalle',
  },
  {
    src: 'https://images.unsplash.com/photo-1493254328211-294bfdbeb360?auto=format&fit=crop&w=900&q=80',
    alt: 'Afeitado clásico con toalla caliente',
    caption: 'Ritual clásico',
  },
  {
    src: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=900&q=80',
    alt: 'Corte masculino visto desde atrás',
    caption: 'Acabado impecable',
  },
  {
    src: 'https://images.unsplash.com/photo-1504193965979-f79e8e50c74d?auto=format&fit=crop&w=900&q=80',
    alt: 'Barbero atendiendo a un cliente',
    caption: 'Atención personalizada',
  },
]

export default function Experiences() {
  return (
    <section
      id="experiencias"
      className="scroll-mt-20 border-y border-neutral-200/80 bg-slate-100/80 px-4 py-14 sm:scroll-mt-24 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="experiencias-heading"
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto mb-12 max-w-2xl text-center" variant="fade-up">
          <header>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#0056b3]">Portfolio</p>
            <h2
              id="experiencias-heading"
              className="mt-3 text-3xl font-extrabold uppercase italic text-neutral-900 sm:text-4xl"
            >
              Experiencias <span className="text-[#0056b3] not-italic">reales</span>
            </h2>
            <p className="mt-4 text-neutral-600">
              Una muestra de los cortes, barbas y trabajos que hacemos día a día en la barbería. Cada foto es
              resultado de nuestro equipo.
            </p>
          </header>
        </ScrollReveal>

        <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:grid-flow-dense lg:gap-4">
          {trabajos.map((item, i) => {
            const featured = item.featured === true
            return (
              <li
                key={item.src}
                className={`h-full ${featured ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''}`}
              >
                <ScrollReveal variant="scale" delay={Math.min(i * 70, 420)} className="h-full">
                  <figure
                    className={`group relative h-full overflow-hidden rounded-xl bg-neutral-200 shadow-md shadow-neutral-300/40 ${
                      featured
                        ? 'min-h-[240px] sm:min-h-[280px] lg:min-h-112'
                        : 'min-h-[200px] sm:min-h-[220px] lg:min-h-56'
                    }`}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      width={featured ? 1200 : 900}
                      height={featured ? 900 : 675}
                      loading="lazy"
                      decoding="async"
                      sizes={
                        featured
                          ? '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw'
                          : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                      }
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                    />
                    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-neutral-900/85 via-neutral-900/40 to-transparent px-4 pb-4 pt-16 text-left">
                      <span className="text-xs font-bold uppercase tracking-widest text-white/95">
                        {item.caption}
                      </span>
                    </figcaption>
                  </figure>
                </ScrollReveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
