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

// Legacy types for backwards compatibility
export interface ReportHighlights {
  needsAttention: {
    id: string;
    text: string;
  }[];
  goodFindings: {
    id: string;
    text: string;
  }[];
}

export interface ReportInsights {
  abnormalFindings: {
    id: string;
    text: string;
  }[];
  followUps: {
    id: string;
    text: string;
  }[];
  recommendations: {
    id: string;
    text: string;
  }[];
}

export interface CategoryScore {
  name: string;
  score: number;
}

export interface ReferenceRange {
  low?: number;
  high?: number;
  unit?: string;
}

export interface TestParameter {
  id: string;
  name: string;
  value: number | string;
  unit?: string;
  refRange?: ReferenceRange;
  status: 'LOW' | 'NORMAL' | 'HIGH';
  recommendation?: string;
  group: string;
}

export interface ParameterGroup {
  name: string;
  count: number;
  parameters: TestParameter[];
}

export interface EnhancedReportAnalysis {
  overallScore: number;
  assessment: string;
  highlights: ReportHighlights;
  insights: ReportInsights;
  categoryScores: CategoryScore[];
  parameters: TestParameter[];
}

export interface ReportAnalysisState {
  searchQuery: string;
  activeTab: 'abnormal' | 'all';
  expandedInsights: {
    abnormalFindings: boolean;
    followUps: boolean;
    recommendations: boolean;
  };
}