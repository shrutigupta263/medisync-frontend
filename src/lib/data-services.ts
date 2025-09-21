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

// Reports Service - Uses backend API only
export const reportsService = {
  // Get all reports for a specific user
  async getUserReports(userId: string): Promise<UserReport[]> {
    try {
      const reports = await apiClient.getUserReports(userId)
      return reports
    } catch (error) {
      console.error('Failed to get user reports:', error)
      return []
    }
  },

  // Get a specific report by ID
  async getUserReport(userId: string, reportId: string): Promise<UserReport | null> {
    try {
      const report = await apiClient.getReport(reportId, userId)
      return report
    } catch (error) {
      console.error('Failed to get report:', error)
      return null
    }
  },

  // Create a new report for a user (upload file)
  async createUserReport(userId: string, file: File): Promise<UserReport | null> {
    try {
      const response = await apiClient.uploadReport({ file, userId })
      
      // Return complete report object
      return {
        id: response.reportId,
        user_id: userId,
        title: file.name.replace(/\.[^/.]+$/, ''),
        type: file.type.includes('pdf') ? 'PDF' : 'Image',
        date: new Date().toISOString(),
        status: response.status as any,
        medical_data: response.analysis,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: response.message
      } as UserReport
    } catch (error) {
      console.error('Failed to create report:', error)
      throw error
    }
  },

  // Delete a report
  async deleteUserReport(userId: string, reportId: string): Promise<void> {
    try {
      await apiClient.deleteReport(reportId, userId)
    } catch (error) {
      console.error('Failed to delete report:', error)
      throw error
    }
  }
}

// Reminders Service - Simplified
export const remindersService = {
  async getUserReminders(userId: string): Promise<UserReminder[]> {
    // Return empty array for now since reminders are not implemented
    return []
  },

  async createUserReminder(userId: string, reminder: Partial<UserReminder>): Promise<UserReminder | null> {
    // Not implemented yet
    return null
  },

  async updateUserReminder(userId: string, reminderId: string, updates: Partial<UserReminder>): Promise<UserReminder | null> {
    // Not implemented yet
    return null
  },

  async deleteUserReminder(userId: string, reminderId: string): Promise<void> {
    // Not implemented yet
  }
}

// Dashboard Service - Simplified  
export const dashboardService = {
  async getUserDashboardStats(userId: string): Promise<UserDashboardStats> {
    try {
      const reports = await reportsService.getUserReports(userId)
      
      return {
        total_reports: reports.length,
        completed_reports: reports.filter(r => r.status === 'COMPLETED').length,
        pending_reports: reports.filter(r => r.status === 'PENDING').length,
        failed_reports: reports.filter(r => r.status === 'FAILED').length,
        recent_reports: reports.slice(0, 5)
      }
    } catch (error) {
      console.error('Failed to get dashboard stats:', error)
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