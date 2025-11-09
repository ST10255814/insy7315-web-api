#!/bin/bash

# SonarQube Analysis Pipeline Script
# RentWise Property Management System

echo "🚀 Starting SonarQube Analysis Pipeline..."
echo "========================================"

# Check if we're in the right directory
if [ ! -f "sonar-project.properties" ]; then
    echo "❌ Error: sonar-project.properties not found. Please run from project root."
    exit 1
fi

# Backend Tests and Coverage
echo "📊 Running Backend Tests with Coverage..."
cd backend
if npm run test:coverage; then
    echo "✅ Backend tests completed successfully"
else
    echo "⚠️  Backend tests had issues, continuing with analysis..."
fi
cd ..

# Frontend Tests and Coverage (if available)
echo "📊 Running Frontend Tests with Coverage..."
cd frontend
if npm run test:coverage 2>/dev/null; then
    echo "✅ Frontend tests completed successfully"
else
    echo "ℹ️  Frontend tests not available or failed, continuing..."
fi
cd ..

# Run ESLint for additional code quality metrics
echo "🔍 Running ESLint Analysis..."
cd backend
if npx eslint src/ --format json --output-file eslint-report.json 2>/dev/null; then
    echo "✅ ESLint analysis completed"
else
    echo "ℹ️  ESLint analysis skipped"
fi
cd ..

# SonarQube Analysis
echo "🔎 Running SonarQube Analysis..."
if sonar-scanner; then
    echo ""
    echo "✅ SonarQube Analysis Completed!"
    echo "📊 View results at: https://sonarcloud.io/dashboard?id=insy7315-web-api"
else
    echo "❌ SonarQube analysis failed"
    exit 1
fi

echo ""
echo "🎉 Analysis Pipeline Complete!"
echo "==============================="
echo "Next Steps:"
echo "1. Review the SonarCloud dashboard"
echo "2. Address any quality gate failures"
echo "3. Check coverage reports in backend/coverage/"
echo "4. Fix security vulnerabilities if any"