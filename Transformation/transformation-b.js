////////////////////////////////////////////////////////////////////////////////
// transformation-b.js
//
// Bearbeiten Sie diese Datei fuer den Praktikumsteil "Transformation B".
//
// HS Duesseldorf - Fachbereich Medien - Grundlagen d. Computergrafik
// Wintersemester 2021/22
//
// Studiengang: BMI
// Gruppe     : N
// Autor 1    : Blumenrath, Kim
// Autor 2    : Fitzen, Julian
// Autor 3    : Hüls, Jan
// Autor 4    : Kiesche, Valentin
// Autor 5    : Lamsalam, Chaymae
////////////////////////////////////////////////////////////////////////////////

// globale Variablen
let sceneRoot; // speichert den Wurzelknoten der Szene
let timeScale = 10.0; // Faktor fuer die Zeit -- fuer Zeitraffer / Zeitlupe

////////////////////////////////////////////////////////////////////////////////
// renderScene(time)
// Wird aufgerufen, wenn die gesamte Szene gerendert werden muss.
// In der Variable time wird die verstrichene Zeit in Sekunden übergeben.
////////////////////////////////////////////////////////////////////////////////
function renderScene(time) {
  // Transformationsmatrix fuer Punkte
  let pointMatrix = new Matrix4(
        1.0, 0.0, 0.0, 0.0, 
        0.0, 1.0, 0.0, 0.0, 
        0.0, 0.0, 1.0, 0.0, 
        0.0, 0.0, 0.0, 1.0
  );
  // Transformationsmatrix fuer Normalen
  let normalMatrix = new Matrix4(
        1.0, 0.0, 0.0, 0.0, 
        0.0, 1.0, 0.0, 0.0, 
        0.0, 0.0, 1.0, 0.0, 
        0.0, 0.0, 0.0, 1.0
  );

  // Falls der Szenenknoten eine Shape enthaelt
  if (sceneRoot.shape != undefined) {
    // Tranformation des Szenenknotens bestimmen
    let nodeTransformation = sceneRoot.animator(timeScale * time);

    // Transformation des Szenenknotens anwenden
    pointMatrix.multiply(nodeTransformation.pointMatrix);
    normalMatrix.multiply(nodeTransformation.normalMatrix);

    // Szenenknoten rendern
    renderSceneNode(sceneRoot, pointMatrix, normalMatrix);

    // Loop starten
    loop(time, sceneRoot.children, 0);
  }
}


