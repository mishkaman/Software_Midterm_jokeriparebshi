export class Flashcard {
  id(id: any, front: string, back: string, arg3: string | null, arg4: string, deckId: string, userId: string) {
    throw new Error("Method not implemented.");
  }
  constructor(
    public readonly front: string,        // Required parameter
    public readonly back: string,         // Required parameter
    public readonly deckId: string,       // Required parameter
    public readonly hint?: string,        // Optional parameter
    public readonly tags: ReadonlyArray<string> = [] // Optional parameter with default value
  ) {}
}

export enum AnswerDifficulty {
  Wrong = 0,
  Hard = 1,
  Easy = 2,
}

export type BucketMap = Map<number, Set<Flashcard>>;
