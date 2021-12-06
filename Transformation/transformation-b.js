////////////////////////////////////////////////////////////////////////////////
// transformation-b.js
//
// Bearbeiten Sie diese Datei fuer den Praktikumsteil "Transformation B".
//
// HS Duesseldorf - Fachbereich Medien - Grundlagen d. Computergrafik
// Wintersemester 2021/22
//
// Studiengang:
// Gruppe     :
// Autor 1    :
// Autor 2    :
// Autor 3    :
// Autor 4    :
// Autor 5    :
////////////////////////////////////////////////////////////////////////////////

// globale Variablen
let sceneRoot; // speichert den Wurzelknoten der Szene
let timeScale = 20000.0; // Faktor fuer die Zeit -- fuer Zeitraffer / Zeitlupe

////////////////////////////////////////////////////////////////////////////////
// renderScene(time)
// Wird aufgerufen, wenn die gesamte Szene gerendert werden muss.
// In der Variable time wird die verstrichene Zeit in Sekunden übergeben.
////////////////////////////////////////////////////////////////////////////////
function renderScene(time) {
  // Transformationsmatrix fuer Punkte
  let pointMatrix = new Matrix4(
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );
  // Transformationsmatrix fuer Normalen
  let normalMatrix = new Matrix4(
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );

  // Falls der Szenenknoten eine Shape enthaelt ...
  if (sceneRoot.shape != undefined) {
    // Tranformation des Szenenknotens bestimmen
    let nodeTransformation = sceneRoot.animator(timeScale * time);

    // Transformation des Szenenknotens anwenden
    pointMatrix.multiply(nodeTransformation.pointMatrix);
    normalMatrix.multiply(nodeTransformation.normalMatrix);

    // Szenenknoten rendern
    renderSceneNode(sceneRoot, pointMatrix, normalMatrix);

    // Falls sceneRoot ein children hat ...
    if (sceneRoot.children.length > 0) {
      planetLoop(0, time);
    }
  }
}

function planetLoop(i, time) {
  // Falls der Planet ein Shape enthaelt ...
  if (sceneRoot.children[i].shape != undefined) {
    // Matrix berechnung eines Planeten
    let matrix = transformation(
      sceneRoot.children[i].animator(timeScale * time)
    );

    // Planet rendern
    renderSceneNode(sceneRoot.children[i], matrix.pMatrix, matrix.nMatrix);

    if (sceneRoot.children[i].children.length > 0) {
      moonLoop(i, 0, time);
    }

    if (i < sceneRoot.children.length - 1) {
      i++;
      planetLoop(i, time);
    }
  }
}

function moonLoop(i, j, time) {
  if (sceneRoot.children[i].children[j].shape != undefined) {
    // Matrix berechnung eines Mondes
    let matrixMoon = transformationMoon(
      sceneRoot.children[i].animator(timeScale * time),
      sceneRoot.children[i].children[j].animator(timeScale * time)
    );

    // Mond rendern
    renderSceneNode(
      sceneRoot.children[i].children[j],
      matrixMoon.pMatrix,
      matrixMoon.nMatrix
    );

    if (j < sceneRoot.children[i].children.length - 1) {
      j++;
      moonLoop(i, j, time);
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
  var phobos = {
    animator: animatePhobos,
    shape: CreateMoon(),
    children: []
  };
  
  // -- Deimos --------------------
  var deimos = {
    animator: animateDeimos,
    shape: CreateMoon(),
    children: []
  };
  
  // -- Mars --------------------
  var mars = {
    animator: animateMars,
    shape: CreateMars(),
    children: [deimos, phobos]
  }; 
  
  // -- Venus --------------------
  var venus = {
    animator: animateVenus,
    shape: CreateVenus(),
    children: []
  }; 
 
  // -- Merkur -------------------- 
  var mercury = {
    animator: animateMercury,
    shape: CreateMercury(),
    children: []
  };

  // -- Mond --------------------
  var moon = {
    animator: animateMoon,
    shape: CreateMoon(),
    children: [],
  };

  // -- Erde --------------------
  var earth = {
    animator: animateEarth,
    shape: CreateEarth(),
    children: [moon],
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
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),
    normalMatrix: new Matrix4(
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),
  };
}

// TODO: Hier werden Sie weitere Animate-Funktionen implementieren.

// -- Earth --------------------------------------------------------------------
function animateEarth(time) {
  return {
    pointMatrixScale: new Matrix4(
      13.0,
      0.0,
      0.0,
      0.0,
      0.0,
      13.0,
      0.0,
      0.0,
      0.0,
      0.0,
      13.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixTranslate: new Matrix4(
      1.0,
      0.0,
      0.0,
      200.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixSelfRotation: new Matrix4(
      Math.cos(time / 24 / 60),
      0.0,
      Math.sin(time / 24 / 60),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60),
      0.0,
      Math.cos(time / 24 / 60),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixParentRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 365.2),
      0.0,
      Math.sin(time / 24 / 60 / 365.2),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 365.2),
      0.0,
      Math.cos(time / 24 / 60 / 365.2),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    normalMatrixSelfRotation: new Matrix4(
      Math.cos(time / 24 / 60),
      0.0,
      Math.sin(time / 24 / 60),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60),
      0.0,
      Math.cos(time / 24 / 60),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    normalMatrixParentRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 365.2),
      0.0,
      Math.sin(time / 24 / 60 / 365.2),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 365.2),
      0.0,
      Math.cos(time / 24 / 60 / 365.2),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),
  };
}

