import { useEffect, useRef, useState } from 'react'
import { gsap, parallax, ScrollTrigger, useReducedMotion } from '@/lib/motion'
import { Eyebrow } from '@/components/ui/Primitives'
import { anatomyLayers } from '@/data/content'
import { asset } from '@/lib/asset'

/**
 * "The Digital Anatomy of Healthcare" — the concept section.
 *
 * Pinned while the reader moves through five layers of the system, from the
 * people at the top to the intelligence layered on last. An SVG diagram builds
 * up alongside, one stratum at a time, so the abstraction stays concrete.
 */
export function DigitalAnatomy() {
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root.current) return
    const el = root.current

    // Reduced motion: no pinning, just show every layer as a static list.
    if (reduced) {
      setActive(anatomyLayers.length - 1)
      return
    }

    const ctx = gsap.context(() => {
      const tex = el.querySelector('[data-texture]')
      if (tex) parallax(tex as HTMLElement, 90)

      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: () => `+=${anatomyLayers.length * 62}%`,
        pin: '[data-pin]',
        scrub: true,
        onUpdate: (self) => {
          // Clamp both ends: progress hits exactly 0 and 1 at the boundaries,
          // and fast scrolling can report values slightly outside the range.
          const raw = Math.floor(self.progress * anatomyLayers.length)
          const i = Math.max(0, Math.min(anatomyLayers.length - 1, raw))
          setActive(i)
        },
      })
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={root}
      // force-dark, like the hero: this section is a lit, pinned data
      // visualisation built against a dark ground. network-texture.png is a
      // baked-dark raster, so on the light theme's white ground it painted a
      // grey veil over the whole band — inactive labels fell to ~1.1:1 contrast,
      // well under the 4.5:1 minimum. Re-declaring the ink scale on the subtree
      // keeps the intended look in both themes without touching the markup.
      // overflow-hidden clips the texture layer: it is scale-110 for parallax
      // headroom, which on a section this tall pushes it ~200px past each edge.
      // Unclipped it bleeds the dark texture down over the next section's
      // heading — visible as a grey band once this section became force-dark.
      className="force-dark relative overflow-hidden border-t border-v-blue-400/10 bg-v-ink-950"
      aria-label="The digital anatomy of healthcare"
    >
      {/* Ambient network texture (Higgsfield, brand-palette locked). Low opacity
          so it reads as atmosphere, never as content. */}
      <div
        data-texture
        className="pointer-events-none absolute inset-0 scale-110 bg-cover bg-center opacity-55"
        style={{ backgroundImage: `url(${asset('/network-texture.png')})` }}
        aria-hidden="true"
      />

      {/* py-24 md:py-32 to match Section — this one is hand-rolled rather than
          using <Section> because it is pinned, and it was the only band on the
          page opening at 96px while every other section opened at 128px. */}
      <div data-pin className="relative min-h-[100svh] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>The digital anatomy of healthcare</Eyebrow>

          <div className="mt-12 grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
            {/* Layer copy */}
            <div className="flex flex-col gap-8">
              {anatomyLayers.map((layer, i) => {
                const on = i === active
                return (
                  // Inactive layers sit at 0.55, not 0.35: these are upcoming
                  // content the reader should still be able to scan, not
                  // disabled controls. Below ~0.5 the labels fall under the
                  // 4.5:1 contrast floor.
                  <div
                    key={layer.id}
                    className={`border-l-2 pl-6 transition-all duration-500 ${
                      on ? 'border-v-crimson-500 opacity-100' : 'border-v-ink-700 opacity-55'
                    }`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="text-eyebrow font-mono uppercase text-v-blue-300">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {/* v-ink-300, not 400: this is 12px mono, and the dimmed
                          inactive rows push 400 under the contrast floor. */}
                      <span className="text-eyebrow font-mono uppercase text-v-ink-300">
                        {layer.label}
                      </span>
                    </div>
                    <h3
                      className={`text-h3 mt-2 transition-colors duration-500 ${
                        on ? 'text-white' : 'text-v-ink-300'
                      }`}
                    >
                      {layer.title}
                    </h3>
                    {/* Body only for the active layer, so the column stays calm. */}
                    <div
                      className={`grid transition-all duration-500 ${
                        on ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <p className="overflow-hidden text-sm leading-relaxed text-v-ink-300">
                        {layer.body}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Stratified diagram — builds one layer at a time. */}
            <AnatomyDiagram active={active} />
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Five stacked strata inside a V-shaped envelope. Each stratum is a horizontal
 * band of nodes; connections between them light up as layers activate — the
 * system assembling itself from people upward.
 */
function AnatomyDiagram({ active }: { active: number }) {
  const W = 560
  const H = 460
  const rows = anatomyLayers.length

  // Node positions per stratum, narrowing toward the base like the V.
  const strata = anatomyLayers.map((_, i) => {
    const t = i / (rows - 1)
    const y = 52 + t * (H - 130)
    // Width tapers as depth increases.
    const halfWidth = (W / 2 - 40) * (1 - t * 0.52)
    const count = 7 - i
    const nodes = Array.from({ length: count }, (_, n) => {
      const u = count === 1 ? 0.5 : n / (count - 1)
      return { x: W / 2 + (u - 0.5) * 2 * halfWidth, y }
    })
    return { y, nodes }
  })

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Layered diagram of a healthcare technology system"
      >
        {/* V envelope, echoing the logo geometry. */}
        <path
          d={`M 34 34 L ${W / 2} ${H - 44} L ${W - 34} 34`}
          fill="none"
          stroke="var(--color-v-blue-700)"
          strokeWidth="1"
          opacity="0.35"
        />

        {/* Inter-stratum connections. */}
        {strata.slice(0, -1).map((s, i) => {
          const next = strata[i + 1]
          const on = i < active
          return (
            <g key={`link-${i}`}>
              {s.nodes.map((n, ni) =>
                next.nodes.map((m, mi) =>
                  (ni + mi) % 2 === 0 ? (
                    <line
                      key={`${ni}-${mi}`}
                      x1={n.x}
                      y1={n.y}
                      x2={m.x}
                      y2={m.y}
                      stroke={on ? 'var(--color-v-blue-500)' : 'var(--color-v-ink-700)'}
                      strokeWidth="0.75"
                      opacity={on ? 0.4 : 0.16}
                      style={{ transition: 'stroke 600ms ease, opacity 600ms ease' }}
                    />
                  ) : null,
                ),
              )}
            </g>
          )
        })}

        {/* Stratum nodes. */}
        {strata.map((s, i) => {
          const on = i <= active
          const isActive = i === active
          return (
            <g key={`row-${i}`}>
              <line
                x1={40}
                y1={s.y}
                x2={W - 40}
                y2={s.y}
                stroke="var(--color-v-ink-700)"
                strokeWidth="0.5"
                opacity={on ? 0.5 : 0.2}
                style={{ transition: 'opacity 600ms ease' }}
              />
              {s.nodes.map((n, ni) => (
                <circle
                  key={ni}
                  cx={n.x}
                  cy={n.y}
                  r={isActive ? 4.5 : 3}
                  fill={
                    isActive
                      ? 'var(--color-v-crimson-500)'
                      : on
                        ? 'var(--color-v-blue-500)'
                        : 'var(--color-v-ink-600)'
                  }
                  style={{ transition: 'fill 600ms ease, r 400ms ease' }}
                />
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
