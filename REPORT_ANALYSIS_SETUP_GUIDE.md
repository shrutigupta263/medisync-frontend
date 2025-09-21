# 📊 Enhanced AI Report Analysis Setup Guide

This guide will help you set up and test the new Enhanced AI Report Analysis feature using Gemini AI.

## 🎯 Feature Overview

The Enhanced AI Report Analysis provides:

- **Detailed Report Analysis**: Highlights abnormal values with explanations
- **Specialist Recommendations**: Suggests which specialists to consult
- **Future Risk Assessment**: Predicts potential complications
- **Lifestyle Recommendations**: Provides preventive lifestyle advice
- **Safe Treatment Guidance**: General treatment approaches with safety disclaimers
- **Safety Guardrails**: Blocks specific dosing and prescription information

## 🛠️ Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install @google/generative-ai
```

### 2. Environment Configuration

Copy the example configuration file:

```bash
cp config.example.env .env
```

Edit the `.env` file and add your Gemini API key:

```env
# AI Configuration
AI_PROVIDER=gemini
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to your `.env` file

### 4. Start the Backend Server

```bash
npm run dev
```

The server should start on `http://localhost:3001`

## 🌐 Frontend Setup

The frontend components are already integrated. Make sure your frontend environment variables are set:

```env
# Frontend .env
VITE_API_BASE_URL=http://localhost:3001/api
```

## 🧪 Testing the Integration

### 1. Health Check

Test if the backend is running:

```bash
curl http://localhost:3001/health
```

### 2. Analysis Status

Check if the analysis service is operational:

```bash
curl http://localhost:3001/api/report-analysis/status
```

### 3. Run Comprehensive Test

Use the provided test script:

```bash
cd backend
node demo/test-enhanced-analysis.js
```

This will:
- Test the health endpoint
- Check analysis service status  
- Perform a complete analysis with sample data
- Save results to `demo/analysis-results.json`

### 4. Manual API Test

You can also test manually with curl:

```bash
curl -X POST http://localhost:3001/api/report-analysis/analyze \
  -H "Content-Type: application/json" \
  -d @demo/demo-request.json
```

## 🎨 Frontend Usage

### 1. View Enhanced Analysis

1. Navigate to any report in the frontend
2. Click the "Enhanced AI Analysis" button
3. Wait for the analysis to complete
4. View the comprehensive results

### 2. Analysis Components

- **EnhancedAIAnalysisDisplay**: New comprehensive analysis display
- **AIAnalysisDisplay**: Legacy analysis display (still supported)

## 📋 API Endpoints

### POST `/api/report-analysis/analyze`

Analyzes a medical report and returns comprehensive insights.

**Request Body:**
```json
{
  "patientInfo": {
    "age": 35,
    "gender": "male",
    "weight": 75,
    "height": 175,
    "medicalHistory": ["Hypertension"],
    "currentMedications": ["Metformin"]
  },
  "reportText": "Medical report content...",
  "parameters": [
    {
      "name": "Glucose",
      "value": 145,
      "unit": "mg/dL",
      "refRange": "70-100",
      "status": "HIGH",
      "group": "Metabolic"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "overallAssessment": "Overall health assessment...",
      "highlights": ["Key finding 1", "Key finding 2"],
      "keyFindings": ["Important observation 1"]
    },
    "insights": {
      "abnormalFindings": [...],
      "futureComplications": [...],
      "specialistSuggestions": [...],
      "lifestyleRecommendations": [...],
      "treatmentApproaches": [...]
    },
    "groupedIssues": [...],
    "meta": {
      "modelUsed": "gemini-1.5-flash",
      "disclaimer": "Medical disclaimer...",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "processingTime": 2500,
      "confidence": 85
    }
  }
}
```

### GET `/api/report-analysis/status`

Returns the status of the analysis service.

## 🔒 Safety Features

### 1. Dosing Pattern Detection

The system automatically detects and redacts:
- Specific dosages (e.g., "500mg", "2 tablets")
- Frequency patterns (e.g., "twice daily", "q8h")
- Duration instructions (e.g., "for 7 days")

### 2. Safety Disclaimers

All responses include comprehensive medical disclaimers emphasizing:
- Consultation with licensed healthcare providers
- No specific prescription information
- Decision-support tool, not prescriber

### 3. Content Validation

- Validates all AI responses for safety compliance
- Logs safety violations for monitoring
- Blocks dangerous or inappropriate content

## 🚨 Troubleshooting

### Common Issues

1. **"Gemini API key is required" Error**
   - Make sure `GEMINI_API_KEY` is set in your `.env` file
   - Verify the API key is valid and active

2. **"Invalid response from AI service" Error**
   - Check your internet connection
   - Verify Gemini API quota and billing
   - Check the backend logs for detailed error information

3. **CORS Errors in Frontend**
   - Ensure `CORS_ORIGIN` in backend `.env` matches your frontend URL
   - Check that both frontend and backend are running

4. **Analysis Takes Too Long**
   - Gemini API can take 5-15 seconds for complex analysis
   - Check network connectivity
   - Verify API key has sufficient quota

### Debug Mode

Enable debug logging in the backend:

```env
NODE_ENV=development
LOG_LEVEL=debug
ENABLE_REQUEST_LOGGING=true
```

## 📈 Performance Optimization

### 1. Caching

Consider implementing caching for:
- Repeated analysis requests
- Parameter extraction results
- AI model responses

### 2. Rate Limiting

The system includes rate limiting:
- 100 requests per 15-minute window (configurable)
- Special rate limiting for analysis endpoint
- Per-IP tracking

### 3. Monitoring

Monitor these metrics:
- Analysis processing time
- API response times
- Error rates
- Safety violation counts

## 🔄 Updates and Maintenance

### 1. Model Updates

To update the AI model:
1. Change the model in `reportAnalysisService.ts`
2. Update the model name in the meta response
3. Test thoroughly with sample data

### 2. Safety Rules Updates

Update safety patterns in `safetyService.ts`:
- Add new dosing patterns
- Update medical disclaimers
- Modify safety thresholds

## 📞 Support

For issues or questions:
1. Check the backend logs for detailed error information
2. Review the test results in `demo/analysis-results.json`
3. Verify all environment variables are correctly set
4. Test with the provided sample data first

## 🎉 Success Checklist

- [ ] Backend server starts without errors
- [ ] Health endpoint returns status "healthy"
- [ ] Analysis status shows "operational"
- [ ] Test script completes successfully
- [ ] Frontend shows "Enhanced AI Analysis" button
- [ ] Analysis completes and displays results
- [ ] Safety disclaimers are visible
- [ ] No specific dosing information in responses

Your Enhanced AI Report Analysis feature is now ready to use! 🚀
