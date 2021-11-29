////////////////////////////////////////////////////////////////////////////////
// transformation-b.js
//
// Bearbeiten Sie diese Datei fuer den Praktikumsteil "Transformation B".
//
// HS Duesseldorf - Fachbereich Medien - Grundlagen d. Computergrafik
//
// Studiengang:
// Gruppe     : J
// Autor 1    : Tobias Drostel
// Autor 2    : Jan Hüls
// Autor 3    : Fabian Hack
// Autor 4    : Giacomo Hoch
// Autor 5    :
////////////////////////////////////////////////////////////////////////////////



// globale variablen
var sceneRoot;  // speichert den Wurzelknoten der Szene


////////////////////////////////////////////////////////////////////////////////
// renderScene(time)
// Wird aufgerufen, wenn die gesamte Szene gerendert werden muss.
// In der Variable time wird die verstrichene Zeit in Sekunden übergeben.
////////////////////////////////////////////////////////////////////////////////
function renderScene(time)
{
  // Transformationsmatrix fuer Punkte
  var pointMatrix = new Matrix4(1.0, 0.0, 0.0, 0.0,
                                0.0, 1.0, 0.0, 0.0,
                                0.0, 0.0, 1.0, 0.0,
                                0.0, 0.0, 0.0, 1.0);
  // Transformationsmatrix fuer Normalen
  var normalMatrix = new Matrix4(1.0, 0.0, 0.0, 0.0,
                                 0.0, 1.0, 0.0, 0.0,
                                 0.0, 0.0, 1.0, 0.0,
                                 0.0, 0.0, 0.0, 1.0);
  // Faktor fuer die Zeit -- fuer Zeitraffer / Zeitlupe
  var timeScale = 10000;

  // Falls der Szenenknoten eine Shape enthaelt ...
  if (sceneRoot.shape != undefined)
  {
    // Tranformation des Szenenknotens bestimmen
    var nodeTransformation = sceneRoot.animator(timeScale * time);
    
    // Transformation des Szenenknotens anwenden
    pointMatrix.multiplySelf(nodeTransformation.pointMatrix);
    normalMatrix.multiplySelf(nodeTransformation.normalMatrix);
    
    // Szenenknoten rendern
    renderSceneNode(sceneRoot, pointMatrix, normalMatrix);
	
	// Falls sceneRoot ein children hat ...
	if (sceneRoot.children.length > 0)
	{
		// Schleife zur berechnung aller Planeten
		for (var i = 0; i < sceneRoot.children.length; i++)
		{
			// Falls der Planet ein Shape enthaelt ...
			if (sceneRoot.children[i].shape != undefined)
			{
				// Matrix berechnung eines Planeten
				matrix = transformation(sceneRoot.children[i].animator(timeScale * time));
				// Planet rendern
				renderSceneNode(sceneRoot.children[i], matrix.pMatrix, matrix.nMatrix);
				
				// Falls Planet ein children (Mond) hat ...
				if (sceneRoot.children[i].children.length > 0)
				{
					// Schleife zur berechnung aller Monde eines Planeten
					for (j = 0; j < sceneRoot.children[i].children.length; j++)
					{
						// Falls der Mond ein Shape enthaelt ...
						if (sceneRoot.children[i].children[0].shape != undefined)
						{
							// Matrix berechnung eines Mondes
							matrixMoon = transformationMoon(sceneRoot.children[i].animator(timeScale * time),sceneRoot.children[i].children[j].animator(timeScale * time));
							// Mond rendern
							renderSceneNode(sceneRoot.children[i].children[j], matrixMoon.pMatrix, matrixMoon.nMatrix);
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
function initScene()
{
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
    children: [phobos,deimos]
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
    children: []
  };
  
  // -- Erde --------------------
  var earth = {
    animator: animateEarth,
    shape: CreateEarth(),
    children: [moon]
  };
  
  // -- Sonne --------------------
  var sun = {
    animator: animateSun,
    shape: CreateSun(),
    children: [earth,mercury,venus,mars]
  };
  
  // Setze die Sonne als Wurzelknoten der Szene.
  sceneRoot = sun;
}





////////////////////////////////////////////////////////////////////////////////
// Animate-Funktionen
////////////////////////////////////////////////////////////////////////////////
// -- Sonne --------------------------------------------------------------------
function animateSun(time)
{
  return {
    pointMatrix:  new Matrix4(1.0, 0.0, 0.0, 0.0,
                              0.0, 1.0, 0.0, 0.0,
                              0.0, 0.0, 1.0, 0.0,
                              0.0, 0.0, 0.0, 1.0),
    normalMatrix: new Matrix4(1.0, 0.0, 0.0, 0.0,
                              0.0, 1.0, 0.0, 0.0,
                              0.0, 0.0, 1.0, 0.0,
                              0.0, 0.0, 0.0, 1.0)
  };
}

// TODO: Hier werden Sie weitere Animate-Funktionen implementieren.

// -- Earth --------------------------------------------------------------------
function animateEarth(time)
{
  return {
	pointMatrixS:  new Matrix4(13.0, 0.0, 0.0, 0.0,
                         0.0, 13.0, 0.0, 0.0,
                         0.0, 0.0, 13.0, 0.0,
                         0.0, 0.0, 0.0, 1.0),

    pointMatrixT:  new Matrix4(1.0, 0.0, 0.0, 200.0,
                         0.0, 1.0, 0.0, 0.0,
                         0.0, 0.0, 1.0, 0.0,
                         0.0, 0.0, 0.0, 1.0),

    pointMatrixR:  new Matrix4(Math.cos(time/24/60), 0.0, Math.sin(time/24/60), 0.0,
                         0.0, 1.0, 0.0, 0.0,
                         -Math.sin(time/24/60), 0.0, Math.cos(time/24/60), 0.0,
                         0.0, 0.0, 0.0, 1.0),

    pointMatrixR2:  new Matrix4(Math.cos(time/24/60/365.2), 0.0, Math.sin(time/24/60/365.2), 0.0,
                         0.0, 1.0, 0.0, 0.0,
                         -Math.sin(time/24/60/365.2), 0.0, Math.cos(time/24/60/365.2), 0.0,
                         0.0, 0.0, 0.0, 1.0),

    normalMatrixR:  new Matrix4(Math.cos(time/24/60), 0.0, Math.sin(time/24/60), 0.0,
                         0.0, 1.0, 0.0, 0.0,
                         -Math.sin(time/24/60), 0.0, Math.cos(time/24/60), 0.0,
                         0.0, 0.0, 0.0, 1.0),

    normalMatrixR2:  new Matrix4(Math.cos(time/24/60/365.2), 0.0, Math.sin(time/24/60/365.2), 0.0,
                         0.0, 1.0, 0.0, 0.0,
                         -Math.sin(time/24/60/365.2), 0.0, Math.cos(time/24/60/365.2), 0.0,
                         0.0, 0.0, 0.0, 1.0),
  };
}

// -- Mond (Earth) --------------------------------------------------------------------
function animateMoon(time)
{
  return {
    pointMatrixS:  new Matrix4(3.5, 0.0, 0.0, 0.0,
                        0.0, 3.5, 0.0, 0.0,
                        0.0, 0.0, 3.5, 0.0,
                        0.0, 0.0, 0.0, 1.0),

	pointMatrixR:  new Matrix4(Math.cos(time/24/60/27.3), 0.0, Math.sin(time/24/60/27.3), 0.0,
                         0.0, 1.0, 0.0, 0.0,
                         -Math.sin(time/24/60/27.3), 0.0, Math.cos(time/24/60/27.3), 0.0,
                         0.0, 0.0, 0.0, 1.0),
						 
	pointMatrixT:  new Matrix4(1.0, 0.0, 0.0, 22.0,
                         0.0, 1.0, 0.0, 0.0,
                         0.0, 0.0, 1.0, 0.0,
                         0.0, 0.0, 0.0, 1.0),						 
						 
	pointMatrixR2:  new Matrix4(Math.cos(time/24/60/27.3), 0.0, Math.sin(time/24/60/27.3), 0.0,
                         0.0, 1.0, 0.0, 0.0,
                         -Math.sin(time/24/60/27.3), 0.0, Math.cos(time/24/60/27.3), 0.0,
                         0.0, 0.0, 0.0, 1.0),

	normalMatrixR:  new Matrix4(Math.cos(time/24/60/27.3), 0.0, Math.sin(time/24/60/27.3), 0.0,
                             0.0, 1.0, 0.0, 0.0,
                             -Math.sin(time/24/60/27.3), 0.0, Math.cos(time/24/60/27.3), 0.0,
                             0.0, 0.0, 0.0, 1.0),

	normalMatrixR2:  new Matrix4(Math.cos(time/24/60/27.3), 0.0, Math.sin(time/24/60/27.3), 0.0,
                              0.0, 1.0, 0.0, 0.0,
                              -Math.sin(time/24/60/27.3), 0.0, Math.cos(time/24/60/27.3), 0.0,
                              0.0, 0.0, 0.0, 1.0),					 
  };
}

// -- Mercury --------------------------------------------------------------------
function animateMercury(time)
{
  return {
    pointMatrixS:  new Matrix4(5.0, 0.0, 0.0, 0.0,
                              0.0, 5.0, 0.0, 0.0,
                              0.0, 0.0, 5.0, 0.0,
                              0.0, 0.0, 0.0, 1.0),
	pointMatrixT: new Matrix4(1.0, 0.0, 0.0, 76.0,
                              0.0, 1.0, 0.0, 0.0,
                              0.0, 0.0, 1.0, 0.0,
                              0.0, 0.0, 0.0, 1.0),
	pointMatrixR: new Matrix4(Math.cos(time/24/60/58.7), 0.0, Math.sin(time/24/60/58.7), 0.0,
                              0.0, 1.0, 0.0, 0.0,
                              -Math.sin(time/24/60/58.7), 0.0, Math.cos(time/24/60/58.7), 0.0,
                              0.0, 0.0, 0.0, 1.0),
	pointMatrixR2: new Matrix4(Math.cos(time/24/60/88), 0.0, Math.sin(time/24/60/88), 0.0,
                              0.0, 1.0, 0.0, 0.0,
                              -Math.sin(time/24/60/88), 0.0, Math.cos(time/24/60/88), 0.0,
                              0.0, 0.0, 0.0, 1.0),
	normalMatrixR: new Matrix4(Math.cos(time/24/60/58.7), 0.0, Math.sin(time/24/60/58.7), 0.0,
                              0.0, 1.0, 0.0, 0.0,
                              -Math.sin(time/24/60/58.7), 0.0, Math.cos(time/24/60/58.7), 0.0,
                              0.0, 0.0, 0.0, 1.0),
    normalMatrixR2: new Matrix4(Math.cos(time/24/60/88), 0.0, Math.sin(time/24/60/88), 0.0,
                              0.0, 1.0, 0.0, 0.0,
                              -Math.sin(time/24/60/88), 0.0, Math.cos(time/24/60/88), 0.0,
                              0.0, 0.0, 0.0, 1.0)
  };
}

// -- Venus --------------------------------------------------------------------
function animateVenus(time)
{
  return {
	pointMatrixS:  new Matrix4(12.0, 0.0, 0.0, 0.0,
                         0.0, 12.0, 0.0, 0.0,
                         0.0, 0.0, 12.0, 0.0,
                         0.0, 0.0, 0.0, 1.0),

    pointMatrixT:  new Matrix4(1.0, 0.0, 0.0, 145.0,
                         0.0, 1.0, 0.0, 0.0,
                         0.0, 0.0, 1.0, 0.0,
                         0.0, 0.0, 0.0, 1.0),

    pointMatrixR:  new Matrix4(Math.cos(time/24/60/243), 0.0, Math.sin(time/24/60/243), 0.0,
                         0.0, 1.0, 0.0, 0.0,
                         -Math.sin(time/24/60/243), 0.0, Math.cos(time/24/60/243), 0.0,
                         0.0, 0.0, 0.0, 1.0),

    pointMatrixR2:  new Matrix4(Math.cos(time/24/60/224.7), 0.0, Math.sin(time/24/60/224.7), 0.0,
                         0.0, 1.0, 0.0, 0.0,
                         -Math.sin(time/24/60/224.7), 0.0, Math.cos(time/24/60/224.7), 0.0,
                         0.0, 0.0, 0.0, 1.0),

    normalMatrixR: new Matrix4(Math.cos(time/24/60/243), 0.0, Math.sin(time/24/60/243), 0.0,
                             0.0, 1.0, 0.0, 0.0,
                             -Math.sin(time/24/60/243), 0.0, Math.cos(time/24/60/243), 0.0,
                             0.0, 0.0, 0.0, 1.0),

    normalMatrixR2:  new Matrix4(Math.cos(time/24/60/224.7), 0.0, Math.sin(time/24/60/224.7), 0.0,
                               0.0, 1.0, 0.0, 0.0,
                               -Math.sin(time/24/60/224.7), 0.0, Math.cos(time/24/60/224.7), 0.0,
                               0.0, 0.0, 0.0, 1.0),
  };
} 

// -- Mars --------------------------------------------------------------------
function animateMars(time)
{
  return {
	pointMatrixS:  new Matrix4(7.0, 0.0, 0.0, 0.0,
                         0.0, 7.0, 0.0, 0.0,
                         0.0, 0.0, 7.0, 0.0,
                         0.0, 0.0, 0.0, 1.0),

    pointMatrixT:  new Matrix4(1.0, 0.0, 0.0, 305.0,
                         0.0, 1.0, 0.0, 0.0,
                         0.0, 0.0, 1.0, 0.0,
                         0.0, 0.0, 0.0, 1.0),

    pointMatrixR:  new Matrix4(Math.cos(time/24/60/1), 0.0, Math.sin(time/24/60/1), 0.0,
                         0.0, 1.0, 0.0, 0.0,
                         -Math.sin(time/24/60/1), 0.0, Math.cos(time/24/60/1), 0.0,
                         0.0, 0.0, 0.0, 1.0),

    pointMatrixR2:  new Matrix4(Math.cos(time/24/60/687), 0.0, Math.sin(time/24/60/687), 0.0,
                         0.0, 1.0, 0.0, 0.0,
                         -Math.sin(time/24/60/687), 0.0, Math.cos(time/24/60/687), 0.0,
                         0.0, 0.0, 0.0, 1.0),

    normalMatrixR: new Matrix4(Math.cos(time/24/60/1), 0.0, Math.sin(time/24/60/1), 0.0,
                             0.0, 1.0, 0.0, 0.0,
                             -Math.sin(time/24/60/1), 0.0, Math.cos(time/24/60/1), 0.0,
                             0.0, 0.0, 0.0, 1.0),

    normalMatrixR2:  new Matrix4(Math.cos(time/24/60/687), 0.0, Math.sin(time/24/60/687), 0.0,
                               0.0, 1.0, 0.0, 0.0,
                               -Math.sin(time/24/60/687), 0.0, Math.cos(time/24/60/687), 0.0,
                               0.0, 0.0, 0.0, 1.0),
  };  
}

// -- Phobos (Mars) --------------------------------------------------------------------
function animatePhobos(time)
{
  return {
    pointMatrixS:  new Matrix4(2.5, 0.0, 0.0, 0.0,
                        0.0, 2.5, 0.0, 0.0,
                        0.0, 0.0, 2.5, 0.0,
                        0.0, 0.0, 0.0, 1.0),

	pointMatrixR:  new Matrix4(Math.cos(time/24/60/0.3), 0.0, Math.sin(time/24/60/0.3), 0.0,
                         0.0, 1.0, 0.0, 0.0,
                         -Math.sin(time/24/60/0.3), 0.0, Math.cos(time/24/60/0.3), 0.0,
                         0.0, 0.0, 0.0, 1.0),
						 
	pointMatrixT:  new Matrix4(1.0, 0.0, 0.0, 15.0,
                         0.0, 1.0, 0.0, 0.0,
                         0.0, 0.0, 1.0, 0.0,
                         0.0, 0.0, 0.0, 1.0),						 
						 
	pointMatrixR2:  new Matrix4(Math.cos(time/24/60/0.3), 0.0, Math.sin(time/24/60/0.3), 0.0,
                         0.0, 1.0, 0.0, 0.0,
                         -Math.sin(time/24/60/0.3), 0.0, Math.cos(time/24/60/0.3), 0.0,
                         0.0, 0.0, 0.0, 1.0),

	normalMatrixR:  new Matrix4(Math.cos(time/24/60/0.3), 0.0, Math.sin(time/24/60/0.3), 0.0,
                             0.0, 1.0, 0.0, 0.0,
                             -Math.sin(time/24/60/0.3), 0.0, Math.cos(time/24/60/0.3), 0.0,
                             0.0, 0.0, 0.0, 1.0),

	normalMatrixR2:  new Matrix4(Math.cos(time/24/60/0.3), 0.0, Math.sin(time/24/60/0.3), 0.0,
                              0.0, 1.0, 0.0, 0.0,
                              -Math.sin(time/24/60/0.3), 0.0, Math.cos(time/24/60/0.3), 0.0,
                              0.0, 0.0, 0.0, 1.0),					 
  };
}

// -- Deimos (Mars) --------------------------------------------------------------------
function animateDeimos(time)
{
  return {
    pointMatrixS:  new Matrix4(1.5, 0.0, 0.0, 0.0,
                        0.0, 1.5, 0.0, 0.0,
                        0.0, 0.0, 1.5, 0.0,
                        0.0, 0.0, 0.0, 1.0),

	pointMatrixR:  new Matrix4(Math.cos(time/24/60/1.3), 0.0, Math.sin(time/24/60/1.3), 0.0,
                         0.0, 1.0, 0.0, 0.0,
                         -Math.sin(time/24/60/1.3), 0.0, Math.cos(time/24/60/1.3), 0.0,
                         0.0, 0.0, 0.0, 1.0),
						 
	pointMatrixT:  new Matrix4(1.0, 0.0, 0.0, 20.0,
                         0.0, 1.0, 0.0, 0.0,
                         0.0, 0.0, 1.0, 0.0,
                         0.0, 0.0, 0.0, 1.0),						 
						 
	pointMatrixR2:  new Matrix4(Math.cos(time/24/60/1.3), 0.0, Math.sin(time/24/60/1.3), 0.0,
                         0.0, 1.0, 0.0, 0.0,
                         -Math.sin(time/24/60/1.3), 0.0, Math.cos(time/24/60/1.3), 0.0,
                         0.0, 0.0, 0.0, 1.0),

	normalMatrixR:  new Matrix4(Math.cos(time/24/60/1.3), 0.0, Math.sin(time/24/60/1.3), 0.0,
                             0.0, 1.0, 0.0, 0.0,
                             -Math.sin(time/24/60/1.3), 0.0, Math.cos(time/24/60/1.3), 0.0,
                             0.0, 0.0, 0.0, 1.0),

	normalMatrixR2:  new Matrix4(Math.cos(time/24/60/1.3), 0.0, Math.sin(time/24/60/1.3), 0.0,
                              0.0, 1.0, 0.0, 0.0,
                              -Math.sin(time/24/60/1.3), 0.0, Math.cos(time/24/60/1.3), 0.0,
                              0.0, 0.0, 0.0, 1.0),					 
  };
}


////////////////////////////////////////////////////////////////////////////////
// Transformationsfunktionen
////////////////////////////////////////////////////////////////////////////////

// TODO: Hier werden Sie grundlegende Transformationsfunktionen implementieren.

// Transformationsfunktionen für Planeten
// nodeTrans: Planet welcher berechnet werden soll
// return: pMatrix, nMatrix
function transformation(nodeTrans)
{
	pMatrix = new Matrix4(1.0, 0.0, 0.0, 0.0,
						0.0, 1.0, 0.0, 0.0,
						0.0, 0.0, 1.0, 0.0,
						0.0, 0.0, 0.0, 1.0);
	nMatrix = new Matrix4(1.0, 0.0, 0.0, 0.0,
						0.0, 1.0, 0.0, 0.0,
						0.0, 0.0, 1.0, 0.0,
						0.0, 0.0, 0.0, 1.0);
	
	pMatrix.multiplySelf(nodeTrans.pointMatrixR2);
    pMatrix.multiplySelf(nodeTrans.pointMatrixT);
	pMatrix.multiplySelf(nodeTrans.pointMatrixS);
	pMatrix.multiplySelf(nodeTrans.pointMatrixR);
    nMatrix.multiplySelf(nodeTrans.normalMatrixR);
	nMatrix.multiplySelf(nodeTrans.normalMatrixR2);
	
	return {pMatrix,nMatrix};
}


// Transformationsfunktionen für Monde
// nodeTrans: Planet um welcher der Mond kreist
// nodeTransMoon: Mond welcher berechnet werden soll
// return: pMatrix, nMatrix
function transformationMoon(nodeTrans,nodeTransMoon)
{
	pMatrix = new Matrix4(1.0, 0.0, 0.0, 0.0,
						0.0, 1.0, 0.0, 0.0,
						0.0, 0.0, 1.0, 0.0,
						0.0, 0.0, 0.0, 1.0);
	nMatrix = new Matrix4(1.0, 0.0, 0.0, 0.0,
						0.0, 1.0, 0.0, 0.0,
						0.0, 0.0, 1.0, 0.0,
						0.0, 0.0, 0.0, 1.0);
	
	pMatrix.multiplySelf(nodeTrans.pointMatrixR2);
    pMatrix.multiplySelf(nodeTrans.pointMatrixT);
	pMatrix.multiplySelf(nodeTransMoon.pointMatrixR2);
	pMatrix.multiplySelf(nodeTransMoon.pointMatrixT);
	pMatrix.multiplySelf(nodeTransMoon.pointMatrixS);
	pMatrix.multiplySelf(nodeTransMoon.pointMatrixR);
	
    nMatrix.multiplySelf(nodeTrans.normalMatrixR2);
	nMatrix.multiplySelf(nodeTransMoon.normalMatrixR2);
	nMatrix.multiplySelf(nodeTransMoon.normalMatrixR);
	
	return {pMatrix,nMatrix};
}