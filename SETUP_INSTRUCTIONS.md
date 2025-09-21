# 🚀 Complete Setup Instructions for MediSync

## 📋 **What You Need to Add to .env File:**

### 1. **Supabase Service Role Key** ⚠️ **REQUIRED**
```env
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

**How to get it:**
1. Go to your Supabase project: https://supabase.com/dashboard/projects
2. Click on your project
3. Go to **Settings** → **API**
4. Copy the **`service_role`** key (NOT the anon key)
5. Replace `your_actual_service_role_key_here` with this key

### 2. **Gemini AI API Key** ⚠️ **REQUIRED FOR AI ANALYSIS**
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**How to get it:**
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Replace `your_actual_gemini_api_key_here` with this key

### 3. **Remove Skip Database Flag**
Remove or comment out this line:
```env
# SKIP_DATABASE_INIT=true
```

## 🗄️ **Database Setup (Required for File Uploads):**

You'll also need to set up the database tables in Supabase:

### **Create the `user_reports` table:**

1. Go to your Supabase dashboard
2. Click on **SQL Editor**
3. Run this SQL command:

```sql
-- Create user_reports table
CREATE TABLE user_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    date TEXT NOT NULL,
    doctor TEXT,
    facility TEXT,
    notes TEXT,
    file_url TEXT,
    extracted_text TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    medical_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster queries
CREATE INDEX idx_user_reports_user_id ON user_reports(user_id);

-- Create an index on status for faster filtering
CREATE INDEX idx_user_reports_status ON user_reports(status);
```

## 🔐 **Security Setup:**

### **Row Level Security (RLS):**
```sql
-- Enable RLS
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only access their own reports
CREATE POLICY "Users can only access their own reports" ON user_reports
    FOR ALL USING (user_id = auth.uid()::text);
```

## 🧪 **Testing Your Setup:**

### **1. Update your .env file with real values**
### **2. Restart the backend server:**
```bash
cd backend
npm run dev
```

### **3. Test the endpoints:**
```bash
# Health check
curl http://localhost:3001/health

# Analysis service status
curl http://localhost:3001/api/report-analysis/status

# Test file upload (if you have a PDF file)
curl -X POST http://localhost:3001/api/reports/upload \
  -F "file=@your-report.pdf" \
  -F "userId=test-user-123"
```

## ✅ **Complete .env File Template:**

```env
# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# AI Configuration
AI_PROVIDER=gemini
GEMINI_API_KEY=your_actual_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
SUPABASE_URL=https://zbllidpggaldgylvwezh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibGxpZHBnZ2FsZGd5bHZ3ZXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODcwMDUsImV4cCI6MjA3Mzk2MzAwNX0.Gb7I-7buDx8zIJRkXZEuiQp3xuFagPHwYMBgKB0WvPc
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here

# Safety Configuration
ENABLE_SAFETY_CHECKS=true
LOG_SAFETY_VIOLATIONS=true

# Logging
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true
```

## 🎯 **Next Steps:**

1. **Get Supabase Service Role Key** → Add to .env
2. **Get Gemini API Key** → Add to .env  
3. **Create database table** → Run SQL in Supabase
4. **Restart backend server**
5. **Test file upload and analysis**

## 🆘 **Need Help?**

If you get stuck:
1. Check the backend logs for error messages
2. Verify your API keys are valid
3. Make sure the database table exists
4. Test with the provided curl commands

Your project will have full functionality once these steps are complete! 🚀
