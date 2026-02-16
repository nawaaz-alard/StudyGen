/* Calculation Canvas Logic */
let mode = 'draw'; // draw | text
let isDrawing = false;
let lastX = 0;
let lastY = 0;
const canvasId = 'calc-canvas';
const containerId = 'canvas-container';

/* Background Canvas Logic */
function initBackgroundCanvas() {
    // Create canvas if it doesn't exist
    let bgCanvas = document.getElementById('bg-canvas');
    if (!bgCanvas) {
        bgCanvas = document.createElement('canvas');
        bgCanvas.id = 'bg-canvas';
        bgCanvas.style.position = 'fixed';
        bgCanvas.style.top = '0';
        bgCanvas.style.left = '0';
        bgCanvas.style.width = '100vw';
        bgCanvas.style.height = '100vh';
        bgCanvas.style.zIndex = '-1';
        bgCanvas.style.pointerEvents = 'none';

        // Insert as first child of body to stay behind everything
        document.body.prepend(bgCanvas);
    }

    const ctx = bgCanvas.getContext('2d');

    let width, height;

    // Symbols to float: Math specific
    const symbols = ['π', '∑', '∫', '∞', '√', '±', '÷', '×', '∆', 'θ', 'λ', 'x²', 'y=mx+c'];
    const particles = [];

    function resize() {
        width = bgCanvas.width = window.innerWidth;
        height = bgCanvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    // Create particles
    for (let i = 0; i < 25; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            text: symbols[Math.floor(Math.random() * symbols.length)],
            size: Math.random() * 20 + 15,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            angle: Math.random() * Math.PI * 2,
            vAngle: (Math.random() - 0.5) * 0.02,
            opacity: Math.random() * 0.15 + 0.05
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw Connections (Constellation Effect)
        ctx.lineWidth = 0.5;
        // Optimization: Only check connections for a subset or close neighbors to save perf on low-end
        // But for 25 particles, O(N^2) is fine (625 checks)
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / 150)})`;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        // Draw Particles
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.angle += p.vAngle;

            if (p.x < -50) p.x = width + 50;
            if (p.x > width + 50) p.x = -50;
            if (p.y < -50) p.y = height + 50;
            if (p.y > height + 50) p.y = -50;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);

            // Glow Effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = "rgba(255, 255, 255, 0.5)";

            ctx.font = `${p.size}px Patrick Hand, sans-serif`;
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity + 0.2})`;

            ctx.fillText(p.text, -p.size / 2, p.size / 3);
            ctx.restore();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

function toggleCanvas() {
    const container = document.getElementById(containerId);
    const btn = document.getElementById('toggle-canvas');
    if (container.style.display === 'none') {
        container.style.display = 'block';
        btn.innerText = 'Hide Working Area';
        initCanvas();
    } else {
        container.style.display = 'none';
        btn.innerText = 'Show Working Area';
    }
}

function initCanvas() {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const newCanvas = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(newCanvas, canvas);

    const ctx = newCanvas.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2563eb';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillStyle = '#1e293b';

    newCanvas.addEventListener('mousedown', (e) => handleStart(e, newCanvas, ctx));
    newCanvas.addEventListener('mousemove', (e) => handleMove(e, newCanvas, ctx));
    newCanvas.addEventListener('mouseup', () => handleEnd());
    newCanvas.addEventListener('mouseout', () => handleEnd());

    newCanvas.addEventListener('touchstart', (e) => {
        if (mode === 'text') return;
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        newCanvas.dispatchEvent(mouseEvent);
    }, { passive: false });

    newCanvas.addEventListener('touchmove', (e) => {
        if (mode === 'text') return;
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        newCanvas.dispatchEvent(mouseEvent);
    }, { passive: false });

    newCanvas.addEventListener('touchend', () => handleEnd());

    // Tools logic (Text vs Draw) can be expanded here if UI buttons exist
}

function handleStart(e, canvas, ctx) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawing = true;
    lastX = x;
    lastY = y;
}

function handleMove(e, canvas, ctx) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
}

function handleEnd() {
    isDrawing = false;
}

function clearCanvas() {
    const canvas = document.getElementById('calc-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Auto-start background
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackgroundCanvas);
} else {
    initBackgroundCanvas();
}
