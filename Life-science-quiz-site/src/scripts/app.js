/* State Manager */
let DATA = { topics: TOPICS, filter: '', paper: 'paper1' };
let QUIZ = { pool: [], userAns: [], idx: 0, scoring: null };

/* UI Logic */
function render() {
    const grids = { paper1: document.getElementById('paper1-grid'), paper2: document.getElementById('paper2-grid') };
    const q = DATA.filter.toLowerCase();

    Object.keys(grids).forEach(key => {
        const filtered = DATA.topics.filter(t => {
            const matchesMeta = t.title.toLowerCase().includes(q) || t.tags.toLowerCase().includes(q);
            const matchesContent = t.content.some(c =>
                c.topic.toLowerCase().includes(q) || c.ex.toLowerCase().includes(q)
            );
            return (t.paper === (key === 'paper1' ? 1 : 2)) && (matchesMeta || matchesContent);
        });

        grids[key].innerHTML = filtered.map(t => `
        <article class="card ${key} scale-in" style="animation-delay: ${filtered.indexOf(t) * 0.05}s" onclick="toggleStudyCard(this)">
            <span class="badge">Module ${DATA.topics.indexOf(t) + 1}</span>
            <h3>${t.title}</h3>
            <ul>
                ${t.content.map(c => `
                    <li>
                        <span class="topic-text">${c.topic}</span>
                        <span class="example-text">${c.ex}</span>
                    </li>
                `).join('')}
            </ul>
            
            <!-- Study Overlay -->
            <div class="card-preview-overlay">
                <div style="font-size: 2rem; margin-bottom: 1rem;">💡</div>
                <h4 style="margin:0 0 0.5rem 0; color:var(--paper1)">Key Fact</h4>
                <p style="font-size:0.9rem; color:var(--muted)">${t.content[0].ex}</p>
                ${t.diagram ? `<button class="btn-small" style="margin-top:1rem; background:var(--accent); color:#fff;" onclick="openDiagram(this, '${t.title}')">View Diagram</button>` : ''}
                <div style="margin-top:auto; font-size:0.8rem; color:var(--accent); font-weight:700;">Click to Close</div>
            </div>
        </article>
    `).join('');
    });
}

function openDiagram(btn, title) {
    // Prevent card flip when clicking button
    event.stopPropagation();

    // Find topic data
    const topic = DATA.topics.find(t => t.title === title);
    if (topic && topic.diagram) {
        document.getElementById('diagram-container').innerHTML = topic.diagram;
        document.getElementById('diagram-modal').classList.add('active');
    }
}

function toggleStudyCard(card) {
    if (window.getSelection().toString().length > 0) return; // Don't flip if selecting text
    card.classList.toggle('active-study');
}

function updateViewMode(mode) {
    // Top-Spec Feature: View Transitions API
    if (!document.startViewTransition) {
        performUpdate(mode);
        return;
    }

    document.startViewTransition(() => performUpdate(mode));
}

