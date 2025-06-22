/**
 * @jest-environment jsdom
 */

const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("Popup Script Unit Tests", () => {
  let document, window;
  let frontInput, backInput, hintInput, tagsInput, statusMessage, recentFlashcardsList;

  beforeEach(() => {
    // Load popup.html into a JSDOM environment
    const htmlContent = fs.readFileSync(path.resolve(__dirname, "popup.html"), "utf8");
    const dom = new JSDOM(htmlContent, { runScripts: "dangerously" });
    window = dom.window;
    document = window.document;

    // Set globals for DOM access in tested code
    global.window = window;
    global.document = document;

    // Create mock input and display elements and add them to the document body
    frontInput = document.createElement("input");
    backInput = document.createElement("input");
    hintInput = document.createElement("input");
    tagsInput = document.createElement("input");
    statusMessage = document.createElement("div");
    recentFlashcardsList = document.createElement("ul");

    [frontInput, backInput, hintInput, tagsInput, statusMessage, recentFlashcardsList]
      .forEach(el => document.body.appendChild(el));

    // Provide global references for popup.js functions that rely on these elements
    global.frontInput = frontInput;
    global.backInput = backInput;
    global.hintInput = hintInput;
    global.tagsInput = tagsInput;
    global.statusMessage = statusMessage;
    global.recentFlashcardsList = recentFlashcardsList;

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("escapeHTML properly encodes HTML special characters", () => {
    const { escapeHTML } = require("./popup.js");

    expect(escapeHTML("<div>Test & Check</div>"))
      .toBe("&lt;div&gt;Test &amp; Check&lt;/div&gt;");
    expect(escapeHTML("")).toBe("");
    expect(escapeHTML("Normal text")).toBe("Normal text");
  });

  test("showStatus displays message and hides it after timeout", () => {
    const { showStatus } = require("./popup.js");

    showStatus("Operation succeeded", "success");

    expect(statusMessage.textContent).toBe("Operation succeeded");
    expect(statusMessage.className).toContain("success");
    expect(statusMessage.style.display).toBe("block");

    jest.runAllTimers();

    expect(statusMessage.textContent).toBe("");
    expect(statusMessage.style.display).toBe("none");
  });

  test("clearForm resets all input values to empty", () => {
    const { clearForm } = require("./popup.js");

    frontInput.value = "Sample front";
    backInput.value = "Sample back";
    hintInput.value = "Sample hint";
    tagsInput.value = "tagA, tagB";

    clearForm();

    expect(frontInput.value).toBe("");
    expect(backInput.value).toBe("");
    expect(hintInput.value).toBe("");
    expect(tagsInput.value).toBe("");
  });

  test("renderRecentFlashcards populates the list with cards", () => {
    const { renderRecentFlashcards } = require("./popup.js");

    const sampleCards = [
      {
        front: "Question 1",
        back: "Answer 1",
        hint: "Hint 1",
        tags: ["alpha", "beta"],
        bucket: 1,
        timestamp: Date.now(),
      },
      {
        front: "Question 2",
        back: "Answer 2",
        tags: [],
        bucket: 2,
        timestamp: Date.now(),
      },
    ];

    renderRecentFlashcards(sampleCards);

    expect(recentFlashcardsList.children.length).toBe(2);
    expect(recentFlashcardsList.children[0].textContent).toMatch(/Question 1/);
    expect(recentFlashcardsList.children[1].textContent).toMatch(/Question 2/);
  });
});
