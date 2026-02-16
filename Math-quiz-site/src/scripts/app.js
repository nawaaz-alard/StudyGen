/* Math Site App Logic */

/* State Manager */
let DATA = { topics: TOPICS, filter: '', paper: 'paper1' };
let QUIZ = { pool: [], userAns: [], idx: 0, scoring: null };
let GAMIFICATION_LOADED = typeof GAMIFICATION !== 'undefined';

/* UI Logic */
function render() {
    const grids = { paper1: document.getElementById('paper1-grid'), paper2: document.getElementById('paper2-grid') };
    const q = DATA.filter.toLowerCase();

    // Helper to get mastery stats
    const getMastery = (tags) => {
        if (!GAMIFICATION_LOADED) return 0;
        let score = 0;
        const t = tags.toLowerCase();
        if (t.includes('algebra') || t.includes('equation')) score = GAMIFICATION.stats.algebra;
        else if (t.includes('geometry') || t.includes('angle') || t.includes('lines')) score = GAMIFICATION.stats.geometry;
        else if (t.includes('measurement') || t.includes('area')) score = GAMIFICATION.stats.measurement;
        else score = GAMIFICATION.stats.numbers; // Default to numbers

        // Cap mastery visual at 100% (assuming 20 questions is "mastery" for visual sake)
        return Math.min(100, (score / 20) * 100);
    };

    Object.keys(grids).forEach(key => {
        const filtered = DATA.topics.filter(t => {
            const matchesMeta = t.title.toLowerCase().includes(q) || t.tags.toLowerCase().includes(q);
            const matchesContent = t.content.some(c =>
                c.topic.toLowerCase().includes(q) || c.ex.toLowerCase().includes(q)
            );
            const pNum = key === 'paper1' ? 1 : 2;
            return (t.paper === pNum) && (matchesMeta || matchesContent);
        });

        grids[key].innerHTML = filtered.map(t => {
            const mastery = getMastery(t.tags);
            const isMastered = mastery >= 100;

            return `
        <article class="card ${key} scale-in ${isMastered ? 'mastered-card' : ''}" 
                 style="animation-delay: ${filtered.indexOf(t) * 0.05}s" 
                 onclick="toggleStudyCard(this)">
            
            <div class="card-header-visual">
                <span class="badge">Unit ${DATA.topics.indexOf(t) + 1}</span>
                ${isMastered ? '<span class="badge" style="background:var(--success); color:#fff;">Mastered</span>' : ''}
            </div>

            <h3>${t.title}</h3>
            
            <div class="mastery-container">
                <div class="mastery-label">
                    <span>Skill Progress</span>
                    <span>${Math.round(mastery)}%</span>
                </div>
                <div class="mastery-bar">
                    <div class="mastery-fill" style="width: ${mastery}%"></div>
                </div>
            </div>

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
                <div style="font-size: 3rem; margin-bottom: 1rem; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.2));">💡</div>
                <h4 style="margin:0 0 0.5rem 0; color:var(--paper1); font-size:1.5rem;">Key Concept</h4>
                <p style="font-size:1.1rem; color:var(--muted); max-width:80%; margin:0 auto 2rem auto;">${t.content[0].ex}</p>
                <div class="btn primary small">Click to Close</div>
            </div>
        </article>
    `}).join('');
    });
}

function toggleStudyCard(card) {
    if (window.getSelection().toString().length > 0) return;
    card.classList.toggle('active-study');
}

function updateViewMode(mode) {
    if (!document.startViewTransition) {
        performUpdate(mode);
        return;
    }
    document.startViewTransition(() => performUpdate(mode));
}

