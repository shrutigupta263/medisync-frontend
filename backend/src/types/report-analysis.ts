/**
 * TypeScript types for Report Analysis feature
 */

// Input types
export interface PatientInfo {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  medicalHistory?: string[];
  currentMedications?: string[];
}

export interface Parameter {
  name: string;
  value: string | number;
  unit: string;
  refRange: string;
  status: 'LOW' | 'NORMAL' | 'HIGH';
  group: string;
}

export interface ReportAnalysisRequest {
  patientInfo: PatientInfo;
  reportText: string;
  parameters: Parameter[];
}

// Output types
export interface Summary {
  overallAssessment: string;
  highlights: string[];
  keyFindings: string[];
}

export interface AbnormalFinding {
  parameter: string;
  value: string;
  unit: string;
  refRange: string;
  status: 'LOW' | 'HIGH';
  explanation: string;
  specialistSuggestion: string;
}

export interface FutureComplication {
  condition: string;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  prevention: string[];
}

export interface LifestyleRecommendation {
  category: 'diet' | 'exercise' | 'hydration' | 'sleep' | 'stress' | 'other';
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface TreatmentApproach {
  condition: string;
  generalApproach: string;
  disclaimer: string;
}

export interface Insights {
  abnormalFindings: AbnormalFinding[];
  futureComplications: FutureComplication[];
  specialistSuggestions: string[];
  lifestyleRecommendations: LifestyleRecommendation[];
  treatmentApproaches: TreatmentApproach[];
}

export interface GroupedIssue {
  category: string;
  parameters: Parameter[];
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface AnalysisMeta {
  modelUsed: string;
  disclaimer: string;
  timestamp: string;
  processingTime: number;
  confidence: number;
}

export interface ReportAnalysisResponse {
  summary: Summary;
  insights: Insights;
  groupedIssues: GroupedIssue[];
  meta: AnalysisMeta;
}

// Safety types
export interface SafetyCheckResult {
  isSafe: boolean;
  redactedText: string;
  violations: string[];
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
