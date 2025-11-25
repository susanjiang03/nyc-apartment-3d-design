import * as THREE from 'three';

// Borrowed and adapted from Dr Li's example - queen.js
function createBaseGeometry(radialSegments = 32, heightSegments = 40) {
  // Define base profile in xy plane (x = radius, y = height)
  // Profile goes from bottom (y=0) to top (y=height)
  const profile = [
    { r: 0.0, y: 0.0 },      // Bottom center point
    { r: 0.4, y: 0.0 },      // Base bottom
    { r: 0.45, y: 0.1 },     // Base top
    { r: 0.4, y: 0.2 },      // Base taper
    { r: 0.4, y: 0.3 },     // Body start
    // { r: 0.3, y: 0.4 },      // Body taper
    { r: 0.3, y: 0.35 },     // Neck start
    // { r: 0.2, y: 0.6},      // Neck
    { r: 0.25, y: 0.3 },     // Head base
  ];

  const numProfilePoints = profile.length;
  const positions = new Float32Array((radialSegments + 1) * numProfilePoints * 3);
  const uvs = new Float32Array((radialSegments + 1) * numProfilePoints * 2);
  
  // Generate vertices by revolving the profile around y-axis
  let p = 0, t = 0;
  for (let i = 0; i <= radialSegments; i++) {
    const angle = (i / radialSegments) * 2 * Math.PI;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    for (let j = 0; j < numProfilePoints; j++) {
      const point = profile[j];
      const x = point.r * cos;
      const y = point.y;
      const z = point.r * sin;
      
      positions[p++] = x;
      positions[p++] = y;
      positions[p++] = z;
      
      uvs[t++] = i / radialSegments;
      uvs[t++] = j / (numProfilePoints - 1);
    }
  }

  // Generate indices for the surface
  // Each quad becomes 2 triangles
  // We need radialSegments quads to close the surface completely
  const numQuads = radialSegments * (numProfilePoints - 1);
  const indices = new Uint32Array(numQuads * 6);
  
  let k = 0;
  for (let i = 0; i < radialSegments; i++) {
    for (let j = 0; j < numProfilePoints - 1; j++) {
      const a = i * numProfilePoints + j;
      // For the last segment (i = radialSegments - 1), connect to ring 0 to close the surface
      // Otherwise connect to ring i+1
      const nextI = (i === radialSegments - 1) ? 0 : (i + 1);
      const b = nextI * numProfilePoints + j;
      const c = nextI * numProfilePoints + (j + 1);
      const d = i * numProfilePoints + (j + 1);
      
      // First triangle
      indices[k++] = a;
      indices[k++] = b;
      indices[k++] = d;
      
      // Second triangle
      indices[k++] = b;
      indices[k++] = c;
      indices[k++] = d;
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geom.setIndex(new THREE.BufferAttribute(indices, 1));
  geom.computeVertexNormals();
  return geom;
}


export function createSnowGlobe() {
    const globe = new THREE.Group();
    const glassRadius = 0.5;
    const baseHeight = 0.5;

    // --------------------
    // Glass sphere
    // --------------------
    const glassMesh = new THREE.Mesh(
        new THREE.SphereGeometry(glassRadius, 48, 32),
            new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.25,
            transmission: 1.0,   // glassy
            roughness: 0.05,
            metalness: 0.0,
            ior: 1.5,
            thickness: 0.2,
            side: THREE.DoubleSide
        })
    );
    glassMesh.position.y = baseHeight + glassRadius;
    globe.add(glassMesh);

    // --------------------
    // Base (red)
    // --------------------
    const baseMesh = new THREE.Mesh(
        createBaseGeometry(32, 40),
        new THREE.MeshStandardMaterial({
            color: 0xc62828,   // red base
            metalness: 0.2,
            roughness: 0.6
        })
    );
    baseMesh.position.y = baseHeight / 2;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    globe.add(baseMesh);

    return globe;
};