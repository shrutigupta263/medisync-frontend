import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share, FileText, Activity, User, Calendar, MapPin, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { loadMedicalReportData, extractMedicalReportInfo, type MedicalReportData } from '@/utils/swagger-loader';

export default function ReportSummary() {
  const navigate = useNavigate();
  const [medicalReportData, setMedicalReportData] = useState<MedicalReportData | null>(null);
  const [showFullData, setShowFullData] = useState(false);

  // Load medical report JSON data when component mounts
  useEffect(() => {
    const loadReportData = async () => {
      const data = await loadMedicalReportData('/medical-report-response.json');
      if (data) {
        setMedicalReportData(data);
        console.log('Medical report data loaded successfully');
      } else {
        console.log('Failed to load medical report data');
      }
    };

    loadReportData();
  }, []);

  if (!medicalReportData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Loading Report...</p>
              <p className="text-muted-foreground">Please wait while we load your medical report.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const info = extractMedicalReportInfo(medicalReportData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
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
            Export
          </Button>
        </div>
      </div>

      {/* Report Title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Report Summary</h1>
        <p className="text-muted-foreground">Detailed analysis of your medical report</p>
      </div>

      {/* Patient Report Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">Patient Report</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-blue-800">Patient Name:</span>
                <span className="ml-2 text-blue-700">{info.patientName}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Age:</span>
                <span className="ml-2 text-blue-700">{info.patientAge}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Gender:</span>
                <span className="ml-2 text-blue-700">{info.patientGender}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Patient ID:</span>
                <span className="ml-2 text-blue-700">{info.patientId}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-blue-800">Lab:</span>
                  <span className="ml-2 text-blue-700">{info.labName}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Report Date:</span>
                  <span className="ml-2 text-blue-700">{new Date(info.reportDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <span className="font-medium text-blue-800">Status:</span>
              <Badge variant={info.status === 'COMPLETED' ? 'default' : 'secondary'} className="ml-2">
                {info.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary and Key Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary and Key Insights */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-900">Summary and Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Key Summary Points:</h4>
                <ul className="space-y-1 text-sm text-yellow-700">
                  {medicalReportData.plainTextInsights?.summary?.slice(0, 5).map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-2 border-t border-yellow-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-yellow-800">Total Tests:</span>
                    <span className="ml-2 text-yellow-700">{info.testCategoriesCount}</span>
                  </div>
                  <div>
                    <span className="font-medium text-yellow-800">Abnormal Findings:</span>
                    <span className="ml-2 text-yellow-700">{info.abnormalFindingsCount}</span>
                  </div>
                  <div>
                    <span className="font-medium text-yellow-800">Recommendations:</span>
                    <span className="ml-2 text-yellow-700">{info.recommendationsCount}</span>
                  </div>
                  <div>
                    <span className="font-medium text-yellow-800">Follow-ups:</span>
                    <span className="ml-2 text-yellow-700">{medicalReportData.plainTextInsights?.followUpSuggestions?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Score Overview */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Health Score Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-700">{info.overallHealthScore}%</div>
                <p className="text-sm text-green-600 mt-1">Overall Health Score</p>
              </div>
              
              {medicalReportData.healthScore?.categories && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-800 text-sm">Health Categories:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(medicalReportData.healthScore.categories).slice(0, 4).map(([category, score]) => (
                      <div key={category} className="flex justify-between items-center p-2 bg-white rounded border border-green-200">
                        <span className="text-xs font-medium text-green-800">{category}</span>
                        <Badge variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'} className="text-xs">
                          {score}/100
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Test Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Detailed Test Results</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullData(!showFullData)}
            >
              {showFullData ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Details
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  View All Details
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Test Results Table */}
          <div className="space-y-4">
            {/* Sample test results based on the image structure */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Parameter</th>
                    <th className="text-left py-2 font-medium">Value</th>
                    <th className="text-left py-2 font-medium">Range</th>
                    <th className="text-left py-2 font-medium">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Packed Cell Volume
                      </div>
                    </td>
                    <td className="py-3 font-medium">48.3%</td>
                    <td className="py-3 text-muted-foreground">36.0-46.0%</td>
                    <td className="py-3 text-muted-foreground">Consider iron-rich diet and consultation</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        MPV Values
                      </div>
                    </td>
                    <td className="py-3 font-medium">11.8 fL</td>
                    <td className="py-3 text-muted-foreground">7.4-10.4 fL</td>
                    <td className="py-3 text-muted-foreground">Consider iron-rich diet and consultation</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Thyroid Issues
                      </div>
                    </td>
                    <td className="py-3 font-medium">5.36</td>
                    <td className="py-3 text-muted-foreground">0.35-4.94</td>
                    <td className="py-3 text-muted-foreground">Recommend monitoring thyroid levels</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Urine Issues
                      </div>
                    </td>
                    <td className="py-3 font-medium">1.7</td>
                    <td className="py-3 text-muted-foreground">Normal</td>
                    <td className="py-3 text-muted-foreground">Consider inspection and consultation</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        RBC/Creatinine Issues
                      </div>
                    </td>
                    <td className="py-3 font-medium">5.29</td>
                    <td className="py-3 text-muted-foreground">4.5-5.5</td>
                    <td className="py-3 text-muted-foreground">Monitor for possible thyroid dysfunction</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Collapsible open={showFullData} onOpenChange={setShowFullData}>
              <CollapsibleContent>
                <div className="mt-6 space-y-6">
                  {/* Complete Summary */}
                  {medicalReportData.summary && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-3">
                        Complete Medical Summary ({medicalReportData.summary.length} findings)
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-700 max-h-60 overflow-y-auto">
                        {medicalReportData.summary.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Abnormal Findings */}
                  {medicalReportData.plainTextInsights?.abnormalFindings && (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-3">
                        ⚠️ Abnormal Findings ({medicalReportData.plainTextInsights.abnormalFindings.length})
                      </h4>
                      <ul className="space-y-1 text-sm text-red-700">
                        {medicalReportData.plainTextInsights.abnormalFindings.map((finding, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {medicalReportData.plainTextInsights?.recommendations && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-3">
                        💡 Clinical Recommendations ({medicalReportData.plainTextInsights.recommendations.length})
                      </h4>
                      <ul className="space-y-1 text-sm text-green-700">
                        {medicalReportData.plainTextInsights.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Follow-up Suggestions */}
                  {medicalReportData.plainTextInsights?.followUpSuggestions && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-3">
                        🏥 Follow-up Suggestions ({medicalReportData.plainTextInsights.followUpSuggestions.length})
                      </h4>
                      <ul className="space-y-1 text-sm text-purple-700">
                        {medicalReportData.plainTextInsights.followUpSuggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Health Score Interpretation */}
                  {medicalReportData.healthScore?.interpretation && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-3">
                        🔍 Detailed Health Assessment
                      </h4>
                      <p className="text-sm text-yellow-700 leading-relaxed">
                        {medicalReportData.healthScore.interpretation}
                      </p>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
