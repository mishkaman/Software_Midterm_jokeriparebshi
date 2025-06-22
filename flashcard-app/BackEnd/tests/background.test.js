const assert = require('assert');

// Simulate the chrome API for testing
global.chrome = {
  runtime: {
    onMessage: {
      addListener: (callback) => {
        // Store the callback for later testing
        global.testCallback = callback;
      }
    }
  },
  windows: {
    create: (options) => {
      global.createdWindow = options;
    }
  }
};

// Require the background script (this should register the listener)
require('../backend/background.js'); // adjust path if needed

describe('Background Script', () => {
  it('should open a popup window on receiving OPEN_FLASHCARD_POPUP', (done) => {
    const message = { type: "OPEN_FLASHCARD_POPUP", text: "Test flashcard content" };

    global.testCallback(message, null, (response) => {
      try {
        assert.deepStrictEqual(response, { status: "popup_opened" });
        assert.ok(global.createdWindow);
        assert.strictEqual(global.createdWindow.type, "popup");
        assert.ok(global.createdWindow.url.includes("popup.html?text=Test%20flashcard%20content"));
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
