
export interface Flashcard {
    id: string;
    front: string;
    back: string;
    category: string;
}

export const MOCK_FLASHCARDS: Flashcard[] = [
    // Math
    { id: 'm1', category: 'Math', front: 'What is the formula for the area of a circle?', back: 'A = πr²' },
    { id: 'm2', category: 'Math', front: 'What is the value of Pi (approx)?', back: '3.14159' },
    { id: 'm3', category: 'Math', front: 'What is the Pythagorean theorem?', back: 'a² + b² = c²' },
    { id: 'm4', category: 'Math', front: 'What is an integer?', back: 'A whole number (not a fraction) that can be positive, negative, or zero.' },

    // Life Science
    { id: 'ls1', category: 'Life Science', front: 'What is the powerhouse of the cell?', back: 'Mitochondria' },
    { id: 'ls2', category: 'Life Science', front: 'What molecule carries genetic instructions?', back: 'DNA (Deoxyribonucleic acid)' },
    { id: 'ls3', category: 'Life Science', front: 'What is the process by which plants verify food?', back: 'Photosynthesis' },

    // Afrikaans
    { id: 'af1', category: 'Afrikaans', front: 'Translate "Hello" to Afrikaans', back: 'Hallo' },
    { id: 'af2', category: 'Afrikaans', front: 'Translate "School" to Afrikaans', back: 'Skool' },
    { id: 'af3', category: 'Afrikaans', front: 'What is the plural of "Kind"?', back: 'Kinders' },
];
