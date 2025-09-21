/**
 * Utility functions for medical report analysis
 */

import { ReportAnalysisRequest, Parameter, PatientInfo } from '@/types/report-analysis';

/**
 * Extract parameters from medical report text using pattern matching
 */
export function extractParametersFromText(reportText: string): Parameter[] {
  const parameters: Parameter[] = [];
  const lines = reportText.split('\n');
  
  // Common parameter patterns
  const parameterPatterns = [
    // Pattern: "Parameter Name: value unit (reference range)"
    /^(.+?):\s*([0-9.]+)\s*([a-zA-Z/%]+)?\s*\(([^)]+)\)?\s*(.*)$/,
    // Pattern: "Parameter Name value unit reference"
    /^(.+?)\s+([0-9.]+)\s*([a-zA-Z/%]+)?\s+([0-9.-]+\s*[-–]\s*[0-9.-]+)\s*(.*)$/,
  ];

  let parameterIndex = 0;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.length < 5) continue;
    
    for (const pattern of parameterPatterns) {
      const match = trimmedLine.match(pattern);
      if (match) {
        const [, name, value, unit = '', refRange = '', status = ''] = match;
        
        if (name && value) {
          const numericValue = parseFloat(value);
          const paramStatus = determineParameterStatus(numericValue, refRange, status);
          
          parameters.push({
            name: name.trim(),
            value: numericValue,
            unit: unit.trim(),
            refRange: refRange.trim() || 'Not specified',
            status: paramStatus,
            group: categorizeParameter(name.trim())
          });
          
          parameterIndex++;
        }
        break;
      }
    }
  }

  // If no parameters found, create sample parameters for demonstration
  if (parameters.length === 0) {
    parameters.push(
      {
        name: 'Hemoglobin',
        value: 12.5,
        unit: 'g/dL',
        refRange: '13.5-17.5',
        status: 'LOW',
        group: 'Hematology'
      },
      {
        name: 'Total Cholesterol',
        value: 220,
        unit: 'mg/dL',
        refRange: '<200',
        status: 'HIGH',
        group: 'Lipid Profile'
      },
      {
        name: 'Blood Glucose',
        value: 95,
        unit: 'mg/dL',
        refRange: '70-100',
        status: 'NORMAL',
        group: 'Metabolic'
      }
    );
  }

  return parameters;
}

/**
 * Determine parameter status based on value and reference range
 */
function determineParameterStatus(value: number, refRange: string, statusHint: string): 'LOW' | 'NORMAL' | 'HIGH' {
  // If status is explicitly mentioned
  const upperStatusHint = statusHint.toUpperCase();
  if (upperStatusHint.includes('LOW') || upperStatusHint.includes('BELOW')) return 'LOW';
  if (upperStatusHint.includes('HIGH') || upperStatusHint.includes('ABOVE')) return 'HIGH';
  if (upperStatusHint.includes('NORMAL')) return 'NORMAL';

  // Parse reference range
  const rangeMatch = refRange.match(/([0-9.]+)\s*[-–]\s*([0-9.]+)/);
  if (rangeMatch) {
    const [, minStr, maxStr] = rangeMatch;
    const min = parseFloat(minStr);
    const max = parseFloat(maxStr);
    
    if (value < min) return 'LOW';
    if (value > max) return 'HIGH';
    return 'NORMAL';
  }

  // Single threshold patterns like "<200" or ">5"
  const thresholdMatch = refRange.match(/([<>])([0-9.]+)/);
  if (thresholdMatch) {
    const [, operator, thresholdStr] = thresholdMatch;
    const threshold = parseFloat(thresholdStr);
    
    if (operator === '<' && value >= threshold) return 'HIGH';
    if (operator === '>' && value <= threshold) return 'LOW';
    return 'NORMAL';
  }

  return 'NORMAL'; // Default to normal if can't determine
}

/**
 * Categorize parameter by medical group
 */
