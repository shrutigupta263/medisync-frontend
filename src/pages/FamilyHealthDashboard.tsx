import React from 'react';
import { Users, Heart, Activity, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { NavLink } from 'react-router-dom';

interface FamilyMemberHealth {
  id: string;
  name: string;
  relationship: string;
  age: number;
  avatar?: string;
  healthScore: number;
  lastCheckup: string;
  vitals: {
    bloodPressure?: string;
    heartRate?: number;
    weight?: number;
    temperature?: number;
  };
  alerts: {
    type: 'low' | 'medium' | 'high';
    message: string;
  }[];
  upcomingAppointments: number;
  recentReports: number;
}

const familyHealthData: FamilyMemberHealth[] = [
  {
    id: '1',
    name: 'John Doe',
    relationship: 'Self',
    age: 34,
    healthScore: 92,
    lastCheckup: '2024-01-15',
    vitals: {
      bloodPressure: '120/80',
      heartRate: 72,
      weight: 165,
      temperature: 98.6
    },
    alerts: [
      { type: 'medium', message: 'Cholesterol test due next month' }
    ],
    upcomingAppointments: 2,
    recentReports: 3
  },
  {
    id: '2',
    name: 'Jane Doe',
    relationship: 'Spouse',
    age: 32,
    healthScore: 88,
    lastCheckup: '2024-01-10',
    vitals: {
      bloodPressure: '118/75',
      heartRate: 68,
      weight: 125,
      temperature: 98.4
    },
    alerts: [
      { type: 'low', message: 'Annual mammogram scheduled' }
    ],
    upcomingAppointments: 1,
    recentReports: 2
  },
];

export default function FamilyHealthDashboard() {
  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-warning';
    return 'text-destructive';
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'high':
        return 'border-destructive text-destructive bg-destructive/5';
      case 'medium':
        return 'border-warning text-warning bg-warning/5';
      case 'low':
        return 'border-primary text-primary bg-primary/5';
      default:
        return 'border-muted text-muted-foreground bg-muted/5';
    }
  };

  const totalAlerts = familyHealthData.reduce((sum, member) => sum + member.alerts.length, 0);
  const totalAppointments = familyHealthData.reduce((sum, member) => sum + member.upcomingAppointments, 0);
  const averageHealthScore = Math.round(
    familyHealthData.reduce((sum, member) => sum + member.healthScore, 0) / familyHealthData.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Family Health Dashboard</h1>
          <p className="text-muted-foreground">Monitor your family's health status and activities</p>
        </div>
        <div className="flex gap-2">
          <NavLink to="/manage-family">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Profiles
            </Button>
          </NavLink>
        </div>
      </div>

      {/* Family Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Family Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{familyHealthData.length}</div>
            <p className="text-xs text-muted-foreground">Tracked profiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Health Score</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthScoreColor(averageHealthScore)}`}>
              {averageHealthScore}
            </div>
            <p className="text-xs text-muted-foreground">Out of 100</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{totalAlerts}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Family Member Cards */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Family Health Status</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {familyHealthData.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {member.relationship} • {member.age} years old
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getHealthScoreColor(member.healthScore)}`}>
                      {member.healthScore}
                    </div>
                    <p className="text-xs text-muted-foreground">Health Score</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Health Score Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Health</span>
                    <span>{member.healthScore}%</span>
                  </div>
                  <Progress value={member.healthScore} className="h-2" />
                </div>

                {/* Vitals */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {member.vitals.bloodPressure && (
                    <div>
                      <span className="text-muted-foreground">Blood Pressure</span>
                      <div className="font-medium">{member.vitals.bloodPressure}</div>
                    </div>
                  )}
                  {member.vitals.heartRate && (
                    <div>
                      <span className="text-muted-foreground">Heart Rate</span>
                      <div className="font-medium">{member.vitals.heartRate} bpm</div>
                    </div>
                  )}
                  {member.vitals.weight && (
                    <div>
                      <span className="text-muted-foreground">Weight</span>
                      <div className="font-medium">{member.vitals.weight} lbs</div>
                    </div>
                  )}
                  {member.vitals.temperature && (
                    <div>
                      <span className="text-muted-foreground">Temperature</span>
                      <div className="font-medium">{member.vitals.temperature}°F</div>
                    </div>
                  )}
                </div>

                {/* Alerts */}
                {member.alerts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Health Alerts</h4>
                    {member.alerts.map((alert, index) => (
                      <Badge key={index} variant="outline" className={getAlertColor(alert.type)}>
                        {alert.message}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Quick Stats */}
                <div className="flex justify-between text-sm pt-2 border-t">
                  <div>
                    <span className="text-muted-foreground">Last Checkup: </span>
                    <span className="font-medium">{member.lastCheckup}</span>
                  </div>
                  <div className="text-right">
                    <div>
                      <span className="text-muted-foreground">Appointments: </span>
                      <span className="font-medium">{member.upcomingAppointments}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reports: </span>
                      <span className="font-medium">{member.recentReports}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Activity className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Trends
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Family Health Activity</CardTitle>
          <CardDescription>Latest updates across all family members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">John's blood test results received</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="outline" className="text-success border-success">Normal</Badge>
            </div>
            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-warning rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Jane's annual checkup reminder</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <Badge variant="outline" className="text-warning border-warning">Due Soon</Badge>
            </div>
            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Jane's appointment scheduled</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
              <Badge variant="outline" className="text-primary border-primary">Scheduled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}