import { useEffect, useRef, useState } from 'react'
import { gsap, revealChildren, useReducedMotion } from '@/lib/motion'
import { Section, SectionHeading } from '@/components/ui/Primitives'
import { industries } from '@/data/content'

/**
 * "Where we work" — the settings list with a cross-fading image panel.
 *
 * The panel auto-cycles so the section has life when idle, and hovering a row
 * takes over. Under reduced motion it holds the first image and never moves.
 */

const CYCLE_MS = 3600

export function Industries() {
  const root = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const hovered = useRef<number | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => revealChildren(el, '[data-row]', { stagger: 0.06, y: 20 }), el)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      // Hover wins.
      if (hovered.current !== null) return
      setActive((i) => (i + 1) % industries.length)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [reduced])

  // Cross-fade: the outgoing image fades under the incoming one.
  //
  // Deliberately NOT wrapped in a gsap.context that reverts on change — this
  // effect re-runs on every `active`, and reverting would undo the fade-in it
  // had just applied, leaving every image at opacity 0. Tweens are killed per
  // element instead, and the whole panel is cleaned up on unmount below.
  useEffect(() => {
    const el = panel.current
    if (!el || reduced) return
    const imgs = el.querySelectorAll<HTMLElement>('[data-ind-img]')
    const incoming = el.querySelector<HTMLElement>(`[data-ind-img="${active}"]`)
    if (!incoming) return

    gsap.killTweensOf(imgs)
    gsap.to(imgs, { opacity: 0, duration: 0.55, ease: 'power2.out' })
    gsap.to(incoming, { opacity: 1, duration: 0.7, ease: 'power2.out' })
    // A slow drift keeps the panel from reading as a static plate.
    gsap.fromTo(
      incoming,
      { scale: 1.06 },
      { scale: 1, duration: CYCLE_MS / 1000 + 1, ease: 'none' },
    )
  }, [active, reduced])

  // Kill any in-flight panel tweens when the section unmounts.
  useEffect(() => {
    const el = panel.current
    return () => {
      if (el) gsap.killTweensOf(el.querySelectorAll('[data-ind-img]'))
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
    <Section id="industries" className="border-t border-v-blue-400/10">
      <SectionHeading
        eyebrow="Where we work"
        title="Across the care continuum"
        lead="From single clinics to connected public health programmes, the same engineering standards apply."
      />

      <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-start lg:gap-16">
        <div ref={root} className="border-t border-v-blue-400/12">
          {industries.map((ind, i) => (
            <div
              key={ind.name}
              data-row
              onMouseEnter={() => show(i)}
              onMouseLeave={release}
              onFocus={() => show(i)}
              onBlur={release}
              className={`group grid cursor-default items-baseline gap-2 border-b border-v-blue-400/12 py-7 transition-colors duration-400 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-8 md:px-4 ${
                active === i ? 'bg-v-ink-800/60' : 'hover:bg-v-ink-800/60'
              }`}
            >
              <h3
                className={`text-h3 text-white transition-transform duration-400 md:group-hover:translate-x-2 ${
                  active === i ? 'md:translate-x-2' : ''
                }`}
              >
                {ind.name}
              </h3>
              <p className="text-sm leading-relaxed text-v-ink-300">{ind.body}</p>
            </div>
          ))}
        </div>

        {/* Image panel. Sticky so it stays beside the list on tall viewports. */}
        <div
          ref={panel}
          className="relative hidden aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-v-blue-400/12 bg-v-ink-950 lg:block lg:sticky lg:top-28"
          aria-hidden="true"
        >
          {industries.map((ind, i) => (
            <img
              key={ind.image}
              data-ind-img={i}
              src={ind.image}
              alt=""
              // Every image is needed within ~20s of the section appearing,
              // and the six together are ~140 KB. Lazy-loading them means the
              // cycle advances to an image that has not decoded yet and the
              // panel goes blank, so they all load eagerly.
              loading="eager"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: i === 0 ? 1 : 0 }}
            />
          ))}

          {/* Grade the imagery into the page rather than letting it sit as a
              bright rectangle. */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-v-ink-950 via-transparent to-v-ink-950/40"
          />

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center gap-3 p-5">
            <span className="text-eyebrow font-mono uppercase text-v-blue-300">
              {industries[active].name}
            </span>
            <span className="h-px flex-1 bg-v-blue-400/25" />
            <span className="text-eyebrow font-mono text-v-ink-400">
              {String(active + 1).padStart(2, '0')}/{String(industries.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </Section>
  )
}
