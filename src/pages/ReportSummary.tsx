import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share, FileText, Activity, User, Calendar, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { loadMedicalReportData, extractMedicalReportInfo, type MedicalReportData } from '@/utils/swagger-loader';

export default function ReportSummary() {
  const navigate = useNavigate();
  const [medicalReportData, setMedicalReportData] = useState<MedicalReportData | null>(null);
  const [testResultsTab, setTestResultsTab] = useState<'all' | 'abnormal'>('all');

  // This component should receive report data as props or from URL params
  // Remove mock data loading - use real report data instead
  useEffect(() => {
    // TODO: Load real report data based on report ID from URL params
    // For now, show message that this feature needs real data
    console.log('ReportSummary: Mock data loading removed - use real report data');
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
      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-900">Patient Report</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {new Date(info.reportDate).toLocaleDateString('en-GB')}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Patient Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Full Name:</span>
                  <p className="text-sm text-gray-900 font-medium">{info.patientName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Age:</span>
                  <p className="text-sm text-gray-900 font-medium">{info.patientAge}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Gender:</span>
                  <p className="text-sm text-gray-900 font-medium">{info.patientGender}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Patient ID:</span>
                  <p className="text-sm text-gray-900 font-medium">{info.patientId}</p>
                </div>
              </div>
            </div>

            {/* Laboratory Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Laboratory Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Laboratory:</span>
                  <p className="text-sm text-gray-900 font-medium">{info.labName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Collection Date & Time:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    <Clock className="h-3 w-3 text-gray-500" />
                    <p className="text-sm text-gray-900 font-medium">
                      {new Date(info.reportDate).toLocaleDateString('en-GB')} 10:11
                    </p>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Location:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <p className="text-sm text-gray-900 font-medium">3950 - Digital Home Collection Pune</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referring Doctor */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Referring Doctor</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Doctor Name:</span>
                  <p className="text-sm text-gray-900 font-medium">Self</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Overview - Horizontal Layout */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Health Overview</CardTitle>
          <CardDescription className="text-blue-700">All Health Categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Small Attractive Graph */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-blue-800">Health Score Distribution</h4>
                <div className="text-xs text-blue-600">Average: 87%</div>
              </div>
              <div className="space-y-3">
                {/* Mini Bar Chart */}
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs text-blue-700">90%+</div>
                  <div className="flex-1 flex gap-1">
                    <div className="h-3 bg-green-400 rounded-sm flex-1"></div>
                    <div className="h-3 bg-green-400 rounded-sm flex-1"></div>
                    <div className="h-3 bg-green-400 rounded-sm flex-1"></div>
                    <div className="h-3 bg-green-400 rounded-sm flex-1"></div>
                    <div className="h-3 bg-green-400 rounded-sm flex-1"></div>
                    <div className="h-3 bg-gray-300 rounded-sm flex-1"></div>
                  </div>
                  <div className="text-xs text-green-600 font-medium">5</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs text-blue-700">80-89%</div>
                  <div className="flex-1 flex gap-1">
                    <div className="h-3 bg-yellow-400 rounded-sm flex-1"></div>
                    <div className="h-3 bg-yellow-400 rounded-sm flex-1"></div>
                    <div className="h-3 bg-yellow-400 rounded-sm flex-1"></div>
                    <div className="h-3 bg-yellow-400 rounded-sm flex-1"></div>
                    <div className="h-3 bg-gray-300 rounded-sm flex-1"></div>
                    <div className="h-3 bg-gray-300 rounded-sm flex-1"></div>
                  </div>
                  <div className="text-xs text-yellow-600 font-medium">4</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs text-blue-700">70-79%</div>
                  <div className="flex-1 flex gap-1">
                    <div className="h-3 bg-gray-300 rounded-sm flex-1"></div>
                    <div className="h-3 bg-gray-300 rounded-sm flex-1"></div>
                    <div className="h-3 bg-gray-300 rounded-sm flex-1"></div>
                    <div className="h-3 bg-gray-300 rounded-sm flex-1"></div>
                    <div className="h-3 bg-gray-300 rounded-sm flex-1"></div>
                    <div className="h-3 bg-gray-300 rounded-sm flex-1"></div>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">0</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-100">
                <div className="flex justify-between text-xs text-blue-600">
                  <span>Excellent (90%+)</span>
                  <span>Good (80-89%)</span>
                  <span>Fair (70-79%)</span>
                </div>
              </div>
            </div>

            {/* Health Categories Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Clinical Biochemistry */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-blue-800 underline decoration-dotted">
                  Clinical Biochemistry
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-6 bg-green-100 border border-green-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-700">90%</span>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>

              {/* Rheumatology */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-blue-800 underline decoration-dotted">
                  Rheumatology
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-6 bg-green-100 border border-green-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-700">90%</span>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>

              {/* Immunoassay */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-blue-800 underline decoration-dotted">
                  Immunoassay
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-6 bg-yellow-100 border border-yellow-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-yellow-700">80%</span>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              {/* Apolipoproteins */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-blue-800 underline decoration-dotted">
                  Apolipoproteins
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-6 bg-green-100 border border-green-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-700">90%</span>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>

              {/* Enzymes */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-blue-800 underline decoration-dotted">
                  Enzymes
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-6 bg-green-100 border border-green-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-700">90%</span>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>

              {/* Liver Function Test */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-blue-800 underline decoration-dotted">
                  Liver Function Test
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-6 bg-yellow-100 border border-yellow-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-yellow-700">80%</span>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              {/* Inflammatory Markers */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-blue-800 underline decoration-dotted">
                  Inflammatory Markers
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-6 bg-green-100 border border-green-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-700">90%</span>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>

              {/* Hematology */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-blue-800 underline decoration-dotted">
                  Hematology
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-6 bg-yellow-100 border border-yellow-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-yellow-700">85%</span>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              {/* Serology */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-blue-800 underline decoration-dotted">
                  Serology
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-6 bg-yellow-100 border border-yellow-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-yellow-700">80%</span>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary and Key Insights - Horizontal Layout */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Summary and Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Complete Medical Summary */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-600 mb-4">Complete Medical Summary (47 findings)</h4>
              <ul className="space-y-2 text-sm text-gray-700 max-h-80 overflow-y-auto">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  HCV IgG Antibody result is non-reactive, indicating no Hepatitis C infection.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Cortisol levels are within the normal range.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Urine analysis shows normal specific gravity, pH, and no abnormal constituents.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Presence of 1-2 White Blood Cells and Squamous Epithelial Cells in urine, within normal limits.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Albumin/Creatinine Ratio indicates microalbuminuria.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Urine Albumin level is significantly elevated.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Urine Creatinine level is within the normal range.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Several tests (Homa-IR, G-6-PD, Allergy Screen, Covid 19 IgG Antibody) are pending.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Immediate clinical correlation is recommended for microalbuminuria.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Further evaluation for insulin resistance, G-6-PD deficiency, allergies, and Covid-19 immunity is pending due to unavailability of samples.
                </li>
              </ul>
            </div>
            
            {/* Abnormal Findings */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h4 className="font-semibold text-red-600 mb-4 flex items-center gap-2">
                <span className="text-yellow-500">⚠️</span>
                Abnormal Findings (11)
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 max-h-80 overflow-y-auto">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Elevated packed cell volume and RBC count may indicate polycythemia, increasing the risk of blood clots.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  High Mean Platelet Volume (MPV) suggests increased platelet production, associated with inflammation or bone marrow disorders.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Slightly elevated Thyroid Stimulating Hormone (TSH) level suggests potential hypothyroidism, affecting metabolism.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Low sodium and chloride levels, coupled with high potassium, indicate electrolyte imbalances affecting heart and muscle function.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Direct bilirubin levels are slightly high, indicating possible liver function abnormalities.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  High LDL cholesterol and low HDL cholesterol levels increase the risk for cardiovascular diseases.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  High Total Cholesterol/HDL Ratio and Non-HDL Cholesterol suggest an increased risk of heart disease.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Elevated homocysteine levels are linked to a higher risk of heart disease, stroke, and vitamin B12 or folate deficiency.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Vitamin D deficiency can lead to bone health issues and is linked to other chronic diseases.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Low Anti HBs Titre indicates non-immunity to Hepatitis B, suggesting a need for vaccination.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Urine Albumin levels are elevated, indicating possible kidney damage or disease.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Detailed Medical Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex bg-blue-50 p-1 rounded-lg w-fit">
              <button 
                onClick={() => setTestResultsTab('all')}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  testResultsTab === 'all' 
                    ? 'bg-white text-blue-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FileText className="h-4 w-4" />
                All Test Parameters
              </button>
              <button 
                onClick={() => setTestResultsTab('abnormal')}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  testResultsTab === 'abnormal' 
                    ? 'bg-white text-blue-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Activity className="h-4 w-4" />
                Abnormal Parameters
              </button>
            </div>

            {/* Tab Content */}
            {testResultsTab === 'all' && (
              <div className="space-y-6">
            {/* Blood Test Results */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Blood Test Results</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Parameter</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Value</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Range</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">White Blood Cell Count</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">7.2 K/μL</td>
                      <td className="py-4 px-6 text-gray-600">4.0-11.0 K/μL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Red Blood Cell Count</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">4.8 M/μL</td>
                      <td className="py-4 px-6 text-gray-600">4.5-5.5 M/μL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Hemoglobin</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">14.2 g/dL</td>
                      <td className="py-4 px-6 text-gray-600">13.5-17.5 g/dL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Hematocrit</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">42.5%</td>
                      <td className="py-4 px-6 text-gray-600">40.0-50.0%</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Platelet Count</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">285 K/μL</td>
                      <td className="py-4 px-6 text-gray-600">150-450 K/μL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-red-50 bg-red-50/30">
                      <td className="py-4 px-6 text-gray-900">Glucose</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">120 mg/dL</td>
                      <td className="py-4 px-6 text-gray-600">70-100 mg/dL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          High
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-red-50 bg-red-50/30">
                      <td className="py-4 px-6 text-gray-900">Cholesterol (Total)</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">220 mg/dL</td>
                      <td className="py-4 px-6 text-gray-600">&lt;200 mg/dL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          High
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-red-50 bg-red-50/30">
                      <td className="py-4 px-6 text-gray-900">LDL Cholesterol</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">140 mg/dL</td>
                      <td className="py-4 px-6 text-gray-600">&lt;100 mg/dL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          High
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">HDL Cholesterol</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">45 mg/dL</td>
                      <td className="py-4 px-6 text-gray-600">&gt;40 mg/dL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-red-50 bg-red-50/30">
                      <td className="py-4 px-6 text-gray-900">Triglycerides</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">180 mg/dL</td>
                      <td className="py-4 px-6 text-gray-600">&lt;150 mg/dL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          High
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Urine Analysis */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Urine Analysis</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Parameter</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Value</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Range</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">pH</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">6.5</td>
                      <td className="py-4 px-6 text-gray-600">5.0-8.0</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Specific Gravity</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">1.015</td>
                      <td className="py-4 px-6 text-gray-600">1.005-1.030</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Protein</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">Negative</td>
                      <td className="py-4 px-6 text-gray-600">Negative</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Glucose</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">Negative</td>
                      <td className="py-4 px-6 text-gray-600">Negative</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Ketones</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">Negative</td>
                      <td className="py-4 px-6 text-gray-600">Negative</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Blood</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">Negative</td>
                      <td className="py-4 px-6 text-gray-600">Negative</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Nitrites</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">Negative</td>
                      <td className="py-4 px-6 text-gray-600">Negative</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Leukocyte Esterase</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">Negative</td>
                      <td className="py-4 px-6 text-gray-600">Negative</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Liver Function Test */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Liver Function Test</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Parameter</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Value</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Range</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">ALT (Alanine Aminotransferase)</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">25 U/L</td>
                      <td className="py-4 px-6 text-gray-600">7-56 U/L</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">AST (Aspartate Aminotransferase)</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">30 U/L</td>
                      <td className="py-4 px-6 text-gray-600">10-40 U/L</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Alkaline Phosphatase</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">85 U/L</td>
                      <td className="py-4 px-6 text-gray-600">44-147 U/L</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Bilirubin (Total)</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">0.8 mg/dL</td>
                      <td className="py-4 px-6 text-gray-600">0.3-1.2 mg/dL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Albumin</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">4.2 g/dL</td>
                      <td className="py-4 px-6 text-gray-600">3.5-5.0 g/dL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Kidney Function Test */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Kidney Function Test</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Parameter</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Value</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Range</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Creatinine</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">1.0 mg/dL</td>
                      <td className="py-4 px-6 text-gray-600">0.6-1.2 mg/dL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">BUN (Blood Urea Nitrogen)</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">15 mg/dL</td>
                      <td className="py-4 px-6 text-gray-600">7-20 mg/dL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">GFR (Glomerular Filtration Rate)</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">90 mL/min/1.73m²</td>
                      <td className="py-4 px-6 text-gray-600">&gt;90 mL/min/1.73m²</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Thyroid Function Test */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Thyroid Function Test</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Parameter</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Value</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Range</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">TSH (Thyroid Stimulating Hormone)</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">2.5 mIU/L</td>
                      <td className="py-4 px-6 text-gray-600">0.4-4.0 mIU/L</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Free T4</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">1.2 ng/dL</td>
                      <td className="py-4 px-6 text-gray-600">0.8-1.8 ng/dL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Free T3</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">3.2 pg/mL</td>
                      <td className="py-4 px-6 text-gray-600">2.3-4.2 pg/mL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vitamin & Mineral Levels */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Vitamin & Mineral Levels</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Parameter</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Value</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Range</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-red-50 bg-red-50/30">
                      <td className="py-4 px-6 text-gray-900">Vitamin D</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">20 ng/mL</td>
                      <td className="py-4 px-6 text-gray-600">30-100 ng/mL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Low
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Vitamin B12</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">450 pg/mL</td>
                      <td className="py-4 px-6 text-gray-600">200-900 pg/mL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Folate</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">8.5 ng/mL</td>
                      <td className="py-4 px-6 text-gray-600">3.0-17.0 ng/mL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Calcium</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">9.8 mg/dL</td>
                      <td className="py-4 px-6 text-gray-600">8.5-10.5 mg/dL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Magnesium</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">2.1 mg/dL</td>
                      <td className="py-4 px-6 text-gray-600">1.7-2.2 mg/dL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-red-50 bg-red-50/30">
                      <td className="py-4 px-6 text-gray-900">Iron</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">50 μg/dL</td>
                      <td className="py-4 px-6 text-gray-600">60-170 μg/dL</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Low
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Blood Pressure */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Blood Pressure</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Parameter</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Value</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Range</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-red-50 bg-red-50/30">
                      <td className="py-4 px-6 text-gray-900">Systolic</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">130 mmHg</td>
                      <td className="py-4 px-6 text-gray-600">&lt;120 mmHg</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          High
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Diastolic</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">85 mmHg</td>
                      <td className="py-4 px-6 text-gray-600">&lt;80 mmHg</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weight & BMI */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Weight & BMI</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Parameter</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Value</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Range</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Weight</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">75 kg</td>
                      <td className="py-4 px-6 text-gray-600">-</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">Height</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">170 cm</td>
                      <td className="py-4 px-6 text-gray-600">-</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-red-50 bg-red-50/30">
                      <td className="py-4 px-6 text-gray-900">BMI</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">25.8</td>
                      <td className="py-4 px-6 text-gray-600">18.5-24.9</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Overweight
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
              </div>
            )}

            {/* Abnormal Parameters Tab */}
            {testResultsTab === 'abnormal' && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-red-800">Abnormal Parameters Summary</h4>
                  </div>
                  <p className="text-sm text-red-700">
                    Total of <strong>8 abnormal parameters</strong> found. These require attention and follow-up with your healthcare provider for proper management and treatment.
                  </p>
                </div>

                {/* Abnormal Blood Test Results */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Abnormal Blood Test Results</h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Parameter</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Value</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Range</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-red-50 bg-red-50/30">
                          <td className="py-4 px-6 text-gray-900">Glucose</td>
                          <td className="py-4 px-6 font-semibold text-gray-900">120 mg/dL</td>
                          <td className="py-4 px-6 text-gray-600">70-100 mg/dL</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              High
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-red-50 bg-red-50/30">
                          <td className="py-4 px-6 text-gray-900">Cholesterol (Total)</td>
                          <td className="py-4 px-6 font-semibold text-gray-900">220 mg/dL</td>
                          <td className="py-4 px-6 text-gray-600">&lt;200 mg/dL</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              High
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-red-50 bg-red-50/30">
                          <td className="py-4 px-6 text-gray-900">LDL Cholesterol</td>
                          <td className="py-4 px-6 font-semibold text-gray-900">140 mg/dL</td>
                          <td className="py-4 px-6 text-gray-600">&lt;100 mg/dL</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              High
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-red-50 bg-red-50/30">
                          <td className="py-4 px-6 text-gray-900">Triglycerides</td>
                          <td className="py-4 px-6 font-semibold text-gray-900">180 mg/dL</td>
                          <td className="py-4 px-6 text-gray-600">&lt;150 mg/dL</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              High
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Abnormal Vitamin & Mineral Levels */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Abnormal Vitamin & Mineral Levels</h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Parameter</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Value</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Range</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-red-50 bg-red-50/30">
                          <td className="py-4 px-6 text-gray-900">Vitamin D</td>
                          <td className="py-4 px-6 font-semibold text-gray-900">20 ng/mL</td>
                          <td className="py-4 px-6 text-gray-600">30-100 ng/mL</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Low
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-red-50 bg-red-50/30">
                          <td className="py-4 px-6 text-gray-900">Iron</td>
                          <td className="py-4 px-6 font-semibold text-gray-900">50 μg/dL</td>
                          <td className="py-4 px-6 text-gray-600">60-170 μg/dL</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Low
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Abnormal Blood Pressure */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Abnormal Blood Pressure</h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Parameter</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Value</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Range</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-red-50 bg-red-50/30">
                          <td className="py-4 px-6 text-gray-900">Systolic</td>
                          <td className="py-4 px-6 font-semibold text-gray-900">130 mmHg</td>
                          <td className="py-4 px-6 text-gray-600">&lt;120 mmHg</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              High
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Abnormal BMI */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Abnormal BMI</h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Parameter</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Value</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Range</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-red-50 bg-red-50/30">
                          <td className="py-4 px-6 text-gray-900">BMI</td>
                          <td className="py-4 px-6 font-semibold text-gray-900">25.8</td>
                          <td className="py-4 px-6 text-gray-600">18.5-24.9</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Overweight
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
