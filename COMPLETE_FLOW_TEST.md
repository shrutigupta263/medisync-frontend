# 🧪 Complete MediWiseHealth Flow Test

## 🎯 **After Adding Database Column**

### **1. Add Database Column**
```sql
ALTER TABLE user_reports 
ADD COLUMN IF NOT EXISTS extracted_text TEXT;
```

### **2. Test Complete Flow**

**Backend Test:**
```bash
# Start backend
cd backend && npm run dev

# Test upload (should work after database fix)
curl -X POST http://localhost:3001/api/reports/upload \
  -F "file=@sample-report.pdf" \
  -F "userId=f7d0486c-b3e7-486d-ae76-ff1f9ce1e0d4"

# Should return: {"message": "Report uploaded and processed successfully"}
```

**Analysis Test:**
```bash
# Test analysis endpoint (already working)
curl -X POST http://localhost:3001/api/report-analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "patientInfo": {"age": 35, "gender": "male"},
    "reportText": "Glucose: 145 mg/dL (Reference: 70-100 mg/dL) HIGH",
    "parameters": [
      {"name": "Glucose", "value": 145, "unit": "mg/dL", "refRange": "70-100", "status": "HIGH", "group": "Metabolic"}
    ]
  }'
```

### **3. Frontend Flow**

1. **Open** `http://localhost:8081` (your frontend)
2. **Go to Reports** page
3. **Upload a file** → Should succeed and show green status
4. **Click on report** → View report details
5. **Click "Enhanced AI Analysis"** → Get comprehensive analysis
6. **View results** → See abnormal findings, specialist suggestions, etc.

## 🎯 **Expected Results**

After the database fix, you should see:

**✅ Upload Success:**
- Green success message
- Report appears in list
- Status shows "COMPLETED"

**✅ Analysis Success:**
- Comprehensive medical analysis
- Abnormal findings with explanations
- Specialist recommendations
- Future risk assessment
- Lifestyle recommendations
- Safety disclaimers

## 🔧 **If Still Having Issues**

**Check Database:**
```sql
-- Verify column exists
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_reports' AND column_name = 'extracted_text';
```

**Check Backend Logs:**
- Look for "Created report" messages
- Check for database errors
- Verify Gemini API calls

**Test Analysis Directly:**
- Use the working `/api/report-analysis/analyze` endpoint
- Verify Gemini AI is responding correctly
