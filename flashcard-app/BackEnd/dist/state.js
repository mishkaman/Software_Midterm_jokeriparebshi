"use strict";
// backend/src/state.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuckets = getBuckets;
exports.setBuckets = setBuckets;
exports.getHistory = getHistory;
exports.addHistoryRecord = addHistoryRecord;
exports.getCurrentDay = getCurrentDay;
exports.incrementDay = incrementDay;
exports.findCard = findCard;
exports.findCardBucket = findCardBucket;
const flashcards_1 = require("./logic/flashcards");
// --- Initial Sample Data ---
const initialCards = [
    new flashcards_1.Flashcard("Capital of France", "Paris", "geo", "Starts with P", ["europe", "capital"]),
    new flashcards_1.Flashcard("2 + 2", "4", "math", "Basic addition", ["math", "easy"]),
    new flashcards_1.Flashcard("Water's chemical formula", "H2O", "science", "Two H's, one O", ["chemistry"]),
    new flashcards_1.Flashcard("Largest planet", "Jupiter", "space", "Gas giant", ["astronomy"]),
];
// --- In-Memory State ---
let currentBuckets = new Map();
currentBuckets.set(0, new Set(initialCards));
let practiceHistory = [];
let currentDay = 0;
// --- State Accessors & Mutators ---
function getBuckets() {
    return currentBuckets;
}
function setBuckets(newBuckets) {
    currentBuckets = newBuckets;
}
function getHistory() {
    return practiceHistory;
}
function addHistoryRecord(record) {
    practiceHistory.push(record);
}
function getCurrentDay() {
    return currentDay;
}
function incrementDay() {
    currentDay++;
}
// --- Helper Functions ---
function findCard(front, back) {
    for (const cardSet of currentBuckets.values()) {
        for (const card of cardSet) {
            if (card.front === front && card.back === back) {
                return card;
            }
        }
    }
    return undefined;
}
function findCardBucket(cardToFind) {
    for (const [bucket, cardSet] of currentBuckets.entries()) {
        if (cardSet.has(cardToFind)) {
            return bucket;
        }
    }
    return undefined;
}
console.log("Initial state loaded: ", {
    buckets: [...currentBuckets.entries()].map(([k, v]) => [k, [...v]]),
    day: currentDay,
    historyLength: practiceHistory.length,
});
