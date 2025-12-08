import * as THREE from 'three';

export function createPillows() {
    const pillowGroup = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xe8e5e0, roughness: 0.8 });
    const geo = new THREE.BoxGeometry(0.5, 1, 0.8);
    
    const left = new THREE.Mesh(geo, mat);
    left.position.set(.75, 1, -2);
    left.castShadow = true;
    left.receiveShadow = true;
    pillowGroup.add(left);
    
    const right = new THREE.Mesh(geo, mat);
    right.position.set(.75, 1, -0.5);
    right.castShadow = true;
    right.receiveShadow = true;
    pillowGroup.add(right);
    
    return pillowGroup;
}
