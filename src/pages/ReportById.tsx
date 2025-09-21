import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share, Calendar, User, MapPin, FileText, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUserReport } from '@/hooks/use-user-data';
import { extractMedicalReportInfo } from '@/utils/swagger-loader';
import { getStatusColor, getResultStatus } from '@/lib/report-utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AIAnalysisDisplay } from '@/components/AIAnalysisDisplay';
import { EnhancedAIAnalysisDisplay } from '@/components/EnhancedAIAnalysisDisplay';
import { apiClient } from '@/lib/api-client';
import { createAnalysisRequest, extractParametersFromText } from '@/lib/report-analysis-utils';
import { ReportAnalysisResponse } from '@/types/report-analysis';

export default function ReportById() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: report, isLoading, error } = useUserReport(id || '');
  
  // State for enhanced AI analysis
  const [enhancedAnalysis, setEnhancedAnalysis] = React.useState<ReportAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisError, setAnalysisError] = React.useState<string | null>(null);
  
  // Extract medical analysis if available (legacy format)
  const medicalInfo = report?.medical_data ? extractMedicalReportInfo(report.medical_data) : null;
  
  // Check if this is new enhanced AI analysis format
  const hasEnhancedAnalysis = enhancedAnalysis || (report?.medical_data && 
    typeof report.medical_data === 'object' && 
    'summary' in report.medical_data &&
    'insights' in report.medical_data &&
    'meta' in report.medical_data);

  // Check if this is legacy AI analysis format
  const hasLegacyAnalysis = report?.medical_data && 
    typeof report.medical_data === 'object' && 
    'summary' in report.medical_data &&
    'healthMetrics' in report.medical_data;

  // Function to perform enhanced AI analysis
  const performEnhancedAnalysis = async () => {
    if (!report?.extracted_text) {
      setAnalysisError('No extracted text available for analysis');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Extract parameters from the report text
      const parameters = extractParametersFromText(report.extracted_text);
      
      // Create analysis request
      const analysisRequest = createAnalysisRequest(
        report.extracted_text,
        {
          // You can add patient info here if available
        },
        parameters
      );

      // Call the API
      const analysis = await apiClient.analyzeReport(analysisRequest);
      setEnhancedAnalysis(analysis);
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalysisError(err instanceof Error ? err.message : 'Failed to analyze report');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Debug logging
  console.log('Report data:', report);
  console.log('Medical data:', report?.medical_data);
  console.log('Has Enhanced Analysis:', hasEnhancedAnalysis);
  console.log('Has Legacy Analysis:', hasLegacyAnalysis);
  console.log('Medical Info:', medicalInfo);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/reports')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </div>
        <LoadingSpinner 
          message="Loading Report..." 
          description="Please wait while we load your report details."
        />
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
          {!hasEnhancedAnalysis && report?.extracted_text && (
            <Button 
              variant="default" 
              onClick={performEnhancedAnalysis}
              disabled={isAnalyzing}
            >
              <Activity className="mr-2 h-4 w-4" />
              {isAnalyzing ? 'Analyzing...' : 'Enhanced AI Analysis'}
            </Button>
          )}
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
              {(hasEnhancedAnalysis || hasLegacyAnalysis || medicalInfo) && (
                <div className="mt-2 flex gap-2">
                  {hasEnhancedAnalysis && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <Activity className="mr-1 h-3 w-3" />
                      Enhanced AI Analysis
                    </Badge>
                  )}
                  {(hasLegacyAnalysis || medicalInfo) && !hasEnhancedAnalysis && (
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      <Activity className="mr-1 h-3 w-3" />
                      AI Analysis Available
                    </Badge>
                  )}
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

        {/* Analysis Error Display */}
        {analysisError && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Analysis Error</p>
                  <p className="text-sm text-red-500">{analysisError}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading Analysis Display */}
        {isAnalyzing && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <LoadingSpinner 
                  message="Analyzing Report..." 
                  description="Please wait while our AI analyzes your medical report."
                />
              </div>
            </CardContent>
          </Card>
        )}

          {/* Enhanced AI Analysis Section */}
          {hasEnhancedAnalysis ? (
            <EnhancedAIAnalysisDisplay analysis={enhancedAnalysis || report.medical_data} />
          ) : hasLegacyAnalysis ? (
            <AIAnalysisDisplay analysis={report.medical_data} />
          ) : medicalInfo ? (
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
          ) : null}
      </div>
    </div>
  );
}