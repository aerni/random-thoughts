// Custom cursor
const dot = document.createElement('div');
const ring = document.createElement('div');

dot.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 8px; height: 8px; border-radius: 50%;
    background: #FD2D78;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease, opacity 0.3s ease;
`;

ring.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9998;
    width: 36px; height: 36px; border-radius: 50%;
    border: 2px solid #FD2D78;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0.5;
`;

document.body.appendChild(dot);
document.body.appendChild(ring);

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
});

(function animate() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animate);
})();

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(2)';
        ring.style.transform = 'translate(-50%, -50%) scale(1.5)';
        ring.style.opacity = '0.8';
    });
    el.addEventListener('mouseleave', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
        ring.style.transform = 'translate(-50%, -50%) scale(1)';
        ring.style.opacity = '0.5';
    });
});
