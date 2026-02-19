
export interface AfrikaansTopic {
    category: string;
    title: string;
    desc: string;
    examples: string[];
}

export interface Question {
    q: string;
    a: string[];
    options?: string[];
}

export const TOPICS: AfrikaansTopic[] = [
    {
        category: 'Woordeskat',
        title: 'Familie (Family)',
        desc: 'Terms for family members.',
        examples: ['Ouma (Grandmother)', 'Oupa (Grandfather)', 'Suster (Sister)']
    },
    {
        category: 'Woordeskat',
        title: 'Dae van die week',
        desc: 'Days of the week.',
        examples: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrydag']
    },
    {
        category: 'Grammatika',
        title: 'STOMPI',
        desc: 'Word order rule.',
        examples: ['Subject', 'Verb 1', 'Time', 'Object', 'Manner', 'Place', 'Verb 2', 'Infinitive']
    },
    {
        category: 'Grammatika',
        title: 'Meervoude (Plurals)',
        desc: 'Rules for making words plural.',
        examples: ['Boek -> Boeke', 'Man -> Mans', 'Kind -> Kinders']
    },
    {
        category: 'Grammatika',
        title: 'Verkleining (Diminutives)',
        desc: 'Making things small.',
        examples: ['Kat -> Katjie', 'Boom -> Boompie']
    },
    {
        category: 'Tye',
        title: 'Verlede Tyd (Past Tense)',
        desc: 'Using "het" and "ge-".',
        examples: ['Ek speel -> Ek het gespeel']
    }
];

export const FIXED_QUESTIONS: Record<string, Question[]> = {
    woordeskat: [
        { q: "Translate: 'Brother'", a: ["broer"] },
        { q: "Translate: 'Sunday'", a: ["sondag"] },
        { q: "What is 'Dog' in Afrikaans?", a: ["hond"] },
        { q: "Translate: 'School'", a: ["skool"] },
        { q: "What is 'Teacher'?", a: ["onderwyser", "juffrou", "meneer"] }
    ],
    grammatika: [
        { q: "Plural of 'Kind'?", a: ["kinders"], options: ["Kinde", "Kinds", "Kinders"] },
        { q: "Diminutive of 'Hond'?", a: ["hondjie"] },
        { q: "Past tense: 'Ek loop'", a: ["ek het geloop"] },
        { q: "STOMPI: Which comes first, Time or Place?", a: ["time"] },
        { q: "Plural of 'Stad' (City)?", a: ["stede"] }
    ]
};
