"use strict";
/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBucketSets = toBucketSets;
exports.getBucketRange = getBucketRange;
exports.practice = practice;
exports.update = update;
exports.getHint = getHint;
exports.computeProgress = computeProgress;
const flashcards_1 = require("./flashcards");
import { AnswerDifficulty } from './flashcards'; // 'easy' | 'medium' | 'hard' | 'wrong'

export function getNextBucket(currentBucket: number, difficulty: AnswerDifficulty): number {
  switch (difficulty) {
    case 'easy':
      return Math.min(currentBucket + 2, 5); // Cap at bucket 5
    case 'medium':
      return Math.min(currentBucket + 1, 5);
    case 'hard':
      return currentBucket; // No promotion
    case 'wrong':
      if (currentBucket >= 3) {
        return Math.max(1, Math.floor(currentBucket / 2)); // Lapse penalty
      } else {
        return 0; // Fully reset
      }
    default:
      return currentBucket;
  }
}

function toBucketSets(buckets) {
    // Find the maximum bucket number to create an array of the right size
    const maxBucketNumber = Math.max(...[...buckets.keys()].map(Number), 0 // Ensure at least 0-length array if no buckets
    );
    // Create an array of empty sets with length maxBucketNumber + 1
    const bucketSets = Array.from({ length: maxBucketNumber + 1 }, () => new Set());
    // Populate the sets
    for (const [bucketNumber, cardSet] of buckets.entries()) {
        const bucketNum = Number(bucketNumber);
        bucketSets[bucketNum] = new Set(cardSet);
    }
    return bucketSets;
}
function getBucketRange(buckets) {
    // Find the indices of non-empty buckets
    const nonEmptyBuckets = buckets
        .map((bucket, index) => ({ bucket, index }))
        .filter(({ bucket }) => bucket.size > 0);
    // If no buckets have cards, return undefined
    if (nonEmptyBuckets.length === 0) {
        return undefined;
    }
    // Find the minimum and maximum bucket indices
    const minBucket = Math.min(...nonEmptyBuckets.map(({ index }) => index));
    const maxBucket = Math.max(...nonEmptyBuckets.map(({ index }) => index));
    return { minBucket, maxBucket };
}
function practice(buckets, day) {
    return buckets.reduce((practiceCandidates, bucket, index) => {
        if (bucket.size > 0 && (index === 0 || (day % Math.pow(2, index)) === 0)) {
            bucket.forEach(card => practiceCandidates.add(card));
        }
        return practiceCandidates;
    }, new Set());
}
function update(buckets, card, difficulty) {
    // Create a new map to avoid mutating the original
    const updatedBuckets = new Map(buckets);
    // Find the current bucket of the card
    let currentBucket = -1;
    for (const [bucket, cardSet] of updatedBuckets.entries()) {
        if (cardSet.has(card)) {
            currentBucket = Number(bucket);
            // Remove from current bucket
            cardSet.delete(card);
            if (cardSet.size === 0) {
                updatedBuckets.delete(bucket);
            }
            break;
        }
    }
    // Determine new bucket based on difficulty
    let newBucket;
    switch (difficulty) {
        case flashcards_1.AnswerDifficulty.Easy:
            newBucket = Math.min(currentBucket + 2, 7);
            break;
        case flashcards_1.AnswerDifficulty.Hard:
            newBucket = Math.min(currentBucket + 1, 7);
            break;
        case flashcards_1.AnswerDifficulty.Wrong:
        default:
            newBucket = 0;
    }
    // Add card to new bucket
    if (!updatedBuckets.has(newBucket)) {
        updatedBuckets.set(newBucket, new Set());
    }
    updatedBuckets.get(newBucket).add(card);
    return updatedBuckets;
}
function getHint(card) {
    // Use the card's existing hint and strengthen it
    const hint = card.hint;
    if ((hint === null || hint === void 0 ? void 0 : hint.trim()) !== "") {
        return hint || "";
    }
    // Fallback to generating a hint if no existing hint
    const front = card.front;
    if (front.length <= 3) {
        // For very short strings, return first character
        return front.charAt(0) + '*'.repeat(Math.max(0, front.length - 1));
    }
    // Return first 3 characters + masked rest
    return front.slice(0, 3) + '*'.repeat(Math.max(0, front.length - 3));
}
function computeProgress(buckets, history) {
    // Placeholder implementation - you'll want to replace this 
    // with a more meaningful progress calculation based on your specific requirements
    const totalCards = Array.from(buckets.values())
        .reduce((sum, bucket) => sum + bucket.size, 0);
    const progressStages = [
        { name: 'Beginner', minBucket: 0, maxBucket: 1 },
        { name: 'Intermediate', minBucket: 2, maxBucket: 4 },
        { name: 'Advanced', minBucket: 5, maxBucket: 7 }
    ];
    const stageBreakdown = progressStages.map(stage => {
        const stageCards = Array.from(buckets.entries())
            .filter(([bucket]) => Number(bucket) >= stage.minBucket &&
            Number(bucket) <= stage.maxBucket)
            .reduce((sum, [, cardSet]) => sum + cardSet.size, 0);
        return {
            stage: stage.name,
            cardCount: stageCards,
            percentage: (stageCards / totalCards) * 100
        };
    });
    return {
        totalCards,
        stageBreakdown
    };
}
