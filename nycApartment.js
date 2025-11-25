import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createBookshelf } from './bookshelf.js';
import { createSChair } from './modernChair.js';
import { createCeilingFan } from './ceilingFan.js';

// ---------------------------------------------------------
// 1) Basic scene setup
// ---------------------------------------------------------
const scene = new THREE.Scene();

// A neutral camera looking slightly down at the origin
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(5, 4, 8);
// camera.position.set(3, 0, 0);
camera.lookAt(0, 1, 0);

// WebGL renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// Keep pixel ratio reasonable for performance
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1)); // can change to 2
// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);  // add the canvas created automatically in memory

// Orbit controls for exploration
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0); // Normally, right after creating your OrbitControls object, you call controls.target.set(x, y, z) once — to place the orbit center at the same point your camera is looking at.
controls.update();//controls.update() recalculates the camera’s orientation so that it looks at the current controls.target, and applies any pending parameter changes (like damping, zoom limits, etc.).
                  // it synchronizes the camera with the new target — that’s the one-time alignment

// Helpers 
// adding axes
const axes = new THREE.AxesHelper(0.5); // X=red, Y=green, Z=blue
axes.position.y = 3.6;            // above the 0.1-tall ground box
//axes.position.x = 2;
axes.renderOrder = 999;

scene.add(axes);

// adding grid
const grid = new THREE.GridHelper(20, 20, 0x666666, 0x444444);
grid.position.y = 0.001;         // tiny lift above ground
scene.add(grid);

// Add lights for MeshStandardMaterial objects
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = false; // Disabled to prevent fan shadows in corners
scene.add(directionalLight);

// 2) Materials (using MeshStandardMaterial for shadows)
const matDarkGrey  = new THREE.MeshStandardMaterial({ color: 0x444b52 });
const matLightGrey = new THREE.MeshStandardMaterial({ color: 0xa0a8b0 });
const matAccent    = new THREE.MeshBasicMaterial({ color: 0xf0c040 }); // "light" color - keep basic for light bulb
const matBlack     = new THREE.MeshStandardMaterial({ color: 0xaaeeaa });
const matBlue      = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
const matLightBrown = new THREE.MeshStandardMaterial({ color: 0xda8c38 });
const matGrey = new THREE.MeshStandardMaterial({ color: 0x808080 }); // grey for walls/ceiling/floor
const endTableBrown = new THREE.MeshStandardMaterial({ color: 0x786f63});
const matWhite = new THREE.MeshBasicMaterial({ color: 0xe8dacd});

// 3) Build floor extending down like a building
{
  const buildingHeight = 20; // extend downward
  const groundGeo = new THREE.BoxGeometry(10, buildingHeight, 10);
  const ground = new THREE.Mesh(groundGeo, matGrey);
  ground.position.set(0, -buildingHeight/2 + 0.1, 0); // apartment floor at y=0.1
  ground.receiveShadow = true;
  scene.add(ground);
}

// 4) Build a left wall for context
{
  const leftWallGeo = new THREE.BoxGeometry(0.1, 6, 10);
  const leftWall = new THREE.Mesh(leftWallGeo, matGrey);
  leftWall.position.set(-5, 3, 0);
  leftWall.receiveShadow = true;
  scene.add(leftWall);
}

// 5) Build a back wall for context
{
  const backWallGeo = new THREE.BoxGeometry(10, 6, 0.1);
  const backWall = new THREE.Mesh(backWallGeo, matGrey);
  backWall.position.set(0, 3, -5);
  backWall.receiveShadow = true;
  scene.add(backWall);
}

// 6) Build a ceiling
{
  const ceilingGeo = new THREE.BoxGeometry(10, 0.1, 10);
  const ceiling = new THREE.Mesh(ceilingGeo, matGrey);
  ceiling.position.set(0, 6, 0);
  ceiling.receiveShadow = true;
  scene.add(ceiling);
}

// 7) Bookshelf
{
  const bookshelf = createBookshelf();
  bookshelf.position.set(-4.5, 0.1, 2);
  bookshelf.rotation.y = Math.PI / 2;
  bookshelf.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(bookshelf);
}

