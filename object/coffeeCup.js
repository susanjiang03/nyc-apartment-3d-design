import * as THREE from 'three';

  // Borrowed from bin.js in [Week 11 Mesh Objects and 3D Scene]
export function createCoffeeCup(){

// Coffee cup dimensions
  const radius = 0.4;      // Outer radius (width)
  const height = 1.2;      // Height (taller than width)
  const thickness = 0.05;  // Wall thickness
  const innerRadius = radius - thickness; // Inner radius
  const numSides = 9;      // Holygon

  const vertices = [];
  const indices = [];
  let vertexIndex = 0;

  // Helper function to create a polygon at a given height
  function createPolygon(y, r) {
      const hexVerts = [];
      for (let i = 0; i < numSides; i++) {
        const angle = (i / numSides) * Math.PI * 2;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        hexVerts.push({ x, y, z });
      }
      return hexVerts;
    }

    // Create outer and inner polygon at bottom and top
    const bottomOuter = createPolygon(0, radius*0.8);
    const bottomInner = createPolygon(0, innerRadius);
    const topOuter = createPolygon(height, radius*1.2);
    const topInner = createPolygon(height, innerRadius);

    // Add vertices for outer polygon
    const bottomOuterStart = vertexIndex;
    bottomOuter.forEach(v => {
      vertices.push(v.x, v.y, v.z);
      vertexIndex++;
    });

    const topOuterStart = vertexIndex;
    topOuter.forEach(v => {
      vertices.push(v.x, v.y, v.z);
      vertexIndex++;
    });

    // Add vertices for inner polygon
    const bottomInnerStart = vertexIndex;
    bottomInner.forEach(v => {
      vertices.push(v.x, v.y, v.z);
      vertexIndex++;
    });

    const topInnerStart = vertexIndex;
    topInner.forEach(v => {
      vertices.push(v.x, v.y, v.z);
      vertexIndex++;
    });

    // Create solid wall faces
    // Each side connects outer polygon to inner polygon, forming a solid wall
    for (let i = 0; i < numSides; i++) {
      const next = (i + 1) % numSides;
      
      // Outer vertices
      const ob1 = bottomOuterStart + i;  // outer bottom current
      const ob2 = bottomOuterStart + next; // outer bottom next
      const ot1 = topOuterStart + i;     // outer top current
      const ot2 = topOuterStart + next;  // outer top next
      
      // Inner vertices
      const ib1 = bottomInnerStart + i;  // inner bottom current
      const ib2 = bottomInnerStart + next; // inner bottom next
      const it1 = topInnerStart + i;     // inner top current
      const it2 = topInnerStart + next;  // inner top next

      // Outer face (facing outward, CCW when viewed from outside)
      // Quad: ob1(bottom-left) → ob2(bottom-right) → ot2(top-right) → ot1(top-left)
      indices.push(ob1, ob2, ot2);  // Triangle 1: ob1 → ob2 → ot2 (CCW)
      indices.push(ob1, ot2, ot1);  // Triangle 2: ob1 → ot2 → ot1 (CCW)

      // Inner face (facing inward, CCW when viewed from outside)
      // Quad: ib1(bottom-left) → ib2(bottom-right) → it2(top-right) → it1(top-left)
      indices.push(ib1, ib2, it2);  // Triangle 1: ib1 → ib2 → it2 (CCW from outside)
      indices.push(ib1, it2, it1);  // Triangle 2: ib1 → it2 → it1 (CCW from outside)

    }

    // Create top rim (connecting outer and inner polygons at the top)
    for (let i = 0; i < numSides; i++) {
      const next = (i + 1) % numSides;
      
      const ot1 = topOuterStart + i;     // outer top current
      const ot2 = topOuterStart + next;  // outer top next
      const it1 = topInnerStart + i;     // inner top current
      const it2 = topInnerStart + next;  // inner top next

      // Top rim face (connecting outer to inner at top edge, CCW when viewed from above)
      // Quad: ot1(outer-left) → ot2(outer-right) → it2(inner-right) → it1(inner-left)
      indices.push(ot1, ot2, it2);  // Triangle 1: ot1 → ot2 → it2 (CCW from above)
      indices.push(ot1, it2, it1);  // Triangle 2: ot1 → it2 → it1 (CCW from above)
    }

    // Create bottom cap (outer polygon with inner hole)
    // Add center point for outer polygon
    const bottomOuterCenter = vertexIndex;
    vertices.push(0, 0, 0);
    vertexIndex++;
    
    // Outer ring triangles (fan from center, CCW when viewed from below)
    // Normal should point down, so CCW from below: center → next → current
    for (let i = 0; i < numSides; i++) {
      const next = (i + 1) % numSides;
      indices.push(bottomOuterCenter, bottomOuterStart + next, bottomOuterStart + i);
    }

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // Cup material
    const cupMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    // Create mesh
    var coffeeCup = new THREE.Mesh(geometry, cupMat);
    coffeeCup.castShadow = true;
    coffeeCup.receiveShadow = true;
    coffeeCup.position.y = 0.1; // Move coffee cup up a little

  // --- Handle ---
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(radius - 0.05, thickness * 0.6, 12, 48, -Math.PI/180*190),
    // new THREE.TorusGeometry(0.28 * 0.98, 0.015, 12, 48),
    cupMat
  );
  handle.rotation.z = Math.PI/2;
  handle.position.x = radius + thickness * 0.5;
  handle.position.y = height/2;
  coffeeCup.add(handle);

  return coffeeCup;

}
