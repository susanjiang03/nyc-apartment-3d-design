import * as THREE from 'three';

/*
    Stool
        |-- seat
        |-- legs
        |-- footrest
 */
export function createStool() {
    const stool = new THREE.Group();

    // Material
    const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, roughness: 0.7, metalness: 0.2 });
    
    // Dimensions   
    const seatRadius = 0.3;
    const seatHeight = 0.05;
    const legHeight = 1.0;
    const legRadius = 0.025;
    const footrestHeight = 0.25;
    const footrestRadius = 0.018;

    // Seat
    const seatGeometry = new THREE.CylinderGeometry(seatRadius, seatRadius, seatHeight, 32);
    const seatMesh = new THREE.Mesh(seatGeometry, woodMaterial);
    seatMesh.position.y = legHeight + seatHeight / 2;
    seatMesh.castShadow = true;
    seatMesh.receiveShadow = true;
    stool.add(seatMesh);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 16);
    const legPositions = [
        [seatRadius * 0.6, legHeight / 2, seatRadius * 0.6],
        [-seatRadius * 0.6, legHeight / 2, seatRadius * 0.6],
        [seatRadius * 0.6, legHeight / 2, -seatRadius * 0.6],
        [-seatRadius * 0.6, legHeight / 2, -seatRadius * 0.6],
    ];

    legPositions.forEach(pos => {
        const legMesh = new THREE.Mesh(legGeometry, woodMaterial);
        legMesh.position.set(pos[0], pos[1], pos[2]);
        legMesh.castShadow = true;
        legMesh.receiveShadow = true;
        stool.add(legMesh);
    });

    // Footrest
    const footrestGeometry = new THREE.TorusGeometry(seatRadius * 0.75, footrestRadius, 16, 100);
    const footrestMesh = new THREE.Mesh(footrestGeometry, woodMaterial);
    footrestMesh.position.y = footrestHeight;
    footrestMesh.rotation.x = Math.PI / 2;
    footrestMesh.castShadow = true;
    footrestMesh.receiveShadow = true;
    stool.add(footrestMesh);

    return stool;
}