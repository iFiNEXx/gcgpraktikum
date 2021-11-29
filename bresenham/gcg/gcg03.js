////////////////////////////////////////////////////////////////////////////////
// gcg02.js
//
// Diese Datei enthaelt Hilfsfunktionen fuer den Praktikumsteil
// "Transformation B".
// Bearbeiten Sie diese Datei nicht.
//
// HS Duesseldorf - Fachbereich Medien - Grundlagen d. Computergrafik
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
// Globals
////////////////////////////////////////////////////////////////////////////////
var clock;                        // stores a clock to determine the frame time
var renderer, renderWidth, renderHeight;    // renderer and its size
var camera, camRotationY, camRotationX;           // camera and its rotation around y-axis
var dragging, mouseDragStartX, mouseDragStartY;   // used during mouse dragging for cam rotation
var scene;              // scene containing geometry
var uniforms = [];      // uniforms passed to the shaders
var meshes = [];        // meshes in scene



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
  renderFrame();
}





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// RENDERING CODE
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// function renderFrame()
// This function controls the rendering of a complete frame.
////////////////////////////////////////////////////////////////////////////////
function renderFrame()
{
  // query frame time
  var time = clock.getElapsedTime();
  
  // register render() to be called for rendering the next frame
  requestAnimationFrame(renderFrame);
  
  // set the camera according to the current rotation around the y-axis
  setCamera();
  
  // call custom rendering function
  if (typeof renderScene == 'function')
  {
    renderScene(time);
  }
  
  // clear the frame and render it
  renderer.clear();
  renderer.render(scene, camera);
  
  for (var m in meshes)
  {
    meshes[m].visible = false;
  }
}



////////////////////////////////////////////////////////////////////////////////
// function renderSceneNode(node, pointMatrix, normalMatrix)
// This function renders a single scene node.
// I.e., node is set to visible and
// pointMatrix and normalMatrix are passed to the resp. shader.
////////////////////////////////////////////////////////////////////////////////
function renderSceneNode(node, pointMatrix, normalMatrix)
{
  // simple error handling
  if ((node.shape != undefined) &&
      (pointMatrix != undefined) &&
      (normalMatrix != undefined))
  {
    if ((node.shape >= 0) && (node.shape < uniforms.length))
    {
      uniforms[node.shape].customPointMatrix.value = pointMatrix.clone();
      uniforms[node.shape].customNormalMatrix.value = normalMatrix.clone();
      meshes[node.shape].visible = true;
    }
  }
}



////////////////////////////////////////////////////////////////////////////////
// setCamera()
// Sets camera position and rotation.
////////////////////////////////////////////////////////////////////////////////
function setCamera()
{
  var v = 0.0025;   // camera tool speed
  var r = 950.0;    // camera to origin distance
  
  var alphaX = v * camRotationX * Math.PI;
  var alphaY = v * camRotationY * Math.PI;
  
  alphaX = Math.max(alphaX, -0.5 * Math.PI)
  alphaX = Math.min(alphaX, 0.0)
  
  var sX = Math.sin(alphaX);
  var cX = Math.cos(alphaX);
  
  var sY = Math.sin(alphaY);
  var cY = Math.cos(alphaY);
  
  camera.position.x = r * cX * sY;
  camera.position.y = r * (-sX);
  camera.position.z = r * cX * cY;
  
  // aim the camera at the origin
  camera.lookAt(new THREE.Vector3(0,0,0));
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
  renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1,
                                     antiAlias: true} );
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
  camera = new THREE.PerspectiveCamera(38,
                                       renderWidth / renderHeight,
                                       1, 10000);
  camRotationX = -25;
  camRotationY = 0;
  dragging = false;

  // call custom initialization function
  if (typeof initScene == 'function')
  {
    initScene();
  }
}





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// CONVENIENCE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// Shape creators
////////////////////////////////////////////////////////////////////////////////
// -- sun ----------------------------------------------------------------------
function CreateSun()
{
  var id = addUniforms(new THREE.Vector3(1.0, 0.75, 0.0));
  
  meshes.push(new THREE.Mesh(new THREE.SphereGeometry(50.0, 24, 24),
                             new THREE.ShaderMaterial({
                                                uniforms: uniforms[id],
                                                vertexShader: vertexShaderSun(),
                                                fragmentShader: fragmentShader()
                                            })));
  meshes[id].visible = false;
  scene.add(meshes[id]);
  return id;
}
// -- mercury ------------------------------------------------------------------
function CreateMercury()
{
  return CreateOther(new THREE.Vector3(1.0, 0.8, 0.5));
}
// -- venus --------------------------------------------------------------------
function CreateVenus()
{
  return CreateOther(new THREE.Vector3(1.0, 0.9, 0.7));
}
// -- earth --------------------------------------------------------------------
function CreateEarth()
{
  return CreateOther(new THREE.Vector3(0.15, 0.25, 1.0));
}
// -- moon ---------------------------------------------------------------------
function CreateMoon()
{
  return CreateOther(new THREE.Vector3(0.9, 0.9, 1.0));
}
// -- mars ---------------------------------------------------------------------
function CreateMars()
{
  return CreateOther(new THREE.Vector3(1.0, 0.3, 0.0));
}
// -- other --------------------------------------------------------------------
function CreateOther(color)
{
  var id = addUniforms(color);
  
  meshes.push(new THREE.Mesh(new THREE.SphereGeometry(1.0, 24, 24),
                             new THREE.ShaderMaterial({
                                         uniforms: uniforms[id],
                                         vertexShader: vertexShaderOther(color),
                                         fragmentShader: fragmentShader()
                                         })));
  meshes[id].visible = false;
  scene.add(meshes[id]);
  return id;
}



