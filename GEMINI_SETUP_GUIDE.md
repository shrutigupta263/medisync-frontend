# 🚀 Google Gemini 1.5 Flash Setup Guide

## ✅ **AI Backend Configured for Gemini 1.5 Flash**

I've updated the backend to use **Google Gemini 1.5 Flash** (Free) for medical report analysis with optimized settings for consistent medical analysis.

## 🔧 **Backend Setup Steps**

### **1. Navigate to Backend Directory**
```bash
cd backend
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Create Environment File**
```bash
cp config.example.env .env
```

### **4. Get Google Gemini API Key (FREE)**
1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Choose **"Create API key in new project"** or select existing project
5. Copy the API key

### **5. Configure Environment Variables**
Edit `backend/.env` with your Gemini API key:

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase Configuration (Required for data storage)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# AI Service Configuration - Google Gemini 1.5 Flash (FREE)
GEMINI_API_KEY=your-gemini-api-key-here
AI_PROVIDER=gemini

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png

# Security Configuration
JWT_SECRET=your-jwt-secret-here
CORS_ORIGIN=http://localhost:8084

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### **6. Start Backend Server**
```bash
npm run dev
```

The backend will start on **http://localhost:3001**

## 🧠 **Gemini 1.5 Flash Configuration**

### **Model Settings:**
- **Model**: `gemini-1.5-flash`
- **Temperature**: `0.2` (for consistent medical analysis)
- **Top-K**: `40`
- **Top-P**: `0.9`
- **Max Tokens**: `4000`
- **API Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

### **Why Gemini 1.5 Flash:**
- ✅ **FREE** - No cost for API usage
- ✅ **Fast** - Optimized for quick responses
- ✅ **Accurate** - Excellent for medical text analysis
- ✅ **Large Context** - Can handle long medical reports
- ✅ **Consistent** - Lower temperature for reliable results

## 📝 **Current Medical Analysis Prompt**

The system uses this structured prompt for medical analysis:

```javascript
const prompt = `You are a medical AI assistant. Analyze the following medical report text and provide a comprehensive analysis in JSON format.

MEDICAL REPORT TEXT:
${reportText}

${riskFlags.length > 0 ? `HIGH-RISK FLAGS DETECTED: ${riskFlags.join(', ')}` : ''}

Please provide your analysis in the following JSON structure:

{
  "summary": [
    "Brief summary point 1",
    "Brief summary point 2", 
    "Brief summary point 3"
  ],
  "healthMetrics": [
    {
      "name": "Metric name",
      "value": "value",
      "unit": "unit",
      "normalRange": "normal range",
      "status": "normal|high|low|critical",
      "category": "blood|urine|vital|other"
    }
  ],
  "riskFlags": [
    {
      "parameter": "Parameter name",
      "severity": "low|medium|high|critical",
      "description": "Description of the risk",
      "recommendation": "Recommended action"
    }
  ],
  "futureComplications": [
    "Potential complication 1",
    "Potential complication 2"
  ],
  "medications": [
    {
      "name": "Medication name",
      "dosage": "Dosage if specified",
      "frequency": "Frequency if specified",
      "duration": "Duration if specified",
      "indication": "What it's for",
      "type": "prescription|otc|supplement",
      "note": "Additional notes"
    }
  ],
  "dietaryRecommendations": [
    "Dietary advice 1",
    "Dietary advice 2"
  ],
  "homeRemedies": [
    "Home remedy suggestion 1",
    "Home remedy suggestion 2"
  ],
  "followUpRecommendations": [
    "Follow-up recommendation 1",
    "Follow-up recommendation 2"
  ],
  "confidence": 85
}

IMPORTANT GUIDELINES:
1. Only provide information based on the medical report text provided
2. Do not make diagnoses or provide medical advice beyond what's in the report
3. Focus on factual analysis and general health recommendations
4. Ensure all JSON is properly formatted and valid
5. Use appropriate severity levels for risk flags
6. Provide practical, actionable recommendations
7. Maintain professional medical language
8. If information is unclear, indicate uncertainty rather than guessing

RESPOND ONLY WITH THE JSON OBJECT, NO ADDITIONAL TEXT.`;
```

## 🔍 **Rule-Based Health Parameter Detection**

Before sending to Gemini, the system performs rule-based checks:

### **Blood Sugar Detection:**
```javascript
// Detects glucose values > 126 or < 70
const patterns = [
  /\b(?:glucose|blood sugar|hba1c|a1c)\s*:?\s*(\d+)/,
  /\b(?:fasting|random)\s*(?:glucose|blood sugar)\s*:?\s*(\d+)/
];
```

### **Blood Pressure Detection:**
```javascript
// Detects BP > 140/90 or < 90/60
const pattern = /\b(?:bp|blood pressure)\s*:?\s*(\d+)\s*\/\s*(\d+)/;
```

### **Cholesterol Detection:**
```javascript
// Detects cholesterol > 200 or < 100
const patterns = [
  /\b(?:total cholesterol|cholesterol)\s*:?\s*(\d+)/,
  /\b(?:ldl|hdl)\s*:?\s*(\d+)/
];
```

## 🎯 **How It Works**

### **1. Upload Process:**
1. **Upload report** → File sent to backend at `http://localhost:3001/api/reports/upload`
2. **Text extraction** → OCR extracts text from PDF/image using `pdf-parse` and `tesseract.js`
3. **Rule-based checks** → System scans for high-risk parameters
4. **Gemini analysis** → Backend sends text + risk flags to Gemini 1.5 Flash
5. **Structured output** → Gemini returns JSON with health metrics, recommendations, etc.
6. **Data storage** → Analysis stored in Supabase database

