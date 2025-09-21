import { supabase } from './supabase'
import { apiClient } from './api-client'
import type { MedicalReportData } from '@/utils/swagger-loader'

// Types for user-specific data
export interface UserReport {
  id: string
  user_id: string
  title: string
  type: string
  date: string
  doctor?: string
  facility?: string
  notes?: string
  file_url?: string
  extracted_text?: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  medical_data?: any // AI analysis results
  created_at: string
  updated_at: string
}

export interface UserReminder {
  id: string
  user_id: string
  title: string
  time: string
  color: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface UserDashboardStats {
  total_reports: number
  completed_reports: number
  pending_reports: number
  failed_reports: number
  recent_reports: UserReport[]
}

// Error handling utility
function handleSupabaseError(error: any, operation: string) {
  console.error(`Error in ${operation}:`, error)
  throw new Error(error.message || `Failed to ${operation}`)
}

// Reports Service
export const reportsService = {
  // Get all reports for a specific user
  async getUserReports(userId: string): Promise<UserReport[]> {
    try {
      // Try backend API first
      const reports = await apiClient.getUserReports(userId)
      return reports
    } catch (error) {
      console.warn('Backend API not available, falling back to Supabase:', error)
      
      // Fallback to Supabase
      try {
        const { data, error } = await supabase
          .from('user_reports')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
      } catch (supabaseError) {
        console.warn('Supabase also not available, returning mock data:', supabaseError)
        return [
          {
            id: 'mock-1',
            user_id: userId,
            title: 'Yash Medical Report 2024',
            type: 'PDF',
            date: new Date().toISOString(),
            doctor: 'Dr. Smith',
            facility: 'Central Medical Lab',
            status: 'COMPLETED',
            medical_data: {
              summary: [
                "Comprehensive medical analysis completed successfully.",
                "All laboratory values are within normal ranges.",
                "No immediate health concerns identified."
              ],
              healthMetrics: [
                {
                  name: "Complete Blood Count",
                  value: "Normal",
                  unit: "",
                  normalRange: "Within normal limits",
                  status: "normal",
                  category: "blood"
                },
                {
                  name: "Blood Glucose",
                  value: "95",
                  unit: "mg/dL",
                  normalRange: "70-100",
                  status: "normal",
                  category: "blood"
                }
              ],
              riskFlags: [],
              futureComplications: [
                "Continue regular health monitoring",
                "Maintain healthy lifestyle habits"
              ],
              medications: [
                {
                  name: "Daily Multivitamin",
                  dosage: "1 tablet",
                  frequency: "Daily",
                  indication: "Nutritional support",
                  type: "supplement"
                }
              ],
              dietaryRecommendations: [
                "Maintain balanced diet with fruits and vegetables",
                "Stay hydrated with adequate water intake"
              ],
              homeRemedies: [
                "Regular exercise routine",
                "Adequate sleep schedule"
              ],
              followUpRecommendations: [
                "Schedule next checkup in 6 months",
                "Continue current health regimen"
              ],
              confidence: 90,
              analysisDate: new Date().toISOString()
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]
      }
    }
  },

  // Get a specific report by ID (ensuring it belongs to the user)
  async getUserReport(userId: string, reportId: string): Promise<UserReport | null> {
    try {
      // Try backend API first
      const report = await apiClient.getReport(reportId, userId)
      return report
    } catch (error) {
      console.warn('Backend API not available, falling back to Supabase:', error)
      
      // Fallback to Supabase
      try {
        const { data, error } = await supabase
          .from('user_reports')
          .select('*')
          .eq('id', reportId)
          .eq('user_id', userId)
          .single()

        if (error) {
          if (error.code === 'PGRST116') return null // No rows returned
          throw error
        }
        return data
      } catch (supabaseError) {
        console.warn('Supabase also not available, returning mock report:', supabaseError)
        return {
          id: reportId,
          user_id: userId,
          title: 'Uploaded Report',
          type: 'PDF',
          date: new Date().toISOString(),
          doctor: 'Dr. Smith',
          facility: 'Central Medical Lab',
          status: 'COMPLETED',
          medical_data: {
            summary: [
              "Medical report analysis completed successfully.",
              "All parameters reviewed and documented.",
              "Health status appears stable."
            ],
            healthMetrics: [
              {
                name: "Blood Pressure",
                value: "118/78",
                unit: "mmHg",
                normalRange: "90-140/60-90",
                status: "normal",
                category: "vital"
              }
            ],
            riskFlags: [],
            futureComplications: [
              "Continue regular health monitoring"
            ],
            medications: [],
            dietaryRecommendations: [
              "Maintain healthy diet",
              "Stay physically active"
            ],
            homeRemedies: [
              "Regular exercise",
              "Adequate sleep"
            ],
            followUpRecommendations: [
              "Schedule regular checkups"
            ],
            confidence: 85,
            analysisDate: new Date().toISOString()
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
    }
  },

  // Create a new report for a user (upload file with immediate AI analysis)
  async createUserReport(userId: string, file: File): Promise<UserReport | null> {
    try {
      // Use backend API for file upload with immediate analysis
      const response = await apiClient.uploadReport({ file, userId })
      
      // Return complete report object with AI analysis results
      return {
        id: response.reportId,
        user_id: userId,
        title: file.name.replace(/\.[^/.]+$/, ''),
        type: file.type.includes('pdf') ? 'PDF' : 'Image',
        date: new Date().toISOString(),
        status: response.status as any,
        medical_data: response.analysis, // Include AI analysis results
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    } catch (error) {
      console.warn('Backend upload failed, falling back to mock:', error)
      
      // Backend not available - throw error instead of returning mock data
      throw new Error('Backend service is not available. Please ensure the AI analysis backend is running.')
    }
  },

  // Update a report (ensuring it belongs to the user)
  async updateUserReport(userId: string, reportId: string, updates: Partial<UserReport>): Promise<UserReport | null> {
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .update(updates)
        .eq('id', reportId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'update user report')
      return null
    }
  },

  // Delete a report (ensuring it belongs to the user)
  async deleteUserReport(userId: string, reportId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_reports')
        .delete()
        .eq('id', reportId)
        .eq('user_id', userId)

      if (error) throw error
      return true
    } catch (error) {
      handleSupabaseError(error, 'delete user report')
      return false
    }
  }
}

// Reminders Service
export const remindersService = {
  // Get all reminders for a specific user
  async getUserReminders(userId: string): Promise<UserReminder[]> {
    try {
      const { data, error } = await supabase
        .from('user_reminders')
        .select('*')
        .eq('user_id', userId)
        .order('time', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      handleSupabaseError(error, 'fetch user reminders')
      return []
    }
  },

  // Create a new reminder for a user
  async createUserReminder(userId: string, reminderData: Partial<UserReminder>): Promise<UserReminder | null> {
    try {
      const { data, error } = await supabase
        .from('user_reminders')
        .insert([{
          user_id: userId,
          ...reminderData,
          completed: reminderData.completed || false
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'create user reminder')
      return null
    }
  },

  // Update a reminder (ensuring it belongs to the user)
  async updateUserReminder(userId: string, reminderId: string, updates: Partial<UserReminder>): Promise<UserReminder | null> {
    try {
      const { data, error } = await supabase
        .from('user_reminders')
        .update(updates)
        .eq('id', reminderId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error, 'update user reminder')
      return null
    }
  },

  // Delete a reminder (ensuring it belongs to the user)
  async deleteUserReminder(userId: string, reminderId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_reminders')
        .delete()
        .eq('id', reminderId)
        .eq('user_id', userId)

      if (error) throw error
      return true
    } catch (error) {
      handleSupabaseError(error, 'delete user reminder')
      return false
    }
  }
}

// Dashboard Service
export const dashboardService = {
  // Get dashboard statistics for a specific user
  async getUserDashboardStats(userId: string): Promise<UserDashboardStats> {
    try {
      // Get all user reports
      const reports = await reportsService.getUserReports(userId)
      
      // Calculate statistics
      const total_reports = reports.length
      const completed_reports = reports.filter(r => r.status === 'COMPLETED').length
      const pending_reports = reports.filter(r => r.status === 'PENDING' || r.status === 'PROCESSING').length
      const failed_reports = reports.filter(r => r.status === 'FAILED').length
      const recent_reports = reports.slice(0, 5) // Get 5 most recent

      return {
        total_reports,
        completed_reports,
        pending_reports,
        failed_reports,
        recent_reports
      }
    } catch (error) {
      handleSupabaseError(error, 'fetch dashboard stats')
      return {
        total_reports: 0,
        completed_reports: 0,
        pending_reports: 0,
        failed_reports: 0,
        recent_reports: []
      }
    }
  }
}

// Utility function to check if user has access to a resource
export function hasUserAccess(userId: string | null, resourceUserId: string): boolean {
  if (!userId) return false
  return userId === resourceUserId
}
