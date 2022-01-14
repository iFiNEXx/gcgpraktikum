////////////////////////////////////////////////////////////////////////////////
// illumination.js
//
// Bearbeiten Sie diese Datei fuer den Praktikumsteil "Illumination".
//
// HS Duesseldorf - Fachbereich Medien - Grundlagen d. Computergrafik
//
// Studiengang: BMI
// Gruppe     : N
// Autor 1    : Blumenrath, Kim
// Autor 2    : Fitzen, Julian
// Autor 3    : Hüls, Jan
// Autor 4    : Kiesche, Valentin
// Autor 5    : Lamsalam, Chaymae
////////////////////////////////////////////////////////////////////////////////

//globale Variablen:

// das ambiente Licht
let ambientLight = {intensity: {r: 0.125, g: 0.125, b: 0.125}};
// ambiente Reflektionskoeffizient
let ambientCoeffizient = {r: 0.6, g: 0.7, b: 0.7};
// Diffuser Reflektionskoeffizient
let diffuseCoeffizient = {r: 0.5, g: 0.5, b: 0.5};
// Spektrum Reflektionskoeffizient
let spectrumCoeffizient = {r: 0.3, g: 0.6, b: 0.3};
//Exponent
let n = 10;

// alle übrigen (Punkt)-Lichter der Szene
let lights = [
  
  {position: new THREE.Vector3(-100, 100, 75),
   intensity: {r: 0.875, g: 0.625, b: 0.125}},
  {position: new THREE.Vector3(100, -100, 75),
   intensity: {r: 0.5, g: 0.0, b: 0.9}},
  {position: new THREE.Vector3(100, 100, 75),
   intensity: {r: 0.1, g: 0.5, b: 0.1}},
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
// Implementierung der Beleuchtungsberechnung mit dem Phong Beleuchtungsmodell
// phong(position, normal, camPosition)
// Wird während des Renderings für jeden Vertex einmal aufgerufen.
// 
// Parameter: position     Vertexposition (Vector3)
//            normal       Vertexnormale (Vector3)
//            camPosition  Kameraposition (Vector3)
// Rueckgabe: Eine Farbe. D.h. ein Objekt mit den Attributen .r, .g und .b

// Hinweis: Alle Parameter befinden sich im selben Koordinatensystem.
////////////////////////////////////////////////////////////////////////////////
function phong(position, normal, camPosition)
{
  // Initialisiere den Rueckgabewert
  let outColor = {r: 0.0, g: 0.0, b: 0.0};
  
  //Ambient
  //Berechnung der Formel ia = Ia· ka
  outColor.r += ambientLight.intensity.r * ambientCoeffizient.r;
  outColor.g += ambientLight.intensity.g * ambientCoeffizient.g;
  outColor.b += ambientLight.intensity.b * ambientCoeffizient.b;

  //Diffuse
  for (let i=0; i<lights.length; i++) {
  let lightVec = new THREE.Vector3();
  lightVec.subVectors(lights[i].position, position);
  //normalisieren des Lichtvektors
  lightVec.normalize();
  let normalVec = new THREE.Vector3().copy(normal.normalize());
  //Skalarprodukt
  //Berechnung der Formel id = Ip · kd(N · L)
  let scalar = normalVec.dot(lightVec);
  if (scalar >= 0) {
    outColor.r += lights[i].intensity.r * diffuseCoeffizient.r * scalar;
    outColor.g += lights[i].intensity.g * diffuseCoeffizient.g * scalar;
    outColor.b += lights[i].intensity.b * diffuseCoeffizient.b * scalar;
  }

  //Spektrum
  //Reflektionsvektor
  let reflectionsVec = new THREE.Vector3().copy(normalVec.multiplyScalar(scalar * 2));
  reflectionsVec.subVectors(reflectionsVec, lightVec);
  reflectionsVec.normalize();
  //Viewvektor
  let viewVec = new THREE.Vector3();
  viewVec.subVectors(camPosition, position);
  viewVec.normalize();

  let spectrumScalar = reflectionsVec.dot(viewVec);
  //Beleuchtungsberechnungs Rückgabewert aus Ambient und Skalarprodukt
  // 
  if (spectrumScalar >= 0) {
    let spekularenAnteil = Math.pow(spectrumScalar,n);

    outColor.r += lights[i].intensity.r * spectrumCoeffizient.r * spekularenAnteil;
    outColor.g += lights[i].intensity.g * spectrumCoeffizient.g * spekularenAnteil;
    outColor.b += lights[i].intensity.b * spectrumCoeffizient.b * spekularenAnteil;
  }
  }

  return outColor;
}
