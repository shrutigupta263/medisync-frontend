/**
 * Validation middleware
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Validate file upload
 */
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    userId: Joi.string().uuid().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: error.details[0].message 
    });
  }

  next();
};

/**
 * Validate report ID parameter
 */
export const validateReportId = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    reportId: Joi.string().uuid().required(),
    userId: Joi.string().uuid().required()
  });

  const { error } = schema.validate({
    reportId: req.params.reportId,
    userId: req.query.userId
  });

  if (error) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: error.details[0].message 
    });
  }

  next();
};

/**
 * Validate user ID query parameter
 */
export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    userId: Joi.string().uuid().required()
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: error.details[0].message 
    });
  }

  next();
};
