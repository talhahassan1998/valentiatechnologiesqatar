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
    'group relative inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300'

  const styles =
    variant === 'primary'
      ? 'bg-v-blue-600 text-on-brand hover:bg-v-blue-500 shadow-[0_8px_30px_-8px_var(--color-v-blue-600)]'
      : 'border border-v-ink-500/60 text-v-ink-100 hover:border-v-blue-400 hover:text-white'

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
      {lead && (
        <p data-heading-lead className="text-lead text-v-ink-300">
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
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`relative px-6 py-24 md:px-12 md:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--color-v-blue-900)/35%,transparent_60%)]"
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
