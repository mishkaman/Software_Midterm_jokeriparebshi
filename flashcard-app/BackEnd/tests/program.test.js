/**
 * @jest-environment jsdom
 */

const { JSDOM } = require("jsdom");

describe("Floating Button Behavior", () => {
  let window, document;

  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
      url: "http://localhost",
    });
    window = dom.window;
    document = window.document;

    global.window = window;
    global.document = document;
  });

  afterEach(() => {
    jest.resetModules();
  });

  test("Button is created and added to DOM", () => {
    const { initButton } = require("../content/buttonManager.js");
    const handler = jest.fn();

    initButton(handler);

    const btn = document.getElementById("ai-flashcard-button");

    expect(btn).toBeTruthy();
    expect(btn.textContent).toBe("Add to Flashcard");
    expect(typeof btn.onclick).toBe("function");
    expect(document.body.contains(btn)).toBe(true);
  });

  test("Button is hidden when hideButton is called", () => {
    const { initButton, hideButton } = require("../content/buttonManager.js");
    initButton(() => {});
    const btn = document.getElementById("ai-flashcard-button");
    btn.style.display = "block";

    hideButton();
    expect(btn.style.display).toBe("none");
  });

  test("placeButton correctly positions and shows the button", () => {
    const { initButton, placeButton } = require("../content/buttonManager.js");
    initButton(() => {});
    const btn = document.getElementById("ai-flashcard-button");

    placeButton(120, 250);

    expect(btn.style.left).toBe("120px");
    expect(btn.style.top).toBe("250px");
    expect(btn.style.display).toBe("block");
  });

  test("isButtonElement returns true for the button", () => {
    const { initButton, isButtonElement } = require("../content/buttonManager.js");
    initButton(() => {});
    const btn = document.getElementById("ai-flashcard-button");

    expect(isButtonElement(btn)).toBe(true);
  });

  test("isButtonVisible returns true only when displayed", () => {
    const { initButton, isButtonVisible } = require("../content/buttonManager.js");
    initButton(() => {});
    const btn = document.getElementById("ai-flashcard-button");

    btn.style.display = "block";
    expect(isButtonVisible()).toBe(true);

    btn.style.display = "none";
    expect(isButtonVisible()).toBe(false);
  });
});
