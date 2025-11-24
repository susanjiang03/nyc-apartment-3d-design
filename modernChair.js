import * as THREE from 'three';

export function createSChair() {
    const group = new THREE.Group();
    const width = 0.75, thickness = 0.1;
    
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
    
    const indices = [
        0,1,3,0,3,2, 6,7,5,6,5,4, 2,3,7,2,7,6, 4,5,1,4,1,0, 0,2,6,0,6,4, 5,7,3,5,3,1,
        8,9,11,8,11,10, 14,15,13,14,13,12, 10,11,15,10,15,14, 12,13,9,12,9,8, 8,10,14,8,14,12, 13,15,11,13,11,9,
        16,17,19,16,19,18, 22,23,21,22,21,20, 18,19,23,18,23,22, 20,21,17,20,17,16, 16,18,22,16,22,20, 21,23,19,21,19,17,
        24,25,27,24,27,26, 30,31,29,30,29,28, 26,27,31,26,31,30, 28,29,25,28,25,24, 24,26,30,24,30,28, 29,31,27,29,27,25
    ];
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xcc3333, 
        roughness: 0.7, 
        metalness: 0.1,
        flatShading: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    
    return group;
}
