import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from './use-toast'
import { 
  reportsService, 
  remindersService, 
  dashboardService,
  type UserReport,
  type UserReminder,
  type UserDashboardStats
} from '@/lib/data-services'

// Reports Hooks
export function useUserReports() {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['reports', userId],
    queryFn: () => userId ? reportsService.getUserReports(userId) : [],
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUserReport(reportId: string) {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['report', userId, reportId],
    queryFn: () => userId ? reportsService.getUserReport(userId, reportId) : null,
    enabled: !!userId && !!reportId,
  })
}

export function useCreateReport() {
  const { userId } = useAuth()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (reportData: Partial<UserReport>) => {
      if (!userId) throw new Error('User not authenticated')
      return reportsService.createUserReport(userId, reportData)
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['reports', userId] })
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats', userId] })
        toast({
          title: "Report Created",
          description: "Your medical report has been uploaded successfully.",
        })
      }
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload report. Please try again.",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateReport() {
  const { userId } = useAuth()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ reportId, updates }: { reportId: string; updates: Partial<UserReport> }) => {
      if (!userId) throw new Error('User not authenticated')
      return reportsService.updateUserReport(userId, reportId, updates)
    },
    onSuccess: (data, variables) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['reports', userId] })
        queryClient.invalidateQueries({ queryKey: ['report', userId, variables.reportId] })
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats', userId] })
        toast({
          title: "Report Updated",
          description: "Your report has been updated successfully.",
        })
      }
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update report. Please try again.",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteReport() {
  const { userId } = useAuth()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (reportId: string) => {
      if (!userId) throw new Error('User not authenticated')
      return reportsService.deleteUserReport(userId, reportId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', userId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats', userId] })
      toast({
        title: "Report Deleted",
        description: "Your report has been deleted successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete report. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Reminders Hooks
export function useUserReminders() {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['reminders', userId],
    queryFn: () => userId ? remindersService.getUserReminders(userId) : [],
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useCreateReminder() {
  const { userId } = useAuth()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (reminderData: Partial<UserReminder>) => {
      if (!userId) throw new Error('User not authenticated')
      return remindersService.createUserReminder(userId, reminderData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', userId] })
      toast({
        title: "Reminder Created",
        description: "Your reminder has been added successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Reminder",
        description: error.message || "Failed to create reminder. Please try again.",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateReminder() {
  const { userId } = useAuth()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ reminderId, updates }: { reminderId: string; updates: Partial<UserReminder> }) => {
      if (!userId) throw new Error('User not authenticated')
      return remindersService.updateUserReminder(userId, reminderId, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', userId] })
      toast({
        title: "Reminder Updated",
        description: "Your reminder has been updated successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update reminder. Please try again.",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteReminder() {
  const { userId } = useAuth()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (reminderId: string) => {
      if (!userId) throw new Error('User not authenticated')
      return remindersService.deleteUserReminder(userId, reminderId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', userId] })
      toast({
        title: "Reminder Deleted",
        description: "Your reminder has been deleted successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete reminder. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Dashboard Hooks
export function useUserDashboardStats() {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['dashboard-stats', userId],
    queryFn: () => userId ? dashboardService.getUserDashboardStats(userId) : {
      total_reports: 0,
      completed_reports: 0,
      pending_reports: 0,
      failed_reports: 0,
      recent_reports: []
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
