# Project Architecture & Code Breakdown: SkillSync AI

This document provides a highly detailed developer guide explaining the files, endpoints, and codebase logic for **SkillSync AI**. It outlines what each module is designed for, how they integrate, and the algorithmic logic behind the core features.

---

## 🚀 Architecture & Tech Stack

SkillSync AI is built on the following technologies:
1. **Next.js App Router (v16.2.9)**: Manages pages, layouts, and serverless API handlers.
2. **Tailwind CSS (v4)**: Modern utility styling with CSS variables.
3. **Zustand (v5)**: Lightweight, reactive global client state management.
4. **Groq API**: Large Language Model server integration running `llama-3.3-70b-versatile`.
5. **Framer Motion (v12)**: Fluid transitions and UI micro-animations.
6. **Lucide React (v1)**: Icon set for visual anchors.
7. **PDF.js & Mammoth**: Client-side document parsers for PDF and Word files.

---

## 📁 1. Global State Management (`/src/store`)

### 🛠️ [useStore.ts](file:///c:/Users/Dev/.gemini/antigravity/scratch/skillgap-bridge/src/store/useStore.ts)
The store manages the state of the user's progress. It tracks files uploaded, roles selected, API analysis results, current interview questions, mock answers, recommendations, and role comparisons.

#### Key Types & Interfaces:
* `SkillGapAnalysis`:
  - `matchPercentage` (number): Overall compatibility rating.
  - `matchedSkills` (string[]): Skills the user already has.
  - `missingSkills` (string[]): Skills the user needs to acquire.
  - `categoryBreakdown` (array of category/score objects): Performance across categories (e.g., Frontend, DevOps).
  - `actionPlan` (string[]): Step-by-step career path guides.
* `InterviewQuestion`:
  - `id` (number), `question` (string), `type` ('technical' | 'behavioral'), `difficulty` ('Basic' | 'Intermediate' | 'Advanced'), `idealAnswer` (string), `userAnswer` (string), `feedback` (string), `score` (number).
* `RecommendationsData`: Course, project, and certification guidelines.
* `CompareRoleFit`: Side-by-side job matching data structure.

#### Key Functions and State Transitions:
1. **`setResume(text, fileName)`**: Saves parsed text from files and records the filename.
2. **`setTargetRole(role)`**: Saves the job title standardizing search criteria.
3. **`updateUserAnswer(questionId, answer)`**: Updates individual candidate answers in real time as they type in the interview wizard.
4. **`updateQuestionFeedback(questionId, feedback, score)`**: Updates grading reports for specific interview cards.
5. **`loadMockData()`**: Hydrates the state with pre-populated values to let users test all dashboards offline without requiring Groq API credentials.

---

## 📁 2. Backend Serverless API Endpoints (`/src/app/api`)

### 🧠 [analyze/route.ts](file:///c:/Users/Dev/.gemini/antigravity/scratch/skillgap-bridge/src/app/api/analyze/route.ts)
* **Purpose**: Coordinates resume parsing results into career steps.
* **Process Flow**:
  1. Receives `resumeText`, `jobRole`, and `jobDescription` via a client `POST` request.
  2. Pulls the `GROQ_API_KEY` from environment variables.
  3. If API keys are set, it queries Groq using a detailed system prompt demanding a strict, pre-formatted JSON structure.
  4. Contains system prompt rules:
     - Recommends only **free** learning materials.
     - Ensures links generate valid redirect URLs (e.g. YouTube search queries: `https://www.youtube.com/results?search_query=...`).
  5. If the request fails or no API key is found, the server fallback redirects standard mock responses to prevent breaking the flow.

### 🎭 [interview/route.ts](file:///c:/Users/Dev/.gemini/antigravity/scratch/skillgap-bridge/src/app/api/interview/route.ts)
* **Purpose**: Generates dynamic questions tailored to fill the candidate's specific skill gaps.
* **Process Flow**:
  1. Requests 5 questions categorized into technical/behavioral topics and difficulty grades.
  2. **Offline Fallback Algorithm**: If the Groq connection is offline, it performs local checks using the target role string. If it detects frontend/development terms, it serves frontend mock interview cards; if it detects management terms, it serves PM cards; otherwise, it uses general fallback items.

### 📝 [interview/grade/route.ts](file:///c:/Users/Dev/.gemini/antigravity/scratch/skillgap-bridge/src/app/api/interview/grade/route.ts)
* **Purpose**: Evaluates candidate responses against ideal criteria.
* **Process Flow**:
  1. Compares `question`, `idealAnswer`, and `userAnswer`.
  2. Queries Groq for an evaluation score (0-100) and actionable advice.
  3. **Offline Grading Algorithm**: If offline, it calculates scores using local heuristics:
     - Assigns a base score of 40.
     - Awards length bonuses: +15 points for answers >80 characters, +25 points for >200 characters.
     - Performs keyword extraction on the `idealAnswer` (removing short words and symbols) and matches them against the user's answer, awarding +6 points per match (capped at 35).
     - Returns a score and custom feedback message based on the calculated brackets (e.g. >=85 is "Outstanding", >=70 is "Solid").