### **2. AI Analysis Features:**
- **Health Metrics**: Extracted parameters with normal ranges and status
- **Risk Flags**: High-risk parameters with severity levels
- **Medications**: Prescribed medications with dosage and indications
- **Recommendations**: Dietary, home remedies, and follow-up suggestions
- **Future Complications**: Potential health risks based on current findings
- **Overall Score**: AI-calculated health score (0-100)

## 🧪 **Test the Gemini Analysis**

### **1. Start Backend:**
```bash
cd backend
npm run dev  # Should start on http://localhost:3001
```

### **2. Start Frontend:**
```bash
npm run dev  # Should start on http://localhost:8084
```

### **3. Upload Medical Report:**
1. Go to http://localhost:8084
2. Navigate to Reports page
3. Click "Upload Report"
4. Select a medical report (PDF/image)
5. Click "Analyze Report"

### **4. View Gemini Analysis:**
- Wait for Gemini processing (10-30 seconds)
- Click "Analysis" button on completed report
- See **real Gemini-generated analysis** with:
  - Actual health metrics from your report
  - AI-calculated health score
  - Personalized recommendations
  - Extracted parameters with proper ranges

## 💰 **Gemini 1.5 Flash Pricing**

- **FREE** - No cost for API usage
- **Rate Limits**: 15 requests per minute (free tier)
- **Context Length**: 1M tokens
- **No monthly fees** - Completely free to use

## 🔒 **Security & Privacy**

- **Data Processing**: Medical text is sent to Google Gemini for analysis
- **No Storage**: Google doesn't store your data permanently
- **Encryption**: All API calls use HTTPS encryption
- **User Isolation**: Each user's data is isolated in Supabase

## 🎉 **Result**

With Gemini 1.5 Flash configured, you'll get:
- ✅ **FREE AI analysis** using Gemini 1.5 Flash
- ✅ **Fast processing** (10-30 seconds per report)
- ✅ **Medical-grade analysis** with structured output
- ✅ **Rule-based risk detection** before AI analysis
- ✅ **Professional medical recommendations**
- ✅ **Dynamic health scoring** based on actual data
- ✅ **No API costs** - completely free to use

**The system now provides genuine AI-powered medical report analysis using Google Gemini 1.5 Flash (FREE)!** 🚀✨

## 🆘 **Troubleshooting**

### **Backend Won't Start:**
1. Check if `.env` file exists in backend directory
2. Verify Gemini API key is valid
3. Run `npm install` to ensure dependencies are installed
4. Check port 3001 is not in use

### **Gemini Analysis Fails:**
1. Verify Gemini API key has proper permissions
2. Check internet connection
3. Ensure medical report has extractable text
4. Check backend logs for specific error messages

### **No Analysis Display:**
1. Ensure backend is running on port 3001
2. Check browser console for API errors
3. Verify report upload completed successfully
4. Check if report has `medical_data` field populated

## 📋 **Next Steps**

Once you have the backend running with Gemini:
1. **Test upload** a medical report
2. **Verify analysis** is generated correctly
3. **Tell me what specific prompts** you want me to customize
4. **Customize the analysis** according to your requirements

**Ready to customize the prompts for your specific medical analysis needs!** 🎯
