// buttonManager.js

const BUTTON_ID = "ai-flashcard-button";
let buttonElement = null;

export function initButton(onClick) {
  if (buttonElement) return;

  const btn = document.createElement("button");
  btn.id = BUTTON_ID;
  btn.textContent = "Add to Flashcard";
  btn.style.display = "none";
  btn.addEventListener("click", onClick);
  document.body.appendChild(btn);
  buttonElement = btn;
}

export function placeButton(x, y) {
  if (!buttonElement) return;
  buttonElement.style.left = `${x}px`;
  buttonElement.style.top = `${y}px`;
  buttonElement.style.display = "block";
}

export function hideButton() {
  if (buttonElement) buttonElement.style.display = "none";
}

export function isButtonVisible() {
  return buttonElement && buttonElement.style.display === "block";
}

export function isButtonElement(el) {
  return el?.id === BUTTON_ID;
}
