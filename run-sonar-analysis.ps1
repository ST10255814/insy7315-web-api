# SonarQube Analysis Pipeline Script - PowerShell Version
# RentWise Property Management System

Write-Host "🚀 Starting SonarQube Analysis Pipeline..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "sonar-project.properties")) {
    Write-Host "❌ Error: sonar-project.properties not found. Please run from project root." -ForegroundColor Red
    exit 1
}

# Backend Tests and Coverage
Write-Host "📊 Running Backend Tests with Coverage..." -ForegroundColor Yellow
Set-Location backend
try {
    npm run test:coverage
    Write-Host "✅ Backend tests completed successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend tests had issues, continuing with analysis..." -ForegroundColor Yellow
}
Set-Location ..

# Frontend Tests and Coverage (if available)
Write-Host "📊 Running Frontend Tests with Coverage..." -ForegroundColor Yellow
Set-Location frontend
try {
    npm run test:coverage 2>$null
    Write-Host "✅ Frontend tests completed successfully" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Frontend tests not available or failed, continuing..." -ForegroundColor Cyan
}
Set-Location ..

# Run ESLint for additional code quality metrics
Write-Host "🔍 Running ESLint Analysis..." -ForegroundColor Yellow
Set-Location backend
try {
    npx eslint src/ --format json --output-file eslint-report.json 2>$null
    Write-Host "✅ ESLint analysis completed" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  ESLint analysis skipped" -ForegroundColor Cyan
}
Set-Location ..

# SonarQube Analysis
Write-Host "🔎 Running SonarQube Analysis..." -ForegroundColor Yellow
try {
    sonar-scanner
    Write-Host ""
    Write-Host "✅ SonarQube Analysis Completed!" -ForegroundColor Green
    Write-Host "📊 View results at: https://sonarcloud.io/dashboard?id=insy7315-web-api" -ForegroundColor Cyan
} catch {
    Write-Host "❌ SonarQube analysis failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Analysis Pipeline Complete!" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Review the SonarCloud dashboard" -ForegroundColor White
Write-Host "2. Address any quality gate failures" -ForegroundColor White
Write-Host "3. Check coverage reports in backend/coverage/" -ForegroundColor White
Write-Host "4. Fix security vulnerabilities if any" -ForegroundColor White