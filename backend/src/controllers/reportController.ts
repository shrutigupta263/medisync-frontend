/**
 * Report processing controller
 */

import { Request, Response } from 'express';
import { DatabaseService } from '../services/databaseService.ts';
import { TextExtractionService } from '../services/textExtractionService.ts';
import { ReportAnalysisService } from '../services/reportAnalysisService.js';
import { createAnalysisRequest } from '../lib/report-analysis-utils.js';
import { UserReport } from '../types/medical.ts';

export class ReportController {
  private dbService: DatabaseService;
  private textService: TextExtractionService;
  private analysisService: ReportAnalysisService;

  constructor() {
    this.dbService = new DatabaseService();
    this.textService = new TextExtractionService();
    this.analysisService = new ReportAnalysisService();
    
    // Log database availability
    if (this.dbService.isAvailable()) {
      console.log('✅ ReportController initialized with database support');
    } else {
      console.log('⚠️  ReportController initialized without database support');
    }
  }

  /**
   * Upload and process a medical report
   */
  async uploadReport(req: Request, res: Response): Promise<void> {
    try {
      // Check if database is available
      if (!this.dbService.isAvailable()) {
        res.status(503).json({ 
          error: 'Database service unavailable',
          message: 'File upload requires database configuration. Please set up Supabase or use the analysis endpoint directly.',
          suggestion: 'Try using the /api/report-analysis/analyze endpoint with extracted text instead.'
        });
        return;
      }

      const userId = req.body.userId;
      const file = req.file;

      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      if (!file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      // Create initial report record
      const reportData: Partial<UserReport> = {
        user_id: userId,
        title: file.originalname.replace(/\.[^/.]+$/, ''), // Remove file extension
        type: file.mimetype.includes('pdf') ? 'PDF' : 'Image',
        date: new Date().toISOString(),
        file_url: file.path,
        status: 'PENDING'
      };

      const report = await this.dbService.createReport(reportData);

      // Process report immediately and return results
      try {
        const processedReport = await this.processReportImmediately(report.id, file.path, file.mimetype);
        
        res.status(201).json({
          message: 'Report uploaded and analyzed successfully',
          reportId: report.id,
          status: 'COMPLETED',
          analysis: processedReport.medical_data
        });
      } catch (error) {
        // If processing fails, update status and return error
        await this.dbService.updateReportStatus(report.id, 'FAILED', error instanceof Error ? error.message : 'Analysis failed');
        
        res.status(500).json({
          message: 'Report uploaded but analysis failed',
          reportId: report.id,
          status: 'FAILED',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload report' });
    }
  }

  /**
   * Get report processing status
   */
  async getProcessingStatus(req: Request, res: Response): Promise<void> {
    try {
      const { reportId } = req.params;
      const userId = req.query.userId as string;

      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      // Verify user access
      const hasAccess = await this.dbService.verifyUserAccess(reportId, userId);
      if (!hasAccess) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const status = await this.dbService.getProcessingStatus(reportId);
      if (!status) {
        res.status(404).json({ error: 'Report not found' });
        return;
      }

      res.json(status);
    } catch (error) {
      console.error('Status check error:', error);
      res.status(500).json({ error: 'Failed to get processing status' });
    }
  }

  /**
   * Get report with analysis
   */
  async getReport(req: Request, res: Response): Promise<void> {
    try {
      const { reportId } = req.params;
      const userId = req.query.userId as string;

      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const report = await this.dbService.getReport(reportId, userId);
      if (!report) {
        res.status(404).json({ error: 'Report not found' });
        return;
      }

      res.json(report);
    } catch (error) {
      console.error('Get report error:', error);
      res.status(500).json({ error: 'Failed to get report' });
    }
  }

  /**
   * Get all user reports
   */
  async getUserReports(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const reports = await this.dbService.getUserReports(userId);
      res.json(reports);
    } catch (error) {
      console.error('Get user reports error:', error);
      res.status(500).json({ error: 'Failed to get reports' });
    }
  }

  /**
   * Delete a report
   */
  async deleteReport(req: Request, res: Response): Promise<void> {
    try {
      const { reportId } = req.params;
      const userId = req.query.userId as string;

      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const success = await this.dbService.deleteReport(reportId, userId);
      if (success) {
        res.json({ message: 'Report deleted successfully' });
      } else {
        res.status(404).json({ error: 'Report not found' });
      }
    } catch (error) {
      console.error('Delete report error:', error);
      res.status(500).json({ error: 'Failed to delete report' });
    }
  }

  /**
   * Process report immediately and return results
   */
  private async processReportImmediately(reportId: string, filePath: string, fileType: string): Promise<UserReport> {
    console.log(`Starting immediate processing for report ${reportId}`);

    // Step 1: Update status to processing
    await this.dbService.updateReportStatus(reportId, 'PROCESSING');

    // Step 2: Extract text from file
    console.log(`Extracting text from ${filePath}`);
    const extractionResult = await this.textService.extractText(filePath, fileType);
    const cleanedText = this.textService.cleanText(extractionResult.text);

    // Step 3: Validate text quality
    const qualityCheck = this.textService.validateTextQuality(cleanedText);
    if (!qualityCheck.isValid) {
      console.warn(`Text quality issues for report ${reportId}:`, qualityCheck.issues);
    }

    // Step 4: Update report with extracted text
    await this.dbService.updateReportWithText(reportId, cleanedText);

    // Step 5: Create analysis request
    console.log(`Creating analysis request for report ${reportId}`);
    const analysisRequest = createAnalysisRequest(cleanedText);

    // Step 6: AI Analysis
    console.log(`Starting AI analysis for report ${reportId}`);
    const analysis = await this.analysisService.analyzeReport(analysisRequest);

    // Step 7: Update report with analysis and return
    const updatedReport = await this.dbService.updateReportWithAnalysis(reportId, analysis);

    console.log(`Successfully processed report ${reportId} immediately`);
    return updatedReport;
  }

  /**
   * Process report asynchronously (kept for backward compatibility)
   */
  private async processReportAsync(reportId: string, filePath: string, fileType: string): Promise<void> {
    try {
      console.log(`Starting processing for report ${reportId}`);

      // Step 1: Update status to processing
      await this.dbService.updateReportStatus(reportId, 'PROCESSING');

      // Step 2: Extract text from file
      console.log(`Extracting text from ${filePath}`);
      const extractionResult = await this.textService.extractText(filePath, fileType);
      const cleanedText = this.textService.cleanText(extractionResult.text);

      // Step 3: Validate text quality
      const qualityCheck = this.textService.validateTextQuality(cleanedText);
      if (!qualityCheck.isValid) {
        console.warn(`Text quality issues for report ${reportId}:`, qualityCheck.issues);
      }

      // Step 4: Update report with extracted text
      await this.dbService.updateReportWithText(reportId, cleanedText);

      // Step 5: Create analysis request
      console.log(`Creating analysis request for report ${reportId}`);
      const analysisRequest = createAnalysisRequest(cleanedText);

      // Step 6: AI Analysis
      console.log(`Starting AI analysis for report ${reportId}`);
      const analysis = await this.analysisService.analyzeReport(analysisRequest);

      // Step 7: Update report with analysis
      await this.dbService.updateReportWithAnalysis(reportId, analysis);

      console.log(`Successfully processed report ${reportId}`);
    } catch (error) {
      console.error(`Error processing report ${reportId}:`, error);
      await this.dbService.updateReportStatus(
        reportId, 
        'FAILED', 
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}
