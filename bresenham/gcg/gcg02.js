////////////////////////////////////////////////////////////////////////////////
// gcg02.js
//
// Diese Datei enthaelt Hilfsfunktionen fuer den Praktikumsteil
// "Transformation A".
// Bearbeiten Sie diese Datei nicht.
//
// HS Duesseldorf - Fachbereich Medien - Grundlagen d. Computergrafik
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
// Globals
////////////////////////////////////////////////////////////////////////////////
var clock;                        // stores a clock to determine the frame time
var renderer, renderWidth, renderHeight;    // renderer and its size
var scene                         // scene containing geometry
var camera, camRotation;          // camera and its rotation around y-axis
var dragging, mouseDragStartX;    // used during mouse dragging for cam rotation
var uniformsA, uniformsB, uniformsC;  // uniform attributes passed to the shader



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// RENDERING CODE
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// function render()
// This function controls the rendering.
////////////////////////////////////////////////////////////////////////////////
function render()
{
  // register render() to be called for rendering the next frame
  requestAnimationFrame(render);
  
  // set the camera according to the current rotation around the y-axis
  setCamera();
  
  // apply all animations
  animate();
  
  // clear the frame and render it
  renderer.clear();
  renderer.render(scene, camera);
}



////////////////////////////////////////////////////////////////////////////////
// function animatie()
// This function controls the animation.
////////////////////////////////////////////////////////////////////////////////
function animate()
{
  // query frame time
  var time = clock.getElapsedTime();
  
  // reset the transformation matrix to identity, apply custom matrix afterwards
  transformationA = animateA(time);
  uniformsA.customPointMatrix.value = transformationA.pointMatrix;
  uniformsA.customNormalMatrix.value = transformationA.normalMatrix;
  
  var transformationB = animateB(time);
  uniformsB.customPointMatrix.value = transformationB.pointMatrix;
  uniformsB.customNormalMatrix.value = transformationB.normalMatrix;
  
  var transformationC = animateC(time);
  uniformsC.customPointMatrix.value = transformationC.pointMatrix;
  uniformsC.customNormalMatrix.value = transformationC.normalMatrix;
}



////////////////////////////////////////////////////////////////////////////////
// setCamera()
// Sets camera position and rotation.
////////////////////////////////////////////////////////////////////////////////
function setCamera()
{
//  // rotate the camera around the y-axis
  var rotation = 0.0025 * camRotation;
  camera.position.x = 250 * Math.sin(rotation * Math.PI);
  camera.position.z = 250 * Math.cos(rotation * Math.PI);
  camera.position.y = 30;

  // aim the camera at the origin
  camera.lookAt(new THREE.Vector3(0,0,0));
}





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// MAIN ENTRY POINT
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// main()
// Initialization ...
////////////////////////////////////////////////////////////////////////////////
function main()
{
  // do all the initializations
  init();
  
  // create event listeners
  window.document.addEventListener('mouseup', onMouseUpWindow, false)
  document.getElementById("renderer").addEventListener("mousedown", onMouseDown, false);
  document.getElementById("renderer").addEventListener("mousemove", onMouseMove, false);
  document.getElementById("renderer").addEventListener("mouseup", onMouseUp, false);
  
  // render the first frame
  render();
}





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// INITIALIZATIONS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// function renderer(width, height)
// This function creates a renderer inside <div id="renderer">.
// Must be called in a <script> element inside the respective div.
////////////////////////////////////////////////////////////////////////////////
function renderer(width, height)
{
  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
  
  // store globals
  renderWidth = width;
  renderHeight = height;
  
  // create renderer and set its attributes
  renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1 } );
  renderer.setSize(renderWidth, renderHeight);
  
  // create div-container for renderer
  container = document.createElement('div');
  // add renderer to container
  container.appendChild(renderer.domElement);
  // add container to <div id="renderer"> element in html body
  document.getElementById("renderer").appendChild(container);
}



