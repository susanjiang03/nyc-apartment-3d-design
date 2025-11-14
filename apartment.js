/*
    NYU Apartment - Main WebGL File
    File: apartment.js
    Authors: Colin Onevathana & Lingshan Jiang
*/

var gl, program;

var points = [];

var modelViewMatrix;
var projectionMatrixLoc;
var modelViewMatrixLoc;
var modelViewStack = [];

var r = 8;
var zoom = 5;
var lr = 45;
var ud = 30;

var bookshelfGeometry;
var chairGeometry;
var roomGeometry;

function main()
{
    var canvas = document.getElementById("gl-canvas");
    
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
        return;
    }
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.1, 0.15, 0.3, 1.0);  // Dark blue background
    
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Generate floor/room geometry first
    GenerateRoom();
    
    // Generate all geometry using functions from bookshelf.js and modernChair.js
    bookshelfGeometry = GenerateBookshelf();
    chairGeometry = GenerateChair();
    
    SendData();

    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    // Keyboard controls for camera
    window.onkeydown = function(event)
    {
        switch(event.keyCode)
        {
            case 37: // left arrow
                lr += 10;
                break;
            case 38: // up arrow
                if (ud < 80)
                    ud += 10;
                break;
            case 39: // right arrow
                lr -= 10;
                break;
            case 40: // down arrow
                if (ud > -80)
                    ud -= 10;
                break;
            case 82: // R key - reset view
                lr = 45;
                ud = 20;
                break;
        }
    };

    render();
}

// Shared utility function - used by both bookshelf.js and modernChair.js
function quad(a, b, c, d)
{
    points.push(a);
    points.push(b);
    points.push(c);
    points.push(a);
    points.push(c);
    points.push(d);
}

function SendData()
{
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var projectionMatrix = ortho(-zoom, zoom, -zoom, zoom, -100, 100);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    var eye = vec3(
        r * Math.cos(ud/180 * Math.PI) * Math.cos(lr/180 * Math.PI),
        r * Math.sin(ud/180 * Math.PI),
        r * Math.cos(ud/180 * Math.PI) * Math.sin(lr/180 * Math.PI)
    );
    modelViewMatrix = lookAt(eye, [0, 0, 0], [0, 1, 0]);

    // Draw room first (floor and walls)
    DrawRoom();
    
    // Draw objects using functions from bookshelf.js and modernChair.js
    DrawBookshelf(-2, 0, 0);
    DrawChair(2, 0, 0);

    requestAnimFrame(render);
}

// Utility function for scaling transformations
function scale4(a, b, c)
{
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

// Generate large grey room (floor and walls)
function GenerateRoom()
{
    var startIndex = points.length;
    
    // Floor with thickness
    var size = 10;
    var thickness = 0.1;
    
    // Top surface
    var top = [
        vec4(-size, 0, size, 1.0),
        vec4(-size, 0, -size, 1.0),
        vec4(size, 0, -size, 1.0),
        vec4(size, 0, size, 1.0)
    ];
    
    // Bottom surface
    var bottom = [
        vec4(-size, -thickness, size, 1.0),
        vec4(-size, -thickness, -size, 1.0),
        vec4(size, -thickness, -size, 1.0),
        vec4(size, -thickness, size, 1.0)
    ];
    
    // Top face
    quad(top[0], top[1], top[2], top[3]);
    
    // Bottom face
    quad(bottom[3], bottom[2], bottom[1], bottom[0]);
    
    // Side faces
    quad(top[0], top[3], bottom[3], bottom[0]); // front
    quad(top[3], top[2], bottom[2], bottom[3]); // right
    quad(top[2], top[1], bottom[1], bottom[2]); // back
    quad(top[1], top[0], bottom[0], bottom[1]); // left
    
    roomGeometry = {start: startIndex, count: points.length - startIndex};
}

function DrawRoom()
{
    var grey = vec4(0.6, 0.6, 0.6, 1);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(grey));
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, roomGeometry.start, roomGeometry.count);
}
