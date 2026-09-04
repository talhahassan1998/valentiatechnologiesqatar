import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { brandPalette } from './palette'

/**
 * The living vitals field — the healthcare motif behind the core.
 *
 * A point lattice wrapped around the V, with an ECG pulse propagating across
 * it left to right: the lattice lifts where the wavefront passes, flares at
 * the QRS spike, and settles behind it. One sweep every few seconds, like a
 * monitor trace.
 *
 * The wave is entirely GPU-side — a single `uTime` uniform per frame drives
 * every point, so the field costs one draw call and no per-instance CPU work.
 *
 * Abstract by design: no anatomy, no clinical imagery. Just the one signal
 * every clinician reads without thinking.
 */

type Props = {
  progress: React.MutableRefObject<number>
  reducedMotion: boolean
  compact: boolean
}

/** Sweep runs across this span in model X; also the shader's normalisation. */
const SPAN_X = 11

/**
 * Builds the lattice. Seeded pseudo-random, matching the pattern the rest of
 * the scene uses, so the composition is stable between reloads and identical
 * across StrictMode's double-invoke.
 */
function buildLattice(count: number) {
  let seed = 20260901
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }

  const positions = new Float32Array(count * 3)
  // Per-point: aSeed.x = size jitter, aSeed.y = role.
  // Role 1 = trace (rides the waveform), 0 = ambient field.
  const seeds = new Float32Array(count * 2)

  // Two thirds of the budget goes to the trace itself. The waveform has to be
  // a legible line before the surrounding field means anything — a diffuse
  // cloud alone gives the pulse nothing to read against.
  const traceCount = Math.floor(count * 0.62)

  for (let i = 0; i < count; i++) {
    const isTrace = i < traceCount

    let x: number
    let y: number
    let z: number

    if (isTrace) {
      // Dense, near-even spacing across the sweep so the drawn waveform is
      // continuous rather than dotted, with only slight jitter for life.
      x = ((i / traceCount) - 0.5) * SPAN_X + (rand() - 0.5) * 0.02
      y = (rand() - 0.5) * 0.06
      z = (rand() - 0.5) * 0.5 - 0.4
    } else {
      x = (rand() - 0.5) * SPAN_X * 1.15
      // Ambient points spread wide, thinning toward the trace line.
      y = Math.pow(rand(), 0.85) * (rand() < 0.5 ? -1 : 1) * 3.2
      z = (rand() - 0.62) * 5.4
    }

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    seeds[i * 2] = 0.6 + rand() * 0.8
    seeds[i * 2 + 1] = isTrace ? 1 : 0
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 2))
  return geometry
}

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPulseRate;
  uniform float uSize;

  attribute vec2 aSeed;

  varying float vPulse;
  varying float vFade;

  const float SPAN_X = ${SPAN_X.toFixed(1)};

  /**
   * One cardiac cycle over t in [0,1): a small P bump, the sharp QRS spike,
   * then the broader T wave. Deliberately not a sine — the asymmetry is what
   * makes it read as a heartbeat rather than a ripple.
   */
  float beat(float t) {
    float p   = exp(-pow((t - 0.16) / 0.045, 2.0)) * 0.18;
    float q   = exp(-pow((t - 0.30) / 0.012, 2.0)) * -0.22;
    float r   = exp(-pow((t - 0.34) / 0.013, 2.0)) * 1.0;
    float s   = exp(-pow((t - 0.385) / 0.016, 2.0)) * -0.34;
    float tw  = exp(-pow((t - 0.56) / 0.075, 2.0)) * 0.3;
    return p + q + r + s + tw;
  }

  /** Two full beats across the visible span, so the trace reads as a rhythm. */
  float ecg(float along) {
    return beat(fract(along * 2.0));
  }

  void main() {
    vec3 pos = position;
    float isTrace = aSeed.y;

    // Field opens outward as the reader descends.
    pos.xy *= 0.82 + uProgress * 0.42;

    // Where this point sits along the sweep, and how long ago the writing
    // head passed it. An age near 0 means the head is here right now.
    float along = clamp((pos.x / SPAN_X) + 0.5, 0.0, 1.0);
    float head = fract(uTime * uPulseRate);
    float age = fract(head - along);

    // The waveform this point holds: sampled at its own position, so the
    // trace is a drawn curve, not a travelling bump.
    float wave = ecg(along);

    // Trace points take the waveform as their actual height. Ambient points
    // are only nudged by it, and only near the line.
    float nearLine = exp(-abs(pos.y) * 0.8);
    pos.y += wave * mix(nearLine * 0.5, 1.5, isTrace);

    // Idle breath so the field is never fully static between beats.
    pos.y += sin(uTime * 0.4 + aSeed.x * 6.28) * 0.04 * (1.0 - isTrace);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Monitor persistence: brightest just behind the writing head, decaying
    // around the loop. This is what makes it read as a live trace being
    // drawn rather than a static curve sitting there.
    float glow = pow(1.0 - age, 5.0);
    // A hard flare right at the head itself.
    float headFlare = smoothstep(0.04, 0.0, age);
    // The captions sit on the left. Damp the trace there so the writing head
    // never competes with the headline as it sweeps past the text column —
    // the legibility scrim alone cannot hold back an additive highlight.
    float clearOfCaptions = smoothstep(-4.6, -1.2, pos.x);

    vPulse = (mix(0.0, glow + headFlare, isTrace)
              + wave * nearLine * (1.0 - isTrace) * 0.5) * clearOfCaptions;

    // Depth fade, so the far side of the field recedes into the fog.
    vFade = smoothstep(-4.0, 1.5, pos.z) * mix(0.35, 1.0, clearOfCaptions);

    // Trace points are inherently brighter and larger than ambient dust.
    float base = mix(0.55, 1.35, isTrace);
    gl_PointSize = uSize * aSeed.x * base * (1.0 + vPulse * 2.2) * (420.0 / -mv.z);
  }
