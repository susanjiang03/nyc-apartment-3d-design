import * as THREE from 'three';

export function createCoffeeTable() {
    const matLightGrey = new THREE.MeshStandardMaterial({ color: 0xa0a8b0 });
    
    const coffeeTable = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 2, 32),
    );
    // Scale X and Z to make it elliptical
    const a = 2; // ellipse radius X
    const b = 1.5; // ellipse radius Z
    coffeeTable.scale.set(a, 0.2, b);  // scale Y=1 keeps the height
    //TODO: change color
    coffeeTable.material = new THREE.MeshPhysicalMaterial({
        color: 0xaad8ff,    // light blue tint (glass)
        transparent: true,
        opacity: 0.5,      // mostly see-through
        transmission: 1.0,  // real glass-style transparency
        roughness: 0.05,    // lower = sharper reflections
        metalness: 0.0,
        ior: 1.5,           // index of refraction (glass ~1.5)
        thickness: 0.05,    // how thick the glass looks
        side: THREE.DoubleSide
    });;
    coffeeTable.position.setY(0.75);
    // -- Legs (4 cylinders)
    const coffeeTableLegHeight = 2;
    const coffeeTableLegRadius = 0.9; 
    const coffeeTableLegY = 2; 
    for (let i = 0; i < 4; i++) {
        const angle = Math.PI / 4 + i * (Math.PI / 2);
        const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, coffeeTableLegHeight, 20),
            //TODO: change color
            matLightGrey
        );
        //TODO: rotate legs
        leg.position.set(coffeeTableLegRadius * Math.cos(angle), -coffeeTableLegY, coffeeTableLegRadius * Math.sin(angle));
        coffeeTable.add(leg);
    }

    return coffeeTable;
};