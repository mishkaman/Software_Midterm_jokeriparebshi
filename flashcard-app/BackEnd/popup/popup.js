console.log("Study Card Creator: Application script initialized.");

// Cache DOM elements for better performance
const elements = {
  question: document.getElementById("question-side"),
  answer: document.getElementById("answer-side"),
  hint: document.getElementById("memory-hint"),
  tags: document.getElementById("category-tags"),
  create: document.getElementById("create-card"),
  reset: document.getElementById("reset-form"),
  feedback: document.getElementById("feedback-display"),
  collection: document.getElementById("card-collection")
};

// Text sanitization utility
const textSanitizer = {
  clean: (input) => {
    if (!input) return '';
    const container = document.createElement('div');
    container.appendChild(document.createTextNode(input));
    return container.innerHTML;
  }
};

// Notification system
const notifications = {
  show: (message, type = "info") => {
    console.log(`Notification (${type}): ${message}`);
    if (elements.feedback) {
      elements.feedback.textContent = message;
      elements.feedback.className = `feedback-area ${type}`;
      elements.feedback.style.display = "block";

      setTimeout(() => {
        elements.feedback.textContent = '';
        elements.feedback.style.display = "none";
        elements.feedback.className = 'feedback-area';
      }, 3000);
    } else {
      console.error("Feedback element unavailable!");
    }
  }
};

// Form management
const formController = {
  clear: () => {
    console.log("Clearing form fields");
    Object.values(elements).forEach(el => {
      if (el && el.tagName === 'TEXTAREA') {
        el.value = "";
      }
    });
  },
  
  getData: () => ({
    question: elements.question.value.trim(),
    answer: elements.answer.value.trim(),
    hint: elements.hint.value.trim(),
    tags: elements.tags.value.trim().split(';')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
  }),
  
  validate: (data) => {
    return data.question && data.answer;
  }
};

// Card rendering engine
const cardRenderer = {
  render: (cards = []) => {
    if (!elements.collection) {
      console.error("Collection element missing!");
      return;
    }
    
    elements.collection.innerHTML = '';

    if (cards.length === 0) {
      elements.collection.innerHTML = "<p>No study cards have been created yet.</p>";
      return;
    }

    const fragment = document.createDocumentFragment();
    const displayCards = cards.slice(0, 5);

    displayCards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'card-item';
      cardElement.innerHTML = this.createCardHTML(card);
      fragment.appendChild(cardElement);
    });

    elements.collection.appendChild(fragment);
  },

  createCardHTML: (card) => {
    const categoryHTML = card.categories && card.categories.length > 0 
      ? `<div class="categories">${card.categories.map(cat => `<span class="category-tag">${textSanitizer.clean(cat)}</span>`).join(' ')}</div>`
      : `<div class="categories"><span class="category-tag">uncategorized</span></div>`;

    const timestamp = card.createdAt ? new Date(card.createdAt).toLocaleString() : 'Unknown';

    return `
      <div class="card-content">
        <div><strong>Question:</strong> ${textSanitizer.clean(card.question)}</div>
        <div><strong>Answer:</strong> ${textSanitizer.clean(card.answer)}</div>
        ${card.memoryAid ? `<div><strong>Memory Aid:</strong> ${textSanitizer.clean(card.memoryAid)}</div>` : ''}
        <div><strong>Categories:</strong> ${categoryHTML}</div>
        <div><strong>Level:</strong> ${card.level}</div>
        <div class="creation-time">Created: ${timestamp}</div>
      </div>
    `;
  }
};

// Storage interface
const storage = {
  async load() {
    console.log("Loading card data...");
    try {
      const result = await chrome.storage.local.get({ studyCards: [] });
      console.log("Retrieved data:", result.studyCards);
      cardRenderer.render(result.studyCards);
    } catch (error) {
      console.error("Storage load error:", error);
      if (chrome.runtime.lastError) {
        console.error("Chrome error:", chrome.runtime.lastError.message);
        notifications.show(`Load error: ${chrome.runtime.lastError.message}`, "error");
      } else {
        notifications.show("Failed to load card history.", "error");
      }
      cardRenderer.render([]);
    }
  },

  async save(newCard) {
    console.log("Saving card:", newCard);
    try {
      const result = await chrome.storage.local.get({ studyCards: [] });
      let cards = result.studyCards || [];
      cards.unshift(newCard);
      await chrome.storage.local.set({ studyCards: cards });
      console.log("Card saved successfully.");
      return true;
    } catch (error) {
      console.error("Storage save error:", error);
      if (chrome.runtime.lastError) {
        console.error("Chrome error:", chrome.runtime.lastError.message);
        notifications.show(`Save failed: ${chrome.runtime.lastError.message}`, "error");
      } else {
        notifications.show("Save operation failed.", "error");
      }
      return false;
    }
  }
};

// Event handlers
const eventHandlers = {
  async onCreate(event) {
    event.preventDefault();
    console.log("Create card triggered");

    const formData = formController.getData();
    
    if (!formController.validate(formData)) {
      notifications.show("Both question and answer fields must be filled.", "error");
      return;
    }

    const card = {
      id: Date.now(),
      question: formData.question,
      answer: formData.answer,
      memoryAid: formData.hint,
      categories: formData.tags,
      level: 0,
      createdAt: new Date().toISOString()
    };

    const success = await storage.save(card);
    if (success) {
      notifications.show("Study card created successfully!", "success");
      formController.clear();
      storage.load();
      setTimeout(() => window.close(), 1200);
    }
  },

  onReset() {
    console.log("Reset triggered");
    formController.clear();
    notifications.show("Form has been reset.", "info");
  }
};

// Application initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log("Study Card Creator DOM ready.");

  // Validate required elements
  const requiredElements = Object.values(elements);
  if (requiredElements.some(el => !el)) {
    console.error("Missing critical DOM elements!");
    if (elements.feedback) {
      elements.feedback.textContent = "Error: Application initialization failed.";
      elements.feedback.className = "feedback-area error";
      elements.feedback.style.display = "block";
    }
    return;
  }

  // Handle pre-filled content
  chrome.storage.local.get(['pendingAnswerText'], (result) => {
    if (chrome.runtime.lastError) {
      console.error("Error accessing pending data:", chrome.runtime.lastError);
    } else if (result.pendingAnswerText) {
      console.log("Pre-filling answer:", result.pendingAnswerText);
      elements.answer.value = result.pendingAnswerText;
      elements.question.focus();

      chrome.storage.local.remove('pendingAnswerText', () => {
        if (chrome.runtime.lastError) {
          console.error("Error clearing pending data:", chrome.runtime.lastError);
        } else {
          console.log("Pending data cleared.");
        }
      });
    } else {
      console.log("No pending data found.");
      elements.question.focus();
    }
  });

  // Initialize app
  storage.load();
  
  // Attach event listeners
  elements.create.addEventListener('click', eventHandlers.onCreate);
  elements.reset.addEventListener('click', eventHandlers.onReset);

  console.log("Application ready.");
});