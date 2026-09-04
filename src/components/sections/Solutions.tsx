import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, revealChildren } from '@/lib/motion'
import { Button, Section, SectionHeading } from '@/components/ui/Primitives'
import { products } from '@/data/content'

/**
 * Homepage teaser for the product suite. Each card links through to its
 * expanded block on /solutions, anchored by the product id.
 */
export function Solutions() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => revealChildren(el, '[data-card]', { scale: 0.97 }), el)
    return () => ctx.revert()
  }, [])

  return (
    <Section id="solutions" className="border-t border-v-blue-400/10 scroll-mt-24">
      <SectionHeading
        eyebrow="What we build"
        title="Six platforms, one care record"
        lead="From the general practice to the ambulance to the oncology ward — each platform is built for its setting, and all of them speak to each other."
      />

      <div ref={root} className="mt-16 grid gap-px bg-v-blue-400/10 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/solutions#${p.id}`}
            data-card
            className="group relative block bg-v-ink-900 p-8 transition-colors duration-500 hover:bg-v-ink-800 md:p-10"
          >
            <div className="flex items-start justify-between gap-4">
              <img
                src={p.icon}
                alt=""
                width="26"
                height="27"
                loading="lazy"
                decoding="async"
                className="h-8 w-8"
              />
              <svg
                className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                width="14"
                height="12"
                viewBox="0 0 14 12"
                fill="none"
                aria-hidden="true"
              >
                <path d="M1 1L7 11L13 1" stroke="var(--color-v-crimson-500)" strokeWidth="2" />
              </svg>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-eyebrow font-mono text-v-blue-400">{p.index}</span>
              <h3 className="text-h3 text-white">{p.title}</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-v-ink-300">{p.body}</p>

            <ul className="mt-7 flex flex-col gap-2.5 border-t border-v-blue-400/12 pt-5">
              {p.points.map((pt) => (
                <li key={pt} className="flex items-center gap-2.5 text-sm text-v-ink-400">
                  <span className="h-1 w-1 shrink-0 bg-v-blue-400" aria-hidden="true" />
                  {pt}
                </li>
              ))}
            </ul>

            {/* Bottom rule that draws in on hover. */}
            <span
              className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-v-blue-500 to-v-crimson-500 transition-all duration-500 group-hover:w-full"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <Button href="/solutions" variant="ghost">
          Explore the suite
        </Button>
      </div>
    </Section>
  )
}
