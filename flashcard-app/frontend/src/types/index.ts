import {
    Flashcard as CoreFlashcard,
    AnswerDifficulty as CoreDifficulty,
    BucketMap as CoreBucketMap,
} from "../../../BackEnd//src//logic//flashcards";

//API Request/Response Types


export interface PracticeSession {
    cards: CoreFlashcard[];
    day: number;
}

export interface UpdateRequest {
    cardFront: string;
    cardBack: string;
    difficulty: CoreDifficulty;
}

export interface ProgressStats {
    totalCards: number;
    stageBreakdown: Array<{
        stage: string;
        cardCount: number;
        percentage: number;
    }>;
}

// --- Re-export Core Types ---
export type Flashcard = CoreFlashcard;
export type AnswerDifficulty = CoreDifficulty;
export type BucketMap = CoreBucketMap;
