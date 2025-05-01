"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerDifficulty = exports.Flashcard = void 0;
class Flashcard {
    constructor(front, // Required parameter
    back, // Required parameter
    deckId, // Required parameter
    hint, // Optional parameter
    tags = [] // Optional parameter with default value
    ) {
        this.front = front;
        this.back = back;
        this.deckId = deckId;
        this.hint = hint;
        this.tags = tags;
    }
}
exports.Flashcard = Flashcard;
var AnswerDifficulty;
(function (AnswerDifficulty) {
    AnswerDifficulty[AnswerDifficulty["Wrong"] = 0] = "Wrong";
    AnswerDifficulty[AnswerDifficulty["Hard"] = 1] = "Hard";
    AnswerDifficulty[AnswerDifficulty["Easy"] = 2] = "Easy";
})(AnswerDifficulty || (exports.AnswerDifficulty = AnswerDifficulty = {}));
