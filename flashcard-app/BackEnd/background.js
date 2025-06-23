import { loadFlashcards, saveFlashcards } from './storage.js'; // adjust path if needed

console.log('[Background] Extension background script active.');

// Types of supported messages
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'saveFlashcard') {
    loadFlashcards()
      .then((flashcards) => {
        flashcards.push(message.flashcard);
        return saveFlashcards(flashcards);
      })
      .then(() => sendResponse({ success: true }))
      .catch((err) => {
        console.error('[Background] Error saving flashcard:', err);
        sendResponse({ success: false, error: err.message });
      });

    return true; // keep sendResponse alive
  }

  if (message.type === 'OPEN_FLASHCARD_POPUP') {
    chrome.storage.local.set({ selectedText: message.text }).then(() => {
      chrome.windows.create({
        url: chrome.runtime.getURL('popup.html'),
        type: 'popup',
        width: 400,
        height: 600,
      });
      sendResponse({ success: true });
    }).catch((err) => {
      console.error('[Background] Failed to open flashcard popup:', err);
      sendResponse({ success: false, error: err.message });
    });

    return true;
  }

  return false;
});

// Open practice page on first install
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('practice.html'),
  });
});

// Open practice page when extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('practice.html'),
  });
});