---

## 📁 3. Application Pages & Views (`/src/app`)

### 🎛️ [layout.tsx](file:///c:/Users/Dev/.gemini/antigravity/scratch/skillgap-bridge/src/app/layout.tsx)
* **Core Role**: Standard document tree wrapper.
* **Design & Theme Logic**: Includes an inline script in the `<head>` that runs before the page compiles to prevent flashing. It checks the user's system preferences (`prefers-color-scheme: dark`) and attaches the `dark` class to `document.documentElement` if needed, ensuring consistent styling across views.

### 📂 [globals.css](file:///c:/Users/Dev/.gemini/antigravity/scratch/skillgap-bridge/src/app/globals.css)
* **Core Role**: Styling foundation.
* **Key Definitions**:
  - Sets up Tailwind v4 `@theme` tokens (e.g., custom colors like `--primary: #6366f1`, backgrounds, and border formats).
  - Implements custom utility classes like `.glass-navbar` and `.glass-panel` using backdrop filters.

### 🏠 [page.tsx](file:///c:/Users/Dev/.gemini/antigravity/scratch/skillgap-bridge/src/app/page.tsx)
* **Core Role**: Homepage / Landing Page.
* **Key Features**: Features grid cards, hero section highlights, and navigation links.

### 📊 [analyze/page.tsx](file:///c:/Users/Dev/.gemini/antigravity/scratch/skillgap-bridge/src/app/analyze/page.tsx)
* **Core Role**: Main resume upload interface and skills dashboard.
* **Key Client-Side Logic**:
  1. **`parsePdf`**: Extracts raw text from PDF documents using `PDF.js` via dynamic global worker script integration.
  2. **`parseDocx`**: Extracts raw text from Microsoft Word documents using the client-side `Mammoth` library.
  3. **`parseRtf`**: Cleans up text using regex matching.
  4. **State Hooks**:
     - `jdText` (string): Text from the optional Job Description field.
     - `roleInput` (string): Text from the Target Job Role field.
     - `activeStepIndex` (number): Tracks loading phase animations (e.g. "Extracting core competencies...").
  5. **Data Visualization**: Displays analysis results (percentage meters, matched/missing skill grids, and category scores).

### 🔀 [compare/page.tsx](file:///c:/Users/Dev/.gemini/antigravity/scratch/skillgap-bridge/src/app/compare/page.tsx)
* **Core Role**: Evaluates candidate compatibility across multiple roles.
* **Key Client-Side Logic**:
  - Tracks comparison roles inside local state synced from the store.
  - **`handleAddCustomRole`**: Adds new roles on-the-fly, generating mock fit percentages (40-90%) and randomly selected missing skills to preview layouts.
  - Displays comparison cards showing matching percentages and lists of missing skills side-by-side.

### 🗣️ [interview/page.tsx](file:///c:/Users/Dev/.gemini/antigravity/scratch/skillgap-bridge/src/app/interview/page.tsx)
* **Core Role**: Main dashboard for the Mock Interview Simulator.
* **Key Client-Side Logic**:
  - Organizes generated questions into step-by-step wizard slides.
  - Manages states like `activeIdx` (current question index), `gradingState` (tracks grading loading indicators), and `answers` (stores current inputs).
  - Handles the submission flow by posting user answers to `/api/interview/grade` and showing scores and feedback.

### 📚 [recommendations/page.tsx](file:///c:/Users/Dev/.gemini/antigravity/scratch/skillgap-bridge/src/app/recommendations/page.tsx)
* **Core Role**: Recommends learning paths.
* **Key Client-Side Logic**:
  - Sorts materials into three main tabs:
    1. **Courses**: Features title, platform, duration, and link.
    2. **Projects**: Contains description, technical stack badges, and implementation features.
    3. **Certifications**: Details issuers, approximate values, and links.

---

## 📁 4. Reusable Components (`/src/components`)

### 🧭 [Navbar.tsx](file:///c:/Users/Dev/.gemini/antigravity/scratch/skillgap-bridge/src/components/Navbar.tsx)
* **Core Role**: Main navigation header.
* **Design & Logic**:
  - Uses a window scroll event listener to adjust header padding and apply glassmorphism styles when the page is scrolled.
  - Highlights active paths using the `usePathname` hook.
  - Implements a responsive mobile menu toggle drawer.

### 🖼️ [Logo.tsx](file:///c:/Users/Dev/.gemini/antigravity/scratch/skillgap-bridge/src/components/Logo.tsx)
* **Core Role**: Custom vector branding header.
* **Key Client-Side Logic**:
  - Uses the `useId()` React hook to generate collision-free SVG gradient and filter IDs when multiple instances are rendered on the same page (e.g. Header and Footer).
  - Renders custom vector path coordinates representing connecting nodes and brain hemispheres.

### 📑 [Footer.tsx](file:///c:/Users/Dev/.gemini/antigravity/scratch/skillgap-bridge/src/components/Footer.tsx)
* **Core Role**: Shared layout footer.
* **Key Client-Side Logic**:
  - Displays social icons, contact details, dynamic copyright year, and site map links.
