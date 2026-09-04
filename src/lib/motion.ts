import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
// Mobile URL-bar show/hide fires resize, which would otherwise refresh pinned
// triggers mid-scroll and read as a jump in DigitalAnatomy.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }

/** Matches --ease-brand in tokens.css. */
export const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

/**
 * The live Lenis instance, or null under reduced motion and before mount.
 * Held at module scope because the scroll helpers below reach it from outside
 * React: Lenis patches window.scrollTo, so going through the DOM API would
 * animate the whole journey instead of jumping.
 */
let lenisInstance: Lenis | null = null

/** Jump to the top with no animation. Safe when Lenis is not running. */
export function scrollToTop() {
  if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}

/** Jump to an in-page anchor — e.g. arriving on /services#interop. */
export function scrollToAnchor(hash: string) {
  const el = document.getElementById(hash.replace(/^#/, ''))
  if (!el) return
  if (lenisInstance) lenisInstance.scrollTo(el, { immediate: true, force: true })
  else el.scrollIntoView()
}

/**
 * Drives Lenis from GSAP's ticker so smooth scroll and ScrollTrigger share one
 * clock — running them on separate RAF loops makes pinned sections jitter.
 * Skipped entirely when the user prefers reduced motion.
 */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    lenisInstance = lenis
    // Expose for tooling/debugging; Lenis intercepts window.scrollTo.
    ;(window as unknown as { lenis?: Lenis }).lenis = lenis
    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisInstance = null
    }
  }, [enabled])
}

/** Live-updating reduced-motion preference. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/** Coarse device check, used to scale down 3D instance counts on mobile. */
export function useIsCompact(): boolean {
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = () => setCompact(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return compact
}

/**
 * Standard section reveal: children rise and fade as the section enters.
 * Returns a ref to attach to the section root.
 */
export function revealChildren(
  root: HTMLElement,
  selector: string,
  opts: { stagger?: number; y?: number; start?: string; scale?: number } = {},
) {
  const { stagger = 0.08, y = 28, start = 'top 78%', scale } = opts
  const targets = root.querySelectorAll(selector)
  if (!targets.length) return

  // Cards settle better rising *and* easing up to full size — the scale is
  // opt-in because it reads as fussy on a plain text block.
  const from = scale ? { y, opacity: 0, scale } : { y, opacity: 0 }
  const to = scale ? { y: 0, opacity: 1, scale: 1 } : { y: 0, opacity: 1 }

  // fromTo, not from: an interrupted `from` (a route change mid-reveal, a
  // trigger that never fires because the reader landed below it) leaves the
  // element parked at opacity 0 — permanently invisible content.
  return gsap.fromTo(
    targets,
    from,
    {
      ...to,
      duration: 0.9,
      ease: 'power3.out',
      stagger,
      // immediateRender:false so the start state is not written until the
      // trigger actually runs. Without it, a section the reader lands below
      // (a direct load, a deep link, a refresh mid-page) gets pinned at
      // opacity 0 by a trigger whose start is already behind them.
      immediateRender: false,
      scrollTrigger: { trigger: root, start, once: true },
    },
  )
}

/**
 * Route transitions and ScrollTrigger do not get along. Order matters:
 *
 *   1. kill the outgoing page's triggers before React unmounts the tree, so no
 *      pin-spacer (ScrollTrigger injects one for every pinned element) can
 *      survive into the next page as a phantom gap;
 *   2. jump to the top through Lenis, never window.scrollTo — see scrollToTop;
 *   3. re-measure only once the new page has laid out. Every trigger caches
 *      pixel offsets against the old document height, so without this the next
 *      page's reveals fire at the wrong scroll position or not at all.
 *
 * Killing in step 1 is idempotent: each section's own gsap.context cleanup
 * still runs on unmount, and reverting an already-killed trigger is a no-op.
 */
export function RouteTransition() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill())
    if (!hash) scrollToTop()

    // Two frames: one for React's commit to paint, one for layout to settle.
    // A single frame measures too early and pinned sections get a wrong end.
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        if (hash) scrollToAnchor(hash)
      })
    })

    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [pathname, hash])

  return null
}

/**
 * Scroll progress (0..1) across the first `span` viewports, written to a ref
 * rather than state: this drives a per-frame WebGL render, and setState here
 * would re-render React sixty times a second for nothing.
 *
 * Updates from the GSAP ticker so it shares the Lenis clock.
 */
export function useScrollProgress(span = 3) {
  const progress = useRef(0)

  useEffect(() => {
    const read = () => {
      const max = window.innerHeight * span
      progress.current = Math.min(1, Math.max(0, window.scrollY / max))
    }
    read()
    gsap.ticker.add(read)
    return () => gsap.ticker.remove(read)
  }, [span])

  return progress
}

/**
 * Gentle parallax: drifts an element against the scroll while its section is
 * in view. Subtle by design — enough to give depth, not enough to notice as
 * an effect. No-op under reduced motion.
 */
export function parallax(el: HTMLElement, distance = 60) {
  return gsap.fromTo(
    el,
    { y: -distance / 2 },
    {
      y: distance / 2,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
    },
  )
}
