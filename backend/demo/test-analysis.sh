#!/bin/bash

# Test script for Report Analysis API
# Make sure to set your Gemini API key in the backend/.env file

BASE_URL="http://localhost:3001"
API_ENDPOINT="/api/report-analysis/analyze"

echo "🧪 Testing Report Analysis API"
echo "================================"

# Check if server is running
echo "📡 Checking server status..."
if ! curl -s "$BASE_URL/health" > /dev/null; then
    echo "❌ Server is not running on $BASE_URL"
    echo "Please start the backend server first:"
    echo "  cd backend && npm run dev"
    exit 1
fi
echo "✅ Server is running"

# Check analysis service status
echo ""
echo "🔍 Checking analysis service status..."
curl -s "$BASE_URL/api/report-analysis/status" | jq '.'
echo ""

# Test the analysis endpoint
echo "🧠 Testing report analysis..."
echo "Sending demo medical report for analysis..."
echo ""

# Make the API call
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d @demo-request.json \
  "$BASE_URL$API_ENDPOINT")

# Check if response is valid JSON
if echo "$RESPONSE" | jq . > /dev/null 2>&1; then
    echo "✅ Analysis completed successfully!"
    echo ""
    echo "📊 Analysis Results:"
    echo "==================="
    echo "$RESPONSE" | jq '.'
    
    # Extract key information
    echo ""
    echo "🔍 Key Findings:"
    echo "$RESPONSE" | jq -r '.data.summary.highlights[]' | sed 's/^/  • /'
    
    echo ""
    echo "⚠️  Abnormal Values:"
    echo "$RESPONSE" | jq -r '.data.insights.abnormalFindings[] | "  • \(.parameter): \(.value) \(.unit) (\(.status)) - \(.explanation)"'
    
    echo ""
    echo "👨‍⚕️  Specialist Recommendations:"
    echo "$RESPONSE" | jq -r '.data.insights.specialistSuggestions[]' | sed 's/^/  • /'
    
    echo ""
    echo "💊 Treatment Approaches:"
    echo "$RESPONSE" | jq -r '.data.insights.treatmentApproaches[] | "  • \(.condition): \(.generalApproach)"'
    
    echo ""
    echo "🏃 Lifestyle Recommendations:"
    echo "$RESPONSE" | jq -r '.data.insights.lifestyleRecommendations[] | "  • \(.category | ascii_upcase): \(.recommendation)"'
    
    echo ""
    echo "📈 Future Complications:"
    echo "$RESPONSE" | jq -r '.data.insights.futureComplications[] | "  • \(.condition) (\(.riskLevel)): \(.description)"'
    
    echo ""
    echo "📋 Meta Information:"
    echo "$RESPONSE" | jq -r '.data.meta | "  • Model: \(.modelUsed)\n  • Processing Time: \(.processingTime)ms\n  • Confidence: \(.confidence)%\n  • Timestamp: \(.timestamp)"'
    
else
    echo "❌ Analysis failed!"
    echo "Response:"
    echo "$RESPONSE"
fi

echo ""
echo "🏁 Test completed!"
echo ""
echo "💡 Tips:"
echo "  • Make sure your Gemini API key is set in backend/.env"
echo "  • Check the server logs for any errors"
echo "  • The analysis includes safety disclaimers - this is normal"
echo "  • All dosing information is automatically redacted for safety"
