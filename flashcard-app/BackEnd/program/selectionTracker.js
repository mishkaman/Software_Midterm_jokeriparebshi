// selectionTracker.js

let currentContext = null;

export function getSelectedText() {
  return window.getSelection().toString().trim();
}

export function updateSelectionContext() {
  const text = getSelectedText();
  const sel = window.getSelection();
  if (!text || !sel.rangeCount) return null;

  const rect = sel.getRangeAt(0).getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;

  currentContext = { text, rect };
  return currentContext;
}

export function getContext() {
  return currentContext;
}

export function clearContext() {
  currentContext = null;
}
