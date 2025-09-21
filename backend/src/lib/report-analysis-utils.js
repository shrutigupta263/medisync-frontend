/**
 * Utility functions for report analysis
 */

/**
 * Create analysis request from extracted text and basic patient info
 */
export function createAnalysisRequest(reportText, patientInfo = {}) {
  // Extract basic parameters from text (simplified version)
  const parameters = extractBasicParameters(reportText);
  
  return {
    patientInfo: {
      age: patientInfo.age,
      gender: patientInfo.gender,
      weight: patientInfo.weight,
      height: patientInfo.height,
      medicalHistory: patientInfo.medicalHistory || [],
      currentMedications: patientInfo.currentMedications || []
    },
    reportText: reportText.trim(),
    parameters
  };
}

/**
 * Extract basic parameters from report text
 */
function extractBasicParameters(text) {
  const parameters = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.length < 5) continue;
    
    // Pattern: "Parameter: value unit (reference) status"
    const match = trimmedLine.match(/^(.+?):\s*([0-9.]+)\s*([a-zA-Z/%]+)?\s*\(([^)]+)\)?\s*(HIGH|LOW|NORMAL)?/);
    if (match) {
      const [, name, value, unit = '', refRange = '', status = 'NORMAL'] = match;
      
      if (name && value) {
        parameters.push({
          name: name.trim(),
          value: parseFloat(value),
          unit: unit.trim(),
          refRange: refRange.trim() || 'Not specified',
          status: status || 'NORMAL',
          group: categorizeParameter(name.trim())
        });
      }
    }
  }

  // If no parameters found, create some basic ones
  if (parameters.length === 0) {
    parameters.push({
      name: 'General Assessment',
      value: 'Normal',
      unit: '',
      refRange: 'Normal',
      status: 'NORMAL',
      group: 'General'
    });
  }

  return parameters;
}

/**
 * Categorize parameter by medical group
 */
function categorizeParameter(parameterName) {
  const name = parameterName.toLowerCase();
  
  if (name.includes('glucose') || name.includes('hba1c') || name.includes('sugar')) {
    return 'Metabolic';
  }
  if (name.includes('cholesterol') || name.includes('triglyceride') || name.includes('hdl') || name.includes('ldl')) {
    return 'Lipid Profile';
  }
  if (name.includes('alt') || name.includes('ast') || name.includes('liver')) {
    return 'Liver Function';
  }
  if (name.includes('creatinine') || name.includes('bun') || name.includes('kidney')) {
    return 'Kidney Function';
  }
  if (name.includes('hemoglobin') || name.includes('hgb') || name.includes('hematocrit') || name.includes('wbc') || name.includes('rbc')) {
    return 'Hematology';
  }
  
  return 'Other';
}
