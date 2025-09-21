/**
 * Safety Service for medical report analysis
 * Redacts dosing patterns and enforces safety rules
 */

import { SafetyCheckResult } from '../types/report-analysis.js';

export class SafetyService {
  private dosingPatterns: RegExp[];
  private prescriptionPatterns: RegExp[];
  private schedulePatterns: RegExp[];

  constructor() {
    // Patterns to detect and redact dosing information
    this.dosingPatterns = [
      // Dosage patterns: "500mg", "2.5mg", "100 units", etc.
      /\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|units?|ml|tablets?|capsules?|pills?)\b/gi,
      
      // Frequency patterns: "twice daily", "3 times a day", "q8h", etc.
      /\b(?:once|twice|thrice|\d+ times?)\s+(?:daily|a day|per day|day|week|month)\b/gi,
      /\bq\d+h\b/gi, // q8h, q12h, etc.
      /\b(?:every|every other)\s+\d+\s*(?:hours?|days?|weeks?|months?)\b/gi,
      
      // Duration patterns: "for 7 days", "take for 2 weeks", etc.
      /\b(?:take|use|apply)\s+(?:for\s+)?\d+\s*(?:days?|weeks?|months?)\b/gi,
      
      // Specific medication instructions
      /\b(?:take|use|apply|administer)\s+\d+(?:\.\d+)?\s*(?:mg|mcg|g|units?|ml|tablets?|capsules?)\b/gi,
    ];

    // Patterns to detect prescription language
    this.prescriptionPatterns = [
      /\b(?:prescribe|prescription|dosage|dose|schedule)\b/gi,
      /\b(?:exactly|precisely|specifically)\s+\d+/gi,
      /\b(?:must|should)\s+take\s+\d+/gi,
    ];

    // Patterns to detect scheduling information
    this.schedulePatterns = [
      /\b(?:morning|evening|bedtime|before meals|after meals|with food)\s*:?\s*\d+/gi,
      /\b(?:breakfast|lunch|dinner)\s*:?\s*\d+/gi,
    ];
  }

  /**
   * Check text for safety violations and redact unsafe content
   */
  checkTextSafety(text: string): SafetyCheckResult {
    const violations: string[] = [];
    let redactedText = text;

    // Check for dosing patterns
    this.dosingPatterns.forEach((pattern, index) => {
      const matches = text.match(pattern);
      if (matches) {
        violations.push(`Dosing pattern detected: ${matches.join(', ')}`);
        redactedText = redactedText.replace(pattern, '[REDACTED: Dosage information]');
      }
    });

    // Check for prescription language
    this.prescriptionPatterns.forEach((pattern, index) => {
      const matches = text.match(pattern);
      if (matches) {
        violations.push(`Prescription language detected: ${matches.join(', ')}`);
        redactedText = redactedText.replace(pattern, '[REDACTED: Prescription language]');
      }
    });

    // Check for scheduling patterns
    this.schedulePatterns.forEach((pattern, index) => {
      const matches = text.match(pattern);
      if (matches) {
        violations.push(`Schedule pattern detected: ${matches.join(', ')}`);
        redactedText = redactedText.replace(pattern, '[REDACTED: Schedule information]');
      }
    });

    // Check for specific dangerous patterns
    const dangerousPatterns = [
      /\b(?:start|begin|initiate)\s+(?:with|on)\s+\d+/gi,
      /\b(?:increase|decrease|adjust)\s+(?:to|by)\s+\d+/gi,
      /\b(?:maximum|minimum|max|min)\s+(?:dose|dosage)\s*:?\s*\d+/gi,
    ];

    dangerousPatterns.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) {
        violations.push(`Dangerous pattern detected: ${matches.join(', ')}`);
        redactedText = redactedText.replace(pattern, '[REDACTED: Dangerous instruction]');
      }
    });

    return {
      isSafe: violations.length === 0,
      redactedText,
      violations
    };
  }

  /**
   * Validate AI response for safety compliance
   */
  validateResponse(response: any): SafetyCheckResult {
    const responseText = JSON.stringify(response);
    return this.checkTextSafety(responseText);
  }

  /**
   * Add safety disclaimer to response
   */
  addSafetyDisclaimer(): string {
    return `
IMPORTANT MEDICAL DISCLAIMER:
This analysis is for informational purposes only and should not be considered as medical advice, diagnosis, or treatment recommendation. The information provided is based on general medical knowledge and should not replace professional medical consultation.

KEY SAFETY POINTS:
- Always consult with a licensed healthcare provider for proper diagnosis and treatment
- Exact dosage, frequency, and duration must be prescribed by a qualified doctor
- Do not self-medicate or adjust medications without medical supervision
- Seek immediate medical attention for serious symptoms or emergencies
- This analysis is a decision-support tool, not a prescriber

The analysis provided here is intended to help you understand your medical report better and facilitate informed discussions with your healthcare provider.`;
  }

  /**
   * Sanitize parameter values for safe display
   */
  sanitizeParameterValue(value: string | number): string {
    const stringValue = value.toString();
    
    // Remove any dosing information from parameter values
    let sanitized = stringValue;
    this.dosingPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[Value]');
    });

    return sanitized;
  }

  /**
   * Validate that response doesn't contain specific medication recommendations
   */
  validateNoSpecificMedications(text: string): boolean {
    const medicationPatterns = [
      /\b(?:take|use|start|begin)\s+\d+/gi,
      /\b\d+\s*(?:mg|mcg|g|units?)\s+(?:daily|twice|once)/gi,
      /\b(?:prescribe|recommend)\s+\d+/gi,
    ];

    return !medicationPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Check if text contains appropriate disclaimers
   */
  hasAppropriateDisclaimers(text: string): boolean {
    const disclaimerKeywords = [
      'consult',
      'doctor',
      'physician',
      'healthcare',
      'medical advice',
      'prescription',
      'licensed'
    ];

    const lowerText = text.toLowerCase();
    return disclaimerKeywords.some(keyword => lowerText.includes(keyword));
  }
}
