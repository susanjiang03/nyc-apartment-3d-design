import * as THREE from 'three';

const texLoader = new THREE.TextureLoader();

const mosaicText = texLoader.load('texture/MosaicWallTile.jpg');
mosaicText.wrapS = THREE.RepeatWrapping;
mosaicText.wrapT = THREE.RepeatWrapping;
mosaicText.repeat.set(4, 4);   // tile pattern

export function createMosaicWall() {
    const wallGeometry = new THREE.BoxGeometry(0.02, 6, 6.5);
    const mosaicMaterial = new THREE.MeshStandardMaterial({
        map: mosaicText,
        roughness: 0.8,
        metalness: 0.2
    });

    const mosaicWall = new THREE.Mesh(wallGeometry, mosaicMaterial);
    mosaicWall.castShadow = true;
    mosaicWall.receiveShadow = true;
    return mosaicWall;
}
