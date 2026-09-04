import { useEffect, useRef } from 'react'
import { gsap, revealChildren } from '@/lib/motion'
import { Section, SectionHeading } from '@/components/ui/Primitives'
import { story } from '@/data/content'

export function Story() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => revealChildren(el, '[data-block]', { stagger: 0.1 }), el)
    return () => ctx.revert()
  }, [])

  return (
    <Section id="story" className="border-t border-v-blue-400/10 scroll-mt-24">
      <SectionHeading
        eyebrow="Who we are"
        title="A software company that starts on the ward"
        lead="Healthcare technology is not a general engineering problem with a clinical coat of paint. It has its own failure modes, and they are the reason we work the way we do."
      />

      <div ref={root} className="mt-16 grid gap-px bg-v-blue-400/10 lg:grid-cols-3">
        {story.map((s) => (
          <article
            key={s.heading}
            data-block
            className="group relative bg-v-ink-900 p-8 transition-colors duration-500 hover:bg-v-ink-800 md:p-10"
          >
            <h3 className="text-h3 text-white">{s.heading}</h3>
            <p className="mt-5 text-sm leading-relaxed text-v-ink-300">{s.body}</p>
            {/* Bottom rule that draws in on hover. */}
            <span
              className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-v-blue-500 to-v-crimson-500 transition-all duration-500 group-hover:w-full"
              aria-hidden="true"
            />
          </article>
        ))}
      </div>
    </Section>
  )
}
