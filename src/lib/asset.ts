/**
 * Resolve a path in `public/` against the deployed base URL.
 *
 * Vite rewrites `base` into bundled imports and CSS `url()`, but NOT into
 * string literals — so a hardcoded `/valentia-logo.png` in JSX keeps pointing
 * at the domain root. That is correct on Vercel and Netlify, and 404s on
 * GitHub Pages, which serves this site from /valentiatechnologiesqatar/.
 *
 * Everything that names a file in `public/` goes through here, so the prefix
 * is applied in one place and cannot be forgotten per call site.
 *
 * BASE_URL always carries a trailing slash ("/" or "/repo/"), so the leading
 * slash is stripped from the path to avoid doubling it.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
