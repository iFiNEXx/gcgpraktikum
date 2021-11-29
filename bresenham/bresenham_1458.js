
////////////////////////////////////////////////////////////////////////////////
// bresenham.js
//
// Bearbeiten Sie diese Datei für den Praktikumsteil "Bresenham Line".
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


////////////////////////////////////////////////////////////////////////////////
// drawLine(x0, y0, x1, y1)
// Diese Funktion soll eine Linie von (x0, y0) nach (x1, y1) zeichnen.
// Implementieren Sie dazu den Bresenham-Line-Algorithmus für alle Oktanten
// in dieser Funktion. Einen Punkt zeichnen Sie mit setPixel(x,y).
////////////////////////////////////////////////////////////////////////////////


function drawLine(start_x0, start_y0, end_x1, end_y1) {
  let x0 = start_x0; // Zuweisung der x0 Variable
  let y0 = start_y0; // Zuweisung der y0 Variable
  let x1 = end_x1; // Zuweisung der x1 Variable
  let y1 = end_y1; // Zuweisung der y1 Variable
  let y = y0; // Zuweisung der Y Variable für die Schleife
  let x = x0; // Zuweisung der X Variable für die Schleife

  /*
  * Durch Math.abs() wird der Betrag von dem Ergebnis der Rechnung genommen
  **/
  let delta_y = Math.abs(y1 - y0); // Zuweisung und berechnung von Delta Y
  let delta_x = -Math.abs(x1 - x0); // Zuweisung und berechnung von Delta X
  let q = 2 * delta_y + delta_x; // Zuweisung und berechnung von der Entscheidungsvariable Q
  let q_step = 2 * (delta_y + delta_x); // Inkrement für die Entscheidungsvariable Q
  let q_equal = 2 * delta_y; // Variable für die Berechnung des neuen Q Werts


  let incx =1; // Inkrementierung auf der x-Achse (nach rechts positiv, nach links negativ)
  let incy =1; // Inkrementierung auf der y-Achse (nach rechts positiv, nach links negativ)

  /*
  * Falls der Start X oder Y Wert größer als der End X oder Y Wert ist,
  * dann wird das Inkrement negativ.
  **/
  if(x0 >= x1) {
    incx = -1;
  }

  if(y0 >= y1) {
    incy = -1;
  }

  /*
  * Dieser Teil zeichnet die Linie indem jeder einzelne Pixel gesetzt wird.
  * Dadurch das wir nun incx/incy eingebaut (Sie ersetzen das ehemalige ++) haben funktionieren die Oktanten 4,5,8 nun auch.
  **/
  for(x; x !== x1; x += incx) {
      setPixel(x, y);

      if (y0 === y1) {
        break;
      }

      if(q < 0) { // Falls die Entscheidungsvariable Q negativ ist, bleibt der Y Wert gleich.
        q = q + q_equal;
      } else {
        q = q + q_step;
        y += incy; 
      }
  }
}


