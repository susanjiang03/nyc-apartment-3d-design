import * as THREE from 'three';

/**
 * Wooden bookshelf with shelves and decorative vase
 * - Brown wood material with realistic texture
 * - Multiple shelves with vertical dividers
 * - Teal/turquoise decorative vase on bottom shelf
 */
export function createBookshelf() {
    const group = new THREE.Group();
    
    // Material
    const brownMaterial = new THREE.MeshStandardMaterial({ color: 0x997233, roughness: 0.7, metalness: 0.1 });
    
    // Dimensions
    const width = 2, height = 3, depth = 1, thickness = 0.05;
    
    function createComponent(w, h, d) {
        const geometry = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geometry, brownMaterial);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }
    
    // 1) Left and right side panels
    const leftPanel = createComponent(thickness, height, depth);
    leftPanel.position.set(-width/2 + thickness/2, height/2, 0);
    group.add(leftPanel);
    
    const rightPanel = createComponent(thickness, height, depth);
    rightPanel.position.set(width/2 - thickness/2, height/2, 0);
    group.add(rightPanel);
    
    // 2) Top and bottom panels
    const topPanel = createComponent(width, thickness, depth);
    topPanel.position.set(0, height - thickness/2, 0);
    group.add(topPanel);
    
    const bottomPanel = createComponent(width, thickness, depth);
    bottomPanel.position.set(0, thickness/2, 0);
    group.add(bottomPanel);
    
    // 3) Back panel
    const backPanel = createComponent(width - thickness*2, height - thickness*2, thickness*0.5);
    backPanel.position.set(0, height/2, -depth/2 + thickness/4);
    group.add(backPanel);
    
    // 4) Three horizontal shelves
    const shelf1Y = height * 0.25;
    const shelf1 = createComponent(width - thickness*2, thickness, depth);
    shelf1.position.set(0, shelf1Y, 0);
    group.add(shelf1);
    
    const shelf2Y = height * 0.5;
    const shelf2 = createComponent(width - thickness*2, thickness, depth);
    shelf2.position.set(0, shelf2Y, 0);
    group.add(shelf2);
    
    const shelf3Y = height * 0.75;
    const shelf3 = createComponent(width - thickness*2, thickness, depth);
    shelf3.position.set(0, shelf3Y, 0);
    group.add(shelf3);
    
    // 5) Vertical dividers
    const divider1 = createComponent(thickness*0.8, shelf2Y - shelf1Y, depth);
    divider1.position.set(-(width - thickness*2)/4, (shelf1Y + shelf2Y) / 2, 0);
    group.add(divider1);
    
    const divider2 = createComponent(thickness*0.8, shelf3Y - shelf2Y, depth);
    divider2.position.set((width - thickness*2)/4, (shelf2Y + shelf3Y) / 2, 0);
    group.add(divider2);
    
    // 6) Decorative vase
    const vaseGroup = createVase();
    vaseGroup.position.set(-(width - thickness*2)/4 - 0.3, shelf1Y + thickness, depth/6);
    group.add(vaseGroup);
    
    return group;
}

/**
 * Helper function to create decorative vase
 * - Teal/turquoise ceramic material
 * - Multiple cylindrical and spherical sections
 */
function createVase() {
    const group = new THREE.Group();
    const vaseMaterial = new THREE.MeshStandardMaterial({ color: 0x338088, roughness: 0.3, metalness: 0.4 });
    
    const parts = [
        { geo: new THREE.CylinderGeometry(0.12, 0.12, 0.04, 32), y: 0 },
        { geo: new THREE.CylinderGeometry(0.11, 0.12, 0.15, 32), y: 0.075 },
        { geo: new THREE.SphereGeometry(0.14, 24, 16), y: 0.17, scale: [1, 0.7, 1] },
        { geo: new THREE.CylinderGeometry(0.09, 0.13, 0.08, 32), y: 0.25 },
        { geo: new THREE.CylinderGeometry(0.09, 0.09, 0.06, 24), y: 0.32 },
        { geo: new THREE.CylinderGeometry(0.11, 0.09, 0.03, 24), y: 0.365 }
    ];
    
    parts.forEach(part => {
        const mesh = new THREE.Mesh(part.geo, vaseMaterial);
        mesh.position.y = part.y;
        if (part.scale) mesh.scale.set(...part.scale);
        mesh.castShadow = true;
        group.add(mesh);
    });
    
    return group;
}