////////////////////////////////////////////////////////////////////////////////
// function init()
// This function initializes the scene.
////////////////////////////////////////////////////////////////////////////////
function init()
{
  // frame clock
  clock = new THREE.Clock();
  
  
  // scene
  scene = new THREE.Scene();
  
  
  // camera
  camera = new THREE.PerspectiveCamera(30,
                                       renderWidth / renderHeight,
                                       1, 1000);
  camRotation = 0;
  dragging = false;
  setCamera();

  // materials
  var uniforms = {
    customPointMatrix: {type: "m4",
                        value: new Matrix4(1.0, 0.0, 0.0, 0.0,
                                          0.0, 1.0, 0.0, 0.0,
                                          0.0, 0.0, 1.0, 0.0,
                                          0.0, 0.0, 0.0, 1.0)},
    customNormalMatrix: {type: "m4",
                         value: new Matrix4(1.0, 0.0, 0.0, 0.0,
                                            0.0, 1.0, 0.0, 0.0,
                                            0.0, 0.0, 1.0, 0.0,
                                            0.0, 0.0, 0.0, 1.0)}
  };
  uniformsA = {
    customPointMatrix: {type: "m4",
                        value: new Matrix4(1.0, 0.0, 0.0, 0.0,
                                          0.0, 1.0, 0.0, 0.0,
                                          0.0, 0.0, 1.0, 0.0,
                                          0.0, 0.0, 0.0, 1.0)},
    customNormalMatrix: {type: "m4",
                         value: new Matrix4(1.0, 0.0, 0.0, 0.0,
                                            0.0, 1.0, 0.0, 0.0,
                                            0.0, 0.0, 1.0, 0.0,
                                            0.0, 0.0, 0.0, 1.0)}
  };
  uniformsB = {
    customPointMatrix: {type: "m4",
                        value: new Matrix4(1.0, 0.0, 0.0, 0.0,
                                          0.0, 1.0, 0.0, 0.0,
                                          0.0, 0.0, 1.0, 0.0,
                                          0.0, 0.0, 0.0, 1.0)},
    customNormalMatrix: {type: "m4",
                         value: new Matrix4(1.0, 0.0, 0.0, 0.0,
                                            0.0, 1.0, 0.0, 0.0,
                                            0.0, 0.0, 1.0, 0.0,
                                            0.0, 0.0, 0.0, 1.0)}
  };
  uniformsC = {
    customPointMatrix: {type: "m4",
                        value: new Matrix4(1.0, 0.0, 0.0, 0.0,
                                          0.0, 1.0, 0.0, 0.0,
                                          0.0, 0.0, 1.0, 0.0,
                                          0.0, 0.0, 0.0, 1.0)},
    customNormalMatrix: {type: "m4",
                         value: new Matrix4(1.0, 0.0, 0.0, 0.0,
                                            0.0, 1.0, 0.0, 0.0,
                                            0.0, 0.0, 1.0, 0.0,
                                            0.0, 0.0, 0.0, 1.0)}
  };
  
  var vtxShader = ["varying vec3 color;",
                   "uniform mat4 customPointMatrix;",
                   "uniform mat4 customNormalMatrix;",
                   "void main() {",
                   "gl_Position = ",
                   "projectionMatrix * modelViewMatrix *",
                   "customPointMatrix * vec4(position, 1.0);",
                   "vec3 n = normalize((modelViewMatrix *",
                   "customNormalMatrix * vec4(normal, 0.0)).xyz);",
                   "color = dot(n, vec3(0, 0, 1)) * vec3(0.9, 0.9, 0.9);",
                   "}"].join("\n");
  
  var fragShader = ["varying vec3 color;",
                    "void main() {",
                    "gl_FragColor = vec4(color, 1.0);",
                    "}"].join("\n");
  
  // cog meshes
  // pos = 20 10 0
  scene.add(new THREE.Mesh(geometry(cogA()),
                           new THREE.ShaderMaterial({
                                                    uniforms:        uniformsA,
                                                    vertexShader:    vtxShader,
                                                    fragmentShader:  fragShader
                                                    })));
  // pos = 47 2 0
  scene.add(new THREE.Mesh(geometry(cogB()),
                           new THREE.ShaderMaterial({
                                                    uniforms:        uniformsB,
                                                    vertexShader:    vtxShader,
                                                    fragmentShader:  fragShader
                                                  })));
  // pos = 67 14 0    scale = 10 10 0
  scene.add(new THREE.Mesh(geometry(cogC()),
                         new THREE.ShaderMaterial({
                                                  uniforms:        uniformsC,
                                                  vertexShader:    vtxShader,
                                                  fragmentShader:  fragShader
                                                  })));
  
  // coordinate axes
  var axisX = 
    new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 10, 8, 1, false),
                   new THREE.MeshBasicMaterial({color: 0xff0000}));
  var axisY =
    new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 10, 8, 1, false),
                   new THREE.MeshBasicMaterial({color: 0x00ff00}));
  var axisZ =
    new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 10, 8, 1, false),
                   new THREE.MeshBasicMaterial({color: 0x0000ff}));
  
  axisX.translateX(5);
  axisY.translateY(5);
  axisZ.translateZ(5);

  axisX.rotation.z = 0.5 * Math.PI;
  axisZ.rotation.x = 0.5 * Math.PI;
    
  scene.add(axisX);
  scene.add(axisY);
  scene.add(axisZ);
}





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// CONVENIENCE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// This wraps THREE.Matrix4 to Matrix4. Both are compatible.
////////////////////////////////////////////////////////////////////////////////
Matrix4 = function(m00, m01, m02, m03,
                   m10, m11, m12, m13,
                   m20, m21, m22, m23,
                   m30, m31, m32, m33)
{
  THREE.Matrix4.call(this);
  this.set(m00, m01, m02, m03,
           m10, m11, m12, m13,
           m20, m21, m22, m23,
           m30, m31, m32, m33);
}
Matrix4.prototype = new THREE.Matrix4();



