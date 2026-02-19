
// Icons removed from data structure to keep it serializable

export interface Module {
    id: string;
    name: string;
    icon?: any;
    authorized: boolean;
    description: string;
}

export const MOCK_MODULES: Module[] = [
    { id: 'math', name: 'Math Quiz', authorized: true, description: "Challenge your math skills." },
    { id: 'lifescience', name: 'Life Science', authorized: true, description: "Biology and nature exploration." },
    { id: 'afrikaans', name: 'Afrikaans Quiz', authorized: true, description: "Language mastery." }
]

export const MOCK_CONTENT: Record<string, any> = {
    "math": {
        moduleId: "math",
        sections: [
            { title: "Algebra Basics", content: "Understanding variables and equations." },
            { title: "Geometry", content: "Shapes, angles, and dimensions." },
            { title: "Calculus Intro", content: "Limits and derivatives." }
        ]
    },
    "lifescience": {
        moduleId: "lifescience",
        sections: [
            { title: "Cell Biology", content: "Structure and function of cells." },
            { title: "Genetics", content: "DNA, genes, and heredity." },
            { title: "Ecology", content: "Ecosystems and interactions." }
        ]
    },
    "afrikaans": {
        moduleId: "afrikaans",
        sections: [
            { title: "Woordeskat", content: "Belangrike woorde en frases." },
            { title: "Grammatika", content: "Sinbou en tye." }
        ]
    }
};
