# SkillSync AI 🚀

SkillSync AI is a professional, AI-powered Next.js application designed to help users identify their skill gaps against specific target job roles, practice custom mock interviews, and receive tailored learning recommendations.

The app uses **Zustand** for global client-side state management, **Tailwind CSS v4** for clean responsive styling, and utilizes the **Groq API** (running `llama-3.3-70b-versatile`) as its natural language intelligence engine.

---

## ✨ Key Features

1. **Resume Analyzer & Skill Gap Dashboard (`/analyze`)**
   - Upload PDF, Word (`.docx`), or RTF files directly, or copy/paste raw resume text.
   - Compares skills against a target role and outputs matching percentage scores, lists of matched/missing skills, and custom category breakdowns.
2. **Mock Interview Simulator (`/interview`)**
   - Generates 5 tailored technical and behavioral questions based on target roles.
   - Shows **AI suggested ideal answers** alongside input boxes.
   - Allows users to write responses and click **"Check if it is right or not"** to receive instant AI scoring (0-100%) and grading feedback.
3. **Personalized Study Roadmap (`/recommendations`)**
   - Offers dynamic catalogs featuring:
     - **Free Courses** (direct redirect links to freeCodeCamp, YouTube, official documentation).
     - **Portfolio Projects** (tech stacks, description, and list of key implementation features).
     - **Industry Certifications** (issuers, average cost info, value scores).
4. **Career Role Comparison (`/compare`)**
   - Compares resume parameters against multiple optional target roles side-by-side.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (App Router), React 19, Zustand 5, Framer Motion 12, Lucide Icons.
* **Backend**: Next.js Serverless API endpoints.
* **AI Intelligence**: Groq API Cloud Server (`llama-3.3-70b-versatile`).
* **Document Parsing**: Client-side `pdf.js` (for PDF reads) and `mammoth.js` (for Word docx extractions).

---

## ⚙️ Local Development Setup

To run the project on your local machine:

1. **Clone the Repository**:
   ```bash
   git clone <your-repository-url>
   cd skillgap-bridge
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```
   *(Note: If no API key is specified, the application automatically triggers local backup fallback scripts that process scoring algorithms and generate high-fidelity mock questions/answers so you can still fully test the app offline.)*

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

---

## 🧠 Serverless API Reference

* **`POST /api/analyze`**: Receives resume text and target role parameters; requests Groq to return skills gap analyses, recommendations, and mock questions.
* **`POST /api/interview`**: Generates a set of 5 mixed technical/behavioral interview questions.
* **`POST /api/interview/grade`**: Compares candidate mock answers against the question's `idealAnswer` and computes scores and feedback.

---

## 🎨 Theme Configuration

The website is styled in a **White (Light) Theme** by default to maintain a clean, high-contrast, professional visual layout. Automatic dark-mode system-checking scripts have been removed to prevent theme flashing and ensure a unified design presentation.

---

## 🚀 Continuous Deployment (Netlify Auto-Updates)

This project is configured for seamless deployment on **Netlify**.

### Deployment Setup:
1. Connect your GitHub repository to your **Netlify** account.
2. The project's [netlify.toml](netlify.toml) file is already pre-configured to ensure correct Next.js routing:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```
3. Set your `GROQ_API_KEY` under the site's environment variables in the Netlify Dashboard.

### Automatic Updates:
Whenever you make changes to the code locally, simply push them to the main branch:
```bash
git add .
git commit -m "Your update description"
git push origin main
```
Netlify will automatically detect the push, rebuild the Next.js bundle, update your serverless functions, and deploy the new version to the live URL within 1-2 minutes.
