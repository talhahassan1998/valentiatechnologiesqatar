import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { brandPalette } from './palette'

/**
 * Layered grid planes receding behind the core. These carry the "digital
 * architecture" half of the concept — structure and infrastructure, as opposed
 * to the organic movement of the pathways.
 */

type Props = { reducedMotion: boolean }

function gridGeometry(size: number, divisions: number): THREE.BufferGeometry {
  const pts: number[] = []
  const half = size / 2
  const step = size / divisions
  for (let i = 0; i <= divisions; i++) {
    const p = -half + i * step
    pts.push(-half, p, 0, half, p, 0)
    pts.push(p, -half, 0, p, half, 0)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return g
}

export function ArchitectureGrid({ reducedMotion }: Props) {
  const geo = useMemo(() => gridGeometry(16, 16), [])
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current || reducedMotion) return
    // Barely-there drift; the grid should feel like it is settling, not moving.
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.03
  })

  const layers = [
    { z: -5.5, opacity: 0.055 },
    { z: -8.0, opacity: 0.04 },
    { z: -11.0, opacity: 0.028 },
  ]

  return (
    <group ref={group}>
      {layers.map((l) => (
        <lineSegments key={l.z} geometry={geo} position={[0, 0, l.z]}>
          <lineBasicMaterial
            color={brandPalette().blue500}
            transparent
            opacity={l.opacity}
            depthWrite={false}
          />
        </lineSegments>
      ))}
    </group>
  )
}
