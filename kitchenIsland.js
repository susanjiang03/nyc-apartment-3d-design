import * as THREE from 'three';

/*
  Kitchen Island
 */
export function createKitchenIsland() {
    const island = new THREE.Group();

    // Material
    const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.2 });
    const countertopMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.3, metalness: 0.5 });

    // Dimensionsl
    const islandWidth = 2.5;
    const islandDepth = 1.5;
    const islandHeight = 1;
    const countertopThickness = 0.1;

    // Base of the island
    const baseGeometry = new THREE.BoxGeometry(islandWidth, islandHeight - countertopThickness, islandDepth);
    const baseMesh = new THREE.Mesh(baseGeometry, whiteMaterial);
    baseMesh.position.y = (islandHeight - countertopThickness) / 2;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    island.add(baseMesh);

    // Countertop
    const countertopGeometry = new THREE.BoxGeometry(islandWidth + 0.2, countertopThickness, islandDepth + 0.7);
    const countertopMesh = new THREE.Mesh(countertopGeometry, countertopMaterial);
    countertopMesh.position.y = islandHeight - (countertopThickness / 2);
    countertopMesh.castShadow = true;
    countertopMesh.receiveShadow = true;
    island.add(countertopMesh);

    return island;
}   