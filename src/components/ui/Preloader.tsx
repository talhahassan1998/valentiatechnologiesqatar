import { useEffect, useRef, useState } from 'react'
import { gsap, useReducedMotion } from '@/lib/motion'

/**
 * Entry curtain with a counter, exiting on a V-fold wipe.
 *
 * Shown once per session, not per route: a curtain on every navigation would
 * be an obstacle rather than an entrance. Under reduced motion it never
 * mounts at all.
 */
const SEEN_KEY = 'valentia:entered'

/** Fired when the curtain is gone, so the hero can start its entrance. */
export const CURTAIN_UP = 'valentia:curtain-up'

/**
 * Latched, not fire-and-forget. HeroScene is lazy-loaded, so on a cold first
 * load the Three.js chunk can still be downloading when the curtain lifts — a
 * plain event would fire into an empty room and leave the scene frozen at its
 * pre-entrance pose (tiny, spun, camera parked far back). Late subscribers
 * read the flag instead of missing the edge.
 */
let curtainUp = false
export const curtainIsUp = () => curtainUp
const announce = () => {
  if (curtainUp) return
  curtainUp = true
  window.dispatchEvent(new Event(CURTAIN_UP))
}

export function Preloader() {
  const reduced = useReducedMotion()
  const [done, setDone] = useState(
    () => reduced || sessionStorage.getItem(SEEN_KEY) === '1',
  )
  const root = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (done) {
      // Curtain skipped this visit — release the hero immediately.
      const id = requestAnimationFrame(announce)
      return () => cancelAnimationFrame(id)
    }
    if (!root.current) return
    const el = root.current

    // Lock scroll while the curtain is up.
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Safety net: the curtain locks scroll and covers the page, so it must
    // never be able to stick. rAF is suspended in a background tab, which
    // stalls the GSAP timeline indefinitely — if that happens, drop the
    // curtain rather than trapping the reader behind it.
    const bail = window.setTimeout(() => {
      sessionStorage.setItem(SEEN_KEY, '1')
      setDone(true)
      announce()
    }, 5000)

    const ctx = gsap.context(() => {
      const counter = { v: 0 }
      gsap
        .timeline()
        .to(counter, {
          v: 100,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (countRef.current) {
              countRef.current.textContent = String(Math.round(counter.v))
            }
          },
        })
        .to('[data-pre-label]', { opacity: 0, duration: 0.25 }, '-=0.15')
        .to('[data-pre-line]', {
          scaleX: 1,
          duration: 0.5,
          ease: 'power3.inOut',
        }, '-=0.2')
        // The V-fold wipe: the logo geometry doing the exit.
        .to(el, {
          clipPath: 'polygon(0 0, 100% 0, 100% 0, 50% 0, 0 0)',
          duration: 0.9,
          ease: 'power3.inOut',
          onComplete: () => {
            sessionStorage.setItem(SEEN_KEY, '1')
            setDone(true)
            announce()
          },
        })
    }, el)

    return () => {
      window.clearTimeout(bail)
      ctx.revert()
      document.body.style.overflow = prev
    }
  }, [done])

  if (done) return null

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-v-ink-950 px-6 py-8 md:px-12"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 100%, 0 100%)' }}
      aria-hidden="true"
    >
      <div className="flex justify-center pt-[35vh]">
        <svg width="40" height="34" viewBox="0 0 14 12" fill="none" aria-hidden="true">
          <path d="M1 1L7 11L13 1" stroke="var(--color-v-crimson-500)" strokeWidth="1.5" />
        </svg>
      </div>

      <div>
        <div
          data-pre-line
          className="mb-6 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-v-blue-500 to-v-crimson-500"
        />
        <div className="flex items-end justify-between">
          <span
            data-pre-label
            className="text-eyebrow font-mono uppercase text-v-ink-400"
          >
            Valentia Technologies
          </span>
          <span className="text-h2 font-display leading-none text-v-ink-200">
            <span ref={countRef}>0</span>
          </span>
        </div>
      </div>
    </div>
  )
}
