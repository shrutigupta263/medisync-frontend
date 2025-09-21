/**
 * Smart Insights & Recommendations component with tabs
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Calendar, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { ReportInsights } from '@/types/report-analysis';

interface SmartInsightsProps {
  insights: ReportInsights;
}

export function SmartInsights({ insights }: SmartInsightsProps) {
  const [expanded, setExpanded] = useState({
    abnormalFindings: false,
    followUps: false,
    recommendations: false,
  });

  const toggleExpanded = useCallback((section: keyof typeof expanded) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const renderInsightList = (
    items: { id: string; text: string }[],
    section: keyof typeof expanded,
    icon: React.ReactNode,
    color: string
  ) => {
    const isExpanded = expanded[section];
    const displayItems = isExpanded ? items : items.slice(0, 6);
    const remainingCount = items.length - 6;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium text-gray-900">
              {section === 'abnormalFindings' ? 'Abnormal Findings' : 
               section === 'followUps' ? 'Follow-up Suggestions' : 
               'Recommendations'}
            </span>
            <Badge variant="outline" className="bg-gray-100 text-gray-700">
              {items.length}
            </Badge>
          </div>
          {items.length > 6 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpanded(section)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show All ({remainingCount})
                </>
              )}
            </Button>
          )}
        </div>
        
        <ul className="space-y-2">
          {displayItems.map((item) => (
            <li key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${color}`} />
              <span className="text-sm text-gray-700 leading-relaxed">{item.text}</span>
            </li>
          ))}
        </ul>
        
        {!isExpanded && items.length > 6 && (
          <div className="text-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleExpanded(section)}
              className="text-gray-600 hover:text-gray-900"
            >
              Show All ({remainingCount} more items)
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Lightbulb className="h-6 w-6 text-blue-600" />
          Smart Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="abnormal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="abnormal" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Abnormal Findings
              <Badge variant="secondary" className="ml-1">
                {insights.abnormalFindings.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="followup" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Follow-up Suggestions
              <Badge variant="secondary" className="ml-1">
                {insights.followUps.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Recommendations
              <Badge variant="secondary" className="ml-1">
                {insights.recommendations.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="abnormal" className="mt-6">
            {renderInsightList(
              insights.abnormalFindings,
              'abnormalFindings',
              <AlertTriangle className="h-5 w-5 text-red-600" />,
              'bg-red-500'
            )}
          </TabsContent>
          
          <TabsContent value="followup" className="mt-6">
            {renderInsightList(
              insights.followUps,
              'followUps',
              <Calendar className="h-5 w-5 text-blue-600" />,
              'bg-blue-500'
            )}
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-6">
            {renderInsightList(
              insights.recommendations,
              'recommendations',
              <Lightbulb className="h-5 w-5 text-green-600" />,
              'bg-green-500'
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default SmartInsights;
