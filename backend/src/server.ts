/**
 * MediSync AI Backend Server
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import controllers and middleware
import { ReportController } from './controllers/reportController.js';
import { AnalysisController } from './controllers/analysisController.js';
import { upload, handleUploadError } from './middleware/upload.ts';
import { validateFileUpload, validateReportId, validateUserId } from './middleware/validation.ts';
import { 
  validateAnalysisRequest, 
  validateParameters, 
  validateReportText, 
  analysisRateLimit, 
  validateContentLength 
} from './middleware/analysisValidation.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize controllers
const reportController = new ReportController();
const analysisController = new AnalysisController();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080', 
    'http://localhost:8081',
    process.env.CORS_ORIGIN || 'http://localhost:5173'
  ].filter(Boolean),
  credentials: true
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests, please try again later'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api', (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Report routes
app.post('/api/reports/upload', 
  upload.single('file'),
  handleUploadError,
  validateFileUpload,
  (req, res) => reportController.uploadReport(req, res)
);

app.get('/api/reports/:reportId/status',
  validateReportId,
  (req, res) => reportController.getProcessingStatus(req, res)
);

app.get('/api/reports/:reportId',
  validateReportId,
  (req, res) => reportController.getReport(req, res)
);

app.get('/api/reports',
  validateUserId,
  (req, res) => reportController.getUserReports(req, res)
);

app.delete('/api/reports/:reportId',
  validateReportId,
  (req, res) => reportController.deleteReport(req, res)
);

// Analysis routes
app.post('/api/report-analysis/analyze',
  validateContentLength,
  analysisRateLimit,
  validateAnalysisRequest,
  validateParameters,
  validateReportText,
  (req, res) => analysisController.analyzeReport(req, res)
);

app.get('/api/report-analysis/status',
  (req, res) => analysisController.getAnalysisStatus(req, res)
);

app.options('/api/report-analysis/*', 
  (req, res) => analysisController.handleOptions(req, res)
);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource was not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MediSync AI Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📁 Upload directory: ${process.env.UPLOAD_DIR || 'uploads'}`);
  console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'openai'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
