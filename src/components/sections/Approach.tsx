import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, revealChildren, useReducedMotion } from '@/lib/motion'
import { Section, SectionHeading } from '@/components/ui/Primitives'
import { CountUp } from '@/components/ui/CountUp'
import { approach, metrics } from '@/data/content'

/**
 * The four steps are a sequence, so they are animated as one: a rail fills
 * through them as the section scrolls, and each step lights up as the fill
 * reaches it — number, rule and copy together.
 *
 * fromTo throughout, never from: an interrupted `from` leaves elements at the
 * start state, which here would mean permanently invisible copy.
 */
export function Approach() {
  const root = useRef<HTMLDivElement>(null)
  const metricsBand = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root.current) return
    const el = root.current

    // Reduced motion: everything visible, no rail, no scrubbing.
    if (reduced) {
      gsap.set('[data-step], [data-step-num], [data-step-body]', { opacity: 1, y: 0 })
      gsap.set('[data-rail-fill]', { scaleX: 1 })
      if (metricsBand.current) {
        gsap.set(metricsBand.current.children, { opacity: 1, y: 0 })
      }
      return
    }

    const ctx = gsap.context(() => {
      revealChildren(el, '[data-step]', { stagger: 0.1 })

      // The metrics band has its own root, so it reveals on its own trigger
      // rather than with the steps far above it.
      if (metricsBand.current) {
        revealChildren(metricsBand.current, ':scope > *', { stagger: 0.07 })
      }

      // The rail fills across the row as the section passes through view.
      gsap.fromTo(
        '[data-rail-fill]',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 72%',
            end: 'bottom 68%',
            scrub: 0.5,
          },
        },
      )

      // Each step activates as the fill reaches it: the number brightens and
      // its rule draws out. Staggered by position so they fire in order.
      const steps = gsap.utils.toArray<HTMLElement>('[data-step]')
      steps.forEach((step, i) => {
        const num = step.querySelector('[data-step-num]')
        const rule = step.querySelector('[data-step-rule]')
        gsap
          .timeline({
            scrollTrigger: {
              // Anchored to the step itself, and `once` so arriving from
              // below (or landing mid-section on load) can never leave a
              // step stuck at its start state.
              trigger: step,
              start: 'top 88%',
              once: true,
            },
            delay: i * 0.08,
          })
          .fromTo(
            num,
            { opacity: 0.25, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', immediateRender: false },
          )
          .fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.7, ease: 'power3.out', immediateRender: false },
            '-=0.35',
          )
      })
      // Triggers cache pixel offsets at creation. On a direct load the
      // section's own fonts and grid settle after that, so a start computed
      // here can sit above the reader's actual position and never fire —
      // leaving the fromTo start state (invisible copy) on screen.
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, el)

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === el)
        .forEach((t) => t.kill())
      ctx.revert()
    }
  }, [reduced])

  return (
    <Section id="approach" className="border-t border-v-blue-400/10">
      <SectionHeading
        eyebrow="How we work"
        title="Engineering discipline, applied to care"
        lead="Healthcare software fails when it is built at a distance from the clinical floor. Our process closes that distance."
      />

      <div ref={root} className="relative mt-16">
        {/* Rail behind the row, filling left to right as the steps activate. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[7px] z-0 hidden h-px bg-v-blue-400/12 lg:block"
          aria-hidden="true"
        >
          <div
            data-rail-fill
            className="h-px origin-left scale-x-0 bg-gradient-to-r from-v-crimson-500 via-v-blue-500 to-v-blue-400"
          />
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {approach.map((a, i) => (
          <div key={a.step} data-step className="relative">
            <div className="flex items-center gap-3">
              <span
                data-step-num
                className="text-eyebrow relative z-10 bg-v-ink-900 pr-2 font-mono text-v-crimson-400"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                data-step-rule
                className="h-px flex-1 origin-left bg-v-blue-400/20"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-h3 mt-5 text-white">{a.step}</h3>
            <p className="mt-3 text-sm leading-relaxed text-v-ink-300">{a.body}</p>
          </div>
        ))}
        </div>
      </div>

      {/* Metrics band. Has its own reveal root: it sits outside the steps'
          root, so it was never faded in, and it has no step number or rule to
          drive, so it must not join the [data-step] timeline. */}
      <div
        ref={metricsBand}
        className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {metrics.map((m) => (
          <div
            key={m.label}
            className="group relative card-surface p-8"
          >
            <div className="text-h2 font-display text-white">
              <CountUp value={m.value} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-v-ink-400">{m.label}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
