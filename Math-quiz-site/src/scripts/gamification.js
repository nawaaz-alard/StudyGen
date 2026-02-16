/* Gamification System */
const GAMIFICATION = {
    xp: 0,
    level: 1,
    streak: 0,
    coins: 0,
    mistakes: [],
    stats: {
        algebra: 0,
        geometry: 0,
        numbers: 0,
        measurement: 0
    },
    dailyQuests: {
        lastdate: '',
        tasks: [
            { id: 'q1', text: 'Complete 1 Quiz', target: 1, current: 0, done: false, xp: 50 },
            { id: 'q2', text: 'Earn 100 XP', target: 100, current: 0, done: false, xp: 50 }
        ]
    },

    init() {
        this.load();
        this.checkDailyReset();
        this.updateUI();
    },

    addXP(amount) {
        this.xp += amount;
        this.updateQuestProgress('q2', amount);
        this.checkLevelUp();
        this.save();
        this.updateUI();
        this.showToast(`+${amount} XP`);
        this.vibrate(10);
    },

    trackMistake(question) {
        // Prevent duplicates
        if (!this.mistakes.some(m => m.q === question.q)) {
            this.mistakes.push(question);
            this.save();
        }
    },

    updateStats(category, itemsCorrect) {
        if (!this.stats[category]) this.stats[category] = 0;
        this.stats[category] += itemsCorrect;
        this.save();
    },

    checkDailyReset() {
        const today = new Date().toLocaleDateString();
        if (this.dailyQuests.lastdate !== today) {
            this.dailyQuests.lastdate = today;
            this.dailyQuests.tasks = [
                { id: 'q1', text: 'Complete 1 Quiz', target: 1, current: 0, done: false, xp: 50 },
                { id: 'q2', text: 'Earn 100 XP', target: 100, current: 0, done: false, xp: 50 },
                { id: 'q3', text: 'Blitz Score > 50', target: 50, current: 0, done: false, xp: 100 }
            ];
            this.save();
            this.showToast("New Daily Quests Available!");
        }
    },

    updateQuestProgress(id, amount) {
        const task = this.dailyQuests.tasks.find(t => t.id === id);
        if (task && !task.done) {
            task.current += amount;
            if (task.current >= task.target) {
                task.done = true;
                this.addXP(task.xp);
                this.showToast(`Quest Complete: ${task.text}`);
                triggerConfetti(document.body);
            }
            this.save();
        }
    },

    checkLevelUp() {
        const nextLevel = this.level * 100;
        if (this.xp >= nextLevel) {
            this.level++;
            this.playSound('levelup');
            this.showToast(`Level Up! You are now Level ${this.level} 🌟`);
            triggerConfetti(document.body);
        }
    },

    buyItem(id, cost, type) {
        if (this.xp >= cost) {
            if (this.unlocks[type === 'badge' ? 'badges' : 'themes'].includes(id)) {
                this.showToast("You already own this!");
                return;
            }

            this.xp -= cost;
            if (type === 'theme') this.unlocks.themes.push(id);
            if (type === 'badge') this.unlocks.badges.push(id);

            this.save();
            this.updateUI();
            this.showToast("Item Unlocked!");
            this.applyTheme(id);
        } else {
            this.showToast("Not enough XP!");
            this.vibrate([50, 50, 50]);
        }
    },

    updateShopUI() {
        document.getElementById('shop-balance').innerText = this.xp;

        // Update button states
        ['theme-neon', 'theme-vintage'].forEach(id => {
            const btn = document.querySelector(`#item-${id} button`);
            if (btn && this.unlocks.themes.includes(id)) {
                btn.innerText = "Equipped";
                btn.disabled = true;
                btn.style.opacity = 0.5;
            }
        });
    },

    applyTheme(id) {
        document.body.className = ''; // reset
        if (id === 'theme-neon') document.body.classList.add('theme-neon');
        if (id === 'theme-vintage') document.body.classList.add('theme-vintage');
    },

    updateUI() {
        // Safe check for elements
        const xpEl = document.getElementById('user-xp');
        const lvlEl = document.getElementById('user-level');
        const bar = document.getElementById('xp-bar-fill');

        if (xpEl) xpEl.innerText = `${this.xp} / ${this.level * 100} XP`;
        if (lvlEl) lvlEl.innerText = `Lvl ${this.level}`;

        const percent = Math.min(100, (this.xp / (this.level * 100)) * 100);
        if (bar) bar.style.width = `${percent}%`;
    },

    toggleFocus() {
        document.body.classList.toggle('focus-mode');
        const btn = document.getElementById('btn-focus');
        if (document.body.classList.contains('focus-mode')) {
            btn.classList.add('active');
            this.showToast("Focus Mode On 🌙");
        } else {
            btn.classList.remove('active');
            this.showToast("Focus Mode Off ☀️");
        }
    },

    resetProgress() {
        if (confirm("Are you sure you want to reset all progress?")) {
            localStorage.removeItem('math_explorer_data');
            location.reload();
        }
    },

    save() {
        const data = {
            xp: this.xp,
            level: this.level,
            unlocks: this.unlocks,
            stats: this.stats,
            mistakes: this.mistakes,
            dailyQuests: this.dailyQuests
        };
        localStorage.setItem('math_explorer_data', JSON.stringify(data));
    },

    load() {
        const saved = localStorage.getItem('math_explorer_data');
        if (saved) {
            const data = JSON.parse(saved);
            this.xp = data.xp || 0;
            this.level = data.level || 1;
            this.unlocks = data.unlocks || { themes: ['default'], badges: [] };
            this.stats = data.stats || { algebra: 0, geometry: 0, numbers: 0, measurement: 0 };
            this.mistakes = data.mistakes || [];
            this.dailyQuests = data.dailyQuests || { lastdate: '', tasks: [] };
        }
    },

    showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span>${msg}</span>
            <div class="toast-close" onclick="this.parentElement.remove()">✕</div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    vibrate(pattern) {
        if (navigator.vibrate) navigator.vibrate(pattern);
    },

    playSound(type) {
        // Placeholder for sound effects
    }
};

// Auto-init on load
window.addEventListener('blur', () => {
    document.title = "Come back to Math! 🥺";
});
window.addEventListener('focus', () => {
    document.title = "Grade 8 Mathematics — Vibrant Study Hub";
});

window.addEventListener('DOMContentLoaded', () => {
    GAMIFICATION.init();
});
