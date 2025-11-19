/*
    NYU Apartment - Bookshelf
    File: bookshelf.js
    Author: Colin Onevathana
    
    - cube primitives (bookshelf)
    - cylinder primitives (vase)
    - sphere primitives (vase)
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
    var brownDiff = vec4(0.4, 0.3, 0.2, 1);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(brown));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(brownDiff));

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
    
    // Vase on 1st shelf, left side
    var vaseX = x - (width - thickness*2)/4 - 0.3;
    var vaseY = shelf1Y + thickness;
    var vaseZ = z + depth/6;
    
    DrawVase(vaseX, vaseY, vaseZ);
}

// Generate cylinder primitive
var cylinderGeometry = null;
function GenerateCylinder()
{
    if (cylinderGeometry) return cylinderGeometry;
    var startIndex = points.length;
    var sides = 16;
    var radius = 0.5;
    var height = 1.0;
    
    var topCenter = vec4(0, height/2, 0, 1.0);
    var botCenter = vec4(0, -height/2, 0, 1.0);
    
    for (var i = 0; i < sides; i++)
    {
        var angle1 = (i / sides) * 2 * Math.PI;
        var angle2 = ((i + 1) / sides) * 2 * Math.PI;
        
        var x1 = radius * Math.cos(angle1);
        var z1 = radius * Math.sin(angle1);
        var x2 = radius * Math.cos(angle2);
        var z2 = radius * Math.sin(angle2);
        
        var top1 = vec4(x1, height/2, z1, 1.0);
        var top2 = vec4(x2, height/2, z2, 1.0);
        var bot1 = vec4(x1, -height/2, z1, 1.0);
        var bot2 = vec4(x2, -height/2, z2, 1.0);
        
        // Side faces
        quad(bot1, bot2, top2, top1);
        
        // Top cap (triangle)
        var topNormal = vec3(0, 1, 0);
        points.push(topCenter); normals.push(topNormal);
        points.push(top1); normals.push(topNormal);
        points.push(top2); normals.push(topNormal);
        
        // Bottom cap (triangle)
        var botNormal = vec3(0, -1, 0);
        points.push(botCenter); normals.push(botNormal);
        points.push(bot2); normals.push(botNormal);
        points.push(bot1); normals.push(botNormal);
    }
    
    cylinderGeometry = {start: startIndex, count: points.length - startIndex};
    return cylinderGeometry;
}

// Generate sphere primitive
var sphereGeometry = null;
function GenerateSphere()
{
    if (sphereGeometry) return sphereGeometry;
    var startIndex = points.length;
    var latBands = 12;
    var longBands = 12;
    
    for (var lat = 0; lat < latBands; lat++)
    {
        var theta1 = (lat / latBands) * Math.PI;
        var theta2 = ((lat + 1) / latBands) * Math.PI;
        
        for (var lon = 0; lon < longBands; lon++)
        {
            var phi1 = (lon / longBands) * 2 * Math.PI;
            var phi2 = ((lon + 1) / longBands) * 2 * Math.PI;
            
            var v1 = vec4(Math.sin(theta1) * Math.cos(phi1), Math.cos(theta1), Math.sin(theta1) * Math.sin(phi1), 1.0);
            var v2 = vec4(Math.sin(theta1) * Math.cos(phi2), Math.cos(theta1), Math.sin(theta1) * Math.sin(phi2), 1.0);
            var v3 = vec4(Math.sin(theta2) * Math.cos(phi2), Math.cos(theta2), Math.sin(theta2) * Math.sin(phi2), 1.0);
            var v4 = vec4(Math.sin(theta2) * Math.cos(phi1), Math.cos(theta2), Math.sin(theta2) * Math.sin(phi1), 1.0);
            
            quad(v1, v2, v3, v4);
        }
    }
    
    sphereGeometry = {start: startIndex, count: points.length - startIndex};
    return sphereGeometry;
}

// Generate cone primitive
var coneGeometry = null;
function GenerateCone()
{
    if (coneGeometry) return coneGeometry;
    var startIndex = points.length;
    var sides = 12;
    var radius = 0.5;
    var height = 1.0;
    var apex = vec4(0, height/2, 0, 1.0);
    
    for (var i = 0; i < sides; i++)
    {
        var angle1 = (i / sides) * 2 * Math.PI;
        var angle2 = ((i + 1) / sides) * 2 * Math.PI;
        
        var x1 = radius * Math.cos(angle1);
        var z1 = radius * Math.sin(angle1);
        var x2 = radius * Math.cos(angle2);
        var z2 = radius * Math.sin(angle2);
        
        var base1 = vec4(x1, -height/2, z1, 1.0);
        var base2 = vec4(x2, -height/2, z2, 1.0);
        
        var t1 = subtract(base2, base1);
        var t2 = subtract(apex, base1);
        var normal = normalize(cross(t1, t2));
        normal = vec3(normal);
        
        points.push(base1); normals.push(normal);
        points.push(base2); normals.push(normal);
        points.push(apex); normals.push(normal);
    }
    
    coneGeometry = {start: startIndex, count: points.length - startIndex};
    return coneGeometry;
}

function DrawVase(x, y, z)
{
    GenerateCylinder();
    GenerateSphere();
    
    var teal = vec4(0.2, 0.5, 0.55, 1);
    var tealDiff = vec4(0.15, 0.35, 0.4, 1);
    
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(teal));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(tealDiff));
    
    // Bottom sphere (rounded base)
    modelViewStack.push(modelViewMatrix);
    var s = scale4(0.12, 0.08, 0.12);
    var t = translate(x, y + 0.03, z);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, sphereGeometry.start, sphereGeometry.count);
    modelViewMatrix = modelViewStack.pop();
    
    // Middle cylinder (main body)
    modelViewStack.push(modelViewMatrix);
    s = scale4(0.14, 0.18, 0.14);
    t = translate(x, y + 0.12, z);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, cylinderGeometry.start, cylinderGeometry.count);
    modelViewMatrix = modelViewStack.pop();
    
    // Upper sphere (rounded shoulder)
    modelViewStack.push(modelViewMatrix);
    s = scale4(0.13, 0.08, 0.13);
    t = translate(x, y + 0.25, z);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, sphereGeometry.start, sphereGeometry.count);
    modelViewMatrix = modelViewStack.pop();
    
    // Neck cylinder
    modelViewStack.push(modelViewMatrix);
    s = scale4(0.07, 0.06, 0.07);
    t = translate(x, y + 0.32, z);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, cylinderGeometry.start, cylinderGeometry.count);
    modelViewMatrix = modelViewStack.pop();
    
    // Rim cylinder
    modelViewStack.push(modelViewMatrix);
    s = scale4(0.095, 0.025, 0.095);
    t = translate(x, y + 0.37, z);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, cylinderGeometry.start, cylinderGeometry.count);
    modelViewMatrix = modelViewStack.pop();
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
