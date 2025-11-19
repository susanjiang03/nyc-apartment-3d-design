/*
    NYU Apartment - S/Z-Chair
    File: modernChair.js
    Author: Colin Onevathana
    
    Base section: 6 faces
    Diagonal section: 6 faces
    Seat section: 6 faces
    Back section: 6 faces
*/

// S-Chair: Base, Diagonal, Seat, Back
function GenerateChair()
{
    var startIndex = points.length;
    
    var width = 0.75;
    var thickness = 0.1;
    
    // Base section
    var base_back = 0.6;
    var base_height = 0;
    
    // Diagonal section
    var diag_start = base_back - .6;
    var diag_end = base_back;
    var diag_bottom = base_height;
    var diag_top = 0.5;
    
    // Seat section
    var seat_front = diag_end - .7;
    var seat_back = diag_end;
    var seat_height = diag_top;
    
    // Back section
    var back_bottom = seat_back - .7;
    var back_top = seat_back - .8;
    var back_height_bottom = seat_height;
    var back_height_top = seat_height + 0.6;
    
    // BASE
    var base_vertices = [
        vec4(-width/2, base_height, 0, 1.0),
        vec4(width/2, base_height, 0, 1.0),
        vec4(-width/2, base_height, base_back, 1.0),
        vec4(width/2, base_height, base_back, 1.0),
        vec4(-width/2, base_height + thickness, 0, 1.0),
        vec4(width/2, base_height + thickness, 0, 1.0),
        vec4(-width/2, base_height + thickness, base_back, 1.0),
        vec4(width/2, base_height + thickness, base_back, 1.0)
    ];
    
    quad(base_vertices[0], base_vertices[1], base_vertices[3], base_vertices[2]);
    quad(base_vertices[6], base_vertices[7], base_vertices[5], base_vertices[4]);
    quad(base_vertices[2], base_vertices[3], base_vertices[7], base_vertices[6]);
    quad(base_vertices[4], base_vertices[5], base_vertices[1], base_vertices[0]);
    quad(base_vertices[0], base_vertices[2], base_vertices[6], base_vertices[4]);
    quad(base_vertices[5], base_vertices[7], base_vertices[3], base_vertices[1]);
    
    // DIAGONAL
    var diag_vertices = [
        vec4(-width/2, diag_bottom + thickness, diag_start, 1.0),
        vec4(width/2, diag_bottom + thickness, diag_start, 1.0),
        vec4(-width/2, diag_top, diag_end, 1.0),
        vec4(width/2, diag_top, diag_end, 1.0),
        vec4(-width/2, diag_bottom + thickness*2, diag_start, 1.0),
        vec4(width/2, diag_bottom + thickness*2, diag_start, 1.0),
        vec4(-width/2, diag_top + thickness, diag_end, 1.0),
        vec4(width/2, diag_top + thickness, diag_end, 1.0)
    ];
    
    quad(diag_vertices[0], diag_vertices[1], diag_vertices[3], diag_vertices[2]);
    quad(diag_vertices[6], diag_vertices[7], diag_vertices[5], diag_vertices[4]);
    quad(diag_vertices[2], diag_vertices[3], diag_vertices[7], diag_vertices[6]);
    quad(diag_vertices[4], diag_vertices[5], diag_vertices[1], diag_vertices[0]);
    quad(diag_vertices[0], diag_vertices[2], diag_vertices[6], diag_vertices[4]);
    quad(diag_vertices[5], diag_vertices[7], diag_vertices[3], diag_vertices[1]);
    
    // SEAT
    var seat_vertices = [
        vec4(-width/2, seat_height, seat_front, 1.0),
        vec4(width/2, seat_height, seat_front, 1.0),
        vec4(-width/2, seat_height, seat_back, 1.0),
        vec4(width/2, seat_height, seat_back, 1.0),
        vec4(-width/2, seat_height + thickness, seat_front, 1.0),
        vec4(width/2, seat_height + thickness, seat_front, 1.0),
        vec4(-width/2, seat_height + thickness, seat_back, 1.0),
        vec4(width/2, seat_height + thickness, seat_back, 1.0)
    ];
    
    quad(seat_vertices[0], seat_vertices[1], seat_vertices[3], seat_vertices[2]);
    quad(seat_vertices[6], seat_vertices[7], seat_vertices[5], seat_vertices[4]);
    quad(seat_vertices[2], seat_vertices[3], seat_vertices[7], seat_vertices[6]);
    quad(seat_vertices[4], seat_vertices[5], seat_vertices[1], seat_vertices[0]);
    quad(seat_vertices[0], seat_vertices[2], seat_vertices[6], seat_vertices[4]);
    quad(seat_vertices[5], seat_vertices[7], seat_vertices[3], seat_vertices[1]);
    
    // BACK
    var back_vertices = [
        vec4(-width/2, back_height_bottom + thickness, back_bottom, 1.0),
        vec4(width/2, back_height_bottom + thickness, back_bottom, 1.0),
        vec4(-width/2, back_height_top, back_top, 1.0),
        vec4(width/2, back_height_top, back_top, 1.0),
        vec4(-width/2, back_height_bottom + thickness*2, back_bottom, 1.0),
        vec4(width/2, back_height_bottom + thickness*2, back_bottom, 1.0),
        vec4(-width/2, back_height_top + thickness, back_top, 1.0),
        vec4(width/2, back_height_top + thickness, back_top, 1.0)
    ];
    
    quad(back_vertices[0], back_vertices[1], back_vertices[3], back_vertices[2]);
    quad(back_vertices[6], back_vertices[7], back_vertices[5], back_vertices[4]);
    quad(back_vertices[2], back_vertices[3], back_vertices[7], back_vertices[6]);
    quad(back_vertices[4], back_vertices[5], back_vertices[1], back_vertices[0]);
    quad(back_vertices[0], back_vertices[2], back_vertices[6], back_vertices[4]);
    quad(back_vertices[5], back_vertices[7], back_vertices[3], back_vertices[1])
    
    return {start: startIndex, count: points.length - startIndex};
}



// Draw the S-Chair at specified position
function DrawChair(x, y, z)
{
    var chairColor = vec4(0.9, 0.3, 0.3, 1);
    var chairDiff = vec4(0.6, 0.2, 0.2, 1);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(chairColor));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(chairDiff));
    
    modelViewStack.push(modelViewMatrix);
    var t = translate(x, y, z);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, chairGeometry.start, chairGeometry.count);
    modelViewMatrix = modelViewStack.pop();
}
