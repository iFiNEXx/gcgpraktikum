////////////////////////////////////////////////////////////////////////////////
// gcg.js
//
// Diese Datei enthaelt Hilfsfunktionen fuer das Praktikum.
// Bearbeiten Sie diese Datei nicht.
//
// HS Duesseldorf - Fachbereich Medien - Grundlagen d. Computergrafik
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
// getRelative(event)
// Get relative mouse position for event
////////////////////////////////////////////////////////////////////////////////
function getRelative(event)
{
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;
  var currentElement = event.target;
  do
  {
    totalOffsetX += currentElement.offsetLeft;
    totalOffsetY += currentElement.offsetTop;
  }
  while (currentElement = currentElement.offsetParent);
  
  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;
  
  // Fix for variable canvas width
  canvasX =
  Math.round(canvasX *
             (event.target.width / event.target.offsetWidth));
  canvasY =
  Math.round(canvasY *
             (event.target.height / event.target.offsetHeight));
  
  return { "x" : Math.round(canvasX), "y" : Math.round(canvasY) };
}
