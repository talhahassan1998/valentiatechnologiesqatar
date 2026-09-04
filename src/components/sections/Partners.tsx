import { useEffect, useRef, useState } from 'react'
import { gsap, revealChildren, useReducedMotion } from '@/lib/motion'
import { Section, SectionHeading } from '@/components/ui/Primitives'
import { partners, partnersIntro } from '@/data/content'

/**
 * Technology partners — the list with a cross-fading logo panel beside it.
 *
 * Same shape as Industries: the panel auto-cycles so the section has life when
 * idle, and hovering a row takes over. Under reduced motion it holds the first
 * logo and never moves.
 */

const CYCLE_MS = 3000

export function Partners() {
  const root = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const hovered = useRef<number | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => revealChildren(el, '[data-partner]', { stagger: 0.06 }), el)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      // Hover wins.
      if (hovered.current !== null) return
      setActive((i) => (i + 1) % partners.length)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [reduced])

  // Cross-fade the outgoing logo under the incoming one. Deliberately not in a
  // reverting gsap.context — this re-runs on every `active`, and reverting
  // would undo the fade-in it just applied. Tweens are killed per element.
  useEffect(() => {
    const el = panel.current
    if (!el || reduced) return
    const imgs = el.querySelectorAll<HTMLElement>('[data-logo]')
    const incoming = el.querySelector<HTMLElement>(`[data-logo="${active}"]`)
    if (!incoming) return

    gsap.killTweensOf(imgs)
    gsap.to(imgs, { opacity: 0, duration: 0.4, ease: 'power2.out' })
    gsap.fromTo(
      incoming,
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
    )
  }, [active, reduced])

  useEffect(() => {
    const el = panel.current
    return () => {
      if (el) gsap.killTweensOf(el.querySelectorAll('[data-logo]'))
    }
  }, [])

  const show = (i: number) => {
    hovered.current = i
    setActive(i)
  }
  const release = () => {
    hovered.current = null
  }

  return (
    <Section id="partners" className="border-t border-v-blue-400/10 scroll-mt-24">
      <SectionHeading
        eyebrow="Who we build on"
        title="Technology partners"
        lead={partnersIntro}
      />

      <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-start lg:gap-16">
        <div ref={root} className="border-t border-v-blue-400/12">
          {partners.map((p, i) => (
            <div
              key={p.name}
              data-partner
              onMouseEnter={() => show(i)}
              onMouseLeave={release}
              onFocus={() => show(i)}
              onBlur={release}
              className={`group grid cursor-default items-baseline gap-2 border-b border-v-blue-400/12 py-7 transition-colors duration-400 md:grid-cols-[minmax(0,12rem)_1fr] md:gap-8 md:px-4 ${
                active === i ? 'bg-v-ink-800/60' : 'hover:bg-v-ink-800/60'
              }`}
            >
              <div className="flex items-baseline gap-4">
                <span className="text-eyebrow font-mono text-v-blue-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className={`text-h3 text-white transition-transform duration-400 md:group-hover:translate-x-2 ${
                    active === i ? 'md:translate-x-2' : ''
                  }`}
                >
                  {p.name}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-v-ink-300">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Logo panel. Sticky so it stays beside the list on tall viewports.
            The supplied PNGs are opaque on white, so the plate is white. */}
        <div
          ref={panel}
          className="relative hidden aspect-[4/3] overflow-hidden border border-v-blue-400/12 bg-on-brand lg:block lg:sticky lg:top-28"
          aria-hidden="true"
        >
          {partners.map((p, i) => (
            <img
              key={p.logo}
              data-logo={i}
              src={p.logo}
              alt=""
              width="324"
              height="144"
              // All seven are needed within ~21s of the section appearing and
              // total ~40 KB, so they load eagerly — lazy-loading makes the
              // cycle advance to an undecoded image and the panel goes blank.
              loading="eager"
              decoding="async"
              className="absolute inset-0 m-auto h-auto w-3/4 object-contain"
              style={{ opacity: i === 0 ? 1 : 0 }}
            />
          ))}

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center gap-3 border-t border-v-blue-400/12 bg-v-ink-950 p-4">
            <span className="text-eyebrow font-mono uppercase text-v-blue-300">
              {partners[active].name}
            </span>
            <span className="h-px flex-1 bg-v-blue-400/25" />
            <span className="text-eyebrow font-mono text-v-ink-400">
              {String(active + 1).padStart(2, '0')}/{String(partners.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </Section>
  )
}
