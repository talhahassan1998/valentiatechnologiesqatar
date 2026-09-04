import { useEffect, useState } from 'react'

/**
 * Theme state. The attribute lives on <html> so the CSS override in
 * tokens.css applies, and the choice is persisted per browser.
 *
 * Dark is the brand default, so only an explicit light choice is stamped —
 * absence of the attribute means dark.
 */

export type Theme = 'dark' | 'light'

const KEY = 'valentia-theme'

export function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // Private mode or blocked storage — fall through to the system preference.
  }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'light') root.setAttribute('data-theme', 'light')
  else root.removeAttribute('data-theme')
  root.style.colorScheme = theme
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window === 'undefined' ? 'dark' : readTheme(),
  )

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      // Nothing to do — the theme still applies for this session.
    }
  }, [theme])

  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))] as const
}
