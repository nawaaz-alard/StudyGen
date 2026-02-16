/* Timer Logic */
let TIMER = { timeLeft: 1500, interval: null, running: false, mode: 'study' };

function toggleTimer() {
    if (TIMER.running) {
        clearInterval(TIMER.interval);
        document.getElementById('timer-start').innerText = 'Start';
    } else {
        TIMER.interval = setInterval(updateTimer, 1000);
        document.getElementById('timer-start').innerText = 'Pause';
    }
    TIMER.running = !TIMER.running;
}

function updateTimer() {
    if (TIMER.timeLeft <= 0) {
        clearInterval(TIMER.interval);
        showNotification("Focus session complete! Take a break.");
        resetTimer();
        return;
    }
    TIMER.timeLeft--;
    const m = Math.floor(TIMER.timeLeft / 60);
    const s = TIMER.timeLeft % 60;
    document.getElementById('timer-display').innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    const dash = 502.6; // 2 * pi * r (80)
    const offset = dash - (TIMER.timeLeft / 1500) * dash;
    document.getElementById('timer-progress').style.strokeDashoffset = offset;
}

function resetTimer() {
    clearInterval(TIMER.interval);
    TIMER.running = false;
    TIMER.timeLeft = 1500;
    document.getElementById('timer-display').innerText = '25:00';
    document.getElementById('timer-start').innerText = 'Start';
    document.getElementById('timer-progress').style.strokeDashoffset = 0;
}

/* Notification Logic */
function showNotification(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
    <span>${msg}</span>
    <div class="toast-close" onclick="this.parentElement.remove()">✕</div>
`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 10000);
}

/* To-Do Logic */
let TODOS = JSON.parse(localStorage.getItem('ls_site_todos') || '[]');

function renderTodos() {
    const list = document.getElementById('todo-list');
    list.innerHTML = TODOS.map((t, i) => `
    <li class="todo-item ${t.done ? 'completed' : ''}">
        <div class="todo-check ${t.done ? 'active' : ''}" onclick="toggleTodo(${i})"></div>
        <span class="todo-text">${t.text}</span>
        <span class="todo-del" onclick="delTodo(${i})">✕</span>
    </li>
`).join('');
    localStorage.setItem('ls_site_todos', JSON.stringify(TODOS));
}

function addTodo() {
    const input = document.getElementById('todo-input');
    if (!input.value) return;
    TODOS.push({ text: input.value, done: false });
    input.value = '';
    renderTodos();
}

window.toggleTodo = (i) => {
    TODOS[i].done = !TODOS[i].done;
    if (TODOS[i].done) triggerConfetti(event.target);
    renderTodos();
};

window.delTodo = (i) => { TODOS.splice(i, 1); renderTodos(); };

// Confetti
function triggerConfetti(el) {
    const rect = el.getBoundingClientRect();
    for (let i = 0; i < 30; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        const colors = ['#10b981', '#84cc16', '#06b6d4', '#facc15', '#ffffff'];
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.left = (rect.left + rect.width / 2) + 'px';
        c.style.top = (rect.top + rect.height / 2) + 'px';
        c.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
        c.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 1000);
    }
}
