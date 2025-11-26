//*******************************************************************************
//* Program: nycApartment.js
//* Authors: Onevathana, Colin
//*          Jiang, Lingshan
//*******************************************************************************
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createBookshelf } from './bookshelf.js';
import { createSChair } from './modernChair.js';
import { createCeilingFan } from './ceilingFan.js';
import { createEndTable } from './endTable.js';
import { createCoffeeTable } from './coffeeTable.js';
import { createSofa } from './sofa.js';
import { createSnowGlobe } from "./snowGlobe.js";
import { createCoffeeCup } from "./coffeeCup.js";
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

// Add lights for MeshStandardMaterial objects
const defaultAmbient = new THREE.AmbientLight(0xffffff, 0.2); // Default dim lighting
scene.add(defaultAmbient);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = false; // Disabled to prevent fan shadows in corners
scene.add(directionalLight);

// 2) Materials (using MeshStandardMaterial for shadows)
const matGrey = new THREE.MeshStandardMaterial({ color: 0x808080 }); // grey for walls/ceiling/floor

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
  chair.position.set(3, 0.108, -3);
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
let fanLight;
let fanLightBulb;
const fanRotationSpeed = 0.07; // radians per frame
{
  ceilingFan = createCeilingFan();
  ceilingFan.position.set(0, 6, 0);
  scene.add(ceilingFan);
  
  ceilingFan.traverse((child) => {
    if (child.isMesh && child.geometry.type === 'SphereGeometry') {
      fanLightBulb = child;
      fanLightBulb.material.transparent = true;
      fanLightBulb.material.opacity = 0.15; // Dimly visible when off
    }
  });
  
  fanLight = new THREE.PointLight(0xffffee, 0, 25);
  fanLight.position.set(0, 4.2, 0);
  fanLight.castShadow = true;
  fanLight.shadow.mapSize.width = 1024;
  fanLight.shadow.mapSize.height = 1024;
  scene.add(fanLight);
}

// ---------------------------------------------------------
// 11) Build a Round End Table
// ---------------------------------------------------------
{
  const endTable = createEndTable();
  scene.add(endTable);
}

// ---------------------------------------------------------
// 12) Build a Coffee Table
// ---------------------------------------------------------
{
  const coffeeTable = createCoffeeTable();
  scene.add(coffeeTable);
}

// ---------------------------------------------------------
// 13) Build floorCarpet for context
// ---------------------------------------------------------
let floorCarpet;
{
  const carpetMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xe8dacd,
    transparent: true,
    opacity: 0.2 // Dimly visible when off
  });
  floorCarpet = new THREE.Mesh(
    new THREE.BoxGeometry(7, 0.03, 7),
    carpetMaterial
  );
  floorCarpet.position.set(0.2, 0.1, 0);   // sit slightly above y=0 grid lines
  scene.add(floorCarpet);  
}

// ---------------------------------------------------------
// 14) Create sofa - Extruded Shape Object
// ---------------------------------------------------------
{
  const sofa = createSofa();
  sofa.rotation.y = Math.PI/2;  // 180° turn
  sofa.scale.set(0.5, 0.5, 1);  
  sofa.position.set(-1, 0.108, 4); 
  scene.add(sofa);
}

// ---------------------------------------------------------
// 15) Build Coffee Cup - Polygonal Mesh Object
// ---------------------------------------------------------
{
  const coffeeCup = createCoffeeCup();
  coffeeCup.scale.set(0.3, 0.3, 0.3);  
  coffeeCup.position.set(0, 0.95, 0);
  scene.add(coffeeCup);
}


// ---------------------------------------------------------
// 15) Create snow globe - Surface of Revolution Object
// ---------------------------------------------------------
const snowGlobe = createSnowGlobe();
snowGlobe.scale.set(0.6, 0.6, 0.6);  
snowGlobe.position.set(3, 1.101, -4.2); 
snowGlobe.rotation.y = Math.PI/2;
scene.add(snowGlobe);

// ---------------------------------------------------------
// 99) Render loop & resize handling
// ---------------------------------------------------------
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1)); // change to 2 for more precision
}
window.addEventListener("resize", onResize);

// Keyboard controls for ceiling fan
let fanLightOn = false;
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === 'a') {
    fanSpinning = !fanSpinning; // Toggle fan spinning on/off
  }
  if (e.key.toLowerCase() === 's') {
    fanLightOn = !fanLightOn; // Toggle ceiling fan light on/off
    fanLight.intensity = fanLightOn ? 60 : 0;
    if (fanLightBulb) fanLightBulb.material.opacity = fanLightOn ? 0.8 : 0.15;
    if (floorCarpet) floorCarpet.material.opacity = fanLightOn ? 1.0 : 0.2;
  }
});

renderer.setAnimationLoop(() => {
  // Animate ceiling fan rotation if spinning
  if (fanSpinning && ceilingFan) {
    ceilingFan.rotation.y += fanRotationSpeed;
  }
  
  renderer.render(scene, camera);
});
