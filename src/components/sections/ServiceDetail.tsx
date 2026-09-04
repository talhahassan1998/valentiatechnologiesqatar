import { useEffect, useRef } from 'react'
import { gsap, revealChildren } from '@/lib/motion'
import { Section } from '@/components/ui/Primitives'
import { capabilities, serviceDetail } from '@/data/content'

type Capability = (typeof capabilities)[number]
type Detail = (typeof serviceDetail)[string]

/**
 * One expanded service on /services, or one product on /solutions — the two
 * share a shape, so `details` is passed in rather than looked up here. The id
 * doubles as the anchor target, so links like /services#interop land on the
 * right block.
 */
export function ServiceDetail({
  item,
  flip,
  details = serviceDetail,
}: {
  item: Capability
  flip: boolean
  details?: Record<string, Detail>
}) {
  const root = useRef<HTMLDivElement>(null)
  const detail = details[item.id]

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => revealChildren(el, '[data-reveal]', { stagger: 0.07 }), el)
    return () => ctx.revert()
  }, [])

  return (
    <Section id={item.id} className="border-t border-v-blue-400/10 scroll-mt-24">
      <div
        ref={root}
        className={`grid gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-20 ${
          flip ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        <div data-reveal>
          <div className="flex items-center gap-3">
            {/* Products carry an icon; the service capabilities do not. */}
            {'icon' in item && typeof item.icon === 'string' && (
              <img src={item.icon} alt="" width="26" height="27" className="h-9 w-9" />
            )}
            <span className="text-eyebrow font-mono text-v-blue-400">{item.index}</span>
            <span className="h-px w-12 bg-v-blue-400/25" aria-hidden="true" />
          </div>

          <h2 className="text-h2 mt-6 text-white">{item.title}</h2>
          <p className="text-lead mt-6 text-v-ink-300">{item.body}</p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {item.points.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-sm text-v-ink-400">
                <span className="h-1 w-1 shrink-0 bg-v-crimson-500" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal className="flex flex-col gap-10">
          <p className="text-base leading-relaxed text-v-ink-200">{detail.lead}</p>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="text-eyebrow font-mono uppercase text-v-blue-300">
                What we build
              </h3>
              <ul className="mt-5 flex flex-col gap-3 border-t border-v-blue-400/12 pt-5">
                {detail.deliverables.map((d) => (
                  <li key={d} className="text-sm leading-relaxed text-v-ink-300">
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-eyebrow font-mono uppercase text-v-crimson-400">
                What changes
              </h3>
              <ul className="mt-5 flex flex-col gap-3 border-t border-v-crimson-500/20 pt-5">
                {detail.outcomes.map((o) => (
                  <li key={o} className="text-sm leading-relaxed text-v-ink-300">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
