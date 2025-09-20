import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share, Calendar, User, MapPin, FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUserReport } from '@/hooks/use-user-data';
import { extractMedicalReportInfo } from '@/utils/swagger-loader';

// Mock report data
const mockReportData = {
  '1': {
    id: '1',
    title: 'Complete Blood Count (CBC)',
    type: 'Lab Report',
    status: 'Normal',
    date: '2024-01-15',
    doctor: 'Dr. Sarah Smith',
    facility: 'Central Medical Laboratory',
    location: 'Downtown Medical Center',
    results: [
      { parameter: 'White Blood Cells', value: '7.2', unit: 'K/μL', range: '4.0-11.0', status: 'Normal' },
      { parameter: 'Red Blood Cells', value: '4.8', unit: 'M/μL', range: '4.2-5.4', status: 'Normal' },
      { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '12.0-16.0', status: 'Normal' },
      { parameter: 'Hematocrit', value: '42.1', unit: '%', range: '37.0-47.0', status: 'Normal' },
      { parameter: 'Platelets', value: '285', unit: 'K/μL', range: '150-400', status: 'Normal' },
    ],
    notes: 'All values within normal ranges. Continue current health regimen.',
    recommendations: [
      'Maintain balanced diet',
      'Regular exercise routine',
      'Follow-up in 6 months'
    ]
  },
  '2': {
    id: '2',
    title: 'Chest X-Ray',
    type: 'Imaging',
    status: 'Reviewed',
    date: '2024-01-10',
    doctor: 'Dr. Michael Johnson',
    facility: 'City Hospital Radiology',
    location: 'City Hospital, 2nd Floor',
    findings: [
      'Heart size and shape are normal',
      'Lung fields appear clear',
      'No acute abnormalities detected',
      'Bone structures intact'
    ],
    impression: 'Normal chest X-ray. No acute cardiopulmonary abnormalities.',
    notes: 'Study performed for routine screening. No follow-up required unless symptoms develop.',
  }
};

export default function ReportById() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: report, isLoading, error } = useUserReport(id || '');
  
  // Extract medical analysis if available
  const medicalInfo = report?.medical_data ? extractMedicalReportInfo(report.medical_data) : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/reports')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center">
              <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-spin" />
              <p className="text-lg font-medium mb-2">Loading Report...</p>
              <p className="text-muted-foreground">Please wait while we load your report details.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/reports')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Report Not Found</p>
              <p className="text-muted-foreground">The requested report could not be found or you don't have access to it.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return 'text-success border-success bg-success/5';
      case 'attention required':
        return 'text-warning border-warning bg-warning/5';
      case 'reviewed':
        return 'text-primary border-primary bg-primary/5';
      default:
        return 'text-muted-foreground border-muted bg-muted/5';
    }
  };

  const getResultStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return 'text-success';
      case 'high':
        return 'text-warning';
      case 'low':
        return 'text-warning';
      case 'critical':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/reports')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Report Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{report.title}</h1>
                <Badge className={getStatusColor(report.status)}>
                  {report.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">{report.type}</p>
              {medicalInfo && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    <Activity className="mr-1 h-3 w-3" />
                    AI Analysis Available
                  </Badge>
                </div>
              )}
            </div>
            <div className="text-right text-sm text-muted-foreground">
              Report ID: {report.id}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Date</div>
                <div className="text-sm text-muted-foreground">{report.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Doctor</div>
                <div className="text-sm text-muted-foreground">{report.doctor}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Facility</div>
                <div className="text-sm text-muted-foreground">{report.facility}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lab Results (for lab reports) */}
      {report.type === 'Lab Report' && 'results' in report && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Lab Results
            </CardTitle>
            <CardDescription>Detailed test results and reference ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{result.parameter}</div>
                    <div className="text-sm text-muted-foreground">
                      Range: {result.range} {result.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getResultStatus(result.status)}`}>
                      {result.value} {result.unit}
                    </div>
                    <div className={`text-sm ${getResultStatus(result.status)}`}>
                      {result.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Imaging Findings (for imaging reports) */}
      {report.type === 'Imaging' && 'findings' in report && (
        <Card>
          <CardHeader>
            <CardTitle>Findings</CardTitle>
            <CardDescription>Radiological observations and findings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.findings.map((finding, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <p className="text-sm">{finding}</p>
                </div>
              ))}
            </div>
            
            {'impression' in report && (
              <>
                <Separator className="my-4" />
                <div>
                  <h4 className="font-medium mb-2">Impression</h4>
                  <p className="text-sm text-muted-foreground">{report.impression}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clinical Notes</CardTitle>
            <CardDescription>Additional observations and notes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{report.notes}</p>
          </CardContent>
        </Card>

        {'recommendations' in report && (
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Follow-up actions and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {report.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medical Analysis Section */}
        {medicalInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                AI Medical Analysis
              </CardTitle>
              <CardDescription>Comprehensive analysis of your medical report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              {medicalInfo.summary && medicalInfo.summary.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Summary</h4>
                  <div className="space-y-2">
                    {medicalInfo.summary.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                        <p className="text-sm text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Test Results */}
              {medicalInfo.testResults && medicalInfo.testResults.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Test Results</h4>
                  <div className="space-y-3">
                    {medicalInfo.testResults.map((test, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">{test.name}</h5>
                          <Badge 
                            variant={test.status === 'Normal' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {test.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Value: </span>
                            <span className="font-medium">{test.value} {test.unit}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Range: </span>
                            <span>{test.range}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {medicalInfo.recommendations && medicalInfo.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Recommendations</h4>
                  <div className="space-y-2">
                    {medicalInfo.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}