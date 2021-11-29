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
  // Faktor fuer die Zeit -- fuer Zeitraffer / Zeitlupe
  let timeScale = 20000.0;

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
      // Schleife zur berechnung aller Planeten
      for (var i = 0; i < sceneRoot.children.length; i++) {
        // Falls der Planet ein Shape enthaelt ...
        if (sceneRoot.children[i].shape != undefined) {
          // Matrix berechnung eines Planeten
          let matrix = transformation(
            sceneRoot.children[i].animator(timeScale * time)
          );

          // Planet rendern
          renderSceneNode(
            sceneRoot.children[i],
            matrix.pMatrix,
            matrix.nMatrix
          );

          // Falls Planet ein children (Mond) hat ...
          if (sceneRoot.children[i].children.length > 0) {
            // Schleife zur berechnung aller Monde eines Planeten
            for (j = 0; j < sceneRoot.children[i].children.length; j++) {
              // Falls der Mond ein Shape enthaelt ...
              if (sceneRoot.children[i].children[0].shape != undefined) {
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
              }
            }
          }
        }
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
    children: [earth],
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
