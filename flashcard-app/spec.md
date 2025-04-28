Okay, I have compiled our discussion into the detailed specification document below. A developer should be able to use this to build the Full-Stack Flashcard Web Application.

Full-Stack Flashcard Web Application - Specification

Version: 1.0
Date: 2024-07-27

Table of Contents:

Introduction

Goals

Non-Goals

Technology Stack

Architecture Overview

Project Structure

Core Logic Integration

Data Models

Backend Specification

State Management (state.ts)

API Endpoints

Backend Types (types/index.ts)

Frontend Specification

API Service (services/api.ts)

Components

Frontend Types (types/index.ts)

Error Handling

Testing Plan

Setup and Running Instructions

Future Considerations

1. Introduction

This document specifies the requirements and design for a Full-Stack Flashcard Web Application. The application allows users to practice flashcards using a spaced repetition algorithm (Modified-Leitner) provided via existing TypeScript logic files (algorithm.ts, flashcards.ts). The system will consist of a Node.js/Express backend serving a React frontend. State will be managed in-memory on the backend for this version.

2. Goals

Implement a functional backend API exposing flashcard practice, update, hint, progress, and day-advancement functionalities based on the provided algorithm logic.

Implement a functional frontend user interface allowing users to view and practice flashcards for the current day.

Display hints for flashcards upon request.

Allow users to mark their answer difficulty (Easy, Medium, Hard) for each card, updating the card's position in the spaced repetition buckets.

Allow users to advance to the next day in the simulation.

Provide a basic mechanism to view overall progress statistics (though the UI for this is deferred).

Ensure clear separation between backend logic, state, API, and frontend presentation.

3. Non-Goals (Out of Scope for this Version)

User authentication or multiple user accounts.

Persistent storage (database, file storage) - state resets on server restart.

Frontend UI for displaying detailed progress statistics (ProgressView.tsx).

Frontend routing (only the PracticeView will be implemented).

Adding, editing, or deleting flashcards via the UI.

Advanced styling or use of UI component libraries.

Implementation of the Browser Extension (deferred to a separate specification).

Production deployment considerations (environment variables, security hardening beyond basic CORS).

4. Technology Stack

Backend: Node.js, Express, TypeScript

Frontend: React, Vite, TypeScript, Axios

Core Logic: Pre-existing algorithm.ts and flashcards.ts files.

Package Manager: npm (or yarn)

5. Architecture Overview

Backend: An Express server handles API requests. It uses in-memory state management (state.ts) and interacts with the core flashcard logic (logic/algorithm.ts, logic/flashcards.ts).

Frontend: A React single-page application (SPA) built with Vite interacts with the backend API via Axios requests. It displays flashcards and allows user interaction for practice sessions.

Communication: Frontend sends HTTP requests (GET, POST) to the backend API endpoints. Backend responds with JSON data. CORS middleware allows communication between the frontend (running on a different port during development) and the backend.

6. Project Structure
flashcard-app/
├── backend/
│   ├── dist/                     # Compiled JavaScript output
│   ├── node_modules/
│   ├── src/
│   │   ├── logic/                # Core algorithm/flashcard logic
│   │   │   ├── algorithm.ts      # PROVIDED - Your core logic functions
│   │   │   └── flashcards.ts     # PROVIDED - Flashcard class, types
│   │   ├── types/
│   │   │   └── index.ts          # Backend-specific and shared API types
│   │   ├── server.ts             # Express server setup and API routes
│   │   └── state.ts              # In-memory state management
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
└── frontend/
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── components/           # React components
    │   │   ├── FlashcardDisplay.tsx
    │   │   └── PracticeView.tsx
    │   ├── services/             # API interaction logic
    │   │   └── api.ts
    │   ├── types/                # Frontend-specific types
    │   │   └── index.ts
    │   ├── App.tsx               # Main application component
    │   ├── main.tsx              # Application entry point
    │   └── index.css             # Basic styling (or remove if unused)
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts

7. Core Logic Integration

The application relies on the provided algorithm.ts and flashcards.ts files placed in backend/src/logic/. The backend directly calls the following functions from algorithm.ts:

practice(bucketSets: Array<Set<Flashcard>>, day: number): Set<Flashcard>

Input: An array of Sets representing the flashcard buckets, and the current day number.

Output: A Set<Flashcard> containing the cards to be practiced on the given day.

update(buckets: BucketMap, card: Flashcard, difficulty: AnswerDifficulty): BucketMap

Input: The current BucketMap, the specific Flashcard object being updated, and the AnswerDifficulty selected by the user.

