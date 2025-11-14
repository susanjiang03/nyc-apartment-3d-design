/*
    NYU Apartment - Bookshelf
    File: bookshelf.js
    Author: Colin Onevathana
*/

// Generate bookshelf geometry (returns start and count for drawing)
function GenerateBookshelf()
{
    var startIndex = points.length;
    
    var cube = [
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
    ];
    
    // Add cube faces
    quad(cube[1], cube[0], cube[3], cube[2]); // front
    quad(cube[2], cube[3], cube[7], cube[6]); // right
    quad(cube[3], cube[0], cube[4], cube[7]); // bottom
    quad(cube[6], cube[5], cube[1], cube[2]); // top
    quad(cube[4], cube[5], cube[6], cube[7]); // back
    quad(cube[5], cube[4], cube[0], cube[1]); // left
    
    return {start: startIndex, count: points.length - startIndex};
}

// Draw the complete bookshelf at specified position
function DrawBookshelf(x, y, z)
{
    var brown = vec4(0.6, 0.45, 0.3, 1);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(brown));

    var width = 2;
    var height = 3;
    var depth = 1;
    var thickness = 0.05;

    // 1. Left side panel
    DrawBookshelfComponent(x - width/2 + thickness/2, y + height/2, z, thickness, height, depth);

    // 2. Right side panel
    DrawBookshelfComponent(x + width/2 - thickness/2, y + height/2, z, thickness, height, depth);

    // 3. Top panel
    DrawBookshelfComponent(x, y + height - thickness/2, z, width, thickness, depth);

    // 4. Bottom panel
    DrawBookshelfComponent(x, y + thickness/2, z, width, thickness, depth);

    // 5. Back panel (thinner)
    DrawBookshelfComponent(x, y + height/2, z - depth/2 + thickness/4, width - thickness*2, height - thickness*2, thickness*0.5);

    // 6. First shelf
    var shelf1Y = y + height * 0.25;
    DrawBookshelfComponent(x, shelf1Y, z, width - thickness*2, thickness, depth);

    // 7. Second shelf
    var shelf2Y = y + height * 0.5;
    DrawBookshelfComponent(x, shelf2Y, z, width - thickness*2, thickness, depth);

    // 8. Third shelf
    var shelf3Y = y + height * 0.75;
    DrawBookshelfComponent(x, shelf3Y, z, width - thickness*2, thickness, depth);

    // 9. Left vertical divider (between shelves 1 and 2) - moved toward center
    var divider1Height = shelf2Y - shelf1Y;
    DrawBookshelfComponent(x - (width - thickness*2)/4, (shelf1Y + shelf2Y) / 2, z, thickness*0.8, divider1Height, depth);

    // 10. Right vertical divider (between shelves 2 and 3) - moved toward center
    var divider2Height = shelf3Y - shelf2Y;
    DrawBookshelfComponent(x + (width - thickness*2)/4, (shelf2Y + shelf3Y) / 2, z, thickness*0.8, divider2Height, depth);
}

function DrawBookshelfComponent(x, y, z, w, h, d)
{
    modelViewStack.push(modelViewMatrix);
    var s = scale4(w, h, d);
    var t = translate(x, y, z);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, bookshelfGeometry.start, bookshelfGeometry.count);
    modelViewMatrix = modelViewStack.pop();
}
