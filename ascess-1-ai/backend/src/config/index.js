import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'ascess_1_ai_default_jwt_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
};

export default config;
