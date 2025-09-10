import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, ArrowLeft, ArrowRight, Code, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { loadMedicalReportData, extractMedicalReportInfo, type MedicalReportData } from '@/utils/swagger-loader';

const steps = [
  { id: 1, title: 'Upload', icon: Upload, description: 'Upload your report file' },
  { id: 2, title: 'Parse', icon: FileText, description: 'AI parsing and data extraction' },
  { id: 3, title: 'Review', icon: CheckCircle, description: 'Review and confirm details' },
];

export default function ReportStepper() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [medicalReportData, setMedicalReportData] = useState<MedicalReportData | null>(null);
  const [showJsonData, setShowJsonData] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    doctor: '',
    facility: '',
    notes: '',
    file: null as File | null,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load medical report JSON data when component mounts
  useEffect(() => {
    const loadReportData = async () => {
      // Load the medical report response data
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

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the process
      navigate('/reports');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/reports');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Clear any previous error message
    setErrorMessage(null);
    
    if (file) {
      // Check if the file is an image
      if (file.type.startsWith('image/')) {
        setErrorMessage("Wrong content. Please upload a valid report file.");
        return;
      }
      
      // Check if the file is a PDF
      if (file.type === 'application/pdf') {
        // Check if the filename is exactly "Yash-Medical-Report-2024.pdf"
        if (file.name !== "Yash-Medical-Report-2024.pdf") {
          setErrorMessage("Invalid file. Only Yash-Medical-Report-2024.pdf is accepted.");
          return;
        }
        
        // File is valid - proceed with normal flow
        setFormData({ ...formData, file });
        // Auto-populate some fields based on filename
        setFormData(prev => ({
          ...prev,
          file,
          title: file.name.replace('.pdf', '').replace(/[-_]/g, ' '),
          date: new Date().toISOString().split('T')[0],
        }));
      } else {
        setErrorMessage("Wrong content. Please upload a valid report file.");
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Your Report</h3>
              <p className="text-muted-foreground">
                Select a PDF file containing your medical report
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Report File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {formData.file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {formData.file.name}
                  </p>
                )}
                
                {/* Error Message */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-2">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          {errorMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Report Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lab">Lab Report</SelectItem>
                      <SelectItem value="imaging">Imaging</SelectItem>
                      <SelectItem value="physical">Physical Exam</SelectItem>
                      <SelectItem value="specialist">Specialist Report</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Report Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Processing</h3>
              <p className="text-muted-foreground">
                Our AI is analyzing your report and extracting key information
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Parsing document...</span>
                  <Badge variant="outline">In Progress</Badge>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Extracting metadata</span>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Identifying report type</span>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Extracting key values</span>
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-success mb-4" />
              <h3 className="text-lg font-semibold mb-2">Review & Confirm</h3>
              <p className="text-muted-foreground">
                Please review the extracted information and make any necessary corrections
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter report title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="doctor">Doctor</Label>
                  <Input
                    id="doctor"
                    value={formData.doctor}
                    onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                    placeholder="Dr. Name"
                  />
                </div>
                <div>
                  <Label htmlFor="facility">Medical Facility</Label>
                  <Input
                    id="facility"
                    value={formData.facility}
                    onChange={(e) => setFormData({...formData, facility: e.target.value})}
                    placeholder="Hospital/Clinic name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any additional notes or observations..."
                  rows={3}
                />
              </div>

              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">Extracted Data Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Type:</strong> {formData.type || 'Not specified'}</div>
                  <div><strong>Date:</strong> {formData.date || 'Not specified'}</div>
                  <div><strong>File:</strong> {formData.file?.name || 'No file selected'}</div>
                </CardContent>
              </Card>

              {/* Medical Report Data Display */}
              {medicalReportData && (
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <CardTitle className="text-sm text-green-800 dark:text-green-200">
                          Medical Report Analysis
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowJsonData(!showJsonData)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                      >
                        {showJsonData ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Hide Full Report
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            View Full Report
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(() => {
                      const info = extractMedicalReportInfo(medicalReportData);
                      return (
                        <div className="space-y-4">
                          {/* Patient Information */}
                          <div className="text-sm text-green-700 dark:text-green-300">
                            <div><strong>Patient:</strong> {info.patientName}</div>
                            <div><strong>Age:</strong> {info.patientAge}</div>
                            <div><strong>Gender:</strong> {info.patientGender}</div>
                            <div><strong>Patient ID:</strong> {info.patientId}</div>
                          </div>

                          {/* Lab Information */}
                          <div className="text-sm text-green-700 dark:text-green-300 border-t pt-2">
                            <div><strong>Lab:</strong> {info.labName}</div>
                            <div><strong>Report Date:</strong> {new Date(info.reportDate).toLocaleDateString()}</div>
                            <div><strong>Status:</strong> <Badge variant={info.status === 'COMPLETED' ? 'default' : 'secondary'}>{info.status}</Badge></div>
                          </div>

                          {/* Health Score */}
                          <div className="text-sm text-green-700 dark:text-green-300 border-t pt-2">
                            <div className="flex items-center gap-2">
                              <strong>Overall Health Score:</strong> 
                              <Badge variant={info.overallHealthScore >= 80 ? 'default' : info.overallHealthScore >= 60 ? 'secondary' : 'destructive'}>
                                {info.overallHealthScore}/100
                              </Badge>
                            </div>
                            <div><strong>Test Categories:</strong> {info.testCategoriesCount}</div>
                            <div><strong>Summary Points:</strong> {info.summaryCount}</div>
                            <div><strong>Flagged Items:</strong> {info.flagsCount}</div>
                            <div><strong>Abnormal Findings:</strong> {info.abnormalFindingsCount}</div>
                            <div><strong>Recommendations:</strong> {info.recommendationsCount}</div>
                          </div>

                          {/* Key Insights */}
                          {medicalReportData.plainTextInsights?.summary && (
                            <div className="text-sm text-green-700 dark:text-green-300 border-t pt-2">
                              <strong className="block mb-2">Key Insights:</strong>
                              <ul className="list-disc list-inside space-y-1 text-xs">
                                {medicalReportData.plainTextInsights.summary.slice(0, 3).map((insight, index) => (
                                  <li key={index}>{insight}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Health Score Interpretation */}
                          {medicalReportData.healthScore?.interpretation && (
                            <div className="text-sm text-green-700 dark:text-green-300 border-t pt-2">
                              <strong className="block mb-2">Health Assessment:</strong>
                              <p className="text-xs line-clamp-3">
                                {medicalReportData.healthScore.interpretation.substring(0, 200)}...
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    
                    <Collapsible open={showJsonData} onOpenChange={setShowJsonData}>
                      <CollapsibleContent>
                        <div className="mt-4 space-y-4">
                          {/* Complete Summary */}
                          {medicalReportData.summary && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                                Complete Medical Summary ({medicalReportData.summary.length} findings)
                              </h4>
                              <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
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
                            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">
                                ⚠️ Abnormal Findings ({medicalReportData.plainTextInsights.abnormalFindings.length})
                              </h4>
                              <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
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
                            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                                💡 Clinical Recommendations ({medicalReportData.plainTextInsights.recommendations.length})
                              </h4>
                              <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
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
                            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
                                🏥 Follow-up Suggestions ({medicalReportData.plainTextInsights.followUpSuggestions.length})
                              </h4>
                              <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
                                {medicalReportData.plainTextInsights.followUpSuggestions.map((suggestion, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Health Score Categories */}
                          {medicalReportData.healthScore?.categories && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                📊 Health Score by Category
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(medicalReportData.healthScore.categories).map(([category, score]) => (
                                  <div key={category} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                                    <Badge variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}>
                                      {score}/100
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Health Score Interpretation */}
                          {medicalReportData.healthScore?.interpretation && (
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                                🔍 Detailed Health Assessment
                              </h4>
                              <p className="text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
                                {medicalReportData.healthScore.interpretation}
                              </p>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upload Medical Report</h1>
        <p className="text-muted-foreground">Follow the steps to upload and process your medical report</p>
      </div>

      {/* Step Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-3 hidden md:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block mx-4 w-12 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </Button>
        <Button onClick={handleNext} disabled={currentStep === 1 && !formData.file}>
          {currentStep === 3 ? 'Complete' : 'Next'}
          {currentStep < 3 && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}