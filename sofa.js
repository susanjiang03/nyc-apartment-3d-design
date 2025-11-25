import * as THREE from 'three';

export function createSofa() {
    const seatHeight    = 1.5;  // top of seat
    const backHeight    = 3.0;  // top of backrest
    const seatDepthX    = 2.0;  // how far the seat sticks out (left→right in profile)
    const backThickness = 0.5;  // thickness of the vertical back

      //      8)(delta, backHeight)
      //        /------------\ 7)(backThickness - delta, backHeight)
    // 9)(backThickness,      |6)(backThickness, backHeight - delta)
    //  backHeight - delta).  |
      //        |            | 
      //        |            |
      //        |            | 5)(backThickness, seatHeight)
      //        +--------------------------\ 4) (seatDepthX - delta, seatHeight)
      //        |                           | 3) (seatDepthX, seatHeight - delta)
      //        |                           |
      //        |                           |
      //        +---------------------------+ 
      //       1) (0,0)                      2) (seatDepthX,0)
    var delta = 0.1;
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);                                 // 1) front bottom
    shape.lineTo(seatDepthX, 0);                        // 2) along bottom to back
    shape.lineTo(seatDepthX, seatHeight - delta);       // 3) up to top of seat
    shape.lineTo(seatDepthX - delta, seatHeight);       // 4) seat front edge
    shape.lineTo(backThickness, seatHeight);            // 5) back along seat to where back starts
    shape.lineTo(backThickness, backHeight - delta);    // 6) up the backrest
    shape.lineTo(backThickness - delta, backHeight);    // 7) top of backrest front edge
    shape.lineTo(delta, backHeight);                   // 8) top of back back edge
    shape.lineTo(0, backHeight - delta);               // 9)  back back edge
    shape.closePath();                                 // 10) back down to (0,0)

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