function performUpdate(mode) {
    const grids = { paper1: document.getElementById('paper1-grid'), paper2: document.getElementById('paper2-grid') };

    document.querySelectorAll('.tab-btn[data-paper]').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.tab-btn[data-paper="${DATA.paper}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    Object.values(grids).forEach(g => g.style.display = 'none');
    document.getElementById(`${DATA.paper}-grid`).style.display = 'grid';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Quiz Engine */
function launchQuiz(paper, count) {
    let basePool = paper === 'paper1' ? fixedQuestions.paper1 : (paper === 'paper2' ? fixedQuestions.paper2 : [...fixedQuestions.paper1, ...fixedQuestions.paper2]);
    let selected = shuffle(basePool).slice(0, Math.min(count, basePool.length));

    // Inject generated questions
    while (selected.length < count) {
        const gk = Object.keys(generators);
        const g = generators[gk[Math.floor(Math.random() * gk.length)]]();
        selected.push({ ...g, auto: true });
    }

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

    const modalContent = document.querySelector('#quiz-session-modal .modal-content');
    modalContent.classList.remove('review-mode');
    document.querySelector('#quiz-session-modal .modal-header').style.display = 'flex';

    let inputHtml = '';
    // Math site usually uses text input, but handle dragdrop if generated
    if (q.type === 'dragdrop') {
        let currentOrder = QUIZ.userAns[QUIZ.idx] ? QUIZ.userAns[QUIZ.idx].split(',') : shuffle([...q.items]);
        if (!QUIZ.userAns[QUIZ.idx]) QUIZ.userAns[QUIZ.idx] = currentOrder.join(',');

        inputHtml = `
            <div class="dd-container">
                <div class="dd-items" id="sortable-list">
                    ${currentOrder.map((item, i) => `
                        <div class="dd-item" draggable="true" data-index="${i}" data-val="${item}">${item}</div>
                    `).join('')}
                </div>
            </div>`;
    } else if (q.type === 'matching') {
        let currentOrder = QUIZ.userAns[QUIZ.idx] ? QUIZ.userAns[QUIZ.idx].split(',') : [...q.items];
        if (!QUIZ.userAns[QUIZ.idx]) QUIZ.userAns[QUIZ.idx] = currentOrder.join(',');

        inputHtml = `
            <div class="matching-grid">
                <div class="match-left">${q.left.map(l => `<div class="static-item">${l}</div>`).join('')}</div>
                <div class="match-right dd-items" id="sortable-list">
                    ${currentOrder.map((item, i) => `<div class="dd-item" draggable="true" data-val="${item}">${item}</div>`).join('')}
                </div>
            </div>`;
    } else {
        inputHtml = `<input type="text" class="q-input" id="ans" placeholder="Enter solution..." value="${QUIZ.userAns[QUIZ.idx]}" autocomplete="off">`;
    }

    container.innerHTML = `
    <div class="q-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--paper1); text-transform: uppercase;">
                ${q.auto ? 'Generated Problem' : 'Standard Problem'}
            </div>
            ${QUIZ.instant ? '<div id="instant-feedback" class="badge">Checking...</div>' : ''}
        </div>
        <div class="q-text">${q.q}</div>
        ${inputHtml}
        
        <div style="display:flex; gap:1rem; margin-top:1rem;">
            <button id="toggle-canvas" class="btn-small" style="color: #000;" onclick="toggleCanvas()">Show Working Area</button>
            ${q.hint ? `<button id="btn-hint" class="btn-small" style="background:#fef3c7; color:#d97706; border:1px solid #fcd34d;" onclick="showHint(this, '${q.hint.replace(/'/g, "\\'")}')">💡 Get Hint</button>` : ''}
        </div>

        <div id="hint-area" style="display:none; margin-top:1rem; padding:1rem; background:#fffbeb; border-left:4px solid #fbbf24; border-radius:8px; color:#92400e; font-size:0.95rem; animation:slide-down 0.3s ease-out;">
            <strong>Hint:</strong> <span id="hint-text"></span>
        </div>

        <div id="canvas-container" style="display:none; margin-top:1rem; border:1px solid #ccc;">
            <canvas id="calc-canvas" width="600" height="300" style="background: #fff; border-radius: 12px; cursor: crosshair; touch-action: none; display:block; width:100%"></canvas>
            <div style="display:flex; justify-content: flex-end; gap:0.5rem; margin-top:0.5rem;">
                <button class="btn-small" onclick="clearCanvas()" style="color:#000">Clear</button>
            </div>
        </div>
    </div>
`;

}

function showHint(btn, text) {
    const area = document.getElementById('hint-area');
    const txt = document.getElementById('hint-text');
    if (area.style.display === 'none') {
        area.style.display = 'block';
        txt.innerText = text;
        btn.innerText = 'Hide Hint';
    } else {
        area.style.display = 'none';
        btn.innerText = '💡 Get Hint';
    }
    // Init Drag/Drop or Input Listeners
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
    const input = document.getElementById('ans');

    let correct = q.a.some(valid => {
        const cv = valid.toString().trim().toLowerCase();
        if (!isNaN(u) && !isNaN(cv)) return Math.abs(parseFloat(u) - parseFloat(cv)) < 0.1;
        return u === cv;
    });

    // Reset animations
    fb.classList.remove('shake', 'pop');
    if (input) input.classList.remove('shake', 'pop');

    if (u.length === 0) {
        fb.innerText = 'Waiting...';
        fb.style.background = 'var(--muted)';
        fb.style.color = '#fff';
        return;
    }

    if (correct) {
        fb.innerText = 'Correct!';
        fb.style.background = 'var(--success)';
        fb.style.color = '#fff';
        if (input) {
            input.classList.add('pop');
            input.style.borderColor = 'var(--success)';
        }
        fb.classList.add('pop');
    } else {
        fb.innerText = 'Check Again';
        fb.style.background = 'var(--error)';
        fb.style.color = '#fff';
        if (input) {
            input.classList.add('shake');
            input.style.borderColor = 'var(--error)';
        }
        fb.classList.add('shake');
    }
}

function initDragSort() {
    // Basic Drag Sort Implementation
    const list = document.getElementById('sortable-list');
    if (!list) return;

    // ... (Simplified Drag Logic if needed, or assume library is not present and use basic swap)
    // Reusing the logic from LS app.js
    let draggedItem = null;
    list.addEventListener('dragstart', (e) => { draggedItem = e.target; setTimeout(() => e.target.classList.add('dragging'), 0); });
    list.addEventListener('dragend', (e) => { e.target.classList.remove('dragging'); updateDragAns(); });
    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientX); // using x for horizontal sometimes?
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) list.appendChild(draggable); else list.insertBefore(draggable, afterElement);
    });
}

function getDragAfterElement(container, y) {
    // Simplified vertical logic
    const draggableElements = [...container.querySelectorAll('.dd-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = event.clientY - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }; else return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/* Sound FX Manager */
const SoundManager = {
    ctx: null,
    init: function () {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    playTone: function (freq, type, duration) {
        if (!this.ctx) this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },
    playSuccess: function () {
        this.playTone(600, 'sine', 0.1);
        setTimeout(() => this.playTone(800, 'sine', 0.2), 100);
    },
    playFail: function () {
        this.playTone(200, 'sawtooth', 0.3);
        setTimeout(() => this.playTone(150, 'sawtooth', 0.3), 150);
    },
    playClick: function () { this.playTone(400, 'triangle', 0.05); }
};

function updateDragAns() {
    const items = [...document.querySelectorAll('.dd-item')];
    const vals = items.map(i => i.dataset.val).join(',');
    QUIZ.userAns[QUIZ.idx] = vals;
    SoundManager.playClick();
}

function gradeQuiz() {
    let score = 0;
    const details = QUIZ.pool.map((q, i) => {
        const u = QUIZ.userAns[i].toString().trim().toLowerCase();
        let correct = false;
        if (q.type === 'dragdrop' || q.type === 'matching') { correct = q.a[0] === u; }
        else {
            correct = q.a.some(valid => {
                const cv = valid.toString().trim().toLowerCase();
                if (!isNaN(u) && !isNaN(cv)) return Math.abs(parseFloat(u) - parseFloat(cv)) < 0.1;
                return u === cv;
            });
        }

        if (correct) {
            score++;
            // Update Stats based on topic tags (simple heuristic)
            if (GAMIFICATION_LOADED) {
                if (q.q.includes('solve') || q.q.includes('x')) GAMIFICATION.updateStats('algebra', 1);
                else if (q.q.includes('angle') || q.q.includes('area')) GAMIFICATION.updateStats('geometry', 1);
                else GAMIFICATION.updateStats('numbers', 1);
            }
        } else {
            if (GAMIFICATION_LOADED) GAMIFICATION.trackMistake(q);
        }
        return { ...q, u, isCorrect: correct };
    });

    const Container = document.getElementById('quiz-content');
    const percent = Math.round((score / QUIZ.pool.length) * 100);

    // Sound FX
    if (percent >= 60) SoundManager.playSuccess();
    else SoundManager.playFail();

    const modalContent = document.querySelector('#quiz-session-modal .modal-content');
    modalContent.classList.add('review-mode');

    // Hide standard header during review for cleaner look
    document.querySelector('#quiz-session-modal .modal-header').style.display = 'none';

    Container.innerHTML = `
    <div style="text-align:center; padding:1rem;">
        <h1 style="margin-bottom:0.5rem; color:#fff; font-size:2.5rem; text-shadow:0 2px 10px rgba(0,0,0,0.3);">Test Review</h1>
        <div style="font-size: 4rem; font-weight: 900; color: #fff; margin-bottom: 0.5rem; text-shadow:0 4px 15px rgba(0,0,0,0.4);">${score} <span style="font-size: 1.5rem; color: rgba(255,255,255,0.7);">/ ${QUIZ.pool.length}</span></div>
        <h2 style="margin-bottom: 2rem; color:#fff; font-weight:400; text-shadow:0 2px 5px rgba(0,0,0,0.3);">${percent}% Proficiency</h2>
        
        <div class="review-list">
            ${details.map((d, i) => `
                <div style="padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: ${d.isCorrect ? '#4ade80' : '#f87171'}">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <strong style="font-size:1.1rem; color:#fff;">Q${i + 1}: ${d.q}</strong>
                        <span style="font-size:1.2rem;">${d.isCorrect ? '✓' : '✗'}</span>
                    </div>
                    ${!d.isCorrect ? `
                    <div style="margin:0.5rem 0; padding:0.8rem; background:rgba(0,0,0,0.3); border-radius:8px; color:#e2e8f0; font-size:0.95rem; border-left:4px solid var(--accent);">
                        <strong style="color:var(--accent);">💡 Insight:</strong> ${d.ex || 'Review the core concepts for this topic.'}
                    </div>` : ''}
                    <small style="display:block; margin-top:0.5rem; color: rgba(255,255,255,0.6)">Answer: ${d.a[0]} | You: ${d.u || 'Left Blank'}</small>
                </div>
            `).join('')}
        </div>
    </div>
`;
    if (percent >= 80) triggerConfetti(document.body);
    if (GAMIFICATION_LOADED) {
        GAMIFICATION.addXP(score * 10);
        GAMIFICATION.updateQuestProgress('q1', 1); // Complete 1 Quiz
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

/* Blitz Mode Logic (Math Edition) */
let BLITZ = { score: 0, active: false, words: [], timer: null, level: 1, nextSpawn: 0 };

function launchBlitzSetup() {
    document.getElementById('blitz-modal').classList.add('active');
    document.getElementById('blitz-score').innerText = '0';
    document.getElementById('blitz-start-overlay').style.display = 'flex';
    document.getElementById('blitz-game-area').innerHTML = '';
}

function startBlitzGame() {
    BLITZ = { score: 0, active: true, words: [], timer: null, level: 1, nextSpawn: 0 };
    document.getElementById('blitz-start-overlay').style.display = 'none';
    document.getElementById('blitz-score').innerText = '0';
    renderBlitzButtons();
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
    // Guard clause if modal closed
    if (!area) return;
    const height = area.clientHeight;

    BLITZ.nextSpawn -= dt;
    if (BLITZ.nextSpawn <= 0) {
        spawnWord();
        BLITZ.nextSpawn = 2000 - (BLITZ.level * 100);
    }

    BLITZ.words.forEach((w, i) => {
        w.y += (0.1 + (BLITZ.level * 0.02)) * dt;
        w.el.style.top = w.y + 'px';
        if (w.y > height - 40) {
            w.el.remove();
            BLITZ.words.splice(i, 1);
            if (BLITZ.score > 0) BLITZ.score = Math.max(0, BLITZ.score - 5);
            document.getElementById('blitz-score').innerText = BLITZ.score;
        }
    });

    if (GAMIFICATION_LOADED && BLITZ.score >= 50) GAMIFICATION.updateQuestProgress('q3', 50);
}

/* Updated Blitz Data for Math */
const blitzData = [
    { w: "Integer", t: "Number" },
    { w: "Prime", t: "Number" },
    { w: "Factor", t: "Number" },
    { w: "Triangle", t: "Geometry" },
    { w: "Square", t: "Geometry" },
    { w: "Variable", t: "Algebra" },
    { w: "Equation", t: "Algebra" },
    { w: "Area", t: "Measurement" },
    { w: "Volume", t: "Measurement" },
    { w: "Ratio", t: "Number" },
    { w: "Angle", t: "Geometry" },
    { w: "Term", t: "Algebra" },
    { w: "Liter", t: "Measurement" },
    { w: "Degree", t: "Geometry" },
    { w: "Formula", t: "Algebra" }
];

function spawnWord() {
    const item = blitzData[Math.floor(Math.random() * blitzData.length)];
    const el = document.createElement('div');
    el.className = 'falling-word';
    el.innerText = item.w;
    el.dataset.type = item.t;
    el.style.left = (Math.random() * 80 + 10) + '%';
    el.style.top = '-40px';
    document.getElementById('blitz-game-area').appendChild(el);
    BLITZ.words.push({ el: el, y: -40, type: item.t });
}

function renderBlitzButtons() {
    const types = ['Number', 'Algebra', 'Geometry', 'Measurement'];
    const container = document.getElementById('blitz-controls');
    container.innerHTML = types.map(t => `<button class="blitz-btn" onclick="checkBlitz('${t}')">${t}</button>`).join('');
}

function checkBlitz(type) {
    if (BLITZ.words.length === 0) return;
    const target = BLITZ.words.sort((a, b) => b.y - a.y)[0];

    if (target.type === type) {
        target.el.remove();
        BLITZ.words = BLITZ.words.filter(w => w !== target);
        BLITZ.score += 10;
        document.getElementById('blitz-score').innerText = BLITZ.score;
        if (GAMIFICATION_LOADED) GAMIFICATION.addXP(2);
        if (BLITZ.score % 50 === 0) BLITZ.level++;
    } else {
        BLITZ.score -= 5;
        document.getElementById('blitz-score').innerText = BLITZ.score;
    }
}

function stopBlitz() {
    BLITZ.active = false;
    document.getElementById('blitz-modal').classList.remove('active');
}


function openDiagram(btn, title) {
    // Basic placeholder modal logic for diagrams
    // Since we don't have actual images in data yet, we generate a visual placeholder
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.style.zIndex = '2000';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:500px; text-align:center;">
             <div class="modal-header">
                <h3>${title} - Use Canvas to Draw</h3>
                <button class="btn ghost close-modal">✕</button>
            </div>
            <div class="modal-body">
                <div style="background:#f8fafc; padding:2rem; border-radius:12px; border:2px dashed var(--panel-border);">
                     <div style="font-size:3rem; margin-bottom:1rem;">📐</div>
                     <p>Visual diagrams for this topic are available in the full textbook.</p>
                     <p style="font-size:0.9rem; color:var(--muted)">Use the "Working Area" to sketch this concept yourself!</p>
                </div>
            </div>
             <div class="modal-footer">
                <button class="btn primary close-modal">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Close logic
    const close = () => { modal.remove(); };
    modal.querySelectorAll('.close-modal').forEach(b => b.onclick = close);
    modal.onclick = (e) => { if (e.target === modal) close(); };
}

/* Initialization */
function init() {
    render();

    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            DATA.filter = e.target.value;
            render();
        });
    }

    // Navigation (Paper 1 / Paper 2)
    document.querySelectorAll('.tab-btn[data-paper]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(5);
            DATA.paper = btn.dataset.paper;
            updateViewMode('single');
        });
    });

    // Modals
    const quizBtn = document.getElementById('btn-quiz');
    if (quizBtn) quizBtn.addEventListener('click', () => document.getElementById('quiz-config-modal').classList.add('active'));

    document.querySelectorAll('.close-modal').forEach(b => b.addEventListener('click', () => b.closest('.modal-overlay').classList.remove('active')));

    // Quiz Start
    const startBtn = document.getElementById('start-now');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const paper = document.querySelector('#paper-select .active').dataset.val;
            const count = parseInt(document.getElementById('config-count').value);
            launchQuiz(paper, count);
        });
    }

    // Quiz Config Buttons
    document.querySelectorAll('#paper-select .option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#paper-select .option-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Quiz Nav
    const qPrev = document.getElementById('q-prev');
    const qNext = document.getElementById('q-next');
    const qSubmit = document.getElementById('q-submit');
    const qDone = document.getElementById('q-done');

    if (qPrev) qPrev.addEventListener('click', () => { if (QUIZ.idx > 0) { QUIZ.idx--; renderQ(); } });
    if (qNext) qNext.addEventListener('click', () => { if (QUIZ.idx < QUIZ.pool.length - 1) { QUIZ.idx++; renderQ(); } });
    if (qSubmit) qSubmit.addEventListener('click', gradeQuiz);
    if (qDone) qDone.addEventListener('click', () => document.getElementById('quiz-session-modal').classList.remove('active'));

    // Mouse Glow
    window.addEventListener('mousemove', (e) => {
        const glow = document.getElementById('mouse-glow');
        if (glow) {
            glow.style.setProperty('--mx', e.clientX + 'px');
            glow.style.setProperty('--my', e.clientY + 'px');
        }
    });

    if (GAMIFICATION_LOADED) {
        const mCount = document.getElementById('mistakes-count');
        if (mCount) mCount.innerText = GAMIFICATION.mistakes.length;
    }
}

/* Dashboard Logic */
function openDashboard() {
    document.getElementById('dashboard-modal').classList.add('active');

    // Apply Glass Theme
    document.querySelector('#dashboard-modal .modal-content').classList.add('review-mode');
    document.querySelector('#dashboard-modal .modal-header').style.display = 'none';

    // Update Profile Header
    if (GAMIFICATION_LOADED) {
        const lvl = GAMIFICATION.level || 1;
        const xp = GAMIFICATION.xp || 0;
        document.getElementById('dash-level').innerText = `Level ${lvl} Scholar`;
        document.getElementById('dash-xp').innerText = xp;
    }

    renderStats();
    renderQuests();
}

function renderStats() {
    const container = document.getElementById('stats-container');
    const max = 50;
    const stats = GAMIFICATION.stats;
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

    container.innerHTML = Object.keys(stats).map(key => {
        const val = stats[key];
        const pct = Math.min(100, (val / max) * 100);
        return `
            <div style="margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.2rem; font-size:0.9rem; font-weight:600; color:#e2e8f0">
                    <span>${cap(key)}</span>
                    <span>${val} Correct</span>
                </div>
                <div style="height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
                    <div style="height:100%; width:${pct}%; background:var(--paper1); border-radius:4px;"></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderQuests() {
    const list = document.getElementById('quest-list');
    const tasks = GAMIFICATION.dailyQuests.tasks;
    const canClaimAny = tasks.some(t => t.done && !t.claimed);

    let html = '';

    if (canClaimAny) {
        html += `<button onclick="claimAll()" style="width:100%; margin-bottom:1rem; padding:0.8rem; border-radius:12px; border:none; background:linear-gradient(135deg, #fbbf24, #d97706); color:#fff; font-weight:700; cursor:pointer; box-shadow:0 4px 15px rgba(217,119,6,0.4);">🎉 Claim All Rewards</button>`;
    }

    html += tasks.map(t => {
        let actionBtn = '';
        if (t.done && !t.claimed) {
            actionBtn = `<button onclick="claimQuest('${t.id}')" style="padding:0.4rem 0.8rem; border-radius:8px; border:none; background:var(--success); color:#fff; font-weight:700; cursor:pointer;">Claim</button>`;
        } else if (t.claimed) {
            actionBtn = `<span style="font-size:0.8rem; color:rgba(255,255,255,0.6); font-weight:700;">Claimed</span>`;
        }

        return `
        <li style="display:flex; align-items:center; gap:1rem; padding:0.8rem; margin-bottom:0.8rem; background:rgba(255,255,255,0.1); border-radius:12px; border:1px solid ${t.done ? '#4ade80' : 'rgba(255,255,255,0.2)'}; opacity:${t.claimed ? 0.6 : 1}">
            <div style="width:24px; height:24px; border-radius:50%; border:2px solid ${t.done ? '#4ade80' : 'rgba(255,255,255,0.3)'}; display:flex; align-items:center; justify-content:center; color:#4ade80; font-weight:800; font-size:0.8rem;">
                ${t.done ? '✓' : ''}
            </div>
            <div style="flex:1">
                <div style="font-weight:700; color:#fff; font-size:0.95rem;">${t.text}</div>
                <div style="font-size:0.8rem; color:rgba(255,255,255,0.6)">${Math.min(t.current, t.target)} / ${t.target}</div>
            </div>
            <div style="text-align:right;">
                <div style="font-weight:800; color:#fbbf24; font-size:0.9rem; margin-bottom:0.2rem;">+${t.xp} XP</div>
                ${actionBtn}
            </div>
        </li>
    `}).join('');

    list.innerHTML = html;
}

function claimQuest(id) {
    const task = GAMIFICATION.dailyQuests.tasks.find(t => t.id === id);
    if (task && task.done && !task.claimed) {
        task.claimed = true;
        GAMIFICATION.addXP(task.xp);
        GAMIFICATION.save();
        triggerConfetti(document.body);
        SoundManager.playSuccess();
        GAMIFICATION.showToast(`Claimed: ${task.xp} XP!`);
        renderQuests();
        openDashboard(); // Refresh UI
    }
}

function claimAll() {
    let totalXp = 0;
    let count = 0;
    GAMIFICATION.dailyQuests.tasks.forEach(t => {
        if (t.done && !t.claimed) {
            t.claimed = true;
            totalXp += t.xp;
            count++;
        }
    });

    if (count > 0) {
        GAMIFICATION.addXP(totalXp);
        GAMIFICATION.save();
        triggerConfetti(document.body);
        SoundManager.playSuccess();
        GAMIFICATION.showToast(`Claimed ${count} Quests: +${totalXp} XP!`);
        renderQuests();
        openDashboard();
    }
}

/* Update Quest Logic to NOT auto-claim */
GAMIFICATION.updateQuestProgress = function (id, amount) {
    const task = this.dailyQuests.tasks.find(t => t.id === id);
    if (task && !task.done) {
        task.current += amount;
        if (task.current >= task.target) {
            task.done = true;
            this.save();

            // Show Notification with Action
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.style.cursor = 'pointer';
            toast.innerHTML = `<div>🏆 Quest Complete: ${task.text}</div><small>Click to Claim</small>`;
            toast.onclick = () => {
                openDashboard();
                toast.remove();
            };
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 4000);

            SoundManager.playSuccess();
        } else {
            this.save();
        }
    }
};

function launchMistakesQuiz() {
    if (GAMIFICATION.mistakes.length === 0) {
        alert("Great job! You have no mistakes to review.");
        return;
    }

    // Create a quiz from mistakes
    // Deep copy to avoid mutating the store directly during quiz
    const mistakePool = JSON.parse(JSON.stringify(GAMIFICATION.mistakes));

    // Setup Quiz Global
    QUIZ = {
        pool: shuffle(mistakePool),
        userAns: Array(mistakePool.length).fill(''),
        idx: 0,
        instant: true,
        isMistakeReview: true // Flag to know we are in review mode
    };

    document.getElementById('quiz-config-modal').classList.remove('active');
    document.getElementById('quiz-session-modal').classList.add('active');
    renderQ();
}

window.addEventListener('DOMContentLoaded', init);
