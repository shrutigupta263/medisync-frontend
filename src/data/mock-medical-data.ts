/**
 * Mock data for medical report widgets
 * Realistic, patient-friendly content for demo purposes
 */

export interface ClinicalNote {
  id: string;
  author: 'Doctor' | 'System' | 'Patient';
  text: string;
  timestamp: string;
}

export interface FollowUpTask {
  id: string;
  task: string;
  dueDate: string;
  status: 'pending' | 'done';
}

export interface TrendItem {
  parameter: string;
  currentValue: number;
  unit: string;
  previousValue: number;
  delta: number;
  status: 'LOW' | 'HIGH' | 'NORMAL';
  group: string;
}

export interface MockMedicalData {
  clinicalNotes: ClinicalNote[];
  followUpTasks: FollowUpTask[];
  trends: TrendItem[];
  disclaimer: string;
}

// Helper function to generate dates in the future
const getFutureDate = (weeksFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + (weeksFromNow * 7));
  return date.toISOString();
};

// Helper function to generate past dates
const getPastDate = (weeksAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - (weeksAgo * 7));
  return date.toISOString();
};

export const mockMedicalData: MockMedicalData = {
  clinicalNotes: [
    {
      id: 'note-001',
      author: 'Doctor',
      text: 'Blood glucose levels show improvement since last visit. Continue current lifestyle modifications.',
      timestamp: getPastDate(1)
    },
    {
      id: 'note-002',
      author: 'System',
      text: 'Recommended Vitamin D recheck in 3 months due to previous deficiency.',
      timestamp: getPastDate(2)
    },
    {
      id: 'note-003',
      author: 'Doctor',
      text: 'Cholesterol levels remain elevated. Dietary consultation recommended.',
      timestamp: getPastDate(3)
    },
    {
      id: 'note-004',
      author: 'Patient',
      text: 'Feeling more energetic since starting the recommended exercise routine.',
      timestamp: getPastDate(1)
    },
    {
      id: 'note-005',
      author: 'System',
      text: 'Blood pressure readings show stable trend within target range.',
      timestamp: getPastDate(4)
    }
  ],

  followUpTasks: [
    {
      id: 'task-001',
      task: 'Repeat HbA1c test to monitor diabetes control',
      dueDate: getFutureDate(12), // 3 months
      status: 'pending'
    },
    {
      id: 'task-002',
      task: 'Schedule cardiology consultation for cholesterol management',
      dueDate: getFutureDate(6), // 6 weeks
      status: 'pending'
    },
    {
      id: 'task-003',
      task: 'Vitamin D level recheck after supplementation',
      dueDate: getFutureDate(8), // 2 months
      status: 'pending'
    },
    {
      id: 'task-004',
      task: 'Complete basic metabolic panel for kidney function',
      dueDate: getFutureDate(4), // 1 month
      status: 'done'
    },
    {
      id: 'task-005',
      task: 'Blood pressure monitoring at home daily',
      dueDate: getFutureDate(2), // 2 weeks
      status: 'pending'
    },
    {
      id: 'task-006',
      task: 'Dietary consultation for cholesterol management',
      dueDate: getFutureDate(3), // 3 weeks
      status: 'pending'
    }
  ],

  trends: [
    {
      parameter: 'Sodium',
      currentValue: 138,
      unit: 'mmol/L',
      previousValue: 142,
      delta: -4,
      status: 'NORMAL',
      group: 'Electrolytes'
    },
    {
      parameter: 'Potassium',
      currentValue: 4.2,
      unit: 'mmol/L',
      previousValue: 3.8,
      delta: 0.4,
      status: 'NORMAL',
      group: 'Electrolytes'
    },
    {
      parameter: 'Chloride',
      currentValue: 102,
      unit: 'mmol/L',
      previousValue: 105,
      delta: -3,
      status: 'NORMAL',
      group: 'Electrolytes'
    },
    {
      parameter: 'HbA1c',
      currentValue: 7.8,
      unit: '%',
      previousValue: 8.2,
      delta: -0.4,
      status: 'HIGH',
      group: 'Diabetes'
    },
    {
      parameter: 'Fasting Glucose',
      currentValue: 125,
      unit: 'mg/dL',
      previousValue: 145,
      delta: -20,
      status: 'HIGH',
      group: 'Diabetes'
    },
    {
      parameter: 'Total Cholesterol',
      currentValue: 210,
      unit: 'mg/dL',
      previousValue: 220,
      delta: -10,
      status: 'HIGH',
      group: 'Lipids'
    },
    {
      parameter: 'LDL Cholesterol',
      currentValue: 135,
      unit: 'mg/dL',
      previousValue: 145,
      delta: -10,
      status: 'HIGH',
      group: 'Lipids'
    },
    {
      parameter: 'HDL Cholesterol',
      currentValue: 38,
      unit: 'mg/dL',
      previousValue: 35,
      delta: 3,
      status: 'LOW',
      group: 'Lipids'
    },
    {
      parameter: 'Triglycerides',
      currentValue: 165,
      unit: 'mg/dL',
      previousValue: 180,
      delta: -15,
      status: 'HIGH',
      group: 'Lipids'
    },
    {
      parameter: 'Creatinine',
      currentValue: 1.1,
      unit: 'mg/dL',
      previousValue: 1.2,
      delta: -0.1,
      status: 'NORMAL',
      group: 'Kidney Function'
    },
    {
      parameter: 'Hemoglobin',
      currentValue: 13.2,
      unit: 'g/dL',
      previousValue: 12.8,
      delta: 0.4,
      status: 'NORMAL',
      group: 'Hematology'
    },
    {
      parameter: 'Vitamin D',
      currentValue: 28,
      unit: 'ng/mL',
      previousValue: 22,
      delta: 6,
      status: 'LOW',
      group: 'Vitamins'
    }
  ],

  disclaimer: `
IMPORTANT MEDICAL DISCLAIMER:
This analysis is for informational purposes only and should not be considered as medical advice, diagnosis, or treatment recommendation. The information provided is based on general medical knowledge and should not replace professional medical consultation.

KEY SAFETY POINTS:
- Always consult with a licensed healthcare provider for proper diagnosis and treatment
- Exact dosage, frequency, and duration must be prescribed by a qualified doctor
- Do not self-medicate or adjust medications without medical supervision
- Seek immediate medical attention for serious symptoms or emergencies
- This analysis is a decision-support tool, not a prescriber

The analysis provided here is intended to help you understand your medical report better and facilitate informed discussions with your healthcare provider.
  `.trim()
};

