# 🧠 ascess-1-ai — Hackathon Judge Q&A Preparation Guide

Comprehensive responses to the top 10 questions hackathon judges are likely to ask during evaluation.

---

### Q1: Why did you choose Google Gemini 2.0 as your AI core?
> **Answer:** Google Gemini 2.0 Flash offers superior multimodal reasoning, high speed, and low latency for document parsing, cognitive text simplification, and multilingual translation. Its structured JSON output capability allows us to enforce strict schema validation for our 0-100 WCAG scoring system and Priority Engine.

---

### Q2: Why Supabase PostgreSQL instead of MongoDB or Firebase?
> **Answer:** Accessibility audit reports, user profiles, document metadata, and activity logs require strong relational integrity (foreign keys between users, documents, and reports). Supabase provides a scalable PostgreSQL foundation with Row Level Security (RLS) policies, native UUID support, and real-time subscription capabilities.

---

### Q3: How is `ascess-1-ai` different from existing web accessibility tools like WAVE or Lighthouse?
> **Answer:** Traditional tools like WAVE or Lighthouse only flag basic HTML code syntax issues and raw contrast ratios. **ascess-1-ai** goes beyond technical compliance by acting as an **active cognitive & assistive engine**:
> 1. It simplifies complex text for 6 cognitive reading levels (e.g. *Explain Like I'm 10*, *Senior Citizen friendly*).
> 2. It translates content across 14 languages while preserving headings and lists.
> 3. It provides integrated audio Web Speech TTS sentence tracking, mic STT input, OpenDyslexic font mode, High Contrast AAA mode, and mouse-following Reading Ruler.

---

### Q4: How does your AI engine prevent hallucinations in summaries and accessibility audits?
> **Answer:** We employ strict **Prompt Engineering with System Instructions** (`PromptBuilder.js`):
> - All document Q&A prompts force the model to rely strictly on the provided document text (`DOCUMENT CONTENT PROVIDED`).
> - We enforce JSON output formatting via schema enforcement and parse responses through a resilient JSON sanitizer (`parseGeminiJson`).
> - Text inputs are sanitized to strip scripts and capped at 15,000 characters to prevent prompt injection.

---

### Q5: How is user data and API security guaranteed?
> **Answer:**
> 1. **Zero Secret Leakage:** `GEMINI_API_KEY`, `JWT_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` reside exclusively on the backend in environment variables.
> 2. **Authentication:** All protected routes require a verified Bearer JWT issued upon login. Passwords are hashed using `bcrypt` with salt rounds.
> 3. **HTTP Protection:** Backend uses Express `helmet()`, CORS policies restricted to the frontend domain, and `express-rate-limit` on auth routes.

---

### Q6: How would `ascess-1-ai` scale to millions of users?
> **Answer:**
> - **Stateless Architecture:** The backend API is completely stateless and can be horizontally auto-scaled on cloud platforms like Render or AWS ECS.
> - **In-Memory Caching:** Duplicate Gemini AI queries are cached in memory to reduce latency and API quota usage.
> - **Async Document Processing:** PDF parsing (`pdf-parse`) and URL scraping (`cheerio`) run asynchronously with memory storage to prevent event loop blocking.

---

### Q7: What WCAG accessibility standards does your project follow?
> **Answer:** We adhere strictly to **WCAG 2.1 Level AA and Level AAA guidelines**:
> - **Perceivable:** Text-to-Speech audio feedback, sentence tracking, OpenDyslexic legibility mode, and High Contrast mode (`#000000` / `#ffff00`).
> - **Operable:** Keyboard navigation (`Tab`, `Shift+Tab`, `Escape`), 3px focus rings, `Ctrl+K` Command Palette, and **Skip to Main Content** link (`#main-content`).
> - **Understandable:** Cognitive text simplification and voice announcements for route navigation and button clicks.

---

### Q8: How does your multi-format document parser handle scanned PDFs and web URLs?
> **Answer:**
> - For PDFs, `PDFProcessor` uses `pdf-parse` buffer stream parsing to extract reading order, page count, word count, and text headings.
> - For URLs, `WebsiteProcessor` uses `cheerio` to strip navigation boilerplate, scripts, ads, headers, and footers, extracting main article text.

---

### Q9: How is auditory screen reader feedback implemented?
> **Answer:** We use the browser's native **Web Speech API** (`speechSynthesis`). Every route change triggers `speakAnnouncement("Navigated to [Page Name]")`, and clicking any interactive button speaks `"Clicked: [Button Label]"`. Users can toggle this ON or OFF at any time from our floating Accessibility Dock.

---

### Q10: What future improvements will you add after the hackathon?
> **Answer:**
> 1. Multimodal live video accessibility auditing.
> 2. Offline WebAssembly OCR rendering engine.
> 3. Native mobile app (React Native) for iOS and Android.
