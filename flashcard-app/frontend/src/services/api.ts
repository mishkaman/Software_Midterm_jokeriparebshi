import axios from "axios";
import {
    Flashcard,
    AnswerDifficulty,
    PracticeSession,
    ProgressStats,
} from "../types";

const API_BASE_URL = "http://localhost:3001/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

//API Functions

export async function fetchPracticeCards(): Promise<PracticeSession> {
    const response = await apiClient.get("/practice");
    return response.data;
}

// frontend/src/services/api.ts


export const submitAnswer = async (
  front: string,
  back: string,
  difficulty: AnswerDifficulty
): Promise<void> => {
  console.log("Mock submitAnswer called with:", { front, back, difficulty });

  // Simulate a short delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Do NOT throw any errors
};

export async function fetchHint(card: Flashcard): Promise<string> {
    const response = await apiClient.get("/hint", {
        params: {
            cardFront: card.front,
            cardBack: card.back,
        },
    });
    return response.data.hint;
}

export async function fetchProgress(): Promise<ProgressStats> {
    const response = await apiClient.get("/progress");
    return response.data;
}

export const advanceDay = async (): Promise<void> => {
  console.log("Mock advanceDay triggered");

  // Optional: reset date-based logic if needed
  localStorage.setItem("lastPracticeDate", new Date().toDateString());

  // Simulate async behavior
  await new Promise((resolve) => setTimeout(resolve, 200));
};
