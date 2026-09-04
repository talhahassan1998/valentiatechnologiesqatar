/**
 * Scene palette, read from the brand tokens at runtime so the 3D matches the
 * logo exactly and stays in step with tokens.css — the single source of truth.
 * Falls back to the sampled hexes if a token is ever missing.
 */
import * as THREE from 'three'

const read = (name: string, fallback: string) => {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

export function brandPalette() {
  return {
    blue500: read('--color-v-blue-500', '#4e58eb'),
    blue600: read('--color-v-blue-600', '#3d47d5'),
    blue400: read('--color-v-blue-400', '#6b73ef'),
    blue300: read('--color-v-blue-300', '#949af3'),
    crimson500: read('--color-v-crimson-500', '#ba3959'),
    crimson600: read('--color-v-crimson-600', '#9d1a40'),
    // The scene's ground and key light are NOT themed. Its lighting, bloom
    // and vignette are all built against a dark ground — on a light one the
    // fog washes the V out and the additive passes disappear. The hero stays
    // a dark brand moment in both themes, like a photograph on the page.
    ink900: '#0b0d1a',
    ink50: '#eff0fe',
  }
}

export const asColor = (hex: string) => new THREE.Color(hex)
