import * as THREE from 'three';

export function createSofa() {
    const seatHeight    = 1.5;  // top of seat
    const backHeight    = 3.0;  // top of backrest
    const seatDepthX    = 2.0;  // how far the seat sticks out (left→right in profile)
    const backThickness = 0.5;  // thickness of the vertical back

  //      6)(0, backHeight)
  //        +------------+ 5)(backThickness, backHeight)
  //        |            |
  //        |            |
  //        |            |
  //        |            | 4)(backThickness, seatHeight)
  //        +---------------------------+ 3) (seatDepthX, seatHeight)
  //        |                           |
  //        |                           |
  //        |                           |
  //        +---------------------------+ 
  //       1) (0,0)                      2) (seatDepthX,0)

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);                        // 1) front bottom
    shape.lineTo(seatDepthX, 0);               // 2) along bottom to back
    shape.lineTo(seatDepthX, seatHeight);      // 3) up to top of seat
    shape.lineTo(backThickness, seatHeight);   // 4) back along seat to where back starts
    shape.lineTo(backThickness, backHeight);   // 5) up the backrest
    shape.lineTo(0, backHeight);               // 6) over to top of back
    shape.closePath();                         // 7) back down to (0,0)

    const sofaGeo = new THREE.ExtrudeGeometry(shape, {depth: 2.5, bevelEnabled: false});

    const matSofa = new THREE.MeshStandardMaterial({
        //TODO: change color
        color: 0x5a3b2e,
        metalness: 0.1,
        roughness: 0.85
    });

    const sofa = new THREE.Mesh(sofaGeo, matSofa);
    sofa.castShadow = true;
    sofa.receiveShadow = true;

    return sofa;
}