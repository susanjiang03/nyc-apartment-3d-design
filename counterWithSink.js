import * as THREE from 'three';

const texLoader = new THREE.TextureLoader();

const marbleTex = texLoader.load('texture/marble.jpg');
marbleTex.wrapS = THREE.RepeatWrapping;
marbleTex.wrapT = THREE.RepeatWrapping;
marbleTex.repeat.set(1, 1);   // tile pattern

export function createCounterWithSink() {
    const group = new THREE.Group();

  // -------- sizes (in world units) --------
  const counterWidth   = 2.0;   // left–right
  const counterDepth   = 0.6;   // front–back
  const counterThick   = 0.08;  // thickness of wood top

  const sinkOuterW     = 0.7;
  const sinkOuterD     = 0.45;
  const sinkDepth      = 0.22;
  const sinkRimThick   = 0.015;

  // -------- materials --------
  // marble for counter top
  const marbleMat = new THREE.MeshStandardMaterial({
    map: marbleTex,
    roughness: 0.35,   // a bit glossy
    metalness: 0.0
  });

  const metalMat = new THREE.MeshPhysicalMaterial({
    color: 0xd0d0d0,
    metalness: 0.95,
    roughness: 0.35,
    reflectivity: 0.9
  });

  // -------- countertop (wood slab) --------
  const counterGeo = new THREE.BoxGeometry(
    counterWidth,
    counterThick,
    counterDepth
  );
  const counterTop = new THREE.Mesh(counterGeo, marbleMat);
  counterTop.castShadow = true;
  counterTop.receiveShadow = true;
  group.add(counterTop);

  // y helper: top surface of the wood
  const yTop = counterThick / 2;

  // -------- sink rim (thin rectangle sitting on top) --------
  const rimGeo = new THREE.BoxGeometry(
    sinkOuterW,
    sinkRimThick,
    sinkOuterD
  );
  const rim = new THREE.Mesh(rimGeo, metalMat);
  rim.position.set(0, yTop + sinkRimThick / 2 + 0.001, 0); // center
  group.add(rim);

  // -------- sink basin (metal box going down) --------
  const basinGeo = new THREE.BoxGeometry(
    sinkOuterW - 0.03,
    sinkDepth,
    sinkOuterD - 0.03
  );
  const basin = new THREE.Mesh(basinGeo, metalMat);
  // start just below the rim and go down into the counter
  basin.position.set(0, yTop - sinkDepth / 2 + 0.002, 0);
  group.add(basin);

  // -------- drain (small dark circle at bottom) --------
  const drainGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.01, 24);
  const drainMat = new THREE.MeshStandardMaterial({
    color: 0x555555,
    metalness: 0.8,
    roughness: 0.4
  });
  const drain = new THREE.Mesh(drainGeo, drainMat);
  drain.rotation.x = Math.PI / 2;
  drain.position.set(0, yTop - sinkDepth + 0.01, 0);
  group.add(drain);

  // optional: lift whole thing so the bottom of the counter sits at y = 0
  group.position.y = counterThick / 2;

  return group;
    
}