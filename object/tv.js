import * as THREE from 'three';

const video = document.getElementById("tvVideo");
const videoTexture = new THREE.VideoTexture(video);

videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.encoding = THREE.sRGBEncoding;

export function createTV() {
    const tvGroup = new THREE.Group();
    
    // TV screen material
    const screenMatOff = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.2,
        metalness: 0.3,
    });
    
    // TV frame/bezel material
    const frameMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.4,
        metalness: 0.6,
    });
    
    // TV screen
    const screen = new THREE.Mesh(
        new THREE.BoxGeometry(3, 1.7, 0.05),
        screenMatOff // initially off
    );
    screen.position.set(0, 0, 0);
    screen.castShadow = true;
    screen.receiveShadow = true;
    tvGroup.add(screen);
    
    // TV frame/bezel (thin border around screen)
    const frameTop = new THREE.Mesh(
        new THREE.BoxGeometry(3.1, 0.05, 0.06),
        frameMat
    );
    frameTop.position.set(0, 0.875, 0);
    tvGroup.add(frameTop);
    
    const frameBottom = new THREE.Mesh(
        new THREE.BoxGeometry(3.1, 0.05, 0.06),
        frameMat
    );
    frameBottom.position.set(0, -0.875, 0);
    tvGroup.add(frameBottom);
    
    const frameLeft = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 1.8, 0.06),
        frameMat
    );
    frameLeft.position.set(-1.525, 0, 0);
    tvGroup.add(frameLeft);
    
    const frameRight = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 1.8, 0.06),
        frameMat
    );
    frameRight.position.set(1.525, 0, 0);
    tvGroup.add(frameRight);
    
    // TV back panel
    const backPanel = new THREE.Mesh(
        new THREE.BoxGeometry(3.1, 1.8, 0.1),
        frameMat
    );
    backPanel.position.set(0, 0, -0.08);
    backPanel.castShadow = true;
    backPanel.receiveShadow = true;
    tvGroup.add(backPanel);
    
    // Wall mount stand
    const mountMat = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.5,
        metalness: 0.7,
    });
    
    const mountArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.8, 0.08),
        mountMat
    );
    mountArm.position.set(0, 0, -0.13);
    tvGroup.add(mountArm);
    
    // export the screen mesh for video texture application
    tvGroup.userData = { screen, videoTexture, video };

    return tvGroup;
}
