import * as THREE from 'three';

export function createDiningLight() {

  const group = new THREE.Group();

  const barLength = 2.4;
  const rodHeight = 1.8;
  const globeRadius = 0.12;

  // ----- materials -----
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xC9A66B,   // warm brass/gold
    metalness: 0.9,
    roughness: 0.25
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    transmission: 1.0,
    roughness: 0.05,
    metalness: 0.0,
    ior: 1.5,
    thickness: 0.08,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.0   // soft self-glow
  });

  // ----- ceiling plate -----
  const plateGeo = new THREE.BoxGeometry(barLength * 0.7, 0.04, 0.16);
  const plate = new THREE.Mesh(plateGeo, brassMat);
  plate.position.y = 0;
  group.add(plate);

  // ----- two hanging rods -----
  const rodRadius = 0.01;
  const rodGeo = new THREE.CylinderGeometry(rodRadius, rodRadius, rodHeight, 12);

  const rodOffsetX = (barLength * 0.4) / 2;

  function makeRod(sign) {
    const rod = new THREE.Mesh(rodGeo, brassMat);
    rod.position.set(sign * rodOffsetX, -rodHeight / 2, 0);
    rod.castShadow = true;
    rod.receiveShadow = true;
    group.add(rod);
  }

  makeRod(-1);
  makeRod(1);

  // ----- horizontal bar -----
  const barHeight = 0.02;
  const barDepth = 0.05;
  const barGeo = new THREE.BoxGeometry(barLength, barHeight, barDepth);
  const bar = new THREE.Mesh(barGeo, brassMat);
  bar.position.y = -rodHeight;
  group.add(bar);

  // ----- globes + lights -----
  const globeY = bar.position.y - globeRadius - barHeight / 2;
  const spacing = barLength / 4; // 5 globes → 4 segments

  var bulbs = [];

  for (let i = 0; i < 5; i++) {
    const x = -barLength / 2 + i * spacing;

    // glass globe
    const globeGeo = new THREE.SphereGeometry(globeRadius, 24, 16);
    const globe = new THREE.Mesh(globeGeo, glassMat);
    globe.position.set(x, globeY, 0);
    globe.castShadow = true;
    globe.receiveShadow = false;
    group.add(globe);

    // inner light
    const bulb = new THREE.PointLight(0xffffff, 0, 3.5);
    bulb.position.set(0, 0, 0);        // center of globe
    bulb.castShadow = true;
    bulbs.push(bulb);
    globe.add(bulb);
  }

  group.userData = { bulbs };

  // put plate near y = 0 so you can position whole fixture by group.position.y
  return group;
}