/**
* Loop
*  @param {*} time = Zeit in Sekunden
*  @param array = Array mit den Szenenknoten
*  @param index = aktueller Szenenknoten
*  @param parent = Referenz zum Parent Szenenknoten
*/
function loop(time, array, index, parent) {
  if(array.length > 0) {
    // Falls der Szenenknoten eine Shape enthaelt
    if(array[index].shape != undefined) {
      let matrix;

      // Falls parent nicht gesetzt, also der Szenenknoten ein Planet ist
      if(parent == undefined) {
        // Aufruf der transformation
        matrix = transform(array[index].animator(timeScale * time));
      } else {
        // Aufruf der transformation
        matrix = transform(array[index].animator(timeScale * time), parent.animator(timeScale * time));
      }
      
      // Szenenknoten rendern
      renderSceneNode(array[index], matrix.pointMatrix, matrix.normalMatrix);

      // Falls Szenenknoten ein Planet ist und Monde hat
      if(parent == undefined && array[index].children.length > 0) {
        // Aufruf des Loops um über die Monde zu iterieren
        loop(time, array[index].children, 0, array[index]);
      }
      
      // Falls Array noch Szenenknoten hat
      if(index < array.length - 1) {
        index++;
        // Zum nächsten Szenenknoten
        loop(time, array, index, parent);
      }
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// initScene()
// Wird aufgerufen, wenn die Szene initialisiert werden soll.
// Erstellt den Szenengraphen.
////////////////////////////////////////////////////////////////////////////////
function initScene() {
  // TODO: Hier werden Sie die Szenenknoten für Planeten und Monde anlegen.

  // -- Phobos --------------------
  let phobos = {
    animator: animateNode,
    shape: CreateMoon(),
    children: [],
    radius: 2.5,
    orbitRadius: 15,
    selfRotation: 0.3,
    orbitRotation: 0.3,
  };

  // -- Deimos --------------------
  let deimos = {
    animator: animateNode,
    shape: CreateMoon(),
    children: [],
    radius: 1.5,
    orbitRadius: 20,
    selfRotation: 1.3,
    orbitRotation: 1.3,
  };

  // -- Mars --------------------
  let mars = {
    animator: animateNode,
    shape: CreateMars(),
    children: [deimos, phobos],
    radius: 7,
    orbitRadius: 305,
    selfRotation: 1,
    orbitRotation: 687,
  };

  // -- Venus --------------------
  let venus = {
    animator: animateNode,
    shape: CreateVenus(),
    children: [],
    radius: 12,
    orbitRadius: 145,
    selfRotation: 243,
    orbitRotation: 224.7,
  };

  // -- Merkur --------------------
  let mercury = {
    animator: animateNode,
    shape: CreateMercury(),
    children: [],
    radius: 5,
    orbitRadius: 76,
    selfRotation: 58.7,
    orbitRotation: 88,
  };

  // -- Mond --------------------
  let moon = {
    animator: animateNode,
    shape: CreateMoon(),
    children: [],
    radius: 3.5,
    orbitRadius: 22,
    selfRotation: 27.3,
    orbitRotation: 27.3,
  };

  // -- Erde --------------------
  let earth = {
    animator: animateNode,
    shape: CreateEarth(),
    children: [moon],
    radius: 13,
    orbitRadius: 200,
    selfRotation: 1,
    orbitRotation: 365.2,
  };

  // -- Sonne --------------------
  let sun = {
    animator: animateSun,
    shape: CreateSun(),
    children: [earth, mercury, venus, mars],
  };

  // Setze die Sonne als Wurzelknoten der Szene.
  sceneRoot = sun;
}

////////////////////////////////////////////////////////////////////////////////
// Animate-Funktionen
////////////////////////////////////////////////////////////////////////////////
// -- Sonne --------------------------------------------------------------------
function animateSun(time) {
  return {
    pointMatrix: new Matrix4(
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ),
    normalMatrix: new Matrix4(
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ),
  };
}

/**
 * Die Funktion animateNode() führt die einzelnen Transformationen für die planetaren Objekte durch.
 * in transform() werden die einzelen Transformationen aufgerufen und die Matrizen werden in der korrekten Reihenfolge
 * multipliziert.
 * 
 * @param {*} time übergibt den aktuellen Zeit-Multiplikator
 * @param {*} radius übergibt den Radius des Objekts
 * @param {*} selfRotation übergibt die Rotation des Objekts
 * @param {*} orbitRotation übergibt die Rotation des Objekts um den Parent 
 * @returns neue Matrix
 */

function animateNode(time) {
  //Winkelberechnung und Geschwindkeitsberechnung
  let speed = time * (2 * Math.PI);
  let cosAlphaSelf = Math.cos(speed / this.selfRotation);
  let sinAlphaSelf = Math.sin(speed / this.selfRotation);
  let cosAlphaParent = Math.cos(speed / this.orbitRotation);
  let sinAlphaParent = Math.sin(speed / this.orbitRotation);

  return {
    //Skalierungsmatrix
    pointMatrixScale: new Matrix4(
      this.radius, 0.0, 0.0, 0.0, 
      0.0, this.radius, 0.0, 0.0, 
      0.0, 0.0, this.radius, 0.0, 
      0.0, 0.0, 0.0, 1.0
    ),
    //Translationsmatrix
    pointMatrixTranslate: new Matrix4(
      1.0, 0.0, 0.0, this.orbitRadius, 
      0.0, 1.0, 0.0, 0.0, 
      0.0, 0.0, 1.0, 0.0, 
      0.0, 0.0, 0.0, 1.0
    ),
    //die Rotationsmatrix wird mit der Geschwindigkeit verrechnet
    pointMatrixSelfRotation: new Matrix4(
      cosAlphaSelf, 0.0, sinAlphaSelf, 0.0, 
      0.0, 1.0, 0.0, 0.0, 
      -sinAlphaSelf, 0.0, cosAlphaSelf, 0.0, 
      0.0, 0.0, 0.0, 1.0
    ),
    //Rotationsmatrix fuer parent (Elternplanet)
    pointMatrixParentRotation: new Matrix4(
      cosAlphaParent, 0.0, sinAlphaParent, 0.0, 
      0.0, 1.0, 0.0, 0.0, 
      -sinAlphaParent, 0.0, cosAlphaParent, 0.0, 
      0.0, 0.0, 0.0, 1.0
    ), 
    //die Rotationsmatrix wird mit der Geschwindigkeit verrechnet mit zugehörigen Normalen
    normalMatrixSelfRotation: new Matrix4(
      cosAlphaSelf, 0.0, sinAlphaSelf, 0.0, 
      0.0, 1.0, 0.0, 0.0, 
      -sinAlphaSelf, 0.0, cosAlphaSelf, 0.0, 
      0.0, 0.0, 0.0, 1.0
    ), 
    //Rotationsmatrix fuer parent (Elternplanet) mit zugehörigen Normalen
    normalMatrixParentRotation: new Matrix4(
      cosAlphaParent, 0.0, sinAlphaParent, 0.0, 
      0.0, 1.0, 0.0, 0.0, 
      -sinAlphaParent, 0.0, cosAlphaParent, 0.0, 
      0.0, 0.0, 0.0, 1.0
    ), 
  };
}

////////////////////////////////////////////////////////////////////////////////
// Transformationsfunktionen
////////////////////////////////////////////////////////////////////////////////




/**
 * Transformationsfunktion für Planeten und Monde
 * @param {*} animator animator des Szenenknoten
 * @param {*} parentAnimator animator des parent Szenenknoten
 * @returns  Point-/und Normalmatrix wird berechnet zurückgegeben
 */
function transform(animator, parentAnimator) {
  let pointMatrix = new Matrix4(
    1.0, 0.0, 0.0, 0.0, 
    0.0, 1.0, 0.0, 0.0, 
    0.0, 0.0, 1.0, 0.0, 
    0.0, 0.0, 0.0, 1.0
  );

  let normalMatrix = new Matrix4(
    1.0, 0.0, 0.0, 0.0, 
    0.0, 1.0, 0.0, 0.0, 
    0.0, 0.0, 1.0, 0.0, 
    0.0, 0.0, 0.0, 1.0
  );

  // Falls parentAnimator nicht gesetzt, also der Szenenknoten ein Planet ist
  if(parentAnimator == undefined) {
    // PointMatrix multiplizieren mit der ParentRotation
    pointMatrix.multiply(animator.pointMatrixParentRotation);
    // PointMatrix multiplizieren mit Translate
    pointMatrix.multiply(animator.pointMatrixTranslate);
    // PointMatrix multiplizieren mit Scale
    pointMatrix.multiply(animator.pointMatrixScale);
    // PointMatrix multiplizieren mit der SelfRotation
    pointMatrix.multiply(animator.pointMatrixSelfRotation);
    // NormalMatrix multiplizieren mit der SelfRotation
    normalMatrix.multiply(animator.normalMatrixSelfRotation);
    // NormalMatrix multiplizieren mit der ParentRotation
    normalMatrix.multiply(animator.normalMatrixParentRotation);
  } else {
    // PointMatrix multiplizieren mit der ParentRotation vom Parent
    pointMatrix.multiply(parentAnimator.pointMatrixParentRotation);
    // PointMatrix multiplizieren mit Translate vom Parent
    pointMatrix.multiply(parentAnimator.pointMatrixTranslate);
    // PointMatrix multiplizieren mit der ParentRotation
    pointMatrix.multiply(animator.pointMatrixParentRotation);
    // PointMatrix multiplizieren mit Translate
    pointMatrix.multiply(animator.pointMatrixTranslate);
    // PointMatrix multiplizieren mit Scale
    pointMatrix.multiply(animator.pointMatrixScale);
    // PointMatrix multiplizieren mit der SelfRotation
    pointMatrix.multiply(animator.pointMatrixSelfRotation);
    // NormalMatrix multiplizieren mit der ParentRotation vom Parent
    normalMatrix.multiply(parentAnimator.normalMatrixParentRotation);
    // NormalMatrix multiplizieren mit der SelfRotation
    normalMatrix.multiply(animator.normalMatrixParentRotation);
    // NormalMatrix multiplizieren mit der ParentRotation
    normalMatrix.multiply(animator.normalMatrixSelfRotation);
  }

  return { pointMatrix,  normalMatrix };
}