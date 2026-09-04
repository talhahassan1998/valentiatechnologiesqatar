import { lazy, Suspense, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Primitives'
import { gsap, useReducedMotion } from '@/lib/motion'
import { CURTAIN_UP, curtainIsUp } from '@/components/ui/Preloader'

// Three.js is ~275KB gzip; keep it out of the critical path so the headline
// paints immediately and the scene fades in behind it.
const HeroScene = lazy(() =>
  import('./HeroScene').then((m) => ({ default: m.HeroScene })),
)

/**
 * Single-viewport hero. The 3D scene sits behind a caption that cycles on a
 * timer: kicker and headline swap together, while the CTA buttons stay fixed
 * below them so the primary actions never move or disappear.
 *
 * Previously this pinned for 3.4 viewports and scrubbed the captions against
 * scroll. The pin is gone, so the hero is now one ordinary 100svh section and
 * the page scrolls straight into the next one. `progress` is still written —
 * HeroScene reads it per-frame for the camera push and the network rig — but
 * it is now driven by the caption loop rather than by scroll, so the scene
 * still moves through its four beats.
 */

type Caption = {
  kicker: string
  line: string
}

const CAPTIONS: Caption[] = [
  {
    kicker: 'Healthcare Software Engineering · Qatar',
    line: 'Engineering Better Healthcare.',
  },
  { kicker: 'Interoperability', line: 'Every system, one language.' },
  { kicker: 'Clinical Intelligence', line: 'Data that reaches the bedside.' },
  { kicker: 'Built in Qatar', line: 'Built for Qatar.' },
]

/** Seconds a caption holds before the next one takes over. */
const HOLD = 3.6

export function Hero() {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const capRefs = useRef<(HTMLDivElement | null)[]>([])
  const progress = useRef(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root.current) return

    // Reduced motion: no loop. The first caption stands alone as static copy —
    // an auto-advancing carousel is exactly what this preference asks us not to
    // run, and stacking all four would read as four competing headlines.
    if (reduced) {
      progress.current = 0
      capRefs.current.forEach((el, i) => {
        if (!el) return
        el.style.opacity = i === 0 ? '1' : '0'
        el.style.transform = 'none'
      })
      // The entrance timeline never runs here, so the copy it would have
      // revealed has to be shown outright — otherwise the kicker and the
      // buttons sit at their pre-entrance state forever.
      const el = root.current
      el.querySelectorAll<HTMLElement>('[data-enter-fade], [data-hero-cta]').forEach((n) => {
        n.style.opacity = '1'
        n.style.transform = 'none'
      })
      return
    }

    const ctx = gsap.context(() => {
      // Opening caption rises as the curtain lifts. Only the first caption
      // animates in — the rest are driven by scroll.
      let entrance: gsap.core.Timeline | null = null
      const playEntrance = () => {
        if (entrance) return
        // fromTo, not from: an interrupted `from` (a throttled tab, an early
        // kill) leaves the element parked at the start state, which here means
        // the headline stranded below its overflow-hidden mask. fromTo always
        // names the resting state, so the worst case is a snap, not a
        // permanently hidden headline.
        entrance = gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .fromTo(
            '[data-hero-enter] [data-enter-line]',
            { yPercent: 115 },
            { yPercent: 0, duration: 1.05, stagger: 0.08 },
          )
          .fromTo(
            // The CTA now lives outside the cycling caption, so it is named
            // here explicitly — otherwise it would never be faded in.
            ['[data-hero-enter] [data-enter-fade]', '[data-hero-cta]'],
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 },
            '-=0.6',
          )
      }
      // Curtain may already be up — the event is one-shot, so read the latch
      // rather than waiting 2.6s on the fallback with the copy still hidden.
      if (curtainIsUp()) playEntrance()
      else window.addEventListener(CURTAIN_UP, playEntrance, { once: true })
      // Fallback so the copy is never left hidden if the curtain never signals.
      const fallback = window.setTimeout(playEntrance, 2600)

      // The caption cycle. Each step fades the outgoing line up and out, then
      // brings the next one up into place — the same fade-and-rise language the
      // rest of the site uses for reveals.
      //
      // The first caption is skipped on the opening pass: the entrance timeline
      // above already put it on screen, and re-animating it would replay the
      // headline the reader just watched arrive.
      const loop = gsap.timeline({ repeat: -1 })

      CAPTIONS.forEach((_, i) => {
        const el = capRefs.current[i]
        const next = capRefs.current[(i + 1) % CAPTIONS.length]
        if (!el || !next) return

        // The hold is expressed as position-relative padding, not a tween on a
        // dummy object: `to({}, …)` has no animatable property, so GSAP treats
        // it as a no-op and the timeline never waits.
        loop.to(el, { opacity: 0, y: -24, duration: 0.55, ease: 'power2.in' }, `+=${HOLD}`)
        loop.fromTo(
          next,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.25',
        )
        // Drive the scene's four beats from the caption index, so the camera
        // push and the network rig still advance without a scroll to read.
        loop.to(
          progress,
          {
            current: ((i + 1) % CAPTIONS.length) / (CAPTIONS.length - 1),
            duration: 0.9,
            ease: 'power2.inOut',
          },
          '<',
        )
      })

      // Opening state: first caption visible, the rest waiting.
      capRefs.current.forEach((el, i) => {
        if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0, y: 0 })
      })

      return () => {
        window.removeEventListener(CURTAIN_UP, playEntrance)
        window.clearTimeout(fallback)
        // Jump to the end before killing, so a teardown mid-entrance cannot
        // leave the copy stranded off-position.
        entrance?.progress(1).kill()
        loop.kill()
      }
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={root} className="force-dark relative bg-v-ink-900">
      <div
        ref={stage}
        data-hero-stage
        className="h-[100svh] w-full overflow-hidden"
      >
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <HeroScene progress={progress} />
          </Suspense>
        </div>

        {/* Legibility scrim — keeps type readable over the 3D without
            flattening it. Weighted left, where the captions sit. */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-v-ink-900 via-v-ink-900/80 via-40% to-transparent to-72%"
          aria-hidden="true"
        />

        {/* The canvas ends flush with the section below, which reads as a
            hard cut through the 3D. Fade the last strip into the page ground. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-v-ink-900"
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="mx-auto w-full max-w-7xl">
            {/* Fixed-height stage for the cycling copy. The captions are
                absolutely positioned so they cross-fade in place; the height is
                reserved here so the buttons below never shift as lines of
                different lengths wrap differently. */}
            <div
              className="relative max-w-2xl"
              style={{ minHeight: 'clamp(9rem, 15vw, 13.5rem)' }}
              // The copy swaps on a timer without the reader acting, so
              // announce changes politely rather than interrupting.
              aria-live="polite"
            >
              {CAPTIONS.map((c, i) => (
                <div
                  key={c.line}
                  ref={(el) => {
                    capRefs.current[i] = el
                  }}
                  className="absolute inset-x-0 top-0"
                  style={{ opacity: 0 }}
                  {...(i === 0 ? { 'data-hero-enter': '' } : {})}
                >
                  <div data-enter-fade className="mb-5 flex items-center gap-3">
                    <svg width="16" height="14" viewBox="0 0 14 12" fill="none" aria-hidden="true">
                      <path d="M1 1L7 11L13 1" stroke="var(--color-v-crimson-500)" strokeWidth="2" />
                    </svg>
                    <span className="text-eyebrow font-mono uppercase text-v-blue-300">
                      {c.kicker}
                    </span>
                  </div>

                  {i === 0 ? (
                    <h1 className="text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-white">
                      <span className="block overflow-hidden">
                        <span data-enter-line className="block">
                          {c.line}
                        </span>
                      </span>
                    </h1>
                  ) : (
                    <p className="text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-white">
                      {c.line}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Outside the cycling stage: the primary actions stay put. */}
            <div data-hero-cta className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/services">Explore Our Technology</Button>
              <Button href="/contact" variant="ghost">
                Let&rsquo;s Talk
              </Button>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-8 left-0 right-0 px-6 md:px-12"
          aria-hidden="true"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-v-blue-600/50 to-transparent" />
            <span className="text-eyebrow font-mono uppercase text-v-ink-400">Scroll</span>
          </div>
        </div>
      </div>
    </div>
  )
}
