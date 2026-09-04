import { useEffect, useRef } from 'react'
import { gsap, revealChildren } from '@/lib/motion'
import { Section, SectionHeading } from '@/components/ui/Primitives'
import { CountUp } from '@/components/ui/CountUp'
import { RegionFlag } from '@/components/ui/RegionFlag'
import { clientProof, metrics } from '@/data/content'

export function Clients() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => revealChildren(el, '[data-reveal]', { stagger: 0.07 }), el)
    return () => ctx.revert()
  }, [])

  return (
    <Section id="clients" className="border-t border-v-blue-400/10 scroll-mt-24">
      <SectionHeading
        eyebrow="Who runs it"
        title="Our customers achieve excellence with Valentia"
        lead={clientProof.lead}
      />

      <div ref={root} className="mt-16">
        <div data-reveal className="grid gap-px bg-v-blue-400/10 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="group relative bg-v-ink-900 p-8 transition-colors duration-500 hover:bg-v-ink-800"
            >
              <p className="text-h2 text-white">
                <CountUp value={m.value} />
              </p>
              <p className="mt-3 text-sm leading-relaxed text-v-ink-400">{m.label}</p>
              {/* Bottom rule that draws in on hover. */}
              <span
                className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-v-blue-500 to-v-crimson-500 transition-all duration-500 group-hover:w-full"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <h3 className="text-eyebrow font-mono uppercase text-v-blue-300">In service</h3>
            <ul className="mt-5 flex flex-col border-t border-v-blue-400/12">
              {clientProof.proof.map((p) => (
                <li
                  key={p}
                  className="group flex items-start gap-3 border-b border-v-blue-400/10 py-3 text-sm leading-relaxed text-v-ink-300 transition-colors duration-300 hover:text-white"
                >
                  {/* The V-fold, marking each line. Decorative — the text
                      beside it carries the meaning. */}
                  <svg
                    className="mt-1.5 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
                    width="10"
                    height="8"
                    viewBox="0 0 14 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M1 1L7 11L13 1" stroke="var(--color-v-blue-500)" strokeWidth="2" />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal>
            <h3 className="text-eyebrow font-mono uppercase text-v-crimson-400">Where</h3>
            {/* flex-wrap, and whitespace-nowrap on each chip: the collection
                reflows rather than clipping, while a two-word region like
                "New Zealand" never breaks across lines. */}
            <ul className="mt-5 flex flex-wrap gap-2 border-t border-v-crimson-500/20 pt-5">
              {clientProof.regions.map((r) => (
                <li
                  key={r}
                  className="group flex items-center gap-2 whitespace-nowrap border border-v-blue-400/20 px-3 py-2 text-xs text-v-ink-300 transition-colors duration-300 hover:border-v-blue-400 hover:bg-v-ink-800 hover:text-white"
                >
                  <span className="opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                    <RegionFlag region={r} />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
            <p className="text-lead mt-8 text-v-ink-300">{clientProof.relationship}</p>
          </div>
        </div>
      </div>
    </Section>
  )
}
