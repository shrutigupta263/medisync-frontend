import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const steps = [
  { id: 1, title: 'Upload', icon: Upload, description: 'Upload your report file' },
  { id: 2, title: 'Parse', icon: FileText, description: 'AI parsing and data extraction' },
  { id: 3, title: 'Review', icon: CheckCircle, description: 'Review and confirm details' },
];

export default function ReportStepper() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    doctor: '',
    facility: '',
    notes: '',
    file: null as File | null,
  });

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
    if (file) {
      setFormData({ ...formData, file });
      // Auto-populate some fields based on filename
      setFormData(prev => ({
        ...prev,
        file,
        title: file.name.replace('.pdf', '').replace(/[-_]/g, ' '),
        date: new Date().toISOString().split('T')[0],
      }));
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
                Select a PDF, image, or document file containing your medical report
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Report File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {formData.file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {formData.file.name}
                  </p>
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