// 8) S-Chair
{
  const chair = createSChair();
  chair.position.set(3, 0.1, -3);
  chair.rotation.y = -Math.PI;
  chair.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(chair);
}

// 9) floating white desk
{
  const matWhite = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const deskWidth = 2.5;
  const deskDepth = 1.2;
  const deskThickness = 0.1;
  const deskHeight = 1.2;
  
  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(deskWidth, deskThickness, deskDepth),
    matWhite
  );
  desk.position.set(3, deskHeight, -4.4);
  desk.castShadow = true;
  desk.receiveShadow = true;
  scene.add(desk);
}

// 10) Ceiling Fan with integrated light
let ceilingFan;
let fanSpinning = false;
const fanRotationSpeed = 0.07; // radians per frame
{
  ceilingFan = createCeilingFan();
  ceilingFan.position.set(0, 6, 0);
  scene.add(ceilingFan);
  
  const fanLight = new THREE.PointLight(0xffffee, 60, 25);
  fanLight.position.set(0, 4.2, 0);
  fanLight.castShadow = true;
  fanLight.shadow.mapSize.width = 1024;
  fanLight.shadow.mapSize.height = 1024;
  scene.add(fanLight);
}


// ---------------------------------------------------------
// 11) Build a Round End Table
//    endTable
//      ├─ top (cylinder)
//      ├─ bottom (cylinder)
//      └─ 4 leg (cylinder) 
// ---------------------------------------------------------

const endTable = new THREE.Group();
scene.add(endTable);
const tableHeight = 0.15;
const tableRadius = 0.8;
const centerX = -4;
const centerZ = -4;
// -- Top 
const top = new THREE.Mesh(
  new THREE.CylinderGeometry(tableRadius, tableRadius, tableHeight, 32),
  endTableBrown
);
top.position.set(centerX, 1.5, centerZ);
top.castShadow = true;
top.receiveShadow = true;
endTable.add(top);
// -- Bottom
const bottom = new THREE.Mesh(
  new THREE.CylinderGeometry(tableRadius, tableRadius, tableHeight, 32),
  endTableBrown
);
bottom.position.set(centerX, 0.5, centerZ);
bottom.castShadow = true;
bottom.receiveShadow = true;
endTable.add(bottom);

// -- Legs (4 cylinders)
const legHeight = 1.65;
const legRadius = 0.8; 
const legY = 0.85; 
for (let i = 0; i < 4; i++) {
  const angle = i * (Math.PI / 2);
  const leg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, legHeight, 20),
    matLightGrey
  );
  
  leg.position.set(centerX + legRadius * Math.cos(angle), legY, centerZ + legRadius * Math.sin(angle));
  leg.castShadow = true;
  leg.receiveShadow = true;
  endTable.add(leg);
}

// ---------------------------------------------------------
// 12) Build a Coffee Table
//    coffeeTable
//      └─ 4 leg (cylinder) 
// ---------------------------------------------------------
const coffeeTable = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 2, 32),
);
// Scale X and Z to make it elliptical
const a = 2; // ellipse radius X
const b = 1.5; // ellipse radius Z
coffeeTable.scale.set(a, 0.2, b);  // scale Y=1 keeps the height
//TODO: change color
coffeeTable.material = new THREE.MeshPhysicalMaterial({
  color: 0xaad8ff,    // light blue tint (glass)
  transparent: true,
  opacity: 0.5,      // mostly see-through
  transmission: 1.0,  // real glass-style transparency
  roughness: 0.05,    // lower = sharper reflections
  metalness: 0.0,
  ior: 1.5,           // index of refraction (glass ~1.5)
  thickness: 0.05,    // how thick the glass looks
  side: THREE.DoubleSide
});;
coffeeTable.position.setY(0.75);
// -- Legs (4 cylinders)
const coffeeTableLegHeight = 2;
const coffeeTableLegRadius = 0.9; 
const coffeeTableLegY = 2; 
for (let i = 0; i < 4; i++) {
  const angle = Math.PI / 4 + i * (Math.PI / 2);
  const leg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, coffeeTableLegHeight, 20),
    //TODO: change color
    matLightGrey
  );
  //TODO: rotate legs
  leg.position.set(coffeeTableLegRadius * Math.cos(angle), -coffeeTableLegY, coffeeTableLegRadius * Math.sin(angle));
  coffeeTable.add(leg);
}
scene.add(coffeeTable);

