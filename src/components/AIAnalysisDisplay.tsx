/**
 * Component to display AI analysis results
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Activity, AlertTriangle, Pill, Utensils, Home, Calendar, TrendingUp } from 'lucide-react';

interface AIAnalysisResult {
  summary: string[];
  healthMetrics: Array<{
    name: string;
    value: string | number;
    unit: string;
    normalRange: string;
    status: 'normal' | 'high' | 'low' | 'critical';
    category: 'blood' | 'urine' | 'vital' | 'other';
  }>;
  riskFlags: Array<{
    parameter: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }>;
  futureComplications: string[];
  medications: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    indication: string;
    type: 'prescription' | 'otc' | 'supplement';
    note?: string;
  }>;
  dietaryRecommendations: string[];
  homeRemedies: string[];
  followUpRecommendations: string[];
  confidence: number;
  analysisDate: string;
}

interface AIAnalysisDisplayProps {
  analysis: AIAnalysisResult;
}

export function AIAnalysisDisplay({ analysis }: AIAnalysisDisplayProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'high': return 'text-orange-600';
      case 'low': return 'text-blue-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMedicationTypeColor = (type: string) => {
    switch (type) {
      case 'prescription': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'otc': return 'bg-green-100 text-green-800 border-green-200';
      case 'supplement': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            AI Medical Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your medical report • Confidence: {analysis.confidence}% • 
            Analyzed on {new Date(analysis.analysisDate).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Summary */}
      {analysis.summary && analysis.summary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.summary.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Metrics */}
      {analysis.healthMetrics && analysis.healthMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Health Metrics</CardTitle>
            <CardDescription>Key health parameters from your report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.healthMetrics.map((metric, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{metric.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getMetricStatusColor(metric.status)}`}
                    >
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Value:</span>
                      <span className="font-medium">{metric.value} {metric.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Normal Range:</span>
                      <span>{metric.normalRange}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge variant="outline" className="text-xs">
                        {metric.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Flags */}
      {analysis.riskFlags && analysis.riskFlags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Risk Flags
            </CardTitle>
            <CardDescription>Parameters that require attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.riskFlags.map((flag, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getSeverityColor(flag.severity)}>
                      {flag.severity.toUpperCase()}
                    </Badge>
                    <h4 className="font-medium">{flag.parameter}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{flag.description}</p>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-blue-800">Recommendation:</p>
                    <p className="text-sm text-blue-700">{flag.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Future Complications */}
      {analysis.futureComplications && analysis.futureComplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Potential Future Complications</CardTitle>
            <CardDescription>Based on current health metrics and patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.futureComplications.map((complication, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-md">
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                  <p className="text-sm text-orange-800">{complication}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medications */}
      {analysis.medications && analysis.medications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medications & Supplements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.medications.map((med, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="font-medium">{med.name}</h4>
                    <Badge className={getMedicationTypeColor(med.type)}>
                      {med.type}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {med.dosage && (
                      <div>
                        <span className="text-muted-foreground">Dosage:</span>
                        <span className="ml-2 font-medium">{med.dosage}</span>
                      </div>
                    )}
                    {med.frequency && (
                      <div>
                        <span className="text-muted-foreground">Frequency:</span>
                        <span className="ml-2 font-medium">{med.frequency}</span>
                      </div>
                    )}
                    {med.duration && (
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="ml-2 font-medium">{med.duration}</span>
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">Indication:</span>
                      <span className="ml-2">{med.indication}</span>
                    </div>
                    {med.note && (
                      <div className="md:col-span-2">
                        <span className="text-muted-foreground">Note:</span>
                        <span className="ml-2">{med.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dietary Recommendations */}
      {analysis.dietaryRecommendations && analysis.dietaryRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Dietary Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.dietaryRecommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-md">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                  <p className="text-sm text-green-800">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Home Remedies */}
      {analysis.homeRemedies && analysis.homeRemedies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Home Remedies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.homeRemedies.map((remedy, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-md">
                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2" />
                  <p className="text-sm text-purple-800">{remedy}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Follow-up Recommendations */}
      {analysis.followUpRecommendations && analysis.followUpRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Follow-up Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.followUpRecommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-md">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                  <p className="text-sm text-blue-800">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
