import * as THREE from 'three';

export function createRefrigerator() {
    const fridgeGroup = new THREE.Group();
    
    const metalMat = new THREE.MeshStandardMaterial({
        color: 0xd4d4d8,
        roughness: 0.3,
        metalness: 0.9,
    });
    
    const handleMat = new THREE.MeshStandardMaterial({
        color: 0x71717a,
        roughness: 0.2,
        metalness: 0.7,
    });
    
    const interiorMat = new THREE.MeshStandardMaterial({
        color: 0xf5f5f5,
        roughness: 0.6,
        metalness: 0.1,
    });
    
    // Back panel
    const backPanel = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 2.5, 0.05),
        metalMat
    );
    backPanel.position.set(0, 1.25, -0.4);
    backPanel.castShadow = true;
    backPanel.receiveShadow = true;
    fridgeGroup.add(backPanel);
    
    // Left side panel
    const leftPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 2.5, 0.8),
        metalMat
    );
    leftPanel.position.set(-0.6, 1.25, 0);
    leftPanel.castShadow = true;
    leftPanel.receiveShadow = true;
    fridgeGroup.add(leftPanel);
    
    // Right side panel
    const rightPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 2.5, 0.8),
        metalMat
    );
    rightPanel.position.set(0.6, 1.25, 0);
    rightPanel.castShadow = true;
    rightPanel.receiveShadow = true;
    fridgeGroup.add(rightPanel);
    
    // Top panel
    const topPanel = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.05, 0.8),
        metalMat
    );
    topPanel.position.set(0, 2.525, 0);
    topPanel.castShadow = true;
    topPanel.receiveShadow = true;
    fridgeGroup.add(topPanel);
    
    // Bottom panel
    const bottomPanel = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.05, 0.8),
        metalMat
    );
    bottomPanel.position.set(0, 0, 0);
    bottomPanel.castShadow = true;
    bottomPanel.receiveShadow = true;
    fridgeGroup.add(bottomPanel);
    
    // Middle separator between freezer and main compartment
    const separator = new THREE.Mesh(
        new THREE.BoxGeometry(1.15, 0.05, 0.75),
        interiorMat
    );
    separator.position.set(0, 1.7, 0);
    separator.castShadow = true;
    separator.receiveShadow = true;
    fridgeGroup.add(separator);
    
    // Top door (freezer) - group for rotation
    const topDoorGroup = new THREE.Group();
    topDoorGroup.position.set(-0.6, 2.1, 0.4); // Pivot at front left edge
    
    const topDoor = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.82, 0.06),
        metalMat
    );
    topDoor.position.set(0.6, 0, 0); // Center door relative to pivot
    topDoor.castShadow = true;
    topDoor.receiveShadow = true;
    topDoorGroup.add(topDoor);
    
    // Top door handle
    const topHandle = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.5, 0.08),
        handleMat
    );
    topHandle.position.set(1.1, 0, 0.04)
    topHandle.castShadow = true;
    topDoorGroup.add(topHandle);
    
    fridgeGroup.add(topDoorGroup);
    
    // Bottom door (main)
    const bottomDoorGroup = new THREE.Group();
    bottomDoorGroup.position.set(-0.6, 0.85, 0.4); // Pivot at front left edge
    
    const bottomDoor = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.7, 0.06),
        metalMat
    );
    bottomDoor.position.set(0.6, 0, 0); // Center door relative to pivot
    bottomDoor.castShadow = true;
    bottomDoor.receiveShadow = true;
    bottomDoorGroup.add(bottomDoor);
    
    // Bottom door handle
    const bottomHandle = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 1, 0.08),
        handleMat
    );
    bottomHandle.position.set(1.1, 0, 0.04);
    bottomHandle.castShadow = true;
    bottomDoorGroup.add(bottomHandle);
    
    // Clear door organizers on bottom door
    const clearMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        transmission: 0.6,
    });
    
    // Top door organizer (freezer)
    const topOrganizerGroup = new THREE.Group();
    topOrganizerGroup.rotation.y = Math.PI;
    
    const topOrgBack = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.175, 0.02),
        clearMat
    );
    topOrgBack.position.set(-0.6, 0, 0.2);
    topOrganizerGroup.add(topOrgBack);
    
    const topOrgBottom = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.02, 0.15),
        clearMat
    );
    topOrgBottom.position.set(-0.5, -0.0875, 0.12);
    topOrganizerGroup.add(topOrgBottom);
    
    const topOrgLeft = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.175, 0.15),
        clearMat
    );
    topOrgLeft.position.set(-0.05, 0, 0.12);
    topOrganizerGroup.add(topOrgLeft);
    
    const topOrgRight = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.175, 0.15),
        clearMat
    );
    topOrgRight.position.set(-1.14, 0, 0.12);
    topOrganizerGroup.add(topOrgRight);
    
    topDoorGroup.add(topOrganizerGroup);
    
    // Bottom door organizer (single shelf)
    const bottomOrganizerGroup = new THREE.Group();
    bottomOrganizerGroup.rotation.y = Math.PI;
    const height = 0.175;
    
    const bottomOrgBack = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, height, 0.02),
        clearMat
    );
    bottomOrgBack.position.set(-0.6, 0.5, 0.2);
    bottomOrganizerGroup.add(bottomOrgBack);
    
    const bottomOrgBottom = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.02, 0.15),
        clearMat
    );
    bottomOrgBottom.position.set(-0.6, 0.4125, 0.12);
    bottomOrganizerGroup.add(bottomOrgBottom);
    
    const bottomOrgLeft = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, height, 0.15),
        clearMat
    );
    bottomOrgLeft.position.set(-0.06, 0.5, 0.12);
    bottomOrganizerGroup.add(bottomOrgLeft);
    
    const bottomOrgRight = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, height, 0.15),
        clearMat
    );
    bottomOrgRight.position.set(-1.14, 0.5, 0.12);
    bottomOrganizerGroup.add(bottomOrgRight);
    
    bottomDoorGroup.add(bottomOrganizerGroup);
    
    fridgeGroup.add(bottomDoorGroup);
    
    // Bottom container with lid
    const containerGroup = new THREE.Group();
    containerGroup.position.set(0, 0.2, -0.15);
    
    // Container body 
    const containerBack = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.375, 0.02),
        clearMat
    );
    containerBack.position.set(0, 0, -0.35);
    containerGroup.add(containerBack);
    
    const containerFront = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.375, 0.02),
        clearMat
    );
    containerFront.position.set(0, 0, 0.35);
    containerGroup.add(containerFront);
    
    const containerLeft = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.375, 0.7),
        clearMat
    );
    containerLeft.position.set(-0.55, 0, 0);
    containerGroup.add(containerLeft);
    
    const containerRight = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.375, 0.7),
        clearMat
    );
    containerRight.position.set(0.55, 0, 0);
    containerGroup.add(containerRight);
    
    const containerBottom = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.02, 0.7),
        clearMat
    );
    containerBottom.position.set(0, -0.1875, 0);
    containerGroup.add(containerBottom);
    
    // Container top panel
    const containerTop = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.02, 0.7),
        clearMat
    );
    containerTop.position.set(0, 0.1875, 0);
    containerGroup.add(containerTop);
    
    // Container lid
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.1975, 0);
    
    const lid = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.03, 0.7),
        clearMat
    );
    lidGroup.add(lid);
    
    const lidHandle = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.02, 0.05),
        clearMat
    );
    lidHandle.position.set(0, 0.02, 0.3);
    lidGroup.add(lidHandle);
    
    containerGroup.add(lidGroup);
    fridgeGroup.add(containerGroup);
    
    fridgeGroup.userData.topDoor = topDoorGroup;
    fridgeGroup.userData.bottomDoor = bottomDoorGroup;
    fridgeGroup.userData.container = containerGroup;
    
    return fridgeGroup;
}
