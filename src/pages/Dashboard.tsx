import React from 'react';
import { Plus, FileText, Heart, Activity, Bell, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavLink } from 'react-router-dom';

const recentReports = [
  { id: '1', title: 'Blood Test Results', date: '2024-01-15', type: 'Lab Report', status: 'Normal' },
  { id: '2', title: 'Chest X-Ray', date: '2024-01-10', type: 'Imaging', status: 'Reviewed' },
  { id: '3', title: 'Annual Checkup', date: '2024-01-05', type: 'Physical', status: 'Complete' },
];

const vitalsData = [
  { label: 'Blood Pressure', value: '120/80', status: 'normal', trend: 'stable' },
  { label: 'Heart Rate', value: '72 bpm', status: 'normal', trend: 'stable' },
  { label: 'Weight', value: '165 lbs', status: 'normal', trend: 'down' },
  { label: 'Temperature', value: '98.6°F', status: 'normal', trend: 'stable' },
];

const upcomingAppointments = [
  { id: '1', title: 'Dr. Smith - Annual Physical', date: '2024-01-25', time: '10:00 AM' },
  { id: '2', title: 'Dr. Johnson - Cardiology', date: '2024-02-01', time: '2:30 PM' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Health Dashboard</h1>
          <p className="text-muted-foreground">Overview of your health data and recent activity</p>
        </div>
        <NavLink to="/reports/upload">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Report
          </Button>
        </NavLink>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Family Members</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Managed profiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">92</div>
            <p className="text-xs text-muted-foreground">Excellent condition</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">2</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Your latest medical reports and tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <NavLink to={`/reports/${report.id}`} className="font-medium hover:text-primary">
                      {report.title}
                    </NavLink>
                    <div className="text-sm text-muted-foreground">
                      {report.type} • {report.date}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-success border-success">
                    {report.status}
                  </Badge>
                </div>
              ))}
              <NavLink to="/reports">
                <Button variant="outline" className="w-full">
                  View All Reports
                </Button>
              </NavLink>
            </div>
          </CardContent>
        </Card>

        {/* Current Vitals */}
        <Card>
          <CardHeader>
            <CardTitle>Current Vitals</CardTitle>
            <CardDescription>Your latest vital signs and measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vitalsData.map((vital, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{vital.label}</div>
                    <div className="text-2xl font-bold">{vital.value}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-success border-success">
                      {vital.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {vital.trend}
                    </div>
                  </div>
                </div>
              ))}
              <NavLink to="/vitals">
                <Button variant="outline" className="w-full">
                  View Trends
                </Button>
              </NavLink>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Appointments
          </CardTitle>
          <CardDescription>Your scheduled medical appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{appointment.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {appointment.date} at {appointment.time}
                  </div>
                </div>
                <Button variant="outline">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}