// -- Mond (Earth) --------------------------------------------------------------------
function animateMoon(time) {
  return {
    pointMatrixScale: new Matrix4(
      3.5,
      0.0,
      0.0,
      0.0,
      0.0,
      3.5,
      0.0,
      0.0,
      0.0,
      0.0,
      3.5,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixSelfRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 27.3),
      0.0,
      Math.sin(time / 24 / 60 / 27.3),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 27.3),
      0.0,
      Math.cos(time / 24 / 60 / 27.3),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixTranslate: new Matrix4(
      1.0,
      0.0,
      0.0,
      22.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixParentRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 27.3),
      0.0,
      Math.sin(time / 24 / 60 / 27.3),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 27.3),
      0.0,
      Math.cos(time / 24 / 60 / 27.3),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    normalMatrixSelfRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 27.3),
      0.0,
      Math.sin(time / 24 / 60 / 27.3),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 27.3),
      0.0,
      Math.cos(time / 24 / 60 / 27.3),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    normalMatrixParentRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 27.3),
      0.0,
      Math.sin(time / 24 / 60 / 27.3),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 27.3),
      0.0,
      Math.cos(time / 24 / 60 / 27.3),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),
  };
}

// -- Mercury --------------------------------------------------------------------
function animateMercury(time) {
  return {
    pointMatrixScale: new Matrix4(
      5.0,
      0.0,
      0.0,
      0.0,
      0.0,
      5.0,
      0.0,
      0.0,
      0.0,
      0.0,
      5.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),
    pointMatrixTranslate: new Matrix4(
      1.0,
      0.0,
      0.0,
      76.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),
    pointMatrixSelfRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 58.7),
      0.0,
      Math.sin(time / 24 / 60 / 58.7),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 58.7),
      0.0,
      Math.cos(time / 24 / 60 / 58.7),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),
    pointMatrixParentRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 88),
      0.0,
      Math.sin(time / 24 / 60 / 88),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 88),
      0.0,
      Math.cos(time / 24 / 60 / 88),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),
    normalMatrixSelfRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 58.7),
      0.0,
      Math.sin(time / 24 / 60 / 58.7),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 58.7),
      0.0,
      Math.cos(time / 24 / 60 / 58.7),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),
    normalMatrixParentRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 88),
      0.0,
      Math.sin(time / 24 / 60 / 88),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 88),
      0.0,
      Math.cos(time / 24 / 60 / 88),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),
  };
}

// -- Venus --------------------------------------------------------------------
function animateVenus(time) {
  return {
    pointMatrixScale: new Matrix4(
      12.0,
      0.0,
      0.0,
      0.0,
      0.0,
      12.0,
      0.0,
      0.0,
      0.0,
      0.0,
      12.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixTranslate: new Matrix4(
      1.0,
      0.0,
      0.0,
      145.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixSelfRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 243),
      0.0,
      Math.sin(time / 24 / 60 / 243),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 243),
      0.0,
      Math.cos(time / 24 / 60 / 243),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixParentRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 224.7),
      0.0,
      Math.sin(time / 24 / 60 / 224.7),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 224.7),
      0.0,
      Math.cos(time / 24 / 60 / 224.7),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    normalMatrixSelfRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 243),
      0.0,
      Math.sin(time / 24 / 60 / 243),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 243),
      0.0,
      Math.cos(time / 24 / 60 / 243),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    normalMatrixParentRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 224.7),
      0.0,
      Math.sin(time / 24 / 60 / 224.7),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 224.7),
      0.0,
      Math.cos(time / 24 / 60 / 224.7),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),
  };
}

// -- Mars --------------------------------------------------------------------
function animateMars(time) {
  return {
    pointMatrixScale: new Matrix4(
      7.0,
      0.0,
      0.0,
      0.0,
      0.0,
      7.0,
      0.0,
      0.0,
      0.0,
      0.0,
      7.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixTranslate: new Matrix4(
      1.0,
      0.0,
      0.0,
      305.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixSelfRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 1),
      0.0,
      Math.sin(time / 24 / 60 / 1),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 1),
      0.0,
      Math.cos(time / 24 / 60 / 1),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixParentRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 687),
      0.0,
      Math.sin(time / 24 / 60 / 687),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 687),
      0.0,
      Math.cos(time / 24 / 60 / 687),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    normalMatrixSelfRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 1),
      0.0,
      Math.sin(time / 24 / 60 / 1),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 1),
      0.0,
      Math.cos(time / 24 / 60 / 1),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    normalMatrixParentRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 687),
      0.0,
      Math.sin(time / 24 / 60 / 687),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 687),
      0.0,
      Math.cos(time / 24 / 60 / 687),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),
  };
}

