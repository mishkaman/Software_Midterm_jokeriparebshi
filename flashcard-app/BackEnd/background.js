// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "OPEN_FLASHCARD_POPUP") {
    console.log("Background received message:", message);

    chrome.windows.create({
      url: `popup/popup.html?text=${encodeURIComponent(message.text)}`,
      type: "popup",
      width: 400,
      height: 500
    });

    sendResponse({ status: "popup_opened" });
  }
});
