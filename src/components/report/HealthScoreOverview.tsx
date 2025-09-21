/**
 * Health Score Overview component
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { CategoryScore } from '@/types/report-analysis';
import { getCategoryScoreColor } from '@/lib/report-analysis-utils';

interface HealthScoreOverviewProps {
  overallScore: number;
  assessment: string;
  categoryScores: CategoryScore[];
}

export function HealthScoreOverview({ 
  overallScore, 
  assessment, 
  categoryScores 
}: HealthScoreOverviewProps) {
  const getOverallScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-amber-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          Health Score Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className={`text-6xl font-bold ${getOverallScoreColor(overallScore)} mb-2`}>
            {overallScore}%
          </div>
          <p className="text-lg text-muted-foreground mb-4">Overall Health Score</p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl mx-auto">
            {assessment}
          </p>
        </div>

        {/* Category Scores */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
          <div className="flex flex-wrap gap-2">
            {categoryScores.map((category, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`px-3 py-1.5 text-sm border-2 ${getCategoryScoreColor(category.score)} bg-white hover:bg-gray-50`}
              >
                {category.name}: {category.score}%
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default HealthScoreOverview;
