import * as THREE from 'three';

export function createCabinetShelves() {
    const group = new THREE.Group();

  // -------- sizes (in world units) --------
  const width   = 7.5;   // left–right
  const depth   = 1.6;   // front–back
  const thick   = 0.10;  // thickness of top
  const height = 1;

  // -------- materials --------
  const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.2 });

  // -------- shelves --------
  const shelfGeo = new THREE.BoxGeometry(
    width,
    thick,
    depth
  );
  const shelfPositions = [
    [0, 0.1, 0], 
    [0, 0.5, 0], 
    [0, 0.9, 0], 
  ];

//   shelfPositions
  shelfPositions.forEach(pos => {
    const shelf = new THREE.Mesh(shelfGeo, whiteMaterial);
    shelf.position.set(pos[0], pos[1], pos[2]);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    group.add(shelf);
  });

//   const shelf = new THREE.Mesh(shelfGeo, whiteMaterial);
//   shelf.castShadow = true;
//   shelf.receiveShadow = true;
//   shelf.position.set(0, 0.1, 0);
//   group.add(shelf);

  // left panel
  const leftPanelGeo = new THREE.BoxGeometry(
    0.05,
    height,
    depth
  );
  const leftPanel = new THREE.Mesh(leftPanelGeo, whiteMaterial);
  leftPanel.position.set(
    width / 2 - 0.025,
    height/2,
    0
  );
  group.add(leftPanel);
  
  // right panel
  const rightPanelGeo = new THREE.BoxGeometry(
    0.05,
    height,
    depth
  );
  const rightPanel = new THREE.Mesh(rightPanelGeo, whiteMaterial);
    rightPanel.position.set(
    -width / 2 + 0.025,
    height/2,
    0
  );
  group.add(rightPanel);

//   //front panel
//   const frontPanelGeo = new THREE.BoxGeometry(
//     counterWidth,
//     counterHeight,
//     0.05,
//   );
//   const frontPanel = new THREE.Mesh(frontPanelGeo, whiteMaterial);
//   frontPanel.position.set(
//     0,
//     counterHeight/2,
//     counterDepth
//   );
//   group.add(frontPanel);

  return group;
    
}