// ---------------------------------------------------------
// 13) Build floorMat for context
// ---------------------------------------------------------
{
  const floorMatGeo = new THREE.BoxGeometry(7, 0.05, 7);
  const floorMat = new THREE.Mesh(floorMatGeo, matWhite);
  floorMat.position.set(0.2, 0.1, 0);   // sit slightly above y=0 grid lines
  scene.add(floorMat);  
}

// TODO: clean up lampRoot codes
// ---------------------------------------------------------
// 4) Build the street lamp with hierarchy
//    lampRoot
//      ├─ base (cylinder)
//      ├─ pole (cylinder)
//      └─ armPivot (empty group at hinge height) 
//          ├─ arm (box)
//          └─ headPivot (empty group at end of arm)
//             └─ headGroup
//                ├─ shade (cone)
//                ├─ bulb (sphere)
//                └─ rim (torus) 
// ---------------------------------------------------------
const lampRoot = new THREE.Group();
// scene.add(lampRoot);

// -- Base: wide cylinder near the ground
const baseHeight = 0.3;
const base = new THREE.Mesh(
  new THREE.CylinderGeometry(0.6, 0.8, baseHeight, 32),
  matDarkGrey
);
base.position.set(0, baseHeight / 2, 0);
lampRoot.add(base);

// -- Pole: tall, slender cylinder rising from the base
const poleHeight = 3.0;
const pole = new THREE.Mesh(
  new THREE.CylinderGeometry(0.12, 0.12, poleHeight, 20),
  matLightGrey
);
pole.position.set(0, baseHeight + poleHeight / 2, 0);
lampRoot.add(pole);

// -- Arm pivot: an EMPTY group located near the top of the pole.
//    Rotating this group swings the arm up/down around the hinge point.
const armPivotHeight = baseHeight + poleHeight * 0.9; // hinge 90% up the pole
const armPivot = new THREE.Group();
armPivot.position.set(0, armPivotHeight, 0);  // the whole armPivot group is raised along y axis
lampRoot.add(armPivot);

// Visualize the hinge with a small sphere "bolt" 
const hingeBolt = new THREE.Mesh(
  new THREE.SphereGeometry(0.08, 16, 16),
  matBlue
);
hingeBolt.position.set(0, 0, 0);
armPivot.add(hingeBolt);

// -- Arm: a thin rectangular box that extends forward from the hinge.
//    We build it around its own center, then move it so the near end sits at the pivot.
const armLength = 1.6;
const armThickness = 0.08;
const arm = new THREE.Mesh(
  new THREE.BoxGeometry(armLength, armThickness, armThickness),
  matLightGrey
);
// By default, the box is centered; shift it so its left end touches the pivot.
arm.position.set(armLength / 2, 0, 0);
armPivot.add(arm);

// -- Head pivot: another EMPTY group at the far end of the arm.
//    Rotating this pivot tilts the lamp head around its "neck."

const headPivot = new THREE.Group();
headPivot.position.set(armLength, 0, 0);
armPivot.add(headPivot);

const headGroup = new THREE.Group();
headPivot.add(headGroup);

const shadeHeight = 0.45;
const shadeRadius = 0.28;
const bulbRadius  = 0.14;

// a short neck between arm and shade apex
const neckLen = 0.06;
const neck = new THREE.Mesh(
  new THREE.CylinderGeometry(0.035, 0.035, neckLen, 16),
  matLightGrey
);
neck.position.set(0, -neckLen / 2, 0); // hangs down a bit from the pivot
headGroup.add(neck);

// Shade: apex at pivot -> move cone down by h/2 + half neck
const shade = new THREE.Mesh(
  new THREE.ConeGeometry(shadeRadius, shadeHeight, 24, 1, true, 0, Math.PI * 2), // open ended cone 
  matDarkGrey
);

shade.position.set(0, -(neckLen + shadeHeight) / 2, 0);  // hang down half neck length, another half shade height
headGroup.add(shade);

