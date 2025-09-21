/**
 * Validation middleware for analysis endpoints
 */

import Joi from 'joi';

// Schema for parameter validation
const parameterSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  value: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  unit: Joi.string().required().min(1).max(20),
  refRange: Joi.string().required().min(1).max(50),
  status: Joi.string().valid('LOW', 'NORMAL', 'HIGH').required(),
  group: Joi.string().required().min(1).max(50)
});

// Schema for patient info validation
const patientInfoSchema = Joi.object({
  age: Joi.number().min(0).max(150).optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  weight: Joi.number().min(0).max(1000).optional(),
  height: Joi.number().min(0).max(300).optional(),
  medicalHistory: Joi.array().items(Joi.string()).optional(),
  currentMedications: Joi.array().items(Joi.string()).optional()
});

// Schema for complete request validation
const analysisRequestSchema = Joi.object({
  patientInfo: patientInfoSchema.required(),
  reportText: Joi.string().required().min(10).max(50000),
  parameters: Joi.array().items(parameterSchema).min(1).max(100).required()
});

/**
 * Validate analysis request
 */
export const validateAnalysisRequest = (req, res, next) => {
  const { error, value } = analysisRequestSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorDetails = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }));

    return res.status(400).json({
      error: 'Validation failed',
      details: errorDetails
    });
  }

  // Replace request body with validated and sanitized data
  req.body = value;
  next();
};

/**
 * Validate parameter input
 */
export const validateParameters = (req, res, next) => {
  const { parameters } = req.body;

  if (!Array.isArray(parameters) || parameters.length === 0) {
    return res.status(400).json({
      error: 'Invalid parameters',
      message: 'Parameters must be a non-empty array'
    });
  }

  // Validate each parameter
  for (let i = 0; i < parameters.length; i++) {
    const { error } = parameterSchema.validate(parameters[i]);
    if (error) {
      return res.status(400).json({
        error: `Invalid parameter at index ${i}`,
        message: error.details[0].message,
        field: error.details[0].path.join('.')
      });
    }
  }

  next();
};

/**
 * Sanitize and validate report text
 */
export const validateReportText = (req, res, next) => {
  const { reportText } = req.body;

  if (!reportText || typeof reportText !== 'string') {
    return res.status(400).json({
      error: 'Invalid report text',
      message: 'Report text must be a non-empty string'
    });
  }

  // Sanitize report text
  const sanitized = reportText
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 50000); // Limit length

  if (sanitized.length < 10) {
    return res.status(400).json({
      error: 'Invalid report text',
      message: 'Report text must be at least 10 characters long after sanitization'
    });
  }

  req.body.reportText = sanitized;
  next();
};

/**
 * Rate limiting middleware for analysis endpoints
 */
export const analysisRateLimit = (req, res, next) => {
  // Simple in-memory rate limiting (in production, use Redis)
  const clientId = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 10; // Max 10 requests per 15 minutes

  // Initialize rate limit storage if not exists
  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map();
  }

  const clientData = global.rateLimitStore.get(clientId) || { count: 0, resetTime: now + windowMs };

  // Reset if window has passed
  if (now > clientData.resetTime) {
    clientData.count = 0;
    clientData.resetTime = now + windowMs;
  }

  // Check if limit exceeded
  if (clientData.count >= maxRequests) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: `Maximum ${maxRequests} requests per 15 minutes allowed`,
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
  }

  // Increment counter
  clientData.count++;
  global.rateLimitStore.set(clientId, clientData);

  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': maxRequests,
    'X-RateLimit-Remaining': maxRequests - clientData.count,
    'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString()
  });

  next();
};

/**
 * Content length validation
 */
export const validateContentLength = (req, res, next) => {
  const contentLength = req.get('Content-Length');
  const maxLength = 5 * 1024 * 1024; // 5MB

  if (contentLength && parseInt(contentLength) > maxLength) {
    return res.status(413).json({
      error: 'Payload too large',
      message: 'Request body exceeds maximum allowed size of 5MB'
    });
  }

  next();
};
