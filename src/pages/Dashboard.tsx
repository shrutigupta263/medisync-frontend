import React, { useState } from 'react';
import { Upload, FileText, Pill, Calendar, Activity, Clock, User, Zap, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { UploadReportDialog } from '@/components/UploadReportDialog';
import { useUserDashboardStats, useUserReminders } from '@/hooks/use-user-data';
import { useAuth } from '@/contexts/AuthContext';
import { getUserDisplayName } from '@/lib/user-utils';

export default function Dashboard() {
  const { user } = useAuth();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { data: dashboardStats, isLoading: statsLoading } = useUserDashboardStats();
  const { data: reminders = [], isLoading: remindersLoading } = useUserReminders();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {getUserDisplayName(user)}! Here's your health overview.
        </p>
      </div>

      {/* Get Started Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Get Started with Your Report</CardTitle>
          <CardDescription className="text-blue-700">
            Upload your medical report to receive AI-powered analysis, insights, and a detailed summary of your health metrics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setUploadDialogOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : dashboardStats?.total_reports || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats?.completed_reports || 0} completed
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsLoading ? '...' : dashboardStats?.completed_reports || 0}
            </div>
            <p className="text-xs text-muted-foreground">Ready for review</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {statsLoading ? '...' : dashboardStats?.pending_reports || 0}
            </div>
            <p className="text-xs text-muted-foreground">Processing</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statsLoading ? '...' : dashboardStats?.failed_reports || 0}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your health activity from the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Activity chart will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Reminders
            </CardTitle>
            <CardDescription>Upcoming tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {remindersLoading ? (
                <div className="text-center text-muted-foreground py-4">
                  Loading reminders...
                </div>
              ) : reminders.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No reminders yet. Add some to stay on top of your health!
                </div>
              ) : (
                reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center gap-3 p-2">
                    <div className={`w-2 h-2 rounded-full ${reminder.color}`}></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{reminder.title}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{reminder.time}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Report Dialog */}
      <UploadReportDialog 
        open={uploadDialogOpen} 
        onOpenChange={setUploadDialogOpen} 
      />

    </div>
  );
}