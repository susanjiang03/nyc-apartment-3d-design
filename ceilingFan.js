import * as THREE from "three";

/**
 * Ceiling fan with 5 blades, similar to the reference image
 * - Silver/chrome center housing
 * - 5 brown wooden blades
 * - Light fixture underneath
 * - Pull chains
 */
export function createCeilingFan() {
  const fanGroup = new THREE.Group();

  // Materials
  const matWhite = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, 
    roughness: 0.3 
  });
  const matBrownBlade = new THREE.MeshStandardMaterial({ 
    color: 0x6b4423, 
    roughness: 0.6 
  });
  const matWhiteGlass = new THREE.MeshStandardMaterial({ 
    color: 0xf5f5dc, 
    emissive: 0xffffaa, 
    emissiveIntensity: 0.3,
    opacity: 0.8,
    transparent: true
  });

  // 1) Center mounting bracket (top part that attaches to ceiling) - smaller and white
  const mountingPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32),
    matWhite
  );
  mountingPlate.position.set(0, 0, 0);
  fanGroup.add(mountingPlate);

  // 2) Motor housing (main cylindrical body) - smaller and white
  const motorHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.18, 0.2, 32),
    matWhite
  );
  motorHousing.position.set(0, -0.12, 0);
  fanGroup.add(motorHousing);

  // 3) Bottom cap of motor - smaller and white
  const bottomCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.18, 0.03, 32),
    matWhite
  );
  bottomCap.position.set(0, -0.23, 0);
  fanGroup.add(bottomCap);

  // 4) Create 5 blades
  const bladeCount = 5;
  const bladeLength = 1.2;
  const bladeWidth = 0.25;
  const bladeThickness = 0.03;
  
  for (let i = 0; i < bladeCount; i++) {
    const angle = (i * Math.PI * 2) / bladeCount;
    
    // Blade arm (metal piece connecting blade to motor) - white
    const bladeArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.02, 0.1),
      matWhite
    );
    bladeArm.position.set(
      Math.cos(angle) * 0.25,
      -0.22,
      Math.sin(angle) * 0.25
    );
    bladeArm.rotation.y = -angle;
    fanGroup.add(bladeArm);
    
    // Wooden blade
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(bladeLength, bladeThickness, bladeWidth),
      matBrownBlade
    );
    blade.position.set(
      Math.cos(angle) * (0.25 + bladeLength / 2),
      -0.22,
      Math.sin(angle) * (0.25 + bladeLength / 2)
    );
    blade.rotation.y = -angle;
    fanGroup.add(blade);
  }

  // 5) Light fixture housing underneath - smaller and white
  const lightHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 0.12, 32),
    matWhite
  );
  lightHousing.position.set(0, -0.35, 0);
  fanGroup.add(lightHousing);

  // 6) Glass light shade (frosted white) - smaller
  const lightShade = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2),
    matWhiteGlass
  );
  lightShade.position.set(0, -0.43, 0);
  lightShade.rotation.x = Math.PI; // flip upside down
  fanGroup.add(lightShade);

  // Enable shadows for all meshes
  fanGroup.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return fanGroup;
}
