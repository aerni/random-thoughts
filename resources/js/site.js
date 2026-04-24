// =============================================================
// site.js — JAVASCRIPT FÜR DIE GANZE WEBSITE
// =============================================================
// Features: Card Tilt + Custom Cursor + Malbuch + Favicon-Wechsel
// =============================================================



// CARD TILT — 3D-Kippeffekt auf Blog-Karten
// ---------------------------------------------------------------
// Maus bewegt sich über eine Karte → Karte kippt leicht in Mausrichtung.
// Gibt einen modernen, dreidimensionalen Look.

document.querySelectorAll('.post-card a').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();

        // Position der Maus relativ zur Kartenmitte (-0.5 bis 0.5)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Kippwinkel: max. 6 Grad
        const rotateX = -y * 6;
        const rotateY = x * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
        // Zurück zur Ausgangsposition — weicher Übergang
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
        card.style.transition = 'transform 0.5s ease';
    });
});




// H1-MALBUCH — nur auf Blog-Post-Seiten (/posts/...)
// ---------------------------------------------------------------
// Wenn die Maus über dem h1-Titel ist, kann man ihn mit kräftigem Pink bemalen.
// Doppelklick → Leinwand leeren.

if (window.location.pathname.startsWith('/posts/')) {

    const h1 = document.querySelector('article h1');

    if (h1) {
        const canvas2 = document.createElement('canvas');
        canvas2.style.cssText = `
            position: fixed; top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none; z-index: 10;
            mix-blend-mode: screen;
        `;
        document.body.appendChild(canvas2);

        const ctx2 = canvas2.getContext('2d');

        function resizeCanvas2() {
            canvas2.width = window.innerWidth;
            canvas2.height = window.innerHeight;
        }
        resizeCanvas2();
        window.addEventListener('resize', resizeCanvas2);

        // Nur malen wenn Maus über dem h1 ist
        let uberH1 = false;
        h1.addEventListener('mouseenter', () => { uberH1 = true; });
        h1.addEventListener('mouseleave', () => { uberH1 = false; });

        let lX = 0, lY = 0, mX = 0, mY = 0, aktiv = false;

        document.addEventListener('mousemove', (e) => {
            if (!uberH1) { aktiv = false; return; }

            if (!aktiv) {
                lX = e.clientX; lY = e.clientY;
                mX = e.clientX; mY = e.clientY;
                aktiv = true;
                return;
            }

            const neuMX = (lX + e.clientX) / 2;
            const neuMY = (lY + e.clientY) / 2;

            ctx2.beginPath();
            ctx2.moveTo(mX, mY);
            ctx2.quadraticCurveTo(lX, lY, neuMX, neuMY);
            ctx2.strokeStyle = '#FD2D78';
            ctx2.lineWidth = 28;
            ctx2.lineCap = 'round';
            ctx2.lineJoin = 'round';
            ctx2.globalAlpha = 0.7;
            ctx2.stroke();

            mX = neuMX; mY = neuMY;
            lX = e.clientX; lY = e.clientY;
        });

        // Beim Scrollen leeren — sonst verschiebt sich die Malerei auf anderen Inhalt
        window.addEventListener('scroll', () => {
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        });

        document.addEventListener('dblclick', () => {
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        });
    }
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
