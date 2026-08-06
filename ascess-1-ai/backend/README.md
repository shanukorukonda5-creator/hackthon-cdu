# ascess-1-ai Backend API

Production-ready Express.js API backend with Supabase PostgreSQL integration, JWT authentication, Zod input validation, Multer file processing, and Google Gemini AI service integration.

## Features
- **Supabase PostgreSQL**: Managed queries, transactions, and client helpers.
- **JWT Auth**: Secure user authentication and authorization middleware.
- **Google Gemini Integration**: Scaffolding for multimodal AI features.
- **Accessibility & Document Management**: Schema and APIs ready for document scanning and accessibility analysis.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment Variables in `.env`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `JWT_SECRET`

3. Initialize Database Schema:
   Execute `src/database/schema.sql` in your Supabase SQL Editor.

4. Start Development Server:
   ```bash
   npm run dev
   ```
