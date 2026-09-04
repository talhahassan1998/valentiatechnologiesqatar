import { useEffect, useRef } from 'react'
import { gsap, revealChildren } from '@/lib/motion'
import { Section } from '@/components/ui/Primitives'
import { contactDetails } from '@/data/content'

/**
 * Practical detail beside the enquiry form: where we are, when to expect a
 * reply, and what to put in the message so the first response is useful.
 */
export function ContactDetails() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => revealChildren(el, '[data-col]', { stagger: 0.1 }), el)
    return () => ctx.revert()
  }, [])

  return (
    <Section className="border-t border-v-blue-400/10 bg-v-ink-950">
      <div ref={root} className="grid gap-12 md:grid-cols-3">
        <div data-col>
          <h2 className="text-eyebrow font-mono uppercase text-v-blue-300">Where we are</h2>
          <p className="mt-5 text-h3 text-white">{contactDetails.location}</p>
          <p className="mt-3 text-sm leading-relaxed text-v-ink-400">
            Serving healthcare providers across Qatar and the wider Gulf.
          </p>
        </div>

        <div data-col>
          <h2 className="text-eyebrow font-mono uppercase text-v-blue-300">Response</h2>
          <p className="mt-5 text-sm leading-relaxed text-v-ink-300">
            {contactDetails.responseTime}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-v-ink-400">
            Enquiries are read by an engineer, not a sales desk.
          </p>
        </div>

        <div data-col>
          <h2 className="text-eyebrow font-mono uppercase text-v-blue-300">
            Helpful to include
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {contactDetails.include.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-v-ink-300">
                <span
                  className="mt-1.5 h-1 w-1 shrink-0 bg-v-crimson-500"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
