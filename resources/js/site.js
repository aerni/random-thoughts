// =============================================================
// site.js — JAVASCRIPT FÜR DIE GANZE WEBSITE
// =============================================================
// Features: Custom Cursor + Hintergrund-Malbuch (nur Home) + Favicon-Wechsel
// (Der Favicon-Wechsel ist direkt in layout.antlers.html, nicht hier.)
// =============================================================


// HINTERGRUND-MALBUCH — nur auf der Startseite (/)
// ---------------------------------------------------------------
// Canvas liegt hinter dem Inhalt. Mausbewegung → zarte pink Linie.
// Doppelklick → Leinwand leeren.

if (window.location.pathname === '/') {

    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed; top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none; z-index: 0;
        filter: blur(6px);
    `;
    document.body.prepend(canvas);

    // main und footer müssen über dem Canvas liegen (header hat bereits z-50)
    document.querySelector('main').style.cssText += 'position:relative;z-index:1;';
    document.querySelector('footer').style.cssText += 'position:relative;z-index:1;';

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let letzteX = 0, letzteY = 0, mitteX = 0, mitteY = 0, zeichnen = false;

    document.addEventListener('mousemove', (e) => {
        if (!zeichnen) {
            letzteX = e.clientX;
            letzteY = e.clientY;
            mitteX = e.clientX;
            mitteY = e.clientY;
            zeichnen = true;
            return;
        }

        // Mittelpunkt zwischen letzter und aktueller Position berechnen
        // → Bezier-Kurve durch Mittelpunkte = immer glatte, verbundene Linie
        const neuMitteX = (letzteX + e.clientX) / 2;
        const neuMitteY = (letzteY + e.clientY) / 2;

        ctx.beginPath();
        ctx.moveTo(mitteX, mitteY);
        ctx.quadraticCurveTo(letzteX, letzteY, neuMitteX, neuMitteY);
        ctx.strokeStyle = '#FD2D78';
        ctx.lineWidth = 24;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.12;
        ctx.stroke();

        mitteX = neuMitteX;
        mitteY = neuMitteY;
        letzteX = e.clientX;
        letzteY = e.clientY;
    });

    document.addEventListener('mouseleave', () => { zeichnen = false; });

    // Doppelklick → Leinwand leeren
    document.addEventListener('dblclick', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}


// CUSTOM CURSOR — EIGENER MAUSZEIGER
// ---------------------------------------------------------------
// Wir ersetzen den normalen Mauszeiger durch zwei Elemente:
//   1. dot  → kleiner pinker Punkt, folgt der Maus exakt
//   2. ring → grösserer Ring, folgt mit leichtem Nachzieh-Effekt

// Dot: kleiner pinker Punkt
const dot = document.createElement('div');

// Ring: grösserer transparenter Kreis
const ring = document.createElement('div');

// Styling des Dots direkt per JavaScript (kein CSS nötig)
dot.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 8px; height: 8px; border-radius: 50%;
    background: #FD2D78;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease, opacity 0.3s ease;
`;

// Styling des Rings
ring.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9998;
    width: 36px; height: 36px; border-radius: 50%;
    border: 2px solid #FD2D78;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0.5;
`;

// Beide Elemente ins HTML einfügen
document.body.appendChild(dot);
document.body.appendChild(ring);

// Aktuelle Mausposition
let mouseX = 0, mouseY = 0;

// Position des Rings (startet bei 0, folgt mit Verzögerung)
let ringX = 0, ringY = 0;

// Mausbewegung verfolgen → Dot folgt sofort
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
});

// Ring folgt mit Nachzieh-Effekt (Lerp = lineare Interpolation)
// 0.12 = Geschwindigkeit: 12% der Distanz pro Frame → weicher Nachzug
(function animate() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animate); // wiederholt sich ~60x pro Sekunde
})();

// Hover-Effekt: Cursor wird grösser wenn man über Links oder Buttons fährt
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(2)';  // Dot doppelt so gross
        ring.style.transform = 'translate(-50%, -50%) scale(1.5)'; // Ring 1.5x grösser
        ring.style.opacity = '0.8';
    });
    el.addEventListener('mouseleave', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1)';  // zurück zu normal
        ring.style.transform = 'translate(-50%, -50%) scale(1)';
        ring.style.opacity = '0.5';
    });
});
