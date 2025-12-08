import * as THREE from 'three';

export function createPlant() {

  const plant = new THREE.Group();

  // ========= POT =========
  const potHeight = 0.23;
  const potRadiusTop = 0.17;
  const potRadiusBottom = 0.14;

  // outer pot
  const potOuterGeom = new THREE.CylinderGeometry(
    potRadiusTop,
    potRadiusBottom,
    potHeight,
    32
  );
  const potMat = new THREE.MeshStandardMaterial({
    color: 0xb8723c,   // warm terracotta
    roughness: 0.85,
    metalness: 0.05
  });
  const potOuter = new THREE.Mesh(potOuterGeom, potMat);
  potOuter.castShadow = true;
  potOuter.receiveShadow = true;
  plant.add(potOuter);

  // soil
  const soilGeom = new THREE.CylinderGeometry(
    potRadiusTop * 0.95,
    potRadiusTop * 0.95,
    potHeight * 0.35,
    32
  );
  const soilMat = new THREE.MeshStandardMaterial({
    color: 0x2e2216,
    roughness: 0.9
  });
  const soil = new THREE.Mesh(soilGeom, soilMat);
  soil.position.y = potHeight * 0.2;
  soil.castShadow = true;
  soil.receiveShadow = true;
  plant.add(soil);

  // ========= LEAF GEOMETRY =========
  const leafGeom = createCurvedTwistedLeafGeometry();
  const leafMat = new THREE.MeshStandardMaterial({
    vertexColors: true,      // use per-vertex colors for gradient
    roughness: 0.45,
    metalness: 0.05
  });

  const leafCount = 12;
  const baseY = potHeight * 0.35;

  for (let i = 0; i < leafCount; i++) {
    const leaf = new THREE.Mesh(leafGeom, leafMat);
    leaf.castShadow = true;
    leaf.receiveShadow = true;

    // random around center
    const angle = Math.random() * Math.PI * 2;
    const dist = THREE.MathUtils.randFloat(0.01, potRadiusTop * 0.25);

    leaf.position.set(
      Math.cos(angle) * dist,
      baseY + THREE.MathUtils.randFloat(-0.01, 0.03),
      Math.sin(angle) * dist
    );

    // point leaf roughly outward from center
    leaf.rotation.y = angle + THREE.MathUtils.randFloat(-0.2, 0.2);

    // tilt outward (like growing up and out)
    leaf.rotation.z = THREE.MathUtils.randFloat(-0.9, -0.3);

    // random size
    const s = THREE.MathUtils.randFloat(0.8, 1.3);
    leaf.scale.set(s, s, s);

    plant.add(leaf);
  }

  return plant;
}

// ==========================================
// Curved + twisted, thick leaf with gradient
// ==========================================
function createCurvedTwistedLeafGeometry() {
  const leafLength = 0.5;
  const leafWidth  = 0.28;
  const thickness  = 0.03;

  // 1) define a 2D leaf outline (top-down)
  const shape = new THREE.Shape();
  shape.moveTo(0, 0); // base
  shape.quadraticCurveTo( leafWidth * 0.5, leafLength * 0.35, 0, leafLength);
  shape.quadraticCurveTo(-leafWidth * 0.5, leafLength * 0.35, 0, 0);

  // 2) extrude to give thickness
  const extrudeSettings = {
    depth: thickness,
    bevelEnabled: false,
    steps: 40,
    curveSegments: 32
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // 3) move base to origin (so we can place it easily at soil level)
  geom.computeBoundingBox();
  const box = geom.boundingBox;
  const offsetY = box.min.y;      // base is at min.y
  const offsetZ = (box.min.z + box.max.z) / 2; // center thickness

  geom.translate(0, -offsetY, -offsetZ);

  // Now Y = 0 at base, Y ~ leafLength at tip.

  // 4) Apply curvature + twist + slight taper to the positions
  const pos = geom.attributes.position;
  const vertexCount = pos.count;
  const leafTotalLength = box.max.y - box.min.y; // original length

  const bendAmount  = 0.18;       // how far it curves forward
  const twistAmount = Math.PI / 3; // total twist from base to tip

  for (let i = 0; i < vertexCount; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i); // along leaf
    let z = pos.getZ(i);

    // normalized along leaf [0..1]
    const t = THREE.MathUtils.clamp(y / leafTotalLength, 0, 1);

    // make width taper slightly at the tip
    const taper = 1.0 - 0.4 * t;
    x *= taper;

    // bend forward: push z with a smooth curve
    let zbend = Math.sin(t * Math.PI) * bendAmount;
    z += zbend;

    // twist around Y (stem axis)
    const angle = (t - 0.2) * twistAmount;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const xt = x * cos - z * sin;
    const zt = x * sin + z * cos;

    pos.setXYZ(i, xt, y, zt);
  }
  pos.needsUpdate = true;
  geom.computeVertexNormals();

  // 5) Add vertex colors: darker at base, lighter at tip
  const colors = new Float32Array(vertexCount * 3);
  const color = new THREE.Color();
  for (let i = 0; i < vertexCount; i++) {
    const y = pos.getY(i);
    const t = THREE.MathUtils.clamp(y / leafTotalLength, 0, 1);

    // base: dark green, tip: brighter / more yellow
    color.setHSL(0.33, 0.75, 0.25 + 0.2 * t); // HSL greenish gradient

    colors[i * 3 + 0] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  return geom;
}