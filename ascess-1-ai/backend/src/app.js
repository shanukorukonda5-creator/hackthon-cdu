import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

// Security and CORS middleware configurations
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl) or Vercel preview domains
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for deployment demo
      }
    },
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'src', 'uploads')));

// Welcome Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ascess-1-ai Enterprise Accessibility Engine API Service',
    version: '1.0.0',
    status: 'online',
    health: '/health',
    api: '/api',
  });
});

// Health Check Route for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'ascess-1-ai backend', timestamp: new Date() });
});

// Auto-prefix non-/api requests for auth, ai, documents, accessibility, user
app.use((req, res, next) => {
  if (
    !req.path.startsWith('/api') &&
    (req.path.startsWith('/auth') ||
      req.path.startsWith('/ai') ||
      req.path.startsWith('/documents') ||
      req.path.startsWith('/accessibility') ||
      req.path.startsWith('/user'))
  ) {
    req.url = '/api' + req.url;
  }
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