`

const FRAG = /* glsl */ `
  uniform vec3 uBlue;
  uniform vec3 uCrimson;
  uniform float uOpacity;

  varying float vPulse;
  varying float vFade;

  void main() {
    // Soft round point; discard the corners so it never reads as a square.
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, d);

    // Blue at rest, crimson where the writing head is passing — the same
    // two-hue meaning the mark carries: system in blue, the live human note
    // in crimson.
    vec3 color = mix(uBlue, uCrimson, smoothstep(0.15, 0.85, vPulse));
    color *= 0.85 + vPulse * 2.6;

    gl_FragColor = vec4(color, alpha * uOpacity * (0.4 + vFade * 0.6));
  }
`

export function VitalsField({ progress, reducedMotion, compact }: Props) {
  const count = compact ? 1400 : 4200
  const geometry = useMemo(() => buildLattice(count), [count])

  const uniforms = useMemo(() => {
    const c = brandPalette()
    return {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPulseRate: { value: 0.32 },
      uSize: { value: compact ? 0.05 : 0.06 },
      uBlue: { value: new THREE.Color(c.blue400) },
      uCrimson: { value: new THREE.Color(c.crimson500) },
      uOpacity: { value: 0.85 },
    }
  }, [compact])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms],
  )

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  const group = useRef<THREE.Group>(null)

  // Writing uniforms in useFrame is the r3f pattern: the render loop drives
  // the GPU directly and never re-renders React, which is the whole point of
  // the progress-ref hero. The immutability rule cannot see that.
  /* oxlint-disable react/immutability */
  useFrame((state) => {
    const u = material.uniforms

    if (reducedMotion) {
      // Frozen mid-beat, field settled open — a composed still, not a
      // half-collapsed frame.
      u.uTime.value = 0.82
      u.uProgress.value = 0.55
      return
    }

    const t = state.clock.elapsedTime
    const p = progress.current

    u.uTime.value = t
    u.uProgress.value = p
    // Rate climbs slightly through the scroll — the system coming alive.
    u.uPulseRate.value = 0.32 + p * 0.2
    u.uOpacity.value = 0.85 + p * 0.15

    if (group.current) {
      // Barely-there tilt, so the field has a plane without spinning.
      group.current.rotation.y = Math.sin(t * 0.08) * 0.07 + p * 0.18
      group.current.rotation.x = Math.sin(t * 0.11) * 0.04
    }
  })
  /* oxlint-enable react/immutability */

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  )
}
