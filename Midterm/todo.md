# Full-Stack Flashcard App - TODO Checklist (Based on Spec V1.0)

## Phase 1: Backend Setup & Foundation

### Project Structure & Dependencies
- [ ] Create root `flashcard-app` directory.
- [ ] Create `backend` subdirectory and navigate into it.
- [ ] Initialize npm project: `npm init -y`.
- [ ] Install runtime dependencies: `npm install express cors`.
- [ ] Install development dependencies: `npm install -D typescript @types/node @types/express @types/cors ts-node-dev`.
- [ ] Create `tsconfig.json` in `backend` directory with the specified content (paths, compilerOptions, etc.).
- [ ] Create source folders: `mkdir -p src/logic src/types`.
- [ ] Create initial backend files: `touch src/server.ts src/state.ts src/types/index.ts`.

### Core Logic Integration
- [ ] Copy provided `algorithm.ts` into `backend/src/logic/`.
- [ ] Copy provided `flashcards.ts` into `backend/src/logic/`.
- [ ] Verify `Flashcard` class, `AnswerDifficulty` enum, `BucketMap` type exist in `flashcards.ts`.
- [ ] Verify required functions (`practice`, `update`, `getHint`, `computeProgress`, `toBucketSets`) exist in `algorithm.ts`.

### Package Scripts
- [ ] Add `build`, `start`, and `dev` scripts to `backend/package.json`.
- [ ] Update `main` entry point in `backend/package.json` to `dist/server.js`.

## Phase 2: Backend Implementation

### Backend Types (`backend/src/types/index.ts`)
- [ ] Import `Flashcard as CoreFlashcard`, `AnswerDifficulty as CoreDifficulty`, `BucketMap as CoreBucketMap` from `@logic/flashcards`.
- [ ] Re-export `Flashcard` type alias, `BucketMap` type alias, and `AnswerDifficulty` enum.
- [ ] Define `PracticeSession` interface: `{ cards: Flashcard[]; day: number }`.
- [ ] Define `UpdateRequest` interface: `{ cardFront: string; cardBack: string; hint: string | null; tags: string[]; difficulty: AnswerDifficulty; }`.
- [ ] Define `HintRequestParams` interface (for parsed query params): `{ cardFront: string; cardBack: string; hint: string | null; tags: string[]; }`.
- [ ] Define `PracticeRecord` interface: `{ cardFront: string; cardBack: string; hint: string | null; tags: string[]; timestamp: number; difficulty: AnswerDifficulty; previousBucket: number | undefined; newBucket: number; }`.
- [ ] Define `ProgressStats` interface: `{ totalCards: number; cardsByBucket: Record<number, number>; successRate: number; averageMovesPerCard: number; totalPracticeEvents: number; }`.
- [ ] Ensure all necessary types/enums are exported.

### Backend State (`backend/src/state.ts`)
- [ ] Import `Flashcard`, `BucketMap`, `AnswerDifficulty` from `@logic/flashcards`.
- [ ] Import `PracticeRecord` from `@types/index`.
- [ ] Define `initialCards` array with the 5 specified sample `Flashcard` objects (using `new Flashcard(...)` with correct front/back/hint/tags).
- [ ] Define state variable `let currentBuckets: BucketMap = new Map();`.
- [ ] Initialize `currentBuckets` with `initialCards` in bucket 0.
- [ ] Define state variable `let practiceHistory: PracticeRecord[] = [];`.
- [ ] Define state variable `let currentDay: number = 0;`.
- [ ] Implement and export `getBuckets(): BucketMap`.
- [ ] Implement and export `setBuckets(newBuckets: BucketMap): void`.
- [ ] Implement and export `getHistory(): PracticeRecord[]`.
- [ ] Implement and export `addHistoryRecord(record: PracticeRecord): void`.
- [ ] Implement and export `getCurrentDay(): number`.
- [ ] Implement and export `incrementDay(): void`.
- [ ] Implement and export `findCard(front: string, back: string, hint: string | null, tags: string[]): Flashcard | undefined` (with correct hint/tag matching logic: null vs undefined, order-insensitive tag comparison).
- [ ] Implement and export `findCardBucket(cardToFind: Flashcard): number | undefined` (using `Set.has` or equivalent).
- [ ] Add `console.log("Initial state loaded.")` at the end of the file.

