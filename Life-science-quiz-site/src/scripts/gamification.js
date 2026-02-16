const GAMIFICATION = {
    xp: 0,
    level: 1,
    streak: 0,
    inventory: [],
    activeTheme: 'default',
    focusMode: false,

    init() {
        const saved = JSON.parse(localStorage.getItem('ls_gamification') || '{"xp":0, "level":1, "streak":0, "inventory": [], "activeTheme": "default", "focusMode": false}');
        this.xp = saved.xp;
        this.level = saved.level;
        this.streak = saved.streak;
        this.inventory = saved.inventory || [];
        this.activeTheme = saved.activeTheme || 'default';
        this.focusMode = !!saved.focusMode;

        this.updateUI();
        this.updateFocusIcon();
        this.applyTheme(this.activeTheme);
        if (this.focusMode) document.body.classList.add('focus-mode');
    },

    save() {
        localStorage.setItem('ls_gamification', JSON.stringify({
            xp: this.xp,
            level: this.level,
            streak: this.streak,
            inventory: this.inventory,
            activeTheme: this.activeTheme,
            focusMode: this.focusMode
        }));
    },

    toggleFocus() {
        this.focusMode = !this.focusMode;
        if (this.focusMode) {
            document.body.classList.add('focus-mode');
            showNotification("Focus Mode On");
        } else {
            document.body.classList.remove('focus-mode');
            showNotification("Focus Mode Off");
        }
        this.updateFocusIcon();
        this.save();
    },

    updateFocusIcon() {
        const btn = document.getElementById('btn-focus');
        if (btn) {
            if (this.focusMode) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    },

    addXP(amount) {
        this.xp += amount;
        this.checkLevelUp();
        this.save();
        this.updateUI();
        this.animateXP(amount);
        this.updateShopUI(); // update balance if shop is open relative to change
        this.vibrate([10, 30, 20]); // Satisfying "ca-ching" vibration
    },

    checkLevelUp() {
        const nextLevel = Math.floor(this.xp / 100) + 1;
        if (nextLevel > this.level) {
            this.level = nextLevel;
            showNotification(`🎉 Level Up! You are now Level ${this.level}`);
            triggerConfetti(document.body);
        }
    },

    updateUI() {
        const elLevel = document.getElementById('user-level');
        const elXP = document.getElementById('user-xp');
        const elBar = document.getElementById('xp-bar-fill');
        const elShopBal = document.getElementById('shop-balance');

        if (elLevel) elLevel.innerText = `Lvl ${this.level}`;
        if (elXP) elXP.innerText = `${this.xp % 100} / 100 XP`;
        if (elBar) elBar.style.width = `${this.xp % 100}%`;
        if (elShopBal) elShopBal.innerText = this.xp;
    },

    // SHOP LOGIC
    buyItem(itemId, cost, type) {
        if (this.inventory.includes(itemId)) {
            // Already owned, just equip
            if (type === 'theme') {
                this.activeTheme = itemId;
                this.applyTheme(itemId);
                showNotification("Theme applied!");
            }
            this.save();
            this.updateShopUI();
            return;
        }

        if (this.xp >= cost) {
            this.xp -= cost;
            this.inventory.push(itemId);

            if (type === 'theme') {
                this.activeTheme = itemId;
                this.applyTheme(itemId);
            }
            if (type === 'badge') {
                // Just add to inventory for now, could show in profile later
                showNotification("Badge Unlocked!");
            }

            this.save();
            this.updateUI();
            this.updateShopUI();
            showNotification("Purchase Successful!");
        } else {
            showNotification("Not enough XP!");
        }
    },

    updateShopUI() {
        const balance = document.getElementById('shop-balance');
        if (balance) balance.innerText = this.xp;

        // Update buttons state
        const items = ['theme-neon', 'theme-vintage', 'badge-micro'];
        items.forEach(id => {
            const btn = document.querySelector(`#item-${id} button`);
            if (!btn) return;

            if (this.inventory.includes(id)) {
                if (id === this.activeTheme) {
                    btn.innerText = "Active";
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                } else if (id.startsWith('theme')) {
                    btn.innerText = "Equip";
                    btn.disabled = false;
                    btn.style.opacity = '1';
                } else {
                    btn.innerText = "Owned";
                    btn.disabled = true;
                }
            } else {
                btn.innerText = "Buy";
                btn.disabled = false;
            }
        });
    },

    applyTheme(themeId) {
        document.documentElement.className = ''; // reset
        if (themeId !== 'default') {
            document.documentElement.classList.add(themeId);
        }
    },

    resetProgress() {
        if (confirm("Are you sure you want to reset your Level and XP? This cannot be undone.")) {
            this.xp = 0;
            this.level = 1;
            this.streak = 0;
            this.save();
            this.updateUI();
            alert("Progress reset!");
        }
    },

    playSound(type) {
        // Sound removed
    },

    animateXP(amount) {
        // Simple floating text logic could go here
    },

    vibrate(pattern = 10) {
        // Top-Spec Feature: Haptic Feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => GAMIFICATION.init());
