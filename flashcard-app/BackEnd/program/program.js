// Main content script: Handles text selection, floating button display, and flashcard creation trigger.

import {
  initButton,
  placeButton,
  hideButton,
  isButtonElement,
  isButtonVisible,
} from "./buttonManager.js";

import {
  getSelectedText,
  updateSelectionContext,
  clearContext,
} from "./selectionTracker.js";

console.log("AI Flashcard Creator: Content script initialized.");

function onFlashcardButtonClick(event) {
  event.stopPropagation();

  const selected = getSelectedText();
  if (!selected) return;

  console.log("Selected text to send:", selected);
  chrome.runtime.sendMessage(
    { type: "OPEN_FLASHCARD_POPUP", text: selected },
    (res) => {
      if (chrome.runtime.lastError) {
        console.error("Error communicating with background:", chrome.runtime.lastError.message);
      } else {
        console.log("Response from background:", res);
      }
    }
  );

  hideButton();
  clearContext();
}

// Initialize floating button
initButton(onFlashcardButtonClick);

// Detect valid text selection on mouseup
document.addEventListener("mouseup", (event) => {
  if (
    isButtonElement(event.target) ||
    event.target.closest("input, textarea, [contenteditable=true]")
  ) {
    return;
  }

  const context = updateSelectionContext();
  if (context) {
    setTimeout(() => {
      if (getSelectedText() === context.text) {
        const { left, bottom } = context.rect;
        placeButton(left + window.scrollX, bottom + window.scrollY + 10);
      }
    }, 40);
  } else {
    hideButton();
    clearContext();
  }
});

// Hide button on interaction outside
document.addEventListener("mousedown", (e) => {
  if (!isButtonElement(e.target) && isButtonVisible()) {
    hideButton();
  }
});

// Hide on scroll to prevent position mismatch
document.addEventListener(
  "scroll",
  () => {
    if (isButtonVisible()) hideButton();
  },
  { passive: true }
);

console.log("AI Flashcard Creator: Interaction listeners attached.");

// Add progress bar to body
const style = document.createElement("style");
style.textContent = `
  .ai-flashcard-progress-container {
    width: 100%;
    height: 6px;
    background-color: #ddd;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }
  .ai-flashcard-progress-fill {
    height: 100%;
    background-color: #f51aac;
    width: 0%;
    transition: width 0.3s ease;
  }
`;
document.head.appendChild(style);

const progressContainer = document.createElement("div");
progressContainer.className = "ai-flashcard-progress-container";
const progressFill = document.createElement("div");
progressFill.className = "ai-flashcard-progress-fill";
progressContainer.appendChild(progressFill);
document.body.appendChild(progressContainer);

// Example usage for progress update
let currentCard = 0;
let totalCards = 10; // You should dynamically get this from your app

function updateProgressBar(cardIndex, total) {
  const percent = Math.min((cardIndex / total) * 100, 100);
  progressFill.style.width = `${percent}%`;
}

// Update it when needed
updateProgressBar(currentCard, totalCards);