### Backend Server (`backend/src/server.ts`)
- [ ] Import `express`, `cors`.
- [ ] Import logic functions (`practice`, `update`, `getHint`, `computeProgress`, `toBucketSets`) from `@logic/algorithm`.
- [ ] Import state functions (`getCurrentDay`, `getBuckets`, `setBuckets`, `getHistory`, `addHistoryRecord`, `incrementDay`, `findCard`, `findCardBucket`) from `./state`.
- [ ] Import necessary types/enums (`Flashcard`, `AnswerDifficulty`, `PracticeSession`, `UpdateRequest`, `HintRequestParams`, `ProgressStats`, `PracticeRecord`) from `@types/index`.
- [ ] Create Express app instance.
- [ ] Define `PORT`.
- [ ] Apply middleware: `cors()`, `express.json()`.
- [ ] Add basic health check route `GET /`.
- [ ] Implement `POST /api/day/next` endpoint:
    - [ ] Import necessary state functions.
    - [ ] Define route handler with `try/catch`.
    - [ ] Call `incrementDay()`.
    - [ ] Call `getCurrentDay()`.
    - [ ] Log advancement.
    - [ ] Respond 200 OK with `{ message, currentDay }`.
    - [ ] Handle errors with 500.
- [ ] Implement `GET /api/practice` endpoint:
    - [ ] Import necessary state/logic functions and types.
    - [ ] Define route handler with `try/catch`.
    - [ ] Get day and buckets from state.
    - [ ] Convert buckets using `toBucketSets`.
    *   [ ] Call `logic.practice`.
    *   [ ] Convert result set to array.
    *   [ ] Log number of cards.
    *   [ ] Respond 200 OK with `PracticeSession` object `{ cards: cardsArray, day }`.
    *   [ ] Handle errors with 500.
- [ ] Implement `GET /api/hint` endpoint:
    - [ ] Import necessary state/logic functions and types.
    - [ ] Define route handler with `try/catch`.
    *   [ ] Extract `cardFront`, `cardBack`, `hintQuery`, `tagsQuery` from `req.query`.
    *   [ ] Validate all parameters exist (return 400 if not).
    *   [ ] Parse `hintQuery` (empty string -> null).
    *   [ ] Parse `tagsQuery` (empty string -> [], comma-separated -> array).
    *   [ ] Call `state.findCard` with parsed data.
    *   [ ] Return 404 if card not found.
    *   [ ] Call `logic.getHint`.
    *   [ ] Log request.
    *   [ ] Respond 200 OK with `{ hint: yourHint }`.
    *   [ ] Handle errors with 500.
- [ ] Implement `POST /api/update` endpoint:
    - [ ] Import necessary state/logic functions and types.
    - [ ] Define route handler with `try/catch`.
    *   [ ] Get request body (`UpdateRequest`).
    *   [ ] Validate all required fields exist and `difficulty` is valid enum value (return 400 if not).
    *   [ ] Call `state.findCard` with identifying fields from body.
    *   [ ] Return 404 if card not found.
    *   [ ] Get `currentBuckets`.
    *   [ ] Find `previousBucket` using `state.findCardBucket`.
    *   [ ] Call `logic.update`.
    *   [ ] Update state using `state.setBuckets`.
    *   [ ] Find `newBucket` using `state.findCardBucket` (on new state). Handle potential errors.
    *   [ ] Create `PracticeRecord` (with timestamp, using data from found card and body).
    *   [ ] Add record using `state.addHistoryRecord`.
    *   [ ] Log update details.
    *   [ ] Respond 200 OK with success message.
    *   [ ] Handle errors with 500.
- [ ] Implement `GET /api/progress` endpoint:
    - [ ] Import necessary state/logic functions and types.
    - [ ] Define route handler with `try/catch`.
    *   [ ] Get buckets and history from state.
    *   [ ] Call `logic.computeProgress`.
    *   [ ] Respond 200 OK with the `ProgressStats` result.
    *   [ ] Handle errors with 500.
- [ ] Start the server using `app.listen`. Include a confirmation log message.

## Phase 3: Frontend Setup

### Project Structure & Dependencies
- [ ] Navigate back to `flashcard-app` root.
- [ ] Create frontend project using Vite: `npm create vite@latest frontend -- --template react-ts`.
- [ ] Navigate into `frontend` directory.
- [ ] Install dependencies: `npm install`.
- [ ] Install Axios: `npm install axios`.
- [ ] Optional: Clean up default Vite files (`App.css`, `assets`, simplify `App.tsx`, `main.tsx`).
- [ ] Create source folders: `mkdir -p src/components src/services src/types`.
- [ ] Create initial frontend files: `touch src/components/FlashcardDisplay.tsx src/components/PracticeView.tsx src/services/api.ts src/types/index.ts`.

## Phase 4: Frontend Implementation

