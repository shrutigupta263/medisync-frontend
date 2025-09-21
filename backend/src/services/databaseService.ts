/**
 * Database service for Supabase operations
 */

import { createClient } from '@supabase/supabase-js';
import { UserReport, AIAnalysisResult, ProcessingStatus } from '../types/medical.ts';
import { ReportAnalysisResponse } from '../types/report-analysis.ts';

export class DatabaseService {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const skipDatabaseInit = process.env.SKIP_DATABASE_INIT === 'true';

    // Check if we should skip database initialization
    if (skipDatabaseInit) {
      console.warn('⚠️  Database service disabled - SKIP_DATABASE_INIT=true');
      console.warn('⚠️  Set valid SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY and remove SKIP_DATABASE_INIT to enable database features');
      this.supabase = null;
      return;
    }

    // Check for valid Supabase configuration
    const isValidUrl = supabaseUrl && 
      supabaseUrl !== 'your_supabase_url_here' && 
      (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'));
    
    const isValidKey = supabaseKey && 
      supabaseKey !== 'your_supabase_service_role_key_here' && 
      supabaseKey.length > 10;

    if (!isValidUrl || !isValidKey) {
      console.error('❌ Invalid Supabase configuration detected');
      console.error(`   SUPABASE_URL: ${supabaseUrl ? 'Set but invalid' : 'Missing'}`);
      console.error(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseKey ? 'Set but invalid' : 'Missing'}`);
      console.error('   Set SKIP_DATABASE_INIT=true to run without database, or provide valid Supabase credentials');
      throw new Error('Invalid Supabase configuration. Set SKIP_DATABASE_INIT=true to run without database.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Database service initialized');
  }

  /**
   * Check if database is available
   */
  private ensureDatabase() {
    if (!this.supabase) {
      throw new Error('Database service not initialized. Please configure Supabase or use mock data.');
    }
  }

  /**
   * Check if database is available (non-throwing version)
   */
  isAvailable(): boolean {
    return !!this.supabase;
  }

  /**
   * Create a new user report
   */
  async createReport(reportData: Partial<UserReport>): Promise<UserReport> {
    this.ensureDatabase();

    const { data, error } = await this.supabase
      .from('user_reports')
      .insert([reportData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update report with extracted text
   */
  async updateReportWithText(reportId: string, extractedText: string): Promise<UserReport> {
    this.ensureDatabase();
    const { data, error } = await this.supabase
      .from('user_reports')
      .update({ 
        extracted_text: extractedText,
        status: 'PROCESSING',
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update report with AI analysis results
   */
  async updateReportWithAnalysis(reportId: string, analysis: AIAnalysisResult | ReportAnalysisResponse): Promise<UserReport> {
    const { data, error } = await this.supabase
      .from('user_reports')
      .update({ 
        medical_data: analysis,
        status: 'COMPLETED',
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update report status
   */
  async updateReportStatus(reportId: string, status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED', error?: string): Promise<UserReport> {
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    };

    if (error) {
      updateData.notes = error;
    }

    const { data, error: dbError } = await this.supabase
      .from('user_reports')
      .update(updateData)
      .eq('id', reportId)
      .select()
      .single();

    if (dbError) throw dbError;
    return data;
  }

  /**
   * Get report by ID (with user verification)
   */
  async getReport(reportId: string, userId: string): Promise<UserReport | null> {
    const { data, error } = await this.supabase
      .from('user_reports')
      .select('*')
      .eq('id', reportId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }

    return data;
  }

  /**
   * Get all reports for a user
   */
  async getUserReports(userId: string): Promise<UserReport[]> {
    const { data, error } = await this.supabase
      .from('user_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Delete a report
   */
  async deleteReport(reportId: string, userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('user_reports')
      .delete()
      .eq('id', reportId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  /**
   * Get processing status for a report
   */
  async getProcessingStatus(reportId: string): Promise<ProcessingStatus | null> {
    const { data, error } = await this.supabase
      .from('user_reports')
      .select('id, status, updated_at, notes')
      .eq('id', reportId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      reportId: data.id,
      status: data.status,
      progress: this.calculateProgress(data.status),
      currentStep: this.getCurrentStep(data.status),
      error: data.notes || undefined
    };
  }

  /**
   * Calculate processing progress based on status
   */
  private calculateProgress(status: string): number {
    switch (status) {
      case 'PENDING': return 0;
      case 'PROCESSING': return 50;
      case 'COMPLETED': return 100;
      case 'FAILED': return 0;
      default: return 0;
    }
  }

  /**
   * Get current processing step description
   */
  private getCurrentStep(status: string): string {
    switch (status) {
      case 'PENDING': return 'Waiting to process';
      case 'PROCESSING': return 'Analyzing report';
      case 'COMPLETED': return 'Analysis complete';
      case 'FAILED': return 'Processing failed';
      default: return 'Unknown status';
    }
  }

  /**
   * Verify user access to report
   */
  async verifyUserAccess(reportId: string, userId: string): Promise<boolean> {
    const report = await this.getReport(reportId, userId);
    return report !== null;
  }
}
