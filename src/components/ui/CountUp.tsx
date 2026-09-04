import { useEffect, useRef } from 'react'

import { gsap, useReducedMotion } from '@/lib/motion'

/**
 * Counts a metric up to its value when it scrolls into view.
 *
 * Takes the already-formatted string from content.ts ("250", "85%", "600+",
 * "2004") rather than a number plus a format prop: the copy stays one readable
 * value in one place, and this splits off whatever prefix/suffix it carries so
 * the symbols hold still while only the digits run.
 */
export function CountUp({
  value,
  className = '',
  duration = 1.6,
}: {
  value: string
  className?: string
  duration?: number
}) {
  const el = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const node = el.current
    if (!node) return

    // Split "600+" into "600" and "+". Anything without digits (an em dash, a
    // word) has nothing to count and is left exactly as authored.
    const match = value.match(/^(\D*)([\d.,]+)(.*)$/s)
    if (!match) {
      node.textContent = value
      return
    }
    const [, prefix, digits, suffix] = match
    const target = parseFloat(digits.replace(/,/g, ''))
    if (!Number.isFinite(target)) {
      node.textContent = value
      return
    }

    // A year is a label, not a quantity — counting from 0 to 2004 reads as a
    // stopwatch and the thousands separator would make it "2,004".
    const isYear = !prefix && !suffix && /^\d{4}$/.test(digits) && target > 1900
    const decimals = (digits.split('.')[1] || '').length
    const grouped = digits.includes(',')

    if (reduced || isYear) {
      node.textContent = value
      return
    }

    const counter = { n: target }
    const write = () => {
      const shown = counter.n.toFixed(decimals)
      node.textContent =
        prefix + (grouped ? Number(shown).toLocaleString('en-US') : shown) + suffix
    }

    // Deliberately no write() here. Zeroing the text on mount is what makes a
    // stalled or never-firing trigger leave "0%" on screen forever — the number
    // must hold its real value until the tween itself starts counting.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        counter,
        { n: 0 },
        {
          n: target,
          duration,
          ease: 'power2.out',
          onUpdate: write,
          // fromTo + immediateRender:false, as everywhere else here: the start
          // state is not applied until the trigger actually runs, so a reader
          // who lands below this never sees it parked at zero.
          immediateRender: false,
          scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        },
      )
    }, node)

    return () => {
      ctx.revert()
      // ctx.revert() restores the pre-tween DOM, which for a text node we
      // rewrote by hand means the "0" start state. Put the real value back.
      node.textContent = value
    }
  }, [value, duration, reduced])

  // Rendered with the final value so it is correct before hydration, with no
  // layout shift when the count starts.
  return (
    <span ref={el} className={className}>
      {value}
    </span>
  )
}