////////////////////////////////////////////////////////////////////////////////
// addUniforms(color)
// Adds a new set of uniform parameters with specified color and returns its id.
////////////////////////////////////////////////////////////////////////////////
function addUniforms(color)
{
  uniforms.push({
                customColor: {type: "v3",
                value: color},
                customPointMatrix: {type: "m4",
                value: new Matrix4((1.0, 0.0, 0.0, 0.0,
                                    0.0, 1.0, 0.0, 0.0,
                                    0.0, 0.0, 1.0, 0.0,
                                    0.0, 0.0, 0.0, 1.0))},
                customNormalMatrix: {type: "m4",
                value: new Matrix4((1.0, 0.0, 0.0, 0.0,
                                    0.0, 1.0, 0.0, 0.0,
                                    0.0, 0.0, 1.0, 0.0,
                                    0.0, 0.0, 0.0, 1.0))}
                });
  return uniforms.length - 1;
}



////////////////////////////////////////////////////////////////////////////////
// vertexShaderSun()
// Returns the vertex shader code for sun.
////////////////////////////////////////////////////////////////////////////////
function vertexShaderSun()
{
  return ["varying vec3 color;",
          "varying vec2 uvCoordinates;",
          "uniform mat4 customPointMatrix;",
          "uniform mat4 customNormalMatrix;",
          "uniform vec3 customColor;",
          "void main() {",
          "uvCoordinates = uv;",
          "gl_Position = ",
          "projectionMatrix * modelViewMatrix *",
          "customPointMatrix * vec4(position, 1.0);",
          "vec3 n = normalize((modelViewMatrix *",
          "customNormalMatrix * vec4(normal, 0.0)).xyz);",
          "color = vec3(0.2);",
          "color += dot(n, vec3(0, 0, 1)) * vec3(0.9, 0.9, 0.9);",
          "color *= customColor;",
          "}"].join("\n");
}



////////////////////////////////////////////////////////////////////////////////
// vertexShaderOther()
// Returns the vertex shader code for other objects.
////////////////////////////////////////////////////////////////////////////////
function vertexShaderOther()
{
  return ["varying vec3 color;",
          "varying vec2 uvCoordinates;",
          "uniform mat4 customPointMatrix;",
          "uniform mat4 customNormalMatrix;",
          "uniform vec3 customColor;",
          "void main() {",
          "uvCoordinates = uv;",
          "vec4 wsPos = customPointMatrix * vec4(position, 1.0);",
          "vec3 wsNorm = ",
          "(customNormalMatrix * vec4(normal, 0.0)).xyz;",
          "gl_Position = projectionMatrix * modelViewMatrix * wsPos;",
          "float diffDot = ",
          "dot(normalize(wsNorm), -normalize(wsPos.xyz));",
          "color = vec3(0.15, 0.15, 0.3) * customColor;",
          "color += clamp(diffDot, 0.0, 1.0) * customColor;",
          "}"].join("\n");
}



////////////////////////////////////////////////////////////////////////////////
// fragmentShader()
// Returns the fragmens shader code for sun and other objects.
////////////////////////////////////////////////////////////////////////////////
function fragmentShader()
{
  return ["varying vec3 color;",
          "varying vec2 uvCoordinates;",
          "void main() {",
          "float u = mod(80.0 * uvCoordinates.x, 10.0);",
          "float uu = (u - 1.0) * (u - 1.0);",
          "float v = mod(80.0 * uvCoordinates.y, 10.0);",
          "float vv = (v - 1.0) * (v - 1.0);",
          "float k = clamp(0.75 + uu, 0.0, 1.0)",
          "* clamp(0.75 + vv, 0.0, 1.0);",
          "gl_FragColor = vec4(k * color, 1.0);",
          "}"].join("\n");
}



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
  var pos = getRelative(event);
  mouseDragStartX = pos.x;
  mouseDragStartY = pos.y;
}



////////////////////////////////////////////////////////////////////////////////
// onMousMove(event)
// Handles mouse movements, i.e., evaluates dragging the camera rotation.
////////////////////////////////////////////////////////////////////////////////
function onMouseMove(event)
{
  if (dragging)
  {
    var pos = getRelative(event);
    var deltaX = mouseDragStartX - pos.x;
    var deltaY = mouseDragStartY - pos.y;
    if (!isNaN(deltaX) && !isNaN(deltaY))  // check if mouse is inside div element
    {
      camRotationY += deltaX;
      camRotationX += deltaY;
      mouseDragStartX = pos.x;
      mouseDragStartY = pos.y;
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
