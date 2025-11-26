import * as THREE from 'three';

/**
 * Modern S-shaped chair with curved design
 * - Red material with flat shading for modern look
 * - Continuous S-curve from seat to backrest
 * - Custom geometry using BufferGeometry
 */
export function createSChair() {
    const group = new THREE.Group();
    
    // Dimensions
    const width = 0.75, thickness = 0.1;
    
    // Custom vertices defining the S-curve shape
    // Four sections: base, seat, mid-back, and backrest
    const vertices = [
        -width/2, 0, 0, width/2, 0, 0, -width/2, 0, 0.6, width/2, 0, 0.6,
        -width/2, thickness, 0, width/2, thickness, 0, -width/2, thickness, 0.6, width/2, thickness, 0.6,
        -width/2, thickness, 0, width/2, thickness, 0, -width/2, 0.5, 0.6, width/2, 0.5, 0.6,
        -width/2, thickness*2, 0, width/2, thickness*2, 0, -width/2, 0.5+thickness, 0.6, width/2, 0.5+thickness, 0.6,
        -width/2, 0.5, -0.1, width/2, 0.5, -0.1, -width/2, 0.5, 0.6, width/2, 0.5, 0.6,
        -width/2, 0.5+thickness, -0.1, width/2, 0.5+thickness, -0.1, -width/2, 0.5+thickness, 0.6, width/2, 0.5+thickness, 0.6,
        -width/2, 0.5, -0.1, width/2, 0.5, -0.1, -width/2, 1.1, -0.2, width/2, 1.1, -0.2,
        -width/2, 0.5+thickness, -0.1, width/2, 0.5+thickness, -0.1, -width/2, 1.1+thickness, -0.2, width/2, 1.1+thickness, -0.2
    ];
    
    // Triangle indices for all four sections of the S-curve
    const indices = [
        0,1,3,0,3,2, 6,7,5,6,5,4, 2,3,7,2,7,6, 4,5,1,4,1,0, 0,2,6,0,6,4, 5,7,3,5,3,1,
        8,9,11,8,11,10, 14,15,13,14,13,12, 10,11,15,10,15,14, 12,13,9,12,9,8, 8,10,14,8,14,12, 13,15,11,13,11,9,
        16,17,19,16,19,18, 22,23,21,22,21,20, 18,19,23,18,23,22, 20,21,17,20,17,16, 16,18,22,16,22,20, 21,23,19,21,19,17,
        24,25,27,24,27,26, 30,31,29,30,29,28, 26,27,31,26,31,30, 28,29,25,28,25,24, 24,26,30,24,30,28, 29,31,27,29,27,25
    ];
    
    // Build geometry from vertices and indices
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    // Material - red with flat shading for modern aesthetic
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xcc3333, 
        roughness: 0.7, 
        metalness: 0.1,
        flatShading: true
    });
    
    // Create mesh with shadow support
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    
    return group;
}
