////////////////////////////////////////////////////////////////////////////////
// illumination.js
//
// Bearbeiten Sie diese Datei fuer den Praktikumsteil "Illumination".
//
// HS Duesseldorf - Fachbereich Medien - Grundlagen d. Computergrafik
//
// Studiengang:
// Gruppe     :
// Autor 1    :
// Autor 2    :
// Autor 3    :
// Autor 4    :
// Autor 5    :
////////////////////////////////////////////////////////////////////////////////



// das ambiente Licht
let ambientLight = {intensity: {r: 0.125, g: 0.125, b: 0.125}};
// ambiente Reflektionskoeffizient
let ambientCoeffizient = {r: 1, g: 1, b: 1};

// alle übrigen (Punkt)-Lichter der Szene
let lights = [
  {position: new THREE.Vector3(-100, 100, 75),
   intensity: {r: 0.875, g: 0.625, b: 0.125}},
];



////////////////////////////////////////////////////////////////////////////////
// initScene()
// Initialisierung.
// Wird automatisch beim Start aufgerufen. 
////////////////////////////////////////////////////////////////////////////////
function initScene()
{
  registerLights(lights);
}



////////////////////////////////////////////////////////////////////////////////
// phong(position, normal, camPosition)
// Wird während des Renderings für jeden Vertex einmal aufgerufen.
// Parameter: position     Vertexposition (Vector3)
//            normal       Vertexnormale (Vector3)
//            camPosition  Kameraposition (Vector3)
// Rueckgabe: Eine Farbe. D.h. ein Objekt mit den Attributen .r, .g und .b
//
// Hinweis: Alle Parameter befinden sich im selben Koordinatensystem.
////////////////////////////////////////////////////////////////////////////////
function phong(position, normal, camPosition)
{
  // Initialisiere den Rueckgabewert
  let outColor = {r: 0.0, g: 0.0, b: 0.0};
  
  // TODO: Implementieren Sie die Beleuchtungsberechnung
  //       mit dem Phong-Beleuchtungsmodell.

  ambientLightCalculation(outColor);
  
  // Rueckgabe des berechneten Farbwerts
  return outColor;
}
/**
 * Berechnung des ambivalenten Terms (Grundhelligkeit des Raums)
 * @param {*} outColor 
 * @returns 
 */
function ambientLightCalculation (outColor) {
  //Berechnung der Formel ia = Ia· ka
  outColor.r = ambientLight.intensity.r * ambientCoeffizient.r;
  outColor.g = ambientLight.intensity.g * ambientCoeffizient.g;
  outColor.b = ambientLight.intensity.b * ambientCoeffizient.b;

  // Rueckgabe des berechneten Farbwerts
  return outColor;
}
