import * as THREE from 'three';

/*
    Stove with burners and control knobs
 */
export function createStove() {
    const stove = new THREE.Group();
    
    // Material
    const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.5 });
    const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.4, metalness: 0.7 });  
    const greyMaterial = new THREE.MeshStandardMaterial({
        color: 0x777777,          // mid-gray metal base
        metalness: 1.0,           // maximum metal
        roughness: 0.25,          // slightly shiny
        clearcoat: 0.8,           // extra glossy highlight
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.8
     });

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

    //back panel
    const backPanelHeight = stoveHeight * 1.02;
    const backGeometry = new THREE.BoxGeometry(stoveWidth, backPanelHeight, 0.04);
    const backMesh = new THREE.Mesh(backGeometry, whiteMaterial);
    backMesh.position.set(0, stoveHeight * 0.75, -stoveDepth / 2 + 0.025);
    backMesh.castShadow = true;
    backMesh.receiveShadow = true;
    stove.add(backMesh);
    
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
    const knobRadius = 0.05;
    const knobHeight = 0.03;
    const knobPositions = [
        [0.3, stoveHeight - 0.1, stoveDepth / 2 + 0.01],
        [0.1, stoveHeight - 0.1, stoveDepth / 2 + 0.01],
        [-0.1, stoveHeight - 0.1, stoveDepth / 2 + 0.01],
        [-0.3, stoveHeight - 0.1, stoveDepth / 2 + 0.01],
    ];
    
    knobPositions.forEach(pos => {
        const knobGeometry = new THREE.CylinderGeometry(knobRadius, knobRadius, knobHeight, 32);
        const knobMesh = new THREE.Mesh(knobGeometry, whiteMaterial);
        knobMesh.position.set(pos[0], pos[1], pos[2]);
        knobMesh.rotation.x = Math.PI / 2;
        knobMesh.castShadow = true;
        knobMesh.receiveShadow = true;
        stove.add(knobMesh);
    });

    //oven door
    const doorHeight = stoveHeight * 0.4;
    const doorGeometry = new THREE.BoxGeometry(stoveWidth * 0.9, doorHeight + 0.1, 0.02);
    const doorMesh = new THREE.Mesh(doorGeometry, greyMaterial);
    doorMesh.position.set(0, doorHeight / 2 + 0.2, stoveDepth / 2 + 0.01);
    doorMesh.castShadow = true;
    doorMesh.receiveShadow = true;
    stove.add(doorMesh);

    // Oven handle
    const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, stoveWidth * 0.5, 16);
    const handleMesh = new THREE.Mesh(handleGeometry, whiteMaterial);
    handleMesh.position.set(0, doorHeight + 0.2, stoveDepth / 2 + 0.02);
    handleMesh.rotation.z = Math.PI / 2;
    handleMesh.castShadow = true;
    handleMesh.receiveShadow = true;
    stove.add(handleMesh);
    
    return stove;
}