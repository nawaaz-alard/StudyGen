
// Simple SRS logic inspired by Leitner System

export interface CardProgress {
    cardId: string;
    box: number; // 0 to 5
    nextReview: number; // Timestamp
}

// Review intervals in days for each box
const INTERVALS = [0, 1, 3, 7, 14, 30];

export const getNextReviewDate = (box: number): number => {
    const days = INTERVALS[Math.min(box, INTERVALS.length - 1)];
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.getTime();
};

export const updateCardProgress = (currentProgress: CardProgress | undefined, success: boolean): CardProgress => {
    let box = currentProgress?.box || 0;

    if (success) {
        box = Math.min(box + 1, INTERVALS.length - 1);
    } else {
        box = 0; // Reset on failure
    }

    return {
        cardId: currentProgress?.cardId || '',
        box,
        nextReview: getNextReviewDate(box)
    };
};
