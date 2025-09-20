import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, Search, Filter, FileText, Calendar, Eye, Download, Trash2, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadReportDialog } from '@/components/UploadReportDialog';
import { useUserReports, useDeleteReport } from '@/hooks/use-user-data';
import { useAuth } from '@/contexts/AuthContext';
import { getStatusColor } from '@/lib/report-utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';

// Summary data will be calculated from user reports

export default function Reports() {
  const { user } = useAuth();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { data: reports = [], isLoading, error } = useUserReports();
  const deleteReport = useDeleteReport();

  // Calculate summary data from user reports
  const summaryData = {
    completed: reports.filter(r => r.status === 'COMPLETED').length,
    pending: reports.filter(r => r.status === 'PENDING' || r.status === 'PROCESSING').length,
    failed: reports.filter(r => r.status === 'FAILED').length,
  };

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      await deleteReport.mutateAsync(reportId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Medical Reports</h1>
        </div>
        <LoadingSpinner 
          message="Loading Reports..." 
          description="Please wait while we fetch your medical reports."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Medical Reports</h1>
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">Error loading reports. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medical Reports</h1>
          <p className="text-muted-foreground">Access and manage your health records securely</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setUploadDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Upload Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Completed</p>
                <p className="text-2xl font-bold text-green-900">{summaryData.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{summaryData.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Failed</p>
                <p className="text-2xl font-bold text-red-900">{summaryData.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Select>
          <SelectTrigger className="w-full md:w-48">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full md:w-48">
            <Clock className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <EmptyState
            title="No Reports Yet"
            description="Upload your first medical report to get started with AI-powered health insights."
            action={{
              label: "Upload Report",
              onClick: () => setUploadDialogOpen(true)
            }}
          />
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{report.title}</h3>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{new Date(report.date).toLocaleDateString()}</span>
                      {report.doctor && <span>Dr. {report.doctor}</span>}
                      {report.facility && <span>{report.facility}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <NavLink to={`/reports/${report.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </NavLink>
                    {report.file_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={report.file_url} download>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteReport(report.id)}
                      disabled={deleteReport.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>


      {/* Upload Report Dialog */}
      <UploadReportDialog 
        open={uploadDialogOpen} 
        onOpenChange={setUploadDialogOpen} 
      />
    </div>
  );
}