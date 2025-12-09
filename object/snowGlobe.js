import * as THREE from 'three';
import { createBaseGeometry } from './common.js';

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

    const baseMesh = new THREE.Mesh(
        createBaseGeometry(32, 40, profile),
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


    // --------------------
    // Trees inside the globe
    // --------------------
    const treeGroup = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const trunkHeight = 1, leafHeight = 1.25, leafRadius = 0.5;
    for (let i = 0; i < 3; i++) {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, trunkHeight, 12), trunkMat);
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(leafRadius, leafHeight, 12), leafMat);
        trunk.position.y = trunkHeight / 2;
        leaf.position.y = trunkHeight + leafHeight / 2;
        const tree = new THREE.Group();
        tree.add(trunk, leaf);
        tree.position.set(glassMesh.position.x, baseHeight + 0.1, -0.2 + i * 0.2);
        tree.scale.set(0.2, 0.2, 0.2);
        treeGroup.add(tree);
    }
    globe.add(treeGroup);

    return globe;
};