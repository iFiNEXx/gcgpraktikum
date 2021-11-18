
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

/*
* Dieser Teil zeichnet die Linie indem jeder einzelne Pixel gesetzt wird.
* Dadurch das wir nun incx/incy eingebaut (Sie ersetzen das ehemalige ++) haben funktionieren die Oktanten 4,5,8 nun auch.
**/
function drawLine(x0, y0, x1, y1){
  let delta_y = Math.abs(y1 - y0); // Zuweisung und berechnung von Delta Y
  let delta_x = -Math.abs(x1 - x0); // Zuweisung und berechnung von Delta X
  let q = 2 * delta_y + delta_x; // Zuweisung und berechnung von der Entscheidungsvariable Q
  let q_step = 2 * (delta_y + delta_x); // Inkrement für die Entscheidungsvariable Q
  let q_equal = 2 * delta_y; // Variable für die Berechnung des neuen Q Werts
  let y = y0;

  for(let x = x0; x <= x1; x++){
      setPixel(x, y);

      if(q < 0) {
        q = q + q_equal;
      }

      else {
        q = q + q_step;
        y++;
      }
  }
}



////////////////////////////////////////////////////////////////////////////////
// example(i)
// Diese Funktion dient als Codebeispiel.
// Sie wird beim Laden der Seite aufgerufen und kann entfernt werden.
////////////////////////////////////////////////////////////////////////////////
function example(i)
{
  let y = i + 2;
  for (let x = 0; x < 400; x++)
  {
    y--;
    if (y < -i)
    {
      y = i;
    }
    setPixel(x, Math.abs(y));
  }
}
