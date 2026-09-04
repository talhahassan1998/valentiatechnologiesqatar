import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, useReducedMotion } from '@/lib/motion'
import { AmbientWash, Section, SectionDivider, SectionHeading } from '@/components/ui/Primitives'
import { partners, partnersIntro } from '@/data/content'
import { asset } from '@/lib/asset'

/**
 * Technology partners — a centre-focused carousel.
 *
 * The focused card sits upright and lit while its neighbours recede: dimmed,
 * scaled down, and desaturated. That contrast is the whole effect, so the
 * card's own copy is the only thing that needs to move — the track is a plain
 * translated row, not a per-card animation.
 *
 * Position is the single source of truth: `active` is the index at the centre,
 * every card derives its own scale/opacity from its distance to it, and the
 * track is translated so that index lands under the midpoint. Nothing is
 * animated imperatively, so an interrupted transition cannot strand a card.
 */

const CYCLE_MS = 3600
/** Cards rendered either side of the focused one before they are clipped. */
const NEIGHBOURS = 2

export function Partners() {
  const root = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  // Card width and rail width, measured. Both start at 0, which renders the
  // rail unshifted — the correct first frame, since card 0 is already leftmost.
  const [metrics, setMetrics] = useState({ card: 0, rail: 0 })
  const paused = useRef(false)
  const reduced = useReducedMotion()
  const count = partners.length

  // Re-measure on resize, because `--per` changes at the breakpoints and the
  // offset is in pixels. ResizeObserver rather than a resize listener: the
  // rail also changes width when a scrollbar appears or the layout settles
  // after fonts load, neither of which fires a window resize.
  useEffect(() => {
    const railEl = rail.current
    const firstCard = track.current?.firstElementChild
    if (!railEl || !firstCard) return
    const measure = () =>
      setMetrics({
        card: firstCard.getBoundingClientRect().width,
        rail: railEl.getBoundingClientRect().width,
      })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(railEl)
    return () => ro.disconnect()
  }, [])

  // Put the active card's centre on the rail's centre.
  const offset = metrics.card
    ? -active * metrics.card + (metrics.rail - metrics.card) / 2
    : 0

  // Wrap in both directions so the arrows and the timer share one path.
  const go = useCallback(
    (delta: number) => setActive((i) => (i + delta + count) % count),
    [count],
  )

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(el.querySelectorAll('[data-rail]'), { opacity: 1, y: 0 })
        return
      }
      // fromTo, not from: an interrupted `from` would leave the rail invisible.
      gsap.fromTo(
        el.querySelectorAll('[data-rail]'),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top 78%', once: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  // Auto-advance. Paused on hover/focus so a reader inspecting one partner is
  // not carried off it, and skipped entirely under reduced motion.
  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      if (!paused.current) go(1)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [reduced, go])

  // Keyboard: the rail is a focusable group, so arrow keys move it.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    }
  }

  return (
    <Section id="partners" className="relative overflow-hidden scroll-mt-24"
      backdrop={
        <>
          <AmbientWash from="top-right" hue="blue" />
          <SectionDivider />
        </>
      }
    >
      <div className="flex flex-wrap items-end justify-between gap-8">
        <SectionHeading
          eyebrow="Who we build on"
          title="Technology partners"
          lead={partnersIntro}
        />

        {/* Controls sit with the heading, not over the rail, so they never
            cover a logo on narrow viewports. */}
        <div className="flex items-center gap-3">
          <CarouselButton label="Previous partner" onClick={() => go(-1)} direction="prev" />
          <CarouselButton label="Next partner" onClick={() => go(1)} direction="next" />
        </div>
      </div>

      <div
        ref={root}
        className="mt-16"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocusCapture={() => (paused.current = true)}
        onBlurCapture={() => (paused.current = false)}
      >
        {/* The viewport. Masked at both edges so cards dissolve rather than
            being cut off by a hard boundary. */}
        <div
          data-rail
          role="group"
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label="Technology partners"
          onKeyDown={onKeyDown}
          ref={rail}
          className="partner-rail relative overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
        >
          <div
            ref={track}
            className="flex items-stretch transition-transform duration-700 ease-[var(--ease-brand)] motion-reduce:transition-none"
            // Pixels, measured — see the note in index.css. A percentage here
            // would resolve against the track's own (7-card) width.
            style={{ transform: `translateX(${offset}px)` }}
          >
            {partners.map((p, i) => {
              const distance = Math.abs(i - active)
              const isActive = i === active
              return (
                <article
                  key={p.name}
                  aria-hidden={distance > NEIGHBOURS}
                  className={`partner-card px-3 transition-all duration-700 ease-[var(--ease-brand)] motion-reduce:transition-none ${
                    isActive
                      ? 'scale-100 opacity-100'
                      : distance === 1
                        ? 'scale-90 opacity-45'
                        : 'scale-90 opacity-20'
                  }`}
                >
                  <PartnerCard partner={p} index={i} focused={isActive} />
                </article>
              )
            })}
          </div>
        </div>

        {/* Progress: one tick per partner, the focused one drawn out in the
            brand gradient. Clickable, so the rail is navigable without the
            arrows. */}
        <div data-rail className="mt-10 flex items-center justify-center gap-2">
          {partners.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${p.name}`}
              aria-current={i === active}
              className="group/tick py-2"
            >
              <span
                className={`block h-px rounded-full transition-all duration-500 ease-[var(--ease-brand)] ${
                  i === active
                    ? 'w-10 bg-gradient-to-r from-v-blue-500 to-v-crimson-500'
                    : 'w-5 bg-v-blue-400/25 group-hover/tick:bg-v-blue-400/60'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </Section>
  )
}

/**
 * One partner. The logo plate stays white in both themes — the supplied PNGs
 * are opaque artwork on white and would sit on a visible box otherwise.
 */
function PartnerCard({
  partner,
  index,
  focused,
}: {
  partner: (typeof partners)[number]
  index: number
  focused: boolean
}) {
  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border transition-all duration-700 ease-[var(--ease-brand)] motion-reduce:transition-none ${
        focused
          ? 'border-v-blue-400/30 bg-v-ink-800 shadow-[0_28px_60px_-30px_var(--color-v-blue-950)]'
          : 'border-v-blue-400/12 bg-v-ink-900'
      }`}
    >
      {/* Brand edge, drawn only on the focused card — the same device the
          section dividers and the CTA panel use. */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-v-blue-500 to-v-crimson-500 transition-opacity duration-700 ${
          focused ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Taller plate with tighter gutters, so the mark is the thing you see.
          The logos are 324x144 artwork; capping the height well under that
          left them floating at about a third of the plate width. */}
      {/* Square by design — the card above clips it with overflow-hidden, so
          the plate inherits the card's corners without its own radius. */}
      <div className="flex h-40 items-center justify-center bg-on-brand px-5 py-5">
        <img
          src={asset(partner.logo)}
          alt={partner.name}
          width="324"
          height="144"
          // Seven logos totalling ~40 KB, all needed within one cycle of the
          // section appearing: lazy-loading here makes the rail advance to an
          // undecoded image and the plate flashes empty.
          loading="eager"
          decoding="async"
          // object-contain against both axes: the mark scales up to fill the
          // plate but never crops or distorts, whatever its aspect ratio.
          className={`h-full w-full object-contain transition-all duration-700 ${
            focused ? 'grayscale-0' : 'grayscale'
          }`}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-3">
          <span className="text-eyebrow font-mono text-v-blue-400">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-h3 text-white">{partner.name}</h3>
        </div>
        <p className="text-sm leading-relaxed text-v-ink-300">{partner.body}</p>
      </div>
    </div>
  )
}

function CarouselButton({
  label,
  onClick,
  direction,
}: {
  label: string
  onClick: () => void
  direction: 'prev' | 'next'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      // 44px, so it clears the touch-target minimum without a padding overlay.
      className="btn-press flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-v-blue-400/20 text-v-ink-300 transition-all duration-300 hover:border-v-blue-400 hover:bg-v-blue-600/10 hover:text-white"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d={direction === 'prev' ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
