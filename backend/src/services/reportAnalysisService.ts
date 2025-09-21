/**
 * Report Analysis Service using Google Gemini AI
 * Provides detailed medical report analysis with safety measures
 */

import axios from 'axios';
import { SafetyService } from './safetyService.js';
import { 
  ReportAnalysisRequest, 
  ReportAnalysisResponse, 
  PatientInfo, 
  Parameter,
  Summary,
  Insights,
  AbnormalFinding,
  FutureComplication,
  LifestyleRecommendation,
  TreatmentApproach,
  GroupedIssue,
  AnalysisMeta
} from '../types/report-analysis.js';

export class ReportAnalysisService {
  private geminiApiKey: string;
  private safetyService: SafetyService;

  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY || '';
    this.safetyService = new SafetyService();
    
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key is required for report analysis');
    }
  }

  /**
   * Analyze medical report using Gemini AI
   */
  async analyzeReport(request: ReportAnalysisRequest): Promise<ReportAnalysisResponse> {
    const startTime = Date.now();
    
    try {
      // Create the analysis prompt
      const prompt = this.createAnalysisPrompt(request);
      
      // Call Gemini API
      const geminiResponse = await this.callGeminiAPI(prompt);
      
      // Parse and validate response
      const analysis = this.parseGeminiResponse(geminiResponse);
      
      // Apply safety checks
      const safetyCheck = this.safetyService.validateResponse(analysis);
      if (!safetyCheck.isSafe) {
        console.warn('Safety violations detected:', safetyCheck.violations);
        // Redact unsafe content
        analysis.insights.treatmentApproaches = analysis.insights.treatmentApproaches.map(approach => ({
          ...approach,
          generalApproach: this.safetyService.checkTextSafety(approach.generalApproach).redactedText
        }));
      }

      // Add metadata
      const processingTime = Date.now() - startTime;
      const meta: AnalysisMeta = {
        modelUsed: 'gemini-1.5-flash',
        disclaimer: this.safetyService.addSafetyDisclaimer(),
        timestamp: new Date().toISOString(),
        processingTime,
        confidence: this.calculateConfidence(analysis)
      };

      return {
        ...analysis,
        meta
      };

    } catch (error) {
      console.error('Report analysis error:', error);
      throw new Error('Failed to analyze medical report');
    }
  }

  /**
   * Create comprehensive analysis prompt for Gemini
   */
  private createAnalysisPrompt(request: ReportAnalysisRequest): string {
    const { patientInfo, reportText, parameters } = request;
    
    const abnormalParams = parameters.filter(p => p.status !== 'NORMAL');
    const normalParams = parameters.filter(p => p.status === 'NORMAL');

    return `You are a medical AI assistant providing decision-support analysis for medical reports. You must act as a decision-support tool with patient-friendly explanations, NOT a prescriber.

PATIENT INFORMATION:
${JSON.stringify(patientInfo, null, 2)}

MEDICAL REPORT TEXT:
${reportText}

LABORATORY PARAMETERS:
ABNORMAL VALUES:
${abnormalParams.map(p => `${p.name}: ${p.value} ${p.unit} (${p.status}) - Reference: ${p.refRange} - Group: ${p.group}`).join('\n')}

NORMAL VALUES:
${normalParams.map(p => `${p.name}: ${p.value} ${p.unit} (${p.status}) - Reference: ${p.refRange} - Group: ${p.group}`).join('\n')}

ANALYSIS REQUIREMENTS:

1. DETAILED REPORT ANALYSIS:
   - Highlight ALL abnormal values with name, result, unit, reference range, and status
   - Explain what each abnormal value might mean (e.g., "low sodium → possible hyponatremia")
   - Suggest which specialist to consult for each abnormal finding

2. FUTURE PREDICTIONS/COMPLICATIONS:
   - Provide general risk indicators if abnormal values remain untreated
   - Example: "If untreated, high potassium may cause heart rhythm issues"
   - Include preventive lifestyle recommendations (hydration, diet, exercise, sleep, stress control)

3. BASIC MEDICINE GUIDANCE (SAFE APPROACH):
   - Explain typical treatment approaches (e.g., "Vitamin D deficiency is often managed with supplements")
   - NEVER provide specific doses, schedules, or exact prescriptions
   - Always emphasize consultation with licensed doctors

SAFETY RULES - CRITICAL:
- NEVER return medicine doses, schedules, or exact prescriptions
- NEVER use patterns like "500 mg", "2 times/day", "take 100mg daily"
- ALWAYS include disclaimer about consulting licensed doctors
- Focus on general treatment approaches, not specific instructions

RESPOND WITH VALID JSON ONLY in this exact structure:

{
  "summary": {
    "overallAssessment": "Overall health assessment based on the report",
    "highlights": ["Key finding 1", "Key finding 2", "Key finding 3"],
    "keyFindings": ["Important observation 1", "Important observation 2"]
  },
  "insights": {
    "abnormalFindings": [
      {
        "parameter": "Parameter name",
        "value": "actual value",
        "unit": "unit",
        "refRange": "reference range",
        "status": "LOW or HIGH",
        "explanation": "What this might mean in patient-friendly terms",
        "specialistSuggestion": "Which specialist to consult (e.g., endocrinologist, nephrologist)"
      }
    ],
    "futureComplications": [
      {
        "condition": "Potential condition",
        "riskLevel": "low/medium/high",
        "description": "What could happen if untreated",
        "prevention": ["Prevention strategy 1", "Prevention strategy 2"]
      }
    ],
    "specialistSuggestions": ["Endocrinologist", "Cardiologist"],
    "lifestyleRecommendations": [
      {
        "category": "diet/exercise/hydration/sleep/stress/other",
        "recommendation": "Specific recommendation",
        "priority": "high/medium/low"
      }
    ],
    "treatmentApproaches": [
      {
        "condition": "Condition name",
        "generalApproach": "General treatment approach without specific dosing",
        "disclaimer": "Always consult a licensed doctor for exact prescription"
      }
    ]
  },
  "groupedIssues": [
    {
      "category": "Category name (e.g., Cardiovascular, Metabolic)",
      "parameters": [
        {
          "name": "Parameter name",
          "value": "value",
          "unit": "unit",
          "refRange": "reference range",
          "status": "LOW/NORMAL/HIGH",
          "group": "group name"
        }
      ],
      "recommendations": ["General recommendation 1", "General recommendation 2"],
      "priority": "high/medium/low"
    }
  ]
}

CRITICAL SAFETY REMINDER:
- NO specific dosages or schedules
- NO exact prescriptions
- ALWAYS emphasize professional medical consultation
- Focus on patient education and decision support

RESPOND ONLY WITH THE JSON OBJECT, NO ADDITIONAL TEXT.`;
  }

  /**
   * Call Gemini API with the analysis prompt
   */
  private async callGeminiAPI(prompt: string): Promise<string> {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2, // Low temperature for consistent medical analysis
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 4000,
          candidateCount: 1
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  }

  /**
   * Parse Gemini response and validate structure
   */
  private parseGeminiResponse(response: string): Omit<ReportAnalysisResponse, 'meta'> {
    try {
      // Clean the response to extract JSON
      let jsonText = response.trim();
      
      // Remove any markdown code blocks
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Parse JSON
      const parsed = JSON.parse(jsonText);
      
      // Validate required fields
      this.validateAnalysisStructure(parsed);
      
      return parsed;
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      throw new Error('Invalid response format from AI service');
    }
  }

  /**
   * Validate the structure of the analysis response
   */
  private validateAnalysisStructure(analysis: any): void {
    const requiredFields = ['summary', 'insights', 'groupedIssues'];
    
    for (const field of requiredFields) {
      if (!analysis[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate summary structure
    if (!analysis.summary.overallAssessment || !Array.isArray(analysis.summary.highlights)) {
      throw new Error('Invalid summary structure');
    }

    // Validate insights structure
    if (!analysis.insights.abnormalFindings || !Array.isArray(analysis.insights.abnormalFindings)) {
      throw new Error('Invalid insights structure');
    }
  }

  /**
   * Calculate confidence score based on analysis quality
   */
  private calculateConfidence(analysis: any): number {
    let confidence = 80; // Base confidence

    // Increase confidence based on completeness
    if (analysis.summary.highlights.length >= 3) confidence += 5;
    if (analysis.insights.abnormalFindings.length > 0) confidence += 5;
    if (analysis.insights.lifestyleRecommendations.length >= 3) confidence += 5;
    if (analysis.groupedIssues.length > 0) confidence += 5;

    // Ensure confidence is within bounds
    return Math.min(confidence, 95);
  }

  /**
   * Group parameters by category for analysis
   */
  private groupParametersByCategory(parameters: Parameter[]): Map<string, Parameter[]> {
    const grouped = new Map<string, Parameter[]>();
    
    parameters.forEach(param => {
      const category = param.group || 'Other';
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(param);
    });

    return grouped;
  }

  /**
   * Validate input parameters
   */
  validateInput(request: ReportAnalysisRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.reportText || request.reportText.trim().length < 10) {
      errors.push('Report text must be at least 10 characters long');
    }

    if (!request.parameters || request.parameters.length === 0) {
      errors.push('At least one parameter is required');
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
}
