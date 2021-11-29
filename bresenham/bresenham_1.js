
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
  /*
   * Durch Math.abs() wird der Betrag von dem Ergebnis der Rechnung genommen
  **/
  let delta_y = Math.abs(end_y1 - start_y0); // Zuweisung und berechnung von Delta Y
  let delta_x = -Math.abs(end_x1 - start_x0); // Zuweisung und berechnung von Delta X
  let q = 2 * delta_y + delta_x; // Zuweisung und berechnung von der Entscheidungsvariable Q
  let q_step = 2 * (delta_y + delta_x); // Inkrement für die Entscheidungsvariable Q
  let q_equal = 2 * delta_y; // Variable für die Berechnung des neuen Q Werts
  let x = start_x0; // Zuweisung der X Variable für die Schleife
  let y = start_y0; // Zuweisung der Y Variable für die Schleife

  /*
  * Dieser Teil zeichnet die Linie indem jeder einzelne Pixel gesetzt wird.
  **/
  for(x; x <= end_x1; x++) {
    setPixel(x, y);

    if(q < 0) { // Falls die Entscheidungsvariable Q negativ ist, bleibt der Y Wert gleich.
      q = q + q_equal;
    } else {
      q = q + q_step;
      y++;
    }
  }
}