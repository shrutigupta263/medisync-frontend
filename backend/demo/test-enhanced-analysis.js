#!/usr/bin/env node

/**
 * Test script for Enhanced AI Report Analysis
 * This script tests the new report analysis endpoint
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_BASE_URL = 'http://localhost:3001/api';

// Sample medical report data
const sampleReportRequest = {
  patientInfo: {
    age: 35,
    gender: 'male',
    weight: 75,
    height: 175,
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    currentMedications: ['Metformin', 'Lisinopril']
  },
  reportText: `
    COMPREHENSIVE METABOLIC PANEL
    Patient: John Doe
    Date: 2024-01-15
    
    RESULTS:
    Glucose: 145 mg/dL (Reference: 70-100 mg/dL) HIGH
    HbA1c: 8.2% (Reference: <7.0%) HIGH
    Total Cholesterol: 220 mg/dL (Reference: <200 mg/dL) HIGH
    LDL Cholesterol: 145 mg/dL (Reference: <100 mg/dL) HIGH
    HDL Cholesterol: 35 mg/dL (Reference: >40 mg/dL) LOW
    Triglycerides: 180 mg/dL (Reference: <150 mg/dL) HIGH
    
    KIDNEY FUNCTION:
    Creatinine: 1.2 mg/dL (Reference: 0.7-1.3 mg/dL) NORMAL
    BUN: 18 mg/dL (Reference: 7-20 mg/dL) NORMAL
    eGFR: 85 mL/min/1.73m² (Reference: >60) NORMAL
    
    LIVER FUNCTION:
    ALT: 45 U/L (Reference: 7-35 U/L) HIGH
    AST: 40 U/L (Reference: 8-40 U/L) NORMAL
    
    ELECTROLYTES:
    Sodium: 138 mmol/L (Reference: 136-145 mmol/L) NORMAL
    Potassium: 4.2 mmol/L (Reference: 3.5-5.0 mmol/L) NORMAL
    Chloride: 102 mmol/L (Reference: 98-107 mmol/L) NORMAL
    
    IMPRESSION:
    Poorly controlled diabetes mellitus with dyslipidemia and mild hepatic dysfunction.
    Recommend endocrinology consultation and lifestyle modifications.
  `,
  parameters: [
    {
      name: 'Glucose',
      value: 145,
      unit: 'mg/dL',
      refRange: '70-100',
      status: 'HIGH',
      group: 'Metabolic'
    },
    {
      name: 'HbA1c',
      value: 8.2,
      unit: '%',
      refRange: '<7.0',
      status: 'HIGH',
      group: 'Metabolic'
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
      name: 'LDL Cholesterol',
      value: 145,
      unit: 'mg/dL',
      refRange: '<100',
      status: 'HIGH',
      group: 'Lipid Profile'
    },
    {
      name: 'HDL Cholesterol',
      value: 35,
      unit: 'mg/dL',
      refRange: '>40',
      status: 'LOW',
      group: 'Lipid Profile'
    },
    {
      name: 'Triglycerides',
      value: 180,
      unit: 'mg/dL',
      refRange: '<150',
      status: 'HIGH',
      group: 'Lipid Profile'
    },
    {
      name: 'ALT',
      value: 45,
      unit: 'U/L',
      refRange: '7-35',
      status: 'HIGH',
      group: 'Liver Function'
    }
  ]
};

async function testHealthEndpoint() {
  console.log('🔍 Testing health endpoint...');
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testAnalysisStatus() {
  console.log('🔍 Testing analysis status endpoint...');
  try {
    const response = await axios.get(`${API_BASE_URL}/report-analysis/status`);
    console.log('✅ Analysis status:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Analysis status failed:', error.message);
    return false;
  }
}

async function testReportAnalysis() {
  console.log('🔍 Testing report analysis endpoint...');
  console.log('📊 Sample request:', JSON.stringify(sampleReportRequest, null, 2));
  
  try {
    const startTime = Date.now();
    const response = await axios.post(
      `${API_BASE_URL}/report-analysis/analyze`,
      sampleReportRequest,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      }
    );
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('✅ Analysis completed successfully!');
    console.log(`⏱️  Processing time: ${duration}ms`);
    console.log('📋 Analysis results:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Save results to file
    const resultsPath = path.join(process.cwd(), 'demo', 'analysis-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(response.data, null, 2));
    console.log(`💾 Results saved to: ${resultsPath}`);
    
    return true;
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    if (error.response) {
      console.error('📄 Error details:', error.response.data);
    }
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Enhanced AI Report Analysis Tests\n');
  
  const healthOk = await testHealthEndpoint();
  console.log('');
  
  const statusOk = await testAnalysisStatus();
  console.log('');
  
  if (healthOk && statusOk) {
    await testReportAnalysis();
  } else {
    console.log('⚠️  Skipping analysis test due to service unavailability');
  }
  
  console.log('\n🏁 Test completed!');
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Enhanced AI Report Analysis Test Script

Usage: node test-enhanced-analysis.js [options]

Options:
  --help, -h    Show this help message
  --api-url     Set custom API base URL (default: http://localhost:3001/api)

Environment Variables:
  GEMINI_API_KEY    Your Google Gemini API key
  API_BASE_URL      Custom API base URL

Example:
  node test-enhanced-analysis.js --api-url http://localhost:3001/api
  `);
  process.exit(0);
}

// Override API URL if provided
const apiUrlIndex = args.indexOf('--api-url');
if (apiUrlIndex !== -1 && args[apiUrlIndex + 1]) {
  API_BASE_URL = args[apiUrlIndex + 1];
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});
