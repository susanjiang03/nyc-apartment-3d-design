import * as THREE from 'three';

/*
    Stove with burners and control knobs
 */
export function createStove() {
    const stove = new THREE.Group();
    
    // Material
    const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.2 });
    const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.4, metalness: 0.7 });  
    const greyMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.5, metalness: 0.6 });

    // Dimensions
    const stoveWidth = 0.8;
    const stoveDepth = 0.6;
    const stoveHeight = 0.9;
    const burnerRadius = 0.1;
    const burnerHeight = 0.02;
    
    // Base of the stove
    const baseGeometry = new THREE.BoxGeometry(stoveWidth, stoveHeight, stoveDepth);
    const baseMesh = new THREE.Mesh(baseGeometry, whiteMaterial);
    baseMesh.position.y = stoveHeight / 2;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    stove.add(baseMesh);
    
    // Burners
    const burnerPositions = [
        [-stoveWidth / 4, stoveHeight - burnerHeight / 2 + 0.01, -stoveDepth / 4],
        [stoveWidth / 4, stoveHeight - burnerHeight / 2 + 0.01, -stoveDepth / 4],
        [-stoveWidth / 4, stoveHeight - burnerHeight / 2 + 0.01, stoveDepth / 4],
        [stoveWidth / 4, stoveHeight - burnerHeight / 2 + 0.01, stoveDepth / 4],
    ];
    
    burnerPositions.forEach(pos => {
        const burnerGeometry = new THREE.CylinderGeometry(burnerRadius, burnerRadius, burnerHeight, 32);
        const burnerMesh = new THREE.Mesh(burnerGeometry, blackMaterial);
        burnerMesh.position.set(pos[0], pos[1], pos[2]);
        burnerMesh.castShadow = true;
        burnerMesh.receiveShadow = true;
        stove.add(burnerMesh);
    });
    
    // Control knobs
    const knobRadius = 0.03;
    const knobHeight = 0.02;
    const knobPositions = [
        [-stoveWidth / 4, stoveHeight - 0.1, stoveDepth / 2 + 0.05],
        [0, stoveHeight - 0.1, stoveDepth / 2 + 0.05],
        [stoveWidth / 4, stoveHeight - 0.1, stoveDepth / 2 + 0.05],
    ];
    
    knobPositions.forEach(pos => {
        const knobGeometry = new THREE.CylinderGeometry(knobRadius, knobRadius, knobHeight, 32);
        const knobMesh = new THREE.Mesh(knobGeometry, greyMaterial);
        knobMesh.position.set(pos[0], pos[1], pos[2]);
        knobMesh.castShadow = true;
        knobMesh.receiveShadow = true;
        stove.add(knobMesh);
    });
    
    return stove;
}