import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { VCore } from './VCore'
import { VitalsField } from './VitalsField'
import { ArchitectureGrid } from './ArchitectureGrid'
import { brandPalette } from './palette'
import { useIsCompact, useReducedMotion } from '@/lib/motion'
import { CURTAIN_UP, curtainIsUp } from '@/components/ui/Preloader'

/**
 * Entrance clock: 0 while waiting, ramping 0→1 once the curtain lifts.
 *
 * Held in a ref and advanced inside useFrame so the entrance costs no React
 * renders, exactly like the scroll progress it blends into.
 */
const INTRO_SECONDS = 1.9

function useIntroClock(skip: boolean) {
  const t = useRef(skip ? 1 : 0)
  const startedAt = useRef<number | null>(skip ? 0 : null)

  useEffect(() => {
    if (skip) {
      t.current = 1
      startedAt.current = 0
      return
    }
    const start = () => {
      if (startedAt.current === null) startedAt.current = performance.now()
    }
    // The chunk this lives in is lazy-loaded, so the curtain may already be up
    // by the time we subscribe — the event is long gone. Check the latch first.
    if (curtainIsUp()) {
      start()
      return
    }
    window.addEventListener(CURTAIN_UP, start, { once: true })
    // Fallback: if the curtain event never arrives (an error, a stalled
    // timeline), start anyway rather than showing a frozen scene.
    const timer = window.setTimeout(start, 2600)
    return () => {
      window.removeEventListener(CURTAIN_UP, start)
      window.clearTimeout(timer)
    }
  }, [skip])

  /**
   * Wall-clock progress, not accumulated deltas. A backgrounded tab suspends
   * rAF, so a delta-driven intro would freeze mid-entrance and leave the
   * scene tiny and off-camera; elapsed time resolves correctly on return.
   */
  const advance = () => {
    if (startedAt.current === null) return t.current
    const elapsed = (performance.now() - startedAt.current) / 1000
    t.current = Math.min(1, elapsed / INTRO_SECONDS)
    return t.current
  }

  return { t, advance }
}

/** Overshooting ease — arrives fast, settles with one small rebound. */
const easeOutBack = (x: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x))

/**
 * Scroll choreography for the hero. `progress` is a ref written by the pinned
 * ScrollTrigger in Hero.tsx, read here per-frame — no React state in the
 * render loop, so scrubbing never re-renders the tree.
 *
 * The camera pushes in as the reader scrolls while the V turns to face front
 * and the network opens out around it: one continuous move, four beats.
 */
function Choreography({
  progress,
  intro,
}: {
  progress: React.MutableRefObject<number>
  intro: { t: React.MutableRefObject<number>; advance: () => number }
}) {
  const smooth = useRef(0)

  useFrame(({ camera }, delta) => {
    const i = easeOutExpo(intro.advance())

    // Damped follow so a fast flick glides instead of snapping.
    const k = 1 - Math.pow(0.0015, delta)
    smooth.current += (progress.current - smooth.current) * k
    const p = smooth.current

    // Scroll pose: a restrained push-in. Too much dolly and the composition
    // leaves the frame by the last beat.
    const scrollZ = 6.2 - p * 1.1
    const scrollY = 0.2 - p * 0.22

    // Entrance pose: further back and higher, falling into the scroll pose.
    // Blending (rather than sequencing) means a reader who scrolls during the
    // intro never sees a snap when it finishes.
    camera.position.z = THREE.MathUtils.lerp(11.5, scrollZ, i)
    camera.position.y = THREE.MathUtils.lerp(1.5, scrollY, i)
    camera.lookAt(0, 0, 0)
  })

  return null
}

function Rig({
  progress,
  intro,
  children,
}: {
  progress: React.MutableRefObject<number>
  intro: { t: React.MutableRefObject<number>; advance: () => number }
  children: React.ReactNode
}) {
  const group = useRef<THREE.Group>(null)
  const compact = useIsCompact()

  useFrame((_, delta) => {
    if (!group.current) return
    const p = progress.current
    const k = 1 - Math.pow(0.0015, delta)
    // advance() is idempotent within a frame, so both consumers may call it
    // and neither depends on the other's render order.
    const raw = intro.advance()
    const i = easeOutBack(raw)   // form settles with one small rebound
    const iExpo = easeOutExpo(raw)

    const targetX = compact ? 0 : THREE.MathUtils.lerp(1.75, 0.85, Math.min(1, p * 1.2))
    group.current.position.x += (targetX - group.current.position.x) * k
    group.current.position.y += ((compact ? 0.6 : 0) - group.current.position.y) * k

    // Entrance adds most of a turn on top of the scroll rotation, unwinding
    // as it settles — the mark arrives spinning and comes to rest square on.
    const scrollRotY = p * 0.5
    const introSpin = (1 - iExpo) * -2.4
    group.current.rotation.y += (scrollRotY + introSpin - group.current.rotation.y) * k

    // Core recedes a little as the constellation opens, but never so far
    // that the V stops anchoring the frame.
    const scrollScale = 1 - p * 0.12
    group.current.scale.setScalar(scrollScale * THREE.MathUtils.lerp(0.45, 1, i))
  })

  return <group ref={group}>{children}</group>
}

export function HeroScene({ progress }: { progress: React.MutableRefObject<number> }) {
  const reducedMotion = useReducedMotion()
  const compact = useIsCompact()
  // Reduced motion gets the settled composition with no entrance at all.
  const intro = useIntroClock(reducedMotion)
  const c = brandPalette()

  return (
    <Canvas
      dpr={[1, compact ? 1.5 : 2]}
      camera={{ position: [0, 0.2, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
    >
      <color attach="background" args={[c.ink900]} />
      <fog attach="fog" args={[c.ink900, 7, 18]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 5]} intensity={2.1} color={c.ink50} />
      <directionalLight position={[-5, -2, 2]} intensity={0.9} color={c.crimson600} />
      <pointLight position={[1.5, 1, 4]} intensity={6} color={c.blue500} distance={14} />

      {!reducedMotion && <Choreography progress={progress} intro={intro} />}

      <Suspense fallback={null}>
        <Rig progress={progress} intro={intro}>
          <VitalsField
            progress={progress}
            reducedMotion={reducedMotion}
            compact={compact}
          />
          <ArchitectureGrid reducedMotion={reducedMotion} />
          <VCore reducedMotion={reducedMotion} />
        </Rig>
      </Suspense>

      {/* Its own boundary on purpose: the preset is fetched from a CDN at
          runtime, and sharing a boundary with the rig meant one slow network
          round-trip held the entire composition unmounted on a cold load. The
          lights above carry the scene until it lands. */}
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.45} />
      </Suspense>

      {!compact && (
        <EffectComposer>
          <Bloom
            intensity={0.62}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.22} darkness={0.75} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
