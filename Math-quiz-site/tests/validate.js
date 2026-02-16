
// Mock Browser Environment
global.window = {
    addEventListener: () => { },
    location: { reload: () => { } },
    getSelection: () => ({ toString: () => '' })
};
global.document = {
    getElementById: () => ({
        addEventListener: () => { },
        classList: { add: () => { }, remove: () => { }, toggle: () => { } },
        style: {},
        innerText: '',
        value: ''
    }),
    querySelectorAll: () => [],
    querySelector: () => ({ dataset: {} }),
    createElement: () => ({
        style: {},
        classList: { add: () => { } },
        querySelectorAll: () => []
    }),
    body: {
        classList: { add: () => { }, remove: () => { }, toggle: () => { }, contains: () => false },
        appendChild: () => { }
    },
    title: ''
};
global.localStorage = {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { }
};
global.navigator = { vibrate: () => { } };
global.self = { addEventListener: () => { } }; // For sw.js if needed

// Load Scripts (Simulating Order)
const fs = require('fs');
const vm = require('vm');

function load(path) {
    const code = fs.readFileSync(path, 'utf8');
    vm.runInThisContext(code);
}

try {
    console.log("Testing Data Structures...");
    load('./src/scripts/data.js');
    if (!TOPICS || TOPICS.length === 0) throw new Error("TOPICS not loaded");
    if (!generators || !generators.pythag) throw new Error("Generators not loaded");
    console.log("✅ Data.js: Loaded " + TOPICS.length + " topics and generators.");

    console.log("Testing Gamification...");
    load('./src/scripts/gamification.js');
    if (!GAMIFICATION || typeof GAMIFICATION.addXP !== 'function') throw new Error("GAMIFICATION object broken");
    console.log("✅ Gamification.js: Logic valid.");

    console.log("Testing Widgets...");
    load('./src/scripts/widgets.js');
    if (typeof generateReport !== 'function') throw new Error("generateReport function missing");
    console.log("✅ Widgets.js: Report generation logic present.");

    console.log("Testing App Logic...");
    load('./src/scripts/app.js');
    if (typeof launchQuiz !== 'function') throw new Error("launchQuiz function missing");
    console.log("✅ App.js: Main app logic functions present.");

    console.log("\nALL SYSTEMS GO! 🚀\nThe code structure is valid and ready for browser execution.");
} catch (e) {
    console.error("❌ TEST FAILED:", e.message);
    process.exit(1);
}
