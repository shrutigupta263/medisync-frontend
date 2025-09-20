import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, CheckCircle, X, CloudUpload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateReport } from '@/hooks/use-user-data';
import { useToast } from '@/hooks/use-toast';
import { loadMedicalReportData } from '@/utils/swagger-loader';

interface UploadReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { id: 1, title: 'Upload', description: 'Upload your medical report' },
  { id: 2, title: 'Analyzing', description: 'AI analysis in progress' },
  { id: 3, title: 'Preview', description: 'Review extracted data' },
];

export function UploadReportDialog({ open, onOpenChange }: UploadReportDialogProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const createReport = useCreateReport();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    // Clear any previous error message
    setErrorMessage(null);
    
    if (file) {
      // Check file type - allow PDF and common image formats
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Please upload a PDF, JPEG, or PNG file.");
        return;
      }
      
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setErrorMessage("File size must be less than 10MB.");
        return;
      }
      
      // File is valid - proceed with normal flow
      setSelectedFile(file);
      // Simulate moving to analyzing step
      setTimeout(() => setCurrentStep(2), 500);
      // Simulate analysis completion
      setTimeout(() => setCurrentStep(3), 2500);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setIsDragOver(false);
    setErrorMessage(null);
    onOpenChange(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Drag & Drop Area */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragOver 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-300 hover:border-gray-400"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <CloudUpload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Drag & drop your file here
                  </h3>
                  <p className="text-gray-500 mt-1">
                    or choose from your device
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleBrowseClick}
                  className="mt-4"
                >
                  Browse Files
                </Button>
                <p className="text-sm text-gray-400">
                  Supported formats: PDF, JPEG, PNG (max 10MB)
                </p>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Analyzing your report...
              </h3>
              <p className="text-gray-500 mt-1">
                Our AI is extracting key information from your medical report
              </p>
            </div>
            {selectedFile && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Processing
                  </Badge>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Analysis Complete!
              </h3>
              <p className="text-gray-500 mt-1">
                Your report has been successfully processed and analyzed
              </p>
            </div>
            {selectedFile && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Complete
                  </Badge>
                </div>
              </div>
            )}
            <div className="flex space-x-3 justify-center">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button 
                onClick={async () => {
                  if (!selectedFile || !user) return;
                  
                  setIsUploading(true);
                  try {
                    // Load the Yash medical analysis data
                    let medicalAnalysisData = null;
                    
                    // Check if this is the Yash report and load the analysis
                    if (selectedFile.name.includes('Yash') || selectedFile.name.includes('Medical')) {
                      try {
                        medicalAnalysisData = await loadMedicalReportData('/medical-report-response.json');
                        console.log('Loaded medical analysis data:', medicalAnalysisData);
                      } catch (error) {
                        console.warn('Could not load medical analysis data:', error);
                      }
                    }
                    
                    // Create report record in database
                    const reportData = {
                      title: selectedFile.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                      type: selectedFile.type.includes('pdf') ? 'PDF' : 'Image',
                      date: new Date().toISOString(),
                      file_url: URL.createObjectURL(selectedFile), // In real app, this would be uploaded to storage
                      status: 'COMPLETED' as const,
                      medical_data: medicalAnalysisData, // Include the loaded analysis data
                      doctor: medicalAnalysisData ? 'Dr. Smith' : undefined,
                      facility: medicalAnalysisData ? 'Central Medical Lab' : undefined,
                    };
                    
                    const newReport = await createReport.mutateAsync(reportData);
                    
                    if (newReport) {
                      handleClose();
                      navigate(`/reports/${newReport.id}`);
                    }
                  } catch (error) {
                    toast({
                      title: "Upload Failed",
                      description: "Failed to save your report. Please try again.",
                      variant: "destructive",
                    });
                  } finally {
                    setIsUploading(false);
                  }
                }}
                disabled={isUploading || createReport.isPending}
              >
                {isUploading || createReport.isPending ? (
                  <>Saving...</>
                ) : (
                  <>View Report</>
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Upload Medical Report</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-8 py-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                currentStep >= step.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              )}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              <span className={cn(
                "text-xs mt-1",
                currentStep >= step.id ? "text-blue-600" : "text-gray-400"
              )}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="py-4">
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