Output: A new BucketMap reflecting the card's movement between buckets based on the difficulty. The original buckets map is not modified.

getHint(card: Flashcard): string

Input: The specific Flashcard object.

Output: The hint string stored on the card, or the fallback string "No hint available for this card." if the card has no hint. Never returns null or undefined.

computeProgress(buckets: BucketMap, history: PracticeRecord[]): ProgressStats

Input: The current BucketMap and an array of PracticeRecord objects. The implementation currently only requires cardFront, cardBack, and difficulty from each PracticeRecord.

Output: A ProgressStats object containing calculated statistics about the learning progress.

toBucketSets(bucketsMap: BucketMap): Array<Set<Flashcard>>

Input: A BucketMap.

Output: An Array<Set<Flashcard>> suitable for passing to the practice function.

8. Data Models

These are the primary data structures used throughout the application. Types should be defined consistently in both backend (backend/src/types/index.ts) and frontend (frontend/src/types/index.ts), accounting for JSON serialization differences (e.g., undefined vs. null).

Flashcard (from flashcards.ts)

Internal Backend Representation:

class Flashcard {
  front: string;
  back: string;
  hint?: string; // Stored as undefined if absent
  tags: string[]; // Stored as [] if absent
  constructor(front: string, back: string, hint?: string, tags?: string[]);
  // ... potentially other methods
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Frontend Representation (frontend/src/types/index.ts):

interface Flashcard {
  front: string;
  back: string;
  hint: string | null; // Reflects JSON null for missing hint
  tags: string[];      // Always an array, possibly empty
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

AnswerDifficulty (from flashcards.ts)

An enum representing the user's assessment of difficulty.

enum AnswerDifficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Note: Ensure the string values ("Easy", "Medium", "Hard") are used consistently in API requests/responses and frontend UI.

BucketMap (from flashcards.ts)

A map representing the Leitner buckets.

type BucketMap = Map<number, Set<Flashcard>>; // Key: bucket number, Value: Set of cards
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

PracticeRecord (defined in backend/src/types/index.ts)

Represents a single historical practice event for a card. Stored in backend state.

interface PracticeRecord {
  cardFront: string;
  cardBack: string;
  hint: string | null; // Match Flashcard representation at time of practice
  tags: string[];      // Match Flashcard representation at time of practice
  timestamp: number;   // Unix timestamp (ms) of when the answer was submitted
  difficulty: AnswerDifficulty;
  previousBucket: number | undefined; // Bucket *before* the update (undefined if new card?)
  newBucket: number;       // Bucket *after* the update
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Note: While computeProgress may currently only use a subset of these fields, storing the full record allows for future enhancements.

ProgressStats (defined in backend and frontend types)

Represents the output structure of the computeProgress function.

interface ProgressStats {
  totalCards: number;                   // Total flashcards across all buckets
  cardsByBucket: Record<number, number>; // Count of cards per bucket number (e.g., { 0: 5, 1: 2 })
  successRate: number;                  // Percentage (0-100) of correct (Easy/Hard) answers in history
  averageMovesPerCard: number;          // Avg. number of practices per unique card in history
  totalPracticeEvents: number;          // Total number of records in history
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END
9. Backend Specification
9.1 State Management (state.ts)

Responsibility: Manages the application state (buckets, history, current day) in memory. State is lost on server restart.

Initial State:

currentDay: Initialized to 0.

initialCards: An array containing 5 sample Flashcard objects (as defined in Q&A response: France, H2O, 2+2x2, Hola, Pride and Prejudice, with specified hints/tags).

currentBuckets: A BucketMap initialized with bucket 0 containing a Set of all initialCards. Other buckets are initially empty.

practiceHistory: An empty array PracticeRecord[], initialized as [].

Functions:

getBuckets(): BucketMap

setBuckets(newBuckets: BucketMap): void

getHistory(): PracticeRecord[]

addHistoryRecord(record: PracticeRecord): void

getCurrentDay(): number

incrementDay(): void

findCard(front: string, back: string, hint: string | null, tags: string[]): Flashcard | undefined

Iterates through all cards in currentBuckets.

Returns the first Flashcard instance that exactly matches all provided parameters.

Hint Matching: Matches if request.hint (string) equals card.hint (string) OR if request.hint is null and card.hint is undefined.

Tags Matching: Matches if request.tags (array) contains the same strings as card.tags (array), irrespective of order, and considering empty arrays [] as equal. Sort both arrays before comparison.

findCardBucket(cardToFind: Flashcard): number | undefined

Iterates through currentBuckets to find which bucket number a specific Flashcard instance belongs to. Uses object reference equality or the unique combination of all fields for comparison if necessary.

9.2 API Endpoints

Base URL: /api

Middleware: cors(), express.json()

Error Handling: Use try...catch blocks. Return appropriate HTTP status codes (200, 400, 404, 500) with JSON error messages { "error": "message" }.

1. GET /api/practice
* Description: Gets the list of flashcards to practice for the current day.
* Request: None
* Logic:
1. Get currentDay from state.getCurrentDay().
2. Get currentBuckets from state.getBuckets().
3. Convert currentBuckets to Array<Set<Flashcard>> using logic.toBucketSets().
4. Call logic.practice() with the bucket sets and day.
5. Convert the resulting Set<Flashcard> to an array (cardsArray).
6. Log the number of cards found.
* Response:
* 200 OK: { cards: Flashcard[], day: number } (Cards will be serialized, hint: undefined becomes null).
* 500 Internal Server Error: If an unexpected error occurs.

2. POST /api/update
* Description: Updates a flashcard's bucket based on user-provided difficulty after practicing. Records the event in history.
* Request Body: UpdateRequest (JSON)
typescript interface UpdateRequest { cardFront: string; cardBack: string; hint: string | null; // null if card has no hint tags: string[]; // [] if card has no tags difficulty: AnswerDifficulty; // "Easy", "Medium", or "Hard" }
* Validation:
* All fields (cardFront, cardBack, hint, tags, difficulty) are mandatory. Return 400 Bad Request if any are missing or null (except hint which can be null).
* difficulty must be a valid value from the AnswerDifficulty enum. Return 400 Bad Request if not.
* Logic:
1. Validate request body.
2. Use state.findCard() with all identifying fields (cardFront, cardBack, hint, tags) to find the exact Flashcard instance. Return 404 Not Found if no exact match.
3. Get currentBuckets from state.getBuckets().
4. Find previousBucket using state.findCardBucket(card).
5. Call logic.update() with currentBuckets, the found card, and difficulty. This returns newBuckets.
6. Update state using state.setBuckets(newBuckets).
7. Find newBucket using the new state: state.findCardBucket(card) (or infer from newBuckets before setting state).
8. Create a PracticeRecord with all required fields (front, back, hint, tags from the found card, current timestamp, difficulty, previousBucket, newBucket).
9. Add the record using state.addHistoryRecord().
10. Log the update details.
* Response:
* 200 OK: { "message": "Card updated successfully" }
* 400 Bad Request: If validation fails.
* 404 Not Found: If the specified card is not found.
* 500 Internal Server Error: If an unexpected error occurs.

3. GET /api/hint
* Description: Gets the hint for a specific flashcard.
* Request Query Parameters: HintRequest (derived from query params)
* cardFront: string (mandatory)
* cardBack: string (mandatory)
* hint: string (send empty string "" if card's hint is undefined/null)
* tags: string (comma-separated list, e.g., tag1,tag2. Send empty string "" if card has no tags)
* Backend needs to parse hint (empty string becomes null) and tags (split comma-separated string, handle empty string becoming []).
* Validation:
* All query parameters (cardFront, cardBack, hint, tags) are mandatory. Return 400 Bad Request if any are missing.
* Logic:
1. Validate query parameters. Parse hint and tags.
2. Use state.findCard() with the parsed identifying fields to find the exact Flashcard instance. Return 404 Not Found if no exact match.
3. Call logic.getHint() with the found card.
4. Log the request.
* Response:
* 200 OK: { hint: string } (Returns the hint text or the "No hint available..." message).
* 400 Bad Request: If validation fails.
* 404 Not Found: If the specified card is not found.
* 500 Internal Server Error: If an unexpected error occurs.

4. GET /api/progress
* Description: Gets overall progress statistics.
* Request: None
* Logic:
1. Get currentBuckets from state.getBuckets().
2. Get practiceHistory from state.getHistory().
3. Call logic.computeProgress() with currentBuckets and practiceHistory.
* Response:
* 200 OK: ProgressStats object (JSON representation).
* 500 Internal Server Error: If an unexpected error occurs.

5. POST /api/day/next
* Description: Advances the simulation to the next day.
* Request: None
* Logic:
1. Call state.incrementDay().
2. Get the newDay from state.getCurrentDay().
3. Log the day advancement.
* Response:
* 200 OK: { message: "Advanced to next day", currentDay: number }
* 500 Internal Server Error: If an unexpected error occurs.

9.3 Backend Types (types/index.ts)

Define all shared types here, including Flashcard (internal version if needed), AnswerDifficulty, BucketMap, PracticeRecord, ProgressStats, PracticeSession, UpdateRequest, HintRequest (interface representing parsed query params). Export all necessary types.

// backend/src/types/index.ts
import { Flashcard as CoreFlashcard, AnswerDifficulty as CoreDifficulty, BucketMap as CoreBucketMap } from '@logic/flashcards';

// Re-export core types for consistency
export type Flashcard = CoreFlashcard;
export type BucketMap = CoreBucketMap;
export const AnswerDifficulty = CoreDifficulty; // Export enum itself

// API Specific Types
export interface PracticeSession {
  cards: Flashcard[]; // Note: Serialized version, hint will be string | null
  day: number;
}

export interface UpdateRequest {
  cardFront: string;
  cardBack: string;
  hint: string | null;
  tags: string[];
  difficulty: CoreDifficulty; // Use the imported enum type
}

// Interface representing the expected structure *after parsing* query params
export interface HintRequestParams {
    cardFront: string;
    cardBack: string;
    hint: string | null; // Parsed from query string
    tags: string[];      // Parsed from query string
}


export interface PracticeRecord {
  cardFront: string;
  cardBack: string;
  hint: string | null;
  tags: string[];
  timestamp: number;
  difficulty: CoreDifficulty;
  previousBucket: number | undefined;
  newBucket: number;
}

export interface ProgressStats {
  totalCards: number;
  cardsByBucket: Record<number, number>;
  successRate: number;
  averageMovesPerCard: number;
  totalPracticeEvents: number;
}

// Add other types as needed...
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END
10. Frontend Specification
10.1 API Service (services/api.ts)

Responsibility: Centralizes all communication with the backend API using Axios.

Base URL: http://localhost:3001/api (matches backend port).

Functions (async, return Promises):

fetchPracticeCards(): Promise<PracticeSession>

Sends GET /api/practice.

Returns response.data.

submitAnswer(card: Flashcard, difficulty: AnswerDifficulty): Promise<void>

Constructs the UpdateRequest body using all fields from the provided card object (card.front, card.back, card.hint, card.tags) and the difficulty.

Sends POST /api/update with the constructed body.

fetchHint(card: Flashcard): Promise<string>

Constructs query parameters: cardFront, cardBack, hint (send empty string "" if card.hint is null), tags (join card.tags array with comma, send empty string "" if array is empty).

Sends GET /api/hint with these query parameters.

Returns response.data.hint.

fetchProgress(): Promise<ProgressStats>

Sends GET /api/progress.

Returns response.data.

advanceDay(): Promise<{ currentDay: number }>

Sends POST /api/day/next.

Returns response.data.

Error Handling: Functions should let Axios errors propagate or catch them and re-throw/handle as appropriate for the UI layer.

10.2 Components

FlashcardDisplay.tsx

Props: { card: Flashcard; showBack: boolean; }

State: hint: string | null, loadingHint: boolean, hintError: string | null.

Functionality:

Displays card.front.

Displays card.back or '???' based on showBack.

Conditionally shows a "Get Hint" button (only if showBack is false).

onClick: Calls an internal handleGetHint async function.

handleGetHint: Sets loading state, calls api.fetchHint(props.card), updates hint, hintError, loading state. Disables button while loading.

Displays the fetched hint or hintError.

PracticeView.tsx

State: practiceCards: Flashcard[], currentCardIndex: number, showBack: boolean, isLoading: boolean, error: string | null, day: number, sessionFinished: boolean.

Functionality:

useEffect (mount): Calls loadPracticeCards.

loadPracticeCards: Sets loading, calls api.fetchPracticeCards, updates state (practiceCards, day, isLoading, error, sessionFinished based on response).

handleShowBack: Sets showBack = true.

handleAnswer(difficulty: AnswerDifficulty): Gets current card, calls api.submitAnswer(currentCard, difficulty), increments currentCardIndex or sets sessionFinished, resets showBack = false, handles errors.

handleNextDay: Calls api.advanceDay, then calls loadPracticeCards on success, handles errors.

Rendering:

Shows loading/error states.

If sessionFinished: Shows completion message and "Go to Next Day" button (calls handleNextDay).

If not finished:

Displays current day and card progress (currentCardIndex + 1 of practiceCards.length).

Renders <FlashcardDisplay card={currentCard} showBack={showBack} />.

Conditionally renders "Show Answer" button OR the difficulty buttons ("Easy", "Medium", "Hard").

App.tsx

Functionality: Renders the main title (<h1>) and the <PracticeView /> component.

10.3 Frontend Types (types/index.ts)

Define types mirroring the backend API responses and data structures needed by the components.

// frontend/src/types/index.ts

// Must match the enum definition/values used in the backend/API
export enum AnswerDifficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

// Must match the structure received from the backend API
export interface Flashcard {
  front: string;
  back: string;
  hint: string | null; // Matches JSON structure (null, not undefined)
  tags: string[];      // Always an array, potentially empty
}

// Matches the response structure of GET /api/practice
export interface PracticeSession {
  cards: Flashcard[];
  day: number;
}

// Matches the request structure for POST /api/update (used by api service)
export interface UpdateRequest {
    cardFront: string;
    cardBack: string;
    hint: string | null;
    tags: string[];
    difficulty: AnswerDifficulty;
}

// Matches the response structure of GET /api/progress
export interface ProgressStats {
  totalCards: number;
  cardsByBucket: Record<number, number>;
  successRate: number;
  averageMovesPerCard: number;
  totalPracticeEvents: number;
}

// Add other types as needed...
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END
11. Error Handling

Backend:

Validate incoming API requests (required fields, data types, enum values). Return 400 Bad Request with a descriptive { "error": "message" } JSON body for validation errors.

Use state.findCard for lookups in /api/update and /api/hint. Return 404 Not Found with { "error": "Card not found" } if no exact match is found.

Wrap main logic in try...catch blocks. For unexpected errors, return 500 Internal Server Error with a generic { "error": "Internal server error" } message. Log the actual error server-side for debugging.

Frontend:

Use try...catch blocks around API calls in the api.ts service or in the component functions that call them.

Update component state (isLoading, error) to provide feedback to the user (e.g., display error messages, disable buttons during loading).

Handle specific errors where necessary (e.g., inform user if card update failed).

12. Testing Plan

Backend:

Unit Tests: (Optional but recommended) Write unit tests for helper functions in state.ts (especially findCard, findCardBucket) and potentially for the core logic functions if not already tested.

API Tests: Use tools like Postman, Insomnia, or curl to manually send requests to each API endpoint (/practice, /update, /hint, /progress, /day/next) with valid and invalid data. Verify responses (status codes, JSON bodies) and check backend console logs for expected output and errors. Check that state (currentDay, practiceHistory, card placement in currentBuckets) is updated correctly after relevant API calls.

Frontend:

Manual Testing: Run the backend and frontend servers simultaneously. Open the application in a browser.

Verify initial card loading.

Test the "Show Answer" button.

Test the "Get Hint" button (check console for requests, UI for hint display/errors).

Test submitting answers with different difficulties ("Easy", "Medium", "Hard"). Check backend logs for update requests and history recording.

Complete a practice session and verify the "Session Complete" message appears.

Test the "Go to Next Day" button and verify that new cards are loaded for the next day (or session completes immediately if no cards are due).

Check for appropriate loading and error messages in the UI.

Component Tests: (Optional but recommended) Use libraries like React Testing Library to write tests for individual components (FlashcardDisplay, PracticeView) to verify rendering and basic interactions without needing the full API.

13. Setup and Running Instructions

Follow the steps outlined in the original README.md document (Phases 1, 3, 5) for setting up the project structure, installing dependencies, configuring TypeScript, and running the backend and frontend development servers concurrently in separate terminals.

Backend: cd backend && npm install && npm run dev (Starts on port 3001)

Frontend: cd frontend && npm install && npm run dev (Starts on port 5173 or similar)

Access the frontend URL provided by Vite in your browser.

14. Future Considerations

Persistence: Replace in-memory state (state.ts) with a database (e.g., MongoDB, PostgreSQL with Prisma/TypeORM) or file storage.

Progress UI: Implement ProgressView.tsx component to fetch and display data from /api/progress.

Routing: Add react-router-dom to navigate between Practice and Progress views.

Card Management: Implement backend API endpoints (CRUD operations) and corresponding frontend UI for users to add, edit, and delete their own flashcards. This will require careful handling of unique card identification and potential duplicates.

Styling: Apply CSS rules or integrate a UI library (Material UI, Chakra UI, Tailwind CSS) for improved aesthetics.

User Authentication: Implement user accounts and authentication to support multiple users.

Browser Extension: Develop the browser extension as a separate project, defining its specific requirements, APIs (potentially new ones on the backend), and interactions (Specification Deferred).

This concludes the specification document based on our iterative discussion. Let me know if you need any further adjustments!