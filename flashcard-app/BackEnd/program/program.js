// program.js

import { initButton, placeButton, hideButton, isButtonElement, isButtonVisible } from "./buttonManager.js";
import { getSelectedText, updateSelectionContext, getContext, clearContext } from "./selectionTracker.js";

console.log("AI Flashcard Creator: Program script initialized.");

function handleButtonClick(e) {
  e.stopPropagation();
  const selectedText = getSelectedText();

  if (selectedText) {
    console.log("Sending selected text to background script:", selectedText);
    chrome.runtime.sendMessage({ type: "OPEN_FLASHCARD_POPUP", text: selectedText }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Runtime message error:", chrome.runtime.lastError.message);
      } else {
        console.log("Message sent successfully:", response);
      }
    });
  }

  hideButton();
  clearContext();
}

initButton(handleButtonClick);

document.addEventListener("mouseup", (e) => {
  if (isButtonElement(e.target) || e.target.closest("input, textarea, [contenteditable=true]")) return;

  const context = updateSelectionContext();
  if (context) {
    setTimeout(() => {
      if (getSelectedText() === context.text) {
        const { left, bottom } = context.rect;
        placeButton(left + window.scrollX, bottom + window.scrollY + 8);
      }
    }, 50);
  } else {
    hideButton();
    clearContext();
  }
});

document.addEventListener("mousedown", (e) => {
  if (!isButtonElement(e.target) && isButtonVisible()) hideButton();
});

document.addEventListener("scroll", () => {
  if (isButtonVisible()) hideButton();
}, { passive: true });

console.log("AI Flashcard Creator: Event listeners are active.");
