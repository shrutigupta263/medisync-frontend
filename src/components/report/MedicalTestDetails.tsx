/**
 * Medical Test Details component with search and grouping
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Flag, AlertTriangle, CheckCircle } from 'lucide-react';
import { TestParameter, ParameterGroup } from '@/types/report-analysis';
import { 
  groupParameters, 
  filterParameterGroups, 
  getStatusBadgeStyle, 
  formatReferenceRange 
} from '@/lib/report-analysis-utils';

interface MedicalTestDetailsProps {
  parameters: TestParameter[];
}

export function MedicalTestDetails({ parameters }: MedicalTestDetailsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'abnormal' | 'all'>('abnormal');

  // Memoized data processing
  const { allGroups, abnormalGroups, filteredGroups } = useMemo(() => {
    const allGroups = groupParameters(parameters);
    const abnormalGroups = groupParameters(parameters.filter(p => p.status !== 'NORMAL'));
    const filteredGroups = filterParameterGroups(
      activeTab === 'abnormal' ? abnormalGroups : allGroups,
      searchQuery
    );

    return { allGroups, abnormalGroups, filteredGroups };
  }, [parameters, activeTab, searchQuery]);

  const renderParameterGroup = (group: ParameterGroup) => (
    <div key={group.name} className="space-y-3">
      {/* Group Header */}
      <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
        <Flag className="h-5 w-5 text-red-600" />
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-red-800">{group.name} Issues</h3>
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
            {group.count}
          </Badge>
        </div>
      </div>

      {/* Parameters Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Parameter</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Value</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {group.parameters.map((param) => (
              <tr key={param.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{param.name}</div>
                  {param.refRange && (
                    <div className="text-xs text-gray-500 mt-1">
                      {formatReferenceRange(param.refRange)}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">
                    {param.value} {param.unit && <span className="text-gray-500">{param.unit}</span>}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge 
                    variant="outline" 
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeStyle(param.status)}`}
                  >
                    {param.status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  {param.recommendation && (
                    <div className="text-sm text-gray-700 max-w-xs">
                      {param.recommendation}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTabContent = (groups: ParameterGroup[], emptyMessage: string, emptyIcon: React.ReactNode) => (
    <div className="space-y-6">
      {groups.length > 0 ? (
        groups.map(renderParameterGroup)
      ) : (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            {emptyIcon}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <CheckCircle className="h-6 w-6 text-blue-600" />
          Medical Test Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search flags, parameters, values, or recommendations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'abnormal' | 'all')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="abnormal" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Abnormal Parameters
              <Badge variant="secondary" className="ml-1">
                {abnormalGroups.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Test Parameters
              <Badge variant="secondary" className="ml-1">
                {allGroups.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="abnormal" className="mt-6">
            {renderTabContent(
              filteredGroups,
              searchQuery 
                ? `No abnormal parameters match "${searchQuery}"` 
                : "No abnormal parameters found",
              <AlertTriangle className="h-12 w-12 text-gray-400" />
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            {renderTabContent(
              filteredGroups,
              searchQuery 
                ? `No parameters match "${searchQuery}"` 
                : "No parameters available",
              <CheckCircle className="h-12 w-12 text-gray-400" />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default MedicalTestDetails;
