import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap, revealChildren, useReducedMotion } from '@/lib/motion'
import { Section, Button, Eyebrow } from '@/components/ui/Primitives'

// Code-split, like the hero canvas: Three.js must not reach the critical path.
const VMarkScene = lazy(() =>
  import('./VMarkScene').then((m) => ({ default: m.VMarkScene })),
)

/**
 * Tracks Tailwind's `lg` breakpoint. Not useIsCompact from lib/motion: that one
 * is pinned to 768px and is used to scale 3D instance counts, so it is not the
 * knob for whether this canvas mounts at all.
 */
function useIsWide(): boolean {
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => setWide(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return wide
}

/** Shared closing band. Every page ends somewhere; this is where. */
export function ContactCta({
  title = 'Let us look at your systems together.',
  lead = 'Tell us what you are working on. We will respond with a considered view, not a sales pitch.',
}: {
  title?: string
  lead?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const wide = useIsWide()

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(
      () => revealChildren(el, '[data-cta]', { stagger: 0.09, y: 22, start: 'top 82%' }),
      el,
    )
    return () => ctx.revert()
  }, [])

  return (
    <Section className="border-t border-v-blue-400/10">
      <div
        ref={root}
        className="relative overflow-hidden rounded-[var(--radius-lg)] border border-v-blue-400/15 bg-v-ink-800/40 px-8 py-16 md:px-16 md:py-20"
      >
        {/* Brand wash, kept low so the type stays dominant. */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,color-mix(in_oklab,var(--color-v-crimson-900)_40%,transparent),transparent_65%)]"
          aria-hidden="true"
        />
        {/* A second wash from the opposite corner, so the panel is lit from
            two sides and does not fall flat across the middle. */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--color-v-blue-800)_32%,transparent),transparent_58%)]"
          aria-hidden="true"
        />
        {/* Brand edge along the top of the panel. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-v-crimson-500 via-v-blue-500 to-transparent"
        />
        {/* Copy left, turning mark right — the panel runs full width while the
            copy caps at max-w-2xl, which left the right side empty. */}
        <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <div className="max-w-2xl">
            <div data-cta>
              <Eyebrow>Next step</Eyebrow>
            </div>
            <h2 data-cta className="text-h1 mt-6 text-white">
              {title}
            </h2>
            <p data-cta className="text-lead mt-6 text-v-ink-300">
              {lead}
            </p>
            <div data-cta className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/contact">Start a Conversation</Button>
              <Button href="/services" variant="ghost">
                See What We Build
              </Button>
            </div>
          </div>

          {/* Shown from lg up: stacked under the buttons on narrow screens it
              would only push the CTA down.

              Mounted conditionally rather than hidden with `hidden lg:block`:
              R3F measures its container once, and a canvas that mounts inside a
              display:none box measures zero and never recovers — the media query
              flipping to block fires no resize event. */}
          {wide && (
            <div data-cta className="h-[20rem]" aria-hidden="true">
              <Suspense fallback={null}>
                <VMarkScene reducedMotion={reduced} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
