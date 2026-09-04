import * as THREE from 'three'

/**
 * The Valentia V, rebuilt from the logo's own proportions.
 *
 * Traced from the source mark (284x227px, aspect 1.251):
 *   - blue stroke:    constant ~78px width, descending rightward at ~0.6px/row
 *   - crimson stroke: ~73px width, mirrored descent, with a folded plane at the top
 *   - both strokes converge to a single vertex at the bottom
 *
 * Coordinates below are normalised to the mark's bounding box (0..1 across,
 * 0..1 down) and then centred, so the geometry keeps the logo's real
 * proportions instead of an eyeballed approximation.
 */

const ASPECT = 1.251

/** Normalised mark-space (x right, y down) -> centred model space (y up). */
function toModel(x: number, y: number): [number, number] {
  return [(x - 0.5) * ASPECT, -(y - 0.5)]
}

/** Blue limb: the descending left stroke, tapering into the base vertex. */
function blueShape(): THREE.Shape {
  // Traced leading/trailing edges, normalised from the pixel spans.
  const pts: Array<[number, number]> = [
    [0.014, 0.132], // top outer
    [0.289, 0.132], // top inner
    [0.545, 0.749], // inner edge down to the vertex shoulder
    [0.437, 0.978], // vertex
    [0.394, 0.978],
    [0.014, 0.146],
  ]
  const s = new THREE.Shape()
  pts.forEach(([x, y], i) => {
    const [mx, my] = toModel(x, y)
    i === 0 ? s.moveTo(mx, my) : s.lineTo(mx, my)
  })
  s.closePath()
  return s
}

/** Crimson limb: the ascending right stroke plus the folded top plane. */
function crimsonShape(): THREE.Shape {
  const pts: Array<[number, number]> = [
    [0.687, 0.000], // fold apex
    [0.905, 0.044], // fold outer corner
    [0.965, 0.132],
    [0.606, 0.978], // vertex
    [0.454, 0.978],
    [0.539, 0.771],
    [0.782, 0.185], // inner edge of the fold
    [0.612, 0.132],
  ]
  const s = new THREE.Shape()
  pts.forEach(([x, y], i) => {
    const [mx, my] = toModel(x, y)
    i === 0 ? s.moveTo(mx, my) : s.lineTo(mx, my)
  })
  s.closePath()
  return s
}

const EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: 0.17,
  bevelEnabled: true,
  bevelThickness: 0.018,
  bevelSize: 0.014,
  bevelSegments: 3,
  curveSegments: 8,
}

/**
 * Builds both limbs as extruded, bevelled solids. The caller disposes them.
 * Centred on the origin so the pair rotates about its own middle.
 */
export function createVLimbs(): {
  blue: THREE.ExtrudeGeometry
  crimson: THREE.ExtrudeGeometry
} {
  const blue = new THREE.ExtrudeGeometry(blueShape(), EXTRUDE)
  const crimson = new THREE.ExtrudeGeometry(crimsonShape(), EXTRUDE)
  // Extrusion runs 0..depth in z; recentre so the solid straddles z=0.
  blue.translate(0, 0, -EXTRUDE.depth! / 2)
  crimson.translate(0, 0, -EXTRUDE.depth! / 2)
  blue.computeVertexNormals()
  crimson.computeVertexNormals()
  return { blue, crimson }
}

/**
 * Sample points along the V's outline. Used to anchor the data pathways to the
 * mark itself, so the network reads as growing out of the logo geometry.
 */
export function sampleVOutline(count: number): THREE.Vector3[] {
  const shapes = [blueShape(), crimsonShape()]
  const out: THREE.Vector3[] = []
  for (const shape of shapes) {
    const pts = shape.getSpacedPoints(Math.ceil(count / 2))
    for (const p of pts) out.push(new THREE.Vector3(p.x, p.y, 0))
  }
  return out
}

export const V_ASPECT = ASPECT
