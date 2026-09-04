import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createVLimbs } from '@/lib/vGeometry'
import { brandPalette } from './palette'

type Props = { reducedMotion: boolean }

/**
 * The Valentia V as a solid, bevelled form — the centre of the Digital
 * Healthcare Core. Deliberately not a spinning logo: it holds an almost-still
 * three-quarter attitude and breathes, so it reads as architecture.
 */
export function VCore({ reducedMotion }: Props) {
  const group = useRef<THREE.Group>(null)
  const { blue, crimson } = useMemo(() => createVLimbs(), [])
  const c = useMemo(() => brandPalette(), [])

  useEffect(() => {
    return () => {
      blue.dispose()
      crimson.dispose()
    }
  }, [blue, crimson])

  // Pointer parallax, damped — the form leans toward the cursor rather than tracking it.
  const target = useRef({ x: 0, y: 0 })
  useFrame((state, delta) => {
    if (!group.current) return
    const g = group.current

    if (reducedMotion) {
      g.rotation.set(-0.09, -0.34, 0)
      return
    }

    const t = state.clock.elapsedTime
    const px = state.pointer.x
    const py = state.pointer.y

    target.current.x = -0.34 + px * 0.22
    target.current.y = -0.09 - py * 0.14

    // Damped follow keeps motion calm regardless of framerate.
    const k = 1 - Math.pow(0.001, delta)
    g.rotation.y += (target.current.x - g.rotation.y) * k
    g.rotation.x += (target.current.y - g.rotation.x) * k

    // Slow breathing drift so the form is never fully static.
    g.position.y = Math.sin(t * 0.36) * 0.045
    g.rotation.z = Math.sin(t * 0.22) * 0.018
  })

  return (
    <group ref={group} scale={1.72}>
      <mesh geometry={blue} castShadow receiveShadow>
        <meshStandardMaterial
          color={c.blue600}
          metalness={0.62}
          roughness={0.28}
          envMapIntensity={1.1}
        />
      </mesh>
      <mesh geometry={crimson} castShadow receiveShadow>
        <meshStandardMaterial
          color={c.crimson600}
          metalness={0.62}
          roughness={0.3}
          envMapIntensity={1.1}
        />
      </mesh>
    </group>
  )
}
