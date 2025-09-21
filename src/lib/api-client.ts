/**
 * API client for backend communication
 */

import { ReportAnalysisRequest, ReportAnalysisResponse } from '@/types/report-analysis';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface UploadReportRequest {
  file: File;
  userId: string;
}

export interface UploadReportResponse {
  message: string;
  reportId: string;
  status: string;
  analysis?: any; // AI analysis results
  error?: string; // Error message if analysis failed
}

export interface ProcessingStatusResponse {
  reportId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  currentStep: string;
  error?: string;
}

export interface ReportResponse {
  id: string;
  user_id: string;
  title: string;
  type: string;
  date: string;
  doctor?: string;
  facility?: string;
  notes?: string;
  file_url?: string;
  extracted_text?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  medical_data?: any;
  created_at: string;
  updated_at: string;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Upload a medical report
   */
  async uploadReport(request: UploadReportRequest): Promise<UploadReportResponse> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('userId', request.userId);

    const response = await fetch(`${this.baseURL}/reports/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload report');
    }

    return response.json();
  }

  /**
   * Get processing status for a report
   */
  async getProcessingStatus(reportId: string, userId: string): Promise<ProcessingStatusResponse> {
    const response = await fetch(`${this.baseURL}/reports/${reportId}/status?userId=${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get processing status');
    }

    return response.json();
  }

  /**
   * Get a specific report with analysis
   */
  async getReport(reportId: string, userId: string): Promise<ReportResponse> {
    const response = await fetch(`${this.baseURL}/reports/${reportId}?userId=${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get report');
    }

    return response.json();
  }

  /**
   * Get all reports for a user
   */
  async getUserReports(userId: string): Promise<ReportResponse[]> {
    const response = await fetch(`${this.baseURL}/reports?userId=${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get user reports');
    }

    return response.json();
  }

  /**
   * Delete a report
   */
  async deleteReport(reportId: string, userId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/reports/${reportId}?userId=${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete report');
    }
  }

  /**
   * Analyze medical report with AI
   */
  async analyzeReport(request: ReportAnalysisRequest): Promise<ReportAnalysisResponse> {
    const response = await fetch(`${this.baseURL}/report-analysis/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to analyze report');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get analysis service status
   */
  async getAnalysisStatus(): Promise<{
    status: string;
    model: string;
    version: string;
    timestamp: string;
    features: string[];
  }> {
    const response = await fetch(`${this.baseURL}/report-analysis/status`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get analysis status');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Check backend health
   */
  async checkHealth(): Promise<{ status: string; timestamp: string; version: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    
    if (!response.ok) {
      throw new Error('Backend is not available');
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
