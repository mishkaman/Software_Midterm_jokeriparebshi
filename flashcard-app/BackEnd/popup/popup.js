console.log("Study Card Creator: Application script initialized.");

// DOM element references
const questionInput = document.getElementById("question-side");
const answerInput = document.getElementById("answer-side");
const memoryHintInput = document.getElementById("memory-hint");
const categoryInput = document.getElementById("category-tags");
const createButton = document.getElementById("create-card");
const resetButton = document.getElementById("reset-form");
const feedbackDisplay = document.getElementById("feedback-display");
const cardCollection = document.getElementById("card-collection");

// Utility function to sanitize text content
function sanitizeText(text) {
  if (!text) return '';
  const tempElement = document.createElement('div');
  tempElement.appendChild(document.createTextNode(text));
  return tempElement.innerHTML;
}

// Display feedback messages to user
function displayFeedback(text, category = "info") {
  console.log(`Displaying feedback (${category}): ${text}`);
  if (feedbackDisplay) {
    feedbackDisplay.textContent = text;
    feedbackDisplay.className = `feedback-area ${category}`;
    feedbackDisplay.style.display = "block";

    setTimeout(() => {
      feedbackDisplay.textContent = '';
      feedbackDisplay.style.display = "none";
      feedbackDisplay.className = 'feedback-area';
    }, 3000);
  } else {
    console.error("Feedback display element not found!");
  }
}

// Reset all form inputs
function resetFormInputs() {
  console.log("Resetting form inputs");
  if (questionInput) questionInput.value = "";
  if (answerInput) answerInput.value = "";
  if (memoryHintInput) memoryHintInput.value = "";
  if (categoryInput) categoryInput.value = "";
}

// Display previously created study cards
function displayCardHistory(studyCards = []) {
  if (!cardCollection) {
    console.error("Card collection element not found!");
    return;
  }
  cardCollection.innerHTML = '';

  if (studyCards.length === 0) {
    cardCollection.innerHTML = "<p>No study cards have been created yet.</p>";
    return;
  }

  const recentCards = studyCards.slice(0, 5);

  recentCards.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-item';

    let categoryDisplay = '';
    if (card.categories && card.categories.length > 0) {
      categoryDisplay = `<div class="categories">${card.categories.map(cat => `<span class="category-tag">${sanitizeText(cat)}</span>`).join(' ')}</div>`;
    } else {
      categoryDisplay = `<div class="categories"><span class="category-tag">uncategorized</span></div>`;
    }

    const creationDate = card.createdAt ? new Date(card.createdAt).toLocaleString() : 'Unknown';

    cardDiv.innerHTML = `
      <div class="card-content">
        <div><strong>Question:</strong> ${sanitizeText(card.question)}</div>
        <div><strong>Answer:</strong> ${sanitizeText(card.answer)}</div>
        ${card.memoryAid ? `<div><strong>Memory Aid:</strong> ${sanitizeText(card.memoryAid)}</div>` : ''}
        <div><strong>Categories:</strong> ${categoryDisplay}</div>
        <div><strong>Level:</strong> ${card.level}</div>
        <div class="creation-time">Created: ${creationDate}</div>
      </div>
    `;
    cardCollection.appendChild(cardDiv);
  });
}

// Load and display existing study cards
async function loadCardHistory() {
  console.log("Loading card history...");
  try {
    const storageResult = await chrome.storage.local.get({ studyCards: [] });
    console.log("Retrieved study cards from storage:", storageResult.studyCards);
    displayCardHistory(storageResult.studyCards);
  } catch (error) {
    console.error("Error retrieving study cards:", error);
    if (chrome.runtime.lastError) {
      console.error("Chrome runtime error:", chrome.runtime.lastError.message);
      displayFeedback(`Error loading cards: ${chrome.runtime.lastError.message}`, "error");
    } else {
      displayFeedback("Failed to load card history.", "error");
    }
    displayCardHistory([]);
  }
}

// Handle card creation
async function handleCardCreation(event) {
  event.preventDefault();
  console.log("Create card button activated");

  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();
  const memoryAid = memoryHintInput.value.trim();
  const categories = categoryInput.value.trim().split(';')
    .map(category => category.trim())
    .filter(category => category.length > 0);
  const level = 0; // Starting level for spaced repetition

  if (!question || !answer) {
    displayFeedback("Both question and answer fields must be filled.", "error");
    return;
  }

  const newStudyCard = {
    id: Date.now(),
    question: question,
    answer: answer,
    memoryAid: memoryAid,
    categories: categories,
    level: level,
    createdAt: new Date().toISOString()
  };

  console.log("Preparing to save new study card:", newStudyCard);

  try {
    const storageResult = await chrome.storage.local.get({ studyCards: [] });
    let allCards = storageResult.studyCards || [];

    allCards.unshift(newStudyCard);

    await chrome.storage.local.set({ studyCards: allCards });

    console.log("Study card saved successfully.");
    displayFeedback("Study card created successfully!", "success");
    resetFormInputs();
    loadCardHistory();

    setTimeout(() => window.close(), 1200);

  } catch (error) {
    console.error("Error saving study card:", error);
    if (chrome.runtime.lastError) {
      console.error("Chrome runtime error:", chrome.runtime.lastError.message);
      displayFeedback(`Save failed: ${chrome.runtime.lastError.message}`, "error");
    } else {
      displayFeedback("An error occurred during save operation.", "error");
    }
  }
}

// Handle form reset
function handleFormReset() {
  console.log("Reset form button activated");
  resetFormInputs();
  displayFeedback("Form has been reset.", "info");
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log("Study Card Creator DOM loaded and ready.");

  // Verify all required elements exist
  if (!questionInput || !answerInput || !memoryHintInput || !categoryInput || 
      !createButton || !resetButton || !feedbackDisplay || !cardCollection) {
    console.error("Critical DOM elements are missing!");
    if (feedbackDisplay) {
      feedbackDisplay.textContent = "Error: Application failed to initialize properly.";
      feedbackDisplay.className = "feedback-area error";
      feedbackDisplay.style.display = "block";
    }
    return;
  }

  // Check for pre-filled content from context menu
  chrome.storage.local.get(['pendingAnswerText'], (result) => {
    if (chrome.runtime.lastError) {
      console.error("Error retrieving pending answer text:", chrome.runtime.lastError);
    } else if (result.pendingAnswerText) {
      console.log("Found pending answer text:", result.pendingAnswerText);
      answerInput.value = result.pendingAnswerText;
      questionInput.focus();

      chrome.storage.local.remove('pendingAnswerText', () => {
        if (chrome.runtime.lastError) {
          console.error("Error clearing pending answer text:", chrome.runtime.lastError);
        } else {
          console.log("Pending answer text cleared from storage.");
        }
      });
    } else {
      console.log("No pending answer text found.");
      questionInput.focus();
    }
  });

  // Load existing cards
  loadCardHistory();

  // Attach event listeners
  createButton.addEventListener('click', handleCardCreation);
  resetButton.addEventListener('click', handleFormReset);

  console.log("Study Card Creator initialization completed. Event handlers registered.");
});