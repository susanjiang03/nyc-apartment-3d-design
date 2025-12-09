import * as THREE from 'three';

export function createEndTable() {
    const matLightGrey = new THREE.MeshStandardMaterial({ color: 0xa0a8b0 });
    const endTableBrown = new THREE.MeshStandardMaterial({ color: 0x786f63});

    const endTable = new THREE.Group();
    const tableHeight = 0.15;
    const tableRadius = 0.8;
    const centerX = -4;
    const centerZ = -4;
    // -- Top 
    const top = new THREE.Mesh(
      new THREE.CylinderGeometry(tableRadius, tableRadius, tableHeight, 32),
      endTableBrown
    );
    top.position.set(centerX, 1.5, centerZ);
    top.castShadow = true;
    top.receiveShadow = true;
    endTable.add(top);

    // -- Bottom
    const bottom = new THREE.Mesh(
      new THREE.CylinderGeometry(tableRadius, tableRadius, tableHeight, 32),
      endTableBrown
    );
    bottom.position.set(centerX, 0.5, centerZ);
    bottom.castShadow = true;
    bottom.receiveShadow = true;
    endTable.add(bottom);
    
    // -- Legs (4 cylinders)
    const legHeight = 1.65;
    const legRadius = 0.8; 
    const legY = 0.85; 
    for (let i = 0; i < 4; i++) {
      const angle = i * (Math.PI / 2);
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, legHeight, 20),
        matLightGrey
      );
      
      leg.position.set(centerX + legRadius * Math.cos(angle), legY, centerZ + legRadius * Math.sin(angle));
      leg.castShadow = true;
      leg.receiveShadow = true;
      endTable.add(leg);
    }

    return endTable;

};