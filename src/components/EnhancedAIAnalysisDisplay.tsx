/**
 * Enhanced AI Analysis Display Component
 * Displays comprehensive medical report analysis with safety measures
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  User, 
  Stethoscope, 
  Heart,
  Shield,
  Clock,
  Brain,
  Lightbulb,
  Users,
  Target,
  FileText
} from 'lucide-react';
import { ReportAnalysisResponse } from '@/types/report-analysis';

interface EnhancedAIAnalysisDisplayProps {
  analysis: ReportAnalysisResponse;
}

export function EnhancedAIAnalysisDisplay({ analysis }: EnhancedAIAnalysisDisplayProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NORMAL': return 'text-green-600 bg-green-50';
      case 'HIGH': return 'text-red-600 bg-red-50';
      case 'LOW': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Header with Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Medical Report Analysis
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Model: {analysis.meta.modelUsed}
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Confidence: {analysis.meta.confidence}%
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {new Date(analysis.meta.timestamp).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              Processed in {analysis.meta.processingTime}ms
            </span>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Medical Disclaimer */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Important Medical Disclaimer:</p>
            <p className="text-sm">{analysis.meta.disclaimer}</p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Overall Assessment</h4>
            <p className="text-blue-800 text-sm">{analysis.summary.overallAssessment}</p>
          </div>
          
          {analysis.summary.highlights && analysis.summary.highlights.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                Key Highlights
              </h4>
              <div className="space-y-2">
                {analysis.summary.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0 mt-2" />
                    <p className="text-sm text-gray-700">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.summary.keyFindings && analysis.summary.keyFindings.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Important Findings</h4>
              <div className="space-y-2">
                {analysis.summary.keyFindings.map((finding, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                    <p className="text-sm text-gray-700">{finding}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Abnormal Findings */}
      {analysis.insights.abnormalFindings && analysis.insights.abnormalFindings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Abnormal Findings
            </CardTitle>
            <CardDescription>Parameters that require attention with specialist recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.insights.abnormalFindings.map((finding, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-lg">{finding.parameter}</h4>
                    <Badge className={getStatusColor(finding.status)}>
                      {finding.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Value:</span>
                      <p className="font-medium">{finding.value} {finding.unit}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reference Range:</span>
                      <p>{finding.refRange}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className="font-medium">{finding.status}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <h5 className="font-medium text-blue-900 mb-1">What this means:</h5>
                    <p className="text-sm text-blue-800">{finding.explanation}</p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-md">
                    <h5 className="font-medium text-purple-900 mb-1 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Specialist Recommendation:
                    </h5>
                    <p className="text-sm text-purple-800">{finding.specialistSuggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Future Complications */}
      {analysis.insights.futureComplications && analysis.insights.futureComplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-600" />
              Future Risk Assessment
            </CardTitle>
            <CardDescription>Potential complications if conditions remain untreated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.insights.futureComplications.map((complication, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={getRiskLevelColor(complication.riskLevel)}>
                      {complication.riskLevel.toUpperCase()} RISK
                    </Badge>
                    <h4 className="font-medium">{complication.condition}</h4>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{complication.description}</p>
                  
                  {complication.prevention && complication.prevention.length > 0 && (
                    <div className="bg-green-50 p-3 rounded-md">
                      <h5 className="font-medium text-green-900 mb-2">Prevention Strategies:</h5>
                      <div className="space-y-1">
                        {complication.prevention.map((strategy, strategyIndex) => (
                          <div key={strategyIndex} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0 mt-2" />
                            <p className="text-sm text-green-800">{strategy}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Specialist Suggestions */}
      {analysis.insights.specialistSuggestions && analysis.insights.specialistSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Recommended Specialists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.insights.specialistSuggestions.map((specialist, index) => (
                <Badge key={index} variant="outline" className="text-purple-700 border-purple-300">
                  {specialist}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lifestyle Recommendations */}
      {analysis.insights.lifestyleRecommendations && analysis.insights.lifestyleRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-green-600" />
              Lifestyle Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.insights.lifestyleRecommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-4 p-3 bg-green-50 rounded-lg">
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority.toUpperCase()}
                  </Badge>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {rec.category.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-green-800">{rec.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Treatment Approaches */}
      {analysis.insights.treatmentApproaches && analysis.insights.treatmentApproaches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              General Treatment Approaches
            </CardTitle>
            <CardDescription>
              General information about typical treatment approaches - consult your doctor for specific prescriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.insights.treatmentApproaches.map((treatment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{treatment.condition}</h4>
                  <p className="text-sm text-gray-700 mb-3">{treatment.generalApproach}</p>
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {treatment.disclaimer}
                    </AlertDescription>
                  </Alert>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grouped Issues by Category */}
      {analysis.groupedIssues && analysis.groupedIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Parameters by Category</CardTitle>
            <CardDescription>Laboratory parameters organized by medical category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analysis.groupedIssues.map((group, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="font-medium text-lg">{group.category}</h4>
                    <Badge className={getPriorityColor(group.priority)}>
                      {group.priority.toUpperCase()} PRIORITY
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {group.parameters.map((param, paramIndex) => (
                      <div key={paramIndex} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">{param.name}</span>
                          <Badge className={getStatusColor(param.status)} size="sm">
                            {param.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>Value: {param.value} {param.unit}</div>
                          <div>Reference: {param.refRange}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {group.recommendations && group.recommendations.length > 0 && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h5 className="font-medium text-blue-900 mb-2">Recommendations:</h5>
                      <div className="space-y-1">
                        {group.recommendations.map((rec, recIndex) => (
                          <div key={recIndex} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                            <p className="text-sm text-blue-800">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
