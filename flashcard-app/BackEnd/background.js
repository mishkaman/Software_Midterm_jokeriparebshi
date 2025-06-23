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

// Ask for permission once
chrome.runtime.onInstalled.addListener(() => {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Daily Review Reminder',
    message: 'Would you like to get daily flashcard review reminders?',
    buttons: [{ title: 'Yes, remind me!' }],
    priority: 1,
    requireInteraction: true
  });
});

// Handle user clicking the reminder button
chrome.notifications.onButtonClicked.addListener((notifId, buttonIndex) => {
  if (buttonIndex === 0) {
    chrome.alarms.create('dailyReviewReminder', {
      when: Date.now() + 1000, // Start in 1 sec
      periodInMinutes: 1440    // 24 hours
    });
  }
});

// Show daily notification
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyReviewReminder') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Flashcard Time!',
      message: 'Time for your daily flashcard review.',
      priority: 1
    });
  }
});

// Open practice page on notification click
chrome.notifications.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('practice.html'),
  });
});

