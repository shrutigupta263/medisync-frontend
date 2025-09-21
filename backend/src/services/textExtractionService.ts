/**
 * Text extraction service for medical reports
 * Supports PDF, JPEG, PNG files
 */

import fs from 'fs/promises';
import path from 'path';
import { createWorker } from 'tesseract.js';
import sharp from 'sharp';
import { TextExtractionResult } from '../types/medical.js';

export class TextExtractionService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || 'uploads';
  }

  /**
   * Extract text from uploaded file
   */
  async extractText(filePath: string, fileType: string): Promise<TextExtractionResult> {
    try {
      const fileBuffer = await fs.readFile(filePath);
      
      // Normalize file type from mimetype or extension
      const normalizedType = this.normalizeFileType(fileType, filePath);
      
      switch (normalizedType) {
        case 'pdf':
          return await this.extractFromPDF(fileBuffer);
        case 'image':
          return await this.extractFromImage(fileBuffer);
        default:
          throw new Error(`Unsupported file type: ${fileType} (normalized: ${normalizedType})`);
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error('Failed to extract text from file');
    }
  }

  /**
   * Normalize file type from mimetype or file extension
   */
  private normalizeFileType(fileType: string, filePath: string): string {
    const mimeType = fileType.toLowerCase();
    const extension = path.extname(filePath).toLowerCase().slice(1);

    // Check by mimetype first
    if (mimeType.includes('pdf') || mimeType === 'application/pdf') {
      return 'pdf';
    }
    
    if (mimeType.includes('image') || ['image/jpeg', 'image/jpg', 'image/png'].includes(mimeType)) {
      return 'image';
    }

    // Fallback to file extension
    if (extension === 'pdf') {
      return 'pdf';
    }
    
    if (['jpg', 'jpeg', 'png'].includes(extension)) {
      return 'image';
    }

    return 'unknown';
  }

  /**
   * Extract text from PDF file
   */
  private async extractFromPDF(buffer: Buffer): Promise<TextExtractionResult> {
    try {
      // Use dynamic import to avoid module loading issues
      const pdfParse = (await import('pdf-parse')).default;
      const data = await pdfParse(buffer);
      
      return {
        text: data.text,
        confidence: 95, // PDF text extraction is highly accurate
        language: 'en',
        pageCount: data.numpages
      };
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  /**
   * Extract text from image file using OCR
   */
  private async extractFromImage(buffer: Buffer): Promise<TextExtractionResult> {
    try {
      // Optimize image for OCR
      const optimizedBuffer = await this.optimizeImageForOCR(buffer);
      
      // Initialize Tesseract worker
      const worker = await createWorker('eng');
      
      // Set OCR parameters for medical documents
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:;()[]{}"/\\-+=%$#@!?&*^~`|<> \n\t',
        tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
        preserve_interword_spaces: '1'
      });

      // Perform OCR
      const { data } = await worker.recognize(optimizedBuffer);
      
      // Cleanup
      await worker.terminate();

      return {
        text: data.text,
        confidence: Math.round(data.confidence),
        language: 'en',
        pageCount: 1
      };
    } catch (error) {
      console.error('OCR extraction error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Optimize image for better OCR results
   */
  private async optimizeImageForOCR(buffer: Buffer): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize(null, 2000, { // Resize to max height of 2000px
          withoutEnlargement: true,
          fit: 'inside'
        })
        .sharpen() // Enhance text edges
        .normalize() // Improve contrast
        .png() // Convert to PNG for better OCR
        .toBuffer();
    } catch (error) {
      console.error('Image optimization error:', error);
      return buffer; // Return original if optimization fails
    }
  }

  /**
   * Clean and preprocess extracted text
   */
  cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/[^\w\s.,:;()\[\]{}"/\\\-+=%$#@!?&*^~`|<>]/g, ' ') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Validate extracted text quality
   */
  validateTextQuality(text: string): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (text.length < 50) {
      issues.push('Text too short - may not contain enough medical information');
    }

    if (text.length > 50000) {
      issues.push('Text too long - may contain excessive noise');
    }

    // Check for common medical terms
    const medicalTerms = [
      'patient', 'doctor', 'hospital', 'clinic', 'blood', 'pressure',
      'glucose', 'cholesterol', 'hemoglobin', 'platelet', 'white blood cell',
      'red blood cell', 'temperature', 'heart rate', 'pulse', 'weight', 'height'
    ];

    const lowerText = text.toLowerCase();
    const foundTerms = medicalTerms.filter(term => lowerText.includes(term));
    
    if (foundTerms.length < 3) {
      issues.push('Limited medical terminology detected - may not be a medical report');
    }

    // Check for excessive special characters (OCR artifacts)
    const specialCharRatio = (text.match(/[^\w\s]/g) || []).length / text.length;
    if (specialCharRatio > 0.3) {
      issues.push('High ratio of special characters - possible OCR artifacts');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}
