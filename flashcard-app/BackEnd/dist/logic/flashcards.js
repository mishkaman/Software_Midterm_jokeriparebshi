class Flashcard {
  constructor(front, back, deckId, hint, tags = [], bookmarked = false) {
    this.id = this.generateId();
    this.front = front;
    this.back = back;
    this.deckId = deckId || ""; // ensure string
    this.hint = hint;
    this.tags = tags;
    this.bookmarked = bookmarked;
  }

  generateId() {
    // Simple unique id generator
    return Math.random().toString(36).slice(2, 10);
  }
}

const AnswerDifficulty = {
  Wrong: 0,
  Hard: 1,
  Easy: 2,
};

module.exports = { Flashcard, AnswerDifficulty };
