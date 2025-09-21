/**
 * Summary & Key Highlights cards component
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { ReportHighlights } from '@/types/report-analysis';

interface SummaryCardsProps {
  highlights: ReportHighlights;
  onViewFullSummary?: () => void;
}

export function SummaryCards({ highlights, onViewFullSummary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Areas Needing Attention */}
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-amber-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Areas Needing Attention
            </CardTitle>
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              {highlights.needsAttention.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {highlights.needsAttention.slice(0, 6).map((item) => (
              <li key={item.id} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-amber-800">{item.text}</span>
              </li>
            ))}
            {highlights.needsAttention.length > 6 && (
              <li className="text-xs text-amber-600 font-medium">
                +{highlights.needsAttention.length - 6} more items
              </li>
            )}
          </ul>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 border-amber-300 text-amber-700 hover:bg-amber-100"
            onClick={onViewFullSummary}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Full Summary
          </Button>
        </CardContent>
      </Card>

      {/* Good Findings */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Good Findings
            </CardTitle>
            <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">
              {highlights.goodFindings.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {highlights.goodFindings.slice(0, 6).map((item) => (
              <li key={item.id} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-emerald-800">{item.text}</span>
              </li>
            ))}
            {highlights.goodFindings.length > 6 && (
              <li className="text-xs text-emerald-600 font-medium">
                +{highlights.goodFindings.length - 6} more items
              </li>
            )}
          </ul>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            onClick={onViewFullSummary}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Full Summary
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default SummaryCards;
