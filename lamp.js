import * as THREE from 'three';

/*
 *  Creates a 3D model of a floor lamp with a base, pole, lampshade, bulb, and light source.
 */
export function createLamp() {
    const lampGroup = new THREE.Group();

    // -- Base: wide cylinder near the ground
    const baseHeight = 0.15;
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.5, baseHeight, 32),
      new THREE.MeshStandardMaterial({
        color: 0x6f5b3a,    // dark wood / gray
        roughness: 0.8,
        metalness: 0.1
        })
    );
    base.castShadow = true;
    base.receiveShadow = true;
    lampGroup.add(base);

    // -- Pole: tall, slender cylinder rising from the base
    const poleHeight = 1.0;
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, poleHeight, 20),
        new THREE.MeshStandardMaterial({
            color: 0x996633,     // lighter wood
            roughness: 0.6,
            metalness: 0.05
        })
    );
    pole.position.set(0, (baseHeight + poleHeight) / 2, 0);
    pole.castShadow = true;
    lampGroup.add(pole);

    // -- Shade: cone
    const shadeHeight = 0.8;
    const shade = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.3,
            0.7,
            shadeHeight,
            32,
            1,
            true // open at top and bottom
        ),
        new THREE.MeshStandardMaterial({
            color: 0xfff1c4,        // warm fabric color
            emissive: 0xffe2a0,     // subtle glow
            emissiveIntensity: 0,
            roughness: 0.9,
            metalness: 0.0,
            // opacity: 0.6,
            side: THREE.DoubleSide
       })
    );
    shade.position.y =
        baseHeight / 2 + poleHeight + shadeHeight / 2 - 0.1;
    lampGroup.add(shade);

    //-- Bulb: inside the shade
    const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 0.5, 16),
        new THREE.MeshStandardMaterial({
            color: 0xffffee,
            emissive: 0xffffff,
            emissiveIntensity: 0
        })
    );
    bulb.position.y = baseHeight / 2 + poleHeight + shadeHeight / 3;
    lampGroup.add(bulb);

    // -- Light source (for actual illumination)
    const light = new THREE.PointLight(0xfff5cc, 0, 6, 2.0);
    light.position.copy(bulb.position);
    light.castShadow = true;
    lampGroup.add(light);

    lampGroup.scale.set(0.7, 0.7, 0.7);

     // expose for toggle
    lampGroup.userData = { light, bulb, shade };

    return lampGroup;
}