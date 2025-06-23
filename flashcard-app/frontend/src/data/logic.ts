export interface Flashcard {
    deckId: any;
    id: number,
    front: string;
    back: string;
    hint?: string;
    tags?: string[];
    bucket: number;
}