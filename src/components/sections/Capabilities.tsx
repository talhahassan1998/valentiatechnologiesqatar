import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { revealChildren, gsap } from '@/lib/motion'
import { AmbientWash, Button, Section, SectionDivider, SectionHeading } from '@/components/ui/Primitives'
import { capabilities } from '@/data/content'

/**
 * Homepage teaser. Each card links through to its expanded block on /services,
 * anchored by the capability id.
 */
export function Capabilities() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => revealChildren(el, '[data-card]', { scale: 0.97 }), el)
    return () => ctx.revert()
  }, [])

  return (
    <Section id="technology" className="relative overflow-hidden"
      backdrop={
        <>
          <AmbientWash from="top-left" hue="blue" />
          <SectionDivider />
        </>
      }
    >
      <SectionHeading
        eyebrow="What we engineer"
        title="Software built for clinical reality"
        lead="Six disciplines that make up a working healthcare technology estate — engineered to interoperate, not to stand alone."
      />

      <div ref={root} className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((c) => (
          <Link
            key={c.id}
            to={`/services#${c.id}`}
            data-card
            className="group relative block card-surface p-8 md:p-10"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="text-eyebrow font-mono text-v-blue-400">{c.index}</span>
              {/* V-fold accent, revealed on hover. */}
              <svg
                width="18"
                height="14"
                viewBox="0 0 14 12"
                fill="none"
                aria-hidden="true"
                className="opacity-0 transition-all duration-500 group-hover:opacity-100"
              >
                <path
                  d="M1 1L7 11L13 1"
                  stroke="var(--color-v-crimson-500)"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <h3 className="text-h3 mt-6 text-white">{c.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-v-ink-300">{c.body}</p>

            <ul className="mt-6 flex flex-col gap-2">
              {c.points.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-v-ink-400">
                  <span className="h-1 w-1 shrink-0 bg-v-blue-500" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>

          </Link>
        ))}
      </div>

      <div className="mt-14">
        <Button href="/services" variant="ghost">
          All Services
        </Button>
      </div>
    </Section>
  )
}
