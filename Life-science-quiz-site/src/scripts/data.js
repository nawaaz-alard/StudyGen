/* Life Science Data Structure */
/* Life Science Data Structure */
const TOPICS = [
    {
        paper: 1, title: 'Photosynthesis', tags: 'plants sunlight glucose oxygen carbon dioxide chloroplasts',
        icon: '<svg viewBox="0 0 24 24" fill="none" class="t-icon"><path d="M12 22l-4-9 1.5-3.5L12 2l2.5 7.5L16 13l-4 9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22v-9" stroke="currentColor" stroke-width="2"/><path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="2"/></svg>',
        diagram: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
            <!-- Sky/Sun -->
            <circle cx="50" cy="50" r="30" fill="#facc15" />
            <path d="M50 80 L50 100 M80 50 L100 50 M29 71 L15 85" stroke="#facc15" stroke-width="3" />
            <text id="lbl-sun" class="diagram-label" x="90" y="40" font-family="sans-serif" font-size="14" fill="#ca8a04">Sunlight (Energy)</text>
            
            <!-- Plant -->
            <path d="M300 350 L300 200" stroke="#16a34a" stroke-width="8" />
            <path d="M300 250 Q350 200 380 220 T420 200" fill="none" stroke="#16a34a" stroke-width="4" />
            <ellipse cx="380" cy="220" rx="40" ry="20" fill="#4ade80" />
            
            <path d="M300 300 Q250 250 220 270 T180 250" fill="none" stroke="#16a34a" stroke-width="4" />
            <ellipse cx="220" cy="270" rx="40" ry="20" fill="#4ade80" />

            <!-- Roots -->
            <path d="M300 350 L280 380 M300 350 L320 380 M300 350 L300 390" stroke="#854d0e" stroke-width="3" />
            
            <!-- Inputs -->
            <text id="lbl-co2" class="diagram-label" x="60" y="150" font-family="sans-serif" font-size="14" fill="#0f766e">CO₂ (Carbon Dioxide)</text>
            <path d="M100 160 Q150 180 200 260" fill="none" stroke="#0f766e" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrow)" />
            
            <text id="lbl-water" class="diagram-label" x="250" y="380" font-family="sans-serif" font-size="14" fill="#3b82f6">H₂O (Water)</text>
            
            <!-- Outputs -->
            <text id="lbl-o2" class="diagram-label" x="450" y="150" font-family="sans-serif" font-size="14" fill="#dc2626">O₂ (Oxygen)</text>
            <path d="M380 220 Q420 180 440 160" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,5" />
            
            <text id="lbl-glucose" class="diagram-label" x="350" y="320" font-family="sans-serif" font-size="14" fill="#a16207">Glucose (Sugar)</text>

            <!-- Definitions -->
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="#0f766e" />
                </marker>
            </defs>
        </svg>`,
        gameData: {
            targets: [
                { id: 'lbl-sun', x: 90, y: 25, label: 'Sunlight' },
                { id: 'lbl-co2', x: 60, y: 135, label: 'CO₂' },
                { id: 'lbl-water', x: 250, y: 365, label: 'Water' },
                { id: 'lbl-o2', x: 450, y: 135, label: 'Oxygen' },
                { id: 'lbl-glucose', x: 350, y: 305, label: 'Glucose' }
            ]
        },
        content: [
            { topic: 'Process of Photosynthesis', ex: 'CO₂ + H₂O + Sun → Glucose + O₂' },
            { topic: 'Requirements', ex: 'Chlorophyl, Sunlight, Water' },
            { topic: 'Products', ex: 'Glucose (Food) and Oxygen' }
        ]
    },
    {
        paper: 1, title: 'Respiration', tags: 'cellular energy mitochondria breathing aerobic anaerobic',
        icon: '<svg viewBox="0 0 24 24" fill="none" class="t-icon"><path d="M12 2a5 5 0 0 1 5 5v10a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z" stroke="currentColor" stroke-width="2"/><path d="M8 12h8" stroke="currentColor" stroke-width="2"/><path d="M12 12v6" stroke="currentColor" stroke-width="2"/></svg>',
        content: [
            { topic: 'Cellular Respiration', ex: 'Glucose + O₂ → Energy + CO₂' },
            { topic: 'Gas Exchange', ex: 'O₂ in, CO₂ out via lungs' },
            { topic: 'Mitochondria Role', ex: 'Powerhouse of the cell' }
        ]
    },
    {
        paper: 1, title: 'Interactions', tags: 'ecology ecosystem biotic abiotic symbiosis',
        icon: '<svg viewBox="0 0 24 24" fill="none" class="t-icon"><circle cx="8" cy="8" r="4" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="16" r="4" stroke="currentColor" stroke-width="2"/><path d="M10.8 10.8l2.4 2.4" stroke="currentColor" stroke-width="2"/></svg>',
        content: [
            { topic: 'Ecosystem Components', ex: 'Biotic (Living) vs Abiotic' },
            { topic: 'Feeding Relationships', ex: 'Producers, Consumers' },
            { topic: 'Symbiosis', ex: 'Mutualism, Commensalism' }
        ]
    },
    {
        paper: 1, title: 'Food Webs', tags: 'chains trophic levels predators prey decomposers',
        icon: '<svg viewBox="0 0 24 24" fill="none" class="t-icon"><path d="M4 12h16M16 12l-4-4M16 12l-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        content: [
            { topic: 'Food Chains', ex: 'Grass → Locust → Bird' },
            { topic: 'Trophic Levels', ex: 'Primary, Secondary Consumer' },
            { topic: 'Decomposers', ex: 'Bacteria, Fungi recycle nutrients' }
        ]
    },
    {
        paper: 2, title: 'Microorganisms', tags: 'bacteria virus fungi protozoa disease',
        icon: '<svg viewBox="0 0 24 24" fill="none" class="t-icon"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M8 12a4 4 0 0 1 8 0M9 9h.01M15 9h.01M10 15h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        content: [
            { topic: 'Types of Microbes', ex: 'Viruses, Bacteria, Fungi' },
            { topic: 'Harmful Microorganisms', ex: 'Pathogens cause disease' },
            { topic: 'Useful Microorganisms', ex: 'Yeast for bread, Bacteria for yoghurt' }
        ]
    },
    {
        paper: 2, title: 'Balance in Ecosystems', tags: 'carrying capacity adaptation conservation threat',
        icon: '<svg viewBox="0 0 24 24" fill="none" class="t-icon"><path d="M3 21h18M5 21l3-10 6 5 4-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        content: [
            { topic: 'Human Impact', ex: 'Pollution, Poaching' },
            { topic: 'Adaptations', ex: 'Camouflage, Mimicry' },
            { topic: 'Conservation', ex: 'Protecting biodiversity' }
        ]
    },
    {
        paper: 2, title: 'Visibility of Light', tags: 'spectrum refraction absorption reflection opaque',
        icon: '<svg viewBox="0 0 24 24" fill="none" class="t-icon"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/></svg>',
        content: [
            { topic: 'Visible Spectrum', ex: 'ROYGBIV Colors' },
            { topic: 'Light Properties', ex: 'Reflection and Refraction' },
            { topic: 'Materials', ex: 'Opaque vs Transparent' }
        ]
    }
];

const generators = {
    foodChain: () => {
        const chains = [
            ['Grass', 'Zebra', 'Lion'],
            ['Algae', 'Small Fish', 'Shark'],
            ['Grain', 'Mouse', 'Owl'],
            ['Tree Leaves', 'Caterpillar', 'Bird']
        ];
        const selected = chains[Math.floor(Math.random() * chains.length)];
        return {
            type: 'dragdrop',
            q: "Arrange the Food Chain in correct order (Producer → Consumer).",
            items: selected,
            a: [selected.join(',')]
        };
    },
    matchingMicrobes: () => {
        const set = [
            { q: 'Virus', a: 'Flu, HIV' },
            { q: 'Bacteria', a: 'TB, Cholera' },
            { q: 'Fungi', a: 'Ringworm, Athletes Foot' },
            { q: 'Yeast', a: 'Making Bread' }
        ];
        const subset = set.sort(() => 0.5 - Math.random()).slice(0, 3);
        const left = subset.map(i => i.q);
        const rightCorrect = subset.map(i => i.a);
        const rightShuffled = [...rightCorrect].sort(() => 0.5 - Math.random());

        return {
            type: 'matching',
            q: "Match the Microorganism to its effect/example.",
            left: left,
            items: rightShuffled,
            a: [rightCorrect.join(',')]
        };
    },
    photosynthesis: () => {
        const inputs = ['Carbon Dioxide', 'Water', 'Sunlight'];
        const outputs = ['Glucose', 'Oxygen'];
        const qTypes = [
            { t: 'Product', q: 'Which is a PRODUCT of photosynthesis?', a: outputs },
            { t: 'Requirement', q: 'Which is a REQUIREMENT for photosynthesis?', a: inputs }
        ];
        const sel = qTypes[Math.floor(Math.random() * qTypes.length)];
        return {
            q: sel.q,
            a: sel.a.map(x => x.toLowerCase()) // Allow any valid match
        };
    },
    trophic: () => {
        const levels = [
            { l: 'Producer', e: 'Grass, Trees, Algae' },
            { l: 'Primary Consumer', e: 'Cow, Locust, Sheep' },
            { l: 'Secondary Consumer', e: 'Lion, Eagle, Shark' },
            { l: 'Decomposer', e: 'Fungi, Bacteria' }
        ];
        const sel = levels[Math.floor(Math.random() * levels.length)];
        return {
            q: `Give an example of a ${sel.l}.`,
            a: sel.e.split(', ').map(x => x.trim())
        };
    }
};

const fixedQuestions = {
    paper1: [
        { q: "What gas do plants absorb during photosynthesis?", a: ["carbon dioxide", "co2"] },
        { q: "What is the green pigment in plants called?", a: ["chlorophyll"] },
        { q: "What gas do humans exhale during respiration?", a: ["carbon dioxide", "co2"] },
        { q: "True or False: Animals can make their own food.", a: ["false", "f"] },
        { q: "In a food chain, what always comes first?", a: ["producer", "plant"] },
        { q: "Name a non-living (abiotic) factor.", a: ["sun", "water", "soil", "air", "temp", "temperature"] },
        { q: "What organelle is the 'powerhouse' for respiration?", a: ["mitochondria"] },
        { q: "Symbiosis where both benefit is called?", a: ["mutualism"] },
        { q: "Symbiosis where one benefits and other is harmed?", a: ["parasitism"] },
        { q: "What do we call animals that eat only plants?", a: ["herbivores"] }
    ],
    paper2: [
        { q: "Which microorganism causes bread to rise?", a: ["yeast"] },
        { q: "Is a virus living or non-living?", a: ["non-living", "non living"] },
        { q: "What medication treats bacterial infections?", a: ["antibiotics"] },
        { q: "True or False: All bacteria are harmful.", a: ["false", "f"] },
        { q: "What do decomposers recycle?", a: ["nutrients"] },
        { q: "Animals blending in is called?", a: ["camouflage"] },
        { q: "Is a rainbow a visible spectrum? (Yes/No)", a: ["yes"] },
        { q: "Does a black object absorb or reflect light?", a: ["absorb"] },
        { q: "What bends light: Reflection or Refraction?", a: ["refraction"] },
        { q: "Process of removing salt from water.", a: ["desalination"] }
    ]
};
