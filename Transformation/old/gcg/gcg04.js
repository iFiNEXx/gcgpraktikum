////////////////////////////////////////////////////////////////////////////////
// gcg04.js
//
// Diese Datei enthaelt Hilfsfunktionen fuer den Praktikumsteil
// "Illumination".
// Bearbeiten Sie diese Datei nicht.
//
// FH Duesseldorf - Fachbereich Medien - Grundlagen d. Computergrafik
// Wintersemester 2013/14
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
// Globals
////////////////////////////////////////////////////////////////////////////////
var renderer, renderWidth, renderHeight;    // renderer and its size
var camera, camRotationY, camRotationX;           // camera and its rotation around y-axis
var dragging, mouseDragStartX, mouseDragStartY;   // used during mouse dragging for cam rotation
var scene;              // scene containing geometry
var sphere;
var lightUniforms = [];
var vertexAttributes = {
  red:    {type: 'f', value: []},
  green:  {type: 'f', value: []},
  blue:   {type: 'f', value: []}
};





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
// RENDERING CODE
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// function renderFrame()
// This function controls the rendering of a complete frame.
////////////////////////////////////////////////////////////////////////////////
function render()
{
  // register render() to be called for rendering the next frame
  requestAnimationFrame(render);
  
  // set the camera according to the current rotation around the y-axis
  setCamera();
  
  // call phong() for every vertex and set vertex attributes
  for (var i = 0; i < sphere.vertices.length; i++)
  {
    var color = phong(sphere.vertices[i], sphere.vertices[i], camera.position);
    vertexAttributes.red.value[i] = color.r;
    vertexAttributes.green.value[i] = color.g;
    vertexAttributes.blue.value[i] = color.b;
  }
  
  // tell THREE that the vertex attributes need to be updated
  vertexAttributes["red"].needsUpdate = true;
  vertexAttributes["green"].needsUpdate = true;
  vertexAttributes["blue"].needsUpdate = true;
  
  // clear the frame and render it
  renderer.clear();
  renderer.render(scene, camera);
}



////////////////////////////////////////////////////////////////////////////////
// setCamera()
// Sets camera position and rotation.
////////////////////////////////////////////////////////////////////////////////
function setCamera()
{
  var v = 0.0025;   // camera tool speed
  var r = 500.0;    // camera to origin distance
  
  var alphaX = v * camRotationX * Math.PI;
  var alphaY = v * camRotationY * Math.PI;
  
  alphaX = Math.max(alphaX, -0.5 * Math.PI)
  alphaX = Math.min(alphaX,  0.5 * Math.PI)
  
  var sX = Math.sin(alphaX);
  var cX = Math.cos(alphaX);
  
  var sY = Math.sin(alphaY);
  var cY = Math.cos(alphaY);
  
  camera.position.x = r * cX * sY;
  camera.position.y = r * (-sX);
  camera.position.z = r * cX * cY;
  
  // aim the camera at the origin
  camera.lookAt(new Vector3(0,0,0));
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
  renderer = new THREE.WebGLRenderer({clearColor: 0x000000,
                                      clearAlpha: 1,
                                      antialias: true});
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
  
  // geometry to be lit by phong()
  sphere = new THREE.SphereGeometry(50.0, 32, 32);
  var sphereMaterials = [
    new THREE.ShaderMaterial({
                             uniforms: {},
                             attributes: vertexAttributes,
                             vertexShader: vertexShaderSphere(),
                             fragmentShader: fragmentShaderSphere()
                             }),
    new THREE.MeshBasicMaterial({
                                color: 0x444444,
                                wireframe: true,
                                wireframeLinewidth: 1.41,
                                transparent: true,
                                opacity: 0.25,
                                side: THREE.DoubleSide
                                })
                         
  ];
  THREE.GeometryUtils.triangulateQuads(sphere);
  scene.add(THREE.SceneUtils.createMultiMaterialObject(sphere,
                                                       sphereMaterials));
  
  // assign initial vertex attributes
  for(var v = 0; v < sphere.vertices.length; v++)
  {
    vertexAttributes.red.value.push(0.0);
    vertexAttributes.green.value.push(0.0);
    vertexAttributes.blue.value.push(0.0);
  }
  
  // call custom initialization function
  if (typeof initScene == "function")
  {
    initScene();
  }
}