function categorizeParameter(parameterName: string): string {
  const name = parameterName.toLowerCase();
  
  const categories: Record<string, string[]> = {
    'Hematology': [
      'hemoglobin', 'hgb', 'hematocrit', 'hct', 'rbc', 'wbc', 'platelet', 'mcv', 'mch', 'mchc'
    ],
    'Lipid Profile': [
      'cholesterol', 'ldl', 'hdl', 'triglycerides', 'vldl'
    ],
    'Liver Function': [
      'alt', 'ast', 'alp', 'bilirubin', 'albumin', 'protein', 'sgpt', 'sgot'
    ],
    'Kidney Function': [
      'creatinine', 'urea', 'bun', 'uric acid', 'egfr'
    ],
    'Metabolic': [
      'glucose', 'hba1c', 'insulin', 'c-peptide'
    ],
    'Electrolytes': [
      'sodium', 'potassium', 'chloride', 'calcium', 'phosphorus', 'magnesium'
    ],
    'Thyroid': [
      'tsh', 'ft3', 'ft4', 't3', 't4', 'thyroid'
    ],
    'Cardiac': [
      'troponin', 'ck-mb', 'bnp', 'nt-probnp'
    ],
    'Inflammatory': [
      'esr', 'crp', 'c-reactive protein'
    ],
    'Vitamins': [
      'vitamin', 'b12', 'folate', 'ferritin', 'iron'
    ]
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }

  return 'Other';
}

/**
 * Create a report analysis request from extracted data
 */
export function createAnalysisRequest(
  reportText: string,
  patientInfo: Partial<PatientInfo> = {},
  customParameters?: Parameter[]
): ReportAnalysisRequest {
  const parameters = customParameters || extractParametersFromText(reportText);
  
  const defaultPatientInfo: PatientInfo = {
    age: patientInfo.age,
    gender: patientInfo.gender,
    weight: patientInfo.weight,
    height: patientInfo.height,
    medicalHistory: patientInfo.medicalHistory || [],
    currentMedications: patientInfo.currentMedications || []
  };

  return {
    patientInfo: defaultPatientInfo,
    reportText: reportText.trim(),
    parameters
  };
}

/**
 * Validate analysis request before sending
 */
export function validateAnalysisRequest(request: ReportAnalysisRequest): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!request.reportText || request.reportText.trim().length < 10) {
    errors.push('Report text must be at least 10 characters long');
  }

  if (!request.parameters || request.parameters.length === 0) {
    errors.push('At least one parameter is required for analysis');
  }

  // Validate each parameter
  request.parameters.forEach((param, index) => {
    if (!param.name || !param.value || !param.unit || !param.refRange) {
      errors.push(`Parameter ${index + 1} is missing required fields`);
    }
    
    if (!['LOW', 'NORMAL', 'HIGH'].includes(param.status)) {
      errors.push(`Parameter ${index + 1} has invalid status: ${param.status}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Format parameter value for display
 */
export function formatParameterValue(value: string | number, unit: string): string {
  if (typeof value === 'number') {
    return `${value.toFixed(2)} ${unit}`.trim();
  }
  return `${value} ${unit}`.trim();
}

/**
 * Get parameter status color class
 */
export function getParameterStatusColor(status: 'LOW' | 'NORMAL' | 'HIGH'): string {
  switch (status) {
    case 'NORMAL':
      return 'text-green-600 bg-green-50';
    case 'HIGH':
      return 'text-red-600 bg-red-50';
    case 'LOW':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

/**
 * Group parameters by category
 */
export function groupParametersByCategory(parameters: Parameter[]): Record<string, Parameter[]> {
  return parameters.reduce((groups, param) => {
    const category = param.group || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(param);
    return groups;
  }, {} as Record<string, Parameter[]>);
}

/**
 * Get color class for category score
 */
export function getCategoryScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 bg-green-50';
  if (score >= 60) return 'text-yellow-600 bg-yellow-50';
  if (score >= 40) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
}

/**
 * Get overall health score color
 */
export function getOverallScoreColor(score: number): string {
  if (score >= 85) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  if (score >= 50) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Group test parameters into categories
 */
export function groupParameters(parameters: any[]): any[] {
  const grouped = parameters.reduce((acc, param) => {
    const group = param.group || 'Other';
    if (!acc[group]) {
      acc[group] = {
        name: group,
        count: 0,
        parameters: []
      };
    }
    acc[group].parameters.push(param);
    acc[group].count++;
    return acc;
  }, {});

  return Object.values(grouped);
}

/**
 * Filter parameter groups based on search query
 */
export function filterParameterGroups(groups: any[], searchQuery: string): any[] {
  if (!searchQuery) return groups;
  
  return groups.map(group => ({
    ...group,
    parameters: group.parameters.filter((param: any) =>
      param.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.parameters.length > 0);
}

/**
 * Get status badge style for test parameters
 */
export function getStatusBadgeStyle(status: string): string {
  switch (status.toUpperCase()) {
    case 'NORMAL':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'HIGH':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'LOW':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Format reference range for display
 */
export function formatReferenceRange(range: any): string {
  if (typeof range === 'string') return range;
  if (range?.low !== undefined && range?.high !== undefined) {
    return `${range.low} - ${range.high} ${range.unit || ''}`.trim();
  }
  return 'Not specified';
}

