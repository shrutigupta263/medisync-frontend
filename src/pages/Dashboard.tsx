import React from 'react';
import { Upload, FileText, Pill, Calendar, Activity, Clock, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';

const reminderTasks = [
  { id: '1', title: 'Take blood pressure medication', time: '8:00 AM', color: 'bg-blue-500' },
  { id: '2', title: 'Record blood glucose level', time: '7:30 PM', color: 'bg-green-500' },
  { id: '3', title: 'Dr. Smith appointment', time: 'May 15', color: 'bg-orange-500' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your health dashboard. Here's your overview.</p>
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
          <NavLink to="/reports/upload">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="mr-2 h-4 w-4" />
              Upload Report
            </Button>
          </NavLink>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 since last month</p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
            <Pill className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">2 need refill</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Next: May 15, 2025</p>
          </CardContent>
        </Card>
        <Card className="border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Activity className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Good</div>
            <p className="text-xs text-muted-foreground">All vitals within range</p>
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
              {reminderTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2">
                  <div className={`w-2 h-2 rounded-full ${task.color}`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{task.title}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{task.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}