### Frontend Types (`frontend/src/types/index.ts`)
- [ ] Define `AnswerDifficulty` enum (matching backend).
- [ ] Define `Flashcard` interface: `{ front: string; back: string; hint: string | null; tags: string[]; }`.
- [ ] Define `PracticeSession` interface (matching backend response): `{ cards: Flashcard[]; day: number; }`.
- [ ] Define `UpdateRequest` interface (matching backend request body): `{ cardFront: string; cardBack: string; hint: string | null; tags: string[]; difficulty: AnswerDifficulty; }`.
- [ ] Define `ProgressStats` interface (matching backend response): `{ totalCards: number; cardsByBucket: Record<number, number>; successRate: number; averageMovesPerCard: number; totalPracticeEvents: number; }`.
- [ ] Ensure all necessary types/enums are exported.

### Frontend API Service (`frontend/src/services/api.ts`)
- [ ] Import `axios`.
- [ ] Import necessary types from `../types`.
- [ ] Define `API_BASE_URL` ('http://localhost:3001/api').
- [ ] Create Axios instance `apiClient`.
- [ ] Implement and export `fetchPracticeCards(): Promise<PracticeSession>`. (GET /practice)
- [ ] Implement and export `submitAnswer(card: Flashcard, difficulty: AnswerDifficulty): Promise<void>`. (POST /update, construct body correctly).
- [ ] Implement and export `fetchHint(card: Flashcard): Promise<string>`. (GET /hint, construct query params correctly: handle null hint -> "", empty tags -> "").
- [ ] Implement and export `fetchProgress(): Promise<ProgressStats>`. (GET /progress)
- [ ] Implement and export `advanceDay(): Promise<{ currentDay: number }>`. (POST /day/next)
- [ ] Ensure functions return `response.data` where appropriate.

### Frontend Components
- [ ] **`FlashcardDisplay.tsx`**:
    - [ ] Import React, useState, types, `fetchHint`.
    - [ ] Define `Props` interface: `{ card: Flashcard; showBack: boolean; }`.
    - [ ] Implement state: `hint`, `loadingHint`, `hintError`.
    - [ ] Implement `handleGetHint` async function (calls `fetchHint`, updates state, handles errors).
    - [ ] Render `card.front`.
    - [ ] Render `card.back` or '???' based on `showBack`.
    - [ ] Render "Get Hint" button conditionally (disabled while loading, calls `handleGetHint`).
    - [ ] Display fetched `hint` or `hintError`.
    - [ ] Add basic styling placeholders if needed.
- [ ] **`PracticeView.tsx`**:
    - [ ] Import React, useState, useEffect, types, API services, `FlashcardDisplay`.
    - [ ] Implement state: `practiceCards`, `currentCardIndex`, `showBack`, `isLoading`, `error`, `day`, `sessionFinished`.
    - [ ] Implement `loadPracticeCards` async function (calls `fetchPracticeCards`, updates state, handles errors/empty session).
    - [ ] Implement `useEffect` hook to call `loadPracticeCards` on mount.
    - [ ] Implement `handleShowBack` function.
    - [ ] Implement `handleAnswer(difficulty: AnswerDifficulty)` async function (calls `submitAnswer`, updates state/index/finished, handles errors).
    - [ ] Implement `handleNextDay` async function (calls `advanceDay`, then `loadPracticeCards`, updates state, handles errors).
    - [ ] Implement rendering logic:
        - [ ] Loading state display.
        - [ ] Error state display.
        - [ ] Session finished display ("Session Complete", "Go to Next Day" button calling `handleNextDay`, disable button while loading).
        - [ ] Active session display:
            - [ ] Day number and card count.
            - [ ] `<FlashcardDisplay>` component.
            - [ ] Conditional "Show Answer" button (calls `handleShowBack`).
            - [ ] Conditional Difficulty buttons (calls `handleAnswer`).
- [ ] **`App.tsx`**:
    - [ ] Import React, `PracticeView`.
    - [ ] Render main title `<h1>Flashcard Learner</h1>`.
    - [ ] Render `<PracticeView />`.
- [ ] **`main.tsx`**:
    - [ ] Ensure imports (`React`, `ReactDOM`, `App`, CSS) are correct.
    - [ ] Ensure `ReactDOM.createRoot` renders `<App />` correctly (likely default).

## Phase 5: Running & Testing

- [ ] Start the backend server: `cd backend && npm run dev`. Verify log message.
- [ ] Start the frontend server: `cd frontend && npm run dev`. Verify browser opens or URL is shown.
- [ ] Perform manual testing as outlined in the specification (Section 12).
    - [ ] Initial load.
    - [ ] Show Answer.
    - [ ] Get Hint.
    - [ ] Submit difficulties.
    - [ ] Session completion.
    - [ ] Next Day.
    - [ ] Check backend logs for API calls and state changes.
    - [ ] Check frontend for loading/error states.

## Final Review
- [ ] Review code for clarity, consistency, and adherence to the specification.
- [ ] Check for any unhandled errors or edge cases missed.
- [ ] Ensure types are consistent between frontend and backend API contracts.