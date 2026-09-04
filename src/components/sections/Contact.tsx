import { useEffect, useRef, useState } from 'react'
import { gsap, revealChildren, useReducedMotion } from '@/lib/motion'
import { Section, Eyebrow } from '@/components/ui/Primitives'
import { RevealText } from '@/components/ui/RevealText'

/**
 * Enquiry form. Posts to the Flask API when one is configured; until then it
 * validates and reports honestly rather than pretending to have sent.
 */
export function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // The heading has its own RevealText; this brings up the supporting copy and
  // the form, which previously appeared with no transition at all.
  useEffect(() => {
    if (!root.current) return
    const el = root.current
    if (reduced) {
      gsap.set(el.querySelectorAll('[data-reveal]'), { opacity: 1, y: 0 })
      return
    }
    const ctx = gsap.context(() => revealChildren(el, '[data-reveal]', { stagger: 0.08 }), el)
    return () => ctx.revert()
  }, [reduced])

  const endpoint = import.meta.env.VITE_API_URL

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    if (!endpoint) {
      setStatus('error')
      setMessage('The enquiry API is not configured yet. Please email us directly in the meantime.')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(`${endpoint}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      setStatus('sent')
      setMessage('Thank you — we will be in touch shortly.')
      form.reset()
    } catch {
      setStatus('error')
      setMessage('We could not send that just now. Please try again, or email us directly.')
    }
  }

  // A faint filled ground under each field, so the form reads as a set of
  // inputs rather than floating rules, and the focused field lifts out of the
  // page instead of only changing its underline colour.
  const field =
    'w-full rounded-[var(--radius-sm)] border-b border-v-ink-600 bg-v-ink-800/40 px-3 py-3 text-white placeholder:text-v-ink-500 transition-all duration-300 hover:bg-v-ink-800/70 focus:border-v-blue-400 focus:bg-v-ink-800/80 focus:shadow-[0_6px_20px_-12px_var(--color-v-blue-500)] focus:outline-none'

  return (
    <Section id="contact" className="border-t border-v-blue-400/10">
      <div ref={root} className="grid gap-16 lg:grid-cols-[0.85fr_1fr]">
        <div>
          <Eyebrow>Get in touch</Eyebrow>
          <RevealText
            as="h2"
            className="text-h1 mt-6 text-white"
            lines={['Let’s talk about your', 'healthcare systems.']}
            accentLast
          />
          <p data-reveal className="text-lead mt-6 max-w-md text-v-ink-300">
            Tell us what you are working on. We will respond with a considered view, not a
            sales pitch.
          </p>

          <div data-reveal className="mt-10 flex flex-col gap-2 text-sm text-v-ink-400">
            <span className="text-eyebrow font-mono uppercase text-v-blue-300">Qatar</span>
            <span>Valentia Technologies</span>
            <span>Software Development</span>
          </div>
        </div>

        <form data-reveal onSubmit={onSubmit} className="flex flex-col gap-7">
          <div className="grid gap-7 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-eyebrow font-mono uppercase text-v-ink-400">Name</span>
              <input name="name" required autoComplete="name" className={field} placeholder="Your name" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-eyebrow font-mono uppercase text-v-ink-400">Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className={field}
                placeholder="you@organisation.com"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-eyebrow font-mono uppercase text-v-ink-400">Organisation</span>
            <input name="organisation" autoComplete="organization" className={field} placeholder="Hospital, clinic or company" />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-eyebrow font-mono uppercase text-v-ink-400">
              What are you working on?
            </span>
            <textarea
              name="message"
              required
              rows={4}
              className={`${field} resize-none`}
              placeholder="A short description of the challenge or project"
            />
          </label>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-sheen btn-press rounded-[var(--radius-md)] bg-v-blue-600 px-7 py-3.5 text-sm font-medium text-on-brand shadow-[0_8px_30px_-8px_var(--color-v-blue-600)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-v-blue-500 hover:shadow-[0_14px_38px_-10px_var(--color-v-blue-500)] disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
            >
              {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
            </button>

            {message && (
              <p
                role="status"
                className={`text-sm ${status === 'error' ? 'text-v-crimson-400' : 'text-v-blue-300'}`}
              >
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </Section>
  )
}
