/**
 * Utility functions for loading and working with medical report JSON documents
 */

export interface MedicalReportData {
  _id?: string;
  fileUrl?: string;
  status?: string;
  summary?: string[];
  extractedData?: {
    patientDetails?: {
      name?: string;
      age?: string;
      gender?: string;
      patientId?: string;
    };
    doctorDetails?: {
      referredBy?: string;
      referringHospital?: string | null;
      doctorSpecialization?: string | null;
    };
    labDetails?: {
      labName?: string;
      collectionDateTime?: string;
      reportingDateTime?: string;
      centre?: string;
      labId?: string;
      accreditationInfo?: string | null;
    };
    reportTypes?: Record<string, any[]>;
    flags?: Array<{
      parameter: string;
      value: string;
      status: string;
      recommendation: string;
    }>;
  };
  healthScore?: {
    overall: number;
    categories: Record<string, number>;
    interpretation: string;
  };
  plainTextInsights?: {
    summary?: string[];
    abnormalFindings?: string[];
    recommendations?: string[];
    followUpSuggestions?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

// Keep the original SwaggerDocument interface for backward compatibility
export interface SwaggerDocument {
  openapi?: string;
  swagger?: string;
  info?: {
    title?: string;
    version?: string;
    description?: string;
  };
  paths?: Record<string, any>;
  components?: Record<string, any>;
  [key: string]: any;
}

/**
 * Load medical report JSON document from a file path
 * @param filePath - Path to the medical report JSON file (relative to public folder)
 * @returns Promise<MedicalReportData | null>
 */
export async function loadMedicalReportData(filePath: string): Promise<MedicalReportData | null> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch medical report data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading medical report data:', error);
    return null;
  }
}

/**
 * Load Swagger JSON document from a file path (kept for backward compatibility)
 * @param filePath - Path to the Swagger JSON file (relative to public folder)
 * @returns Promise<SwaggerDocument | null>
 */
export async function loadSwaggerDocument(filePath: string): Promise<SwaggerDocument | null> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch Swagger document: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading Swagger document:', error);
    return null;
  }
}

/**
 * Load Swagger JSON document from a file input
 * @param file - File object from input[type="file"]
 * @returns Promise<SwaggerDocument | null>
 */
export async function loadSwaggerFromFile(file: File): Promise<SwaggerDocument | null> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error('Error parsing Swagger file:', error);
    return null;
  }
}

/**
 * Extract key information from a medical report for display
 * @param reportData - Medical report data object
 * @returns Formatted information object
 */
export function extractMedicalReportInfo(reportData: MedicalReportData) {
  const patient = reportData.extractedData?.patientDetails;
  const lab = reportData.extractedData?.labDetails;
  const healthScore = reportData.healthScore;
  
  return {
    patientName: patient?.name || 'Unknown Patient',
    patientAge: patient?.age || 'Unknown',
    patientGender: patient?.gender || 'Unknown',
    patientId: patient?.patientId || 'N/A',
    labName: lab?.labName || 'Unknown Lab',
    reportDate: lab?.reportingDateTime || lab?.collectionDateTime || 'Unknown Date',
    overallHealthScore: healthScore?.overall || 0,
    status: reportData.status || 'Unknown',
    summaryCount: reportData.summary?.length || 0,
    flagsCount: reportData.extractedData?.flags?.length || 0,
    testCategoriesCount: Object.keys(reportData.extractedData?.reportTypes || {}).length,
    abnormalFindingsCount: reportData.plainTextInsights?.abnormalFindings?.length || 0,
    recommendationsCount: reportData.plainTextInsights?.recommendations?.length || 0
  };
}

/**
 * Extract key information from a Swagger document for display (kept for backward compatibility)
 * @param swagger - Swagger document object
 * @returns Formatted information object
 */
export function extractSwaggerInfo(swagger: SwaggerDocument) {
  return {
    title: swagger.info?.title || 'Unknown API',
    version: swagger.info?.version || '1.0.0',
    description: swagger.info?.description || 'No description available',
    openApiVersion: swagger.openapi || swagger.swagger || 'Unknown',
    pathCount: Object.keys(swagger.paths || {}).length,
    componentCount: Object.keys(swagger.components || {}).length,
    endpoints: Object.keys(swagger.paths || {}).map(path => ({
      path,
      methods: Object.keys(swagger.paths?.[path] || {})
    }))
  };
}
