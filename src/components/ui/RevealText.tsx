import { useEffect, useRef } from 'react'

import { gsap, useReducedMotion } from '@/lib/motion'

/**
 * Line-by-line masked reveal: each line sits in an overflow-hidden box and
 * slides up from below it, so text appears to emerge from behind an edge.
 * The same move the hero headline already uses, factored out for reuse.
 *
 * Lines are passed explicitly rather than measured from wrapped text — a
 * measuring split would need re-running on every resize and font swap, which
 * is a lot of machinery for headings we control the breaks of anyway.
 */
export function RevealText({
  lines,
  as = 'h2',
  className = '',
  accentLast = false,
  start = 'top 80%',
}: {
  lines: string[]
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  className?: string
  /** Render the final line in crimson — the house emphasis. */
  accentLast?: boolean
  start?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root.current) return
    const el = root.current

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('[data-line]', { yPercent: 0 })
        return
      }
      gsap.from('[data-line]', {
        yPercent: 110,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start, once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [reduced, start])

  const inner = lines.map((line, i) => (
    <span key={`${line}-${i}`} className="block overflow-hidden">
      <span
        data-line
        className={`block ${
          accentLast && i === lines.length - 1 ? 'text-v-crimson-400' : ''
        }`}
      >
        {line}
      </span>
    </span>
  ))

  // Rendered explicitly rather than through a polymorphic tag: the union of
  // every intrinsic element's props collapses to `never`, and the workarounds
  // cost more than five lines of JSX.
  return (
    <div ref={root}>
      {as === 'h1' && <h1 className={className}>{inner}</h1>}
      {as === 'h2' && <h2 className={className}>{inner}</h2>}
      {as === 'h3' && <h3 className={className}>{inner}</h3>}
      {as === 'p' && <p className={className}>{inner}</p>}
      {as === 'div' && <div className={className}>{inner}</div>}
    </div>
  )
}
