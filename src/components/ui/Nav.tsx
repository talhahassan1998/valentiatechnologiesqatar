import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { products, sectors } from '@/data/content'
import { useTheme } from '@/lib/theme'

/** Sun / moon toggle. Inline so the nav stays one file. */
function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, toggle] = useTheme()
  const light = theme === 'light'

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex h-9 w-9 items-center justify-center text-v-ink-300 transition-colors hover:text-white ${className}`}
      aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {light ? (
          // Moon — offered when the page is light.
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
            <path
              d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </button>
  )
}

// Submenus are derived from the content data, so adding a product or sector
// puts it in the nav without a second edit here.
const LINKS: {
  label: string
  to: string
  children?: { label: string; to: string; icon?: string }[]
}[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Solutions',
    to: '/solutions',
    children: products.map((p) => ({
      label: p.title,
      to: `/solutions#${p.id}`,
      icon: p.icon,
    })),
  },
  {
    label: 'Sectors',
    to: '/sectors',
    children: sectors.map((s) => ({
      label: s.name,
      to: `/sectors#${s.id}`,
      icon: s.icon,
    })),
  },
  { label: 'Services', to: '/services' },
  {
    label: 'Company',
    to: '/about',
    children: [
      { label: 'About Us', to: '/about' },
      { label: 'Our Clients', to: '/clients' },
      { label: 'Partners', to: '/partners' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  // The route the drawer was opened on. Any navigation makes it stale, which
  // closes the drawer — including via browser back/forward, which a click
  // handler would miss.
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const open = openedAt === pathname

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The homepage hero stays dark in both themes, and the bar is transparent
  // until scrolled — so up there the nav is sitting on a dark ground and has
  // to be styled for one, whatever the page theme is.
  const overHero = pathname === '/' && !scrolled

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'nav-scrolled border-b border-v-blue-400/12 backdrop-blur-xl'
          : 'border-b border-transparent'
      } ${overHero ? 'force-dark' : ''}`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        <Link to="/" className="flex items-center gap-3" aria-label="Valentia Technologies">
          <img
            src="/valentia-logo.png"
            alt="Valentia Technologies"
            className="logo-themed h-8 w-auto md:h-9"
          />
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            // Hover and focus-within both open the panel, so the submenu is
            // reachable by keyboard without any open/close state.
            <div key={l.to} className="group relative">
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 text-sm transition-colors hover:text-white ${
                    isActive ? 'text-white' : 'text-v-ink-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {l.children && (
                      <svg
                        className="mt-px transition-transform duration-300 group-hover:rotate-180"
                        width="8"
                        height="5"
                        viewBox="0 0 10 6"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    )}
                    {/* The V-fold: hover indicator, and marker for the current page. */}
                    <svg
                      className={`absolute -bottom-2 left-1/2 -translate-x-1/2 transition-opacity duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 1L5 5L9 1"
                        stroke="var(--color-v-crimson-500)"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </>
                )}
              </NavLink>

              {l.children && (
                <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 pt-5 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  {/* Opaque, not translucent — page headings behind the panel
                      show through a tinted background and make it unreadable. */}
                  <div className="border border-v-blue-400/12 bg-v-ink-900 py-2 shadow-2xl shadow-black/50">
                    {l.children.map((c) => (
                      <Link
                        key={c.to}
                        to={c.to}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm text-v-ink-300 transition-colors hover:bg-v-ink-800 hover:text-white"
                      >
                        {c.icon && (
                          <img src={c.icon} alt="" width="26" height="27" className="h-5 w-5" />
                        )}
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <ThemeToggle />
          <Link
            to="/contact"
            className="bg-v-blue-600 px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-v-blue-500"
          >
            Get in Touch
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpenedAt((v) => (v === pathname ? null : pathname))}
            className="flex h-10 w-10 items-center justify-center"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {/* currentColor, not bg-white — the bars must invert with the theme. */}
            <span className="relative block h-4 w-6 text-white">
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-current transition-all duration-300 ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-3 block h-0.5 w-6 bg-current transition-all duration-300 ${
                  open ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="nav-scrolled border-t border-v-blue-400/12 px-6 py-6 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-5">
            {LINKS.map((l) => (
              // Always expanded on mobile — an accordion here costs state and
              // a tap for a list this short.
              <div key={l.to} className="flex flex-col gap-3">
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `text-lg ${isActive ? 'text-white' : 'text-v-ink-200'}`
                  }
                >
                  {l.label}
                </NavLink>
                {l.children && (
                  <div className="flex flex-col gap-3 border-l border-v-blue-400/15 pl-4">
                    {l.children.map((c) => (
                      <Link
                        key={c.to}
                        to={c.to}
                        className="flex items-center gap-2.5 text-sm text-v-ink-400"
                      >
                        {c.icon && (
                          <img src={c.icon} alt="" width="26" height="27" className="h-4 w-4" />
                        )}
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              to="/contact"
              className="mt-2 bg-v-blue-600 px-5 py-3 text-center text-sm font-medium text-on-brand"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
