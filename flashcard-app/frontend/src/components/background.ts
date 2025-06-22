// Create the context menu once when extension loads
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'create-flashcard',
    title: 'Create Flashcard',
    contexts: ['selection'], // only show when text is selected
  });
});

// Listen for context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'create-flashcard' && info.selectionText) {
    // Open a new tab or popup with the form, passing selected text
    const url = chrome.runtime.getURL('popup.html') + `?front=${encodeURIComponent(info.selectionText)}`;
    chrome.windows.create({
      url,
      type: 'popup',
      width: 400,
      height: 600
    });
  }
});
