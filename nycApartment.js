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
import { createPillows } from './pillows.js';
import { createRefrigerator } from './refrigerator.js';
import { createTV } from './tv.js';
import { createLamp } from "./lamp.js";
import { createPlant } from "./plant.js";
// ---------------------------------------------------------
// 1) Basic scene setup
// ---------------------------------------------------------
const scene = new THREE.Scene();

// A neutral camera looking slightly down at the origin
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(5, 4, 8);
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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
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

// 7b) Refrigerator (right of bookshelf)
let fridge;
fridge = createRefrigerator();
fridge.position.set(-4.5, 0.1, 4);
fridge.rotation.y = Math.PI / 2;
scene.add(fridge);

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
// 11b) Wall-mounted TV
// ---------------------------------------------------------
{
  const tv = createTV();
  tv.position.set(-0.3, 2.5, -4.85);
  tv.rotation.y = 0;
  scene.add(tv);
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
  
  // Add decorative pillows to the sofa
  const pillows = createPillows();
  pillows.position.set(1.48, 0.483, 4);  // Position sitting on sofa seat (adjusted Y to seat height)
  pillows.rotation.y = Math.PI/2;  // Match sofa rotation
  pillows.scale.set(0.5, 0.5, 1);  // Match sofa scale
  scene.add(pillows);
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
// 16) Create snow globe - Surface of Revolution Object
// ---------------------------------------------------------
const snowGlobe = createSnowGlobe();
snowGlobe.scale.set(0.6, 0.6, 0.6);  
snowGlobe.position.set(3, 1.101, -4.2); 
snowGlobe.rotation.y = Math.PI/2;
scene.add(snowGlobe);


// ---------------------------------------------------------
// 16) Build Lamp - Custom Geometry Object
// ---------------------------------------------------------
const lamp = createLamp();
lamp.position.set(-3.7, 1.64, -3.7);
scene.add(lamp);


// ---------------------------------------------------------
// 17) Build Plant - Custom Geometry Object
// ---------------------------------------------------------
const plant = createPlant();
plant.position.set(0.5, 1.1, 0.5);
scene.add(plant);

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

// Fan noise audio
const fanAudio = new Audio('fan-noise.mp3');
fanAudio.loop = true;

// Light switch click sound
const lightSwitchAudio = new Audio('light-switch.mp3');

// Keyboard controls for ceiling fan
let fanLightOn = false;
let fridgeDoorsOpen = false;
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === 'a') {
    fanSpinning = !fanSpinning; // Toggle fan spinning on/off
    if (fanSpinning) {
      fanAudio.play();
    } else {
      fanAudio.pause();
      fanAudio.currentTime = 0;
    }
  }
  if (e.key.toLowerCase() === 's') {
    fanLightOn = !fanLightOn; // Toggle ceiling fan light on/off
    fanLight.intensity = fanLightOn ? 60 : 0;
    if (fanLightBulb) fanLightBulb.material.opacity = fanLightOn ? 0.8 : 0.15;
    if (floorCarpet) floorCarpet.material.opacity = fanLightOn ? 1 : 0.2;
    lightSwitchAudio.currentTime = 0;
    lightSwitchAudio.play();
  }
  if (e.key.toLowerCase() === 'd') {
    fridgeDoorsOpen = !fridgeDoorsOpen; // Toggle fridge doors open/close
  }
  if (e.key.toLowerCase() === 'b') {
    // Reset scene to default state
    fanSpinning = false;
    fanAudio.pause();
    fanAudio.currentTime = 0;
    
    fanLightOn = false;
    fanLight.intensity = 0;
    if (fanLightBulb) fanLightBulb.material.opacity = 0.15;
    if (floorCarpet) floorCarpet.material.opacity = 0.2;
    
    fridgeDoorsOpen = false;
  }

  if (e.key.toLowerCase() === "l") toggleLamp();
});

// Lamp on/off toggle
let lampOn = false;
function toggleLamp() {
  lampOn = !lampOn;

  const { light, bulb, shade } = lamp.userData;

  if (lampOn) {
    light.intensity = 30;
    bulb.material.emissiveIntensity = 1.2;
    shade.material.emissiveIntensity = 0.4;
  } else {
    light.intensity = 0;
    bulb.material.emissiveIntensity = 0;
    shade.material.emissiveIntensity = 0;
  }
  console.log("Lamp is now", lampOn ? "ON" : "OFF");
}

renderer.setAnimationLoop(() => {
  // Animate ceiling fan rotation if spinning
  if (fanSpinning && ceilingFan) {
    ceilingFan.rotation.y += fanRotationSpeed;
  }
  
  // Animate fridge doors and container
  if (fridge?.userData?.topDoor && fridge?.userData?.bottomDoor) {
    const targetAngle = fridgeDoorsOpen ? -Math.PI / 2: 0; 
    const speed = fridgeDoorsOpen ? 0.05 : 0.025;
    
    // Smoothly animate top door
    if (Math.abs(fridge.userData.topDoor.rotation.y - targetAngle) > 0.01) {
      if (fridge.userData.topDoor.rotation.y < targetAngle) {
        fridge.userData.topDoor.rotation.y = Math.min(fridge.userData.topDoor.rotation.y + speed, targetAngle);
      } else {
        fridge.userData.topDoor.rotation.y = Math.max(fridge.userData.topDoor.rotation.y - speed, targetAngle);
      }
    }
    
    // Smoothly animate bottom door
    if (Math.abs(fridge.userData.bottomDoor.rotation.y - targetAngle) > 0.01) {
      if (fridge.userData.bottomDoor.rotation.y < targetAngle) {
        fridge.userData.bottomDoor.rotation.y = Math.min(fridge.userData.bottomDoor.rotation.y + speed, targetAngle);
      } else {
        fridge.userData.bottomDoor.rotation.y = Math.max(fridge.userData.bottomDoor.rotation.y - speed, targetAngle);
      }
    }
    
  }
  
  // Animate container pulling out of fridge (slower when opening, faster when closing)
  if (fridge?.userData?.container) {
    const targetZ = fridgeDoorsOpen ? 0.5 : -0.15;
    const containerSpeed = fridgeDoorsOpen ? 0.008 : 0.03; // Slow out, fast in
    
    if (Math.abs(fridge.userData.container.position.z - targetZ) > 0.01) {
      if (fridge.userData.container.position.z < targetZ) {
        fridge.userData.container.position.z = Math.min(fridge.userData.container.position.z + containerSpeed, targetZ);
      } else {
        fridge.userData.container.position.z = Math.max(fridge.userData.container.position.z - containerSpeed, targetZ);
      }
    }
  }
  
  renderer.render(scene, camera);
});
