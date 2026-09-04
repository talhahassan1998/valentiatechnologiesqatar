import { Link } from 'react-router-dom'
import { products, sectors } from '@/data/content'

// Derived from the data rather than hand-copied, so the footer cannot drift
// out of step with the solutions and sectors the site actually lists.
const COLUMNS = [
  {
    title: 'Solutions',
    links: products.map((p) => ({ label: p.title, to: `/solutions#${p.id}` })),
  },
  {
    title: 'Sectors',
    links: sectors.map((s) => ({ label: s.name, to: `/sectors#${s.id}` })),
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Services', to: '/services' },
      { label: 'Clients', to: '/clients' },
      { label: 'Partners', to: '/partners' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative border-t border-v-blue-400/12 bg-v-ink-950">
      {/* V-fold divider, the logo geometry as decoration. */}
      <div className="absolute inset-x-0 top-0 flex justify-center" aria-hidden="true">
        <svg width="60" height="26" viewBox="0 0 60 26" fill="none">
          <path
            d="M0 0 L30 24 L60 0"
            stroke="var(--color-v-crimson-600)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link to="/" aria-label="Valentia Technologies">
              <img
                src="/valentia-logo.png"
                alt="Valentia Technologies"
                className="logo-themed h-10 w-auto"
              />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-v-ink-400">
              Engineering intelligent healthcare software that connects people, data and
              clinical workflows.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-eyebrow font-mono uppercase text-v-blue-300">
                  {col.title}
                </h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-sm text-v-ink-400 transition-colors hover:text-white"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-v-blue-400/12 pt-8">
          <p className="text-xs text-v-ink-500">
            © {new Date().getFullYear()} Valentia Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