// -- Phobos (Mars) --------------------------------------------------------------------
function animatePhobos(time) {
  return {
    pointMatrixScale: new Matrix4(
      2.5,
      0.0,
      0.0,
      0.0,
      0.0,
      2.5,
      0.0,
      0.0,
      0.0,
      0.0,
      2.5,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixTranslate: new Matrix4(
      1.0,
      0.0,
      0.0,
      15.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixSelfRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 0.3),
      0.0,
      Math.sin(time / 24 / 60 / 0.3),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 0.3),
      0.0,
      Math.cos(time / 24 / 60 / 0.3),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixParentRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 0.3),
      0.0,
      Math.sin(time / 24 / 60 / 0.3),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 0.3),
      0.0,
      Math.cos(time / 24 / 60 / 0.3),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    normalMatrixSelfRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 0.3),
      0.0,
      Math.sin(time / 24 / 60 / 0.3),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 0.3),
      0.0,
      Math.cos(time / 24 / 60 / 0.3),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    normalMatrixParentRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 0.3),
      0.0,
      Math.sin(time / 24 / 60 / 0.3),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 0.3),
      0.0,
      Math.cos(time / 24 / 60 / 0.3),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),
  };
}

// -- Deimos (Mars) --------------------------------------------------------------------
function animateDeimos(time) {
  return {
    pointMatrixScale: new Matrix4(
      1.5,
      0.0,
      0.0,
      0.0,
      0.0,
      1.5,
      0.0,
      0.0,
      0.0,
      0.0,
      1.5,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixTranslate: new Matrix4(
      1.0,
      0.0,
      0.0,
      20.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixSelfRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 1.3),
      0.0,
      Math.sin(time / 24 / 60 / 1.3),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 1.3),
      0.0,
      Math.cos(time / 24 / 60 / 1.3),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    pointMatrixParentRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 1.3),
      0.0,
      Math.sin(time / 24 / 60 / 1.3),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 1.3),
      0.0,
      Math.cos(time / 24 / 60 / 1.3),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    normalMatrixSelfRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 1.3),
      0.0,
      Math.sin(time / 24 / 60 / 1.3),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 1.3),
      0.0,
      Math.cos(time / 24 / 60 / 1.3),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),

    normalMatrixParentRotation: new Matrix4(
      Math.cos(time / 24 / 60 / 1.3),
      0.0,
      Math.sin(time / 24 / 60 / 1.3),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(time / 24 / 60 / 1.3),
      0.0,
      Math.cos(time / 24 / 60 / 1.3),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ),
  };
}

////////////////////////////////////////////////////////////////////////////////
// Transformationsfunktionen
////////////////////////////////////////////////////////////////////////////////

// TODO: Hier werden Sie grundlegende Transformationsfunktionen implementieren.

// Transformationsfunktionen für Planeten
// nodeTrans: Planet welcher berechnet werden soll
// return: pMatrix, nMatrix
function transformation(nodeTrans) {
  pMatrix = new Matrix4(
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );
  nMatrix = new Matrix4(
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );

  pMatrix.multiply(nodeTrans.pointMatrixParentRotation);
  pMatrix.multiply(nodeTrans.pointMatrixTranslate);
  pMatrix.multiply(nodeTrans.pointMatrixScale);
  pMatrix.multiply(nodeTrans.pointMatrixSelfRotation);
  nMatrix.multiply(nodeTrans.normalMatrixSelfRotation);
  nMatrix.multiply(nodeTrans.normalMatrixParentRotation);

  return { pMatrix, nMatrix };
}

// Transformationsfunktionen für Monde
// nodeTrans: Planet um welcher der Mond kreist
// nodeTransMoon: Mond welcher berechnet werden soll
// return: pMatrix, nMatrix
function transformationMoon(nodeTrans, nodeTransMoon) {
  pMatrix = new Matrix4(
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );
  nMatrix = new Matrix4(
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );

  pMatrix.multiply(nodeTrans.pointMatrixParentRotation);
  pMatrix.multiply(nodeTrans.pointMatrixTranslate);
  pMatrix.multiply(nodeTransMoon.pointMatrixParentRotation);
  pMatrix.multiply(nodeTransMoon.pointMatrixTranslate);
  pMatrix.multiply(nodeTransMoon.pointMatrixScale);
  pMatrix.multiply(nodeTransMoon.pointMatrixSelfRotation);

  nMatrix.multiply(nodeTrans.normalMatrixParentRotation);
  nMatrix.multiply(nodeTransMoon.normalMatrixParentRotation);
  nMatrix.multiply(nodeTransMoon.normalMatrixSelfRotation);

  return { pMatrix, nMatrix };
}
