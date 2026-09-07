import { useEffect, useRef } from 'react'
import { gsap, revealChildren } from '@/lib/motion'
import { Section, SectionHeading } from '@/components/ui/Primitives'
import { values } from '@/data/content'

export function Values() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => revealChildren(el, '[data-value]', { stagger: 0.08 }), el)
    return () => ctx.revert()
  }, [])

  return (
    <Section id="values" className="border-t border-v-blue-400/12 scroll-mt-24">
      <SectionHeading
        eyebrow="What we hold to"
        title="Four principles, applied consistently"
        lead="These are the positions we do not trade away under delivery pressure."
      />

      <div ref={root} className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-2">
        {values.map((v, i) => (
          // These are indented list entries, not panels — there is no card
          // ground to lift, so the mark and heading carry the hover instead.
          <div key={v.title} data-value className="group relative pl-14">
            <span className="text-eyebrow absolute left-0 top-1 font-mono text-v-crimson-400">
              {String(i + 1).padStart(2, '0')}
            </span>
            {/* The V-fold, marking each principle. */}
            <svg
              className="absolute left-0 top-8 transition-transform duration-500 group-hover:translate-y-0.5"
              width="12"
              height="10"
              viewBox="0 0 14 12"
              fill="none"
              aria-hidden="true"
            >
              <path d="M1 1L7 11L13 1" stroke="var(--color-v-blue-500)" strokeWidth="2" />
            </svg>
            <h3 className="text-h3 text-white transition-transform duration-500 md:group-hover:translate-x-1.5">
              {v.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-v-ink-300">{v.body}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
