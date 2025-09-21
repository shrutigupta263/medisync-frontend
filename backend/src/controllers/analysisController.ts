/**
 * Analysis Controller for Report Analysis endpoints
 */

import { Request, Response } from 'express';
import { ReportAnalysisService } from '../services/reportAnalysisService.js';
import { ReportAnalysisRequest, ValidationResult } from '../types/report-analysis.js';

export class AnalysisController {
  private analysisService: ReportAnalysisService;

  constructor() {
    this.analysisService = new ReportAnalysisService();
  }

  /**
   * Analyze medical report endpoint
   * POST /api/report-analysis/analyze
   */
  async analyzeReport(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validation = this.validateRequest(req.body);
      if (!validation.isValid) {
        res.status(400).json({
          error: 'Invalid request data',
          details: validation.errors
        });
        return;
      }

      const request: ReportAnalysisRequest = req.body;

      // Perform analysis
      const analysis = await this.analysisService.analyzeReport(request);

      // Return successful response
      res.status(200).json({
        success: true,
        data: analysis,
        message: 'Report analysis completed successfully'
      });

    } catch (error) {
      console.error('Analysis error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          res.status(500).json({
            error: 'AI service configuration error',
            message: 'Please check API key configuration'
          });
        } else if (error.message.includes('Invalid response')) {
          res.status(502).json({
            error: 'AI service response error',
            message: 'Invalid response from AI service'
          });
        } else {
          res.status(500).json({
            error: 'Analysis failed',
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          error: 'Internal server error',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  /**
   * Get analysis status endpoint
   * GET /api/report-analysis/status
   */
  async getAnalysisStatus(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: {
          status: 'operational',
          model: 'gemini-1.5-flash',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          features: [
            'Detailed report analysis',
            'Abnormal value highlighting',
            'Specialist recommendations',
            'Future complication predictions',
            'Lifestyle recommendations',
            'General treatment approaches',
            'Safety validation',
            'Dosing pattern redaction'
          ]
        }
      });
    } catch (error) {
      console.error('Status check error:', error);
      res.status(500).json({
        error: 'Status check failed',
        message: 'Unable to retrieve service status'
      });
    }
  }

  /**
   * Validate request body structure
   */
  private validateRequest(body: any): ValidationResult {
    const errors: string[] = [];

    // Check if body exists
    if (!body || typeof body !== 'object') {
      errors.push('Request body is required');
      return { isValid: false, errors };
    }

    // Validate patientInfo
    if (!body.patientInfo || typeof body.patientInfo !== 'object') {
      errors.push('patientInfo is required and must be an object');
    }

    // Validate reportText
    if (!body.reportText || typeof body.reportText !== 'string' || body.reportText.trim().length < 10) {
      errors.push('reportText is required and must be at least 10 characters long');
    }

    // Validate parameters
    if (!body.parameters || !Array.isArray(body.parameters) || body.parameters.length === 0) {
      errors.push('parameters is required and must be a non-empty array');
    } else {
      // Validate each parameter
      body.parameters.forEach((param: any, index: number) => {
        if (!param.name || typeof param.name !== 'string') {
          errors.push(`Parameter ${index + 1}: name is required and must be a string`);
        }
        
        if (param.value === undefined || param.value === null) {
          errors.push(`Parameter ${index + 1}: value is required`);
        }
        
        if (!param.unit || typeof param.unit !== 'string') {
          errors.push(`Parameter ${index + 1}: unit is required and must be a string`);
        }
        
        if (!param.refRange || typeof param.refRange !== 'string') {
          errors.push(`Parameter ${index + 1}: refRange is required and must be a string`);
        }
        
        if (!param.status || !['LOW', 'NORMAL', 'HIGH'].includes(param.status)) {
          errors.push(`Parameter ${index + 1}: status must be LOW, NORMAL, or HIGH`);
        }
        
        if (!param.group || typeof param.group !== 'string') {
          errors.push(`Parameter ${index + 1}: group is required and must be a string`);
        }
      });
    }

    // Validate patientInfo structure if present
    if (body.patientInfo) {
      const patientInfo = body.patientInfo;
      
      if (patientInfo.age !== undefined && (typeof patientInfo.age !== 'number' || patientInfo.age < 0 || patientInfo.age > 150)) {
        errors.push('patientInfo.age must be a number between 0 and 150');
      }
      
      if (patientInfo.gender !== undefined && !['male', 'female', 'other'].includes(patientInfo.gender)) {
        errors.push('patientInfo.gender must be male, female, or other');
      }
      
      if (patientInfo.weight !== undefined && (typeof patientInfo.weight !== 'number' || patientInfo.weight < 0 || patientInfo.weight > 1000)) {
        errors.push('patientInfo.weight must be a number between 0 and 1000');
      }
      
      if (patientInfo.height !== undefined && (typeof patientInfo.height !== 'number' || patientInfo.height < 0 || patientInfo.height > 300)) {
        errors.push('patientInfo.height must be a number between 0 and 300');
      }
      
      if (patientInfo.medicalHistory !== undefined && !Array.isArray(patientInfo.medicalHistory)) {
        errors.push('patientInfo.medicalHistory must be an array');
      }
      
      if (patientInfo.currentMedications !== undefined && !Array.isArray(patientInfo.currentMedications)) {
        errors.push('patientInfo.currentMedications must be an array');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Handle OPTIONS request for CORS
   */
  handleOptions(req: Request, res: Response): void {
    res.status(200).json({ message: 'CORS preflight successful' });
  }
}
