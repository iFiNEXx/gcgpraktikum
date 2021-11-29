////////////////////////////////////////////////////////////////////////////////
// gcg01.js
//
// Diese Datei enthaelt Hilfsfunktionen fuer den Praktikumsteil "Bresenham Line"
// Bearbeiten Sie diese Datei nicht.
//
// HS Duesseldorf - Fachbereich Medien - Grundlagen d. Computergrafik
////////////////////////////////////////////////////////////////////////////////



// some globals
var px0 = 0;
var py0 = 0;
var drawing = false;
var canvas;
var ctx;



////////////////////////////////////////////////////////////////////////////////
// setPixel(x, y)
// Sets a single pixel.
////////////////////////////////////////////////////////////////////////////////
function setPixel(x, y)
{
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect (2 * x, 2 * y, 2, 2);
}



////////////////////////////////////////////////////////////////////////////////
// controlLine(x0, y0, x1, y1)
// Draws a line to visually check whether drawLine(...) works correctly.
////////////////////////////////////////////////////////////////////////////////
function controlLine(x0, y0, x1, y1)
{
  ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(2 * x0 - 1, 2 * y0 + 1);
  ctx.lineTo(2 * x1 - 1, 2 * y1 + 1);
  ctx.stroke();
}



////////////////////////////////////////////////////////////////////////////////
// claer()
// Clears the canvas.
////////////////////////////////////////////////////////////////////////////////
function clear()
{
  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}



////////////////////////////////////////////////////////////////////////////////
// onMousMove(event)
// Handles mouse movements
////////////////////////////////////////////////////////////////////////////////
function onMouseMove(event)
{
  var position = getRelative(event);
  
  if (drawing)
  {
    doDraw(px0, py0, position.x, position.y);
  }
  document.getElementById("GCG01mousePosition").innerHTML =
    "Mausposition: ( " +
    Math.round(0.5 * position.x) + " ; " +
    Math.round(0.5 * position.y) + " )";
}



////////////////////////////////////////////////////////////////////////////////
// onMousUp(event)
// Handles mouse clicks.
////////////////////////////////////////////////////////////////////////////////
function onMouseUp(event)
{
  var position = getRelative(event);

  if (!drawing)
  {
    px0 = position.x;
    py0 = position.y;
  }
  else
  {
    doDraw(px0, py0, position.x, position.y);
  }
  drawing = !drawing;
}



////////////////////////////////////////////////////////////////////////////////
// doDraw(x0, y0, x1, y1)
// Handles the complete drawing.
////////////////////////////////////////////////////////////////////////////////
function doDraw(x0, y0, x1, y1)
{
  x0 = Math.round(x0 / 2);
  y0 = Math.round(y0 / 2);
  x1 = Math.round(x1 / 2);
  y1 = Math.round(y1 / 2);
  
  clear();
  controlLine(x0, y0, x1, y1);
  drawLine(x0, y0, x1, y1);
  document.getElementById("GCG01drawLine").innerHTML =
    "drawLine(" + x0 + ", " + y0 + ", " + x1 + ", " + y1 + ")";
}



////////////////////////////////////////////////////////////////////////////////
// main()
// Initialization and registration of event listeners.
////////////////////////////////////////////////////////////////////////////////
function main()
{
  canvas = document.getElementById("GCG01canvas");
  canvas.addEventListener("mousemove", onMouseMove, false);
  canvas.addEventListener("mouseup", onMouseUp, false);
  ctx = canvas.getContext('2d');
  if(typeof example == 'function')
  {
    example(10);
  }
}
