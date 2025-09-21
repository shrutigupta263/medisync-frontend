/**
 * Type definitions for medical report analysis
 */

export interface HealthMetric {
  name: string;
  value: string | number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  category: 'blood' | 'urine' | 'vital' | 'other';
}

export interface AIAnalysisResult {
  summary: string[];
  healthMetrics: HealthMetric[];
  riskFlags: RiskFlag[];
  futureComplications: string[];
  medications: Medication[];
  dietaryRecommendations: string[];
  homeRemedies: string[];
  followUpRecommendations: string[];
  confidence: number; // 0-100
  analysisDate: string;
}

export interface RiskFlag {
  parameter: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
}

export interface Medication {
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  indication: string;
  type: 'prescription' | 'otc' | 'supplement';
  note?: string;
}

export interface UserReport {
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
  medical_data?: AIAnalysisResult;
  created_at: string;
  updated_at: string;
}

export interface TextExtractionResult {
  text: string;
  confidence: number;
  language: string;
  pageCount?: number;
}

export interface ProcessingStatus {
  reportId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number; // 0-100
  currentStep: string;
  error?: string;
}
