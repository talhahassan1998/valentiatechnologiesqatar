import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createVLimbs } from '@/lib/vGeometry'
import { brandPalette } from '@/components/hero/palette'

/**
 * The logo V, rotating. Used as the closing flourish in the contact CTA.
 *
 * Code-split (see ContactCta) so Three.js stays off the critical path, per the
 * hero's own rule. Geometry comes from lib/vGeometry — the same traced limbs the
 * hero uses — rather than a second approximation of the mark.
 *
 * Unlike the hero scene, this one has no bloom, fog or vignette: it sits on a
 * panel that inverts with the theme, so it is lit to read on a light ground too.
 */
function SpinningV({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const { blue, crimson } = useMemo(() => createVLimbs(), [])
  const c = useMemo(() => brandPalette(), [])

  useEffect(() => {
    return () => {
      blue.dispose()
      crimson.dispose()
    }
  }, [blue, crimson])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    // Held at a three-quarter attitude, no spin.
    if (reducedMotion) {
      g.rotation.set(-0.1, -0.38, 0)
      return
    }

    // Continuous Y rotation, framerate-independent. Slow enough to read as a
    // turning object rather than a spinning logo.
    g.rotation.y += delta * 0.42
    // Gentle tilt and rise so the turn is not a flat carousel. The tilt is held
    // off zero so the mark never passes through a fully edge-on sliver.
    const t = state.clock.elapsedTime
    g.rotation.x = -0.16 + Math.sin(t * 0.5) * 0.07
    g.position.y = Math.sin(t * 0.4) * 0.06
  })

  return (
    <group ref={group} scale={2.3}>
      <mesh geometry={blue}>
        <meshStandardMaterial color={c.blue600} metalness={0.58} roughness={0.3} />
      </mesh>
      <mesh geometry={crimson}>
        <meshStandardMaterial color={c.crimson600} metalness={0.58} roughness={0.32} />
      </mesh>
    </group>
  )
}

export function VMarkScene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const c = useMemo(() => brandPalette(), [])

  // R3F sizes the canvas from a ResizeObserver on its container. That observer
  // can miss the initial box for a canvas mounted lazily deep in the page,
  // leaving the element at its default 300x150 with no frames drawn — a blank
  // panel. A window resize is what makes R3F re-measure, so fire one after mount
  // and stop as soon as the canvas has taken a real size.
  const holder = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    let tries = 0
    const nudge = () => {
      const el = holder.current
      const canvas = el?.querySelector('canvas')
      // Give up after ~30 frames rather than spin forever if something else is
      // wrong; a stuck canvas is a cosmetic failure, not worth a runaway loop.
      if (!el || !canvas || tries++ > 30) return
      // Compare the canvas against its holder's width. Height can already match
      // by coincidence while the canvas is still at its untouched default box,
      // so keying on height alone exits before ever firing the event.
      if (Math.round(canvas.getBoundingClientRect().width) === Math.round(el.clientWidth)) return
      window.dispatchEvent(new Event('resize'))
      raf = requestAnimationFrame(nudge)
    }
    raf = requestAnimationFrame(nudge)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={holder} className="h-full w-full">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5.4], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        // Transparent: the panel's own gradient shows through, in either theme.
        style={{ background: 'transparent' }}
        // The mark is decorative; the CTA copy carries the meaning.
        aria-hidden="true"
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 5, 5]} intensity={2.2} color={c.ink50} />
        <directionalLight position={[-5, -2, 2]} intensity={1} color={c.crimson600} />
        <pointLight position={[1.5, 1, 4]} intensity={5} color={c.blue500} distance={14} />
        <SpinningV reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}
