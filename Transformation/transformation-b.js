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

  // Falls der Szenenknoten eine Shape enthaelt ...
  if (sceneRoot.shape != undefined) {
    // Tranformation des Szenenknotens bestimmen
    let nodeTransformation = sceneRoot.animator(timeScale * time);

    // Transformation des Szenenknotens anwenden
    pointMatrix.multiply(nodeTransformation.pointMatrix);
    normalMatrix.multiply(nodeTransformation.normalMatrix);

    // Szenenknoten rendern
    renderSceneNode(sceneRoot, pointMatrix, normalMatrix);

    loop(time, sceneRoot.children, 0);
  }
}

// Loop soll in ein Loop geändert werden, z.B.: loop(time, array, index)

function loop(time, array, index, parent) {
  if(array.length > 0) {
    if(array[index].shape != undefined) {
      let matrix;

      if(parent == undefined) {
        matrix = transformation(array[index].animator(timeScale * time));
      } else {
        matrix = transformation(array[index].animator(timeScale * time), parent.animator(timeScale * time));
      }
      
      renderSceneNode(array[index], matrix.pointMatrix, matrix.normalMatrix);

      if(parent == undefined && array[index].children.length > 0) {
        loop(time, array[index].children, 0, array[index]);
      }
      
      if(index < array.length - 1) {
        index++;
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

// TODO: Hier werden Sie weitere Animate-Funktionen implementieren.

function animateNode(time) {
  // Aufruf der Funktionen Scale(matrix, radius), Translate(matrix, orbitRadius), Rotate(matrix, time, rotation)

  return {
    pointMatrixScale: new Matrix4(
      
      this.radius, 0.0, 0.0, 0.0, 
      0.0, this.radius, 0.0, 0.0, 
      0.0, 0.0, this.radius, 0.0, 
      0.0, 0.0, 0.0, 1.0
    ), 

    pointMatrixTranslate: new Matrix4(
      1.0, 0.0, 0.0, this.orbitRadius, 
      0.0, 1.0, 0.0, 0.0, 
      0.0, 0.0, 1.0, 0.0, 
      0.0, 0.0, 0.0, 1.0
    ), 

    pointMatrixSelfRotation: new Matrix4(
      Math.cos((time * ((360 * Math.PI) / 180)) / this.selfRotation), 0.0, Math.sin((time * ((360 * Math.PI) / 180)) / this.selfRotation), 0.0, 
      0.0, 1.0, 0.0, 0.0, 
      -Math.sin((time * ((360 * Math.PI) / 180)) / this.selfRotation), 0.0, Math.cos((time * ((360 * Math.PI) / 180)) / this.selfRotation), 0.0, 
      0.0, 0.0, 0.0, 1.0
    ), 

    pointMatrixParentRotation: new Matrix4(
      Math.cos((time * ((360 * Math.PI) / 180)) / this.orbitRotation), 0.0, Math.sin((time * ((360 * Math.PI) / 180)) / this.orbitRotation), 0.0, 
      0.0, 1.0, 0.0, 0.0, 
      -Math.sin((time * ((360 * Math.PI) / 180)) / this.orbitRotation), 0.0, Math.cos((time * ((360 * Math.PI) / 180)) / this.orbitRotation), 0.0, 
      0.0, 0.0, 0.0, 1.0
    ), 

    normalMatrixSelfRotation: new Matrix4(
      Math.cos((time * ((360 * Math.PI) / 180)) / this.selfRotation), 0.0, Math.sin((time * ((360 * Math.PI) / 180)) / this.selfRotation), 0.0, 
      0.0, 1.0, 0.0, 0.0, 
      -Math.sin((time * ((360 * Math.PI) / 180)) / this.selfRotation), 0.0, Math.cos((time * ((360 * Math.PI) / 180)) / this.selfRotation), 0.0, 
      0.0, 0.0, 0.0, 1.0
    ), 

    normalMatrixParentRotation: new Matrix4(
      Math.cos((time * ((360 * Math.PI) / 180)) / this.orbitRotation), 0.0, Math.sin((time * ((360 * Math.PI) / 180)) / this.orbitRotation), 0.0, 
      0.0, 1.0, 0.0, 0.0, 
      -Math.sin((time * ((360 * Math.PI) / 180)) / this.orbitRotation), 0.0, Math.cos((time * ((360 * Math.PI) / 180)) / this.orbitRotation), 0.0, 
      0.0, 0.0, 0.0, 1.0
    ), 
  };
}

////////////////////////////////////////////////////////////////////////////////
// Transformationsfunktionen
////////////////////////////////////////////////////////////////////////////////

// TODO: Hier werden Sie grundlegende Transformationsfunktionen implementieren.

// Transformationsfunktionen für Planeten
// nodeTrans: Planet welcher berechnet werden soll
// return: pMatrix,  nMatrix
function transformation(animator, parentAnimator) {
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

  if(parentAnimator == undefined) {
    pointMatrix.multiply(animator.pointMatrixParentRotation);
    pointMatrix.multiply(animator.pointMatrixTranslate);
    pointMatrix.multiply(animator.pointMatrixScale);
    pointMatrix.multiply(animator.pointMatrixSelfRotation);
    normalMatrix.multiply(animator.normalMatrixSelfRotation);
    normalMatrix.multiply(animator.normalMatrixParentRotation);
  } else {
    pointMatrix.multiply(parentAnimator.pointMatrixParentRotation);
    pointMatrix.multiply(parentAnimator.pointMatrixTranslate);
    pointMatrix.multiply(animator.pointMatrixParentRotation);
    pointMatrix.multiply(animator.pointMatrixTranslate);
    pointMatrix.multiply(animator.pointMatrixScale);
    pointMatrix.multiply(animator.pointMatrixSelfRotation);
    normalMatrix.multiply(parentAnimator.normalMatrixParentRotation);
    normalMatrix.multiply(animator.normalMatrixParentRotation);
    normalMatrix.multiply(animator.normalMatrixSelfRotation);
  }

  return { pointMatrix,  normalMatrix };
}