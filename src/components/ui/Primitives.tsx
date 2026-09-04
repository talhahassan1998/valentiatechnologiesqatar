import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap, useReducedMotion } from '@/lib/motion'

type ButtonProps = {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'ghost'
  className?: string
}

export function Button({
  children,
  href = '#',
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const base =
    'btn-press group relative inline-flex items-center gap-2.5 rounded-[var(--radius-md)] px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300'

  // The filled button carries the sheen sweep; the ghost gets a brand-tinted
  // wash instead, so the two read as one family without the ghost pretending
  // to be a solid fill. Both lift on hover — the shadow is what sells it.
  const styles =
    variant === 'primary'
      ? 'btn-sheen bg-v-blue-600 text-on-brand hover:bg-v-blue-500 shadow-[0_8px_30px_-8px_var(--color-v-blue-600)] hover:shadow-[0_14px_38px_-10px_var(--color-v-blue-500)] hover:-translate-y-0.5'
      : 'border border-v-ink-500/60 text-v-ink-100 hover:border-v-blue-400 hover:bg-v-blue-600/10 hover:text-white hover:-translate-y-0.5'

  // Internal hrefs must route, not reload — fixed here rather than at every
  // call site, since all buttons funnel through this one component.
  const internal = href.startsWith('/')
  const cls = `${base} ${styles} ${className}`
  const inner = (
    <>
      <span>{children}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        <path
          d="M1 7h11M8 3l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  )

  return internal ? (
    <Link to={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {inner}
    </a>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      {/* The V-fold, reduced to a small mark. */}
      <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
        <path d="M1 1L7 11L13 1" stroke="var(--color-v-crimson-500)" strokeWidth="2" />
      </svg>
      <span className="text-eyebrow font-mono uppercase text-v-blue-300">
        {children}
      </span>
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
}: {
  eyebrow?: string
  title: ReactNode
  lead?: string
  align?: 'left' | 'center'
}) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start'
  const head = useRef<HTMLDivElement>(null)
  const reducedHead = useReducedMotion()

  useEffect(() => {
    if (!head.current) return
    const el = head.current
    const ctx = gsap.context(() => {
      if (reducedHead) return
      // One timeline so the eyebrow, title and lead arrive as a sequence
      // rather than three independent triggers landing at the same instant.
      //
      // immediateRender:false on every tween, for the same reason
      // revealChildren sets it: the start state must not be written until the
      // trigger actually runs, or a heading the reader lands *below* (deep
      // link, refresh mid-page, scroll restore) is pinned at opacity 0 by a
      // trigger whose start is already behind them.
      const tl = gsap.timeline({
        defaults: { immediateRender: false },
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      })
      tl.fromTo(
        '[data-heading-eyebrow]',
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
      )
        .fromTo(
          '[data-heading-line]',
          { yPercent: 110 },
          { yPercent: 0, duration: 1, ease: 'power3.out' },
          '-=0.4',
        )
        .fromTo(
          '[data-heading-lead]',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.65',
        )
    }, el)
    return () => ctx.revert()
  }, [reducedHead])

  return (
    <div ref={head} className={`flex flex-col gap-5 ${alignment} max-w-3xl`}>
      {eyebrow && (
        <div data-heading-eyebrow>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2 className="text-h2 overflow-hidden text-white">
        <span data-heading-line className="block">{title}</span>
      </h2>
      {/* Short brand rule under the title. Anchors the heading block and gives
          the eye a stop between title and lead, which previously ran together
          at large sizes. Animates with the lead so it is not a third trigger. */}
      <span
        data-heading-lead
        aria-hidden="true"
        className={`h-px w-16 bg-gradient-to-r from-v-crimson-500 to-v-blue-500 ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
      {lead && (
        <p data-heading-lead className="text-lead max-w-2xl text-v-ink-300">
          {lead}
        </p>
      )}
    </div>
  )
}

export function Section({
  children,
  className = '',
  id,
  backdrop,
}: {
  children: ReactNode
  className?: string
  id?: string
  /**
   * Full-bleed layers painted behind the content — AmbientWash,
   * SectionDivider. They belong here rather than in `children`: children are
   * wrapped in the max-w-7xl content column, so a backdrop passed there is
   * clipped to the text measure and its edge lands exactly on the copy, with
   * no margin between the two.
   */
  backdrop?: ReactNode
}) {
  return (
    <section id={id} className={`relative px-6 py-24 md:px-12 md:py-32 ${className}`}>
      {backdrop}
      {/* relative, so section content always stacks above the backdrop —
          those are absolutely positioned siblings, and without a stacking
          context here they would paint over the copy rather than behind it. */}
      <div className="relative mx-auto max-w-7xl">{children}</div>
    </section>
  )
}

/**
 * Ambient corner wash. Six homepage sections in a row sat on flat ink-900 with
 * only a hairline between them, which read as one long band on the scroll.
 * This is the same device Positioning and the CTA panel already use, lifted
 * into one component so the alternating rhythm is declared rather than
 * re-typed — and so it stays a token-driven gradient, never an image: an
 * opaque plate cannot follow the ink scale when the theme inverts.
 *
 * `from` picks the lit corner. Alternating it down the page is what separates
 * one section from the next.
 */
export function AmbientWash({
  from = 'top-left',
  hue = 'blue',
}: {
  from?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  hue?: 'blue' | 'crimson'
}) {
  // Written out in full, never interpolated: Tailwind scans source text for
  // complete class names, so a template-built arbitrary value compiles to
  // nothing. Crimson is the accent and is held lower than blue — at equal
  // strength it pulls focus from the copy.
  const WASH = {
    'blue:top-left':
      'bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--color-v-blue-900)_22%,transparent),transparent_60%)]',
    'blue:top-right':
      'bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklab,var(--color-v-blue-900)_22%,transparent),transparent_60%)]',
    'blue:bottom-left':
      'bg-[radial-gradient(ellipse_at_bottom_left,color-mix(in_oklab,var(--color-v-blue-900)_22%,transparent),transparent_60%)]',
    'blue:bottom-right':
      'bg-[radial-gradient(ellipse_at_bottom_right,color-mix(in_oklab,var(--color-v-blue-900)_22%,transparent),transparent_60%)]',
    'crimson:top-left':
      'bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--color-v-crimson-900)_14%,transparent),transparent_60%)]',
    'crimson:top-right':
      'bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklab,var(--color-v-crimson-900)_14%,transparent),transparent_60%)]',
    'crimson:bottom-left':
      'bg-[radial-gradient(ellipse_at_bottom_left,color-mix(in_oklab,var(--color-v-crimson-900)_14%,transparent),transparent_60%)]',
    'crimson:bottom-right':
      'bg-[radial-gradient(ellipse_at_bottom_right,color-mix(in_oklab,var(--color-v-crimson-900)_14%,transparent),transparent_60%)]',
  } as const

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${WASH[`${hue}:${from}`]}`}
    />
  )
}

/**
 * Section seam: a hairline carrying the logo's own colour transition — blue
 * into crimson, the two hue anchors sampled from the mark — fading to nothing
 * at both ends so the boundary reads as a soft join rather than the hard
 * full-bleed rule the border-t alone gives.
 *
 * Deliberately no V mark here. The fold is the logo, and repeating it at every
 * section boundary cheapened it — it stays reserved for the footer, the
 * eyebrow and the nav indicator, where it means something. The colour carries
 * the brand instead of the shape.
 */
export function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
    >
      {/* Both hues sit at full strength in the middle third and fall away to
          transparent, so neither end terminates in a visible stub. */}
      <span className="h-px w-full max-w-4xl bg-[linear-gradient(to_right,transparent,var(--color-v-blue-500)_28%,var(--color-v-crimson-500)_72%,transparent)] opacity-70" />
    </div>
  )
}

/**
 * Compact page header for the non-home routes. The homepage has the 3D hero;
 * these pages need the same opening shape without it.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string
  title: ReactNode
  lead: string
}) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => {
      if (reduced) return
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        // fromTo, not from: an interrupted `from` leaves the element at the
        // start state — here, header copy stuck at opacity 0.
        .fromTo('[data-pagehero-line]', { yPercent: 110 }, { yPercent: 0, duration: 1 })
        .fromTo(
          '[data-pagehero-fade]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          '-=0.55',
        )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={root} className="relative overflow-hidden border-b border-v-blue-400/10 px-6 pb-20 pt-36 md:px-12 md:pb-28 md:pt-44">
      {/* Ambient wash so the header does not read as a flat band. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--color-v-blue-900)_35%,transparent),transparent_60%)]"
        aria-hidden="true"
      />
      {/* A crimson counterweight on the opposite side, so the header is lit
          from both brand hues rather than reading as a single blue corner. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,color-mix(in_oklab,var(--color-v-crimson-900)_22%,transparent),transparent_55%)]"
        aria-hidden="true"
      />
      {/* Hairline grid, at very low alpha. Gives the band a sense of surface
          — the same engineered texture the hero canvas carries — without
          competing with the type. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,var(--color-v-blue-400)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-v-blue-400)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl">
        <div data-pagehero-fade>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1 className="text-h1 mt-6 max-w-4xl overflow-hidden text-white">
          <span data-pagehero-line className="block">{title}</span>
        </h1>
        <p data-pagehero-fade className="text-lead mt-6 max-w-2xl text-v-ink-300">
          {lead}
        </p>
      </div>
    </section>
  )
}
