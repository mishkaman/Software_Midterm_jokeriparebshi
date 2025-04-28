export class Flashcard {
  constructor(
    public readonly front: string,
    public readonly back: string,
    public readonly hint?: string,
    public readonly tags: ReadonlyArray<string> = []
  ) {}
}

export enum AnswerDifficulty {
  Wrong = 0,
  Hard = 1,
  Easy = 2,
}

export type BucketMap = Map<number, Set<Flashcard>>;