// Bulb: inside the shade, just above the rim
const bulb = new THREE.Mesh(
  new THREE.SphereGeometry(bulbRadius, 24, 16),
  matAccent
);
// lift a bit more so it doesn't poke out
bulb.position.set(0, -(neckLen + shadeHeight) / 2 - 0.1, 0); // bulb should be down a little more than shade
headGroup.add(bulb);

// Rim: lies on the cone's open edge (y = -h/2 relative to shade center)
// Torus is in XY by default -> rotate to XZ
const rim = new THREE.Mesh(
  new THREE.TorusGeometry(shadeRadius * 0.98, 0.015, 12, 48),
  matLightGrey
);
rim.rotation.x = Math.PI / 2;                 // <-- key fix
rim.position.set(0, -(neckLen + shadeHeight) / 2 - 0.2, 0); // move rim further down from bulb, adjust to fit properly
headGroup.add(rim);

// ---------------------------------------------------------
// 5) Demonstrate transforms
//    We'll expose a few live angles you can change via keyboard.
//    Everything is in *local* space thanks to group hierarchy.
// ---------------------------------------------------------
const state = {
  armAngle: THREE.MathUtils.degToRad(-20),   // rotate arm up/down around the hinge (X axis)
  headTilt: THREE.MathUtils.degToRad(15),    // tilt head around its pivot (Z axis or X axis; we'll use Z for a classic tilt)
  rootYaw: THREE.MathUtils.degToRad(0)       // rotate entire lamp around Y axis
};

// Apply the current state to the scene graph
function applyTransforms() {
  lampRoot.rotation.y = state.rootYaw;

  // X axis tilt for raising/lowering arm (pivot is at armPivot.position)
  armPivot.rotation.z = 0;     // keep z stabilized for clarity
  armPivot.rotation.x = state.armAngle;

  // Head tilt at end of arm. We'll tilt around Z to show a "cocked" head look.
  headPivot.rotation.x = 0;
  headPivot.rotation.z = state.headTilt;
}
applyTransforms();

// ---------------------------------------------------------
// 6) Keyboard controls (simple & visible for students)
//    A/Z: arm up/down
//    S/X: head tilt +/-
//    D/C: rotate whole lamp ±
// ---------------------------------------------------------
window.addEventListener("keydown", (e) => {
  const step = THREE.MathUtils.degToRad(3);
  switch (e.key.toLowerCase()) {
    case "a": state.armAngle += step; break;
    case "z": state.armAngle -= step; break;
    case "s": state.headTilt += step; break;
    case "x": state.headTilt -= step; break;
    case "d": state.rootYaw += step; break;
    case "c": state.rootYaw -= step; break;
    default: return;
  }
  applyTransforms();
});

// ---------------------------------------------------------
// 7) Render loop & resize handling
// ---------------------------------------------------------
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1)); // change to 2 for more precision
}
window.addEventListener("resize", onResize);

// Keyboard controls for ceiling fan
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === 'a') {
    fanSpinning = !fanSpinning; // Toggle fan spinning on/off
  }
});

renderer.setAnimationLoop(() => {
  // Animate ceiling fan rotation if spinning
  if (fanSpinning && ceilingFan) {
    ceilingFan.rotation.y += fanRotationSpeed;
  }
  
  renderer.render(scene, camera);
});


/*
Key ideas to notice:

1) Parent-child transforms
   - Rotating armPivot rotates the arm AND everything attached to it (headPivot → headGroup).
   - Rotating headPivot affects only the headGroup, because it's deeper in the graph.

2) Local vs world space
   - Positions like arm.position.set(armLength/2, 0, 0) are in the armPivot’s local space.
   - The arm is modeled centered, then moved so the hinge is at its left end.

3) Pivots without math headaches
   - You don't need to manually translate to/from origins to rotate around a point.
   - Create an empty THREE.Group at the hinge point → add the rotating part as a child.

4) Primitives
   - CylinderGeometry: base, pole
   - BoxGeometry: arm
   - ConeGeometry: shade
   - SphereGeometry: bulb, hinge "bolt"
   - TorusGeometry: decorative rim 

5) Materials
   - MeshBasicMaterial is flat (no lights). Focus on shape + transforms.
*/
