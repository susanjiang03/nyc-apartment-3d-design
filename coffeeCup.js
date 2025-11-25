import * as THREE from 'three';

export function createCoffeeCup(){

const cupHeight = 1.8;
  const outerRadius = 0.7;
  const wallThickness = 0.12;
  const innerRadius = outerRadius - wallThickness;

  const cupMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  const cup = new THREE.Group();

  // --- 1. Outer wall ---
  const outerGeo = new THREE.CylinderGeometry(
    outerRadius,
    outerRadius,
    cupHeight,
    32,
    1,
    true            // open ended (no caps)
  );
  const outerWall = new THREE.Mesh(outerGeo, cupMat);
  outerWall.castShadow = true;
  outerWall.receiveShadow = true;
  cup.add(outerWall);

  // --- 2. Inner wall ---
  const innerGeo = new THREE.CylinderGeometry(
    innerRadius,
    innerRadius,
    cupHeight - 0.03,  // slightly shorter so no z-fighting
    32,
    1,
    true
  );
  const innerWall = new THREE.Mesh(innerGeo, cupMat);
  innerWall.position.y = 0.015; // slightly up to avoid overlapping
  innerWall.castShadow = true;
  innerWall.receiveShadow = true;
  cup.add(innerWall);

  // --- 3. Bottom disk (solid) ---
  const bottomGeo = new THREE.CircleGeometry(innerRadius, 32);
  const bottom = new THREE.Mesh(bottomGeo, cupMat);
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.y = -cupHeight / 2 + 0.01;
  cup.add(bottom);

  // --- 4. Handle ---
  const handleGeo = new THREE.TorusGeometry(
    outerRadius - 0.05,
    wallThickness * 0.6,
    16,
    32
  );
  const handle = new THREE.Mesh(handleGeo, cupMat);
  handle.rotation.z = Math.PI / 2;
  handle.position.x = outerRadius + wallThickness * 0.5;
  handle.position.y = 0.1;
  cup.add(handle);

  // place bottom at y = 0
  cup.position.y = cupHeight / 2;

  return cup;

}
