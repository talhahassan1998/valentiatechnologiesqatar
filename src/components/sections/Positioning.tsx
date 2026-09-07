import { useEffect, useRef } from 'react'
import { gsap, revealChildren, useReducedMotion } from '@/lib/motion'
import { AmbientWash, Eyebrow, Section } from '@/components/ui/Primitives'
import { positioning } from '@/data/content'

/**
 * The statement immediately after the hero — establishes what the company is
 * before any capability detail. Words brighten individually as the line reads,
 * with a short proof row beneath it.
 *
 * The backdrop is a token-driven gradient, never an image: an opaque plate
 * cannot follow the ink scale when the theme inverts, which is what made this
 * section read as a grey band on both grounds.
 */
export function Positioning() {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root.current) return
    const el = root.current

    // Reduced motion: the scrub is what lights the words, so they have to be
    // set to their end state explicitly or the line stays dimmed at 0.12.
    if (reduced) {
      gsap.set(el.querySelectorAll('[data-word], [data-reveal]'), { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      revealChildren(el, '[data-reveal]', { stagger: 0.07 })

      // fromTo, not from: an interrupted tween would otherwise leave the words
      // parked at the start opacity.
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.12 },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'none',
          stagger: 0.035,
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: 'top 72%',
            end: 'bottom 62%',
            scrub: 0.6,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    <Section
      id="company"
      className="relative overflow-hidden border-t border-v-blue-400/12"
      // Through the backdrop slot, not as a child: children render inside the
      // max-w-7xl content column, so a wash placed there is clipped to the
      // text measure and its edge lands hard against the copy.
      backdrop={<AmbientWash from="top-left" hue="blue" />}
    >
      <div ref={root} className="relative">
        <div data-reveal>
          <Eyebrow>{positioning.eyebrow}</Eyebrow>
        </div>

        <p className="text-h2 font-display mt-8 max-w-5xl text-white">
          {`${positioning.lead} ${positioning.rest}`.split(' ').map((w, i) => (
            <span
              key={`${w}-${i}`}
              data-word
              className={`inline-block ${i < positioning.lead.split(' ').length ? 'text-v-crimson-400' : ''}`}
            >
              {w}&nbsp;
            </span>
          ))}
        </p>

        <div
          data-reveal
          className="mt-16 grid gap-4 sm:grid-cols-3"
        >
          {positioning.proof.map((p) => (
            <div
              key={p.value}
              className="group relative card-surface p-8"
            >
              <p className="text-h3 text-white">{p.value}</p>
              <p className="mt-3 text-sm leading-relaxed text-v-ink-400">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
