import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';
import { Plus, Search, Filter, FileText, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for reports
const mockReports = [
  { 
    id: '1', 
    title: 'Complete Blood Count (CBC)', 
    date: '2024-01-15', 
    type: 'Lab Report', 
    status: 'Normal',
    doctor: 'Dr. Smith',
    facility: 'Central Medical Lab'
  },
  { 
    id: '2', 
    title: 'Chest X-Ray', 
    date: '2024-01-10', 
    type: 'Imaging', 
    status: 'Reviewed',
    doctor: 'Dr. Johnson',
    facility: 'City Hospital'
  },
  { 
    id: '3', 
    title: 'Lipid Panel', 
    date: '2024-01-05', 
    type: 'Lab Report', 
    status: 'Attention Required',
    doctor: 'Dr. Wilson',
    facility: 'Health Center'
  },
  { 
    id: '4', 
    title: 'Annual Physical Exam', 
    date: '2024-01-01', 
    type: 'Physical', 
    status: 'Complete',
    doctor: 'Dr. Smith',
    facility: 'Family Clinic'
  },
  { 
    id: '5', 
    title: 'Echocardiogram', 
    date: '2023-12-20', 
    type: 'Imaging', 
    status: 'Normal',
    doctor: 'Dr. Brown',
    facility: 'Cardiology Center'
  },
];

// Simulate fetching reports with React Query
const fetchReports = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockReports;
};

export default function Reports() {
  const { data: reports = [], isLoading, error } = useQuery({
    queryKey: ['reports'],
    queryFn: fetchReports,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return 'text-success border-success';
      case 'attention required':
        return 'text-warning border-warning';
      case 'reviewed':
        return 'text-primary border-primary';
      default:
        return 'text-muted-foreground border-muted';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Medical Reports</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
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
          <p className="text-muted-foreground">Manage and view all your medical reports</p>
        </div>
        <NavLink to="/reports/upload">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Report
          </Button>
        </NavLink>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search reports..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="lab">Lab Reports</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="physical">Physical Exams</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="attention">Needs Attention</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <FileText className="h-8 w-8 text-primary" />
                <Badge variant="outline" className={getStatusColor(report.status)}>
                  {report.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">
                <NavLink to={`/reports/${report.id}`} className="hover:text-primary">
                  {report.title}
                </NavLink>
              </CardTitle>
              <CardDescription>{report.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {report.date}
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {report.doctor}
                </div>
                <div className="text-xs">
                  {report.facility}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <NavLink to={`/reports/${report.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </NavLink>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reports.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first medical report to get started
            </p>
            <NavLink to="/reports/upload">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload Report
              </Button>
            </NavLink>
          </CardContent>
        </Card>
      )}
    </div>
  );
}