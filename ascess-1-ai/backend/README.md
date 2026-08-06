# ascess-1-ai Backend API

Production-ready Express.js API backend with Supabase PostgreSQL integration, JWT authentication, Zod input validation, Multer file processing, and OpenAI service integration.

## Key Features
- **JWT Authentication**: Register, Login, Logout, Profile update, and Password strength meter validation.
- **Supabase Integration**: Users, Documents, Accessibility Reports, Translations, Settings, and Activity Logs.
- **OpenAI Integration**: Multimodal AI features for WCAG auditing, text simplification, translation, and summaries.
- **Document Processing**: PDF parsing, Web scraping, Image OCR text extraction, and plain text processing.
- **Voice & Accessibility**: User preferences CRUD and audio speech APIs.

## Environment Setup
Create a `.env` file in the root directory of the backend:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-5-mini
```

## Running Locally
```bash
npm install
npm run dev
```