////////////////////////////////////////////////////////////////////////////////
// function geometry()
// This function converts manually created meshes to THREE.Geometry.
////////////////////////////////////////////////////////////////////////////////
function geometry(rawGeom)
{
  var returnGeom = new THREE.Geometry();
  
  // add vertices
  for (var i = 0; i < rawGeom.vertices.length; i += 3)
  {
    returnGeom.vertices.push(new THREE.Vector3(rawGeom.vertices[i],
                                               rawGeom.vertices[i+1],
                                               rawGeom.vertices[i+2]));
  }
  
  // add triangular faces
  for (var i = 0; i < rawGeom.faces.length; i += 3)
  {
    returnGeom.faces.push(new THREE.Face3(rawGeom.faces[i] - 1,
                                          rawGeom.faces[i+1] - 1,
                                          rawGeom.faces[i+2] - 1));
  }
  
  // calculate face normals
  returnGeom.computeFaceNormals();
  
  return returnGeom;
}





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// EVENT HANDLING
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// onMouseDown(event)
// Handles mouse down events, i.e., starts dragging the camera rotation.
////////////////////////////////////////////////////////////////////////////////
function onMouseDown(event)
{
  dragging = true;
  mouseDragStartX = getRelative(event).x;
}



////////////////////////////////////////////////////////////////////////////////
// onMousMove(event)
// Handles mouse movements, i.e., evaluates dragging the camera rotation.
////////////////////////////////////////////////////////////////////////////////
function onMouseMove(event)
{
  if (dragging)
  {
    var delta = mouseDragStartX - getRelative(event).x;
    if (!isNaN(delta))  // check if mouse is inside div element
    {
      camRotation += delta;
      mouseDragStartX = getRelative(event).x;
    }
  }
}



////////////////////////////////////////////////////////////////////////////////
// onMousUp(event)
// Handles mouse up events, i.e., releases camera drag.
////////////////////////////////////////////////////////////////////////////////
function onMouseUp(event)
{
  onMouseMove(event);   // just reusing the above code
  dragging = false;     // adding one line here
}



////////////////////////////////////////////////////////////////////////////////
// onMouseUpWindow(event)
// Handles mouse up events, i.e., releases camera drag -- even outside renderer.
////////////////////////////////////////////////////////////////////////////////
function onMouseUpWindow(event)
{
  dragging = false;
}