function performUpdate(mode) {
    const grids = { paper1: document.getElementById('paper1-grid'), paper2: document.getElementById('paper2-grid') };
    if (mode === 'all') {
        document.querySelectorAll('.tab-btn[data-paper]').forEach(b => b.classList.add('active'));
        Object.values(grids).forEach(g => g.style.display = 'grid');
    } else {
        document.querySelectorAll('.tab-btn[data-paper]').forEach(b => b.classList.remove('active')); // Ensure cleanup
        const activeBtn = document.querySelector(`.tab-btn[data-paper="${DATA.paper}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        Object.values(grids).forEach(g => g.style.display = 'none');
        document.getElementById(`${DATA.paper}-grid`).style.display = 'grid';
    }
}

/* Quiz Engine */
function launchQuiz(paper, count) {
    let basePool = paper === 'paper1' ? fixedQuestions.paper1 : (paper === 'paper2' ? fixedQuestions.paper2 : [...fixedQuestions.paper1, ...fixedQuestions.paper2]);
    let selected = shuffle(basePool).slice(0, Math.min(count, basePool.length));

    while (selected.length < count) {
        const gk = Object.keys(generators);
        const g = generators[gk[Math.floor(Math.random() * gk.length)]]();
        // If it's a dragdrop, ensure items are initialized
        selected.push({ ...g, auto: true });
    }

    // Capture Instant Feedback Setting
    const instantMode = document.getElementById('config-instant').checked;

    QUIZ = { pool: shuffle(selected), userAns: Array(count).fill(''), idx: 0, instant: instantMode };
    document.getElementById('quiz-config-modal').classList.remove('active');
    document.getElementById('quiz-session-modal').classList.add('active');
    renderQ();
}

function renderQ() {
    const q = QUIZ.pool[QUIZ.idx];
    const container = document.getElementById('quiz-content');
    document.getElementById('quiz-progress').innerText = `Question ${QUIZ.idx + 1} / ${QUIZ.pool.length}`;

    let inputHtml = '';
    if (q.type === 'dragdrop') {
        // Initial state or user's current state
        let currentOrder = QUIZ.userAns[QUIZ.idx]
            ? QUIZ.userAns[QUIZ.idx].split(',')
            : shuffle([...q.items]);

        // Sync initial shuffle back to answer if first load
        if (!QUIZ.userAns[QUIZ.idx]) QUIZ.userAns[QUIZ.idx] = currentOrder.join(',');

        inputHtml = `
            <div class="dd-container">
                <div class="dd-items" id="sortable-list">
                    ${currentOrder.map((item, i) => `
                        <div class="dd-item" draggable="true" data-index="${i}" data-val="${item}">${item}</div>
                    `).join('')}
                </div>
                <div style="text-align:center; font-size:0.8rem; color:var(--muted); margin-top:0.5rem;">Drag text to reorder</div>
            </div>
            <input type="hidden" id="ans" value="${QUIZ.userAns[QUIZ.idx]}">
        `;
    } else if (q.type === 'matching') {
        let currentOrder = QUIZ.userAns[QUIZ.idx]
            ? QUIZ.userAns[QUIZ.idx].split(',')
            : [...q.items];

        if (!QUIZ.userAns[QUIZ.idx]) QUIZ.userAns[QUIZ.idx] = currentOrder.join(',');

        inputHtml = `
            <div class="matching-grid">
                <div class="match-left">
                    ${q.left.map(l => `<div class="static-item">${l}</div>`).join('')}
                </div>
                <div class="match-right dd-items" id="sortable-list">
                    ${currentOrder.map((item, i) => `
                        <div class="dd-item" draggable="true" data-val="${item}">
                            <span>${item}</span>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="opacity:0.5"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>
                        </div>
                    `).join('')}
                </div>
            </div>
            <input type="hidden" id="ans" value="${QUIZ.userAns[QUIZ.idx]}">
        `;
    } else {
        inputHtml = `<input type="text" class="q-input" id="ans" placeholder="Type answer..." value="${QUIZ.userAns[QUIZ.idx]}" autocomplete="off">`;
    }

    container.innerHTML = `
    <div class="q-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--paper1); text-transform: uppercase;">
                ${q.auto ? 'System Generated' : 'Knowledge Check'}
            </div>
            ${QUIZ.instant ? '<div id="instant-feedback" class="badge">Checking...</div>' : ''}
        </div>
        <div class="q-text">${q.q}</div>
        ${inputHtml}
        
        <button id="toggle-canvas" class="btn-small" style="margin-top:1rem;" onclick="toggleCanvas()">Show Drawing Canvas</button>
        <div id="canvas-container" style="display:none; margin-top:1rem; border:1px solid #fff;">
            <canvas id="calc-canvas" width="600" height="300" style="background: #1e293b; border-radius: 12px; cursor: crosshair; touch-action: none; display:block; width:100%"></canvas>
            <div style="display:flex; justify-content: flex-end; gap:0.5rem; margin-top:0.5rem;">
                <button id="text-canvas" class="btn-small">Text</button>
                <button class="btn-small" onclick="clearCanvas()">Clear</button>
            </div>
        </div>
    </div>
`;

    if (q.type === 'dragdrop' || q.type === 'matching') {
        initDragSort();
    } else {
        const input = document.getElementById('ans');
        input.focus();
        input.addEventListener('input', (e) => {
            QUIZ.userAns[QUIZ.idx] = e.target.value;
            if (QUIZ.instant) checkInstant(e.target.value);
        });
        if (QUIZ.instant && input.value) checkInstant(input.value);
    }

    setTimeout(() => initCanvas(), 100);

    document.getElementById('q-prev').style.display = QUIZ.idx === 0 ? 'none' : 'block';
    document.getElementById('q-next').style.display = QUIZ.idx === QUIZ.pool.length - 1 ? 'none' : 'block';
    document.getElementById('q-submit').style.display = QUIZ.idx === QUIZ.pool.length - 1 ? 'block' : 'none';
    document.getElementById('q-done').style.display = 'none';
    document.getElementById('quiz-footer').style.display = 'flex';
}

function checkInstant(val) {
    const q = QUIZ.pool[QUIZ.idx];
    const u = val.toString().trim().toLowerCase();
    const fb = document.getElementById('instant-feedback');

    // Simple check logic reuse
    let correct = q.a.some(valid => {
        const cv = valid.toString().trim().toLowerCase();
        if (!isNaN(u) && !isNaN(cv)) return Math.abs(parseFloat(u) - parseFloat(cv)) < 0.1;
        return u === cv;
    });

    if (u.length === 0) {
        fb.innerText = 'Waiting...';
        fb.style.background = 'var(--muted)';
        fb.style.color = '#fff';
        return;
    }

    if (correct) {
        fb.innerText = 'Trace Correct';
        fb.style.background = 'rgba(22, 163, 74, 0.2)';
        fb.style.color = 'var(--success)';
        fb.style.borderColor = 'var(--success)';
    } else {
        fb.innerText = 'Keep Trying';
        fb.style.background = 'rgba(220, 38, 38, 0.1)';
        fb.style.color = 'var(--error)';
        fb.style.borderColor = 'var(--error)';
    }
}

function initDragSort() {
    const list = document.getElementById('sortable-list');
    let draggedItem = null;

    list.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        setTimeout(() => e.target.classList.add('dragging'), 0);
    });

    list.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
        updateDragAns();
    });

    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientX);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            list.appendChild(draggable);
        } else {
            list.insertBefore(draggable, afterElement);
        }
    });

    // Touch Support for DnD
    // Simple implementation for touch devices would usually require a library or more complex logic
    // For now we rely on desktop drag/drop
}

function getDragAfterElement(container, x) {
    // For vertical lists in matching, we might care about Y instead, but let's stick to X for standard DragDrop or generic
    const isGrid = container.style.display === 'grid'; // Not usually the sortable list itself
    const draggableElements = [...container.querySelectorAll('.dd-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        // Determine axis based on layout. Defaulting to Y for vertical lists which is most common here
        const offset = (window.innerWidth < 600 || isGrid) ?
            (x - box.left - box.width / 2) :
            (event.clientY - box.top - box.height / 2); // Fallback to Y for vertical list

        // Actually, let's use Y for vertical list (most common)
        const offsetY = event.clientY - box.top - box.height / 2;

        if (offsetY < 0 && offsetY > closest.offset) {
            return { offset: offsetY, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateDragAns() {
    const items = [...document.querySelectorAll('.dd-item')];
    const vals = items.map(i => i.dataset.val).join(',');
    QUIZ.userAns[QUIZ.idx] = vals;
}

function gradeQuiz() {
    let score = 0;
    const details = QUIZ.pool.map((q, i) => {
        const u = QUIZ.userAns[i].toString().trim().toLowerCase();

        let correct = false;
        if (q.type === 'dragdrop' || q.type === 'matching') {
            // Strict match for order
            correct = q.a[0] === u;
        } else {
            correct = q.a.some(valid => {
                const cv = valid.toString().trim().toLowerCase();
                if (!isNaN(u) && !isNaN(cv)) return Math.abs(parseFloat(u) - parseFloat(cv)) < 0.1;
                return u === cv;
            });
        }

        if (correct) score++;
        return { ...q, u, isCorrect: correct };
    });

    const Container = document.getElementById('quiz-content');
    const percent = Math.round((score / QUIZ.pool.length) * 100);

    Container.innerHTML = `
    <div style="text-align:center">
        <div style="font-size: 4rem; font-weight: 900; color: var(--accent); margin-bottom: 0.5rem;">${score} <span style="font-size: 1.5rem; color: var(--muted)">/ ${QUIZ.pool.length}</span></div>
        <h2 style="margin-bottom: 2rem;">${percent}% Proficiency</h2>
        <div style="text-align: left; background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 20px;">
            ${details.map((d, i) => `
                <div style="padding: 1rem 0; border-bottom: 1px solid var(--panel-border); color: ${d.isCorrect ? 'var(--success)' : 'var(--error)'}">
                    <strong>Q${i + 1}:</strong> ${d.q}<br>
                    <small style="color: var(--muted)">Accepted: ${d.a[0]} | Provided: ${d.u || 'None'}</small>
                </div>
            `).join('')}
        </div>
    </div>
`;
    if (percent >= 80) {
        triggerConfetti(document.body);
    }
    document.getElementById('q-prev').style.display = 'none';
    document.getElementById('q-next').style.display = 'none';
    document.getElementById('q-submit').style.display = 'none';
    document.getElementById('q-done').style.display = 'block';
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function init() {
    render();
    renderTodos();

    // Search
    document.getElementById('search-input').addEventListener('input', (e) => {
        DATA.filter = e.target.value;
        render();
    });

    // Tabs
    document.querySelectorAll('.tab-btn[data-paper]').forEach(btn => {
        btn.addEventListener('click', () => {
            GAMIFICATION.vibrate(5); // subtle click feel
            document.querySelectorAll('.tab-btn[data-paper]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            DATA.paper = btn.dataset.paper;
            updateViewMode('single');
        });
    });

    // Modal triggers
    document.getElementById('btn-quiz').addEventListener('click', () => document.getElementById('quiz-config-modal').classList.add('active'));
    document.querySelectorAll('.close-modal').forEach(b => b.addEventListener('click', () => b.closest('.modal-overlay').classList.remove('active')));

    // Quiz Setup
    document.querySelectorAll('#paper-select .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#paper-select .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.getElementById('start-now').addEventListener('click', () => {
        const paper = document.querySelector('#paper-select .active').dataset.val;
        const count = parseInt(document.getElementById('config-count').value);
        launchQuiz(paper, count);
    });

    // Quiz Nav
    document.getElementById('q-prev').addEventListener('click', () => { if (QUIZ.idx > 0) { QUIZ.idx--; renderQ(); } });
    document.getElementById('q-next').addEventListener('click', () => { if (QUIZ.idx < QUIZ.pool.length - 1) { QUIZ.idx++; renderQ(); } });
    document.getElementById('q-submit').addEventListener('click', gradeQuiz);
    document.getElementById('q-done').addEventListener('click', () => document.getElementById('quiz-session-modal').classList.remove('active'));

    // Pomodoro
    document.getElementById('timer-start').addEventListener('click', toggleTimer);
    document.getElementById('timer-reset').addEventListener('click', resetTimer);

    // Todo
    document.getElementById('todo-add').addEventListener('click', addTodo);
    document.getElementById('todo-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') addTodo(); });
}

/* Blitz Mode Logic */
let BLITZ = { score: 0, active: false, words: [], timer: null, level: 1, nextSpawn: 0 };

function launchBlitzSetup() {
    document.getElementById('blitz-modal').classList.add('active');
    document.getElementById('blitz-score').innerText = '0';
    document.getElementById('blitz-start-overlay').style.display = 'flex';
    document.getElementById('blitz-game-area').innerHTML = ''; // Clear prev game
}

function startBlitzGame() {
    BLITZ = { score: 0, active: true, words: [], timer: null, level: 1, nextSpawn: 0 };
    document.getElementById('blitz-start-overlay').style.display = 'none';
    document.getElementById('blitz-score').innerText = '0';

    // Setup controls (answers)
    renderBlitzButtons();

    // Start Loop
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

let lastTime = 0;
function gameLoop(timestamp) {
    if (!BLITZ.active) return;
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    updateBlitz(dt);

    requestAnimationFrame(gameLoop);
}

function updateBlitz(dt) {
    const area = document.getElementById('blitz-game-area');
    const height = area.clientHeight;

    // Spawn Logic
    BLITZ.nextSpawn -= dt;
    if (BLITZ.nextSpawn <= 0) {
        spawnWord();
        BLITZ.nextSpawn = 2000 - (BLITZ.level * 100); // Faster as you level up
    }

    // Move Words
    BLITZ.words.forEach((w, i) => {
        w.y += (0.1 + (BLITZ.level * 0.02)) * dt; // Speed increases
        w.el.style.top = w.y + 'px';

        // Collision with bottom
        if (w.y > height - 40) {
            // Missed!
            w.el.remove();
            BLITZ.words.splice(i, 1);
            BLITZ.words.splice(i, 1);
            showNotification("Missed one!");
            // End game if too many missed? Or just minus score?
            if (BLITZ.score > 0) BLITZ.score = Math.max(0, BLITZ.score - 5);
            document.getElementById('blitz-score').innerText = BLITZ.score;
        }
    });
}

function spawnWord() {
    // Pick random Term
    // We reuse fixedQuestions: Q is the "Clue" (falling), A is "Answer" (button)
    // Simplify: Only use short questions
    const pool = [...fixedQuestions.paper1, ...fixedQuestions.paper2].filter(q => q.a[0].length < 15);
    const item = pool[Math.floor(Math.random() * pool.length)];

    const el = document.createElement('div');
    el.className = 'falling-word';
    el.innerText = item.a[0]; // Falling ANSWER (Term)
    // Actually, let's reverse: Falling = QUESTION (Clue), Buttons = ANSWER (Term)
    // But Questions are long. 
    // Let's stick to: Falling = TERM (Answer). Buttons = CATEGORY? No.
    // Let's do: Falling = TERM. Match with same term? No.

    // Simple Matching: Falling = "Chlorophyll". Buttons = "Chlorophyll", "Mitochondria", ...
    // Player just has to find the button that matches the falling word? Too easy?
    // How about: Falling = "Green Pigment". Buttons = "Chlorophyll". Yes.

    // Re-select loop to find short Definition
    // Actually, fixedQuestions Qs are long.
    // Let's use DATA topics. Title = Falling. Button = Tag?
    // Let's go with the initial Easy mode: Speed Recognition.
    // Falling: "Chlorophyll". 4 Buttons: "Chlorophyll", "X", "Y", "Z".
    // You just have to click the button matching the falling word before it hits?
    // That tests reaction and reading, not knowledge.

    // Let's try: Falling = Category (Paper 1 / Paper 2).
    // Falling: "Photosynthesis". Buttons: "Term 1", "Term 2".
    // Too boring.

    // Let's stick to Knowledge:
    // Falling = CLUE (Short). Buttons = TERM.
    // We need short clues. 
    // "Powerhouse" -> "Mitochondria"
    // "Food Factory" -> "Chloroplast"
    // "Green Pigment" -> "Chlorophyll"

    // I'll define a small fast-pool here for Blitz
    const fastPool = [
        { q: "Green Pigment", a: "Chlorophyll" },
        { q: "Powerhouse", a: "Mitochondria" },
        { q: "Pump Blood", a: "Heart" },
        { q: "Gas Exchange", a: "Lungs" },
        { q: "H2O", a: "Water" },
        { q: "O2", a: "Oxygen" },
        { q: "CO2", a: "Carbon Dioxide" },
        { q: "Sugar", a: "Glucose" },
        { q: "Virus", a: "Flu" },
        { q: "Bacteria", a: "TB" },
        { q: "Fungi", a: "Yeast" },
        { q: "Producer", a: "Grass" },
        { q: "Consumer", a: "Lion" },
        { q: "Abiotic", a: "Rock" },
        { q: "Biotic", a: "Tree" }
    ];

    const data = fastPool[Math.floor(Math.random() * fastPool.length)];

    el.innerText = data.q; // Falling Clue
    el.dataset.ans = data.a;
    el.style.left = (Math.random() * 80 + 10) + '%';
    el.style.top = '-40px';

    document.getElementById('blitz-game-area').appendChild(el);
    BLITZ.words.push({ el: el, y: -40, data: data });
}

function renderBlitzButtons() {
    // Just 4 static matching buttons? No, they need to change dynamically or include all answers?
    // If they change, it's hard.
    // Let's have 4 static category buttons? No.
    // Let's have the buttons CHANGE to match the CURRENT falling words.
    // If multiple words fall, buttons show answers for ALL falling words?

    // Simplified: Only 1 word falls at a time for Level 1.
    // Buttons show: The Correct Answer + 3 Random Distractors.
    // Update buttons whenever a new word spawns? No, what if 2 words overlap?

    // OK, "Invader" style.
    // You type the answer? No, mobile friendly.

    // Let's go with: 4 Buttons are FIXED types: "Structure", "Process", "Organism", "Substance"
    // We map words to these 4.
    // "Mitochondria" -> Structure
    // "Photosynthesis" -> Process
    // "Lion" -> Organism
    // "Water" -> Substance

    const types = ['Structure', 'Process', 'Organism', 'Substance'];
    const container = document.getElementById('blitz-controls');
    container.innerHTML = types.map(t => `<button class="blitz-btn" onclick="checkBlitz('${t}')">${t}</button>`).join('');
}

const blitzData = [
    { w: "Mitochondria", t: "Structure" },
    { w: "Nucleus", t: "Structure" },
    { w: "Photosynthesis", t: "Process" },
    { w: "Respiration", t: "Process" },
    { w: "Lion", t: "Organism" },
    { w: "Virus", t: "Organism" },
    { w: "Water", t: "Substance" },
    { w: "Oxygen", t: "Substance" },
    { w: "Bacteria", t: "Organism" },
    { w: "Digestion", t: "Process" },
    { w: "Leaf", t: "Structure" },
    { w: "Glucose", t: "Substance" }
];

// Override spawn for Category Mode
spawnWord = function () { // Re-assigning logic
    const item = blitzData[Math.floor(Math.random() * blitzData.length)];
    const el = document.createElement('div');
    el.className = 'falling-word';
    el.innerText = item.w;
    el.dataset.type = item.t;
    el.style.left = (Math.random() * 80 + 10) + '%';
    el.style.top = '-40px';

    document.getElementById('blitz-game-area').appendChild(el);
    BLITZ.words.push({ el: el, y: -40, type: item.t });
};

function checkBlitz(type) {
    // Find lowest word
    if (BLITZ.words.length === 0) return;

    // Sort by Y (highest Y = lowest on screen)
    const target = BLITZ.words.sort((a, b) => b.y - a.y)[0];

    if (target.type === type) {
        // Correct!
        target.el.remove();
        BLITZ.words = BLITZ.words.filter(w => w !== target); // remove from array
        BLITZ.score += 10;
        document.getElementById('blitz-score').innerText = BLITZ.score;
        GAMIFICATION.addXP(1); // Real XP reward

        // Level up local speed
        if (BLITZ.score % 50 === 0) BLITZ.level++;
    } else {
        // Wrong
        BLITZ.score -= 5;
        document.getElementById('blitz-score').innerText = BLITZ.score;
        showNotification("Wrong Category!");
    }
}

function stopBlitz() {
    BLITZ.active = false;
    document.getElementById('blitz-modal').classList.remove('active');
}


// Mouse movement tracking
window.addEventListener('mousemove', (e) => {
    const glow = document.getElementById('mouse-glow');
    glow.style.setProperty('--mx', e.clientX + 'px');
    glow.style.setProperty('--my', e.clientY + 'px');
});

init();
