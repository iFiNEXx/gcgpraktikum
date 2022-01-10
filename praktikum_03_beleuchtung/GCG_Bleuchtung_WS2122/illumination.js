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
// Diffuser Reflektionskoeffizient
let diffuseCoeffizient = {r: 1, g: 1, b: 1};

// alle übrigen (Punkt)-Lichter der Szene
let lights = [
  //position 0
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

  
  //Berechnung der Formel ia = Ia· ka
  outColor.r += ambientLight.intensity.r * ambientCoeffizient.r;
  outColor.g += ambientLight.intensity.g * ambientCoeffizient.g;
  outColor.b += ambientLight.intensity.b * ambientCoeffizient.b;

  let lightVec = new THREE.Vector3();
  lightVec.subVectors(lights[0].position, position);
  // normailisieren
  lightVec.normalize();
  let normalVec = new THREE.Vector3().copy(normal.normalize());
  //Skalarprodukt
  let scalar = normalVec.dot(lightVec);

  if (scalar >= 0) {
    outColor.r += lights[0].intensity.r * diffuseCoeffizient.r * scalar;
    outColor.g += lights[0].intensity.g * diffuseCoeffizient.g * scalar;
    outColor.b += lights[0].intensity.b * diffuseCoeffizient.b * scalar;
  }

  return outColor;
}
