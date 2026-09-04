# Valentia Technologies

Corporate website for Valentia Technologies — healthcare software, Qatar.

## Stack

React 19 · TypeScript · Vite · Tailwind v4 · React Router 7 · GSAP +
ScrollTrigger · Lenis · Three.js / React Three Fiber / Drei

## Running

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

## Brand colours

Sampled directly from the official logo (`public/valentia-logo.png`), not
eyeballed. Both hue families are hue-locked in the source mark:

| Role     | Hex       | HSL             |
|----------|-----------|-----------------|
| Blue     | `#3D47D5` | `236 64% 54%`   |
| Crimson  | `#9D1A40` | `343 72% 36%`   |
| Ground   | `#EFF0FE` | `236 88% 97%`   |
| Ink      | `#0B0D1A` | near-black      |

All tokens live in `src/styles/tokens.css` — the single source of truth. Note
the source logo is an **Adam7-interlaced** PNG; a naive PNG reader returns
garbage pixels for it.

## Structure

```
src/
├── styles/tokens.css      brand tokens (colour, type scale, motion)
├── lib/
│   ├── vGeometry.ts       the logo V rebuilt from its traced proportions
│   └── motion.ts          Lenis + GSAP setup, reduced-motion hooks,
│                          RouteTransition (scroll + ScrollTrigger on navigate)
├── pages/                 one component per route
├── components/
│   ├── hero/              3D "Digital Healthcare Core" (code-split)
│   ├── sections/          composable page sections
│   └── ui/                nav, footer, shared primitives
└── data/content.ts        all site copy
```

Four routes: `/`, `/services`, `/about`, `/contact`. The hero canvas is
lazy-loaded so Three.js stays out of the critical path (136 kB gzip initial,
277 kB deferred on the homepage only).

### Routing notes

Two things are easy to break here:

- **`RouteTransition` in `lib/motion.ts` owns scroll on navigation.** Lenis
  patches `window.scrollTo`, so scrolling must go through `scrollToTop()` /
  `scrollToAnchor()`, which call Lenis directly. Do not add react-router's
  `<ScrollRestoration>` — it uses the patched method and will animate a full
  scroll through the outgoing page.
- **ScrollTrigger caches pixel offsets against document height.** Route changes
  invalidate them, so `RouteTransition` kills all triggers and refreshes two
  frames later, once the new page has laid out. Individual sections should
  never call `ScrollTrigger.refresh()` in their own cleanup.

`<main>` is keyed by pathname so each section's `gsap.context` cleanup runs on
navigation, which is what removes pinned sections' injected spacers.

### Deployment

Client-side routes need a rewrite to `index.html` or deep links 404 — this only
shows up in production, since the dev server and `vite preview` both handle it.
`vercel.json` and `public/_redirects` (Netlify / Cloudflare Pages) are both
committed; each is inert on the wrong host.

**GitHub Pages** is the live target, published by
`.github/workflows/deploy.yml` on every push to `main`:

<https://talhahassan1998.github.io/valentiatechnologiesqatar/>

Pages serves from a subdirectory rather than the domain root, which two things
have to agree on:

- `vite.config.ts` sets `base` from a `GITHUB_PAGES` env var, so asset URLs get
  the `/valentiatechnologiesqatar/` prefix. It is an env var rather than a
  hardcoded value because Vercel and Netlify serve from the root — a baked-in
  prefix would break both.
- `src/main.tsx` derives the router `basename` from `import.meta.env.BASE_URL`,
  so it cannot drift from whatever `base` resolved to at build time.

Pages applies no rewrite rule of its own, so the workflow copies `index.html`
to `404.html`. A deep link like `/services` asks for a file that does not
exist, and serving the SPA shell as the 404 page hands the request to the
router — the Pages equivalent of the two configs above.

Enabling it is a one-time repo setting: **Settings → Pages → Source → GitHub
Actions**. Without it the `configure-pages` step fails even though the build
itself succeeds.

## Assets

`public/network-texture.png` and `public/v-lattice.png` were generated with
Higgsfield (Recraft V4.1) using the sampled hexes as an explicit palette.