////////////////////////////////////////////////////////////////////////////////
// function registerLights(lightList)
// Creates a shape for each light in lightList to be rendered.
////////////////////////////////////////////////////////////////////////////////
function registerLights(lightList)
{
  for (i in lightList)
  {
    // add color to uniform shader attributes
    lightUniforms.push({
                       intensity: {type:  "v3",
                                   value: new Vector3(lightList[i].intensity.r,
                                                      lightList[i].intensity.g,
                                                      lightList[i].intensity.b)
                       }});
    var id = lightUniforms.length - 1;
    
    // create shader for light shape
    var lightMaterial = new THREE.ShaderMaterial({
                                           uniforms: lightUniforms[id],
                                           attributes: {},
                                           vertexShader: vertexShaderLight(),
                                           fragmentShader: fragmentShaderLight()
                                           });
    
    // create light shape as child of new scene node
    var lightNode = new THREE.Object3D();
    lightNode.add(new THREE.Mesh(new THREE.SphereGeometry(2.0, 8, 8),
                                 lightMaterial));
    
    // add light rays
    lightNode.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 6,
                                                            8, 1, true),
                                 lightMaterial));
    for (var lambda = 0.25; lambda <= 1.75; lambda += 0.25)
    {
      for (var phi = 0.25; phi <= 0.75; phi += 0.25)
      {
        var lightRay = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 6,
                                                                 8, 1, true),
                                      lightMaterial);
        lightRay.rotation.z = phi * Math.PI;
        lightRay.rotation.y = lambda * Math.PI;
        lightNode.add(lightRay);
      }
    }
    
    // set position of light shape and add to scene
    lightNode.position.x = lightList[i].position.x;
    lightNode.position.y = lightList[i].position.y;
    lightNode.position.z = lightList[i].position.z;
    
    scene.add(lightNode);
  }
}





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// CONVENIENCE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Wrapper around THREE.Vector3
////////////////////////////////////////////////////////////////////////////////
Vector3 = function(v0, v1, v2)
{
  THREE.Vector3.call(this);
  this.set(v0, v1, v2);
}
Vector3.prototype = new THREE.Vector3();





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// SHADER FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// vertexShaderLight()
////////////////////////////////////////////////////////////////////////////////
function vertexShaderLight()
{
  return ["varying vec3 color;",
          "uniform vec3 intensity;",
          "void main() {",
          "gl_Position = ",
          "projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
          "vec3 n = normalize((modelViewMatrix * vec4(normal, 0.0)).xyz);",
          "color = vec3(0.2);",
          "color += dot(n, vec3(0, 0, 1)) * vec3(0.9, 0.9, 0.9);",
          "color *= 0.9 * intensity;",
          "}"].join("\n");
}



////////////////////////////////////////////////////////////////////////////////
// fragmentShaderLight()
////////////////////////////////////////////////////////////////////////////////
function fragmentShaderLight()
{
  return ["varying vec3 color;",
          "void main() {",
          "gl_FragColor = vec4(color, 1.0);",
          "}"].join("\n");
}



////////////////////////////////////////////////////////////////////////////////
// vertexShaderSphere()
////////////////////////////////////////////////////////////////////////////////
function vertexShaderSphere()
{
  return ["varying vec3 color;",
          "attribute float red;",
          "attribute float green;",
          "attribute float blue;",
          "void main() {",
          "gl_Position = ",
          "projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
          "color = vec3(red, green, blue);",
          "}"].join("\n");
}



////////////////////////////////////////////////////////////////////////////////
// fragmentShaderSphere()
////////////////////////////////////////////////////////////////////////////////
function fragmentShaderSphere()
{
  return ["varying vec3 color;",
          "void main() {",
          "gl_FragColor = vec4(color, 1.0);",
          "}"].join("\n");
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
