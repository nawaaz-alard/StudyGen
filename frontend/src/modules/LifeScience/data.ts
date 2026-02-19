
export interface LifeScienceTopic {
    paper: number;
    title: string;
    tags: string;
    icon: string;
    diagram?: string;
    content: { topic: string; ex: string }[];
    gameData?: {
        targets: { id: string; x: number; y: number; label: string }[];
    };
}

export interface Question {
    q: string;
    a: string[];
    type?: 'dragdrop' | 'matching';
    items?: string[];
    left?: string[];
}

export const TOPICS: LifeScienceTopic[] = [
    {
        paper: 1, title: 'Photosynthesis', tags: 'plants sunlight glucose oxygen carbon dioxide chloroplasts',
        icon: '<svg viewBox="0 0 24 24" fill="none" class="t-icon"><path d="M12 22l-4-9 1.5-3.5L12 2l2.5 7.5L16 13l-4 9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22v-9" stroke="currentColor" stroke-width="2"/><path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="2"/></svg>',
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

export const FIXED_QUESTIONS: Record<string, Question[]> = {
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