// Export individual arrays for easy access
export const { clinicalNotes, followUpTasks, trends, disclaimer } = mockMedicalData;

// Utility functions for working with the mock data
export const getMockDataUtils = {
  // Get recent clinical notes (last 3)
  getRecentNotes: (count: number = 3) => clinicalNotes.slice(0, count),
  
  // Get pending follow-up tasks
  getPendingTasks: () => followUpTasks.filter(task => task.status === 'pending'),
  
  // Get completed follow-up tasks
  getCompletedTasks: () => followUpTasks.filter(task => task.status === 'done'),
  
  // Get trends by group
  getTrendsByGroup: (group: string) => trends.filter(trend => trend.group === group),
  
  // Get abnormal trends only
  getAbnormalTrends: () => trends.filter(trend => trend.status !== 'NORMAL'),
  
  // Get improving trends (positive delta for values that should be higher, negative for values that should be lower)
  getImprovingTrends: () => trends.filter(trend => {
    // Parameters where higher values are better
    const higherIsBetter = ['HDL Cholesterol', 'Hemoglobin', 'Vitamin D'];
    // Parameters where lower values are better  
    const lowerIsBetter = ['HbA1c', 'Fasting Glucose', 'Total Cholesterol', 'LDL Cholesterol', 'Triglycerides'];
    
    if (higherIsBetter.includes(trend.parameter)) {
      return trend.delta > 0; // Improvement = increase
    } else if (lowerIsBetter.includes(trend.parameter)) {
      return trend.delta < 0; // Improvement = decrease
    }
    return false; // Neutral for other parameters
  }),
  
  // Get status color for trends
  getTrendStatusColor: (status: string) => {
    switch (status) {
      case 'NORMAL': return 'text-green-600 bg-green-50';
      case 'HIGH': return 'text-red-600 bg-red-50';
      case 'LOW': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  },
  
  // Get delta indicator (↑ ↓ →)
  getDeltaIndicator: (delta: number) => {
    if (delta > 0) return '↑';
    if (delta < 0) return '↓';
    return '→';
  },
  
  // Get delta color (green for improvement, red for worsening, gray for stable)
  getDeltaColor: (parameter: string, delta: number) => {
    const higherIsBetter = ['HDL Cholesterol', 'Hemoglobin', 'Vitamin D'];
    const lowerIsBetter = ['HbA1c', 'Fasting Glucose', 'Total Cholesterol', 'LDL Cholesterol', 'Triglycerides'];
    
    if (delta === 0) return 'text-gray-500';
    
    if (higherIsBetter.includes(parameter)) {
      return delta > 0 ? 'text-green-600' : 'text-red-600';
    } else if (lowerIsBetter.includes(parameter)) {
      return delta < 0 ? 'text-green-600' : 'text-red-600';
    }
    
    return 'text-gray-600';
  }
};

// Sample usage examples for documentation
export const usageExamples = {
  // How to use in components
  clinicalNotesExample: `
// In your component:
import { getMockDataUtils } from '@/data/mock-medical-data';

const recentNotes = getMockDataUtils.getRecentNotes(3);
const hasMoreNotes = clinicalNotes.length > 3;
  `,
  
  followUpTasksExample: `
// In your component:
import { getMockDataUtils } from '@/data/mock-medical-data';

const pendingTasks = getMockDataUtils.getPendingTasks();
const completedTasks = getMockDataUtils.getCompletedTasks();
  `,
  
  trendsExample: `
// In your component:
import { getMockDataUtils } from '@/data/mock-medical-data';

const abnormalTrends = getMockDataUtils.getAbnormalTrends();
const improvingTrends = getMockDataUtils.getImprovingTrends();
const electrolyteTrends = getMockDataUtils.getTrendsByGroup('Electrolytes');
  `
};

export default mockMedicalData;
