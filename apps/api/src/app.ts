import express, { Application } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { config } from './config';
import corsConfig from './config/cors';
import { errorHandler, notFoundHandler, defaultLimiter } from './middleware';

// Import routes
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import jobRoutes from './routes/job.routes';
import proposalRoutes from './routes/proposal.routes';
import skillRoutes from './routes/skill.routes';
import uploadRoutes from './routes/upload.routes';

// Create Express app
const app: Application = express();

// =============================================================================
// SECURITY MIDDLEWARE
// =============================================================================

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: config.isProd ? undefined : false,
}));

// CORS
app.use(cors(corsConfig));

// Rate limiting
app.use(defaultLimiter);

// =============================================================================
// PARSING MIDDLEWARE
// =============================================================================

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Parse cookies
app.use(cookieParser());

// Compression
app.use(compression());

// =============================================================================
// LOGGING MIDDLEWARE
// =============================================================================

// HTTP request logging
if (config.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// =============================================================================
// API ROUTES
// =============================================================================

const API_PREFIX = '/api';

// Static uploads
const uploadsDir = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check (no prefix for k8s/docker health checks)
app.use('/health', healthRoutes);
app.use(`${API_PREFIX}/health`, healthRoutes);

// Auth routes
app.use(`${API_PREFIX}/auth`, authRoutes);

// User routes
app.use(`${API_PREFIX}/users`, userRoutes);

// Job routes
app.use(`${API_PREFIX}/jobs`, jobRoutes);

// Proposal routes
app.use(`${API_PREFIX}/proposals`, proposalRoutes);

// Skill catalog routes
app.use(`${API_PREFIX}/skills`, skillRoutes);

// Upload routes
app.use(`${API_PREFIX}/uploads`, uploadRoutes);

// =============================================================================
// ERROR HANDLING
// =============================================================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
