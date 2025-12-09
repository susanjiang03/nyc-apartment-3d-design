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
  const counterThick   = 0.08;  // thickness of top
  const counterHeight = 1;

  const sinkOuterW     = 0.7;
  const sinkOuterD     = 0.45;
  const sinkDepth      = 0.4;
  const sinkRimThick   = 0.015;

  // -------- materials --------
  const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.2 });

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

  // -------- countertop --------
  const counterGeo = new THREE.BoxGeometry(
    counterWidth,
    counterThick,
    counterDepth
  );
  const counterTop = new THREE.Mesh(counterGeo, marbleMat);
  counterTop.castShadow = true;
  counterTop.receiveShadow = true;
  counterTop.position.set(0,counterHeight, 0);
  group.add(counterTop);

  // y helper: top surface of the marbeled counter
  const yTop = counterThick / 2;

  // left panel
  const leftPanelGeo = new THREE.BoxGeometry(
    0.05,
    counterHeight,
    counterDepth
  );
  const leftPanel = new THREE.Mesh(leftPanelGeo, whiteMaterial);
  leftPanel.position.set(
    -counterWidth / 2 + 0.025,
    counterHeight/2,
    0
  );
  group.add(leftPanel);
  
  // right panel
  const rightPanelGeo = new THREE.BoxGeometry(
    0.05,
    counterHeight,
    counterDepth
  );
  const rightPanel = new THREE.Mesh(rightPanelGeo, whiteMaterial);
    rightPanel.position.set(
    counterWidth / 2 - 0.025,
    counterHeight/2,
    0
  );
  group.add(rightPanel);

//   //front panel
//   const frontPanelGeo = new THREE.BoxGeometry(
//     counterWidth,
//     counterHeight,
//     0.05,
//   );
//   const frontPanel = new THREE.Mesh(frontPanelGeo, whiteMaterial);
//   frontPanel.position.set(
//     0,
//     counterHeight/2,
//     counterDepth
//   );
//   group.add(frontPanel);

  // -------- sink basin  --------
  const basinGeo = new THREE.BoxGeometry(
    sinkOuterW - 0.03,
    sinkDepth,
    sinkOuterD - 0.03
  );
  const basin = new THREE.Mesh(basinGeo, metalMat);
  basin.position.set(0, yTop - sinkDepth / 2 + 0.002 + counterHeight, 0);
  group.add(basin);

  //faucet
  const faucetHeight = 0.4;
  const faucetGeo = new THREE.CylinderGeometry(0.02, 0.02, faucetHeight, 16);
  const faucet = new THREE.Mesh(faucetGeo, metalMat);
  faucet.position.set(0,faucetHeight, -0.2);
  basin.add(faucet);

  // spout
  const spoutGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.2, 16);
  const spout = new THREE.Mesh(spoutGeo, metalMat);
  spout.position.set(0, faucetHeight - 0.2, 0.05);
  spout.rotation.x = -Math.PI / 2;
  faucet.add(spout);

  // optional: lift whole thing so the bottom of the counter sits at y = 0
  group.position.y = counterThick / 2;

  return group;
    
}